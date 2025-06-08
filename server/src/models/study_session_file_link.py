from typing import Optional, TYPE_CHECKING
from sqlmodel import SQLModel, Field

class StudySessionFileLink(SQLModel, table=True):
    study_session_id: Optional[int] = Field(default=None, foreign_key="studysession.id", primary_key=True)
    file_id: Optional[int] = Field(default=None, foreign_key="file.id", primary_key=True)
