from sqlmodel import create_engine, Session
from dotenv import load_dotenv
import os

load_dotenv()

print("Loading environment variables... " + os.getenv("DATABASE_URL"))

DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_engine(DATABASE_URL, echo=True)

def get_session():
    with Session(engine) as session:
        yield session
