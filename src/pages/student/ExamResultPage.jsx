import { useLocation, Link } from "react-router-dom";

function ExamResultPage() {
  const location = useLocation();
  const result = location.state;

  if (!result) {
    return (
      <div className="container">
        <p className="error">
          No result to display. Check your history instead.
        </p>
        <Link to="/student/results">View my results</Link>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Exam Result</h1>
      <h2>
        Score: {result.score} / {result.total_points}
      </h2>

      <h3>Full Correction</h3>
      {result.correction.map((q, index) => {
        const isCorrect = q.obtained_points === q.points;
        return (
          <div className="question-block" key={q.question_id}>
            <p>
              <strong>
                Question {index + 1}: {q.statement}
              </strong>{" "}
              ({q.obtained_points} / {q.points} pt(s))
            </p>
            <ul>
              {q.choices.map((c) => {
                let style = {};
                if (c.id === q.correct_choice_id) {
                  style = { color: "#1a7a3a", fontWeight: "bold" };
                }
                if (
                  c.id === q.selected_choice_id &&
                  c.id !== q.correct_choice_id
                ) {
                  style = { color: "#b02a2a", fontWeight: "bold" };
                }
                return (
                  <li key={c.id} style={style}>
                    {c.choice_text}
                    {c.id === q.selected_choice_id ? " (your answer)" : ""}
                    {c.id === q.correct_choice_id ? " (correct answer)" : ""}
                  </li>
                );
              })}
            </ul>
            <p className={isCorrect ? "success" : "error"}>
              {isCorrect ? "Correct" : "Incorrect or unanswered"}
            </p>
          </div>
        );
      })}

      <Link to="/student/results">View my results history</Link>
    </div>
  );
}

export default ExamResultPage;
