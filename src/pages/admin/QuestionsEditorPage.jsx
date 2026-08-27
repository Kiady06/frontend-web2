import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  getQuestionsByExam,
  createQuestion,
  deleteQuestion,
} from "../../api/questionApi.js";
import { getExamById, getExamResults } from "../../api/examApi.js";
import Loader from "../../components/Loader.jsx";

function emptyChoices() {
  return [
    { text: "", is_correct: false },
    { text: "", is_correct: false },
    { text: "", is_correct: false },
    { text: "", is_correct: false },
  ];
}

function QuestionsEditorPage() {
  const { examId } = useParams();

  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [locked, setLocked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [statement, setStatement] = useState("");
  const [points, setPoints] = useState(1);
  const [choices, setChoices] = useState(emptyChoices());

  useEffect(() => {
    loadData();
  }, [examId]);

  async function loadData() {
    setLoading(true);
    setError("");
    try {
      const examData = await getExamById(examId);
      const questionsData = await getQuestionsByExam(examId);
      setExam(examData);
      setQuestions(questionsData);

      try {
        const results = await getExamResults(examId);
        setLocked(results.length > 0);
      } catch {
        setLocked(false);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleChoiceTextChange(index, value) {
    const updated = [...choices];
    updated[index].text = value;
    setChoices(updated);
  }

  function handleChoiceCorrectChange(index) {
    const updated = choices.map((c, i) => ({
      ...c,
      is_correct: i === index,
    }));
    setChoices(updated);
  }

  function addChoiceField() {
    if (choices.length >= 6) return;
    setChoices([...choices, { text: "", is_correct: false }]);
  }

  function removeChoiceField(index) {
    if (choices.length <= 2) return;
    setChoices(choices.filter((_, i) => i !== index));
  }

  async function handleCreateQuestion(e) {
    e.preventDefault();
    setError("");
    try {
      await createQuestion(examId, statement, Number(points), choices);
      setStatement("");
      setPoints(1);
      setChoices(emptyChoices());
      loadData();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDeleteQuestion(id) {
    if (!window.confirm("Delete this question?")) return;
    setError("");
    try {
      await deleteQuestion(id);
      loadData();
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) return <Loader />;

  return (
    <div className="container">
      <Link to="/admin/exams">Back to exams</Link>
      <h1>Questions for exam: {exam ? exam.name : ""}</h1>

      {locked && (
        <p className="error">
          This exam already has attempts: its questions can no longer be
          modified or deleted.
        </p>
      )}

      {error && <p className="error">{error}</p>}

      {questions.map((q) => (
        <div className="question-block" key={q.id}>
          <p>
            <strong>{q.statement}</strong> ({q.points} pt(s))
          </p>
          <ul>
            {q.choices.map((c) => (
              <li key={c.id}>
                {c.choice_text} {c.is_correct ? "(correct answer)" : ""}
              </li>
            ))}
          </ul>
          {!locked && (
            <button
              className="btn-danger"
              onClick={() => handleDeleteQuestion(q.id)}
            >
              Delete question
            </button>
          )}
        </div>
      ))}

      {!locked && (
        <>
          <h2>Add a Question</h2>
          <form onSubmit={handleCreateQuestion}>
            <label>Question statement</label>
            <textarea
              value={statement}
              onChange={(e) => setStatement(e.target.value)}
              required
            />

            <label>Points</label>
            <input
              type="number"
              min="1"
              value={points}
              onChange={(e) => setPoints(e.target.value)}
              required
            />

            <label>Answer choices (2 to 6, exactly one correct)</label>
            {choices.map((c, index) => (
              <div key={index} style={{ display: "flex", gap: "8px", marginTop: "6px" }}>
                <input
                  type="radio"
                  name="correct-choice"
                  checked={c.is_correct}
                  onChange={() => handleChoiceCorrectChange(index)}
                />
                <input
                  type="text"
                  placeholder={`Choice ${index + 1}`}
                  value={c.text}
                  onChange={(e) => handleChoiceTextChange(index, e.target.value)}
                  required
                  style={{ flex: 1 }}
                />
                {choices.length > 2 && (
                  <button type="button" onClick={() => removeChoiceField(index)}>
                    Remove
                  </button>
                )}
              </div>
            ))}

            {choices.length < 6 && (
              <button type="button" onClick={addChoiceField}>
                Add a choice
              </button>
            )}

            <button type="submit">Save question</button>
          </form>
        </>
      )}
    </div>
  );
}

export default QuestionsEditorPage;
