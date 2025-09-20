// src/adminPanelApi.js
// API helper for Admin Panel (courses, groups, payments, students, etc.)

const BASE_URL = 'https://sanjar1718.pythonanywhere.com';

// ---------- COURSES ----------
export async function getCourses(token) {
  return fetch(`${BASE_URL}/api/admin-panel/courses/`, {
    headers: { 'Authorization': `Token ${token}` }
  }).then(res => res.json());
}

export async function createCourse(data, token) {
  return fetch(`${BASE_URL}/api/admin-panel/courses/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    },
    body: JSON.stringify(data)
  }).then(res => res.json());
}

export async function getCourse(id, token) {
  return fetch(`${BASE_URL}/api/admin-panel/courses/${id}/`, {
    headers: { 'Authorization': `Token ${token}` }
  }).then(res => res.json());
}

export async function updateCourse(id, data, token) {
  return fetch(`${BASE_URL}/api/admin-panel/courses/${id}/`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    },
    body: JSON.stringify(data)
  }).then(res => res.json());
}

export async function patchCourse(id, data, token) {
  return fetch(`${BASE_URL}/api/admin-panel/courses/${id}/`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    },
    body: JSON.stringify(data)
  }).then(res => res.json());
}

export async function deleteCourse(id, token) {
  return fetch(`${BASE_URL}/api/admin-panel/courses/${id}/`, {
    method: 'DELETE',
    headers: { 'Authorization': `Token ${token}` }
  });
}

// ---------- DASHBOARD ----------
export async function getDashboard(token) {
  return fetch(`${BASE_URL}/api/admin-panel/dashboard/`, {
    headers: { 'Authorization': `Token ${token}` }
  }).then(res => res.json());
}

// ---------- GROUPS ----------
export async function getGroups(token) {
  return fetch(`${BASE_URL}/api/admin-panel/groups/`, {
    headers: { 'Authorization': `Token ${token}` }
  }).then(res => res.json());
}

export async function createGroup(data, token) {
  return fetch(`${BASE_URL}/api/admin-panel/groups/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    },
    body: JSON.stringify(data)
  }).then(res => res.json());
}

export async function getGroup(id, token) {
  return fetch(`${BASE_URL}/api/admin-panel/groups/${id}/`, {
    headers: { 'Authorization': `Token ${token}` }
  }).then(res => res.json());
}

export async function updateGroup(id, data, token) {
  return fetch(`${BASE_URL}/api/admin-panel/groups/${id}/`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    },
    body: JSON.stringify(data)
  }).then(res => res.json());
}

export async function patchGroup(id, data, token) {
  return fetch(`${BASE_URL}/api/admin-panel/groups/${id}/`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    },
    body: JSON.stringify(data)
  }).then(res => res.json());
}

export async function deleteGroup(id, token) {
  return fetch(`${BASE_URL}/api/admin-panel/groups/${id}/`, {
    method: 'DELETE',
    headers: { 'Authorization': `Token ${token}` }
  });
}

// ---------- PAYMENT STATUSES ----------
export async function getPaymentStatuses(token) {
  return fetch(`${BASE_URL}/api/admin-panel/payment-statuses/`, {
    headers: { 'Authorization': `Token ${token}` }
  }).then(res => res.json());
}

export async function createPaymentStatus(data, token) {
  return fetch(`${BASE_URL}/api/admin-panel/payment-statuses/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    },
    body: JSON.stringify(data)
  }).then(res => res.json());
}

export async function getPaymentStatus(id, token) {
  return fetch(`${BASE_URL}/api/admin-panel/payment-statuses/${id}/`, {
    headers: { 'Authorization': `Token ${token}` }
  }).then(res => res.json());
}

export async function updatePaymentStatus(id, data, token) {
  return fetch(`${BASE_URL}/api/admin-panel/payment-statuses/${id}/`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    },
    body: JSON.stringify(data)
  }).then(res => res.json());
}

export async function patchPaymentStatus(id, data, token) {
  return fetch(`${BASE_URL}/api/admin-panel/payment-statuses/${id}/`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    },
    body: JSON.stringify(data)
  }).then(res => res.json());
}

export async function deletePaymentStatus(id, token) {
  return fetch(`${BASE_URL}/api/admin-panel/payment-statuses/${id}/`, {
    method: 'DELETE',
    headers: { 'Authorization': `Token ${token}` }
  });
}

// extra payment-status actions
export async function reactivateStudent(id, token) {
  return fetch(`${BASE_URL}/api/admin-panel/payment-statuses/${id}/reactivate_student/`, {
    method: 'POST',
    headers: { 'Authorization': `Token ${token}` }
  }).then(res => res.json());
}

export async function sendWarning(id, token) {
  return fetch(`${BASE_URL}/api/admin-panel/payment-statuses/${id}/send_warning/`, {
    method: 'POST',
    headers: { 'Authorization': `Token ${token}` }
  }).then(res => res.json());
}

export async function suspendStudent(id, token) {
  return fetch(`${BASE_URL}/api/admin-panel/payment-statuses/${id}/suspend_student/`, {
    method: 'POST',
    headers: { 'Authorization': `Token ${token}` }
  }).then(res => res.json());
}

export async function updateAllStatuses(token) {
  return fetch(`${BASE_URL}/api/admin-panel/payment-statuses/update_all_statuses/`, {
    method: 'POST',
    headers: { 'Authorization': `Token ${token}` }
  }).then(res => res.json());
}

// ---------- PAYMENTS ----------
export async function getPayments(token) {
  return fetch(`${BASE_URL}/api/admin-panel/payments/`, {
    headers: { 'Authorization': `Token ${token}` }
  }).then(res => res.json());
}

export async function createPayment(data, token) {
  return fetch(`${BASE_URL}/api/admin-panel/payments/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    },
    body: JSON.stringify(data)
  }).then(res => res.json());
}

