
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Course, Enrollment
from ..schemas import EnrollmentCreate, EnrollmentResponse
from ..security import get_current_user

router = APIRouter(
    prefix="/enrollments",
    tags=["Enrollments"],
)


@router.post(
    "/",
    response_model=EnrollmentResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_enrollment(
    enrollment_data: EnrollmentCreate,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user),
):
    course = (
        db.query(Course)
        .filter(Course.id == enrollment_data.course_id)
        .first()
    )

    if course is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course not found",
        )

    existing = (
        db.query(Enrollment)
        .filter(
            Enrollment.student_id == enrollment_data.student_id,
            Enrollment.course_id == enrollment_data.course_id,
        )
        .first()
    )

    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Student is already enrolled in this course",
        )

    enrollment = Enrollment(**enrollment_data.model_dump())

    try:
        db.add(enrollment)
        db.commit()
        db.refresh(enrollment)
        return enrollment
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Enrollment conflicts with existing data",
        )


@router.get("/", response_model=list[EnrollmentResponse])
def get_enrollments(
    student_id: int | None = None,
    course_id: int | None = None,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user),
):
    query = db.query(Enrollment)

    if student_id is not None:
        query = query.filter(Enrollment.student_id == student_id)

    if course_id is not None:
        query = query.filter(Enrollment.course_id == course_id)

    return query.order_by(Enrollment.id).all()


@router.delete(
    "/{enrollment_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_enrollment(
    enrollment_id: int,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user),
):
    enrollment = (
        db.query(Enrollment)
        .filter(Enrollment.id == enrollment_id)
        .first()
    )

    if enrollment is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Enrollment not found",
        )

    db.delete(enrollment)
    db.commit()
    return None
