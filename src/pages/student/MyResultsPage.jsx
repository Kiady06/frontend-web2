import { useEffect, useState } from "react";
import { getMyResults } from "../../api/myApi";
import Loader from "../../components/Loader.jsx";

function MyResultsPage() {
  const [results, setResults] = useState([]);
  const [average, setAverage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadResults();
  }, []);

  async function loadResults() {
    setLoading(true);
    try {
      const data = await getMyResults();
      setResults(data.results);
      setAverage(data.average);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <Loader />;

  return (
    <div className="container">
      <h1>My Results</h1>
      {error && <p className="error">{error}</p>}

      <p>
        <strong>Overall average: {average} %</strong>
      </p>

      {results.length === 0 && <p>You have not taken any exams yet.</p>}

      <table>
        <thead>
          <tr>
            <th>Course</th>
            <th>Exam</th>
            <th>Score</th>
            <th>Percentage</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {results.map((r, index) => (
            <tr key={index}>
              <td>{r.course_name}</td>
              <td>{r.exam_name}</td>
              <td>
                {r.score} / {r.total_points}
              </td>
              <td>{r.percentage} %</td>
              <td>{new Date(r.submitted_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default MyResultsPage;
