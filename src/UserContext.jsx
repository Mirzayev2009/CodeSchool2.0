// import React, { createContext, useContext, useState, useEffect } from 'react';

// const UserContext = createContext();

// export function useUser() {
//   return useContext(UserContext);
// }

// export function UserProvider({ children }) {
//   const [user, setUser] = useState(null);
//   const [token, setToken] = useState(() => localStorage.getItem('token'));
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);





// // Fetch user profile if token exists
// useEffect(() => {
//   if (token && !user) {
//     fetchProfile(token);
//   }
//   // eslint-disable-next-line
// }, [token]);

// // Login function
// async function login(username, password) {
//     setLoading(true);
//     setError(null);
//     try {
//         const res = await fetch('/api/auth/login/', {
//             method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ username, password })
//       });
//       const data = await res.json();
//       if (res.ok && data.id) {
//         setUser(data);
//         setError(null);
//         // Optionally set a dummy token if needed for other requests
//         setToken('dummy-token');
//         localStorage.setItem('token', 'dummy-token');
//         return true;
//       } else {
//         setError(data.message || 'Login failed');
//         setUser(null);
//         setToken(null);
//         localStorage.removeItem('token');
//         return false;
//       }
//     } catch (e) {
//       setError('Network error');
//       setUser(null);
//       setToken(null);
//       localStorage.removeItem('token');
//       return false;
//     } finally {
//       setLoading(false);
//     }
//   }

//   // Register function
//   async function register(formData) {
//     setLoading(true);
//     setError(null);
//     try {
//       const res = await fetch('/api/auth/register/', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(formData)
//       });
//       const data = await res.json();
//       if (res.ok && data.token) {
//         setToken(data.token);
//         localStorage.setItem('token', data.token);
//         setUser(data.user);
//         setError(null);
//         return true;
//       } else {
//         setError(data.message || 'Registration failed');
//         setUser(null);
//         setToken(null);
//         localStorage.removeItem('token');
//         return false;
//       }
//     } catch (e) {
//       setError('Network error');
//       setUser(null);
//       setToken(null);
//       localStorage.removeItem('token');
//       return false;
//     } finally {
//       setLoading(false);
//     }
//   }

//   // Logout function
//   async function logout() {
//     setLoading(true);
//     setError(null);
//     try {
//       await fetch('/api/auth/logout/', {
//         method: 'POST',
//         headers: { 'Authorization': `Token ${token}` }
//       });
//     } catch (e) {
//       // ignore network errors on logout
//     }
//     setUser(null);
//     setToken(null);
//     localStorage.removeItem('token');
//     setLoading(false);
//   }


//   // Dummy fetchProfile so it won’t wipe user
// async function fetchProfile() {
//   // ✅ Just restore from token for demo
//   if (token === "13f237bff66623373085e07d24277d24528e0af8") {
//     setUser({
//       id: 1,
//       username: "admin",
//       profile_type: "teacher",
//     });
//     return;
//   }

//   // ❌ No backend available
//   setError("Profile fetch not available in demo mode");
// }

//   // Fetch user profile
//   async function fetchProfile(currentToken = token) {
//     setLoading(true);
//     setError(null);
//     try {
//       const res = await fetch('/api/auth/profile/', {
//         headers: { 'Authorization': `Token ${currentToken}` }
//       });
//       if (res.ok) {
//         const data = await res.json();
//         setUser(data);
//         setError(null);
//       } else {
//         setUser(null);
//         setError('Failed to fetch profile');
//       }
//     } catch (e) {
//       setUser(null);
//       setError('Network error');
//     } finally {
//       setLoading(false);
//     }
//   }



//   return (
//     <UserContext.Provider value={{ user, token, loading, error, login, logout, register, fetchProfile, updateProfile }}>
//       {children}
//     </UserContext.Provider>
//   );
// }




import React, { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export function useUser() {
  return useContext(UserContext);
}

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Restore user if token exists
  useEffect(() => {
    if (token && !user) {
      if (token === "13f237bff66623373085e07d24277d24528e0af8") {
        setUser({
          id: 1,
          username: "admin",
          profile_type: "student",
        });
      }
    }
  }, [token, user]);

  // DEMO login
  async function login(username, password) {
    setLoading(true);
    setError(null);

    if (username === "admin" && password === "admin") {
      const fakeUser = {
        id: 1,
        username,
        profile_type: "student",
      };
      const demoToken = "13f237bff66623373085e07d24277d24528e0af8";

setUser(fakeUser);
setToken(demoToken);
localStorage.setItem("token", demoToken);
localStorage.setItem("user", JSON.stringify(fakeUser)); // 👈 save user too


      setLoading(false);
      return true;
    }

    setError("Invalid username or password");
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    setLoading(false);
    return false;
  }

  // DEMO logout
  async function logout() {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
  }

  // DEMO register
  async function register(formData) {
    setError("Registration disabled in demo mode");
    return false;
  }

  // DEMO fetchProfile
  async function fetchProfile() {
    if (token === "13f237bff66623373085e07d24277d24528e0af8") {
      setUser({
        id: 1,
        username: "admin",
        profile_type: "student",
      });
    }
  }

  // DEMO updateProfile
  async function updateProfile(profileData) {
    setUser((prev) => ({ ...prev, ...profileData }));
    return true;
  }

  return (
    <UserContext.Provider
      value={{ user, token, loading, error, login, logout, register, fetchProfile, updateProfile }}
    >
      {children}
    </UserContext.Provider>
  );
}
