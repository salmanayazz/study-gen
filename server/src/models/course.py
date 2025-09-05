from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List, TYPE_CHECKING
from pydantic import BaseModel

if TYPE_CHECKING:
    from src.models.file import File, FileRead
    from src.models.study_plan import StudyPlan

class Course(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str

    files: List["File"] = Relationship(back_populates="course", cascade_delete=True)
    study_plans: List["StudyPlan"] = Relationship(back_populates="course", cascade_delete=True)

class CourseRead(BaseModel):
    id: int
    name: str
    files: List["FileRead"] = []
    study_plans: List["StudyPlan"] = []

    class Config:
        orm_mode = True

class CourseCreate(BaseModel):
    name: str

    class Config:
        orm_mode = True
