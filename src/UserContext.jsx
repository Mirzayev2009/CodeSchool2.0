import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";

const UserContext = createContext();

export function useUser() {
  return useContext(UserContext);
}

export function UserProvider({ children }) {
  // Load user & token from localStorage to avoid an extra fetch on mount
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem("user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem("token") || null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Guard to prevent duplicate concurrent profile fetches
  const didFetchProfileRef = useRef(false);

  // ---- fetchProfile: stable via useCallback ----
  const fetchProfile = useCallback(
    async (currentToken = token) => {
      if (!currentToken) return null;
      // If we've already successfully fetched the profile and user is present,
      // don't fetch again.
      if (didFetchProfileRef.current && user) {
        return user;
      }

      didFetchProfileRef.current = true;
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(
          "https://sanjar1718.pythonanywhere.com/api/profile/",
          {
            headers: { Authorization: `Token ${currentToken}` },
          }
        );

        if (res.ok) {
          const data = await res.json();
          setUser(data);
          try {
            localStorage.setItem("user", JSON.stringify(data));
          } catch (e) {
            /* ignore localStorage errors */
          }
          setError(null);
          return data;
        } else {
          // Token invalid or expired: clean up
          setUser(null);
          setToken(null);
          try {
            localStorage.removeItem("user");
            localStorage.removeItem("token");
          } catch (e) {}
          setError("Failed to fetch profile");
          return null;
        }
      } catch (e) {
        setUser(null);
        setError("Network error");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [token, user]
  );

  // Run fetchProfile once on mount or when a new token appears and no user exists.
  useEffect(() => {
    if (token && !user) {
      // fetch profile for the token
      fetchProfile(token).catch((err) => {
        // defensive log
        // eslint-disable-next-line no-console
        console.error("fetchProfile error:", err);
      });
    }
    // fetchProfile is stable via useCallback, include it to satisfy lint rules
  }, [token, user, fetchProfile]);

  // ---- login: stable via useCallback ----
  const login = useCallback(
    async (username, password) => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          "https://sanjar1718.pythonanywhere.com/api/login/",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
          }
        );
        const data = await res.json();

        if (res.ok && data.token) {
          const newToken = data.token;
          setToken(newToken);
          try {
            localStorage.setItem("token", newToken);
          } catch (e) {}
          if (data.user) {
            setUser(data.user);
            try {
              localStorage.setItem("user", JSON.stringify(data.user));
            } catch (e) {}
          } else {
            // If backend didn't return user in login, fetch profile once
            didFetchProfileRef.current = false; // allow fetchProfile to run
            await fetchProfile(newToken);
          }
          setError(null);
          return true;
        } else {
          const msg = data.message || "Login failed";
          setError(msg);
          setUser(null);
          setToken(null);
          try {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
          } catch (e) {}
          return false;
        }
      } catch (e) {
        setError("Network error");
        setUser(null);
        setToken(null);
        try {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        } catch (err) {}
        return false;
      } finally {
        setLoading(false);
      }
    },
    [fetchProfile]
  );

  // ---- register: stable via useCallback ----
  const register = useCallback(
    async (formData) => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          "https://sanjar1718.pythonanywhere.com/api/register/",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
          }
        );
        const data = await res.json();
        if (res.ok && data.token) {
          const newToken = data.token;
          setToken(newToken);
          try {
            localStorage.setItem("token", newToken);
          } catch (e) {}
          if (data.user) {
            setUser(data.user);
            try {
              localStorage.setItem("user", JSON.stringify(data.user));
            } catch (e) {}
          } else {
            didFetchProfileRef.current = false;
            await fetchProfile(newToken);
          }
          setError(null);
          return true;
        } else {
          setError(data.message || "Registration failed");
          setUser(null);
          setToken(null);
          try {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
          } catch (e) {}
          return false;
        }
      } catch (e) {
        setError("Network error");
        setUser(null);
        setToken(null);
        try {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        } catch (err) {}
        return false;
      } finally {
        setLoading(false);
      }
    },
    [fetchProfile]
  );

  // ---- logout: stable via useCallback ----
  const logout = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (token) {
        await fetch("https://sanjar1718.pythonanywhere.com/api/logout/", {
          method: "POST",
          headers: { Authorization: `Token ${token}` },
        });
      }
    } catch (e) {
      // ignore network errors on logout
    } finally {
      setUser(null);
      setToken(null);
      try {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      } catch (err) {}
      setLoading(false);
    }
  }, [token]);

  // Memoize context value so consumers are stable
  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      error,
      login,
      logout,
      register,
      fetchProfile,
    }),
    [user, token, loading, error, login, logout, register, fetchProfile]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}
