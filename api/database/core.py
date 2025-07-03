from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session, declarative_base
from typing import Annotated
from fastapi import Depends
from dotenv import load_dotenv
import os

load_dotenv()

# connect to database
DATABASE_URL = os.getenv('DATABASE_URL') # Get connection string from .env
engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(autoflush=False, bind=engine)

Base = declarative_base()

# Creates database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# create dependency injection
DbSession = Annotated[Session, Depends(get_db)]