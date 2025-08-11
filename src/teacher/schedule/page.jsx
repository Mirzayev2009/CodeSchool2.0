


import { useState, useEffect } from 'react';
import TeacherHeader from '../../../components/TeacherHeader';
import TeacherSidebar from '../../../components/TeacherSidebar';

export default function SchedulePage() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentWeek, setCurrentWeek] = useState(0); // 0 = current week, 1 = next week, -1 = previous week
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
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

  // Get week dates based on current week offset
  const getWeekDates = () => {
    if (!isClient) {
      // Return static dates for server rendering
      return Array.from({ length: 7 }, (_, i) => {
        const date = new Date(2024, 11, 23); // Fixed date for SSR
        date.setDate(23 + i);
        return date;
      });
    }
    
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
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  // Mock lessons data with different times for each day
  const lessonsData = {
    0: { // Monday
      lessons: [
        { id: 1, time: '09:00', group: 'JavaScript Fundamentals', room: 'Room 201', students: 28, color: 'bg-blue-500' },
        { id: 2, time: '11:30', group: 'React Development', room: 'Room 203', students: 22, color: 'bg-purple-500' },
        { id: 3, time: '14:00', group: 'Python Basics', room: 'Room 205', students: 25, color: 'bg-green-500' }
      ]
    },
    1: { // Tuesday
      lessons: [
        { id: 4, time: '10:00', group: 'Advanced JavaScript', room: 'Room 202', students: 18, color: 'bg-blue-600' },
        { id: 5, time: '13:30', group: 'Database Design', room: 'Room 204', students: 20, color: 'bg-indigo-500' }
      ]
    },
    2: { // Wednesday
      lessons: [
        { id: 6, time: '09:30', group: 'JavaScript Fundamentals', room: 'Room 201', students: 28, color: 'bg-blue-500', isLive: isClient },
        { id: 7, time: '12:00', group: 'Web Design', room: 'Room 206', students: 15, color: 'bg-pink-500' },
        { id: 8, time: '15:30', group: 'React Development', room: 'Room 203', students: 22, color: 'bg-purple-500' }
      ]
    },
    3: { // Thursday
      lessons: [
        { id: 9, time: '08:30', group: 'Python Basics', room: 'Room 205', students: 25, color: 'bg-green-500' },
        { id: 10, time: '11:00', group: 'Mobile Development', room: 'Room 207', students: 16, color: 'bg-orange-500' },
        { id: 11, time: '14:30', group: 'Advanced JavaScript', room: 'Room 202', students: 18, color: 'bg-blue-600' }
      ]
    },
    4: { // Friday
      lessons: [
        { id: 12, time: '10:30', group: 'Database Design', room: 'Room 204', students: 20, color: 'bg-indigo-500' },
        { id: 13, time: '13:00', group: 'Web Design', room: 'Room 206', students: 15, color: 'bg-pink-500' }
      ]
    },
    5: { // Saturday
      lessons: [
        { id: 14, time: '09:00', group: 'Weekend Bootcamp', room: 'Room 208', students: 30, color: 'bg-red-500' },
        { id: 15, time: '11:30', group: 'Project Workshop', room: 'Room 209', students: 12, color: 'bg-yellow-500' }
      ]
    },
    6: { // Sunday
      lessons: [] // Free day
    }
  };

  const isToday = (date) => {
    if (!isClient) return false;
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const getCurrentTime = () => {
    if (!isClient) return '09:30';
    return new Date().toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const isLessonLive = (lesson) => {
    if (!isClient) return false;
    const currentTime = getCurrentTime();
    const lessonTime = lesson.time;
    
    // Simple check if lesson is happening now (within 1 hour window)
    return lesson.isLive || Math.abs(new Date(`2024-01-01 ${currentTime}`) - new Date(`2024-01-01 ${lessonTime}`)) < 3600000;
  };

  const changeWeek = (direction) => {
    setCurrentWeek(prev => prev + direction);
  };

  const getWeekLabel = () => {
    if (currentWeek === 0) return 'This Week';
    if (currentWeek === 1) return 'Next Week';
    if (currentWeek === -1) return 'Last Week';
    if (currentWeek > 1) return `${currentWeek} Weeks Ahead`;
    return `${Math.abs(currentWeek)} Weeks Ago`;
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`} suppressHydrationWarning={true}>
      <TeacherHeader />
      
      <div className="flex">
        <TeacherSidebar />
        
        <main className="flex-1 p-6 ml-64">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Weekly Schedule
                </h1>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} suppressHydrationWarning={true}>
                  {weekDates[0].toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} - {weekDates[6].toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
              
              {/* Week Navigation */}
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => changeWeek(-1)}
                  className={`p-2 rounded-lg transition-colors ${
                    isDarkMode 
                      ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' 
                      : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                  }`}
                >
                  <i className="ri-arrow-left-line w-5 h-5 flex items-center justify-center"></i>
                </button>
                
                <div className={`px-4 py-2 rounded-lg font-medium ${
                  isDarkMode ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-800 border border-gray-200'
                }`}>
                  {getWeekLabel()}
                </div>
                
                <button
                  onClick={() => changeWeek(1)}
                  className={`p-2 rounded-lg transition-colors ${
                    isDarkMode 
                      ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' 
                      : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                  }`}
                >
                  <i className="ri-arrow-right-line w-5 h-5 flex items-center justify-center"></i>
                </button>
              </div>
            </div>

            {/* Weekly Schedule Grid */}
            <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-lg border`}>
              <div className="p-6">
                <div className="grid grid-cols-7 gap-4">
                  {days.map((day, index) => {
                    const date = weekDates[index];
                    const dayLessons = lessonsData[index]?.lessons || [];
                    const isTodayDate = isToday(date);
                    
                    return (
                      <div key={day} className="space-y-3">
                        {/* Date Header */}
                        <div className={`text-center p-3 rounded-lg ${
                          isTodayDate 
                            ? 'bg-blue-600 text-white' 
                            : isDarkMode 
                              ? 'bg-gray-700 text-gray-200' 
                              : 'bg-gray-100 text-gray-800'
                        }`} suppressHydrationWarning={true}>
                          <div className="font-semibold text-sm">{day}</div>
                          <div className={`text-lg font-bold ${isTodayDate ? 'text-white' : ''}`}>
                            {date.getDate()}
                          </div>
                          <div className={`text-xs opacity-75 ${isTodayDate ? 'text-blue-100' : ''}`}>
                            {date.toLocaleDateString('en-US', { month: 'short' })}
                          </div>
                        </div>

                        {/* Lessons for this day */}
                        <div className="space-y-2 min-h-[400px]">
                          {dayLessons.length === 0 ? (
                            <div className={`text-center py-8 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                              <i className="ri-calendar-line w-8 h-8 flex items-center justify-center mx-auto mb-2 opacity-50"></i>
                              <p className="text-sm">Free Day</p>
                            </div>
                          ) : (
                            dayLessons.map((lesson) => {
                              const isLive = isLessonLive(lesson);
                              
                              return (
                                <div
                                  key={lesson.id}
                                  className={`p-3 rounded-lg text-white text-sm relative overflow-hidden ${lesson.color} ${
                                    isLive ? 'ring-2 ring-yellow-400 shadow-lg' : ''
                                  }`}
                                  suppressHydrationWarning={true}
                                >
                                  {isLive && (
                                    <div className="absolute top-1 right-1">
                                      <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full animate-pulse">
                                        LIVE
                                      </span>
                                    </div>
                                  )}
                                  
                                  <div className="font-bold text-lg mb-1">
                                    {lesson.time}
                                  </div>
                                  
                                  <div className="font-medium mb-1">
                                    {lesson.group}
                                  </div>
                                  
                                  <div className="text-xs opacity-90 flex items-center justify-between">
                                    <span className="flex items-center">
                                      <i className="ri-map-pin-line w-3 h-3 flex items-center justify-center mr-1"></i>
                                      {lesson.room}
                                    </span>
                                    <span className="flex items-center">
                                      <i className="ri-user-line w-3 h-3 flex items-center justify-center mr-1"></i>
                                      {lesson.students}
                                    </span>
                                  </div>
                                  
                                  {isLive && (
                                    <div className="mt-2 text-xs bg-white bg-opacity-20 rounded px-2 py-1 text-center">
                                      Currently in session
                                    </div>
                                  )}
                                </div>
                              );
                            })
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Today's Summary */}
            <div className={`mt-6 p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-blue-50'}`} suppressHydrationWarning={true}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <i className={`ri-time-line w-5 h-5 flex items-center justify-center ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}></i>
                  <div>
                    <h3 className={`font-semibold ${isDarkMode ? 'text-blue-400' : 'text-blue-900'}`}>
                      Today's Status
                    </h3>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-blue-700'}`}>
                      Current time: {getCurrentTime()}
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  {(() => {
                    const todayIndex = weekDates.findIndex(date => isToday(date));
                    const todayLessons = todayIndex !== -1 ? (lessonsData[todayIndex]?.lessons || []) : [];
                    const liveLessons = todayLessons.filter(lesson => isLessonLive(lesson));
                    
                    if (liveLessons.length > 0) {
                      return (
                        <div className={`text-sm ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                          <div className="font-medium">Currently Teaching</div>
                          <div>{liveLessons[0].group}</div>
                        </div>
                      );
                    } else if (todayLessons.length > 0) {
                      return (
                        <div className={`text-sm ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'}`}>
                          <div className="font-medium">{todayLessons.length} lessons today</div>
                          <div>Next: {todayLessons.find(l => l.time > getCurrentTime())?.time || 'No more lessons'}</div>
                        </div>
                      );
                    } else {
                      return (
                        <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          <div className="font-medium">Free Day</div>
                          <div>No lessons scheduled</div>
                        </div>
                      );
                    }
                  })()}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}