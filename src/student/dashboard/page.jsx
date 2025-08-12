
'use client';

import { useState, useEffect } from 'react';
import StudentHeader from '../../../components/StudentHeader';
import StudentInfo from './StudentInfo';
import AttendanceCalendar from './AttendanceCalendar';

export default function StudentDashboard() {
  const [isDarkMode, setIsDarkMode] = useState(false);

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

  const stats = [
    { label: 'Groups', value: '4', icon: 'ri-group-line', color: 'text-blue-600' },
    { label: 'Attendance', value: '88%', icon: 'ri-calendar-check-line', color: 'text-green-600' },
    { label: 'Assignments', value: '92%', icon: 'ri-file-list-line', color: 'text-purple-600' }
  ];

  return (
    <div className={`min-h-screen  ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} pt-16`}>
      <StudentHeader />
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className={`text-3xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Welcome back, Alex!</h1>
          <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Here's your learning overview for today</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-lg border p-6`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{stat.label}</p>
                  <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{stat.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} flex items-center justify-center`}>
                  <i className={`${stat.icon} w-6 h-6 flex items-center justify-center ${stat.color}`}></i>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <StudentInfo />
          </div>
          
          <div className="lg:col-span-2">
            <AttendanceCalendar />
          </div>
        </div>
      </div>
    </div>
  );
}
