// src/notificationsApi.js
const BASE_URL = 'https://sanjar1718.pythonanywhere.com';

// Helper request function
async function request(path, token, { method = 'GET', body = null, signal = undefined, headers = {} } = {}) {
  const hdrs = {
    Accept: 'application/json',
    ...headers,
  };

  // If token param not provided, try localStorage
  const usedToken = token || (typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null);
  if (usedToken) hdrs['Authorization'] = `Token ${usedToken}`;

  if (body && !(body instanceof FormData)) {
    hdrs['Content-Type'] = 'application/json';
    body = JSON.stringify(body);
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: hdrs,
    body,
    signal,
  });

  const text = await res.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch (e) { data = text; }

  if (!res.ok) {
    const err = new Error(`Request failed (${res.status})`);
    err.status = res.status;
    err.body = data;
    throw err;
  }

  return data;
}

// ==================== NOTIFICATIONS ====================

export function getNotifications(token, opts = {}) {
  return request('/api/notifications/', token, opts);
}

export function getUnreadNotifications(token, opts = {}) {
  return request('/api/notifications/unread/', token, opts);
}

export function getNotificationById(id, token, opts = {}) {
  return request(`/api/notifications/${id}/`, token, opts);
}

export function createNotification(data, token, opts = {}) {
  return request('/api/notifications/', token, {
    method: 'POST',
    body: data,
    ...opts,
  });
}

export function updateNotification(id, data, token, opts = {}) {
  return request(`/api/notifications/${id}/`, token, {
    method: 'PUT',
    body: data,
    ...opts,
  });
}

export function partialUpdateNotification(id, data, token, opts = {}) {
  return request(`/api/notifications/${id}/`, token, {
    method: 'PATCH',
    body: data,
    ...opts,
  });
}

export function deleteNotification(id, token, opts = {}) {
  return request(`/api/notifications/${id}/`, token, {
    method: 'DELETE',
    ...opts,
  });
}

export function markNotificationAsRead(id, token, opts = {}) {
  // backend expects POST to mark_read endpoint
  return request(`/api/notifications/${id}/mark_read/`, token, {
    method: 'POST',
    body: {},
    ...opts,
  });
}

export function markAllNotificationsAsRead(notificationIds = [], token, opts = {}) {
  return request('/api/notifications/mark_all_read/', token, {
    method: 'POST',
    body: { notification_ids: notificationIds },
    ...opts,
  });
}

export function getNotificationStats(token, opts = {}) {
  return request('/api/notifications/stats/', token, opts);
}

export function createNotificationAdmin(data, token, opts = {}) {
  return request('/api/notifications/create_notification/', token, {
    method: 'POST',
    body: data,
    ...opts,
  });
}

export function triggerPaymentCheck(token, opts = {}) {
  return request('/api/notifications/trigger_payment_check/', token, {
    method: 'POST',
    body: {},
    ...opts,
  });
}

// ==================== PAYMENT NOTIFICATIONS ====================

export function getPaymentNotifications(token, opts = {}) {
  return request('/api/payment-notifications/', token, opts);
}

export function getPaymentNotificationById(id, token, opts = {}) {
  return request(`/api/payment-notifications/${id}/`, token, opts);
}

export function createPaymentNotification(data, token, opts = {}) {
  return request('/api/payment-notifications/', token, {
    method: 'POST',
    body: data,
    ...opts,
  });
}

export function createPaymentNotificationAdvanced(data, token, opts = {}) {
  return request('/api/payment-notifications/create_payment_notification/', token, {
    method: 'POST',
    body: data,
    ...opts,
  });
}

export function updatePaymentNotification(id, data, token, opts = {}) {
  return request(`/api/payment-notifications/${id}/`, token, {
    method: 'PUT',
    body: data,
    ...opts,
  });
}

export function partialUpdatePaymentNotification(id, data, token, opts = {}) {
  return request(`/api/payment-notifications/${id}/`, token, {
    method: 'PATCH',
    body: data,
    ...opts,
  });
}

export function deletePaymentNotification(id, token, opts = {}) {
  return request(`/api/payment-notifications/${id}/`, token, {
    method: 'DELETE',
    ...opts,
  });
}

// ==================== NOTIFICATION PREFERENCES ====================

export function getNotificationPreferences(token, opts = {}) {
  return request('/api/preferences/', token, opts);
}

export function getMyNotificationPreferences(token, opts = {}) {
  return request('/api/preferences/my_preferences/', token, opts);
}

export function getNotificationPreferencesById(id, token, opts = {}) {
  return request(`/api/preferences/${id}/`, token, opts);
}

export function createNotificationPreferences(data, token, opts = {}) {
  return request('/api/preferences/', token, {
    method: 'POST',
    body: data,
    ...opts,
  });
}

export function updateNotificationPreferences(id, data, token, opts = {}) {
  return request(`/api/preferences/${id}/`, token, {
    method: 'PUT',
    body: data,
    ...opts,
  });
}

export function updateMyNotificationPreferences(data, token, opts = {}) {
  return request('/api/preferences/update_preferences/', token, {
    method: 'PUT',
    body: data,
    ...opts,
  });
}

export function partialUpdateNotificationPreferences(id, data, token, opts = {}) {
  return request(`/api/preferences/${id}/`, token, {
    method: 'PATCH',
    body: data,
    ...opts,
  });
}

export function deleteNotificationPreferences(id, token, opts = {}) {
  return request(`/api/preferences/${id}/`, token, {
    method: 'DELETE',
    ...opts,
  });
}

// ==================== UTILITY FUNCTIONS ====================

export function setAuthToken(token) {
  if (typeof localStorage === 'undefined') return;
  if (token) {
    localStorage.setItem('token', token);
  } else {
    localStorage.removeItem('token');
  }
}

export function getAuthToken() {
  if (typeof localStorage === 'undefined') return null;
  return localStorage.getItem('token');
}

export function removeAuthToken() {
  if (typeof localStorage === 'undefined') return;
  localStorage.removeItem('token');
}

export { request };
