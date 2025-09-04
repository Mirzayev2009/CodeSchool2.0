import React, { useEffect, useState } from 'react';
import { useUser } from '../../UserContext';
import { getLesson } from '../../lessonApi';

  const { token } = useUser();
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchGroup() {
      if (!token || !groupId) return;
      setLoading(true);
      setError(null);
      try {
        const data = await getLesson(groupId, token);
        setGroup({
          name: data.name || data.title || 'Group',
          teacher: data.teacher_name || 'Unknown Teacher',
          description: data.description || '',
          image: data.image_url || 'https://readdy.ai/api/search-image?query=education%20group%20course&width=400&height=200',
          level: data.level || 'N/A',
          duration: data.duration || 'N/A',
          students: data.student_count || 0,
          progress: data.progress || 0,
          color: 'bg-blue-500', // Optionally map color from backend
          nextLesson: data.next_lesson || 'N/A',
          schedule: data.schedule || 'N/A',
          room: data.room || 'N/A'
        });
      } catch (err) {
        setError('Failed to load group info');
      } finally {
        setLoading(false);
      }
    }
    fetchGroup();
  }, [token, groupId]);

  const getLevelColor = (level) => {
    switch (level) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-blue-100 text-blue-800';
      case 'Advanced': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 text-center">Loading group info...</div>;
  }
  if (error) {
    return <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 text-center text-red-600">{error}</div>;
  }
  if (!group) {
    return null;
  }
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200">
      <div className="relative h-48">
        <img
          src={group.image}
          alt={group.name}
          className="w-full h-full object-cover object-top rounded-t-xl"
        />
        <div className={`absolute top-4 left-4 w-4 h-4 rounded-full ${group.color}`}></div>
        <div className="absolute top-4 right-4">
          <span className={`px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800`}>
            {group.level}
          </span>
        </div>
      </div>

      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{group.name}</h2>
        <p className="text-gray-600 mb-4">{group.teacher}</p>
        <p className="text-sm text-gray-700 mb-6">{group.description}</p>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm text-gray-500">{group.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${group.color}`}
              style={{ width: `${group.progress}%` }}
            ></div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center">
            <i className="ri-time-line w-5 h-5 flex items-center justify-center mr-3 text-gray-500"></i>
            <div>
              <span className="text-sm text-gray-500">Duration</span>
              <p className="font-medium text-gray-900">{group.duration}</p>
            </div>
          </div>

          <div className="flex items-center">
            <i className="ri-group-line w-5 h-5 flex items-center justify-center mr-3 text-gray-500"></i>
            <div>
              <span className="text-sm text-gray-500">Students</span>
              <p className="font-medium text-gray-900">{group.students} enrolled</p>
            </div>
          </div>

          <div className="flex items-center">
            <i className="ri-calendar-line w-5 h-5 flex items-center justify-center mr-3 text-gray-500"></i>
            <div>
              <span className="text-sm text-gray-500">Schedule</span>
              <p className="font-medium text-gray-900">{group.schedule}</p>
            </div>
          </div>

          <div className="flex items-center">
            <i className="ri-map-pin-line w-5 h-5 flex items-center justify-center mr-3 text-gray-500"></i>
            <div>
              <span className="text-sm text-gray-500">Location</span>
              <p className="font-medium text-gray-900">{group.room}</p>
            </div>
          </div>

          <div className="flex items-center">
            <i className="ri-calendar-check-line w-5 h-5 flex items-center justify-center mr-3 text-gray-500"></i>
            <div>
              <span className="text-sm text-gray-500">Next Lesson</span>
              <p className="font-medium text-gray-900">{group.nextLesson}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
