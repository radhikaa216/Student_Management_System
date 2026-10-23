
from sqlalchemy import Column, DateTime, Integer, String, func

from .database import Base


class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, nullable=False, index=True)
    phone = Column(String(20), nullable=True)
    department = Column(String(100), nullable=False)

    created_at = Column(
        DateTime,
        server_default=func.current_timestamp(),
        nullable=True,
    )
    updated_at = Column(
        DateTime,
        server_default=func.current_timestamp(),
        onupdate=func.current_timestamp(),
        nullable=True,
    )
