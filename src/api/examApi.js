import { apiRequest } from './apiClient';

export function getExams(){
    return apiRequest({
        url: '/exams',
        method: 'GET'
    });
}
export function getExamById(id){
    return apiRequest({
        url: `/exams/${id}`,
        method: 'GET'
    });
}
export function createExam(course_id, name, start_date, end_date){
    return apiRequest({
        url: '/exams',
        method: 'POST',
        data: {
            course_id,
            name,
            start_date,
            end_date
        }
    });
}
export function updateExam(id, name, start_date, end_date){
    return apiRequest({
        url: `/exams/${id}`,
        method: 'PUT',
        data: {
            name,
            start_date,
            end_date
        }
    });
}
export function deleteExam(id){
    return apiRequest({
        url: `/exams/${id}`,
        method: 'DELETE'
    });
}
export function getExamResults(exam_id){
    return apiRequest({
        url: `/exams/${exam_id}/results`,
        method: 'GET'
    });
}