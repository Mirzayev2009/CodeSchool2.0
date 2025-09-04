// src/submissionApi.js
// API helper for submissions

export async function getSubmissions(token) {
  return fetch('/api/submissions/submissions/', {
    headers: { 'Authorization': `Token ${token}` }
  }).then(res => res.json());
}

export async function getSubmission(id, token) {
  return fetch(`/api/submissions/submissions/${id}/`, {
    headers: { 'Authorization': `Token ${token}` }
  }).then(res => res.json());
}

export async function createSubmission(data, token) {
  return fetch('/api/submissions/submissions/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    },
    body: JSON.stringify(data)
  }).then(res => res.json());
}

export async function updateSubmission(id, data, token) {
  return fetch(`/api/submissions/submissions/${id}/`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    },
    body: JSON.stringify(data)
  }).then(res => res.json());
}

export async function patchSubmission(id, data, token) {
  return fetch(`/api/submissions/submissions/${id}/`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    },
    body: JSON.stringify(data)
  }).then(res => res.json());
}

export async function deleteSubmission(id, token) {
  return fetch(`/api/submissions/submissions/${id}/`, {
    method: 'DELETE',
    headers: { 'Authorization': `Token ${token}` }
  });
}

export async function getMySubmissions(token) {
  return fetch('/api/submissions/submissions/my_submissions/', {
    headers: { 'Authorization': `Token ${token}` }
  }).then(res => res.json());
}

export async function getSubmissionStatistics(token) {
  return fetch('/api/submissions/submissions/statistics/', {
    headers: { 'Authorization': `Token ${token}` }
  }).then(res => res.json());
}

export async function getTaskAnalytics(token) {
  return fetch('/api/submissions/submissions/task_analytics/', {
    headers: { 'Authorization': `Token ${token}` }
  }).then(res => res.json());
}

export async function evaluateSubmission(id, data, token) {
  return fetch(`/api/submissions/submissions/${id}/evaluate/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    },
    body: JSON.stringify(data)
  }).then(res => res.json());
}
