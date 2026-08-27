import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getExamResults, getExamById } from "../../api/examApi";
import Loader from "../../components/Loader.jsx";

function ExamResultsPage() {
  const { examId } = useParams();

  const [exam, setExam] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadData();
  }, [examId]);

  async function loadData() {
    setLoading(true);
    try {
      const examData = await getExamById(examId);
      const resultsData = await getExamResults(examId);
      setExam(examData);
      setResults(resultsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <Loader />;

  return (
    <div className="container">
      <Link to="/admin/exams">Back to exams</Link>
      <h1>Results: {exam ? exam.name : ""}</h1>
      {error && <p className="error">{error}</p>}

      <table>
        <thead>
          <tr>
            <th>Student</th>
            <th>Score</th>
            <th>Status</th>
            <th>Submitted on</th>
          </tr>
        </thead>
        <tbody>
          {results.map((r, index) => (
            <tr key={index}>
              <td>{r.student_email}</td>
              <td>
                {r.score} / {r.total_points}
              </td>
              <td className={r.admitted ? "success" : "error"}>
                {r.admitted ? "Passed" : "Failed"}
              </td>
              <td>{new Date(r.submitted_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {results.length === 0 && <p>No attempts yet.</p>}
    </div>
  );
}

export default ExamResultsPage;
