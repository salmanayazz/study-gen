from fastapi import APIRouter
from src.services import question
from pydantic import BaseModel
from sqlmodel import Session
from fastapi import Depends
from src.db import get_session

router = APIRouter()

class QuestionRequest(BaseModel):
    question: str

class QuestionResponse(BaseModel):
    answer: str


@router.post("/course/{course_id}/question", response_model=QuestionResponse)
def ask_question(course_id: int, body: QuestionRequest, session: Session = Depends(get_session)):
    return question.ask_question(course_id, body.question, session)
