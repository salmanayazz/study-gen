from datetime import timedelta
import os
import fitz
import json
import re
from ollama import Client
from fastapi import Depends, HTTPException
from sqlmodel import Session, select
from src.db import get_session
from src.models.study_question import StudyQuestion
from src.models.study_plan import StudyPlanCreate
from src.models.study_session import StudySession
from src.models.study_session_file_link import StudySessionFileLink
from src.models.file import File
from typing import List
from sqlalchemy.orm import selectinload

client = Client(host='http://localhost:11434')

question_generation_prompt = """
You are an exam question generator. Given the content of a single textbook or lecture page 
(which may include diagrams, data, and written explanation), generate unique exam-style (GENERATE ONLY ONE QUESTION)
Do not ask questions about related material not covered. Questions should be that which a teacher might ask based on the material.
Each question should include:
    - The question text.
    - The correct answer.
    - Multiple-choice options if the question fits that format.
Return the output as a JSON array using the following structure:

[
    {
        "question": "What is ...?",
        "answer": "Option A",
        "options": ["Option A", "Option B", "Option C", "Option D"]
    },
    {
        "question": "Explain the concept of ...",
        "answer": "The correct explanation."
    }
]

If using the multiple choice format, the answer should be exactly equal to one of the options.

The multiple choice questions should be trivia while the open-ended questions should be more conceptual.
Focus on conceptual clarity and comprehension. Keep each question self-contained and understandable without the full document.
Here is the page content:

"""

def study_question_validation_prompt(question, sample_answer, user_answer):
    return """
    You are an assistant that evaluates student answers.

    You will be given:
    - The original study question
    - A sample answer
    - The user's answer

    Your task is to determine if the user's answer is **substantially correct** based on the sample answer. Minor wording differences or phrasing variations are acceptable as long as the core concepts and information match.

    Respond **only** with one of the following JSON objects:

    {
    "correct": true
    }

    or

    {
    "correct": false
    }

    Do not provide explanations or any other output.

    Now, evaluate the following:

    Question:
    """ + question + """

    Sample Answer:
    """ + sample_answer + """

    User Answer:
    """ + user_answer

def create_study_plan_sessions(study_plan_create: StudyPlanCreate, study_plan_id: int, session: Session = Depends(get_session)):
    time_allocated = study_plan_create.time_allocated
    study_sessions = []
    files = []

    total_pages = 0
    folder_path = "pdfs/"
    for fileId in study_plan_create.files:
        files.append(session.get(File, fileId))
        
        if not files[-1]:
            raise HTTPException(status_code=404, detail="File not found")
    
        full_path = os.path.join(folder_path + files[-1].path, files[-1].name)
        pdf = fitz.open(full_path)
        total_pages += pdf.page_count

    total_time = sum(time_allocated)
    pages_per_minute = total_pages / total_time if total_time > 0 else 0
    pages_per_session = [int(round(pages_per_minute) * time) for time in time_allocated]

    
    current_file_page = 0
    current_file = 0
    for i in range(len(pages_per_session)):
        study_session = StudySession(
            study_plan_id=study_plan_id,
            date=study_plan_create.date + timedelta(days = i - len(pages_per_session) + 1),
            files=[],
            duration=time_allocated[i],
            page_start=max(current_file_page, 1),
            page_end=0
        )

        session.add(study_session)
        session.commit()
        session.refresh(study_session)

        while current_file < len(files) and pages_per_session[i] > 0:
            full_path = os.path.join(folder_path + files[current_file].path, files[current_file].name)
            pdf = fitz.open(full_path)

            link = StudySessionFileLink(study_session_id=study_session.id, file_id=files[current_file].id)
            session.add(link)

            # if we used up all pages in the current file, move to the next file
            if pages_per_session[i] - (pdf.page_count - current_file_page) >= 0:
                pages_per_session[i] -= (pdf.page_count - current_file_page)
                current_file_page = 0
                current_file += 1

                if pages_per_session[i] <= 0 or current_file == len(files):
                    study_session.page_end = pdf.page_count
                    break
            else:
                study_session.page_end = pages_per_session[i] + current_file_page
                current_file_page = pages_per_session[i] + current_file_page + 1
                break

        session.add(study_session)
        session.commit()
        session.refresh(study_session)
        study_sessions.append(study_session)

    return study_sessions

def create_study_plan_questions(study_plan_id: int, session: Session = Depends(get_session)):
    folder_path = "pdfs/"
    questions = []
    temp_dir = "temp_images"
    os.makedirs(temp_dir, exist_ok=True)

    study_sessions = session.exec(
        select(StudySession)
        .where(StudySession.study_plan_id == study_plan_id)
        .options(selectinload(StudySession.files))
    ).all()

    for study_session in study_sessions:
        for file in study_session.files:
            full_path = os.path.join(folder_path + file.path, file.name)

            pdf = fitz.open(full_path)
            print(f"Processing {file.name}...")

            start_page = study_session.page_start - 1 if file == study_session.files[0] else 0
            end_page = study_session.page_end if file == study_session.files[-1] else pdf.page_count

            for page_num in range(start_page, end_page):

                page = pdf.load_page(page_num)
                page_content = page.get_text("text")
                images = page.get_images(full=True)

                print(f"Page {page_num + 1}")

                image_paths = []
                for img_info in images:
                    xref = img_info[0]
                    base_image = page.parent.extract_image(xref)
                    image_bytes = base_image["image"]
                    image_ext = base_image["ext"]
                    image_path = os.path.join(temp_dir, f"page_image_{xref}.{image_ext}")
                    with open(image_path, "wb") as f:
                        f.write(image_bytes)
                    image_paths.append(image_path)

                response = client.chat(
                    model="gemma3:4b-it-qat",
                    messages=[
                        {
                            "role": "user",
                            "content": question_generation_prompt + page_content,
                            "images": image_paths
                        }
                    ]
                )

                for image_path in image_paths:
                    os.remove(image_path)

                image_paths.clear()
                question_set = response['message']['content']

                try:
                    cleaned = re.sub(r'```json|```|```', '', question_set).strip()
                    parsed_questions = json.loads(cleaned)

                    if isinstance(parsed_questions, list):
                        questions.extend(parsed_questions)
                    else:
                        questions.append(parsed_questions)

                except json.JSONDecodeError:
                    print("Failed to parse JSON response. Skipping this page.")
                    continue
                
                id = 0 
                if file.name == study_session.files[-1]:
                    if study_session.page_end >= page_num + 1:
                        id = study_session.id
                else:
                    id = study_session.id

                session.add_all([
                    StudyQuestion(
                        study_session_id = id,
                        pdf_name = file.name,
                        page_number = page_num + 1,
                        question = q.get("question"),
                        answer = q.get("answer"),
                        options = q.get("options") 
                    )
                    for q in questions
                ])
                
                session.add(study_session)
                session.commit()
                questions.clear()
                            
def validate_study_question_answer(question, sample_answer, user_answer) -> bool:
    response = client.chat(
        model="gemma3:12b",
        messages=[
            {
                "role": "user",
                "content": study_question_validation_prompt(question, sample_answer, user_answer),
            }
        ]
    ) 

    result = response['message']['content']
    cleaned = re.sub(r'```json|```|```', '', result).strip()
    parsed_result = json.loads(cleaned)
    return parsed_result.get("correct")


    