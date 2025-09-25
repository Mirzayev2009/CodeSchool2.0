
// ============================================================================
// attendanceApi.js - CORRECTED VERSION
// ============================================================================
const BASE_URL = 'https://sanjar1718.pythonanywhere.com';


export async function getTeacherGroups(token) {
  const response = await fetch(`${BASE_URL}/api/groups/`, { // Changed from /api/teachers/groups/
    headers: { 'Authorization': `Token ${token}` }
  });
  if (!response.ok) throw new Error('Failed to fetch teacher groups');
  return response.json();
}

export async function getTeacherGroupDetail(groupId, token) {
  const response = await fetch(`${BASE_URL}/api/groups/${groupId}/`, { // This endpoint should return group with students
    headers: { 'Authorization': `Token ${token}` }
  });
  if (!response.ok) throw new Error('Failed to fetch group detail');
  return response.json();
}

export async function getTeacherStudents(token, groupId = null) {
  let url = `${BASE_URL}/api/students/`; // Changed from /api/teachers/students/
  if (groupId) url += `?group=${groupId}`;
  const response = await fetch(url, {
    headers: { 'Authorization': `Token ${token}` }
  });
  if (!response.ok) throw new Error('Failed to fetch students');
  return response.json();
}

export async function getAttendance(token) {
  const response = await fetch(`${BASE_URL}/api/attendance/`, {
    headers: { 'Authorization': `Token ${token}` }
  });
  if (!response.ok) throw new Error('Failed to fetch attendance');
  return response.json();
}

export async function getAttendanceDetail(id, token) {
  const response = await fetch(`${BASE_URL}/api/attendance/${id}/`, {
    headers: { 'Authorization': `Token ${token}` }
  });
  if (!response.ok) throw new Error('Failed to fetch attendance detail');
  return response.json();
}

export async function createAttendance(data, token) {
  const response = await fetch(`${BASE_URL}/api/attendance/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    },
    body: JSON.stringify(data)
  });
  if (!response.ok) throw new Error('Failed to create attendance');
  return response.json();
}

export async function updateAttendance(id, data, token) {
  const response = await fetch(`${BASE_URL}/api/attendance/${id}/`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    },
    body: JSON.stringify(data)
  });
  if (!response.ok) throw new Error('Failed to update attendance');
  return response.json();
}

export async function patchAttendance(id, data, token) {
  const response = await fetch(`${BASE_URL}/api/attendance/${id}/`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    },
    body: JSON.stringify(data)
  });
  if (!response.ok) throw new Error('Failed to patch attendance');
  return response.json();
}

export async function deleteAttendance(id, token) {
  const response = await fetch(`${BASE_URL}/api/attendance/${id}/`, {
    method: 'DELETE',
    headers: { 'Authorization': `Token ${token}` }
  });
  if (!response.ok) throw new Error('Failed to delete attendance');
}

export async function getAttendanceByGroup(groupId, date, token) {
  const response = await fetch(`${BASE_URL}/api/attendance/by_group/?group_id=${groupId}&date=${date}`, {
    headers: { 'Authorization': `Token ${token}` }
  });
  if (!response.ok) throw new Error('Failed to fetch group attendance');
  return response.json();
}

export async function getAttendanceByStudent(studentId, token) {
  const response = await fetch(`${BASE_URL}/api/attendance/by_student/?student_id=${studentId}`, {
    headers: { 'Authorization': `Token ${token}` }
  });
  if (!response.ok) throw new Error('Failed to fetch student attendance');
  return response.json();
}

export async function bulkCreateAttendance(records, token) {
  const response = await fetch(`${BASE_URL}/api/attendance/bulk_create/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    },
    body: JSON.stringify(records)
  });
  if (!response.ok) throw new Error('Failed to bulk create attendance');
  return response.json();
}
