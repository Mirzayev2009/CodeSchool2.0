'use client';

import React from 'react';

export default function OverviewStats({ stats }) {
  // stats is passed from AdminDashboard; if missing fall back to sample
  const SAMPLE = [
    {
      name: 'Total Students',
      value: '2,847',
      change: '+12%',
      changeType: 'increase',
      icon: 'ri-graduation-cap-line',
      color: 'blue'
    },
    {
      name: 'Active Teachers',
      value: '89',
      change: '+3%',
      changeType: 'increase',
      icon: 'ri-user-star-line',
      color: 'green'
    },
    {
      name: 'Running Classes',
      value: '156',
      change: '+8%',
      changeType: 'increase',
      icon: 'ri-group-line',
      color: 'purple'
    },
    {
      name: 'This Month Revenue',
      value: '$48,692',
      change: '+23%',
      changeType: 'increase',
      icon: 'ri-money-dollar-circle-line',
      color: 'orange'
    }
  ];

  const finalStats = Array.isArray(stats) && stats.length ? stats : SAMPLE;

  const colorClasses = {
    blue: {
      bg: 'bg-blue-50',
      icon: 'text-blue-600',
      text: 'text-blue-900'
    },
    green: {
      bg: 'bg-green-50',
      icon: 'text-green-600',
      text: 'text-green-900'
    },
    purple: {
      bg: 'bg-purple-50',
      icon: 'text-purple-600',
      text: 'text-purple-900'
    },
    orange: {
      bg: 'bg-orange-50',
      icon: 'text-orange-600',
      text: 'text-orange-900'
    },
    emerald: {
      bg: 'bg-emerald-50',
      icon: 'text-emerald-600',
      text: 'text-emerald-900'
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {finalStats.map((stat) => {
        const colors = colorClasses[stat.color] ?? colorClasses.blue;
        return (
          <div key={stat.name} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                <div className="flex items-center mt-2">
                  {/* <span className="text-green-600 text-sm font-medium">
                    {stat.change ?? ''}
                  </span>
                  <span className="text-gray-500 text-sm ml-1">vs last month</span> */}
                </div>
              </div>
              <div className={`${colors.bg} p-3 rounded-lg`}>
                <i className={`${stat.icon} ${colors.icon} w-6 h-6 flex items-center justify-center`}></i>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
