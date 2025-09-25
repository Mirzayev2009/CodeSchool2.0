// src/login/page.jsx
import { useState, useEffect, useRef } from "react";
import { useUser } from "../UserContext";
import { useNavigate, useLocation } from "react-router-dom";

export default function LoginPage() {
  const { login, loading: userLoading, error: userError, user } = useUser();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // --- Theme (run once) ---
  useEffect(() => {
    const savedTheme = localStorage.getItem("darkMode");
    if (savedTheme) {
      const darkTheme = savedTheme === "true";
      setIsDarkMode(darkTheme);
      document.documentElement.classList.toggle("dark", darkTheme);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem("darkMode", newTheme.toString());
    document.documentElement.classList.toggle("dark", newTheme);
  };

  // --- Login handler ---
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const success = await login(username, password);
    setIsLoading(false);

    if (!success) {
      setError(userError || "Login failed. Please check your credentials.");
    }
    // Redirect is handled by the user-effect below
  };

  // --- Redirect guards (refs persist across renders) ---
  const hasRedirectedRef = useRef(false);
  const navInProgressRef = useRef(false);

  // --- 1) URL cleanup (run once on mount) ---
  useEffect(() => {
    try {
      const params = new URLSearchParams(location.search);
      if (params.get("loggedout") === "true") {
        params.delete("loggedout");
        navigate(
          {
            pathname: location.pathname,
            search: params.toString(),
          },
          { replace: true }
        );
      }
    } catch (err) {
      console.error("URL cleanup error:", err);
    }
    // run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- 2) Redirect when `user` becomes available ---
  useEffect(() => {
    // only run when `user` changes (don't add pathname here to avoid loops)
    if (!user) {
      // user logged out - reset guards so future login can redirect
      hasRedirectedRef.current = false;
      navInProgressRef.current = false;
      return;
    }

    // already redirected or nav in progress -> nothing to do
    if (hasRedirectedRef.current || navInProgressRef.current) return;

    // decide target route
    let targetRoute = "/dashboard";
    if (user.profile_type === "teacher") targetRoute = "/teacher/dashboard";
    else if (user.profile_type === "student")
      targetRoute = "/student/dashboard";
    else if (user.profile_type === "admin") targetRoute = "/admin/dashboard";

    // if already on target, mark as redirected
    if (location.pathname === targetRoute) {
      hasRedirectedRef.current = true;
      navInProgressRef.current = false;
      return;
    }

    // set guards BEFORE navigating (prevents race/loop)
    hasRedirectedRef.current = true;
    navInProgressRef.current = true;

    navigate(targetRoute, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, navigate]);

  const isDark = isDarkMode;
  return (
    <div
      className={`min-h-screen flex items-center justify-center px-6 transition-colors duration-300 ${
        isDark
          ? "bg-gradient-to-br from-gray-900 to-gray-800"
          : "bg-gradient-to-br from-blue-50 to-indigo-100"
      }`}
    >
      <div className="max-w-md w-full">
        {/* Theme toggle */}
        <div className="flex justify-end mb-4">
          <button
            onClick={toggleTheme}
            className={`p-3 rounded-full transition-colors cursor-pointer ${
              isDark
                ? "text-gray-300 hover:text-white bg-gray-800 hover:bg-gray-700"
                : "text-gray-600 hover:text-gray-800 bg-white hover:bg-gray-50"
            } shadow-lg`}
            title="Toggle theme"
          >
            <i
              className={`${
                isDark ? "ri-sun-line" : "ri-moon-line"
              } w-5 h-5 flex items-center justify-center`}
            />
          </button>
        </div>

        {/* Card */}
        <div
          className={`transition-colors duration-300 ${
            isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"
          } rounded-2xl shadow-xl p-8 border`}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <button
              onClick={() => navigate("/")}
              className="inline-block mb-6 cursor-pointer"
            >
              <span className="text-3xl font-bold text-blue-600 font-pacifico">
                CodeSchool
              </span>
            </button>

            <h2
              className={`text-2xl font-bold mb-2 ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              Login
            </h2>
            <p className={isDark ? "text-gray-300" : "text-gray-600"}>
              Access your dashboard
            </p>
          </div>

          {(error || userError) && (
            <div className="mb-4 p-2 rounded bg-red-100 text-red-700 text-sm border border-red-300">
              {error || userError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6" autoComplete="on">
            <div>
              <label
                htmlFor="username"
                className={`block text-sm font-medium mb-2 ${
                  isDark ? "text-gray-200" : "text-gray-700"
                }`}
              >
                Username
              </label>
              <input
                autoComplete="username"
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm ${
                  isDark
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                }`}
                placeholder="Enter your username"
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className={`block text-sm font-medium mb-2 ${
                  isDark ? "text-gray-200" : "text-gray-700"
                }`}
              >
                Password
              </label>
              <input
                autoComplete="current-password"
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm ${
                  isDark
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                }`}
                placeholder="Enter your password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || userLoading}
              className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-colors whitespace-nowrap cursor-pointer ${
                isLoading || userLoading
                  ? "opacity-50 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              {isLoading || userLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Signing in...
                </div>
              ) : (
                `Sign in`
              )}
            </button>
          </form>

          <div
            className={`mt-8 pt-6 border-t ${
              isDark ? "border-gray-700" : "border-gray-200"
            }`}
          >
            <div className="text-center text-sm">
              <p className={isDark ? "text-gray-300" : "text-gray-600"}>
                Need an account? Contact your administrator.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
