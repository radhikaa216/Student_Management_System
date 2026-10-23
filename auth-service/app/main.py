
from fastapi import FastAPI

from . import models
from .database import Base, engine
from .routers import auth

# Importing models registers the User table with SQLAlchemy.
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Student Management System - Authentication Service",
    description="User registration, login, and JWT authentication APIs",
    
)

app.include_router(auth.router)


@app.get("/", tags=["Health"])
def health_check():
    return {"message": "Authentication Service is running"}
