from fastapi import APIRouter, Depends, UploadFile, Form, File as FastAPIFile, status, HTTPException
import os
from src.db import get_session
from sqlmodel import Session, select
import src.models.file as file_model
from typing import Optional

router = APIRouter()

folder_path = "pdfs/"

@router.get("/course/{course_id}/file")
async def get_files(course_id: int, session: Session = Depends(get_session)):
    print("Getting files for course_id:", course_id)
    return session.exec(select(file_model.File).where(file_model.File.course_id == course_id)).all()

@router.post("/course/{course_id}/file", status_code=status.HTTP_201_CREATED)
async def upload(
    course_id: int, 
    name: str = Form(...), 
    path: Optional[str] = Form(None), 
    file_data: UploadFile = FastAPIFile(...), 
    session: Session = Depends(get_session)
):
    base_folder = os.path.abspath(folder_path +  "/" + str(course_id))
    full_path = os.path.abspath(os.path.join(base_folder, path, name))

    if not full_path.startswith(base_folder):
        raise HTTPException(status_code=400, detail="Invalid path")

    statement = select(file_model.File).where((file_model.File.path == path) & (file_model.File.name == name))
    file = session.exec(statement).first()
    
    if file:
        raise HTTPException(status_code=400, detail="File already exists")

    os.makedirs(folder_path + path, exist_ok=True)  
    file_path = os.path.join(folder_path + path, name)
    with open(file_path, "wb") as f:
        content = await file_data.read()
        f.write(content)

    file = file_model.File(
        name=name,
        path=path,
        course_id=course_id
    )
    session.add(file)
    session.commit()

    return {"message": "Successfully uploaded file"}

@router.delete("/course/{course_id}/file/{file_id}")
async def delete_file(file_id: int, session: Session = Depends(get_session)):
    statement = select(file_model.File).where(file_model.File.id == file_id)
    file = session.exec(statement).first()

    if not file:
        raise HTTPException(status_code=400, detail="File does not exists")
    
    try: 
        os.remove(folder_path + file.path + file.name)
    except:
        pass

    session.delete(file)
    session.commit()

    return {"message": "Successfully deleted file"}