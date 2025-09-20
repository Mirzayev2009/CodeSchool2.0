'use client';

import React from 'react';

export default function RecentActivity({ activities }) {
  // fallback sample if activities not provided
  const SAMPLE = [
    {
      id: 1,
      type: 'student_enrolled',
      message: 'Sarah Johnson enrolled in JavaScript Fundamentals class',
      time: '2 minutes ago',
      icon: 'ri-user-add-line',
      color: 'blue'
    },
    {
      id: 2,
      type: 'teacher_added',
      message: 'Michael Chen was added as React.js instructor',
      time: '15 minutes ago',
      icon: 'ri-user-star-line',
      color: 'green'
    },
    {
      id: 3,
      type: 'assignment_created',
      message: 'New assignment "DOM Manipulation" created for Web Development class',
      time: '1 hour ago',
      icon: 'ri-file-add-line',
      color: 'purple'
    }
  ];

  const finalActs = Array.isArray(activities) && activities.length ? activities : SAMPLE;

  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    yellow: 'bg-yellow-50 text-yellow-600'
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
        <button className="text-purple-600 hover:text-purple-700 text-sm font-medium">
          View All
        </button>
      </div>

      <div className="space-y-4">
        {finalActs.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <div className={`p-2 rounded-full ${colorClasses[activity.color] ?? 'bg-gray-50 text-gray-600'}`}>
              <i className={`${activity.icon} w-4 h-4 flex items-center justify-center`}></i>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900">{activity.message}</p>
              <p className="text-xs text-gray-500 mt-1">{activity.time || ''}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
