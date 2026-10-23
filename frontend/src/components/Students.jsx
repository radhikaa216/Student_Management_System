
import { useEffect, useState } from "react";
import { studentAPI } from "../services/api";
import "./Students.css";

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  department: "",
};

export default function Students() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function loadStudents() {
    setLoading(true);
    setError("");

    try {
      const data = await studentAPI.getAll();
      setStudents(Array.isArray(data) ? data : data.students || []);
    } catch (err) {
      setError(err.message || "Could not load students.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadStudents();
  }, []);

  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  function resetForm() {
    setForm({ ...emptyForm });
    setEditingId(null);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    try {
      if (editingId !== null) {
        await studentAPI.update(editingId, form);
        setMessage("Student updated successfully.");
      } else {
        await studentAPI.create(form);
        setMessage("Student created successfully.");
      }

      resetForm();
      await loadStudents();
    } catch (err) {
      setError(err.message || "Could not save student.");
    } finally {
      setSaving(false);
    }
  }

  function handleEdit(student) {
    setEditingId(student.id);
    setForm({
      name: student.name ?? "",
      email: student.email ?? "",
      phone: student.phone ?? "",
      department: student.department ?? "",
    });
    setError("");
    setMessage("");
  }

  async function handleDelete(student) {
    if (!window.confirm(`Delete student ${student.name}?`)) return;

    setError("");
    setMessage("");

    try {
      await studentAPI.delete(student.id);
      setMessage("Student deleted successfully.");

      if (editingId === student.id) resetForm();

      await loadStudents();
    } catch (err) {
      setError(err.message || "Could not delete student.");
    }
  }

  return (
    <section className="students-page">
      <div className="students-heading">
        <div>
          <h2>Student Management</h2>
          <p>Add, view, edit, and delete student records.</p>
        </div>

        <button type="button" onClick={loadStudents}>
          Refresh
        </button>
      </div>

      {error && <p className="students-error">{error}</p>}
      {message && <p className="students-message">{message}</p>}

      <div className="student-form-card">
        <h3>{editingId !== null ? "Edit Student" : "Add New Student"}</h3>

        <form className="student-form" onSubmit={handleSubmit}>
          <label>
            Student Name
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="Enter student name"
            />
          </label>

          <label>
            Email
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="Enter email"
            />
          </label>

          <label>
            Phone
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
            />
          </label>

          <label>
            Department
            <input
              name="department"
              value={form.department}
              onChange={handleChange}
              required
              placeholder="Enter department"
            />
          </label>

          <div className="student-form-actions">
            <button type="submit" disabled={saving}>
              {saving
                ? "Saving..."
                : editingId !== null
                  ? "Update Student"
                  : "Add Student"}
            </button>

            {editingId !== null && (
              <button type="button" onClick={resetForm}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="student-table-card">
        <h3>Student Records</h3>

        {loading ? (
          <p>Loading students...</p>
        ) : students.length === 0 ? (
          <p>No students found. Add your first student above.</p>
        ) : (
          <div className="student-table-scroll">
            <table className="student-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Department</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.id}>
                    <td>{student.id}</td>
                    <td>{student.name}</td>
                    <td>{student.email}</td>
                    <td>{student.phone || "-"}</td>
                    <td>{student.department}</td>
                    <td>
                      <button
                        type="button"
                        onClick={() => handleEdit(student)}
                      >
                        Edit
                      </button>{" "}
                      <button
                        type="button"
                        onClick={() => handleDelete(student)}
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
