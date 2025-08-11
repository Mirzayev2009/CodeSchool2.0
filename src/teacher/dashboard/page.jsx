
'use client';

import { useState, useEffect } from 'react';
import TeacherSidebar from '../../../components/TeacherSidebar';
import TeacherTopBar from '../../../components/TeacherTopBar';
import QuickStats from './QuickStats';
import TodayLessons from './TodayLessons';

export default function TeacherDashboard() {
  const [isDarkMode, setIsDarkMode] = useState(false);

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

  return (
    <div className={`flex h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <TeacherSidebar />
      
      <div className="flex-1 ml-64">
        <TeacherTopBar />
        
        <div className="p-8">
          <div className="mb-8">
            <h1 className={`text-3xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Welcome back, Dr. Wilson!
            </h1>
            <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
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