export async function getPayment(id, token) {
  return fetch(`${BASE_URL}/api/admin-panel/payments/${id}/`, {
    headers: { 'Authorization': `Token ${token}` }
  }).then(res => res.json());
}

export async function updatePayment(id, data, token) {
  return fetch(`${BASE_URL}/api/admin-panel/payments/${id}/`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    },
    body: JSON.stringify(data)
  }).then(res => res.json());
}

export async function patchPayment(id, data, token) {
  return fetch(`${BASE_URL}/api/admin-panel/payments/${id}/`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    },
    body: JSON.stringify(data)
  }).then(res => res.json());
}

export async function deletePayment(id, token) {
  return fetch(`${BASE_URL}/api/admin-panel/payments/${id}/`, {
    method: 'DELETE',
    headers: { 'Authorization': `Token ${token}` }
  });
}

// extra payment actions
export async function addPartialPayment(id, token) {
  return fetch(`${BASE_URL}/api/admin-panel/payments/${id}/add_partial_payment/`, {
    method: 'POST',
    headers: { 'Authorization': `Token ${token}` }
  }).then(res => res.json());
}

export async function markPaymentPaid(id, token) {
  return fetch(`${BASE_URL}/api/admin-panel/payments/${id}/mark_paid/`, {
    method: 'POST',
    headers: { 'Authorization': `Token ${token}` }
  }).then(res => res.json());
}

export async function createMonthlyPayments(token) {
  return fetch(`${BASE_URL}/api/admin-panel/payments/create_monthly_payments/`, {
    method: 'POST',
    headers: { 'Authorization': `Token ${token}` }
  }).then(res => res.json());
}

export async function getPaymentStatistics(token) {
  return fetch(`${BASE_URL}/api/admin-panel/payments/payment_statistics/`, {
    headers: { 'Authorization': `Token ${token}` }
  }).then(res => res.json());
}

export async function getStudentsAtRisk(token) {
  return fetch(`${BASE_URL}/api/admin-panel/payments/students_at_risk/`, {
    headers: { 'Authorization': `Token ${token}` }
  }).then(res => res.json());
}

export async function getSuspensionCandidates(token) {
  return fetch(`${BASE_URL}/api/admin-panel/payments/suspension_candidates/`, {
    headers: { 'Authorization': `Token ${token}` }
  }).then(res => res.json());
}

export async function updateAllPaymentStatuses(token) {
  return fetch(`${BASE_URL}/api/admin-panel/payments/update_all_payment_statuses/`, {
    method: 'POST',
    headers: { 'Authorization': `Token ${token}` }
  }).then(res => res.json());
}

export async function updateOverduePayments(token) {
  return fetch(`${BASE_URL}/api/admin-panel/payments/update_overdue/`, {
    method: 'POST',
    headers: { 'Authorization': `Token ${token}` }
  }).then(res => res.json());
}

// ---------- STUDENT PAYMENT SUMMARY ----------
export async function getStudentPaymentSummary(studentId, token) {
  return fetch(`${BASE_URL}/api/admin-panel/student-payment-summary/${studentId}/`, {
    headers: { 'Authorization': `Token ${token}` }
  }).then(res => res.json());
}

// ---------- STUDENTS ----------
export async function getStudents(token) {
  return fetch(`${BASE_URL}/api/admin-panel/students/`, {
    headers: { 'Authorization': `Token ${token}` }
  }).then(res => res.json());
}

export async function createStudent(data, token) {
  return fetch(`${BASE_URL}/api/admin-panel/students/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    },
    body: JSON.stringify(data)
  }).then(res => res.json());
}

export async function getStudent(id, token) {
  return fetch(`${BASE_URL}/api/admin-panel/students/${id}/`, {
    headers: { 'Authorization': `Token ${token}` }
  }).then(res => res.json());
}

export async function updateStudent(id, data, token) {
  return fetch(`${BASE_URL}/api/admin-panel/students/${id}/`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    },
    body: JSON.stringify(data)
  }).then(res => res.json());
}

export async function patchStudent(id, data, token) {
  return fetch(`${BASE_URL}/api/admin-panel/students/${id}/`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    },
    body: JSON.stringify(data)
  }).then(res => res.json());
}

export async function deleteStudent(id, token) {
  return fetch(`${BASE_URL}/api/admin-panel/students/${id}/`, {
    method: 'DELETE',
    headers: { 'Authorization': `Token ${token}` }
  });
}
