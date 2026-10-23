
import { useEffect, useState } from "react";
import { courseAPI } from "../services/api";
import "./Courses.css";

const emptyForm = {
  course_code: "",
  course_name: "",
  description: "",
};

function Courses() {
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function loadCourses() {
    setLoading(true);
    setError("");

    try {
      const data = await courseAPI.getAll();
      setCourses(Array.isArray(data) ? data : data?.courses ?? []);
    } catch (err) {
      setError(err.message || "Unable to load courses.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCourses();
  }, []);

  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");

    try {
      const courseData = {
        course_code: form.course_code.trim(),
        course_name: form.course_name.trim(),
        description: form.description.trim() || null,
      };

      if (editingId !== null) {
        await courseAPI.update(editingId, courseData);
        setSuccess("Course updated successfully.");
      } else {
        await courseAPI.create(courseData);
        setSuccess("Course created successfully.");
      }

      setForm(emptyForm);
      setEditingId(null);
      await loadCourses();
    } catch (err) {
      setError(err.message || "Unable to save course.");
    }
  }

  function handleEdit(course) {
    setEditingId(course.id);
    setForm({
      course_code: course.course_code ?? "",
      course_name: course.course_name ?? "",
      description: course.description ?? "",
    });
    setError("");
    setSuccess("");
  }

  async function handleDelete(courseId) {
    if (!window.confirm("Are you sure you want to delete this course?")) {
      return;
    }

    setError("");
    setSuccess("");

    try {
      await courseAPI.delete(courseId);
      setSuccess("Course deleted successfully.");
      await loadCourses();
    } catch (err) {
      setError(err.message || "Unable to delete course.");
    }
  }

  function handleCancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
    setError("");
    setSuccess("");
  }

  return (
    <section className="courses-page">
      <div className="courses-heading">
        <div>
          <h2>Course Management</h2>
          <p>Add, view, edit, and delete courses.</p>
        </div>

        <button type="button" onClick={loadCourses}>
          Refresh
        </button>
      </div>

      {error && <div className="course-message error">{error}</div>}
      {success && <div className="course-message success">{success}</div>}

      <form className="course-form" onSubmit={handleSubmit}>
        <h3>{editingId !== null ? "Edit Course" : "Add New Course"}</h3>

        <div className="course-form-grid">
          <label>
            Course Code
            <input
              name="course_code"
              value={form.course_code}
              onChange={handleChange}
              placeholder="e.g. CS101"
              required
            />
          </label>

          <label>
            Course Name
            <input
              name="course_name"
              value={form.course_name}
              onChange={handleChange}
              placeholder="Enter course name"
              required
            />
          </label>

          <label className="course-description">
            Description
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Enter course description"
              rows={3}
            />
          </label>
        </div>

        <div className="course-form-actions">
          <button type="submit">
            {editingId !== null ? "Update Course" : "Add Course"}
          </button>

          {editingId !== null && (
            <button type="button" className="cancel-course"
              onClick={handleCancelEdit}>
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="course-table-card">
        <h3>Course Records</h3>

        {loading ? (
          <p>Loading courses...</p>
        ) : courses.length === 0 ? (
          <p>No courses found. Add your first course above.</p>
        ) : (
          <div className="course-table-wrapper">
            <table className="course-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Course Code</th>
                  <th>Course Name</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course) => (
                  <tr key={course.id}>
                    <td>{course.id}</td>
                    <td>{course.course_code}</td>
                    <td>{course.course_name}</td>
                    <td>{course.description || "—"}</td>
                    <td className="course-actions">
                      <button type="button" className="edit-course"
                        onClick={() => handleEdit(course)}>
                        Edit
                      </button>
                      <button type="button" className="delete-course"
                        onClick={() => handleDelete(course.id)}>
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

export default Courses;
