// src/attendanceApi.js
// API helper for groups and attendance management



// ------------------- ATTENDANCE MANAGEMENT -------------------

export async function getAttendance(token) {
  return fetch('/courses/attendance/', {
    headers: { 'Authorization': `Token ${token}` }
  }).then(res => res.json());
}

export async function getAttendanceDetail(id, token) {
  return fetch(`/courses/attendance/${id}/`, {
    headers: { 'Authorization': `Token ${token}` }
  }).then(res => res.json());
}

export async function createAttendance(data, token) {
  return fetch('/courses/attendance/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    },
    body: JSON.stringify(data)
  }).then(res => res.json());
}

export async function updateAttendance(id, data, token) {
  return fetch(`/courses/attendance/${id}/`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    },
    body: JSON.stringify(data)
  }).then(res => res.json());
}

export async function patchAttendance(id, data, token) {
  return fetch(`/courses/attendance/${id}/`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    },
    body: JSON.stringify(data)
  }).then(res => res.json());
}

export async function deleteAttendance(id, token) {
  return fetch(`/courses/attendance/${id}/`, {
    method: 'DELETE',
    headers: { 'Authorization': `Token ${token}` }
  });
}

// ------------------- CUSTOM ATTENDANCE ENDPOINTS -------------------

export async function getAttendanceByGroup(groupId, date, token) {
  return fetch(`/courses/attendance/by_group/?group_id=${groupId}&date=${date}`, {
    headers: { 'Authorization': `Token ${token}` }
  }).then(res => res.json());
}

export async function getAttendanceByStudent(studentId, token) {
  return fetch(`/courses/attendance/by_student/?student_id=${studentId}`, {
    headers: { 'Authorization': `Token ${token}` }
  }).then(res => res.json());
}

export async function bulkCreateAttendance(records, token) {
  return fetch('/courses/attendance/bulk_create/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    },
    body: JSON.stringify(records)
  }).then(res => res.json());
}
