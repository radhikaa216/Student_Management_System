
const API_BASE_URL = "http://127.0.0.1:8000";

async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem("access_token");

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      data?.detail || `Request failed with status ${response.status}`
    );
  }

  return data;
}

export const authAPI = {
  register: (userData) =>
    apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    }),

  login: (credentials) =>
    apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    }),

  getCurrentUser: () => apiRequest("/auth/me"),
};

export const studentAPI = {
  getAll: () => apiRequest("/students/"),

  getById: (id) => apiRequest(`/students/${id}`),

  create: (studentData) =>
    apiRequest("/students/", {
      method: "POST",
      body: JSON.stringify(studentData),
    }),

  update: (id, studentData) =>
    apiRequest(`/students/${id}`, {
      method: "PUT",
      body: JSON.stringify(studentData),
    }),

  delete: (id) =>
    apiRequest(`/students/${id}`, {
      method: "DELETE",
    }),
};

export const courseAPI = {
  getAll: () => apiRequest("/courses/"),

  getById: (id) => apiRequest(`/courses/${id}`),

  create: (courseData) =>
    apiRequest("/courses/", {
      method: "POST",
      body: JSON.stringify(courseData),
    }),

  update: (id, courseData) =>
    apiRequest(`/courses/${id}`, {
      method: "PUT",
      body: JSON.stringify(courseData),
    }),

  delete: (id) =>
    apiRequest(`/courses/${id}`, {
      method: "DELETE",
    }),
};

export const enrollmentAPI = {
  getAll: (studentId, courseId) => {
    const params = new URLSearchParams();

    if (studentId) params.set("student_id", studentId);
    if (courseId) params.set("course_id", courseId);

    const query = params.toString();

    return apiRequest(
      `/enrollments/${query ? `?${query}` : ""}`
    );
  },

  create: (enrollmentData) =>
    apiRequest("/enrollments/", {
      method: "POST",
      body: JSON.stringify(enrollmentData),
    }),

  delete: (id) =>
    apiRequest(`/enrollments/${id}`, {
      method: "DELETE",
    }),
};
