from typing import Optional, List, TYPE_CHECKING
from sqlmodel import SQLModel, Field, Relationship
from src.models.study_question import StudyQuestion, StudyQuestionRead
from sqlalchemy import Column 
from sqlalchemy.dialects.postgresql import JSONB

if TYPE_CHECKING:
    from src.models.study_plan import StudyPlan

class StudySession(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    duration: int
    files: List[str] = Field(sa_column=Column(JSONB))
    page_start: int
    page_end: int

    study_plan_id: Optional[int] = Field(default=None, foreign_key="studyplan.id")
    study_plan: Optional["StudyPlan"] = Relationship(back_populates="study_sessions")

    study_questions: List["StudyQuestion"] = Relationship(back_populates="study_session", cascade_delete=True)

class StudySessionRead(SQLModel):
    id: int
    duration: int
    files: List[str]
    page_start: int
    page_end: int

    study_questions: List["StudyQuestionRead"] = []

    class Config:
        orm_mode = True

StudySessionRead.model_rebuild()