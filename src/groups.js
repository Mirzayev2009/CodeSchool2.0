// ------------------- GROUP MANAGEMENT -------------------

export async function getGroups(token) {
  return fetch('https://sanjar1718.pythonanywhere.com/api/groups/', {
    headers: { 'Authorization': `Token ${token}` }
  }).then(res => res.json());
}

export async function getGroup(id, token) {
  return fetch(`https://sanjar1718.pythonanywhere.com/api/groups/${id}/`, {
    headers: { 'Authorization': `Token ${token}` }
  }).then(res => res.json());
}

export async function createGroup(data, token) {
  return fetch('https://sanjar1718.pythonanywhere.com/api/groups/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    },
    body: JSON.stringify(data)
  }).then(res => res.json());
}

export async function updateGroup(id, data, token) {
  return fetch(`https://sanjar1718.pythonanywhere.com/api/groups/${id}/`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    },
    body: JSON.stringify(data)
  }).then(res => res.json());
}


export async function patchGroup(id, data, token) {
  return fetch(`https://sanjar1718.pythonanywhere.com/api/groups/${id}/`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    },
    body: JSON.stringify(data)
  }).then(res => res.json());
}


export async function deleteGroup(id, token) {
  return fetch(`https://sanjar1718.pythonanywhere.com/api/groups/${id}/`, {
    method: 'DELETE',
    headers: { 'Authorization': `Token ${token}` }
  });
}