# Student Management System Using Microservices Architecture

## Project Overview

The Student Management System is a full-stack web application developed using a microservices architecture. It allows users to register, log in, manage student records, manage courses, and enroll students in courses.

The application uses separate backend services for authentication, student management, and course management. An API Gateway provides a single entry point for the frontend to communicate with the backend services.

## Technologies Used

- Frontend: React.js, Vite, CSS
- Backend: Python, FastAPI
- Database: MySQL
- ORM: SQLAlchemy
- Authentication: JWT (JSON Web Token)
- API Testing: Postman
- Version Control: Git and GitHub

## System Architecture

The application consists of five main components:

1. Frontend Service: Provides the user interface for login, registration, students, courses, and enrollments.
2. Authentication Service: Handles user registration, login, password hashing, JWT generation, and current-user verification.
3. Student Service: Provides CRUD operations for student records.
4. Course Service: Manages courses and student enrollments.
5. API Gateway: Routes frontend API requests to the appropriate backend microservice.

## Project Structure


student_management_system/
├── auth-service/
├── student-service/
├── course-service/
├── api-gateway/
├── frontend/
├── README.md
└── .gitignore


Each backend service has its own configuration and dependencies. The frontend is maintained separately in the `frontend` directory.

## Database Design

The project uses three MySQL databases:

- `student_management_auth_db` — stores user account information.
- `student_management_student_db` — stores student records.
- `student_management_course_db` — stores courses and enrollments.

### Users

Stores registered user information, including username, full name, email, and hashed password.

### Students

Stores student information, including name, email, phone number, and department.

### Courses

Stores course information, including course code, course name, and description.

### Enrollments

Associates students with courses using student IDs and course IDs.

## 6. Main Features

### Authentication
- User registration
- User login
- JWT-based authentication
- Protected API endpoints
- Current-user verification

### Student Management
- Create student records
- View all students
- View a student by ID
- Update student details
- Delete student records

### Course Management
- Create courses
- View all courses
- View a course by ID
- Update course details
- Delete courses

### Enrollment Management
- Enroll students in courses
- View all enrollments
- Filter enrollments by student ID
- Filter enrollments by course ID
- Delete enrollments

## 7. Backend Ports

| Component | Port |
|---|---:|
| API Gateway | 8000 |
| Authentication Service | 8001 |
| Student Service | 8002 |
| Course Service | 8003 |
| React Frontend | 5173 |

## Installation and Setup

### Prerequisites

Install the following software:

- Python
- Node.js and npm
- MySQL Server
- Git
- Postman

### Configure MySQL

Create the three databases listed in the Database Design section.

Configure each service's database connection settings using your local MySQL credentials. Do not commit passwords, secret keys, or other credentials to GitHub.

### Run the Authentication Service

Open a terminal:


cd "D:\Radhika\Stackly Tasks\student_management_system\auth-service"
.\venv\Scripts\Activate.ps1
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8001

### Run the Student Service

Open a separate terminal:


cd "D:\Radhika\Stackly Tasks\student_management_system\student-service"
.\venv\Scripts\Activate.ps1
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8002


### Run the Course Service

Open a separate terminal:

cd "D:\Radhika\Stackly Tasks\student_management_system\course-service"
.\venv\Scripts\Activate.ps1
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8003

### Run the API Gateway
Open a separate terminal:

cd "D:\Radhika\Stackly Tasks\student_management_system\api-gateway"
.\venv\Scripts\Activate.ps1
python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000

### Run the React Frontend

Open another terminal:

cd "D:\Radhika\Stackly Tasks\student_management_system\frontend"
npm install
npm run dev

Open `http://localhost:5173/` in your browser.

**Note:** These commands assume the virtual environments are named `venv` and the service entry points match your current project files. If your folder or entry-point names differ, adjust the commands accordingly.

## API Documentation

After starting the services, open the interactive FastAPI documentation:

- API Gateway: http://127.0.0.1:8000/docs
- Authentication Service: http://127.0.0.1:8001/docs
- Student Service: http://127.0.0.1:8002/docs
- Course Service: http://127.0.0.1:8003/docs

## Main API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/auth/register` | Register a user |
| POST | `/auth/login` | Log in |
| GET | `/auth/me` | Get current user |
| POST | `/students/` | Create a student |
| GET | `/students/` | List students |
| GET | `/students/{student_id}` | Get a student |
| PUT | `/students/{student_id}` | Update a student |
| DELETE | `/students/{student_id}` | Delete a student |
| POST | `/courses/` | Create a course |
| GET | `/courses/` | List courses |
| GET | `/courses/{course_id}` | Get a course |
| PUT | `/courses/{course_id}` | Update a course |
| DELETE | `/courses/{course_id}` | Delete a course |
| POST | `/enrollments/` | Create an enrollment |
| GET | `/enrollments/` | List or filter enrollments |
| DELETE | `/enrollments/{enrollment_id}` | Delete an enrollment |

Protected endpoints require a valid JWT access token in the Authorization header:

```text
Authorization: Bearer <access_token>
```
##  API Testing
The APIs were tested manually using Postman through the API Gateway.
Testing covered:

- User registration and login
- Current-user verification
- Student CRUD operations
- Course CRUD operations
- Enrollment creation, listing, filtering, and deletion
- JWT authorization for protected endpoints

Successful responses included `200 OK`, `201 Created`, and `204 No Content`, depending on the operation.

## Author

Developed as a Student Management System project using Python, FastAPI, React, MySQL, and microservices architecture.

## Application Screenshots

### Login Page
### Student Management
### Course Management
### Enrollment Management
### Postman API Testing

