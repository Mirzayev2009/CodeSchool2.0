// src/API/AdminPanelApi.js
// Updated API helper with proper payment endpoints

const BASE_URL = 'https://sanjar1718.pythonanywhere.com';

// Helper to handle API errors
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || errorData.error || `API Error: ${response.status}`);
  }
  return response.json();
};

// ---------- COURSES ----------
export async function getCourses(token) {
  const response = await fetch(`${BASE_URL}/api/admin-panel/courses/`, {
    headers: { 'Authorization': `Token ${token}` }
  });
  return handleResponse(response);
}

export async function createCourse(data, token) {
  const response = await fetch(`${BASE_URL}/api/admin-panel/courses/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    },
    body: JSON.stringify(data)
  });
  return handleResponse(response);
}

export async function getCourse(id, token) {
  const response = await fetch(`${BASE_URL}/api/admin-panel/courses/${id}/`, {
    headers: { 'Authorization': `Token ${token}` }
  });
  return handleResponse(response);
}

export async function updateCourse(id, data, token) {
  const response = await fetch(`${BASE_URL}/api/admin-panel/courses/${id}/`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    },
    body: JSON.stringify(data)
  });
  return handleResponse(response);
}

export async function patchCourse(id, data, token) {
  const response = await fetch(`${BASE_URL}/api/admin-panel/courses/${id}/`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    },
    body: JSON.stringify(data)
  });
  return handleResponse(response);
}

export async function deleteCourse(id, token) {
  const response = await fetch(`${BASE_URL}/api/admin-panel/courses/${id}/`, {
    method: 'DELETE',
    headers: { 'Authorization': `Token ${token}` }
  });
  if (!response.ok) {
    throw new Error(`Failed to delete course: ${response.status}`);
  }
  return response;
}

// ---------- DASHBOARD ----------
export async function getDashboard(token) {
  const response = await fetch(`${BASE_URL}/api/admin-panel/dashboard/`, {
    headers: { 'Authorization': `Token ${token}` }
  });
  return handleResponse(response);
}

// ---------- GROUPS ----------
export async function getGroups(token) {
  const response = await fetch(`${BASE_URL}/api/admin-panel/groups/`, {
    headers: { 'Authorization': `Token ${token}` }
  });
  return handleResponse(response);
}

export async function createGroup(data, token) {
  const response = await fetch(`${BASE_URL}/api/admin-panel/groups/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    },
    body: JSON.stringify(data)
  });
  return handleResponse(response);
}

export async function getGroup(id, token) {
  const response = await fetch(`${BASE_URL}/api/admin-panel/groups/${id}/`, {
    headers: { 'Authorization': `Token ${token}` }
  });
  return handleResponse(response);
}

export async function updateGroup(id, data, token) {
  const response = await fetch(`${BASE_URL}/api/admin-panel/groups/${id}/`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    },
    body: JSON.stringify(data)
  });
  return handleResponse(response);
}

export async function patchGroup(id, data, token) {
  const response = await fetch(`${BASE_URL}/api/admin-panel/groups/${id}/`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    },
    body: JSON.stringify(data)
  });
  return handleResponse(response);
}

export async function deleteGroup(id, token) {
  const response = await fetch(`${BASE_URL}/api/admin-panel/groups/${id}/`, {
    method: 'DELETE',
    headers: { 'Authorization': `Token ${token}` }
  });
  if (!response.ok) {
    throw new Error(`Failed to delete group: ${response.status}`);
  }
  return response;
}

// ---------- PAYMENT STATUSES ----------
export async function getPaymentStatuses(token) {
  const response = await fetch(`${BASE_URL}/api/admin-panel/payment-statuses/`, {
    headers: { 'Authorization': `Token ${token}` }
  });
  return handleResponse(response);
}

