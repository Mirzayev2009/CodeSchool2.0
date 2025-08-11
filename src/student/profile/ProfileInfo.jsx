

import { useState, useEffect } from 'react';

export default function ProfileInfo() {
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

  const studentData = {
    name: 'Alex Johnson',
    studentId: 'ST2024001',
    email: 'alex.johnson@codeschool.com',
    phone: '+1 (555) 123-4567',
    dateOfBirth: 'March 15, 2002',
    address: '123 University Ave, Student City, SC 12345',
    avatar: 'https://readdy.ai/api/search-image?query=professional%20headshot%20of%20young%20college%20student%20with%20friendly%20smile%2C%20modern%20student%20portrait%2C%20clean%20white%20background%2C%20high%20quality%20photography%2C%20natural%20lighting%2C%20confident%20expression&width=150&height=150&seq=student-profile&orientation=squarish',
    level: 'Intermediate',
    enrollmentDate: 'September 2023',
    group: 'Programming Group A',
    teacher: 'Dr. Sarah Johnson',
    emergencyContact: {
      name: 'Sarah Johnson (Mother)',
      phone: '+1 (555) 987-6543'
    }
  };

  return (
    <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-lg border`}>
      <div className="p-6">
        <div className="text-center mb-6">
          <img
            src={studentData.avatar}
            alt={studentData.name}
            className="w-24 h-24 rounded-full object-cover object-top mx-auto mb-4"
          />
          <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{studentData.name}</h2>
          <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Student ID: {studentData.studentId}</p>
          <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full mt-2">
            {studentData.level} Level
          </span>
        </div>

        <div className="space-y-4 mb-6">
          <div className={`border-b pb-4 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <h3 className={`text-lg font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Personal Information</h3>
            
            <div className="space-y-3">
              <div className="flex items-center">
                <i className={`ri-mail-line w-4 h-4 flex items-center justify-center mr-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}></i>
                <div>
                  <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Email</span>
                  <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{studentData.email}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <i className={`ri-phone-line w-4 h-4 flex items-center justify-center mr-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}></i>
                <div>
                  <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Phone</span>
                  <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{studentData.phone}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <i className={`ri-calendar-line w-4 h-4 flex items-center justify-center mr-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}></i>
                <div>
                  <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Date of Birth</span>
                  <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{studentData.dateOfBirth}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <i className={`ri-map-pin-line w-4 h-4 flex items-center justify-center mr-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}></i>
                <div>
                  <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Address</span>
                  <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{studentData.address}</p>
                </div>
              </div>
            </div>
          </div>

          <div className={`border-b pb-4 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <h3 className={`text-lg font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Study Information</h3>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Group</span>
                <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{studentData.group}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Teacher</span>
                <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{studentData.teacher}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Enrolled</span>
                <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{studentData.enrollmentDate}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className={`text-lg font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Emergency Contact</h3>
            <div className="flex items-center">
              <i className={`ri-contacts-line w-4 h-4 flex items-center justify-center mr-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}></i>
              <div>
                <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{studentData.emergencyContact.name}</p>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{studentData.emergencyContact.phone}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
