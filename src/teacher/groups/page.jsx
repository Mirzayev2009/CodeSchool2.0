
'use client';

import { useEffect, useState } from 'react';
import GroupsList from './GroupsList';
import TeacherSidebar from '../../../components/TeacherSidebar';

export default function TeacherGroupsPage() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(savedDarkMode);
    
    if (savedDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <div className="flex">
        <TeacherSidebar />
        
        <div className="flex-1 ml-64">
          <div className="p-8">
            <div className="mb-8">
              <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>My Groups</h1>
              <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Manage your teaching groups and track student progress</p>
            </div>

            <GroupsList />
          </div>
        </div>
      </div>
    </div>
  );
}
