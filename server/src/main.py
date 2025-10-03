from fastapi import FastAPI
from src.routes import study_plan, file, course, question
from sqlmodel import SQLModel
from contextlib import asynccontextmanager
from src.db import engine
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

load_dotenv()

@asynccontextmanager
async def lifespan(app: FastAPI):
    SQLModel.metadata.create_all(engine)
    yield

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        os.getenv("FRONTEND_URL"),
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(question.router)
app.include_router(course.router)
app.include_router(study_plan.router)
app.include_router(file.router)