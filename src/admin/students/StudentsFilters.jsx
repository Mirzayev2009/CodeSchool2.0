import { Link } from 'react-router-dom';
import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { useMemo } from 'react';
// --- StudentsFilters component (uses classesList from backend when available)
export default function StudentsFilters({
  classesList = ['Barcha sinflar'],
  searchTerm,
  setSearchTerm,
  filterClass,
  setFilterClass,
  filterStatus,
  setFilterStatus,
  filterAttendanceStatus,
  setFilterAttendanceStatus,
}) {
  // fallback static lists (used only if backend doesn't provide classes)
  const fallbackClasses = [
    'JavaScript Fundamentals',
    'React Advanced',
    'Python Basics',
    'Web Development',
    'Data Structures',
    'Node.js Backend',
  ];

  const statusOptions = [
    { value: '', label: "Barcha holatlar" },
    { value: 'Active', label: "Faol" },
    { value: 'Inactive', label: "Faol emas" },
    { value: 'Graduated', label: "Bitirgan" },
    { value: 'Suspended', label: "To'xtatilgan" },
  ];

  const attendanceStatuses = [
    { value: '', label: "Barcha qatnashuv holatlari" },
    { value: 'Present', label: "Kelgan" },
    { value: 'Absent', label: "Kelmagan" },
    { value: 'Late', label: "Kechikkan" },
    { value: 'Excused', label: "Ruxsatli" },
  ];

  const classesToRender = (classesList && classesList.length > 0) ? classesList : ['Barcha sinflar', ...fallbackClasses];

  return (
    <div className="p-6 border-b border-gray-200">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-1">
          <div className="relative">
            <i className="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 flex items-center justify-center"></i>
            <input
              type="text"
              placeholder="Ism yoki email bo'yicha qidirish..."
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
            {/* classesToRender expected to start with a "Barcha sinflar" option */}
            {classesToRender.map((cls) => (
              <option key={cls} value={cls === 'Barcha sinflar' ? '' : cls}>{cls}</option>
            ))}
          </select>
        </div>

        <div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm pr-8"
          >
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        <div>
          <select
            value={filterAttendanceStatus}
            onChange={(e) => setFilterAttendanceStatus(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm pr-8"
          >
            {attendanceStatuses.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
