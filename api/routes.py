from fastapi import FastAPI
from user.controller import router as user_router
from auth.controller import router as auth_router

def register_routes(app: FastAPI):
    app.include_router(user_router)
    app.include_router(auth_router)