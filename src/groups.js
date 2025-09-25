const BASE_URL = 'https://sanjar1718.pythonanywhere.com';

export async function getGroups(token) {
  const response = await fetch(`${BASE_URL}/api/groups/`, {
    headers: { 'Authorization': `Token ${token}` }
  });
  if (!response.ok) throw new Error('Failed to fetch groups');
  return response.json();
}

export async function getGroup(id, token) {
  const response = await fetch(`${BASE_URL}/api/groups/${id}/`, {
    headers: { 'Authorization': `Token ${token}` }
  });
  if (!response.ok) throw new Error('Failed to fetch group');
  return response.json();
}

export async function createGroup(data, token) {
  const response = await fetch(`${BASE_URL}/api/groups/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    },
    body: JSON.stringify(data)
  });
  if (!response.ok) throw new Error('Failed to create group');
  return response.json();
}

export async function updateGroup(id, data, token) {
  const response = await fetch(`${BASE_URL}/api/groups/${id}/`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    },
    body: JSON.stringify(data)
  });
  if (!response.ok) throw new Error('Failed to update group');
  return response.json();
}

export async function patchGroup(id, data, token) {
  const response = await fetch(`${BASE_URL}/api/groups/${id}/`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    },
    body: JSON.stringify(data)
  });
  if (!response.ok) throw new Error('Failed to patch group');
  return response.json();
}

export async function deleteGroup(id, token) {
  const response = await fetch(`${BASE_URL}/api/groups/${id}/`, {
    method: 'DELETE',
    headers: { 'Authorization': `Token ${token}` }
  });
  if (!response.ok) throw new Error('Failed to delete group');
}