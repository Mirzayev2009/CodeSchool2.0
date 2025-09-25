// src/admin/students/StudentsTable.jsx
'use client';

import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';

export default function StudentsTable({
  searchTerm,
  filterClass,
  filterStatus,
  filterAttendanceStatus,
  students = [],
  loading = false,
  onDelete = () => {},
  onToggleStatus = () => {},
  refresh = () => {},
}) {
  const filteredStudents = useMemo(() => {
    const q = (searchTerm ?? '').toLowerCase();
    return (students ?? []).filter((student) => {
      const matchesSearch =
        (student.name ?? '').toLowerCase().includes(q) ||
        (student.email ?? '').toLowerCase().includes(q);

      const matchesClass = (filterClass ?? '') === '' || (student.class ?? '') === filterClass;
      const matchesStatus = (filterStatus ?? '') === '' || (student.status ?? '') === filterStatus;
      const matchesAttendance = (filterAttendanceStatus ?? '') === '' || (student.attendance ?? '') === filterAttendanceStatus;

     

      return matchesSearch && matchesClass && matchesStatus  && matchesAttendance;
    });
  }, [students, searchTerm, filterClass, filterStatus, filterAttendanceStatus]);

  const getStatusBadge = (status) => {
    return status === 'Active'
      ? 'bg-green-100 text-green-800'
      : 'bg-red-100 text-red-800';
  };

  const getGradeBadge = (grade) => {
    if (!grade) return 'bg-gray-100 text-gray-800';
    if (String(grade).startsWith('A')) return 'bg-green-100 text-green-800';
    if (String(grade).startsWith('B')) return 'bg-blue-100 text-blue-800';
    if (String(grade).startsWith('C')) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="overflow-x-auto">
      <div className="p-4 flex items-center justify-between gap-3">
        <div className="text-sm text-gray-500">{loading ? 'Loading...' : `${filteredStudents.length} student(s)`}</div>
        <div className="flex items-center gap-2">
          <button onClick={refresh} className="px-3 py-2 bg-gray-100 rounded-md text-sm">Refresh</button>
        </div>
      </div>

      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Student
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Class
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Enrollment Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Attendance
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Grade
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredStudents.map((student) => (
            <tr key={student.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-purple-600 font-semibold text-sm">
                      {String(student.name || '').split(' ').map(n => n?.[0] ?? '').join('')}
                    </span>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">{student.name}</div>
                    <div className="text-sm text-gray-500">{student.email}</div>
                    <div className="text-xs text-gray-400">{student.phone}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{student.class}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{student.enrollmentDate}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(student.status)}`}>
                  {student.status}
                </span>
                <div className="mt-2">
                  <button
                    onClick={() => onToggleStatus(student)}
                    className="mt-1 text-xs px-2 py-1 border rounded-md"
                  >
                    Toggle status
                  </button>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{student.attendance}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getGradeBadge(student.grades)}`}>
                  {student.grades}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex space-x-2">
                  <Link
                    to={`/admin/students/${student.id}`}
                    className="text-purple-600 hover:text-purple-900"
                  >
                    <i className="ri-eye-line w-4 h-4 flex items-center justify-center"></i>
                  </Link>
                  <Link
                    to={`/admin/students/${student.id}/edit`}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    <i className="ri-edit-line w-4 h-4 flex items-center justify-center"></i>
                  </Link>
                  <button
                    onClick={() => onDelete(student.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <i className="ri-delete-bin-line w-4 h-4 flex items-center justify-center"></i>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {filteredStudents.length === 0 && !loading && (
        <div className="text-center py-12">
          <i className="ri-user-search-line w-12 h-12 flex items-center justify-center text-gray-400 mx-auto mb-4"></i>
          <p className="text-gray-500">No students found matching your criteria</p>
        </div>
      )}
    </div>
  );
}
