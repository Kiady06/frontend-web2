import { apiRequest } from "./apiClient";

export function getStudents(){
    return apiRequest("/students", "GET");
}
export function createStudent(name, email, password) {
    return apiRequest("/students", "POST", { name, email, password });
}
export function updateStudent(id, name, email, password) {
    return apiRequest(`/students/${id}`, "PUT", { name, email, password });
}
export function deactivateStudent(id) {
    return apiRequest(`/students/${id}`, "DELETE");
}