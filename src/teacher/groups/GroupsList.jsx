
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function GroupsList() {
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

  const groups = [
    {
      id: '1',
      name: 'JavaScript Fundamentals',
      subject: 'Programming',
      students: 28,
      nextClass: '09:00 - 10:30',
      room: 'Room A-205'
    },
    {
      id: '2',
      name: 'React Development',
      subject: 'Web Development',
      students: 24,
      nextClass: '11:00 - 12:30',
      room: 'Computer Lab 1'
    },
    {
      id: '3',
      name: 'Python for Beginners',
      subject: 'Programming',
      students: 32,
      nextClass: '14:00 - 15:30',
      room: 'Room B-101'
    },
    {
      id: '4',
      name: 'Database Design',
      subject: 'Data Management',
      students: 20,
      nextClass: '16:00 - 17:30',
      room: 'Room A-301'
    },
    {
      id: '5',
      name: 'Algorithm Design',
      subject: 'Programming',
      students: 22,
      nextClass: '10:00 - 11:30',
      room: 'Room B-201'
    }
  ];

  return (
    <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-lg border`}>
      <div className="p-6">
        <h2 className={`text-xl font-semibold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          My Groups ({groups.length})
        </h2>

        <div className="space-y-3">
          {groups.map((group) => (
            <Link
              key={group.id}
              to={`/teacher/groups/${group.id}`}
              className={`block p-4 rounded-lg border transition-all hover:shadow-md ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 hover:bg-gray-650' 
                  : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {group.name}
                    </h3>
                    <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {group.students} students
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-6 text-sm">
                    <span className={`flex items-center ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      <i className="ri-book-line w-4 h-4 flex items-center justify-center mr-2"></i>
                      {group.subject}
                    </span>
                    <span className={`flex items-center ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      <i className="ri-time-line w-4 h-4 flex items-center justify-center mr-2"></i>
                      {group.nextClass}
                    </span>
                    <span className={`flex items-center ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      <i className="ri-map-pin-line w-4 h-4 flex items-center justify-center mr-2"></i>
                      {group.room}
                    </span>
                  </div>
                </div>
                
                <div className="ml-4">
                  <i className={`ri-arrow-right-line w-5 h-5 flex items-center justify-center ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`}></i>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
