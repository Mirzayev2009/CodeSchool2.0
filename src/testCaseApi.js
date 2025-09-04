// src/testCaseApi.js
// API helper for test cases

export async function getTestCases(token) {
  return fetch('/api/submissions/test-cases/', {
    headers: { 'Authorization': `Token ${token}` }
  }).then(res => res.json());
}

export async function getTestCase(id, token) {
  return fetch(`/api/submissions/test-cases/${id}/`, {
    headers: { 'Authorization': `Token ${token}` }
  }).then(res => res.json());
}

export async function createTestCase(data, token) {
  return fetch('/api/submissions/test-cases/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    },
    body: JSON.stringify(data)
  }).then(res => res.json());
}

export async function updateTestCase(id, data, token) {
  return fetch(`/api/submissions/test-cases/${id}/`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    },
    body: JSON.stringify(data)
  }).then(res => res.json());
}

export async function patchTestCase(id, data, token) {
  return fetch(`/api/submissions/test-cases/${id}/`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    },
    body: JSON.stringify(data)
  }).then(res => res.json());
}

export async function deleteTestCase(id, token) {
  return fetch(`/api/submissions/test-cases/${id}/`, {
    method: 'DELETE',
    headers: { 'Authorization': `Token ${token}` }
  });
}

export async function getTaskTestCases(token) {
  return fetch('/api/submissions/test-cases/task_test_cases/', {
    headers: { 'Authorization': `Token ${token}` }
  }).then(res => res.json());
}
