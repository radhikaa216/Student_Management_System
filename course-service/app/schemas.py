
from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class CourseCreate(BaseModel):
    course_code: str = Field(min_length=2, max_length=30)
    course_name: str = Field(min_length=2, max_length=150)
    description: str | None = None


class CourseUpdate(BaseModel):
    course_code: str | None = Field(default=None, min_length=2, max_length=30)
    course_name: str | None = Field(default=None, min_length=2, max_length=150)
    description: str | None = None


class CourseResponse(BaseModel):
    id: int
    course_code: str
    course_name: str
    description: str | None = None
    created_at: datetime | None = None
    updated_at: datetime | None = None

    model_config = ConfigDict(from_attributes=True)


class EnrollmentCreate(BaseModel):
    student_id: int = Field(gt=0)
    course_id: int = Field(gt=0)


class EnrollmentResponse(BaseModel):
    id: int
    student_id: int
    course_id: int
    enrolled_at: datetime | None = None

    model_config = ConfigDict(from_attributes=True)
