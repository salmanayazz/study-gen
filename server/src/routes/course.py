from fastapi import APIRouter, Depends
from sqlmodel import Session, select
import src.models.course as course_model
from src.db import get_session

router = APIRouter()

@router.get("/course")
async def get_courses(session: Session = Depends(get_session)):
    return session.exec(select(course_model.Course)).all()

@router.post("/course", status_code=201)
async def create_course(course: course_model.CourseCreate, session: Session = Depends(get_session)):
    db_course = course_model.Course.from_orm(course)
    session.add(db_course)
    session.commit()
    session.refresh(db_course)
    return db_course

@router.delete("/course/{course_id}")
async def delete_course(course_id: int, session: Session = Depends(get_session)):
    statement = select(course_model.Course).where(course_model.Course.id == course_id)
    course = session.exec(statement).first()

    if not course:
        return {"message": "Course not found"}

    session.delete(course)
    session.commit()
    return {"message": "Course deleted successfully"}