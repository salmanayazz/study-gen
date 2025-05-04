from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List, TYPE_CHECKING
from pydantic import BaseModel
from src.models.study_question import StudyQuestionRead

if TYPE_CHECKING:
    from src.models.study_question import StudyQuestion

class StudyPlan(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)

    study_questions: List["StudyQuestion"] = Relationship(back_populates="study_plan", cascade_delete=True)

class StudyPlanRead(BaseModel):
    id: int
    study_questions: List["StudyQuestionRead"]

    class Config:
        orm_mode = True

StudyPlanRead.model_rebuild()