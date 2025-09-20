'use client';

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../UserContext';
import TeacherSidebar from '../../../components/TeacherSidebar';
import TeacherTopBar from '../../../components/TeacherTopBar';
import QuickStats from './QuickStats';
import TodayLessons from './TodayLessons';

export default function TeacherDashboard() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false); // 👈 sidebar toggle state
  const navigate = useNavigate();
  const { logout } = useUser();

  useEffect(() => {
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'true');
    }

    const handleStorageChange = () => {
      const theme = localStorage.getItem('darkMode');
      setIsDarkMode(theme === 'true');
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);
  useEffect(() => {
  const handleOpen = () => setSidebarOpen(true);
  document.addEventListener("openSidebar", handleOpen);
  return () => document.removeEventListener("openSidebar", handleOpen);
}, []);


  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Sidebar */}
      <TeacherSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content */}
      <div className="md:ml-64">
        {/* Top bar with hamburger */}
        <div className={`flex justify-between items-center p-4 border-b ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
          {/* Hamburger button - only visible on mobile */}
          <button
            onClick={() => setSidebarOpen(true)}
            className={`md:hidden ${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}
          >
            <i className="ri-menu-line text-2xl"></i>
          </button>

          {/* Spacer for mobile to center logout button */}
          <div className="md:hidden"></div>

          {/* Logout button */}
          <button
            onClick={() => { logout(); navigate('/login?role=teacher&loggedout=true'); }}
            className="px-3 py-2 sm:px-4 sm:py-2 rounded-lg bg-red-600 text-white text-sm sm:text-base font-medium hover:bg-red-700 transition-colors"
          >
            Logout
          </button>
        </div>

        <TeacherTopBar />

        {/* Main content area */}
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="mb-6 sm:mb-8">
            <h1 className={`text-2xl sm:text-3xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Welcome back, Dr. Wilson!
            </h1>
            <p className={`text-sm sm:text-base ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Here's what's happening with your classes today
            </p>
          </div>
          <QuickStats />
          <TodayLessons />
        </div>
      </div>
    </div>
  );
}