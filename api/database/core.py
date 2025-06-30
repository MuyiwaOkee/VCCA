from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session, declarative_base
from typing import Annotated
from fastapi import Depends
from dotenv import load_dotenv
import os

load_dotenv()

# Making database connection
DATABASE_URL = os.getenv('DATABASE_URL')
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

# dependency for injection
DbSession = Annotated[Session, Depends(get_db)]