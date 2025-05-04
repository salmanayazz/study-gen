import os
import fitz
import json
import re
from ollama import Client
from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from src.db import get_session
from src.models.study_question import StudyQuestion

client = Client(host='http://localhost:11434')

question_generation_prompt = """
You are an exam question generator. Given the content of a single textbook or lecture page 
(which may include diagrams, data, and written explanation), generate unique exam-style (2-3 would be ideal)
questions that a teacher might ask based on the material.
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

def create_study_plan_questions(study_plan_id: int, session: Session = Depends(get_session)):
    folder_path = "pdfs"
    questions = []
    temp_dir = "temp_images"
    os.makedirs(temp_dir, exist_ok=True)

    for filename in os.listdir(folder_path):
        if filename.lower().endswith(".pdf"):
            full_path = os.path.join(folder_path, filename)
            pdf = fitz.open(full_path)
            print(f"Processing {filename}...")

            for page_num in range(len(pdf)):
                page = pdf.load_page(page_num)
                page_content = page.get_text("text")
                images = page.get_images(full=True)

                print(f"Page {page_num + 1} content: {page_content}")

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

                question_set = response['message']['content']
                print(f"\nGenerated Questions:\n{question_set}\n")

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

                session.add_all([
                    StudyQuestion(
                        study_plan_id=study_plan_id,
                        pdf_name=filename,
                        page_number=page_num + 1,
                        question=q.get("question"),
                        answer=q.get("answer"),
                        options=q.get("options") 
                    )
                    for q in questions
                ])
                session.commit()
                questions.clear()
                
    