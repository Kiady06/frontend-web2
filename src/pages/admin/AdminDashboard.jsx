import { useEffect, useState } from "react";
import { getStudents } from "../../api/studentApi";
import { getCourses } from "../../api/courseApi";
import { getExams } from "../../api/examApi";
import Loader from "../../components/Loader.jsx";

function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [counts, setCounts] = useState({ students: 0, courses: 0, exams: 0 });

  useEffect(() => {
    loadCounts();
  }, []);

  async function loadCounts() {
    try {
      const [students, courses, exams] = await Promise.all([
        getStudents(),
        getCourses(),
        getExams(),
      ]);
      setCounts({
        students: students.length,
        courses: courses.length,
        exams: exams.length,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <Loader />;

  return (
    <div className="container">
      <h1>Dashboard</h1>
      {error && <p className="error">{error}</p>}

      <div style={{ display: "flex", gap: "15px" }}>
        <div className="card" style={{ flex: 1 }}>
          <h3>Students</h3>
          <p style={{ fontSize: "24px" }}>{counts.students}</p>
        </div>
        <div className="card" style={{ flex: 1 }}>
          <h3>Courses</h3>
          <p style={{ fontSize: "24px" }}>{counts.courses}</p>
        </div>
        <div className="card" style={{ flex: 1 }}>
          <h3>Exams</h3>
          <p style={{ fontSize: "24px" }}>{counts.exams}</p>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
