// ✅ CORRECT (React Router)
import { Link } from 'react-router-dom';


import { useState, useEffect } from 'react';
import { useUser } from '../../UserContext';
import { getTeacherDashboard } from '../dashboardApi';

export default function TodayLessons() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { token } = useUser();
  const [todayLessons, setTodayLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(savedDarkMode);
  }, []);

  useEffect(() => {
    async function fetchDashboard() {
      setLoading(true);
      setError(null);
      try {
        const data = await getTeacherDashboard(token);
        // There is no today_lessons field, so we try to extract lessons from groups or recent_students
        // For demo, let's just show the groups as today's lessons
        const lessons = Array.isArray(data.groups) ? data.groups.map(group => ({
          id: group.id,
          title: group.name,
          group: group.name,
          time: group.created_date ? new Date(group.created_date).toLocaleTimeString() : '',
          room: '',
          students: group.student_count,
          status: 'upcoming',
          color: 'bg-blue-500',
        })) : [];
        setTodayLessons(lessons);
      } catch (err) {
        setError('Failed to load today\'s lessons');
      } finally {
        setLoading(false);
      }
    }
    if (token) fetchDashboard();
  }, [token]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return `${isDarkMode ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-800'}`;
      case 'in-progress': return `${isDarkMode ? 'bg-yellow-900 text-yellow-300' : 'bg-yellow-100 text-yellow-800'}`;
      case 'upcoming': return `${isDarkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-800'}`;
      default: return `${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800'}`;
    }
  };

  if (loading) return <div className={isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}>Loading today's lessons...</div>;
  if (error) return <div className={isDarkMode ? 'bg-gray-800 border-gray-700 text-red-400' : 'bg-white border-gray-200 text-red-600'}>{error}</div>;

  return (
    <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-lg border p-6 mb-8`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Today's Schedule</h3>
        <Link 
          to="/teacher/groups"
          className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
        >
          View All Groups
        </Link>
      </div>

      <div className="space-y-4">
        {todayLessons.map((lesson) => (
          <div key={lesson.id} className={`border ${isDarkMode ? 'border-gray-700 hover:bg-gray-750' : 'border-gray-200 hover:bg-gray-50'} rounded-lg p-4 transition-colors`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`w-4 h-4 rounded-full ${lesson.color || 'bg-blue-500'}`}></div>

                <div>
                  <div className="flex items-center space-x-3 mb-1">
                    <h4 className={`text-lg font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{lesson.title}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(lesson.status)}`}>
                      {lesson.status ? lesson.status.replace('-', ' ').charAt(0).toUpperCase() + lesson.status.replace('-', ' ').slice(1) : ''}
                    </span>
                  </div>

                  <div className={`flex items-center space-x-6 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    <span className="flex items-center">
                      <i className="ri-group-line w-4 h-4 flex items-center justify-center mr-2"></i>
                      {lesson.group}
                    </span>
                    <span className="flex items-center">
                      <i className="ri-time-line w-4 h-4 flex items-center justify-center mr-2"></i>
                      {lesson.time}
                    </span>
                    <span className="flex items-center">
                      <i className="ri-map-pin-line w-4 h-4 flex items-center justify-center mr-2"></i>
                      {lesson.room}
                    </span>
                    <span className="flex items-center">
                      <i className="ri-user-line w-4 h-4 flex items-center justify-center mr-2"></i>
                      {lesson.students} students
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Link
                  to={`/teacher/groups/${lesson.group_id || lesson.id}`}
                  className={`px-3 py-1 text-sm rounded-md transition-colors whitespace-nowrap ${
                    lesson.status === 'upcoming' 
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : lesson.status === 'in-progress'
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : isDarkMode
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {lesson.status === 'upcoming' ? 'Start Class' : 
                   lesson.status === 'in-progress' ? 'Join Class' : 'View Report'}
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
