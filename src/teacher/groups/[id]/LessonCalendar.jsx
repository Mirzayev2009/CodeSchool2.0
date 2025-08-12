
'use client';

import { useState, useEffect } from 'react';

export default function LessonCalendar({ groupId }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [currentWeek, setCurrentWeek] = useState(0); // 0 = current week, 1 = next week, -1 = previous week
  const [openedDates, setOpenedDates] = useState({}); // Track which future dates are opened
  

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

  const students =[
  {
    "id": 1,
    "name": "Ali Mirzayev",
    "attendance": {
      "2025-07-15": "present",
      "2025-07-16": "absent",
      "2025-07-17": "present",
      "2025-07-18": "excused",
      "2025-07-19": "present",
      "2025-07-20": "present",
      "2025-07-21": "absent",
      "2025-07-22": "present",
      "2025-07-23": "present",
      "2025-07-24": "excused",
      "2025-07-25": "present",
      "2025-07-26": "absent",
      "2025-07-27": "present",
      "2025-07-28": "present",
      "2025-07-29": "present",
      "2025-07-30": "absent",
      "2025-07-31": "present",
      "2025-08-01": "present",
      "2025-08-02": "present",
      "2025-08-03": "excused",
      "2025-08-04": "present",
      "2025-08-05": "absent",
      "2025-08-06": "present",
      "2025-08-07": "present",
      "2025-08-08": "present",
      "2025-08-09": "absent",
      "2025-08-10": "present",
      "2025-08-11": "present",
      "2025-08-12": "present",
      "2025-08-13": "excused",
      "2025-08-14": "present",
      "2025-08-15": "present"
    }
  },
  {
    "id": 2,
    "name": "Nilufar Ergasheva",
    "attendance": {
      "2025-07-15": "excused",
      "2025-07-16": "present",
      "2025-07-17": "present",
      "2025-07-18": "absent",
      "2025-07-19": "present",
      "2025-07-20": "present",
      "2025-07-21": "present",
      "2025-07-22": "excused",
      "2025-07-23": "present",
      "2025-07-24": "present",
      "2025-07-25": "absent",
      "2025-07-26": "present",
      "2025-07-27": "present",
      "2025-07-28": "present",
      "2025-07-29": "present",
      "2025-07-30": "present",
      "2025-07-31": "absent",
      "2025-08-01": "present",
      "2025-08-02": "present",
      "2025-08-03": "present",
      "2025-08-04": "present",
      "2025-08-05": "excused",
      "2025-08-06": "present",
      "2025-08-07": "absent",
      "2025-08-08": "present",
      "2025-08-09": "present",
      "2025-08-10": "present",
      "2025-08-11": "present",
      
    }
  },
  {
    "id": 3,
    "name": "Jasur Ismoilov",
    "attendance": {
      "2025-07-15": "present",
      "2025-07-16": "present",
      "2025-07-17": "absent",
      "2025-07-18": "present",
      "2025-07-19": "present",
      "2025-07-20": "excused",
      "2025-07-21": "present",
      "2025-07-22": "present",
      "2025-07-23": "present",
      "2025-07-24": "absent",
      "2025-07-25": "present",
      "2025-07-26": "present",
      "2025-07-27": "present",
      "2025-07-28": "present",
      "2025-07-29": "present",
      "2025-07-30": "present",
      "2025-07-31": "present",
      "2025-08-01": "absent",
      "2025-08-02": "present",
      "2025-08-03": "present",
      "2025-08-04": "present",
      "2025-08-05": "present",
      "2025-08-06": "present",
      "2025-08-07": "present",
      "2025-08-08": "present",
      "2025-08-09": "absent",
      "2025-08-10": "present",
      "2025-08-11": "present",

    }
  },
  {
    "id": 4,
    "name": "Kamola Abdullayeva",
    "attendance": {
      "2025-07-15": "present",
      "2025-07-16": "excused",
      "2025-07-17": "present",
      "2025-07-18": "present",
      "2025-07-19": "absent",
      "2025-07-20": "present",
      "2025-07-21": "present",
      "2025-07-22": "present",
      "2025-07-23": "present",
      "2025-07-24": "present",
      "2025-07-25": "absent",
      "2025-07-26": "present",
      "2025-07-27": "present",
      "2025-07-28": "present",
      "2025-07-29": "present",
      "2025-07-30": "present",
      "2025-07-31": "present",
      "2025-08-01": "present",
      "2025-08-02": "absent",
      "2025-08-03": "present",
      "2025-08-04": "present",
      "2025-08-05": "present",
      "2025-08-06": "present",
      "2025-08-07": "excused",
      "2025-08-08": "present",
      "2025-08-09": "present",
      "2025-08-10": "present",
      "2025-08-11": "present",

    }
  },
  {
    "id": 5,
    "name": "Bobur Rahimov",
    "attendance": {
      "2025-07-15": "present",
      "2025-07-16": "present",
      "2025-07-17": "present",
      "2025-07-18": "absent",
      "2025-07-19": "present",
      "2025-07-20": "present",
      "2025-07-21": "present",
      "2025-07-22": "excused",
      "2025-07-23": "present",
      "2025-07-24": "present",
      "2025-07-25": "present",
      "2025-07-26": "absent",
      "2025-07-27": "present",
      "2025-07-28": "present",
      "2025-07-29": "present",
      "2025-07-30": "present",
      "2025-07-31": "present",
      "2025-08-01": "present",
      "2025-08-02": "present",
      "2025-08-03": "absent",
      "2025-08-04": "present",
      "2025-08-05": "present",
      "2025-08-06": "present",
      "2025-08-07": "present",
      "2025-08-08": "present",
      "2025-08-09": "present",
      "2025-08-10": "present",
      "2025-08-11": "excused",

    }
  },
  {
    "id": 6,
    "name": "Nargiza Toshmatova",
    "attendance": {
      "2025-07-15": "absent",
      "2025-07-16": "present",
      "2025-07-17": "present",
      "2025-07-18": "present",
      "2025-07-19": "present",
      "2025-07-20": "present",
      "2025-07-21": "present",
      "2025-07-22": "present",
      "2025-07-23": "excused",
      "2025-07-24": "present",
      "2025-07-25": "present",
      "2025-07-26": "present",
      "2025-07-27": "absent",
      "2025-07-28": "present",
      "2025-07-29": "present",
      "2025-07-30": "present",
      "2025-07-31": "present",
      "2025-08-01": "present",
      "2025-08-02": "present",
      "2025-08-03": "present",
      "2025-08-04": "present",
      "2025-08-05": "present",
      "2025-08-06": "present",
      "2025-08-07": "present",
      "2025-08-08": "present",
      "2025-08-09": "absent",
      "2025-08-10": "present",
      "2025-08-11": "present",

    }
  },
  {
    "id": 7,
    "name": "Sardor Karimov",
    "attendance": {
      "2025-07-15": "present",
      "2025-07-16": "present",
      "2025-07-17": "absent",
      "2025-07-18": "present",
      "2025-07-19": "present",
      "2025-07-20": "present",
      "2025-07-21": "present",
      "2025-07-22": "present",
      "2025-07-23": "present",
      "2025-07-24": "absent",
      "2025-07-25": "present",
      "2025-07-26": "present",
      "2025-07-27": "present",
      "2025-07-28": "excused",
      "2025-07-29": "present",
      "2025-07-30": "present",
      "2025-07-31": "present",
      "2025-08-01": "present",
      "2025-08-02": "present",
      "2025-08-03": "present",
      "2025-08-04": "present",
      "2025-08-05": "present",
      "2025-08-06": "present",
      "2025-08-07": "present",
      "2025-08-08": "present",
      "2025-08-09": "absent",
      "2025-08-10": "present",
      "2025-08-11": "present",

    }
  },
  {
    "id": 8,
    "name": "Dilorom Nazarova",
    "attendance": {
      "2025-07-15": "present",
      "2025-07-16": "present",
      "2025-07-17": "present",
      "2025-07-18": "absent",
      "2025-07-19": "present",
      "2025-07-20": "present",
      "2025-07-21": "present",
      "2025-07-22": "present",
      "2025-07-23": "present",
      "2025-07-24": "present",
      "2025-07-25": "present",
      "2025-07-26": "present",
      "2025-07-27": "absent",
      "2025-07-28": "present",
      "2025-07-29": "present",
      "2025-07-30": "present",
      "2025-07-31": "present",
      "2025-08-01": "present",
      "2025-08-02": "present",
      "2025-08-03": "excused",
      "2025-08-04": "present",
      "2025-08-05": "present",
      "2025-08-06": "present",
      "2025-08-07": "present",
      "2025-08-08": "present",
      "2025-08-09": "present",
      "2025-08-10": "present",
      "2025-08-11": "absent",

    }
  },
  {
    "id": 9,
    "name": "Otabek Yusupov",
    "attendance": {
      "2025-07-15": "present",
      "2025-07-16": "present",
      "2025-07-17": "present",
      "2025-07-18": "present",
      "2025-07-19": "excused",
      "2025-07-20": "present",
      "2025-07-21": "present",
      "2025-07-22": "absent",
      "2025-07-23": "present",
      "2025-07-24": "present",
      "2025-07-25": "present",
      "2025-07-26": "present",
      "2025-07-27": "present",
      "2025-07-28": "present",
      "2025-07-29": "present",
      "2025-07-30": "absent",
      "2025-07-31": "present",
      "2025-08-01": "present",
      "2025-08-02": "present",
      "2025-08-03": "present",
      "2025-08-04": "present",
      "2025-08-05": "present",
      "2025-08-06": "absent",
      "2025-08-07": "present",
      "2025-08-08": "present",
      "2025-08-09": "present",
      "2025-08-10": "present",
      "2025-08-11": "present",

    }
  },
  {
    "id": 10,
    "name": "Gulnoza Sharipova",
    "attendance": {
      "2025-07-15": "present",
      "2025-07-16": "absent",
      "2025-07-17": "present",
      "2025-07-18": "present",
      "2025-07-19": "present",
      "2025-07-20": "present",
      "2025-07-21": "present",
      "2025-07-22": "present",
    }}

  ];

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const getWeekDates = () => {
  const currentDate = new Date();
  const firstDayOfWeek = new Date(currentDate);
  const dayOfWeek = currentDate.getDay();
  const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Monday as first day
  firstDayOfWeek.setDate(currentDate.getDate() + diff + (currentWeek * 7));
  
  const weekDates = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(firstDayOfWeek);
    date.setDate(firstDayOfWeek.getDate() + i);
    weekDates.push(date);
  }
  return weekDates;
};

