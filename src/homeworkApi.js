
// ============================================================================
// homeworkApi.js - CORRECTED VERSION
// ============================================================================

export async function getHomeworks(token) {
  const response = await fetch(`${BASE_URL}/api/homework/`, {
    headers: { 'Authorization': `Token ${token}` }
  });
  if (!response.ok) throw new Error('Failed to fetch homeworks');
  return response.json();
}

export async function getHomework(id, token) {
  const response = await fetch(`${BASE_URL}/api/homework/${id}/`, {
    headers: { 'Authorization': `Token ${token}` }
  });
  if (!response.ok) throw new Error('Failed to fetch homework');
  return response.json();
}

export async function createHomework(data, token) {
  const response = await fetch(`${BASE_URL}/api/homework/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    },
    body: JSON.stringify(data)
  });
  if (!response.ok) throw new Error('Failed to create homework');
  return response.json();
}

export async function updateHomework(id, data, token) {
  const response = await fetch(`${BASE_URL}/api/homework/${id}/`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    },
    body: JSON.stringify(data)
  });
  if (!response.ok) throw new Error('Failed to update homework');
  return response.json();
}

export async function patchHomework(id, data, token) {
  const response = await fetch(`${BASE_URL}/api/homework/${id}/`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    },
    body: JSON.stringify(data)
  });
  if (!response.ok) throw new Error('Failed to patch homework');
  return response.json();
}

export async function deleteHomework(id, token) {
  const response = await fetch(`${BASE_URL}/api/homework/${id}/`, {
    method: 'DELETE',
    headers: { 'Authorization': `Token ${token}` }
  });
  if (!response.ok) throw new Error('Failed to delete homework');
}

export async function getMyHomeworks(token) {
  const response = await fetch(`${BASE_URL}/api/homework/my_homework/`, {
    headers: { 'Authorization': `Token ${token}` }
  });
  if (!response.ok) throw new Error('Failed to fetch my homeworks');
  return response.json();
}

export async function getHomeworkStatistics(token) {
  const response = await fetch(`${BASE_URL}/api/homework/statistics/`, {
    headers: { 'Authorization': `Token ${token}` }
  });
  if (!response.ok) throw new Error('Failed to fetch homework statistics');
  return response.json();
}

export async function addTaskToHomework(homeworkId, taskData, token) {
  const response = await fetch(`${BASE_URL}/api/homework/${homeworkId}/add_task/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    },
    body: JSON.stringify(taskData)
  });
  if (!response.ok) throw new Error('Failed to add task to homework');
  return response.json();
}

export async function getHomeworkProgress(homeworkId, token) {
  const response = await fetch(`${BASE_URL}/api/homework/${homeworkId}/progress/`, {
    headers: { 'Authorization': `Token ${token}` }
  });
  if (!response.ok) throw new Error('Failed to fetch homework progress');
  return response.json();
}

export async function getHomeworkTasks(homeworkId, token) {
  const response = await fetch(`${BASE_URL}/api/homework/${homeworkId}/tasks/`, {
    headers: { 'Authorization': `Token ${token}` }
  });
  if (!response.ok) throw new Error('Failed to fetch homework tasks');
  return response.json();
}
