// src/admin/students/StudentsFilters.jsx
'use client';

import React from 'react';

export default function StudentsFilters({
  searchTerm,
  setSearchTerm,
  filterClass,
  setFilterClass,
  filterStatus,
  setFilterStatus,
  filterAttendanceStatus,
  setFilterAttendanceStatus
}) {
  // keep the same static classes/statuses so UI does not change
  const classes = [
    'JavaScript Fundamentals',
    'React Advanced',
    'Python Basics',
    'Web Development',
    'Data Structures',
    'Node.js Backend'
  ];

  const statuses = ['Active', 'Inactive', 'Graduated', 'Suspended'];
  const attendanceStatuses = ['Present', 'Absent', 'Late', 'Excused'];  

  return (
    <div className="p-6 border-b border-gray-200">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-1">
          <div className="relative">
            <i className="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 flex items-center justify-center"></i>
            <input
              type="text"
              placeholder="Search students by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
            />
          </div>
        </div>

        <div>
          <select
            value={filterClass}
            onChange={(e) => setFilterClass(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm pr-8"
          >
            <option value="">All Classes</option>
            {classes.map((cls) => (
              <option key={cls} value={cls}>{cls}</option>
            ))}
          </select>
        </div>

        <div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm pr-8"
          >
            <option value="">All Statuses</option>
            {statuses.map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
        <div>
          <select
            value={filterAttendanceStatus}
            onChange={(e) => setFilterAttendanceStatus(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm pr-8"
          >
            <option value="">All Attendance Statuses</option>
            {attendanceStatuses.map((status) => (
              <option key={status} value={status}>{status}</option>
            ))} 

          </select>
        </div>
      </div>
    </div>
  );
}
