from typing import Optional, List, TYPE_CHECKING
from sqlmodel import SQLModel, Field, Relationship
from src.models.study_question import StudyQuestion, StudyQuestionRead
from src.models.study_session_file_link import StudySessionFileLink
from src.models.file import File, FileRead

if TYPE_CHECKING:
    from src.models.study_plan import StudyPlan

class StudySession(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    duration: int
    files: List[int] = Field(default=None, foreign_key="file.id")
    page_start: int
    page_end: int

    study_plan_id: Optional[int] = Field(default=None, foreign_key="studyplan.id")
    study_plan: Optional["StudyPlan"] = Relationship(back_populates="study_sessions")

    study_questions: List["StudyQuestion"] = Relationship(back_populates="study_session", cascade_delete=True)

    files: List["File"] = Relationship(back_populates="study_sessions", link_model=StudySessionFileLink)

class StudySessionRead(SQLModel):
    id: int
    duration: int
    files: List["FileRead"]
    page_start: int
    page_end: int

    study_questions: List["StudyQuestionRead"] = []

    class Config:
        orm_mode = True

StudySessionRead.model_rebuild()