from fastapi import APIRouter, UploadFile
import os
from src.services import services

router = APIRouter()

@router.post("/question")
def question(question: str):
    return services.ask_question(question)
