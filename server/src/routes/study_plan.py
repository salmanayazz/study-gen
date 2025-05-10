from fastapi import APIRouter, BackgroundTasks, Depends, status, HTTPException
from sqlmodel import Session, select
from sqlalchemy.orm import selectinload
from src.db import get_session
from src.models.study_plan import StudyPlan, StudyPlanRead, StudyPlanCreate
from src.services.study_plan import create_study_plan_questions, create_study_plan_sessions
from typing import List

router = APIRouter()

@router.get("/study-plan", response_model=List[StudyPlanRead])
def get_study_plan(session: Session = Depends(get_session)):
    study_plans = session.exec(select(StudyPlan).options(selectinload(StudyPlan.study_sessions))).all()

    return study_plans

@router.post("/study-plan", status_code=status.HTTP_201_CREATED)
def create_study_plan(study_plan_create: StudyPlanCreate, background_tasks: BackgroundTasks, session: Session = Depends(get_session)):
    study_plan = StudyPlan(
        date=study_plan_create.date,
    )
    session.add(study_plan)
    session.commit()
    session.refresh(study_plan)

    study_sessions = create_study_plan_sessions(study_plan_create, study_plan.id, session)
    background_tasks.add_task(create_study_plan_questions, study_plan_create, study_sessions, session)
    
    return {"study_plan_id": study_plan.id}

@router.delete("/study-plan/{study_plan_id}")
def delete_study_plan(study_plan_id: int, session: Session = Depends(get_session)):
    study_plan = session.get(StudyPlan, study_plan_id)

    if not study_plan:
        raise HTTPException(status_code=404, detail="Study plan not found")

    session.delete(study_plan)
    session.commit()

    return {"message": "Study plan deleted successfully"}