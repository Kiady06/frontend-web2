import { useEffect, useState } from "react";
import {
  getStudents,
  createStudent,
  deactivateStudent,
} from "../../api/studentApi";
import Loader from "../../components/Loader.jsx";

function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    loadStudents();
  }, []);

  async function loadStudents() {
    setLoading(true);
    try {
      const data = await getStudents();
      setStudents(data);
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
      await createStudent(email, password);
      setEmail("");
      setPassword("");
      loadStudents();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDeactivate(id) {
    if (!window.confirm("Deactivate this student account?")) return;
    try {
      await deactivateStudent(id);
      loadStudents();
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) return <Loader />;

  return (
    <div className="container">
      <h1>Student Management</h1>
      {error && <p className="error">{error}</p>}

      <table>
        <thead>
          <tr>
            <th>Email</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s) => (
            <tr key={s.id}>
              <td>{s.email}</td>
              <td>{s.is_active ? "Active" : "Deactivated"}</td>
              <td>
                {s.is_active && (
                  <button
                    className="btn-danger"
                    onClick={() => handleDeactivate(s.id)}
                  >
                    Deactivate
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Create a Student Account</h2>
      <form onSubmit={handleCreate}>
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Create</button>
      </form>
    </div>
  );
}

export default StudentsPage;
