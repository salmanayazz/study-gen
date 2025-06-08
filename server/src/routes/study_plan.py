from fastapi import APIRouter, BackgroundTasks, Depends, status, HTTPException
from sqlmodel import Session, select
from sqlalchemy.orm import selectinload
from src.db import get_session
from src.models.study_plan import StudyPlan, StudyPlanRead, StudyPlanCreate
from src.models.study_question import UserAnswerUpdate
from src.services.study_plan import create_study_plan_questions, create_study_plan_sessions, validate_study_question_answer
from typing import List

router = APIRouter()

@router.get("/study-plan", response_model=List[StudyPlanRead])
def get_study_plan(session: Session = Depends(get_session)):
    study_plans = session.exec(select(StudyPlan).order_by(StudyPlan.id).options(selectinload(StudyPlan.study_sessions))).all()

    return study_plans

@router.post("/study-plan", status_code=status.HTTP_201_CREATED)
def create_study_plan(study_plan_create: StudyPlanCreate, background_tasks: BackgroundTasks, session: Session = Depends(get_session)):
    study_plan = StudyPlan(
        date=study_plan_create.date,
    )
    session.add(study_plan)
    session.commit()
    session.refresh(study_plan)

    create_study_plan_sessions(study_plan_create, study_plan.id, session)
    background_tasks.add_task(create_study_plan_questions, study_plan.id, session)
    
    return {"study_plan_id": study_plan.id}

@router.delete("/study-plan/{study_plan_id}")
def delete_study_plan(study_plan_id: int, session: Session = Depends(get_session)):
    study_plan = session.get(StudyPlan, study_plan_id)

    if not study_plan:
        raise HTTPException(status_code=404, detail="Study plan not found")

    session.delete(study_plan)
    session.commit()

    return {"message": "Study plan deleted successfully"}

@router.put("/study-plan/{study_plan_id}/study-session/{study_session_id}/study-question/{study_question_id}/user-answer")
def update_study_question_answer(study_plan_id: int, study_session_id: int, study_question_id: int, user_answer_update: UserAnswerUpdate, session: Session = Depends(get_session)):
    statement = select(StudyPlan).where(StudyPlan.id == study_plan_id).options(selectinload(StudyPlan.study_sessions))
    study_plan = session.exec(statement).first()

    if not study_plan:
        raise HTTPException(status_code=404, detail="Study plan not found")
    
    study_session = next((session for session in study_plan.study_sessions if session.id == study_session_id), None)

    if not study_session:
        raise HTTPException(status_code=404, detail="Study session not found")
    
    study_question = next((question for question in study_session.study_questions if question.id == study_question_id), None)

    if not study_question:
        raise HTTPException(status_code=404, detail="Study question not found")
    
    correct = False
    if study_question.options == None or len(study_question.options) == 0:
        correct = validate_study_question_answer(study_question.question, study_question.answer, user_answer_update.user_answer)
    else:
        correct = study_question.answer == user_answer_update.user_answer

    study_question.user_answer = user_answer_update.user_answer
    study_question.correct = correct
    session.add(study_question)
    session.commit()
    
    return {"correct": correct}