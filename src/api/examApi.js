import { apiRequest } from './apiClient';

export function getExams(){
    return apiRequest('/exams', 'GET');
}
export function getExamById(id){
    return apiRequest(`/exams/${id}`, 'GET');
}
export function createExam(course_id, name, start_date, end_date){
    return apiRequest('/exams', 'POST', {
        course_id,
        name,
        start_date,
        end_date
    });
}
export function updateExam(id, name, start_date, end_date){
    return apiRequest(`/exams/${id}`, 'PUT', {
        name,
        start_date,
        end_date
    });
}
export function deleteExam(id){
    return apiRequest(`/exams/${id}`, 'DELETE');
}
export function getExamResults(exam_id){
    return apiRequest(`/exams/${exam_id}/results`, 'GET');
}