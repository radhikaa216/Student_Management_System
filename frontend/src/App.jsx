
import { useState } from "react";
import Auth from "./components/Auth";
import Students from "./components/Students";
import Courses from "./components/Courses";
import Enrollments from "./components/Enrollments";
import "./App.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    Boolean(localStorage.getItem("access_token"))
  );

  const [currentPage, setCurrentPage] = useState("dashboard");

  function handleLogin() {
    setIsLoggedIn(true);
    setCurrentPage("dashboard");
  }

  function handleLogout() {
    localStorage.removeItem("access_token");
    setIsLoggedIn(false);
    setCurrentPage("dashboard");
  }

  if (!isLoggedIn) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Student Management System</h1>
        <button type="button" onClick={handleLogout}>
          Logout
        </button>
      </header>

      <main className="dashboard-content">
        {currentPage === "dashboard" ? (
          <>
            <h2>Welcome!</h2>
            <p>You have successfully logged in.</p>

            <div className="dashboard-cards">
              <button
                type="button"
                className="dashboard-card dashboard-card-button"
                onClick={() => setCurrentPage("students")}
              >
                <h3>Students</h3>
                <p>Manage student records.</p>
              </button>

              <button
                type="button"
                className="dashboard-card dashboard-card-button"
                onClick={() => setCurrentPage("courses")}
              >
                <h3>Courses</h3>
                <p>Manage courses.</p>
              </button>

              <button
                type="button"
                className="dashboard-card dashboard-card-button"
                onClick={() => setCurrentPage("enrollments")}
              >
                <h3>Enrollments</h3>
                <p>Enroll students in courses.</p>
              </button>
            </div>
          </>
        ) : (
          <>
            <button
              type="button"
              className="back-button"
              onClick={() => setCurrentPage("dashboard")}
            >
              ← Back to Dashboard
              
            </button>

            {currentPage === "students" && <Students />}
            {currentPage === "courses" && <Courses />}
            {currentPage === "enrollments" && <Enrollments />}
          </>
        )}
      </main>
    </div>
  );
}

export default App;
