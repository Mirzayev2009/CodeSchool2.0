
'use client';

import { useState, useEffect } from 'react';

export default function HomeworkSection({ groupId }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

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

  // Mock homework list from backend
  const availableHomeworks = [
    {
      id: 1,
      title: 'JavaScript Variables & Data Types',
      subject: 'JavaScript Fundamentals',
      difficulty: 'Easy',
      tasks: 10,
      points: 50,
      description: 'Complete 10 coding exercises about variables and data types'
    },
    {
      id: 2,
      title: 'Function Implementation Challenge',
      subject: 'JavaScript Fundamentals',
      difficulty: 'Medium',
      tasks: 8,
      points: 75,
      description: 'Create functions for various programming problems'
    },
    {
      id: 3,
      title: 'Array Manipulation Tasks',
      subject: 'JavaScript Fundamentals',
      difficulty: 'Medium',
      tasks: 12,
      points: 65,
      description: 'Master array methods and operations'
    },
    {
      id: 4,
      title: 'React Components Basics',
      subject: 'React Development',
      difficulty: 'Easy',
      tasks: 10,
      points: 60,
      description: 'Build basic React components'
    },
    {
      id: 5,
      title: 'State Management in React',
      subject: 'React Development',
      difficulty: 'Hard',
      tasks: 15,
      points: 100,
      description: 'Advanced state management techniques'
    },
    {
      id: 6,
      title: 'Python Loops & Conditions',
      subject: 'Python Programming',
      difficulty: 'Easy',
      tasks: 8,
      points: 45,
      description: 'Control flow in Python programming'
    },
    {
      id: 7,
      title: 'Database Query Optimization',
      subject: 'Database Design',
      difficulty: 'Hard',
      tasks: 6,
      points: 120,
      description: 'Optimize SQL queries for better performance'
    },
    {
      id: 8,
      title: 'Object-Oriented Programming',
      subject: 'Advanced Programming',
      difficulty: 'Medium',
      tasks: 10,
      points: 85,
      description: 'Classes, objects, and inheritance concepts'
    }
  ];

  // Mock assigned homeworks for this group
  const [assignedHomeworks, setAssignedHomeworks] = useState([
    {
      id: 1,
      homeworkId: 1,
      groupId: groupId,
      assignedDate: '2024-12-23',
      dueDate: '2024-12-25',
      status: 'active'
    },
    {
      id: 2,
      homeworkId: 2,
      groupId: groupId,
      assignedDate: '2024-12-24',
      dueDate: '2024-12-28',
      status: 'active'
    }
  ]);

  const assignHomework = (homeworkId) => {
    const newAssignment = {
      id: Date.now(),
      homeworkId: homeworkId,
      groupId: groupId,
      assignedDate: selectedDate,
      dueDate: selectedDate, // You could add due date picker
      status: 'active'
    };
    
    setAssignedHomeworks(prev => [...prev, newAssignment]);
  };

  const removeHomework = (assignmentId) => {
    setAssignedHomeworks(prev => prev.filter(assignment => assignment.id !== assignmentId));
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getHomeworkById = (homeworkId) => {
    return availableHomeworks.find(hw => hw.id === homeworkId);
  };

  const isHomeworkAssigned = (homeworkId) => {
    return assignedHomeworks.some(assignment => 
      assignment.homeworkId === homeworkId && 
      assignment.assignedDate === selectedDate
    );
  };

  const getAssignedHomeworksForDate = (date) => {
    return assignedHomeworks.filter(assignment => assignment.assignedDate === date);
  };

  return (
    <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-lg border`}>
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Homework Management
          </h3>
          
          {/* Date Selector */}
          <div className="flex items-center space-x-3">
            <label className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Select Date:
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className={`px-3 py-1.5 border rounded-lg text-sm ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            />
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Available Homeworks */}
          <div>
            <h4 className={`text-md font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Available Homeworks ({availableHomeworks.length})
            </h4>
            
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {availableHomeworks.map((homework) => (
                <div 
                  key={homework.id}
                  className={`p-4 rounded-lg border transition-colors ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 hover:bg-gray-650' 
                      : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h5 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {homework.title}
                        </h5>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(homework.difficulty)}`}>
                          {homework.difficulty}
                        </span>
                      </div>
                      
                      <p className={`text-sm mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        {homework.description}
                      </p>
                      
                      <div className="flex items-center space-x-4 text-xs">
                        <span className={`flex items-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          <i className="ri-book-line w-3 h-3 flex items-center justify-center mr-1"></i>
                          {homework.subject}
                        </span>
                        <span className={`flex items-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          <i className="ri-task-line w-3 h-3 flex items-center justify-center mr-1"></i>
                          {homework.tasks} tasks
                        </span>
                        <span className={`flex items-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          <i className="ri-star-line w-3 h-3 flex items-center justify-center mr-1"></i>
                          {homework.points} points
                        </span>
                      </div>
                    </div>
                    
                    <div className="ml-4">
                      <button
                        onClick={() => assignHomework(homework.id)}
                        disabled={isHomeworkAssigned(homework.id)}
                        className={`px-3 py-1.5 text-sm rounded transition-colors whitespace-nowrap ${
                          isHomeworkAssigned(homework.id)
                            ? isDarkMode
                              ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                      >
                        {isHomeworkAssigned(homework.id) ? 'Assigned' : 'Assign'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Assigned Homeworks for Selected Date */}
          <div>
            <h4 className={`text-md font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Assigned for {selectedDate} ({getAssignedHomeworksForDate(selectedDate).length})
            </h4>
            
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {getAssignedHomeworksForDate(selectedDate).length === 0 ? (
                <div className={`text-center py-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  <i className="ri-file-list-line w-12 h-12 flex items-center justify-center mx-auto mb-3 text-gray-300"></i>
                  <p>No homework assigned for this date</p>
                  <p className="text-sm">Select homework from the left to assign</p>
                </div>
              ) : (
                getAssignedHomeworksForDate(selectedDate).map((assignment) => {
                  const homework = getHomeworkById(assignment.homeworkId);
                  if (!homework) return null;
                  
                  return (
                    <div 
                      key={assignment.id}
                      className={`p-4 rounded-lg border ${
                        isDarkMode 
                          ? 'bg-blue-900 border-blue-700' 
                          : 'bg-blue-50 border-blue-200'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h5 className={`font-semibold ${isDarkMode ? 'text-blue-300' : 'text-blue-900'}`}>
                              {homework.title}
                            </h5>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(homework.difficulty)}`}>
                              {homework.difficulty}
                            </span>
                          </div>
                          
                          <p className={`text-sm mb-3 ${isDarkMode ? 'text-blue-200' : 'text-blue-700'}`}>
                            {homework.description}
                          </p>
                          
                          <div className="flex items-center space-x-4 text-xs">
                            <span className={`flex items-center ${isDarkMode ? 'text-blue-300' : 'text-blue-600'}`}>
                              <i className="ri-task-line w-3 h-3 flex items-center justify-center mr-1"></i>
                              {homework.tasks} tasks
                            </span>
                            <span className={`flex items-center ${isDarkMode ? 'text-blue-300' : 'text-blue-600'}`}>
                              <i className="ri-star-line w-3 h-3 flex items-center justify-center mr-1"></i>
                              {homework.points} points
                            </span>
                            <span className={`flex items-center ${isDarkMode ? 'text-blue-300' : 'text-blue-600'}`}>
                              <i className="ri-calendar-line w-3 h-3 flex items-center justify-center mr-1"></i>
                              Due: {assignment.dueDate}
                            </span>
                          </div>
                        </div>
                        
                        <button
                          onClick={() => removeHomework(assignment.id)}
                          className={`p-1.5 rounded transition-colors ${
                            isDarkMode 
                              ? 'text-red-400 hover:text-red-300 hover:bg-red-900' 
                              : 'text-red-600 hover:text-red-700 hover:bg-red-100'
                          }`}
                        >
                          <i className="ri-delete-bin-line w-4 h-4 flex items-center justify-center"></i>
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
