// src/taskApi.js
// API helper for tasks

export async function getTasks(token) {
  return fetch('/api/assignments/tasks/', {
    headers: { 'Authorization': `Token ${token}` }
  }).then(res => res.json());
}

export async function getTask(id, token) {
  return fetch(`/api/assignments/tasks/${id}/`, {
    headers: { 'Authorization': `Token ${token}` }
  }).then(res => res.json());
}

export async function createTask(data, token) {
  return fetch('/api/assignments/tasks/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    },
    body: JSON.stringify(data)
  }).then(res => res.json());
}

export async function updateTask(id, data, token) {
  return fetch(`/api/assignments/tasks/${id}/`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    },
    body: JSON.stringify(data)
  }).then(res => res.json());
}

export async function patchTask(id, data, token) {
  return fetch(`/api/assignments/tasks/${id}/`, {
 
 
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    },
    body: JSON.stringify(data)
  }).then(res => res.json());
}

export async function deleteTask(id, token) {
  return fetch(`/api/assignments/tasks/${id}/`, {
    method: 'DELETE',
    headers: { 'Authorization': `Token ${token}` }
  });
}

export async function getTaskSubmissions(id, token) {
  return fetch(`/api/assignments/tasks/${id}/submissions/`, {
    headers: { 'Authorization': `Token ${token}` }
  }).then(res => res.json());
}

export async function getTaskTestCases(id, token) {
  return fetch(`/api/assignments/tasks/${id}/test_cases/`, {
    headers: { 'Authorization': `Token ${token}` }
  }).then(res => res.json());
}
