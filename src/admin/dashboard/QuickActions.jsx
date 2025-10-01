'use client';

import { Link } from 'react-router-dom';


export default function QuickActions() {
  const actions = [
    {
      name: 'Yangi o\'quvchi qo\'shish',
      to: '/admin/students/add',
      icon: 'ri-user-add-line',
      color: 'blue'
    },
    {
      name: 'Yangi o\'qituvchi qo\'shish',
      to: '/admin/teachers/add',
      icon: 'ri-user-star-line',
      color: 'green'
    },
    {
      name: 'yangi sinf yaratish',
      to: '/admin/classes/create',
      icon: 'ri-group-line',
      color: 'purple'
    },
    {
      name: 'Yangi fan qo\'shish',
      to: '/admin/courses/create',
      icon: 'ri-calendar-event-line',
      color: 'orange'
    },
  ];

  const colorClasses = {
    blue: 'bg-blue-50 text-blue-700 hover:bg-blue-100',
    green: 'bg-green-50 text-green-700 hover:bg-green-100',
    purple: 'bg-purple-50 text-purple-700 hover:bg-purple-100',
    orange: 'bg-orange-50 text-orange-700 hover:bg-orange-100',
    red: 'bg-red-50 text-red-700 hover:bg-red-100',
    indigo: 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
      
      <div className="space-y-3">
        {actions.map((action) => (
          <Link
            key={action.name}
            to={action.to}
            className={`flex items-center w-full p-3 rounded-lg transition-colors ${colorClasses[action.color]}`}
          >
            <i className={`${action.icon} w-5 h-5 flex items-center justify-center mr-3`}></i>
            <span className="font-medium whitespace-nowrap">{action.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}