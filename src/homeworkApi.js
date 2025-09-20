// src/homeworkApi.js
// API helper for homework assignments

export async function getHomeworks(token) {
  return fetch('/api/homework/', {
    headers: { 'Authorization': `Token ${token}` }
  }).then(res => res.json());
}

export async function getHomework(id, token) {
  return fetch(`/api/homework/${id}/`, {
    headers: { 'Authorization': `Token ${token}` }
  }).then(res => res.json());
}

export async function createHomework(data, token) {
  return fetch('/api/homework/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    },
    body: JSON.stringify(data)
  }).then(res => res.json());
}

export async function updateHomework(id, data, token) {
  return fetch(`/api/homework/${id}/`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    },
    body: JSON.stringify(data)
  }).then(res => res.json());
}

export async function patchHomework(id, data, token) {
  return fetch(`/api/homework/${id}/`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    },
    body: JSON.stringify(data)
  }).then(res => res.json());
}

export async function deleteHomework(id, token) {
  return fetch(`/api/homework/${id}/`, {
    method: 'DELETE',
    headers: { 'Authorization': `Token ${token}` }
  });
}

export async function getMyHomeworks(token) {
  return fetch('/api/homework/my_homework/', {
    headers: { 'Authorization': `Token ${token}` }
  }).then(res => res.json());
}

export async function getHomeworkStatistics(token) {
  return fetch('/api/homework/statistics/', {
    headers: { 'Authorization': `Token ${token}` }
  }).then(res => res.json());
}

export async function addTaskToHomework(id, data, token) {
  return fetch(`/api/homework/${id}/add_task/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    },
    body: JSON.stringify(data)
  }).then(res => res.json());
}

export async function getHomeworkProgress(id, token) {
  return fetch(`/api/homework/${id}/progress/`, {
    headers: { 'Authorization': `Token ${token}` }
  }).then(res => res.json());
}

export async function getHomeworkTasks(id, token) {
  return fetch(`/api/homework/${id}/tasks/`, {
    headers: { 'Authorization': `Token ${token}` }
  }).then(res => res.json());
}
