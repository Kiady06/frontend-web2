import { url } from "node:inspector";
import { apiRequest } from "./apiClient";

export function getStudents(){
    return apiRequest({
        url: '/students',
        method: 'GET'
    });
}
export function createStudent(name, email, password) {
    return apiRequest({
        url: '/students',
        method: 'POST',
        data: {
            name,
            email,
            password
        }
    });
}
export function updateStudent(id, name, email, password) {
    return apiRequest({
        url: `/students/${id}`,
        method: 'PUT',
        data: {
            name,
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