from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List, TYPE_CHECKING
from src.models.study_session_file_link import StudySessionFileLink

if TYPE_CHECKING:
    from src.models.study_session import StudySession

class File(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)

    name: str
    path: Optional[str] = None 

    study_sessions: List["StudySession"] = Relationship(back_populates="files", link_model=StudySessionFileLink)

class FileRead(SQLModel):
    id: int
    name: str
    path: Optional[str]

    class Config:
        orm_mode = True