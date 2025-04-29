from fastapi import APIRouter, UploadFile
import os
from main import ask_question

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
def study_plan(question: str):
    return ask_question(question)