export async function createPaymentStatus(data, token) {
  const response = await fetch(`${BASE_URL}/api/admin-panel/payment-statuses/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    },
    body: JSON.stringify(data)
  });
  return handleResponse(response);
}

export async function getPaymentStatus(id, token) {
  const response = await fetch(`${BASE_URL}/api/admin-panel/payment-statuses/${id}/`, {
    headers: { 'Authorization': `Token ${token}` }
  });
  return handleResponse(response);
}

export async function updatePaymentStatus(id, data, token) {
  const response = await fetch(`${BASE_URL}/api/admin-panel/payment-statuses/${id}/`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    },
    body: JSON.stringify(data)
  });
  return handleResponse(response);
}

export async function patchPaymentStatus(id, data, token) {
  const response = await fetch(`${BASE_URL}/api/admin-panel/payment-statuses/${id}/`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    },
    body: JSON.stringify(data)
  });
  return handleResponse(response);
}

export async function deletePaymentStatus(id, token) {
  const response = await fetch(`${BASE_URL}/api/admin-panel/payment-statuses/${id}/`, {
    method: 'DELETE',
    headers: { 'Authorization': `Token ${token}` }
  });
  if (!response.ok) {
    throw new Error(`Failed to delete payment status: ${response.status}`);
  }
  return response;
}

export async function reactivateStudent(id, token) {
  const response = await fetch(`${BASE_URL}/api/admin-panel/payment-statuses/${id}/reactivate_student/`, {
    method: 'POST',
    headers: { 'Authorization': `Token ${token}` }
  });
  return handleResponse(response);
}

export async function sendWarning(id, token) {
  const response = await fetch(`${BASE_URL}/api/admin-panel/payment-statuses/${id}/send_warning/`, {
    method: 'POST',
    headers: { 'Authorization': `Token ${token}` }
  });
  return handleResponse(response);
}

export async function suspendStudent(id, token) {
  const response = await fetch(`${BASE_URL}/api/admin-panel/payment-statuses/${id}/suspend_student/`, {
    method: 'POST',
    headers: { 'Authorization': `Token ${token}` }
  });
  return handleResponse(response);
}

export async function updateAllStatuses(token) {
  const response = await fetch(`${BASE_URL}/api/admin-panel/payment-statuses/update_all_statuses/`, {
    method: 'POST',
    headers: { 'Authorization': `Token ${token}` }
  });
  return handleResponse(response);
}

// ---------- PAYMENTS ----------
export async function getPayments(token) {
  const response = await fetch(`${BASE_URL}/api/admin-panel/payments/`, {
    headers: { 'Authorization': `Token ${token}` }
  });
  return handleResponse(response);
}

export async function createPayment(data, token) {
  const response = await fetch(`${BASE_URL}/api/admin-panel/payments/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    },
    body: JSON.stringify(data)
  });
  return handleResponse(response);
}

export async function getPayment(id, token) {
  const response = await fetch(`${BASE_URL}/api/admin-panel/payments/${id}/`, {
    headers: { 'Authorization': `Token ${token}` }
  });
  return handleResponse(response);
}

export async function updatePayment(id, data, token) {
  const response = await fetch(`${BASE_URL}/api/admin-panel/payments/${id}/`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    },
    body: JSON.stringify(data)
  });
  return handleResponse(response);
}

export async function patchPayment(id, data, token) {
  const response = await fetch(`${BASE_URL}/api/admin-panel/payments/${id}/`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    },
    body: JSON.stringify(data)
  });
  return handleResponse(response);
}

export async function deletePayment(id, token) {
  const response = await fetch(`${BASE_URL}/api/admin-panel/payments/${id}/`, {
    method: 'DELETE',
    headers: { 'Authorization': `Token ${token}` }
  });
  if (!response.ok) {
    throw new Error(`Failed to delete payment: ${response.status}`);
  }
  return response;
}

// ---------- PAYMENT ACTIONS ----------

/**
 * Add a partial payment to a payment record
 * @param {string|number} id - Payment ID
 * @param {number} amount - Amount to pay
 * @param {string} token - Auth token
 */
export async function addPartialPayment(id, amount, token) {
  const response = await fetch(`${BASE_URL}/api/admin-panel/payments/${id}/add_partial_payment/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    },
    body: JSON.stringify({ amount })
  });
  return handleResponse(response);
}

/**
 * Mark a payment as fully paid
 * @param {string|number} id - Payment ID
 * @param {string} token - Auth token
 */
export async function markPaymentPaid(id, token) {
  const response = await fetch(`${BASE_URL}/api/admin-panel/payments/${id}/mark_paid/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    }
  });
  return handleResponse(response);
}

export async function createMonthlyPayments(token) {
  const response = await fetch(`${BASE_URL}/api/admin-panel/payments/create_monthly_payments/`, {
    method: 'POST',
    headers: { 'Authorization': `Token ${token}` }
  });
  return handleResponse(response);
}

export async function getPaymentStatistics(token) {
  const response = await fetch(`${BASE_URL}/api/admin-panel/payments/payment_statistics/`, {
    headers: { 'Authorization': `Token ${token}` }
  });
  return handleResponse(response);
}

