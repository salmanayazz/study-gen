from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List, TYPE_CHECKING
from pydantic import BaseModel
from src.models.study_session import StudySessionRead
from datetime import datetime

if TYPE_CHECKING:
    from src.models.study_session import StudySession

class StudyPlan(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    date: datetime

    study_sessions: List["StudySession"] = Relationship(back_populates="study_plan", cascade_delete=True)

class StudyPlanRead(BaseModel):
    id: int
    date: datetime
    study_sessions: List["StudySessionRead"]

    class Config:
        orm_mode = True

class StudyPlanCreate(BaseModel):
    date: datetime
    time_allocated: List[int] = []
    files: List[int] = []

    class Config:
        orm_mode = True
    

StudyPlanRead.model_rebuild()