
import { useState, useEffect } from 'react';
import { useUser } from '../../UserContext';
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

  const { token } = useUser();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchGroups() {
      setLoading(true);
      setError(null);
      try {
  const res = await fetch('https://sanjar1718.pythonanywhere.com/api/groups/', {
          headers: { 'Authorization': `Token ${token}` }
        });
        if (!res.ok) throw new Error('Failed to fetch groups');
        const data = await res.json();
        setGroups(data || []);
      } catch (err) {
        setError('Failed to load groups');
      } finally {
        setLoading(false);
      }
    }
    if (token) fetchGroups();
  }, [token]);

  if (loading) {
    return <div className={isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}>Loading groups...</div>;
  }
  if (error) {
    return <div className={isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}>{error}</div>;
  }
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
                      {group.students_count || group.students?.length || 0} students
                    </span>
                  </div>
                  <div className="flex items-center space-x-6 text-sm">
                    <span className={`flex items-center ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      <i className="ri-book-line w-4 h-4 flex items-center justify-center mr-2"></i>
                      {group.subject || group.subject_name || 'N/A'}
                    </span>
                    <span className={`flex items-center ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      <i className="ri-time-line w-4 h-4 flex items-center justify-center mr-2"></i>
                      {group.next_class_time || 'N/A'}
                    </span>
                    <span className={`flex items-center ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      <i className="ri-map-pin-line w-4 h-4 flex items-center justify-center mr-2"></i>
                      {group.room || 'N/A'}
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
