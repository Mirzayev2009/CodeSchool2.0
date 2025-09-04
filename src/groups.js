// ------------------- GROUP MANAGEMENT -------------------

export async function getGroups(token) {
  return fetch('/accounts/groups/', {
    headers: { 'Authorization': `Token ${token}` }
  }).then(res => res.json());
}

export async function getGroup(id, token) {
  return fetch(`/accounts/groups/${id}/`, {
    headers: { 'Authorization': `Token ${token}` }
  }).then(res => res.json());
}

export async function createGroup(data, token) {
  return fetch('/accounts/groups/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    },
    body: JSON.stringify(data)
  }).then(res => res.json());
}

export async function updateGroup(id, data, token) {
  return fetch(`/accounts/groups/${id}/`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    },
    body: JSON.stringify(data)
  }).then(res => res.json());
}

export async function patchGroup(id, data, token) {
  return fetch(`/accounts/groups/${id}/`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    },
    body: JSON.stringify(data)
  }).then(res => res.json());
}

export async function deleteGroup(id, token) {
  return fetch(`/accounts/groups/${id}/`, {
    method: 'DELETE',
    headers: { 'Authorization': `Token ${token}` }
  });
}