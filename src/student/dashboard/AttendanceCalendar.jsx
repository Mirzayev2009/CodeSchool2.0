
'use client';

import { useState, useEffect } from 'react';

export default function AttendanceCalendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
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

  const attendanceData = [
    { date: '2024-01-15', status: 'present', lesson: 'JavaScript Basics' },
    { date: '2024-01-17', status: 'present', lesson: 'React Components' },
    { date: '2024-01-19', status: 'absent', lesson: 'State Management' },
    { date: '2024-01-22', status: 'present', lesson: 'API Integration' },
    { date: '2024-01-24', status: 'present', lesson: 'Database Concepts' },
    { date: '2024-01-26', status: 'late', lesson: 'Authentication' },
    { date: '2024-01-29', status: 'present', lesson: 'Testing Fundamentals' },
    { date: '2024-01-31', status: 'present', lesson: 'Deployment' },
    { date: '2024-08-01', status: 'absent', lesson: 'Advanced JavaScript' },
    { date: '2024-08-02', status: 'present', lesson: 'React Hooks' },
    { date: '2024-08-05', status: 'late', lesson: 'State Management' }
  ];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    const currentDate = new Date(startDate);

    while (currentDate <= lastDay || days.length < 42) {
      days.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return days;
  };

  const getAttendanceStatus = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return attendanceData.find(item => item.date === dateStr);
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case 'present': 
        return {
          bg: 'bg-green-500',
          border: 'border-green-600',
          text: 'text-white',
          dot: 'bg-green-600'
        };
      case 'absent': 
        return {
          bg: 'bg-red-500',
          border: 'border-red-600',
          text: 'text-white',
          dot: 'bg-red-600'
        };
      case 'late': 
        return {
          bg: 'bg-orange-500',
          border: 'border-orange-600',
          text: 'text-white',
          dot: 'bg-orange-600'
        };
      default: 
        return {
          bg: isDarkMode ? 'bg-gray-800' : 'bg-white',
          border: isDarkMode ? 'border-gray-700' : 'border-gray-200',
          text: isDarkMode ? 'text-white' : 'text-gray-900',
          dot: ''
        };
    }
  };

  const days = getDaysInMonth(currentMonth);
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const attendanceStats = {
    present: attendanceData.filter(item => item.status === 'present').length,
    absent: attendanceData.filter(item => item.status === 'absent').length,
    late: attendanceData.filter(item => item.status === 'late').length
  };

  return (
    <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-lg border`}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Attendance Calendar</h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={previousMonth}
              className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`}
            >
              <i className="ri-arrow-left-line w-4 h-4 flex items-center justify-center"></i>
            </button>
            <h4 className={`text-lg font-medium px-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </h4>
            <button
              onClick={nextMonth}
              className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`}
            >
              <i className="ri-arrow-right-line w-4 h-4 flex items-center justify-center"></i>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2 mb-4">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className={`text-center text-sm font-medium p-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2 mb-6">
          {days.map((day, index) => {
            const attendance = getAttendanceStatus(day);
            const isCurrentMonth = day.getMonth() === currentMonth.getMonth();
            const styles = attendance ? getStatusStyles(attendance.status) : getStatusStyles('');

            return (
              <div
                key={index}
                className={`relative p-3 text-center text-sm border rounded-lg transition-colors min-h-[60px] flex flex-col justify-center ${
                  !isCurrentMonth 
                    ? isDarkMode 
                      ? 'text-gray-600 bg-gray-900 border-gray-800' 
                      : 'text-gray-300 bg-gray-50 border-gray-100'
                    : attendance
                      ? `${styles.bg} ${styles.border} ${styles.text}`
                      : isDarkMode
                        ? 'text-white bg-gray-800 border-gray-700 hover:bg-gray-750'
                        : 'text-gray-900 bg-white border-gray-200 hover:bg-gray-50'
                }`}
                title={attendance ? `${attendance.status} - ${attendance.lesson}` : ''}
              >
                <span className="font-medium">{day.getDate()}</span>
                {attendance && (
                  <div className={`w-2 h-2 rounded-full mx-auto mt-1 ${styles.dot}`}></div>
                )}
              </div>
            );
          })}
        </div>

        <div className={`border-t pt-6 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <h4 className={`text-lg font-medium mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Attendance Summary</h4>
          <div className="grid grid-cols-3 gap-4">
            <div className={`text-center p-4 rounded-lg border ${isDarkMode ? 'bg-green-900/30 border-green-800' : 'bg-green-50 border-green-200'}`}>
              <div className="w-4 h-4 bg-green-500 rounded-full mx-auto mb-2"></div>
              <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Present</p>
              <p className="text-xl font-bold text-green-600">{attendanceStats.present}</p>
            </div>

            <div className={`text-center p-4 rounded-lg border ${isDarkMode ? 'bg-orange-900/30 border-orange-800' : 'bg-orange-50 border-orange-200'}`}>
              <div className="w-4 h-4 bg-orange-500 rounded-full mx-auto mb-2"></div>
              <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Late</p>
              <p className="text-xl font-bold text-orange-600">{attendanceStats.late}</p>
            </div>

            <div className={`text-center p-4 rounded-lg border ${isDarkMode ? 'bg-red-900/30 border-red-800' : 'bg-red-50 border-red-200'}`}>
              <div className="w-4 h-4 bg-red-500 rounded-full mx-auto mb-2"></div>
              <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Absent</p>
              <p className="text-xl font-bold text-red-600">{attendanceStats.absent}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
