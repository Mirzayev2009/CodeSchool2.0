// ------------------- TEACHER-SPECIFIC ENDPOINTS -------------------

// Get teacher's groups
export async function getTeacherGroups(token) {
  return fetch('https://sanjar1718.pythonanywhere.com/api/teachers/groups/', {
    headers: { 'Authorization': `Token ${token}` }
  }).then(res => res.json());
}

// Get teacher's group detail (with students)
export async function getTeacherGroupDetail(groupId, token) {
  return fetch(`https://sanjar1718.pythonanywhere.com/api/teachers/groups/${groupId}/`, {
    headers: { 'Authorization': `Token ${token}` }
  }).then(res => res.json());
}

// Get all students from teacher's groups, or filter by group
export async function getTeacherStudents(token, groupId = null) {
  let url = 'https://sanjar1718.pythonanywhere.com/api/teachers/students/';
  if (groupId) url += `?group_id=${groupId}`;
  return fetch(url, {
    headers: { 'Authorization': `Token ${token}` }
  }).then(res => res.json());
}
// src/attendanceApi.js
// API helper for groups and attendance management



// ------------------- ATTENDANCE MANAGEMENT -------------------

export async function getAttendance(token) {
  return fetch('https://sanjar1718.pythonanywhere.com/api/attendance/', {
    headers: { 'Authorization': `Token ${token}` }
  }).then(res => res.json());
}

export async function getAttendanceDetail(id, token) {
  return fetch(`https://sanjar1718.pythonanywhere.com/api/attendance/${id}/`, {
    headers: { 'Authorization': `Token ${token}` }
  }).then(res => res.json());
}

export async function createAttendance(data, token) {
  return fetch('https://sanjar1718.pythonanywhere.com/api/attendance/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    },
    body: JSON.stringify(data)
  }).then(res => res.json());
}

export async function updateAttendance(id, data, token) {
  return fetch(`https://sanjar1718.pythonanywhere.com/api/attendance/${id}/`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    },
    body: JSON.stringify(data)
  }).then(res => res.json());
}

export async function patchAttendance(id, data, token) {
  return fetch(`https://sanjar1718.pythonanywhere.com/api/attendance/${id}/`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    },
    body: JSON.stringify(data)
  }).then(res => res.json());
}

export async function deleteAttendance(id, token) {
  return fetch(`https://sanjar1718.pythonanywhere.com/api/attendance/${id}/`, {
    method: 'DELETE',
    headers: { 'Authorization': `Token ${token}` }
  });
}

// ------------------- CUSTOM ATTENDANCE ENDPOINTS -------------------

export async function getAttendanceByGroup(groupId, date, token) {
  return fetch(`https://sanjar1718.pythonanywhere.com/api/attendance/by_group/?group_id=${groupId}&date=${date}`, {
    headers: { 'Authorization': `Token ${token}` }
  }).then(res => res.json());
}

export async function getAttendanceByStudent(studentId, token) {
  return fetch(`https://sanjar1718.pythonanywhere.com/api/attendance/by_student/?student_id=${studentId}`, {
    headers: { 'Authorization': `Token ${token}` }
  }).then(res => res.json());
}

export async function bulkCreateAttendance(records, token) {
  return fetch('https://sanjar1718.pythonanywhere.com/api/attendance/bulk_create/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    },
    body: JSON.stringify(records)
  }).then(res => res.json());
}
