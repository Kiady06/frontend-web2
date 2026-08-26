import { useEffect, useState } from "react";
import { getCourses, createCourse, deleteCourse } from "../../api/courseApi";
import Loader from "../../components/Loader.jsx";

function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    loadCourses();
  }, []);

  async function loadCourses() {
    setLoading(true);
    try {
      const data = await getCourses();
      setCourses(data);
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
      await createCourse(name, description);
      setName("");
      setDescription("");
      loadCourses();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this course?")) return;
    setError("");
    try {
      await deleteCourse(id);
      loadCourses();
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) return <Loader />;

  return (
    <div className="container">
      <h1>Course Management</h1>
      {error && <p className="error">{error}</p>}

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((c) => (
            <tr key={c.id}>
              <td>{c.name}</td>
              <td>{c.description}</td>
              <td>
                <button className="btn-danger" onClick={() => handleDelete(c.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Create a Course</h2>
      <form onSubmit={handleCreate}>
        <label>Course Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <label>Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button type="submit">Create</button>
      </form>
    </div>
  );
}

export default CoursesPage;
