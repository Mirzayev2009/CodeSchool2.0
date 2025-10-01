// src/homeworkApi.js
const BASE_URL = 'https://sanjar1718.pythonanywhere.com';

// Helper request function
async function request(path, token, { method = 'GET', body = null, signal = undefined, headers = {} } = {}) {
  const hdrs = {
    Accept: 'application/json',
    ...headers,
  };
  if (token) hdrs['Authorization'] = `Token ${token}`;
  if (body && !(body instanceof FormData)) {
    hdrs['Content-Type'] = 'application/json';
    body = JSON.stringify(body);
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: hdrs,
    body,
    signal,
  });

  const text = await res.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch (e) { data = text; }

  if (!res.ok) {
    const err = new Error(`Request failed (${res.status})`);
    err.status = res.status;
    err.body = data;
    throw err;
  }
  return data;
}

// ============================================================================
// LESSON ENDPOINTS
// ============================================================================
export function getLesson(lessonId, token, opts = {}) {
  return request(`/api/lessons/${lessonId}/`, token, opts);
}

export function getLessonHomework(lessonId, token, opts = {}) {
  return request(`/api/lessons/${lessonId}/homework/`, token, opts);
}

// ============================================================================
// HOMEWORK ENDPOINTS
// ============================================================================

// Get all homeworks
export function getHomeworks(token, opts = {}) {
  return request('/api/homework/', token, opts);
}

// Get a single homework by ID
export function getHomework(homeworkId, token, opts = {}) {
  return request(`/api/homework/${homeworkId}/`, token, opts);
}

// Create a new homework
export function createHomework(data, token, opts = {}) {
  return request('/api/homework/', token, {
    method: 'POST',
    body: data,
    ...opts,
  });
}

// Update homework (full replace)
export function updateHomework(id, data, token, opts = {}) {
  return request(`/api/homework/${id}/`, token, {
    method: 'PUT',
    body: data,
    ...opts,
  });
}

// Patch homework (partial update)
export function patchHomework(id, data, token, opts = {}) {
  return request(`/api/homework/${id}/`, token, {
    method: 'PATCH',
    body: data,
    ...opts,
  });
}

// Delete homework
export function deleteHomework(id, token, opts = {}) {
  return request(`/api/homework/${id}/`, token, {
    method: 'DELETE',
    ...opts,
  });
}

// Get current user's homeworks
export function getMyHomeworks(token, opts = {}) {
  return request('/api/homework/my_homework/', token, opts);
}

// Get homework statistics
export function getHomeworkStatistics(token, opts = {}) {
  return request('/api/homework/statistics/', token, opts);
}

// Add a task to a homework
export function addTaskToHomework(homeworkId, taskData, token, opts = {}) {
  return request(`/api/homework/${homeworkId}/add_task/`, token, {
    method: 'POST',
    body: taskData,
    ...opts,
  });
}

// Get progress of a homework
export function getHomeworkProgress(homeworkId, token, opts = {}) {
  return request(`/api/homework/${homeworkId}/progress/`, token, opts);
}

// Get tasks for a homework
export function getHomeworkTasks(homeworkId, token, opts = {}) {
  return request(`/api/homework/${homeworkId}/tasks/`, token, opts);
}
