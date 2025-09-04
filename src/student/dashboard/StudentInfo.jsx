
'use client';

import { useState, useEffect } from 'react';
import { useUser } from '../../UserContext';

export default function StudentInfo() {
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

  const { user } = useUser();
  // Fallbacks for missing data
  const studentInfo = {
    name: user?.name || user?.username || 'Student',
    email: user?.email || 'N/A',
    phone: user?.phone || 'N/A',
    studentId: user?.student_id || user?.id || 'N/A',
    enrollmentDate: user?.enrollment_date || 'N/A',
    level: user?.level || 'N/A'
  };

  return (
    <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-lg border`}>
      <div className="p-6">
        <div className="text-center mb-6">
          <img
            src="https://readdy.ai/api/search-image?query=professional%20headshot%20of%20young%20college%20student%20with%20friendly%20smile%2C%20modern%20student%20portrait%2C%20clean%20white%20background%2C%20high%20quality%20photography%2C%20natural%20lighting%2C%20confident%20expression&width=200&height=200&seq=student-profile&orientation=squarish"
            alt="Student Profile"
            className="w-24 h-24 rounded-full mx-auto mb-4 object-cover object-top"
          />
          <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{studentInfo.name}</h3>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{studentInfo.level} Level Student</p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center">
            <div className={`w-10 h-10 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg flex items-center justify-center mr-3`}>
              <i className="ri-mail-line w-5 h-5 flex items-center justify-center text-blue-600"></i>
            </div>
            <div>
              <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Email</p>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{studentInfo.email}</p>
            </div>
          </div>

          <div className="flex items-center">
            <div className={`w-10 h-10 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg flex items-center justify-center mr-3`}>
              <i className="ri-phone-line w-5 h-5 flex items-center justify-center text-green-600"></i>
            </div>
            <div>
              <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Phone</p>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{studentInfo.phone}</p>
            </div>
          </div>

          <div className="flex items-center">
            <div className={`w-10 h-10 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg flex items-center justify-center mr-3`}>
              <i className="ri-id-card-line w-5 h-5 flex items-center justify-center text-purple-600"></i>
            </div>
            <div>
              <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Student ID</p>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{studentInfo.studentId}</p>
            </div>
          </div>

          <div className="flex items-center">
            <div className={`w-10 h-10 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg flex items-center justify-center mr-3`}>
              <i className="ri-calendar-line w-5 h-5 flex items-center justify-center text-orange-600"></i>
            </div>
            <div>
              <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Enrolled</p>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{studentInfo.enrollmentDate}</p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className={`mt-6 pt-6 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <h4 className={`text-lg font-medium mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Quick Stats</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className={`w-12 h-12 ${isDarkMode ? 'bg-blue-900/50' : 'bg-blue-100'} rounded-lg flex items-center justify-center mx-auto mb-2`}>
                <i className="ri-trophy-line w-6 h-6 flex items-center justify-center text-blue-600"></i>
              </div>
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Points</p>
              <p className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>1,247</p>
            </div>
            
            <div className="text-center">
              <div className={`w-12 h-12 ${isDarkMode ? 'bg-green-900/50' : 'bg-green-100'} rounded-lg flex items-center justify-center mx-auto mb-2`}>
                <i className="ri-medal-line w-6 h-6 flex items-center justify-center text-green-600"></i>
              </div>
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Rank</p>
              <p className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>#3</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
