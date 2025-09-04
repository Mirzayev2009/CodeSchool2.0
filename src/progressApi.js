// src/progressApi.js
// API helper for progress tracking

export async function getHomeworkProgress(token) {
  return fetch('/api/progress/homework-progress/', {
    headers: { 'Authorization': `Token ${token}` }
  }).then(res => res.json());
}

export async function createHomeworkProgress(data, token) {
  return fetch('/api/progress/homework-progress/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    },
    body: JSON.stringify(data)
  }).then(res => res.json());
}

export async function getHomeworkProgressSummary(token) {
  return fetch('/api/progress/homework-progress/summary/', {
    headers: { 'Authorization': `Token ${token}` }
  }).then(res => res.json());
}

export async function getHomeworkProgressMy(token) {
  return fetch('/api/progress/homework-progress/my_progress/', {
    headers: { 'Authorization': `Token ${token}` }
  }).then(res => res.json());
}

export async function getHomeworkProgressTeacherDashboard(token) {
  return fetch('/api/progress/homework-progress/teacher_dashboard/', {
    headers: { 'Authorization': `Token ${token}` }
  }).then(res => res.json());
}

export async function getHomeworkProgressLessonAnalytics(token) {
  return fetch('/api/progress/homework-progress/lesson_analytics/', {
    headers: { 'Authorization': `Token ${token}` }
  }).then(res => res.json());
}

export async function getHomeworkProgressById(id, token) {
  return fetch(`/api/progress/homework-progress/${id}/`, {
    headers: { 'Authorization': `Token ${token}` }
  }).then(res => res.json());
}

export async function updateHomeworkProgress(id, data, token) {
  return fetch(`/api/progress/homework-progress/${id}/`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    },
    body: JSON.stringify(data)
  }).then(res => res.json());
}

export async function patchHomeworkProgress(id, data, token) {
  return fetch(`/api/progress/homework-progress/${id}/`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    },
    body: JSON.stringify(data)
  }).then(res => res.json());
}

export async function deleteHomeworkProgress(id, token) {
  return fetch(`/api/progress/homework-progress/${id}/`, {
    method: 'DELETE',
    headers: { 'Authorization': `Token ${token}` }
  });
}

// Task progress
export async function getTaskProgress(token) {
  return fetch('/api/progress/task-progress/', {
    headers: { 'Authorization': `Token ${token}` }
  }).then(res => res.json());
}

export async function createTaskProgress(data, token) {
  return fetch('/api/progress/task-progress/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    },
    body: JSON.stringify(data)
  }).then(res => res.json());
}

export async function getTaskProgressById(id, token) {
  return fetch(`/api/progress/task-progress/${id}/`, {
    headers: { 'Authorization': `Token ${token}` }
  }).then(res => res.json());
}

export async function updateTaskProgress(id, data, token) {
  return fetch(`/api/progress/task-progress/${id}/`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    },
    body: JSON.stringify(data)
  }).then(res => res.json());
}

export async function patchTaskProgress(id, data, token) {
  return fetch(`/api/progress/task-progress/${id}/`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    },
    body: JSON.stringify(data)
  }).then(res => res.json());
}

export async function deleteTaskProgress(id, token) {
  return fetch(`/api/progress/task-progress/${id}/`, {
    method: 'DELETE',
    headers: { 'Authorization': `Token ${token}` }
  });
}

export async function getTaskProgressHomeworkAnalytics(token) {
  return fetch('/api/progress/task-progress/homework_analytics/', {
    headers: { 'Authorization': `Token ${token}` }
  }).then(res => res.json());
}

export async function getTaskProgressMy(token) {
  return fetch('/api/progress/task-progress/my_task_progress/', {
    headers: { 'Authorization': `Token ${token}` }
  }).then(res => res.json());
}

export async function updateTaskProgressFromSubmission(data, token) {
  return fetch('/api/progress/task-progress/update_from_submission/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    },
    body: JSON.stringify(data)
  }).then(res => res.json());
}
