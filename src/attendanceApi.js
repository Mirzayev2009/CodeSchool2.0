
// Get attendance by group
export async function getAttendanceByGroup(groupId, token) {
  const res = await fetch(`${BASE_URL}/api/attendance/by_group/?group_id=${groupId}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Token ${token}` } : {})
    }
  });
  if (!res.ok) throw new Error('Failed to fetch attendance by group');
  return res.json();
}
// src/attendanceApi.js
// API helper for attendance endpoints

const BASE_URL = 'https://sanjar1718.pythonanywhere.com';

export async function getAttendanceList(token) {
  const res = await fetch(`${BASE_URL}/api/attendance/`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Token ${token}` } : {})
    }
  });
  if (!res.ok) throw new Error('Failed to fetch attendance list');
  return res.json();
}

export async function getAttendanceDetail(id, token) {
  const res = await fetch(`${BASE_URL}/api/attendance/${id}/`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Token ${token}` } : {})
    }
  });
  if (!res.ok) throw new Error('Failed to fetch attendance detail');
  return res.json();
}

export async function createAttendance(data, token) {
  const res = await fetch(`${BASE_URL}/api/attendance/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Token ${token}` } : {})
    },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to create attendance');
  return res.json();
}

export async function updateAttendance(id, data, token) {
  const res = await fetch(`${BASE_URL}/api/attendance/${id}/`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Token ${token}` } : {})
    },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to update attendance');
  return res.json();
}

export async function patchAttendance(id, data, token) {
  const res = await fetch(`${BASE_URL}/api/attendance/${id}/`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Token ${token}` } : {})
    },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to patch attendance');
  return res.json();
}

export async function deleteAttendance(id, token) {
  const res = await fetch(`${BASE_URL}/api/attendance/${id}/`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Token ${token}` } : {})
    }
  });
  if (!res.ok) throw new Error('Failed to delete attendance');
  return true;
}