const weekDates = getWeekDates();

const [attendanceData, setAttendanceData] = useState(() => {
  const data = {};
  students.forEach(student => {
    data[student.id] = {};
    days.forEach((day, index) => {
      const dateObj = weekDates[index];
      const dateKey = dateObj.toISOString().slice(0, 10);
      // If no attendance, leave empty string
      data[student.id][day] = student.attendance?.[dateKey] || '';
    });
  });
  return data;
});

  const isPastDate = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const isFutureDate = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date > today;
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const toggleAttendance = (studentId, dayIndex) => {
    const date = weekDates[dayIndex];
    const dayKey = `${dayIndex}_${currentWeek}`;
    const isTodayDate = isToday(date);
    const isPast = isPastDate(date);
    const isFuture = isFutureDate(date);

    // Only allow toggle if:
    // - Today (always)
    // - Past and Edit Mode is ON
    if (!(isTodayDate || (isPast && isEditMode))) return;

    setAttendanceData(prev => {
      const current = prev[studentId][days[dayIndex]] || '';
      let next = '';
      // Cycle: empty → present → absent → excused → empty
      if (current === '') next = 'present';
      else if (current === 'present') next = 'absent';
      else if (current === 'absent') next = 'excused';
      else if (current === 'excused') next = '';

      setHasChanges(true);

      return {
        ...prev,
        [studentId]: {
          ...prev[studentId],
          [days[dayIndex]]: next
        }
      };
    });
  };

  const toggleDateAccess = (dayIndex) => {
    const date = weekDates[dayIndex];
    const dayKey = `${dayIndex}_${currentWeek}`;
    
    if (isFutureDate(date)) {
      setOpenedDates(prev => ({
        ...prev,
        [dayKey]: !prev[dayKey]
      }));
    }
  };

  const saveChanges = () => {
    console.log('Saving attendance changes:', attendanceData);
    setIsEditMode(false);
    setHasChanges(false);
    // Show success feedback
    const successMsg = document.createElement('div');
    successMsg.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
    successMsg.textContent = 'Attendance saved successfully!';
    document.body.appendChild(successMsg);
    setTimeout(() => document.body.removeChild(successMsg), 3000);
  };

  const cancelEdit = () => {
    setIsEditMode(false);
    setHasChanges(false);
    setOpenedDates({}); // Close all future dates
  };

  const changeWeek = (direction) => {
    setCurrentWeek(prev => prev + direction);
    setOpenedDates({}); // Reset opened dates when changing weeks
    setIsEditMode(false);
    setHasChanges(false);
  };

  const getAttendanceIcon = (status) => {
    switch (status) {
      case 'present': return '✅';
      case 'absent': return '❌';
      case 'excused': return '➖';
      case '': return '';
      default: return '';
    }
  };

  const getAttendanceColor = (status, isDisabled = false) => {
    if (isDisabled) {
      return 'text-gray-400 bg-gray-100 cursor-not-allowed opacity-50';
    }
    switch (status) {
      case 'present': return 'text-green-600 bg-green-50';
      case 'absent': return 'text-red-600 bg-red-50';
      case 'excused': return 'text-yellow-600 bg-yellow-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getAttendanceStats = () => {
    let totalPresent = 0, totalAbsent = 0, totalExcused = 0;
    
    students.forEach(student => {
      days.forEach(day => {
        const status = attendanceData[student.id][day];
        if (status === 'present') totalPresent++;
        else if (status === 'absent') totalAbsent++;
        else if (status === 'excused') totalExcused++;
      });
    });

    const total = totalPresent + totalAbsent + totalExcused;
    const attendanceRate = total > 0 ? Math.round((totalPresent / total) * 100) : 0;

    return { attendanceRate, totalPresent, totalAbsent, totalExcused };
  };

  const stats = getAttendanceStats();

  return (
    <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-lg border`}>
      {/* Header with Stats and Controls */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-4">
            <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Weekly Attendance Management
            </h3>
            
            {/* Week Navigation */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => changeWeek(-1)}
                className={`p-1 rounded transition-colors ${
                  isDarkMode 
                    ? 'hover:bg-gray-700 text-gray-400 hover:text-gray-200' 
                    : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
                }`}
              >
                <i className="ri-arrow-left-line w-4 h-4 flex items-center justify-center"></i>
              </button>
              
              <span className={`text-sm px-3 py-1 rounded-lg ${
                isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
              }`}>
                {currentWeek === 0 ? 'This Week' : 
                 currentWeek > 0 ? `${currentWeek} Week${currentWeek > 1 ? 's' : ''} Ahead` : 
                 `${Math.abs(currentWeek)} Week${Math.abs(currentWeek) > 1 ? 's' : ''} Ago`}
              </span>
              
              <button
                onClick={() => changeWeek(1)}
                className={`p-1 rounded transition-colors ${
                  isDarkMode 
                    ? 'hover:bg-gray-700 text-gray-400 hover:text-gray-200' 
                    : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
                }`}
              >
                <i className="ri-arrow-right-line w-4 h-4 flex items-center justify-center"></i>
              </button>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {weekDates[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {weekDates[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </div>
            
            {/* Edit/Save Controls */}
            <div className="flex items-center space-x-2">
              {/* Always show Edit Mode button if not in edit mode and no unsaved changes */}
              {!isEditMode && !hasChanges && (
                <button
                  onClick={() => setIsEditMode(true)}
                  className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
                >
                  <i className="ri-edit-line w-4 h-4 flex items-center justify-center mr-1"></i>
                  Edit Mode
                </button>
              )}
              {/* Show Save/Cancel if there are unsaved changes (even if not in edit mode) */}
              {hasChanges && (
                <>
                  <button
                    onClick={cancelEdit}
                    className={`px-3 py-1.5 text-sm rounded-lg transition-colors whitespace-nowrap ${
                      isDarkMode 
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveChanges}
                    className={`px-3 py-1.5 text-sm rounded-lg transition-colors whitespace-nowrap ${
                      hasChanges 
                        ? 'bg-green-600 text-white hover:bg-green-700' 
                        : 'bg-gray-400 text-white cursor-not-allowed'
                    }`}
                    disabled={!hasChanges}
                  >
                    <i className="ri-save-line w-4 h-4 flex items-center justify-center mr-1"></i>
                    Save Changes
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Edit Mode Indicator */}
        {isEditMode && (
          <div className="mb-3 p-2 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center text-blue-800">
              <i className="ri-edit-line w-4 h-4 flex items-center justify-center mr-2"></i>
              <span className="text-sm font-medium">Edit Mode Active - Click attendance marks to modify. Future dates must be unlocked first.</span>
              {hasChanges && (
                <span className="ml-2 text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">
                  Unsaved changes
                </span>
              )}
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-3 text-xs">
          <div className={`text-center p-2 rounded ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <div className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{students.length}</div>
            <div className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Total Students</div>
          </div>
          <div className={`text-center p-2 rounded ${isDarkMode ? 'bg-green-900' : 'bg-green-50'}`}>
            <div className={`font-bold text-lg ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>{stats.attendanceRate}%</div>
            <div className={isDarkMode ? 'text-green-300' : 'text-green-600'}>Week Average</div>
          </div>
          <div className={`text-center p-2 rounded ${isDarkMode ? 'bg-blue-900' : 'bg-blue-50'}`}>
            <div className={`font-bold text-lg ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>Ali M.</div>
            <div className={isDarkMode ? 'text-blue-300' : 'text-blue-600'}>Best Attendance</div>
          </div>
          <div className={`text-center p-2 rounded ${isDarkMode ? 'bg-orange-900' : 'bg-orange-50'}`}>
            <div className={`font-bold text-lg ${isDarkMode ? 'text-orange-400' : 'text-orange-600'}`}>Jasur I.</div>
            <div className={isDarkMode ? 'text-orange-300' : 'text-orange-600'}>Needs Attention</div>
          </div>
        </div>
      </div>

      {/* Calendar Grid - Enhanced */}
      <div className="p-2">
        <div className="grid grid-cols-8 gap-1 text-xs">
          {/* Header */}
          <div className={`p-2 font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Student</div>
          {days.map((day, dayIndex) => {
            const date = weekDates[dayIndex];
            const dayKey = `${dayIndex}_${currentWeek}`;
            const isTodayDate = isToday(date);
            const isPast = isPastDate(date);
            const isFuture = isFutureDate(date);
            const isOpened = openedDates[dayKey];
            
            return (
              <div 
                key={day} 
                className={`p-2 text-center font-medium rounded transition-colors ${
                  isTodayDate 
                    ? 'bg-blue-600 text-white' 
                    : isFuture && !isOpened
                    ? isDarkMode 
                      ? 'bg-gray-700 text-gray-500 cursor-pointer hover:bg-gray-600'
                      : 'bg-gray-200 text-gray-500 cursor-pointer hover:bg-gray-300'
                    : isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}
                onClick={() => toggleDateAccess(dayIndex)}
                title={isFuture && !isOpened ? 'Click to unlock this date for editing' : ''}
              >
                <div>{day}</div>
                <div className="text-xs opacity-75">{date.getDate()}</div>
                {isFuture && !isOpened && (
                  <i className="ri-lock-line w-3 h-3 flex items-center justify-center mx-auto mt-1"></i>
                )}
                {isFuture && isOpened && (
                  <i className="ri-lock-unlock-line w-3 h-3 flex items-center justify-center mx-auto mt-1"></i>
                )}
              </div>
            );
          })}

          {/* Student Rows - Enhanced */}
          {students.map((student) => (
            <>
              <div 
                key={student.id}
                className={`p-1 text-xs font-medium truncate ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
                title={student.name}
              >
                {student.name.split(' ')[0]} {student.name.split(' ')[1]?.charAt(0)}.
              </div>
              {days.map((day, dayIndex) => {
                const date = weekDates[dayIndex];
                const isTodayDate = isToday(date);
                const isPast = isPastDate(date);
                const isFuture = isFutureDate(date);

                // Button is enabled if:
                // - Today (always editable)
                // - Past and Edit Mode is ON
                // Otherwise (future), always disabled
                let isDisabled = false;
                if (isTodayDate) {
                  isDisabled = false;
                } else if (isPast) {
                  isDisabled = !isEditMode;
                } else if (isFuture) {
                  isDisabled = true;
                }

                return (
                  <button
                    key={`${student.id}-${day}`}
                    onClick={() => toggleAttendance(student.id, dayIndex)}
                    className={`p-1 m-0.5 rounded text-xs font-medium transition-colors ${
                      getAttendanceColor(attendanceData[student.id][day], isDisabled)
                    } ${
                      (!isDisabled)
                        ? 'hover:opacity-80 cursor-pointer ring-2 ring-transparent hover:ring-blue-300' 
                        : 'cursor-default'
                    }`}
                    title={`${student.name} - ${day}: ${attendanceData[student.id][day]} ${
                      !isDisabled ? '(Click to change)' :
                      isFuture ? '(Future date - locked)' :
                      isPast && !isEditMode ? '(Past date - click Edit Mode to change)' : ''
                    }`}
                    disabled={isDisabled}
                  >
                    {getAttendanceIcon(attendanceData[student.id][day])}
                  </button>
                );
              })}
            </>
          ))}
        </div>

        
        {/* {students.length > 8 && (
          <button 
            onClick={() => setShowStudents(true)}
            className={`w-full mt-2 p-2 text-xs border-t transition-colors ${
              isDarkMode 
                ? 'border-gray-600 text-gray-400 hover:text-gray-300 hover:bg-gray-700' 
                : 'border-gray-200 text-gray-600 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            Show {students.length - 8} more students...
          </button>
        )} */}
      </div>

      {/* Legend */}
      <div className={`px-4 py-2 border-t ${isDarkMode ? 'border-gray-700 bg-gray-750' : 'border-gray-200 bg-gray-50'}`}>
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <span className="mr-1">✅</span>
              <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Present</span>
            </div>
            <div className="flex items-center">
              <span className="mr-1">❌</span>
              <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Absent</span>
            </div>
            <div className="flex items-center">
              <span className="mr-1">➖</span>
              <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Excused</span>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center">
              <i className="ri-lock-line w-3 h-3 flex items-center justify-center mr-1"></i>
              <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Locked Future Date</span>
            </div>
            <div className="flex items-center">
              <i className="ri-lock-unlock-line w-3 h-3 flex items-center justify-center mr-1"></i>
              <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Unlocked for Editing</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
