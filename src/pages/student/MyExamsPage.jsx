import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyExams } from "../../api/myApi";
import Loader from "../../components/Loader.jsx";

function MyExamsPage() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    loadExams();
  }, []);

  async function loadExams() {
    setLoading(true);
    try {
      const data = await getMyExams();
      setExams(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <Loader />;

  return (
    <div className="container">
      <h1>Available Exams</h1>
      {error && <p className="error">{error}</p>}

      {exams.length === 0 && <p>No exams available at the moment.</p>}

      <table>
        <thead>
          <tr>
            <th>Course</th>
            <th>Exam</th>
            <th>Available until</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {exams.map((ex) => (
            <tr key={ex.id}>
              <td>{ex.course_name}</td>
              <td>{ex.name}</td>
              <td>{new Date(ex.end_date).toLocaleString()}</td>
              <td>
                <button onClick={() => navigate(`/student/exams/${ex.id}`)}>
                  Take exam
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default MyExamsPage;
