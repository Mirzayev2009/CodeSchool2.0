// src/lessonApi.js
const BASE_URL = 'https://sanjar1718.pythonanywhere.com';

async function request(path, token, { method = 'GET', body = null, signal = undefined, headers = {} } = {}) {
  const hdrs = {
    Accept: 'application/json',
    ...headers,
  };
  if (token) {
    hdrs['Authorization'] = `Token ${token}`;
  }
  if (body && !(body instanceof FormData)) {
    hdrs['Content-Type'] = 'application/json';
    body = JSON.stringify(body);
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: hdrs,
    body,
    signal,
    // mode: 'cors' // optional, fetch defaults ok in most cases
  });

  const text = await res.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch (e) { data = text; }

  if (!res.ok) {
    const err = new Error(`Request failed (${res.status} ${res.statusText})`);
    err.status = res.status;
    err.body = data;
    throw err;
  }
  return data;
}

export function getLessons(token, options = {}) { return request('/api/lessons/', token, options); }
export function getLesson(id, token, options = {}) { return request(`/api/lessons/${id}/`, token, options); }
export function getLessonHomework(lessonId, token, options = {}) {
  return request(`/api/lessons/${lessonId}/homework/`, token, options);
}
export function getLessonHomeworkTasks(homeworkId, token, options = {}) {
  return request(`/api/homework/${homeworkId}/tasks/`, token, options);
}
export function getMyLessons(token, options = {}) {
  return request('/api/lessons/my_lessons/', token, options);
}
export function searchLessons(query, token, options = {}) {
  return request(`/api/lessons/search/?search=${encodeURIComponent(query)}`, token, options);
}
