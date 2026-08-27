import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getExams, createExam, deleteExam } from "../../api/examApi";
import { getCourses } from "../../api/courseApi";
import Loader from "../../components/Loader.jsx";

function ExamsPage() {
  const [exams, setExams] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [courseId, setCourseId] = useState("");
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [examsData, coursesData] = await Promise.all([
        getExams(),
        getCourses(),
      ]);
      setExams(examsData);
      setCourses(coursesData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(e) {
    e.preventDefault();
    setError("");
    try {
      await createExam(Number(courseId), name, startDate, endDate);
      setName("");
      setStartDate("");
      setEndDate("");
      loadData();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this exam?")) return;
    setError("");
    try {
      await deleteExam(id);
      loadData();
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) return <Loader />;

  return (
    <div className="container">
      <h1>Exam Management</h1>
      {error && <p className="error">{error}</p>}

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Course</th>
            <th>Start</th>
            <th>End</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {exams.map((ex) => (
            <tr key={ex.id}>
              <td>{ex.name}</td>
              <td>{ex.course_name}</td>
              <td>{new Date(ex.start_date).toLocaleString()}</td>
              <td>{new Date(ex.end_date).toLocaleString()}</td>
              <td>
                <Link to={`/admin/exams/${ex.id}/questions`}>Questions</Link>
                {" | "}
                <Link to={`/admin/exams/${ex.id}/results`}>Results</Link>
                {" | "}
                <button className="btn-danger" onClick={() => handleDelete(ex.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Create an Exam</h2>
      <form onSubmit={handleCreate}>
        <label>Course</label>
        <select
          value={courseId}
          onChange={(e) => setCourseId(e.target.value)}
          required
        >
          <option value="">-- Select a course --</option>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <label>Exam Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <label>Start Date</label>
        <input
          type="datetime-local"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
        />

        <label>End Date</label>
        <input
          type="datetime-local"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          required
        />

        <button type="submit">Create</button>
      </form>
    </div>
  );
}

export default ExamsPage;
