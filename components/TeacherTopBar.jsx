
'use client';

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


export default function TeacherTopBar() {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
const navigate = useNavigate();


  useEffect(() => {
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'true');
    }
  }, []);

  const handleLogout = () => {
    setShowLogoutModal(false);
    setShowProfileDropdown(false);
    localStorage.removeItem('authToken');
   navigate('/login?role=teacher');
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
      <header className={`${isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} border-b`}>
        <div className="px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex-1"></div>

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
                    src="https://readdy.ai/api/search-image?query=professional%20headshot%20of%20middle-aged%20female%20teacher%20with%20warm%20smile%20and%20confident%20expression%2C%20educational%20professional%20portrait%2C%20clean%20white%20background%2C%20high%20quality%20photography%2C%20natural%20lighting&width=80&height=80&seq=teacher-topbar&orientation=squarish"
                    alt="Teacher"
                    className="w-8 h-8 rounded-full object-cover object-top"
                  />
                  <div className="text-sm text-left">
                    <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Dr. Sarah Wilson</p>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Teacher</p>
                  </div>
                  <i className={`ri-arrow-down-s-line w-4 h-4 flex items-center justify-center transition-transform ${isDarkMode ? 'text-gray-400' : 'text-gray-400'} ${showProfileDropdown ? 'rotate-180' : ''}`}></i>
                </button>

                {showProfileDropdown && (
                  <div className={`absolute right-0 mt-2 w-48 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-lg border py-1 z-50`}>
                    <button 
                      className={`w-full flex items-center px-4 py-2 text-sm transition-colors ${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-50'}`}
                      onClick={() => setShowProfileDropdown(false)}
                    >
                      <i className="ri-user-line w-4 h-4 flex items-center justify-center mr-3"></i>
                      Profile Settings
                    </button>
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