import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import StudentHeader from '../../../../components/StudentHeader';
import HomeworkPlayground from './HomeworkPlayground';
import { useUser } from '../../../UserContext';
import { getLesson } from '../../../lessonApi';

export default function StudentGroupDetails() {
  const { id } = useParams(); // <-- Get group ID from URL
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

  const { token } = useUser();
  const [group, setGroup] = useState(null);
  const [todayLesson, setTodayLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchGroupDetails() {
      if (!token || !id) return;
      setLoading(true);
      setError(null);
      try {
        const data = await getLesson(id, token);
        setGroup({
          name: data.name || data.title || 'Group',
          subject: data.subject || 'N/A',
          teacher: data.teacher_name || 'Unknown Teacher',
          students: data.student_count || 0,
          description: data.description || ''
        });
        // Assume today's lesson info is in data.today_lesson
        setTodayLesson(data.today_lesson || null);
      } catch (err) {
        setError('Failed to load group details');
      } finally {
        setLoading(false);
      }
    }
    fetchGroupDetails();
  }, [token, id]);

  if (loading) {
    return <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} p-8 pt-24 text-center`}>Loading group details...</div>;
  }
  if (error) {
    return <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} p-8 pt-24 text-center text-red-600`}>{error}</div>;
  }
  if (!group) {
    return null;
  }
  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <StudentHeader />
      <div className="p-8 pt-24">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <Link 
              to="/student/dashboard" 
              className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4 transition-colors"
            >
              <i className="ri-arrow-left-line w-4 h-4 flex items-center justify-center mr-2"></i>
              Back to Dashboard
            </Link>
            <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-lg border p-6 mb-8`}>
              <div className="flex items-center justify-between">
                <div>
                  <h1 className={`text-3xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {group.name}
                  </h1>
                  <div className={`flex items-center space-x-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    <span className="flex items-center">
                      <i className="ri-book-line w-4 h-4 flex items-center justify-center mr-2"></i>
                      {group.subject}
                    </span>
                    <span className="flex items-center">
                      <i className="ri-user-line w-4 h-4 flex items-center justify-center mr-2"></i>
                      {group.teacher}
                    </span>
                    <span className="flex items-center">
                      <i className="ri-group-line w-4 h-4 flex items-center justify-center mr-2"></i>
                      {group.students} students
                    </span>
                  </div>
                  <p className={`mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {group.description}
                  </p>
                </div>
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <i className="ri-graduation-cap-line w-8 h-8 flex items-center justify-center text-blue-600"></i>
                </div>
              </div>
            </div>
          </div>
          {/* Today's Lesson */}
          {todayLesson && (
            <div className="mb-8">
              <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-lg border p-6`}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Today's Lesson
                  </h2>
                  <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {new Date().toLocaleDateString()}
                  </span>
                </div>
                <h3 className={`text-lg font-medium mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {todayLesson.title}
                </h3>
                <ul className={`space-y-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {todayLesson.points && todayLesson.points.map((point, index) => (
                    <li key={index} className="flex items-start">
                      <i className="ri-arrow-right-s-line w-5 h-5 flex items-center justify-center text-blue-600 mr-2 mt-0.5"></i>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          {/* Homework Playground */}
          <HomeworkPlayground groupId={id} />
        </div>
      </div>
    </div>
  );
}
