from fastapi import FastAPI
from routes import register_routes
from database.core import engine, Base

# Base.metadata.create_all(bind=engine)

app = FastAPI()

register_routes(app)