'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function StudentsTable({ searchTerm, filterClass, filterStatus }) {
  const [students] = useState([
    {
      id: 1,
      name: 'Sarah Johnson',
      email: 'sarah.johnson@email.com',
      phone: '+1 (555) 123-4567',
      class: 'JavaScript Fundamentals',
      enrollmentDate: '2024-09-15',
      status: 'Active',
      attendance: '95%',
      grades: 'A-'
    },
    {
      id: 2,
      name: 'Michael Chen',
      email: 'michael.chen@email.com',
      phone: '+1 (555) 234-5678',
      class: 'React Advanced',
      enrollmentDate: '2024-08-20',
      status: 'Active',
      attendance: '88%',
      grades: 'B+'
    },
    {
      id: 3,
      name: 'Emily Davis',
      email: 'emily.davis@email.com',
      phone: '+1 (555) 345-6789',
      class: 'Python Basics',
      enrollmentDate: '2024-10-01',
      status: 'Active',
      attendance: '92%',
      grades: 'A'
    },
    {
      id: 4,
      name: 'David Wilson',
      email: 'david.wilson@email.com',
      phone: '+1 (555) 456-7890',
      class: 'Web Development',
      enrollmentDate: '2024-07-10',
      status: 'Inactive',
      attendance: '76%',
      grades: 'C+'
    },
    {
      id: 5,
      name: 'Lisa Rodriguez',
      email: 'lisa.rodriguez@email.com',
      phone: '+1 (555) 567-8901',
      class: 'Data Structures',
      enrollmentDate: '2024-09-28',
      status: 'Active',
      attendance: '98%',
      grades: 'A+'
    },
    {
      id: 6,
      name: 'James Anderson',
      email: 'james.anderson@email.com',
      phone: '+1 (555) 678-9012',
      class: 'JavaScript Fundamentals',
      enrollmentDate: '2024-10-15',
      status: 'Active',
      attendance: '85%',
      grades: 'B'
    }
  ]);

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = filterClass === '' || student.class === filterClass;
    const matchesStatus = filterStatus === '' || student.status === filterStatus;
    
    return matchesSearch && matchesClass && matchesStatus;
  });

  const getStatusBadge = (status) => {
    return status === 'Active'
      ? 'bg-green-100 text-green-800'
      : 'bg-red-100 text-red-800';
  };

  const getGradeBadge = (grade) => {
    if (grade.startsWith('A')) return 'bg-green-100 text-green-800';
    if (grade.startsWith('B')) return 'bg-blue-100 text-blue-800';
    if (grade.startsWith('C')) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="overflow-x-auto">
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
                      {student.name.split(' ').map(n => n[0]).join('')}
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
                    href={`/admin/students/${student.id}`}
                    className="text-purple-600 hover:text-purple-900"
                  >
                    <i className="ri-eye-line w-4 h-4 flex items-center justify-center"></i>
                  </Link>
                  <Link
                    href={`/admin/students/${student.id}/edit`}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    <i className="ri-edit-line w-4 h-4 flex items-center justify-center"></i>
                  </Link>
                  <button className="text-red-600 hover:text-red-900">
                    <i className="ri-delete-bin-line w-4 h-4 flex items-center justify-center"></i>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {filteredStudents.length === 0 && (
        <div className="text-center py-12">
          <i className="ri-user-search-line w-12 h-12 flex items-center justify-center text-gray-400 mx-auto mb-4"></i>
          <p className="text-gray-500">No students found matching your criteria</p>
        </div>
      )}
    </div>
  );
}