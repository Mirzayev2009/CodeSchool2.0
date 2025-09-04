// TeacherSidebar.jsx
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function TeacherSidebar({ isOpen, onClose }) {
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

  // Handle menu click - close sidebar on mobile
  const handleMenuClick = () => {
    // Small delay to ensure navigation happens first
    setTimeout(() => {
      onClose();
    }, 100);
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
        />
      )}

      <aside
        className={`fixed left-0 top-0 h-full w-64 transform transition-transform duration-300 z-40
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-r`}
      >
        <div className={`p-4 sm:p-6 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} flex justify-between items-center`}>
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
              <i className="ri-graduation-cap-line text-white text-lg"></i>
            </div>
            <span
              className={`font-['Pacifico'] text-lg sm:text-xl font-semibold ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}
            >
              EduCenter
            </span>
          </div>
          {/* Close button (mobile only) */}
          <button 
            onClick={onClose} 
            className={`md:hidden p-1 rounded-md ${isDarkMode ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'} transition-all`}
          >
            <i className="ri-close-line text-xl"></i>
          </button>
        </div>

        <nav className="mt-6 px-3 sm:px-4 space-y-1 sm:space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              onClick={handleMenuClick}
              className={`flex items-center px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-sm font-medium transition-colors ${
                pathname === item.href
                  ? isDarkMode 
                    ? 'bg-blue-900 text-blue-300 border-r-2 border-blue-400'
                    : 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                  : isDarkMode
                  ? 'text-gray-300 hover:text-white hover:bg-gray-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <i className={`${item.icon} mr-3 w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center flex-shrink-0`}></i>
              <span className="truncate">{item.name}</span>
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
}