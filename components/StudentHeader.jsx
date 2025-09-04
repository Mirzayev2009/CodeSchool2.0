
'use client';

import { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";

export default function StudentHeader() {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showGroups, setShowGroups] = useState(false);
   const navigate = useNavigate();

  useEffect(() => {
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme) {
      const darkTheme = savedTheme === 'true';
      setIsDarkMode(darkTheme);
      if (darkTheme) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }

    const handleStorageChange = () => {
      const theme = localStorage.getItem('darkMode');
      const darkTheme = theme === 'true';
      setIsDarkMode(darkTheme);
      if (darkTheme) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Listen for theme changes from other components
    const interval = setInterval(() => {
      const theme = localStorage.getItem('darkMode');
      const darkTheme = theme === 'true';
      if (darkTheme !== isDarkMode) {
        setIsDarkMode(darkTheme);
        if (darkTheme) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    }, 100);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [isDarkMode]);

  const handleLogout = () => {
    setShowLogoutModal(false);
    setShowProfileDropdown(false);
    localStorage.removeItem('authToken');
    navigate('/login?role=student');
  };

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem('darkMode', newTheme.toString());
    
    if (newTheme) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <>
      <header className={`${isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}sticky top-0 z-50 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link to="/student/dashboard" className="flex items-center">
                <span className="text-2xl font-bold mr-4 text-blue-600 font-['Pacifico']">CodeSchool</span>
              </Link>
              
              {/* Navigation Links */}
              <nav className="flex  md:flex items-center space-x-6">
                <Link 
                  to="/student/dashboard" 
                  className={`text-sm font-medium transition-colors ${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  <i className="ri-home-line w-4 h-4 flex items-center justify-center mr-2 inline-flex"></i>
                  Dashboard
                </Link>
                
                <Link 
                  to="/student/assignments" 
                  className={`text-sm font-medium transition-colors ${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  <i className="ri-file-list-line w-4 h-4 flex items-center justify-center mr-2 inline-flex"></i>
                  Assignments
                </Link>
                 <Link 
                  to="/student/lessons" 
                  className={`text-sm font-medium transition-colors ${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  <i className="ri-file-list-line w-4 h-4 flex items-center justify-center mr-2 inline-flex"></i>
                  Lessons
                </Link>
                

  <div className="relative">
  {/* Toggle Button */}
  <button
    onClick={() => setShowGroups(prev => !prev)}
    className={`flex items-center text-sm font-medium px-3 py-2 rounded-lg transition-colors
      ${isDarkMode
        ? 'text-gray-300 hover:text-white hover:bg-gray-800'
        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
      }`}
  >
    <i className="ri-group-line w-4 h-4 mr-2"></i>
    My Groups
  </button>

  {/* Dropdown */}
  {showGroups && (
    <div
      className={`absolute top-full left-0 mt-2 w-64 border rounded-lg shadow-lg py-2 z-50
        ${isDarkMode
          ? 'bg-gray-800 border-gray-700'
          : 'bg-white border-gray-200'
        }
        transition-all duration-200 ease-out
      `}
    >
      {[
        { id: 1, color: 'bg-blue-500', name: 'JavaScript Fundamentals' },
        { id: 2, color: 'bg-cyan-500', name: 'React Development' },
        { id: 3, color: 'bg-green-500', name: 'Python for Beginners' },
        { id: 4, color: 'bg-purple-500', name: 'Database Design' },
      ].map((group) => (
        <Link
          key={group.id}
          to={`/student/groups/${group.id}`}
          onClick={() => setShowGroups(false)}
          className={`flex items-center px-4 py-2 text-sm transition-colors
            ${isDarkMode
              ? 'text-gray-300 hover:bg-gray-700'
              : 'text-gray-700 hover:bg-gray-50'
            }`}
        >
          <div className={`w-3 h-3 ${group.color} rounded-full mr-3`}></div>
          {group.name}
        </Link>
      ))}
    </div>
  )}
</div>

 


              </nav>
            </div>

            <div className="flex items-center space-x-4">
              <button 
                onClick={toggleTheme}
                className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'text-gray-300 hover:text-white hover:bg-gray-800' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`}
                title="Toggle theme"
              >
                <i className={`${isDarkMode ? 'ri-sun-line' : 'ri-moon-line'} w-5 h-5 flex items-center justify-center`}></i>
              </button>
              
              <div className="relative">
                <button 
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  className={`flex items-center space-x-3 p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-50'}`}
                >
                  <img
                    src="https://readdy.ai/api/search-image?query=professional%20headshot%20of%20young%20college%20student%20with%20friendly%20smile%2C%20modern%20student%20portrait%2C%20clean%20white%20background%2C%20high%20quality%20photography%2C%20natural%20lighting%2C%20confident%20expression&width=80&height=80&seq=student-header&orientation=squarish"
                    alt="Student"
                    className="w-8 h-8 rounded-full object-cover object-top"
                  />
                  <div className="text-sm text-left hidden sm:block">
                    <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Alex Johnson</p>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Student</p>
                  </div>
                  <i className={`ri-arrow-down-s-line w-4 h-4 flex items-center justify-center transition-transform ${isDarkMode ? 'text-gray-400' : 'text-gray-400'} ${showProfileDropdown ? 'rotate-180' : ''}`}></i>
                </button>

                {showProfileDropdown && (
                  <div className={`absolute right-0 mt-2 w-48 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-lg border py-1 z-50`}>
                    <Link 
                      to="/student/profile"
                      className={`flex items-center px-4 py-2 text-sm transition-colors ${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-50'}`}
                      onClick={() => setShowProfileDropdown(false)}
                    >
                      <i className="ri-user-line w-4 h-4 flex items-center justify-center mr-3"></i>
                      Profile
                    </Link>
                    <div className={`border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}></div>
                    <button 
                      onClick={() => {
                        setShowProfileDropdown(false);
                        setShowLogoutModal(true);
                      }}
                      className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <i className="ri-logout-circle-line w-4 h-4 flex items-center justify-center mr-3"></i>
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
        <div className="fixed inset-0 bg-black bg-black/50 flex items-center justify-center z-50">
          <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6 max-w-md w-full mx-4`}>
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                <i className="ri-logout-circle-line w-6 h-6 flex items-center justify-center text-red-600"></i>
              </div>
              <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Are you sure?</h3>
            </div>
            <p className={`mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              You will be logged out and need to sign in again to access your account.
            </p>
            <div className="flex items-center justify-end space-x-3">
              <button 
                onClick={() => setShowLogoutModal(false)}
                className={`px-4 py-2 text-sm rounded-md transition-colors whitespace-nowrap ${isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                Cancel
              </button>
              <button 
                onClick={handleLogout}
                className="px-4 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors whitespace-nowrap"
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
