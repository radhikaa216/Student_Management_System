
from fastapi import FastAPI

from .routers import courses, enrollments

app = FastAPI(
    title="Course Management Service",
    description="Course and student enrollment APIs",
    version="1.0.0",
)

app.include_router(courses.router)
app.include_router(enrollments.router)


@app.get("/", tags=["Health"])
def health_check():
    return {
        "service": "Course Management Service",
        "status": "running",
    }
