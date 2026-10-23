
from fastapi import FastAPI

from .routers import students

app = FastAPI(
    title="Student Management Service",
    description="CRUD APIs for managing student records",
    version="1.0.0",
)

app.include_router(students.router)


@app.get("/", tags=["Health"])
def health_check():
    return {
        "service": "Student Management Service",
        "status": "running",
    }
