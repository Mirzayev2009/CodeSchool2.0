
// ============================================================================
// taskApi.js - CORRECTED VERSION  
// ============================================================================
const BASE_URL = 'https://sanjar1718.pythonanywhere.com';


export async function getTasks(token) {
  const response = await fetch(`${BASE_URL}/api/tasks/`, {
    headers: { 'Authorization': `Token ${token}` }
  });
  if (!response.ok) throw new Error('Failed to fetch tasks');
  return response.json();
}

export async function getTask(id, token) {
  const response = await fetch(`${BASE_URL}/api/tasks/${id}/`, {
    headers: { 'Authorization': `Token ${token}` }
  });
  if (!response.ok) throw new Error('Failed to fetch task');
  return response.json();
}

export async function createTask(data, token) {
  const response = await fetch(`${BASE_URL}/api/tasks/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    },
    body: JSON.stringify(data)
  });
  if (!response.ok) throw new Error('Failed to create task');
  return response.json();
}

export async function updateTask(id, data, token) {
  const response = await fetch(`${BASE_URL}/api/tasks/${id}/`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    },
    body: JSON.stringify(data)
  });
  if (!response.ok) throw new Error('Failed to update task');
  return response.json();
}

export async function patchTask(id, data, token) {
  const response = await fetch(`${BASE_URL}/api/tasks/${id}/`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    },
    body: JSON.stringify(data)
  });
  if (!response.ok) throw new Error('Failed to patch task');
  return response.json();
}

export async function deleteTask(id, token) {
  const response = await fetch(`${BASE_URL}/api/tasks/${id}/`, {
    method: 'DELETE',
    headers: { 'Authorization': `Token ${token}` }
  });
  if (!response.ok) throw new Error('Failed to delete task');
}

export async function getTaskSubmissions(id, token) {
  const response = await fetch(`${BASE_URL}/api/tasks/${id}/submissions/`, {
    headers: { 'Authorization': `Token ${token}` }
  });
  if (!response.ok) throw new Error('Failed to fetch task submissions');
  return response.json();
}

export async function getTaskTestCases(id, token) {
  const response = await fetch(`${BASE_URL}/api/tasks/${id}/test_cases/`, {
    headers: { 'Authorization': `Token ${token}` }
  });
  if (!response.ok) throw new Error('Failed to fetch task test cases');
  return response.json();
}
