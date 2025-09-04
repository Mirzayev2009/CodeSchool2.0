
'use client';

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../../UserContext';
import { getLessons } from '../../lessonApi';


export default function MyGroups() {
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

  const { token } = useUser();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchGroups() {
      if (!token) return;
      setLoading(true);
      setError(null);
      try {
        const lessons = await getLessons(token);
        // Map lessons to group cards (customize as needed)
        const mappedGroups = Array.isArray(lessons) ? lessons.map((lesson, idx) => ({
          id: lesson.id,
          name: lesson.name || lesson.title || `Group ${idx + 1}`,
          teacher: lesson.teacher_name || 'Unknown Teacher',
          students: lesson.student_count || 0,
          nextLesson: lesson.next_lesson || 'N/A',
          progress: lesson.progress || 0,
          color: ['bg-blue-500','bg-cyan-500','bg-green-500','bg-purple-500'][idx % 4],
          assignments: lesson.assignments_count || 0,
          completedAssignments: lesson.completed_assignments || 0,
          image: lesson.image_url || 'https://readdy.ai/api/search-image?query=education%20group%20course&width=400&height=200'
        }) ) : [];
        setGroups(mappedGroups);
      } catch (err) {
        setError('Failed to load groups');
      } finally {
        setLoading(false);
      }
    }
    fetchGroups();
  }, [token]);

  if (loading) {
    return <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-lg border p-6 text-center`}>Loading groups...</div>;
  }
  if (error) {
    return <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-lg border p-6 text-center text-red-600`}>{error}</div>;
  }
  return (
    <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-lg border`}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>My Groups</h3>
          <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{groups.length} enrolled</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {groups.map((group) => (
            <Link key={group.id} to={`/student/groups/${group.id}`}> 
              <div className={`border rounded-xl overflow-hidden transition-shadow cursor-pointer ${isDarkMode ? 'border-gray-700 hover:shadow-lg hover:shadow-gray-900/50' : 'border-gray-200 hover:shadow-lg'}`}> 
                <div className="relative h-32"> 
                  <img
                    src={group.image}
                    alt={group.name}
                    className="w-full h-full object-cover object-top"
                  />
                  <div className={`absolute top-3 left-3 w-3 h-3 rounded-full ${group.color}`}></div>
                </div>
                
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className={`text-lg font-semibold truncate ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{group.name}</h4>
                    <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{group.progress}%</span>
                  </div>
                  
                  <p className={`text-sm mb-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{group.teacher}</p>
                  
                  <div className="mb-3">
                    <div className={`w-full rounded-full h-2 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}> 
                      <div 
                        className={`h-2 rounded-full ${group.color}`}
                        style={{ width: `${group.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className={`grid grid-cols-2 gap-4 text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}> 
                    <div className="flex items-center"> 
                      <i className="ri-group-line w-4 h-4 flex items-center justify-center mr-2"></i>
                      <span>{group.students} students</span>
                    </div>
                    
                    <div className="flex items-center"> 
                      <i className="ri-time-line w-4 h-4 flex items-center justify-center mr-2"></i>
                      <span>{group.nextLesson}</span>
                    </div>
                    
                    <div className="flex items-center"> 
                      <i className="ri-task-line w-4 h-4 flex items-center justify-center mr-2"></i>
                      <span>{group.completedAssignments}/{group.assignments} tasks</span>
                    </div>
                    
                    <div className="flex items-center"> 
                      <i className="ri-trophy-line w-4 h-4 flex items-center justify-center mr-2"></i>
                      <span>Level {Math.floor(group.progress / 25) + 1}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
