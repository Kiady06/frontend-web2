import { apiRequest } from "./apiClient";

export function getQuestionsByExam(examId) {
  return apiRequest(`/exams/${examId}/questions`, "GET");
}

export function createQuestion(examId, statement, points, choices) {
  return apiRequest(`/exams/${examId}/questions`, "POST", {
    statement,
    points,
    choices,
  });
}

export function updateQuestion(id, statement, points, choices) {
  return apiRequest(`/questions/${id}`, "PUT", { statement, points, choices });
}

export function deleteQuestion(id) {
  return apiRequest(`/questions/${id}`, "DELETE");
}
