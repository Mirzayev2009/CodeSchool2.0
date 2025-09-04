


import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import StudentHeader from '../../../components/StudentHeader';

import { getMyHomeworks } from '../../homeworkApi';

export default function StudentAssignments() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [assignments, setAssignments] = useState([]);
  const token = localStorage.getItem('token')

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

  // const assignments = [
  //   {
  //     id: 1,
  //     title: 'JavaScript Variables & Data Types',
  //     subject: 'JavaScript Fundamentals',
  //     dueDate: '2024-12-25',
  //     status: 'pending',
  //     difficulty: 'Easy',
  //     tasksCount: 10,
  //     description: 'Learn the basics of JavaScript variables, data types, and their usage in programming.',
  //     teacher: 'Dr. Wilson',
  //     points: 100
  //   },
  //   {
  //     id: 2,
  //     title: 'React Components & Props',
  //     subject: 'React Development',
  //     dueDate: '2024-12-28',
  //     status: 'in_progress',
  //     difficulty: 'Medium',
  //     tasksCount: 10,
  //     description: 'Build interactive React components and understand how to pass data using props.',
  //     teacher: 'Prof. Johnson',
  //     points: 150
  //   },
  //   {
  //     id: 3,
  //     title: 'Python Functions & Modules',
  //     subject: 'Python for Beginners',
  //     dueDate: '2024-12-30',
  //     status: 'completed',
  //     difficulty: 'Easy',
  //     tasksCount: 10,
  //     description: 'Master Python functions, modules, and code organization techniques.',
  //     teacher: 'Dr. Smith',
  //     points: 120
  //   },
  //   {
  //     id: 4,
  //     title: 'Database Normalization',
  //     subject: 'Database Design',
  //     dueDate: '2025-01-02',
  //     status: 'pending',
  //     difficulty: 'Hard',
  //     tasksCount: 10,
  //     description: 'Learn database normalization techniques and design efficient relational databases.',
  //     teacher: 'Prof. Brown',
  //     points: 200
  //   },
  //   {
  //     id: 5,
  //     title: 'Advanced JavaScript Concepts',
  //     subject: 'JavaScript Fundamentals',
  //     dueDate: '2025-01-05',
  //     status: 'pending',
  //     difficulty: 'Hard',
  //     tasksCount: 10,
  //     description: 'Dive deep into closures, async/await, and advanced JavaScript patterns.',
  //     teacher: 'Dr. Wilson',
  //     points: 180
  //   },
  //   {
  //     id: 6,
  //     title: 'React State Management',
  //     subject: 'React Development',
  //     dueDate: '2025-01-08',
  //     status: 'pending',
  //     difficulty: 'Medium',
  //     tasksCount: 10,
  //     description: 'Learn state management in React using hooks and context API.',
  //     teacher: 'Prof. Johnson',
  //     points: 160
  //   }
  // ];

  useEffect(()=>{
    async function fetchAssignments() {
      try {
        const data = await getMyHomeworks(token)
        setAssignments(data.assignments || [])

      } catch (error) {
        console.error('Failed to fetch assignments:', error)
      }
    }
    fetchAssignments()
  }, [token])

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return 'ri-time-line';
      case 'in_progress': return 'ri-play-circle-line';
      case 'completed': return 'ri-check-circle-line';
      default: return 'ri-file-line';
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <StudentHeader />
      
      <div className="max-w-7xl mx-auto px-6 py-8 pt-24">
        <div className="mb-8">
          <h1 className={`text-3xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>My Assignments</h1>
          <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Complete your coding assignments and track your progress</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-lg border p-6`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total</p>
                <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{assignments.length}</p>
              </div>
              <i className="ri-file-list-line w-8 h-8 flex items-center justify-center text-blue-600"></i>
            </div>
          </div>
          
          <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-lg border p-6`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Pending</p>
                <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{assignments.filter(a => a.status === 'pending').length}</p>
              </div>
              <i className="ri-time-line w-8 h-8 flex items-center justify-center text-yellow-600"></i>
            </div>
          </div>
          
          <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-lg border p-6`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>In Progress</p>
                <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{assignments.filter(a => a.status === 'in_progress').length}</p>
              </div>
              <i className="ri-play-circle-line w-8 h-8 flex items-center justify-center text-blue-600"></i>
            </div>
          </div>
          
          <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-lg border p-6`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Completed</p>
                <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{assignments.filter(a => a.status === 'completed').length}</p>
              </div>
              <i className="ri-check-circle-line w-8 h-8 flex items-center justify-center text-green-600"></i>
            </div>
          </div>
        </div>

        {/* Assignments List */}
        <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-lg border`}>
          <div className="p-6">
            <h2 className={`text-xl font-semibold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              All Assignments
            </h2>
            
            <div className="space-y-4">
              {assignments.map((assignment) => (
                <Link 
                  key={assignment.id}
                  to={`/student/assignments/${assignment.id}/homeworks`}
                  className={`block p-4 rounded-lg border transition-all ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 hover:bg-gray-650 hover:border-gray-500' 
                      : 'bg-gray-50 border-gray-200 hover:bg-gray-100 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <i className={`${getStatusIcon(assignment.status)} w-8 h-8 flex items-center justify-center ${
                        assignment.status === 'completed' ? 'text-green-600' :
                        assignment.status === 'in_progress' ? 'text-blue-600' : 'text-yellow-600'
                      }`}></i>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {assignment.title}
                          </h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(assignment.status)}`}>
                            {assignment.status.replace('_', ' ').toUpperCase()}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(assignment.difficulty)}`}>
                            {assignment.difficulty}
                          </span>
                        </div>
                        
                        <p className={`text-sm mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          {assignment.description}
                        </p>
                        
                        <div className="flex items-center space-x-6 text-sm">
                          <span className={`flex items-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            <i className="ri-book-line w-4 h-4 flex items-center justify-center mr-1"></i>
                            {assignment.subject}
                          </span>
                          <span className={`flex items-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            <i className="ri-user-line w-4 h-4 flex items-center justify-center mr-1"></i>
                            {assignment.teacher}
                          </span>
                          <span className={`flex items-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            <i className="ri-calendar-line w-4 h-4 flex items-center justify-center mr-1"></i>
                            Due: {assignment.dueDate}
                          </span>
                          <span className={`flex items-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            <i className="ri-task-line w-4 h-4 flex items-center justify-center mr-1"></i>
                            {assignment.tasksCount} tasks
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <span className={`text-lg font-bold ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                          {assignment.points}
                        </span>
                        <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          points
                        </div>
                      </div>
                      <i className={`ri-arrow-right-line w-5 h-5 flex items-center justify-center ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`}></i>
                    </div>
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
