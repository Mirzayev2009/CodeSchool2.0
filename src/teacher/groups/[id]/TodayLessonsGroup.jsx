import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function TodayLessonsGroup({ groupId }) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('darkMode');
    setIsDarkMode(savedTheme === 'true');

    const handleStorageChange = () => {
      const theme = localStorage.getItem('darkMode');
      setIsDarkMode(theme === 'true');
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const lessonsForGroup = {
    '1': [
      {
        id: '1',
        title: 'JavaScript Variables & Data Types',
        time: '9:00 AM',
        duration: '90 min',
        room: 'Room 301',
        students: 28,
        status: 'in-progress',
        color: 'bg-blue-500',
        description: 'Introduction to JavaScript fundamentals',
      },
      {
        id: '2',
        title: 'Functions and Scope',
        time: '11:00 AM',
        duration: '90 min',
        room: 'Room 301',
        students: 28,
        status: 'upcoming',
        color: 'bg-green-500',
        description: 'Understanding functions and variable scope',
      },
    ],
    '2': [
      {
        id: '3',
        title: 'React Components',
        time: '2:00 PM',
        duration: '90 min',
        room: 'Room 205',
        students: 24,
        status: 'upcoming',
        color: 'bg-cyan-500',
        description: 'Building reusable React components',
      },
    ],
    '3': [
      {
        id: '4',
        title: 'Python Syntax Basics',
        time: '10:00 AM',
        duration: '90 min',
        room: 'Room 108',
        students: 32,
        status: 'completed',
        color: 'bg-yellow-500',
        description: 'Python fundamentals and syntax',
      },
    ],
    '4': [
      {
        id: '5',
        title: 'Database Relationships',
        time: '1:00 PM',
        duration: '90 min',
        room: 'Lab 2',
        students: 20,
        status: 'upcoming',
        color: 'bg-purple-500',
        description: 'Understanding database relationships',
      },
    ],
  };

  const todayLessons = lessonsForGroup[groupId] || [];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'upcoming':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return 'ri-check-circle-line';
      case 'in-progress':
        return 'ri-play-circle-line';
      case 'upcoming':
        return 'ri-time-line';
      default:
        return 'ri-calendar-line';
    }
  };

  return (
    <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-lg border`}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Today's Lessons</h3>
          <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {new Date().toLocaleDateString()}
          </span>
        </div>

        <div className="space-y-4">
          {todayLessons.length > 0 ? (
            todayLessons.map((lesson) => (
              <div key={lesson.id} className={`border ${isDarkMode ? 'border-gray-700 hover:bg-gray-750' : 'border-gray-200 hover:bg-gray-50'} rounded-lg p-4 transition-colors`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-4 h-4 rounded-full ${lesson.color}`}></div>
                    <div>
                      <div className="flex items-center space-x-3 mb-1">
                        <h4 className={`text-lg font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{lesson.title}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(lesson.status)}`}>
                          {lesson.status.replace('-', ' ').replace(/\b\w/g, c => c.toUpperCase())}
                        </span>
                      </div>
                      <p className={`text-sm mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{lesson.description}</p>
                      <div className={`flex items-center space-x-6 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        <div className="flex items-center">
                          <i className="ri-time-line mr-2"></i>
                          <span>{lesson.time} ({lesson.duration})</span>
                        </div>
                        <div className="flex items-center">
                          <i className="ri-map-pin-line mr-2"></i>
                          <span>{lesson.room}</span>
                        </div>
                        <div className="flex items-center">
                          <i className="ri-group-line mr-2"></i>
                          <span>{lesson.students} students</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <i className={`${getStatusIcon(lesson.status)} w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}></i>
                    {lesson.status === 'upcoming' && (
                      <Link to={`/teacher/lesson/${lesson.id}`} className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700">
                        Start Class
                      </Link>
                    )}
                    {lesson.status === 'in-progress' && (
                      <Link to={`/teacher/lesson/${lesson.id}`} className="px-3 py-1 text-sm bg-green-600 text-white rounded-md hover:bg-green-700">
                        Join Class
                      </Link>
                    )}
                    {lesson.status === 'completed' && (
                      <button className={`px-3 py-1 text-sm rounded-md ${isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                        View Report
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className={`text-center py-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              <i className="ri-calendar-line w-12 h-12 mx-auto mb-4 text-3xl"></i>
              <p>No lessons scheduled for today</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
