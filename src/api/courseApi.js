import { apiRequest } from "./apiClient";

export function getCourses() {
  return apiRequest("/courses", "GET");
}

export function createCourse(code, name, description) {
  return apiRequest("/courses", "POST", { code, name, description });
}

export function updateCourse(id, code, name, description) {
  return apiRequest(`/courses/${id}`, "PUT", { code, name, description });
}

export function deleteCourse(id) {
  return apiRequest(`/courses/${id}`, "DELETE");
}
