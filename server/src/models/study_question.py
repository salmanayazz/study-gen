from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, TYPE_CHECKING, List
from pydantic import BaseModel
from sqlalchemy import Column
from sqlalchemy.dialects.postgresql import JSONB

if TYPE_CHECKING:
    from models.study_session import StudySession

class StudyQuestion(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    pdf_name: str
    page_number: int
    question: str
    answer: Optional[str] = None
    options: List[str] = Field(sa_column=Column(JSONB))
    user_answer: Optional[str] = None
    correct: Optional[bool] = None

    study_session_id: Optional[int] = Field(default=None, foreign_key="studysession.id")
    study_session: Optional["StudySession"] = Relationship(back_populates="study_questions")

class StudyQuestionRead(BaseModel):
    id: int
    pdf_name: str
    page_number: int
    question: str
    answer: Optional[str] = None
    options: Optional[List[str]] = []
    user_answer: Optional[str] = None
    correct: Optional[bool] = None

    class Config:
        orm_mode = True

class UserAnswerUpdate(BaseModel):
    user_answer: str

    class Config:
        orm_mode = True