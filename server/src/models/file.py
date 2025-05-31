from sqlmodel import SQLModel, Field
from typing import Optional

class File(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)

    name: str
    path: Optional[str] = None 
