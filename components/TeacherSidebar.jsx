import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function TeacherSidebar() {
  const { pathname } = useLocation();
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(savedDarkMode);

    const handleStorageChange = () => {
      const theme = localStorage.getItem('darkMode');
      setIsDarkMode(theme === 'true');
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const menuItems = [
    { name: 'Dashboard', href: '/teacher/dashboard', icon: 'ri-dashboard-line' },
    { name: 'Groups', href: '/teacher/groups', icon: 'ri-group-line' },
    { name: 'Schedule', href: '/teacher/schedule', icon: 'ri-calendar-line' },
    { name: 'Students', href: '/teacher/students', icon: 'ri-user-line' },
    { name: 'Settings', href: '/teacher/settings', icon: 'ri-settings-line' },
  ];

  return (
    <div className={`fixed left-0 top-0 h-full w-64 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-r z-40`}>
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
            <i className="ri-graduation-cap-line w-5 h-5 flex items-center justify-center text-white"></i>
          </div>
          <span className={`font-['Pacifico'] text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>EduCenter</span>
        </div>
      </div>

      <nav className="mt-8">
        <div className="px-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                pathname === item.href
                  ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                  : isDarkMode
                  ? 'text-gray-300 hover:text-white hover:bg-gray-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <i className={`${item.icon} w-5 h-5 flex items-center justify-center mr-3`}></i>
              {item.name}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
