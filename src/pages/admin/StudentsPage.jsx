import { useEffect, useState } from "react";
import {
  getStudents,
  createStudent,
  updateStudent,
  deactivateStudent,
} from "../../api/studentApi";
import Loader from "../../components/Loader.jsx";

function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editIsActive, setEditIsActive] = useState(true);
  const [editPassword, setEditPassword] = useState("");

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
      await createStudent(name, email, password);
      setName("");
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

  function handleEdit(student) {
    setEditingId(student.id);
    setEditName(student.name);
    setEditEmail(student.email);
    setEditIsActive(student.is_active);
    setEditPassword("");
    setError("");
  }

  function handleCancelEdit() {
    setEditingId(null);
    setEditName("");
    setEditEmail("");
    setEditIsActive(true);
    setEditPassword("");
  }

  async function handleSaveEdit(id) {
    setError("");
    try {
      await updateStudent(id, editName, editEmail, editIsActive, editPassword || undefined);
      handleCancelEdit();
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
            <th>Name</th>
            <th>Email</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s) => (
            <tr key={s.id}>
              {editingId === s.id ? (
                <>
                  <td>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      required
                    />
                  </td>
                  <td>
                    <input
                      type="email"
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                      required
                    />
                  </td>
                  <td>
                    <select
                      value={editIsActive ? "true" : "false"}
                      onChange={(e) => setEditIsActive(e.target.value === "true")}
                    >
                      <option value="true">Active</option>
                      <option value="false">Deactivated</option>
                    </select>
                  </td>
                  <td>
                    <input
                      type="password"
                      placeholder="New password (optional)"
                      value={editPassword}
                      onChange={(e) => setEditPassword(e.target.value)}
                    />
                    <button onClick={() => handleSaveEdit(s.id)}>Save</button>
                    <button onClick={handleCancelEdit}>Cancel</button>
                  </td>
                </>
              ) : (
                <>
                  <td>{s.name}</td>
                  <td>{s.email}</td>
                  <td>{s.is_active ? "Active" : "Deactivated"}</td>
                  <td>
                    <button onClick={() => handleEdit(s)}>Edit</button>
                    {s.is_active && (
                      <button
                        className="btn-danger"
                        onClick={() => handleDeactivate(s.id)}
                      >
                        Deactivate
                      </button>
                    )}
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Create a Student Account</h2>
      <form onSubmit={handleCreate}>
        <label>Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

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