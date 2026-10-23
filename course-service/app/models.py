
from sqlalchemy import (
    Column,
    DateTime,
    ForeignKey,
    Integer,
    String,
    Text,
    UniqueConstraint,
    func,
)

from .database import Base


class Course(Base):
    __tablename__ = "courses"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    course_code = Column(String(30), unique=True, nullable=False, index=True)
    course_name = Column(String(150), nullable=False)
    description = Column(Text, nullable=True)

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


class Enrollment(Base):
    __tablename__ = "enrollments"

    __table_args__ = (
        UniqueConstraint(
            "student_id",
            "course_id",
            name="uq_enrollment_student_course",
        ),
    )

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    student_id = Column(Integer, nullable=False, index=True)
    course_id = Column(
        Integer,
        ForeignKey("courses.id", ondelete="RESTRICT"),
        nullable=False,
        index=True,
    )
    enrolled_at = Column(
        DateTime,
        server_default=func.current_timestamp(),
        nullable=True,
    )
