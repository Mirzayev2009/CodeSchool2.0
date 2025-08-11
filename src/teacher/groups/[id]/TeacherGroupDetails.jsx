'use client';

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import TeacherSidebar from '../../../../components/TeacherSidebar';
import TeacherTopBar from '../../../../components/TeacherTopBar';
import LessonCalendar from './LessonCalendar';
import HomeworkSection from './HomeworkSection';

export default function TeacherGroupDetails({ groupId }) {
  const [currentView, setCurrentView] = useState('attendance');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'true');
    }

    const handleStorageChange = () => {
      const theme = localStorage.getItem('darkMode');
      setIsDarkMode(theme === 'true');
    };

    window.addEventListener('storage', handleStorageChange);

    const interval = setInterval(() => {
      const theme = localStorage.getItem('darkMode');
      const darkTheme = theme === 'true';
      setIsDarkMode(prev => (prev !== darkTheme ? darkTheme : prev));
    }, 100);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const groupData = {
    '1': { 
      name: 'Advanced Web Development', 
      subject: 'Full-Stack JavaScript', 
      students: 28,
      level: 'Intermediate to Advanced',
      duration: '16 weeks',
      instructor: 'Sarah Johnson',
      room: 'Computer Lab A',
      schedule: 'Mon/Wed/Fri 2:00-4:00 PM'
    },
    '2': { 
      name: 'Mobile App Development', 
      subject: 'React Native & Flutter', 
      students: 24,
      level: 'Advanced',
      duration: '12 weeks',
      instructor: 'Sarah Johnson', 
      room: 'Tech Lab B',
      schedule: 'Tue/Thu 10:00-12:00 PM'
    },
    '3': { 
      name: 'Data Science Fundamentals', 
      subject: 'Python & Machine Learning', 
      students: 32,
      level: 'Beginner to Intermediate',
      duration: '20 weeks',
      instructor: 'Sarah Johnson',
      room: 'Data Lab C',
      schedule: 'Mon/Wed 9:00-11:00 AM'
    },
    '4': { 
      name: 'Database Systems Design', 
      subject: 'SQL & NoSQL Databases', 
      students: 20,
      level: 'Intermediate',
      duration: '14 weeks',
      instructor: 'Sarah Johnson',
      room: 'Computer Lab B',
      schedule: 'Tue/Fri 1:00-3:00 PM'
    }
  };

  const group = groupData[groupId] || groupData['1'];

  if (!isClient) {
    return (
      <div className={`flex h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <TeacherSidebar />
        <div className="flex-1 ml-64 flex flex-col">
          <TeacherTopBar />
          <div className="flex-1 p-8 flex items-center justify-center">
            <div className="text-center">
              <div className="w-8 h-8 bg-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
              <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Loading...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`} suppressHydrationWarning={true}>
      <TeacherSidebar />

      <div className="flex-1 ml-64 flex flex-col">
        <TeacherTopBar />

        <div className="flex-1 p-8 flex flex-col">
          <div className="mb-6">
            <Link to="/teacher/groups" className={`inline-flex items-center transition-colors mb-4 ${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'}`}>
              <i className="ri-arrow-left-line w-4 h-4 flex items-center justify-center mr-2"></i>
              Back to Groups
            </Link>

            <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-lg border p-6`}>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h1 className={`text-3xl font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{group.name}</h1>
                  <div className={`grid grid-cols-2 gap-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} text-sm`}>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <i className="ri-book-line w-4 h-4 flex items-center justify-center mr-2"></i>
                        <span className="font-medium">Subject:</span> <span className="ml-1">{group.subject}</span>
                      </div>
                      <div className="flex items-center">
                        <i className="ri-group-line w-4 h-4 flex items-center justify-center mr-2"></i>
                        <span className="font-medium">Students:</span> <span className="ml-1">{group.students} enrolled</span>
                      </div>
                      <div className="flex items-center">
                        <i className="ri-graduation-cap-line w-4 h-4 flex items-center justify-center mr-2"></i>
                        <span className="font-medium">Level:</span> <span className="ml-1">{group.level}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <i className="ri-calendar-line w-4 h-4 flex items-center justify-center mr-2"></i>
                        <span className="font-medium">Schedule:</span> <span className="ml-1">{group.schedule}</span>
                      </div>
                      <div className="flex items-center">
                        <i className="ri-map-pin-line w-4 h-4 flex items-center justify-center mr-2"></i>
                        <span className="font-medium">Location:</span> <span className="ml-1">{group.room}</span>
                      </div>
                      <div className="flex items-center">
                        <i className="ri-time-line w-4 h-4 flex items-center justify-center mr-2"></i>
                        <span className="font-medium">Duration:</span> <span className="ml-1">{group.duration}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={`w-20 h-20 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-blue-900' : 'bg-blue-100'} ml-6`}>
                  <i className={`ri-code-box-line w-10 h-10 flex items-center justify-center ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}></i>
                </div>
              </div>
            </div>
          </div>

          {/* View Toggle */}
          <div className="flex items-center justify-between mb-6">
            <div className={`flex items-center ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'} rounded-lg p-1`}>
              <button
                onClick={() => setCurrentView('attendance')}
                className={`px-4 py-2 rounded-md transition-colors whitespace-nowrap ${
                  currentView === 'attendance'
                    ? 'bg-blue-600 text-white'
                    : isDarkMode
                    ? 'text-gray-300 hover:text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <i className="ri-calendar-check-line w-4 h-4 flex items-center justify-center mr-2 inline-flex"></i>
                Attendance Management
              </button>
              <button
                onClick={() => setCurrentView('homework')}
                className={`px-4 py-2 rounded-md transition-colors whitespace-nowrap ${
                  currentView === 'homework'
                    ? 'bg-blue-600 text-white'
                    : isDarkMode
                    ? 'text-gray-300 hover:text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <i className="ri-file-text-line w-4 h-4 flex items-center justify-center mr-2 inline-flex"></i>
                Assignment Distribution
              </button>
            </div>
          </div>

          {/* Dynamic Content */}
          <div className="flex-1">
            {currentView === 'attendance' ? (
              <LessonCalendar groupId={groupId} />
            ) : (
              <HomeworkSection groupId={groupId} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
