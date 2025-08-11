
import React from 'react';


export default function GroupInfo({ groupId }) {
  const groupsData = {
    '1': {
      name: 'Advanced Mathematics A',
      subject: 'Mathematics',
      teacher: 'Dr. Johnson',
      studentsCount: 24,
      level: 'Advanced',
      room: 'Room 205',
      schedule: 'Mon, Wed, Fri - 2:00 PM',
      color: 'bg-red-500'
    },
    '2': {
      name: 'Physics Fundamentals',
      subject: 'Physics',
      teacher: 'Dr. Johnson',
      studentsCount: 18,
      level: 'Intermediate',
      room: 'Lab 3',
      schedule: 'Tue, Thu - 10:00 AM',
      color: 'bg-blue-500'
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
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className={`w-12 h-12 rounded-xl ${group.color} flex items-center justify-center mr-4`}>
              <i className="ri-book-open-line text-white text-xl w-6 h-6 flex items-center justify-center"></i>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{group.name}</h2>
              <p className="text-gray-600">{group.subject}</p>
            </div>
          </div>
          <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getLevelColor(group.level)}`}>
            {group.level}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <span className="text-sm text-gray-500">Students</span>
              <p className="text-xl font-semibold text-gray-900">{group.studentsCount}</p>
            </div>
            
            <div>
              <span className="text-sm text-gray-500">Room</span>
              <p className="text-lg font-medium text-gray-900">{group.room}</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <span className="text-sm text-gray-500">Schedule</span>
              <p className="text-lg font-medium text-gray-900">{group.schedule}</p>
            </div>
            
            <div>
              <span className="text-sm text-gray-500">Instructor</span>
              <p className="text-lg font-medium text-gray-900">{group.teacher}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
