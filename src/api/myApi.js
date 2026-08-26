import { apiRequest } from "./apiClient";

export function getMyExams() {
  return apiRequest("/my/exams", "GET");
}

export function getExamToTake(id) {
  return apiRequest(`/my/exams/${id}`, "GET");
}

export function submitExam(id, answers) {
  return apiRequest(`/my/exams/${id}/submit`, "POST", { answers });
}

export function getMyResults() {
  return apiRequest("/my/results", "GET");
}
