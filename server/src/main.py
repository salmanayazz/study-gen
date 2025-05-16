from fastapi import FastAPI
from src.routes import routes, study_plan
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
print("FRONTEND_URL", os.getenv("FRONTEND_URL"))

app.include_router(routes.router)
app.include_router(study_plan.router)