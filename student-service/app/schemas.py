
from datetime import datetime
from pydantic import BaseModel, ConfigDict, EmailStr, Field


class StudentCreate(BaseModel):
    name: str = Field(min_length=2, max_length=100)
    email: EmailStr
    phone: str | None = Field(default=None, max_length=20)
    department: str = Field(min_length=2, max_length=100)


class StudentUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=2, max_length=100)
    email: EmailStr | None = None
    phone: str | None = Field(default=None, max_length=20)
    department: str | None = Field(default=None, min_length=2, max_length=100)


class StudentResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    phone: str | None = None
    department: str
    created_at: datetime | None = None
    updated_at: datetime | None = None

    model_config = ConfigDict(from_attributes=True)
