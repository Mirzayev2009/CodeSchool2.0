import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function HomePage() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const savedTheme = localStorage.getItem("darkMode");
    if (savedTheme) {
      const darkTheme = savedTheme === "true";
      setIsDarkMode(darkTheme);
      if (darkTheme) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem("darkMode", newTheme.toString());

    if (newTheme) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center px-6 ${
        isDarkMode
          ? "bg-gradient-to-br from-gray-900 to-gray-800"
          : "bg-gradient-to-br from-blue-50 to-indigo-100"
      }`}
    >
      <div className="max-w-lg w-full">
        {/* Theme Toggle */}
        <div className="flex justify-end mb-6">
          <button
            onClick={toggleTheme}
            className={`p-3 rounded-full transition-colors ${
              isDarkMode
                ? "text-gray-300 hover:text-white bg-gray-800 hover:bg-gray-700"
                : "text-gray-600 hover:text-gray-800 bg-white hover:bg-gray-50"
            } shadow-lg`}
            title="Toggle theme"
          >
            <i
              className={`${
                isDarkMode ? "ri-sun-line" : "ri-moon-line"
              } w-5 h-5 flex items-center justify-center`}
            ></i>
          </button>
        </div>

        <div
          className={`${
            isDarkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-100"
          } rounded-2xl shadow-xl p-8 border text-center`}
        >
          <div className="mb-8">
            <span className="text-4xl font-bold text-blue-600 font-['Pacifico'] block mb-4">
              CodeSchool
            </span>
            <h1
              className={`text-3xl font-bold mb-4 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Welcome to CodeSchool
            </h1>
            <p
              className={`text-lg ${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Sign in to continue
            </p>
            <p
              className={`text-sm mt-2 ${
                isDarkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              (This system supports Teacher, Student, and Admin profiles. Sign
              in with your credentials.)
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => navigate("/login")}
              className="block w-full py-4 px-6 bg-indigo-600 text-white text-lg font-medium rounded-lg hover:bg-indigo-700 transition-colors whitespace-nowrap"
            >
              Sign in
            </button>
          </div>

          <div
            className={`mt-8 pt-6 border-t ${
              isDarkMode ? "border-gray-700" : "border-gray-200"
            }`}
          >
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div
                className={`p-4 rounded-lg ${
                  isDarkMode ? "bg-gray-700" : "bg-gray-50"
                }`}
              >
                <h3
                  className={`font-semibold mb-2 ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Teachers
                </h3>
                <p className={isDarkMode ? "text-gray-300" : "text-gray-600"}>
                  Manage classes, track attendance, and assign homework
                </p>
              </div>
              <div
                className={`p-4 rounded-lg ${
                  isDarkMode ? "bg-gray-700" : "bg-gray-50"
                }`}
              >
                <h3
                  className={`font-semibold mb-2 ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Students
                </h3>
                <p className={isDarkMode ? "text-gray-300" : "text-gray-600"}>
                  Access assignments, complete homework, and track progress
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
