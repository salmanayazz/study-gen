from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from src.models.course import Course, CourseCreate, CourseRead
from src.db import get_session
from sqlalchemy.orm import selectinload
from typing import List

router = APIRouter()

@router.get("/course", response_model=List[CourseRead])
async def get_courses(session: Session = Depends(get_session)):
    print ("Getting all courses")
    courses = session.exec(
        select(Course)
        .options(
            selectinload(Course.files),
            selectinload(Course.study_plans)
        )
    ).all()
    print(courses)
    return courses

@router.post("/course", status_code=201)
async def create_course(course: CourseCreate, session: Session = Depends(get_session)):
    course = Course(
        name=course.name,
        description=course.description
    )

    session.add(course)
    session.commit()
    return {"message": "Course created successfully"}
    

@router.delete("/course/{course_id}")
async def delete_course(course_id: int, session: Session = Depends(get_session)):
    statement = select(Course).where(Course.id == course_id)
    course = session.exec(statement).first()

    if not course:
        return {"message": "Course not found"}

    session.delete(course)
    session.commit()
    return {"message": "Course deleted successfully"}