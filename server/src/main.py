from fastapi import FastAPI
from src.routes import routes, study_plan
from sqlmodel import SQLModel
from contextlib import asynccontextmanager
from src.db import engine

@asynccontextmanager
async def lifespan(app: FastAPI):
    SQLModel.metadata.create_all(engine)
    yield

app = FastAPI(lifespan=lifespan)

app.include_router(routes.router)
app.include_router(study_plan.router)