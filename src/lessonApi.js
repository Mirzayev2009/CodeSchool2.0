
// lessonApi.js - MISSING FILE (created based on Swagger)
const BASE_URL = 'https://sanjar1718.pythonanywhere.com';

export async function getLessons(token) {
  const response = await fetch(`${BASE_URL}/api/lessons/`, {
    headers: { 'Authorization': `Token ${token}` }
  });
  if (!response.ok) throw new Error('Failed to fetch lessons');
  return response.json();
}

export async function getLesson(id, token) {
  const response = await fetch(`${BASE_URL}/api/lessons/${id}/`, {
    headers: { 'Authorization': `Token ${token}` }
  });
  if (!response.ok) throw new Error('Failed to fetch lesson');
  return response.json();
}

export async function getLessonHomework(lessonId, token) {
  const response = await fetch(`${BASE_URL}/api/lessons/${lessonId}/homework/`, {
    headers: { 'Authorization': `Token ${token}` }
  });
  if (!response.ok) throw new Error('Failed to fetch lesson homework');
  return response.json();
}

// This function should get homework tasks for a specific homework assignment
export async function getLessonHomeworkTasks(homeworkId, token) {
  const response = await fetch(`${BASE_URL}/api/homework/${homeworkId}/tasks/`, {
    headers: { 'Authorization': `Token ${token}` }
  });
  if (!response.ok) throw new Error('Failed to fetch homework tasks');
  return response.json();
}

export async function getMyLessons(token) {
  const response = await fetch(`${BASE_URL}/api/lessons/my_lessons/`, {
    headers: { 'Authorization': `Token ${token}` }
  });
  if (!response.ok) throw new Error('Failed to fetch my lessons');
  return response.json();
}

export async function searchLessons(query, token) {
  const response = await fetch(`${BASE_URL}/api/lessons/search/?search=${encodeURIComponent(query)}`, {
    headers: { 'Authorization': `Token ${token}` }
  });
  if (!response.ok) throw new Error('Failed to search lessons');
  return response.json();
}