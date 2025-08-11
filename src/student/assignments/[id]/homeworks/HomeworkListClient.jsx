'use client';

import { useState, useEffect } from 'react';
import {Link} from 'react-router-dom';

export default function HomeworkListClient({ assignment, homeworks, assignmentId }) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme) {
      const darkTheme = savedTheme === 'true';
      setIsDarkMode(darkTheme);
    }

    const handleStorageChange = () => {
      const theme = localStorage.getItem('darkMode');
      setIsDarkMode(theme === 'true');
    };

    window.addEventListener('storage', handleStorageChange);
    
    const interval = setInterval(() => {
      const theme = localStorage.getItem('darkMode');
      const darkTheme = theme === 'true';
      if (darkTheme !== isDarkMode) {
        setIsDarkMode(darkTheme);
      }
    }, 100);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [isDarkMode]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50 border-green-200';
      case 'in_progress': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'pending': return 'text-gray-600 bg-gray-50 border-gray-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return 'ri-check-circle-line text-green-600';
      case 'in_progress': return 'ri-play-circle-line text-blue-600';
      case 'pending': return 'ri-time-line text-gray-400';
      default: return 'ri-circle-line text-gray-400';
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'code': return 'bg-blue-100 text-blue-800';
      case 'theory': return 'bg-purple-100 text-purple-800';
      case 'project': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const completedCount = homeworks.filter(hw => hw.status === 'completed').length;
  const progressPercentage = Math.round((completedCount / homeworks.length) * 100);

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-4xl mx-auto px-6 py-8 pt-24">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link 
            href="/student/assignments" 
            className={`inline-flex items-center transition-colors mb-4 ${
              isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'
            }`}
          >
            <i className="ri-arrow-left-line w-4 h-4 flex items-center justify-center mr-2"></i>
            Back to Assignments
          </Link>
        </div>

        {/* Assignment Header */}
        <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-lg border p-6 mb-8`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1">
              <h1 className={`text-3xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {assignment.title}
              </h1>
              <div className={`flex items-center space-x-4 mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                <span className="flex items-center">
                  <i className="ri-book-line w-4 h-4 flex items-center justify-center mr-2"></i>
                  {assignment.subject}
                </span>
                <span className="flex items-center">
                  <i className="ri-user-line w-4 h-4 flex items-center justify-center mr-2"></i>
                  {assignment.teacher}
                </span>
                <span className="flex items-center">
                  <i className="ri-calendar-line w-4 h-4 flex items-center justify-center mr-2"></i>
                  Due: {assignment.dueDate}
                </span>
              </div>
              <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {assignment.description}
              </p>
            </div>
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <i className="ri-file-code-line w-8 h-8 flex items-center justify-center text-blue-600"></i>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                Progress: {completedCount}/{homeworks.length} completed
              </span>
              <span className={`font-semibold ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                {progressPercentage}%
              </span>
            </div>
            <div className={`w-full h-2 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full overflow-hidden`}>
              <div 
                className="h-full bg-green-500 transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Homework List */}
        <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-lg border`}>
          <div className="p-6">
            <h2 className={`text-xl font-semibold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Homework Tasks ({homeworks.length})
            </h2>
            
            <div className="space-y-4">
              {homeworks.map((homework, index) => (
                <Link 
                  key={homework.id}
                  href={`/student/assignments/${assignmentId}/homeworks/${homework.id}`}
                  className={`block p-4 rounded-lg border transition-all ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 hover:bg-gray-650 hover:border-gray-500' 
                      : 'bg-gray-50 border-gray-200 hover:bg-gray-100 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-3">
                        <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          isDarkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-700'
                        }`}>
                          {index + 1}
                        </span>
                        <i className={`${getStatusIcon(homework.status)} w-6 h-6 flex items-center justify-center`}></i>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-1">
                          <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {homework.title}
                          </h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(homework.status).split(' ')[0]} ${getStatusColor(homework.status).split(' ')[1]}`}>
                            {homework.status.replace('_', ' ').toUpperCase()}
                          </span>
                        </div>
                        
                        <p className={`text-sm mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {homework.description}
                        </p>
                        
                        <div className="flex items-center space-x-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(homework.difficulty)}`}>
                            {homework.difficulty}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(homework.type)}`}>
                            {homework.type.toUpperCase()}
                          </span>
                          <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {homework.points} points
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <i className={`ri-arrow-right-line w-5 h-5 flex items-center justify-center ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`}></i>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}