// src/auth.js
// Simple auth utility for checking login status and user role




// src/auth.js
export function isAuthenticated() {
  return !!localStorage.getItem("token");
}

export function getUserRole() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  return user?.profile_type || null;
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}


// export function isAuthenticated() {
//   return !!localStorage.getItem('authToken');
// }

// export function getUserRole() {
//   return localStorage.getItem('userRole');
// }

// export function logout() {
//   localStorage.removeItem('authToken');
//   localStorage.removeItem('userRole');
//   localStorage.removeItem('userEmail');
// }
