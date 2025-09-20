import React, { useEffect, useState } from 'react';
import { useUser } from '../../UserContext';
import { getTeacherDashboard } from '../dashboardApi';

export default function QuickStats() {
  const { token } = useUser();
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchStats() {
      setLoading(true);
      setError(null);
      try {
        const data = await getTeacherDashboard(token);
        setStats([
          {
            title: 'Total Groups',
            value: data.total_groups,
            icon: 'ri-group-line',
            color: 'bg-blue-500',
            bgColor: 'bg-blue-50'
          },
          {
            title: 'Total Students',
            value: data.total_students,
            icon: 'ri-user-line',
            color: 'bg-green-500',
            bgColor: 'bg-green-50'
          }
        ]);
      } catch (err) {
        setError('Failed to load stats');
      } finally {
        setLoading(false);
      }
    }
    if (token) fetchStats();
  }, [token]);

  if (loading) return <div>Loading stats...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-7">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{stat.title}</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
              <p className="text-xs text-gray-500 mt-2">{stat.change}</p>
            </div>
            <div className={`w-12 h-12 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
              <i className={`${stat.icon} w-6 h-6 flex items-center justify-center ${stat.color.replace('bg-', 'text-')}`}></i>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