export async function getStudentsAtRisk(token) {
  const response = await fetch(`${BASE_URL}/api/admin-panel/payments/students_at_risk/`, {
    headers: { 'Authorization': `Token ${token}` }
  });
  return handleResponse(response);
}

export async function getSuspensionCandidates(token) {
  const response = await fetch(`${BASE_URL}/api/admin-panel/payments/suspension_candidates/`, {
    headers: { 'Authorization': `Token ${token}` }
  });
  return handleResponse(response);
}

export async function updateAllPaymentStatuses(token) {
  const response = await fetch(`${BASE_URL}/api/admin-panel/payments/update_all_payment_statuses/`, {
    method: 'POST',
    headers: { 'Authorization': `Token ${token}` }
  });
  return handleResponse(response);
}

export async function updateOverduePayments(token) {
  const response = await fetch(`${BASE_URL}/api/admin-panel/payments/update_overdue/`, {
    method: 'POST',
    headers: { 'Authorization': `Token ${token}` }
  });
  return handleResponse(response);
}

// ---------- STUDENT PAYMENT SUMMARY ----------
export async function getStudentPaymentSummary(studentId, token) {
  const response = await fetch(`${BASE_URL}/api/admin-panel/student-payment-summary/${studentId}/`, {
    headers: { 'Authorization': `Token ${token}` }
  });
  return handleResponse(response);
}

// ---------- STUDENTS ----------
export async function getStudents(token) {
  const response = await fetch(`${BASE_URL}/api/admin-panel/students/`, {
    headers: { 'Authorization': `Token ${token}` }
  });
  return handleResponse(response);
}

export async function createStudent(data, token) {
  const response = await fetch(`${BASE_URL}/api/admin-panel/register/student/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    },
    body: JSON.stringify(data)
  });
  return handleResponse(response);
}

export async function createTeacher(data, token) {
  const response = await fetch(`${BASE_URL}/api/admin-panel/register/teacher/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    },
    body: JSON.stringify(data)
  });
  return handleResponse(response);
}

export async function getStudent(id, token) {
  const response = await fetch(`${BASE_URL}/api/admin-panel/students/${id}/`, {
    headers: { 'Authorization': `Token ${token}` }
  });
  return handleResponse(response);
}

export async function updateStudent(id, data, token) {
  const response = await fetch(`${BASE_URL}/api/admin-panel/students/${id}/`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    },
    body: JSON.stringify(data)
  });
  return handleResponse(response);
}

export async function patchStudent(id, data, token) {
  const response = await fetch(`${BASE_URL}/api/admin-panel/students/${id}/`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    },
    body: JSON.stringify(data)
  });
  return handleResponse(response);
}

export async function deleteStudent(id, token) {
  const response = await fetch(`${BASE_URL}/api/admin-panel/students/${id}/`, {
    method: 'DELETE',
    headers: { 'Authorization': `Token ${token}` }
  });
  if (!response.ok) {
    throw new Error(`Failed to delete student: ${response.status}`);
  }
  return response;
}

// ---------- TEACHERS ----------
export async function getTeachers(token) {
  const response = await fetch(`${BASE_URL}/api/admin-panel/teachers/`, {
    headers: { 'Authorization': `Token ${token}` }
  });
  return handleResponse(response);
}

export async function getTeacher(id, token) {
  const response = await fetch(`${BASE_URL}/api/admin-panel/teachers/${id}/`, {
    headers: { 'Authorization': `Token ${token}` }
  });
  return handleResponse(response);
}

export async function updateTeacher(id, data, token) {
  const response = await fetch(`${BASE_URL}/api/admin-panel/teachers/${id}/`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    },
    body: JSON.stringify(data)
  });
  return handleResponse(response);
}

export async function patchTeacher(id, data, token) {
  const response = await fetch(`${BASE_URL}/api/admin-panel/teachers/${id}/`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    },
    body: JSON.stringify(data)
  });
  return handleResponse(response);
}

export async function deleteTeacher(id, token) {
  const response = await fetch(`${BASE_URL}/api/admin-panel/teachers/${id}/`, {
    method: 'DELETE',
    headers: { 'Authorization': `Token ${token}` }
  });
  if (!response.ok) {
    throw new Error(`Failed to delete teacher: ${response.status}`);
  }
  return response;
}