from fastapi import APIRouter, UploadFile
import os
import services

router = APIRouter()

@router.post("/pdf")
async def upload(file: UploadFile):
    os.makedirs("pdfs", exist_ok=True)
    file_path = os.path.join("pdfs", file.filename)
    with open(file_path, "wb") as f:
        content = await file.read()
        f.write(content)

    return {"filename": file.filename, "filepath": file_path}

@router.post("/question")
def question(question: str):
    return services.ask_question(question)

@router.post("/study-plan")
def study_plan():
    return services.create_study_plan()
