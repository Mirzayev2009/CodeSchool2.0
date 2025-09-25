"use client";

import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import TeacherSidebar from "../../../components/TeacherSidebar";
import QuickStats from "./QuickStats";
import TodayLessons from "./TodayLessons";
import { logout as authLogout } from "../../auth";

export default function TeacherDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // apply saved theme on mount and listen for storage changes from other tabs
  useEffect(() => {
    const applyTheme = () => {
      const savedTheme = localStorage.getItem("darkMode") === "true";
      setIsDarkMode(savedTheme);
      document.documentElement.classList.toggle("dark", savedTheme);
    };

    applyTheme();
    window.addEventListener("storage", applyTheme);
    return () => window.removeEventListener("storage", applyTheme);
  }, []);

  // close profile dropdown when clicking outside
  useEffect(() => {
    function handleDocClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowProfileDropdown(false);
      }
    }
    document.addEventListener("click", handleDocClick);
    return () => document.removeEventListener("click", handleDocClick);
  }, []);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const displayName = user?.full_name || user?.username || "Dr. Wilson";

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem("darkMode", String(newTheme));
    document.documentElement.classList.toggle("dark", newTheme);
  };

  const handleLogout = () => {
    // close UI first
    setShowLogoutModal(false);
    setShowProfileDropdown(false);

    try {
      // Use the small auth helper if you have one (removes token/user)
      if (typeof authLogout === "function") {
        authLogout();
      } else {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    } catch (err) {
      // fallback
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      console.error("logout error", err);
    }

    // navigate to home/login
    navigate("/", { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <TeacherSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="transition-all duration-300 md:ml-64">
        {/* Top bar */}
        <div className="flex justify-between items-center p-4 border-b bg-white dark:bg-gray-800 dark:border-gray-700">
          <div className="flex items-center gap-4">
            {/* Hamburger (mobile only) */}
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="md:hidden text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              aria-label="Open menu"
            >
              <i className="ri-menu-line text-2xl" />
            </button>

            <div className="font-semibold text-gray-800 dark:text-white">
              Dashboard
            </div>
          </div>

          {/* Right side controls: theme toggle + profile */}
          <div className="flex items-center space-x-4">
            <button
              type="button"
              onClick={toggleTheme}
              title="Toggle theme"
              className={`p-2 rounded-lg transition-colors ${
                isDarkMode
                  ? "text-gray-300 hover:text-white hover:bg-gray-800"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              }`}
            >
              <i
                className={`${
                  isDarkMode ? "ri-sun-line" : "ri-moon-line"
                } w-5 h-5 inline-flex`}
              />
            </button>

            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setShowProfileDropdown((s) => !s)}
                className={`flex items-center space-x-3 p-2 rounded-lg transition-colors ${
                  isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-50"
                }`}
                aria-expanded={showProfileDropdown}
              >
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                    displayName
                  )}&background=0D8ABC&color=fff&rounded=true&size=64`}
                  alt={displayName}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div className="text-sm hidden sm:block text-left">
                  <p
                    className={`font-medium ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {displayName}
                  </p>
                  <p
                    className={`text-xs ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Teacher
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
                    to="/teacher/profile"
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

                  <Link
                    to="/teacher/settings"
                    onClick={() => setShowProfileDropdown(false)}
                    className={`flex items-center px-4 py-2 text-sm ${
                      isDarkMode
                        ? "text-gray-300 hover:bg-gray-700"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <i className="ri-settings-3-line w-4 h-4 inline-flex mr-3" />
                    Settings
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

        {/* Page Content */}
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-gray-900 dark:text-white">
              Welcome back, {displayName}!
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
              Here's what's happening with your classes today
            </p>
          </div>

          <QuickStats />
          <TodayLessons />
        </div>
      </main>

      {/* Logout confirmation modal */}
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
    </div>
  );
}
