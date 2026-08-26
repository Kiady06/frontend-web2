import { url } from "node:inspector";
import { apiRequest } from "./apiClient";

export function getStudents(){
    return apiRequest({
        url: '/students',
        method: 'GET'
    });
}
export function createStudent(email, password) {
    return apiRequest({
        url: '/students',
        method: 'POST',
        data: {
            email,
            password
        }
    });
}
export function updateStudent(id, email, password) {
    return apiRequest({
        url: `/students/${id}`,
        method: 'PUT',
        data: {
            email,
            password
        }
    });
}
export function deactivateStudent(id) {
    return apiRequest({
        url: `/students/${id}`,
        method: 'DELETE'
    });
}