
'use client';

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';


export default function MyGroups() {
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

  const groups = [
    {
      id: '1',
      name: 'JavaScript Fundamentals',
      teacher: 'Dr. Sarah Wilson',
      students: 28,
      nextLesson: 'Tomorrow 10:00 AM',
      progress: 75,
      color: 'bg-blue-500',
      assignments: 5,
      completedAssignments: 4,
      image: 'https://readdy.ai/api/search-image?query=modern%20JavaScript%20programming%20course%20illustration%20with%20clean%20geometric%20design%2C%20coding%20symbols%2C%20laptop%20screen%20with%20code%2C%20bright%20blue%20and%20yellow%20colors%2C%20minimalist%20educational%20style&width=400&height=200&seq=js-course&orientation=landscape'
    },
    {
      id: '2',
      name: 'React Development',
      teacher: 'Prof. Michael Chen',
      students: 24,
      nextLesson: 'Wed 2:00 PM',
      progress: 60,
      color: 'bg-cyan-500',
      assignments: 6,
      completedAssignments: 3,
      image: 'https://readdy.ai/api/search-image?query=React%20programming%20course%20illustration%20with%20modern%20component%20design%2C%20coding%20interface%2C%20clean%20geometric%20patterns%2C%20cyan%20and%20blue%20colors%2C%20educational%20technology%20style&width=400&height=200&seq=react-course&orientation=landscape'
    },
    {
      id: '3',
      name: 'Python for Beginners',
      teacher: 'Dr. Emily Rodriguez',
      students: 32,
      nextLesson: 'Thu 11:00 AM',
      progress: 85,
      color: 'bg-green-500',
      assignments: 4,
      completedAssignments: 4,
      image: 'https://readdy.ai/api/search-image?query=Python%20programming%20course%20illustration%20with%20snake%20logo%20elements%2C%20coding%20symbols%2C%20terminal%20screen%2C%20green%20and%20yellow%20colors%2C%20clean%20educational%20design%20style&width=400&height=200&seq=python-course&orientation=landscape'
    },
    {
      id: '4',
      name: 'Database Design',
      teacher: 'Prof. James Thompson',
      students: 20,
      nextLesson: 'Fri 3:00 PM',
      progress: 40,
      color: 'bg-purple-500',
      assignments: 7,
      completedAssignments: 2,
      image: 'https://readdy.ai/api/search-image?query=Database%20design%20course%20illustration%20with%20data%20structure%20diagrams%2C%20server%20icons%2C%20clean%20geometric%20design%2C%20purple%20and%20blue%20colors%2C%20educational%20technology%20style&width=400&height=200&seq=database-course&orientation=landscape'
    }
  ];

  return (
    <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-lg border`}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>My Groups</h3>
          <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{groups.length} enrolled</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {groups.map((group) => (
            <Link key={group.id} to={`/student/groups/${group.id}`}>
              <div className={`border rounded-xl overflow-hidden transition-shadow cursor-pointer ${isDarkMode ? 'border-gray-700 hover:shadow-lg hover:shadow-gray-900/50' : 'border-gray-200 hover:shadow-lg'}`}>
                <div className="relative h-32">
                  <img
                    src={group.image}
                    alt={group.name}
                    className="w-full h-full object-cover object-top"
                  />
                  <div className={`absolute top-3 left-3 w-3 h-3 rounded-full ${group.color}`}></div>
                </div>
                
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className={`text-lg font-semibold truncate ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{group.name}</h4>
                    <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{group.progress}%</span>
                  </div>
                  
                  <p className={`text-sm mb-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{group.teacher}</p>
                  
                  <div className="mb-3">
                    <div className={`w-full rounded-full h-2 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                      <div 
                        className={`h-2 rounded-full ${group.color}`}
                        style={{ width: `${group.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className={`grid grid-cols-2 gap-4 text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    <div className="flex items-center">
                      <i className="ri-group-line w-4 h-4 flex items-center justify-center mr-2"></i>
                      <span>{group.students} students</span>
                    </div>
                    
                    <div className="flex items-center">
                      <i className="ri-time-line w-4 h-4 flex items-center justify-center mr-2"></i>
                      <span>{group.nextLesson}</span>
                    </div>
                    
                    <div className="flex items-center">
                      <i className="ri-task-line w-4 h-4 flex items-center justify-center mr-2"></i>
                      <span>{group.completedAssignments}/{group.assignments} tasks</span>
                    </div>
                    
                    <div className="flex items-center">
                      <i className="ri-trophy-line w-4 h-4 flex items-center justify-center mr-2"></i>
                      <span>Level {Math.floor(group.progress / 25) + 1}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
