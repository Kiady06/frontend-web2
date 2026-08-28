import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getExamToTake, submitExam } from "../../api/myApi";
import Loader from "../../components/Loader.jsx";
import ConfirmModal from "../../components/ConfirmModal.jsx";

function TakeExamPage() {
  const { examId } = useParams();
  const navigate = useNavigate();

  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadExam();
  }, [examId]);

  async function loadExam() {
    setLoading(true);
    setError("");
    try {
      const data = await getExamToTake(examId);
      setExam(data.exam);
      setQuestions(data.questions);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleSelectChoice(questionId, choiceId) {
    setAnswers({ ...answers, [questionId]: choiceId });
  }

  async function handleConfirmSubmit() {
    setShowConfirm(false);
    setSubmitting(true);
    setError("");

    const answersArray = questions.map((q) => ({
      question_id: q.id,
      choice_id: answers[q.id] || null,
    }));

    try {
      const result = await submitExam(examId, answersArray);
      navigate(`/student/exams/${examId}/result`, { state: result });
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  }

  if (loading) return <Loader />;

  if (error && questions.length === 0) {
    return (
      <div className="container">
        <p className="error">{error}</p>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>{exam ? exam.name : "Exam"}</h1>
      {error && <p className="error">{error}</p>}

      {questions.map((q, index) => (
        <div className="question-block" key={q.id}>
          <p>
            <strong>
              Question {index + 1} ({q.points} pt(s))
            </strong>
          </p>
          <p>{q.statement}</p>
          {q.choices.map((c) => (
            <label key={c.id} style={{ display: "block", fontWeight: "normal" }}>
              <input
                type="radio"
                name={`question-${q.id}`}
                checked={answers[q.id] === c.id}
                onChange={() => handleSelectChoice(q.id, c.id)}
              />{" "}
              {c.text}
            </label>
          ))}
        </div>
      ))}

      {questions.length > 0 && (
        <button disabled={submitting} onClick={() => setShowConfirm(true)}>
          Submit my answers
        </button>
      )}

      {showConfirm && (
        <ConfirmModal
          message="Once submitted, you will not be able to change your answers. Do you confirm submission?"
          onConfirm={handleConfirmSubmit}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </div>
  );
}

export default TakeExamPage;
