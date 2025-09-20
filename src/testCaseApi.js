// src/testCaseApi.js
// API helper for test cases & submissions

// ---------- TEST CASES ----------
export async function getTestCases(token) {
  return fetch('/api/test-cases/', {
    headers: { 'Authorization': `Token ${token}` }
  }).then(res => res.json());
}

export async function getTestCase(id, token) {
  return fetch(`/api/test-cases/${id}/`, {
    headers: { 'Authorization': `Token ${token}` }
  }).then(res => res.json());
}

export async function createTestCase(data, token) {
  return fetch('/api/test-cases/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    },
    body: JSON.stringify(data)
  }).then(res => res.json());
}

export async function updateTestCase(id, data, token) {
  return fetch(`/api/test-cases/${id}/`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    },
    body: JSON.stringify(data)
  }).then(res => res.json());
}

export async function patchTestCase(id, data, token) {
  return fetch(`/api/test-cases/${id}/`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    },
    body: JSON.stringify(data)
  }).then(res => res.json());
}

export async function deleteTestCase(id, token) {
  return fetch(`/api/test-cases/${id}/`, {
    method: 'DELETE',
    headers: { 'Authorization': `Token ${token}` }
  });
}

export async function getTaskTestCases(token) {
  return fetch('/api/test-cases/task_test_cases/', {
    headers: { 'Authorization': `Token ${token}` }
  }).then(res => res.json());
}

// ---------- SUBMISSIONS ----------
export async function getSubmissions(token) {
  return fetch('/api/submissions/', {
    headers: { 'Authorization': `Token ${token}` }
  }).then(res => res.json());
}

export async function getSubmission(id, token) {
  return fetch(`/api/submissions/${id}/`, {
    headers: { 'Authorization': `Token ${token}` }
  }).then(res => res.json());
}

export async function createSubmission(data, token) {
  return fetch('/api/submissions/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    },
    body: JSON.stringify(data)
  }).then(res => res.json());
}

export async function updateSubmission(id, data, token) {
  return fetch(`/api/submissions/${id}/`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    },
    body: JSON.stringify(data)
  }).then(res => res.json());
}

export async function patchSubmission(id, data, token) {
  return fetch(`/api/submissions/${id}/`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    },
    body: JSON.stringify(data)
  }).then(res => res.json());
}

export async function deleteSubmission(id, token) {
  return fetch(`/api/submissions/${id}/`, {
    method: 'DELETE',
    headers: { 'Authorization': `Token ${token}` }
  });
}

// ---- EXTRA SUBMISSION ROUTES ----
export async function autoTestSubmission(id, token) {
  return fetch(`/api/submissions/${id}/auto_test/`, {
    method: 'POST',
    headers: { 'Authorization': `Token ${token}` }
  }).then(res => res.json());
}

export async function evaluateSubmission(id, data, token) {
  return fetch(`/api/submissions/${id}/evaluate/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    },
    body: JSON.stringify(data)
  }).then(res => res.json());
}

export async function getMySubmissions(token) {
  return fetch('/api/submissions/my_submissions/', {
    headers: { 'Authorization': `Token ${token}` }
  }).then(res => res.json());
}

export async function getSubmissionStatistics(token) {
  return fetch('/api/submissions/statistics/', {
    headers: { 'Authorization': `Token ${token}` }
  }).then(res => res.json());
}

export async function getTaskAnalytics(token) {
  return fetch('/api/submissions/task_analytics/', {
    headers: { 'Authorization': `Token ${token}` }
  }).then(res => res.json());
}
