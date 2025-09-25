// src/components/StudentHeader.jsx
"use client";

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function StudentHeader() {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showGroups, setShowGroups] = useState(false);
  const [token, setToken] = useState(() => localStorage.getItem("Token"));
  const navigate = useNavigate();

  // Run once on mount. No interval polling and no isDarkMode in deps.
  useEffect(() => {
    const savedTheme = localStorage.getItem("darkMode");
    if (savedTheme !== null) {
      const dark = savedTheme === "true";
      setIsDarkMode(dark);
      document.documentElement.classList.toggle("dark", dark);
    }

    // storage event listens only for other windows/tabs changing localStorage.
    const handleStorage = (e) => {
      if (e.key === "darkMode") {
        const dark = e.newValue === "true";
        setIsDarkMode(dark);
        document.documentElement.classList.toggle("dark", dark);
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const handleLogout = () => {
    // close UI
    setShowLogoutModal(false);
    setShowProfileDropdown(false);

    // remove token (ensure key matches whatever your auth uses)
    try {
      localStorage.removeItem("authToken"); // <-- make sure this matches auth code
      console.log("authToken after remove:", localStorage.getItem("authToken")); // should be null
    } catch (err) {
      console.error("failed to remove token", err);
    }
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    // navigate to login
    navigate("/", { replace: true });
  };

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem("darkMode", String(newTheme));
    document.documentElement.classList.toggle("dark", newTheme);
  };

  return (
    <>
      <header
        className={`sticky top-0 z-50 ${
          isDarkMode
            ? "bg-gray-900 border-gray-700"
            : "bg-white border-gray-200"
        } border-b`}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link to="/student/dashboard" className="flex items-center">
                <span className="text-2xl font-bold mr-4 text-blue-600 font-['Pacifico']">
                  CodeSchool
                </span>
              </Link>

              <nav className="flex items-center space-x-6">
                <Link
                  to="/student/dashboard"
                  className={`text-sm font-medium transition-colors ${
                    isDarkMode
                      ? "text-gray-300 hover:text-white"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <i className="ri-home-line w-4 h-4 inline-flex mr-2" />
                  Dashboard
                </Link>

                <Link
                  to="/student/lessons"
                  className={`text-sm font-medium transition-colors ${
                    isDarkMode
                      ? "text-gray-300 hover:text-white"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <i className="ri-file-list-line w-4 h-4 inline-flex mr-2" />
                  Lessons
                </Link>

                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowGroups((prev) => !prev)}
                    className={`flex items-center text-sm font-medium px-3 py-2 rounded-lg transition-colors ${
                      isDarkMode
                        ? "text-gray-300 hover:text-white hover:bg-gray-800"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                  >
                    <i className="ri-group-line w-4 h-4 mr-2" />
                    My Groups
                  </button>

                  {showGroups && (
                    <div
                      className={`absolute top-full left-0 mt-2 w-64 border rounded-lg shadow-lg py-2 z-50 ${
                        isDarkMode
                          ? "bg-gray-800 border-gray-700"
                          : "bg-white border-gray-200"
                      }`}
                    >
                      {[
                        {
                          id: 1,
                          color: "bg-blue-500",
                          name: "JavaScript Fundamentals",
                        },
                        {
                          id: 2,
                          color: "bg-cyan-500",
                          name: "React Development",
                        },
                        {
                          id: 3,
                          color: "bg-green-500",
                          name: "Python for Beginners",
                        },
                        {
                          id: 4,
                          color: "bg-purple-500",
                          name: "Database Design",
                        },
                      ].map((g) => (
                        <Link
                          key={g.id}
                          to={`/student/groups/${g.id}`}
                          onClick={() => setShowGroups(false)}
                          className={`flex items-center px-4 py-2 text-sm ${
                            isDarkMode
                              ? "text-gray-300 hover:bg-gray-700"
                              : "text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          <div
                            className={`w-3 h-3 ${g.color} rounded-full mr-3`}
                          />
                          {g.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </nav>
            </div>

            <div className="flex items-center space-x-4">
              <button
                type="button"
                onClick={toggleTheme}
                className={`p-2 rounded-lg transition-colors ${
                  isDarkMode
                    ? "text-gray-300 hover:text-white hover:bg-gray-800"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                }`}
                title="Toggle theme"
              >
                <i
                  className={`${
                    isDarkMode ? "ri-sun-line" : "ri-moon-line"
                  } w-5 h-5 inline-flex`}
                />
              </button>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowProfileDropdown((prev) => !prev)}
                  className={`flex items-center space-x-3 p-2 rounded-lg transition-colors ${
                    isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-50"
                  }`}
                >
                  <img
                    src="https://readdy.ai/api/search-image?query=student&width=80&height=80"
                    alt="Student"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div className="text-sm hidden sm:block">
                    <p
                      className={`${
                        isDarkMode ? "text-white" : "text-gray-900"
                      } font-medium`}
                    >
                      Alex Johnson
                    </p>
                    <p
                      className={`${
                        isDarkMode ? "text-gray-400" : "text-gray-500"
                      } text-xs`}
                    >
                      Student
                    </p>
                  </div>
                  <i
                    className={`ri-arrow-down-s-line w-4 h-4 inline-flex ${
                      showProfileDropdown ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {showProfileDropdown && (
                  <div
                    className={`absolute right-0 mt-2 w-48 ${
                      isDarkMode
                        ? "bg-gray-800 border-gray-700"
                        : "bg-white border-gray-200"
                    } rounded-lg shadow-lg border py-1 z-50`}
                  >
                    <Link
                      to="/student/profile"
                      onClick={() => setShowProfileDropdown(false)}
                      className={`flex items-center px-4 py-2 text-sm ${
                        isDarkMode
                          ? "text-gray-300 hover:bg-gray-700"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <i className="ri-user-line w-4 h-4 inline-flex mr-3" />
                      Profile
                    </Link>
                    <div
                      className={`border-t ${
                        isDarkMode ? "border-gray-700" : "border-gray-100"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setShowProfileDropdown(false);
                        setShowLogoutModal(true);
                      }}
                      className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <i className="ri-logout-circle-line w-4 h-4 inline-flex mr-3" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div
            className={`${
              isDarkMode ? "bg-gray-800" : "bg-white"
            } rounded-lg p-6 max-w-md w-full mx-4`}
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                <i className="ri-logout-circle-line w-6 h-6 text-red-600 inline-flex" />
              </div>
              <h3
                className={`${
                  isDarkMode ? "text-white" : "text-gray-900"
                } text-lg font-semibold`}
              >
                Are you sure?
              </h3>
            </div>
            <p
              className={`${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              } mb-6`}
            >
              You will be logged out and need to sign in again to access your
              account.
            </p>
            <div className="flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                className={`px-4 py-2 text-sm rounded-md ${
                  isDarkMode
                    ? "bg-gray-700 text-gray-300"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="px-4 py-2 text-sm bg-red-600 text-white rounded-md"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
