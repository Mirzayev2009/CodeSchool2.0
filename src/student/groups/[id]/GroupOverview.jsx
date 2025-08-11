import React from 'react';

export default function GroupOverview({ groupId }) {
  const groupsData = {
    '1': {
      name: 'JavaScript Fundamentals',
      teacher: 'Dr. Sarah Wilson',
      description: 'Master the core concepts of JavaScript programming including variables, functions, objects, and modern ES6+ features.',
      image: 'https://readdy.ai/api/search-image?query=modern%20JavaScript%20programming%20course%20illustration%20with%20clean%20geometric%20design%2C%20coding%20symbols%2C%20laptop%20screen%20with%20code%2C%20bright%20blue%20and%20yellow%20colors%2C%20minimalist%20educational%20style&width=400&height=200&seq=js-detail&orientation=landscape',
      level: 'Beginner',
      duration: '12 weeks',
      students: 28,
      progress: 75,
      color: 'bg-blue-500',
      nextLesson: 'Tomorrow 10:00 AM',
      schedule: 'Mon, Wed, Fri - 10:00 AM',
      room: 'Room 301'
    },
    '2': {
      name: 'React Development',
      teacher: 'Prof. Michael Chen',
      description: 'Learn to build modern web applications using React, including hooks, state management, and component architecture.',
      image: 'https://readdy.ai/api/search-image?query=React%20programming%20course%20illustration%20with%20modern%20component%20design%2C%20coding%20interface%2C%20clean%20geometric%20patterns%2C%20cyan%20and%20blue%20colors%2C%20educational%20technology%20style&width=400&height=200&seq=react-detail&orientation=landscape',
      level: 'Intermediate',
      duration: '10 weeks',
      students: 24,
      progress: 60,
      color: 'bg-cyan-500',
      nextLesson: 'Wed 2:00 PM',
      schedule: 'Tue, Thu - 2:00 PM',
      room: 'Room 205'
    }
  };

  const group = groupsData[groupId] || groupsData['1'];

  const getLevelColor = (level) => {
    switch (level) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-blue-100 text-blue-800';
      case 'Advanced': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

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
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getLevelColor(group.level)}`}>
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
}
