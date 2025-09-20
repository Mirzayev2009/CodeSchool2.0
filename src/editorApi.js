// src/editorApi.js
// API helper for code editor endpoints

const BASE_URL = 'https://sanjar1718.pythonanywhere.com';

export async function executeCode({ code, language, input, token }) {
  const res = await fetch(`${BASE_URL}/editor/execute/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Token ${token}` } : {})
    },
    body: JSON.stringify({ code, language, input })
  });
  if (!res.ok) throw new Error('Failed to execute code');
  return res.json();
}

export async function testCode({ code, language, task_id, token }) {
  const res = await fetch(`${BASE_URL}/editor/test/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Token ${token}` } : {})
    },
    body: JSON.stringify({ code, language, task_id })
  });
  if (!res.ok) throw new Error('Failed to test code');
  return res.json();
}
