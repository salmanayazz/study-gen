from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, TYPE_CHECKING, List
from pydantic import BaseModel
from sqlalchemy import Column
from sqlalchemy.dialects.postgresql import JSONB

if TYPE_CHECKING:
    from models.study_plan import StudyPlan

class StudyQuestion(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    pdf_name: str
    page_number: int
    question: str
    answer: Optional[str] = None
    options: List[str] = Field(sa_column=Column(JSONB))

    study_plan_id: Optional[int] = Field(default=None, foreign_key="studyplan.id")
    study_plan: Optional["StudyPlan"] = Relationship(back_populates="study_questions")

class StudyQuestionRead(BaseModel):
    id: int
    pdf_name: str
    page_number: int
    question: str
    answer: Optional[str] = None
    options: Optional[List[str]] = []

    class Config:
        orm_mode = True