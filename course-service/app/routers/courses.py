
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Course
from ..schemas import CourseCreate, CourseResponse, CourseUpdate
from ..security import get_current_user

router = APIRouter(
    prefix="/courses",
    tags=["Courses"],
)


@router.post(
    "/",
    response_model=CourseResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_course(
    course_data: CourseCreate,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user),
):
    course_code = course_data.course_code.strip()

    existing = db.query(Course).filter(
        Course.course_code == course_code
    ).first()

    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Course code already exists",
        )

    course = Course(
        course_code=course_code,
        course_name=course_data.course_name.strip(),
        description=course_data.description,
    )

    try:
        db.add(course)
        db.commit()
        db.refresh(course)
        return course
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Course code already exists",
        )


@router.get("/", response_model=list[CourseResponse])
def get_all_courses(
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user),
):
    return db.query(Course).order_by(Course.id).all()


@router.get("/{course_id}", response_model=CourseResponse)
def get_course(
    course_id: int,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user),
):
    course = db.query(Course).filter(Course.id == course_id).first()

    if course is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course not found",
        )

    return course


@router.put("/{course_id}", response_model=CourseResponse)
def update_course(
    course_id: int,
    course_data: CourseUpdate,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user),
):
    course = db.query(Course).filter(Course.id == course_id).first()

    if course is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course not found",
        )

    update_data = course_data.model_dump(exclude_unset=True)

    if not update_data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Provide at least one field to update",
        )

    for field, value in update_data.items():
        if value is None and field != "description":
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=f"{field} cannot be null",
            )

    if "course_code" in update_data:
        update_data["course_code"] = update_data["course_code"].strip()

        duplicate = (
            db.query(Course)
            .filter(
                Course.course_code == update_data["course_code"],
                Course.id != course_id,
            )
            .first()
        )

        if duplicate:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Another course already uses this course code",
            )

    if "course_name" in update_data and update_data["course_name"] is not None:
        update_data["course_name"] = update_data["course_name"].strip()

    for field, value in update_data.items():
        setattr(course, field, value)

    try:
        db.commit()
        db.refresh(course)
        return course
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Course update conflicts with existing data",
        )


@router.delete(
    "/{course_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_course(
    course_id: int,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user),
):
    course = db.query(Course).filter(Course.id == course_id).first()

    if course is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course not found",
        )

    try:
        db.delete(course)
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Cannot delete a course that has enrollments",
        )

    return None
