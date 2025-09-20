
'use client';

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StudentHeader from '../../../components/StudentHeader';
import StudentInfo from './StudentInfo';
import AttendanceCalendar from './AttendanceCalendar';
import { useUser } from '../../UserContext';
import { getLessons } from '../../lessonApi';
import { getHomeworks } from '../../homeworkApi';
import { getHomeworkProgressMy } from '../../progressApi';

export default function StudentDashboard() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigate = useNavigate();
  const { token, logout } = useUser();
  const [stats, setStats] = useState([
    { label: 'Groups', value: '...', icon: 'ri-group-line', color: 'text-blue-600' },
    { label: 'Attendance', value: '...', icon: 'ri-calendar-check-line', color: 'text-green-600' },
    { label: 'Assignments', value: '...', icon: 'ri-file-list-line', color: 'text-purple-600' }
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Theme effect (unchanged)
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

  // Fetch dashboard stats from backend
  useEffect(() => {
    async function fetchStats() {
      if (!token) return;
      setLoading(true);
      setError(null);
      try {
        // Fetch lessons (for groups count)
        const lessons = await getLessons(token);
        // Fetch homeworks (for assignments count)
        const homeworks = await getHomeworks(token);
        // Fetch progress (for attendance)
        const progress = await getHomeworkProgressMy(token);

        setStats([
          { label: 'Groups', value: Array.isArray(lessons) ? lessons.length : '0', icon: 'ri-group-line', color: 'text-blue-600' },
          { label: 'Attendance', value: progress?.attendance ? `${progress.attendance}%` : 'N/A', icon: 'ri-calendar-check-line', color: 'text-green-600' },
          { label: 'Assignments', value: Array.isArray(homeworks) ? homeworks.length : '0', icon: 'ri-file-list-line', color: 'text-purple-600' }
        ]);
      } catch (err) {
        setError('Failed to load dashboard stats');
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, [token]);

  return (
    <div className={`min-h-screen  ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} `}>
      <div className="flex justify-end items-center p-4 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => { logout(); navigate('/login?role=student&loggedout=true'); }}
          className="px-4 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-colors"
        >
          Logout
        </button>
      </div>
      <StudentHeader />
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className={`text-3xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Welcome back, { /* TODO: Use user name from context if available */ }!</h1>
          <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Here's your learning overview for today</p>
        </div>

        {/* Stats Cards */}
        {loading ? (
          <div className="text-center py-8">Loading stats...</div>
        ) : error ? (
          <div className="text-center py-8 text-red-600">{error}</div>
        ) : (
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
        )}

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
