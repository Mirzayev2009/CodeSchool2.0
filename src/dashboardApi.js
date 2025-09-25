// src/teacher/dashboardApi.js
// API helpers for teacher dashboard stats and today's lessons

// Fetch teacher dashboard summary (stats, groups, recent students)
export async function getTeacherDashboard(token) {
  const res = await fetch('https://sanjar1718.pythonanywhere.com/api/dashboard/', {
    headers: { 'Authorization': `Token ${token}` }
  });
  if (!res.ok) throw new Error('Failed to fetch dashboard');
  return res.json();
}

