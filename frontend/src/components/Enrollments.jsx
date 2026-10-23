
import { useEffect, useState } from "react";
import { enrollmentAPI, studentAPI, courseAPI } from "../services/api";
import "./Enrollments.css";

function Enrollments() {
  const [enrollments, setEnrollments] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [studentId, setStudentId] = useState("");
  const [courseId, setCourseId] = useState("");
  const [filterStudent, setFilterStudent] = useState("");
  const [filterCourse, setFilterCourse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function loadEnrollments(student = filterStudent, course = filterCourse) {
    setLoading(true);
    setError("");

    try {
      const data = await enrollmentAPI.getAll(student, course);
      setEnrollments(Array.isArray(data) ? data : data?.enrollments ?? []);
    } catch (err) {
      setError(err.message || "Unable to load enrollments.");
    } finally {
      setLoading(false);
    }
  }

  async function loadOptions() {
    try {
      const [studentData, courseData] = await Promise.all([
        studentAPI.getAll(),
        courseAPI.getAll(),
      ]);

      setStudents(
        Array.isArray(studentData) ? studentData : studentData?.students ?? []
      );
      setCourses(
        Array.isArray(courseData) ? courseData : courseData?.courses ?? []
      );
    } catch (err) {
      setError(err.message || "Unable to load students and courses.");
    }
  }

  useEffect(() => {
    loadOptions();
    loadEnrollments("", "");
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");

    try {
      await enrollmentAPI.create({
        student_id: Number(studentId),
        course_id: Number(courseId),
      });

      setSuccess("Student enrolled successfully.");
      setStudentId("");
      setCourseId("");
      await loadEnrollments();
    } catch (err) {
      setError(err.message || "Unable to create enrollment.");
    }
  }

  async function handleFilter(event) {
    event.preventDefault();
    setFilterStudent(filterStudent);
    setFilterCourse(filterCourse);
    await loadEnrollments(filterStudent, filterCourse);
  }

  async function handleDelete(enrollmentId) {
    if (!window.confirm("Are you sure you want to delete this enrollment?")) {
      return;
    }

    setError("");
    setSuccess("");

    try {
      await enrollmentAPI.delete(enrollmentId);
      setSuccess("Enrollment deleted successfully.");
      await loadEnrollments();
    } catch (err) {
      setError(err.message || "Unable to delete enrollment.");
    }
  }

  function clearFilters() {
    setFilterStudent("");
    setFilterCourse("");
    loadEnrollments("", "");
  }

  return (
    <section className="enrollments-page">
      <div className="enrollments-heading">
        <div>
          <h2>Enrollment Management</h2>
          <p>Enroll students in courses and manage enrollment records.</p>
        </div>

        <button type="button" onClick={() => loadEnrollments()}>
          Refresh
        </button>
      </div>

      {error && <div className="enrollment-message error">{error}</div>}
      {success && <div className="enrollment-message success">{success}</div>}

      <form className="enrollment-form" onSubmit={handleSubmit}>
        <h3>Enroll a Student</h3>

        <div className="enrollment-form-grid">
          <label>
            Student
            <select
              value={studentId}
              onChange={(event) => setStudentId(event.target.value)}
              required
            >
              <option value="">Select a student</option>
              {students.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.name} (ID: {student.id})
                </option>
              ))}
            </select>
          </label>

          <label>
            Course
            <select
              value={courseId}
              onChange={(event) => setCourseId(event.target.value)}
              required
            >
              <option value="">Select a course</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.course_code} - {course.course_name}
                </option>
              ))}
            </select>
          </label>
        </div>

        <button type="submit">Enroll Student</button>
      </form>

      <form className="enrollment-filters" onSubmit={handleFilter}>
        <h3>Filter Enrollments</h3>

        <div className="enrollment-form-grid">
          <label>
            Student
            <select
              value={filterStudent}
              onChange={(event) => setFilterStudent(event.target.value)}
            >
              <option value="">All students</option>
              {students.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.name} (ID: {student.id})
                </option>
              ))}
            </select>
          </label>

          <label>
            Course
            <select
              value={filterCourse}
              onChange={(event) => setFilterCourse(event.target.value)}
            >
              <option value="">All courses</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.course_code} - {course.course_name}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="enrollment-filter-actions">
          <button type="submit">Apply Filters</button>
          <button type="button" className="clear-filter" onClick={clearFilters}>
            Clear Filters
          </button>
        </div>
      </form>

      <div className="enrollment-table-card">
        <h3>Enrollment Records</h3>

        {loading ? (
          <p>Loading enrollments...</p>
        ) : enrollments.length === 0 ? (
          <p>No enrollments found.</p>
        ) : (
          <div className="enrollment-table-wrapper">
            <table className="enrollment-table">
              <thead>
                <tr>
                  <th>Enrollment ID</th>
                  <th>Student ID</th>
                  <th>Course ID</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {enrollments.map((enrollment) => (
                  <tr key={enrollment.id}>
                    <td>{enrollment.id}</td>
                    <td>{enrollment.student_id}</td>
                    <td>{enrollment.course_id}</td>
                    <td>
                      <button
                        type="button"
                        className="delete-enrollment"
                        onClick={() => handleDelete(enrollment.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}

export default Enrollments;
