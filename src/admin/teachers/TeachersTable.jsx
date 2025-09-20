'use client';

import { useState } from 'react';
import { Link } from 'react-router-dom';


export default function TeachersTable() {
  const [teachers] = useState([
    {
      id: 1,
      name: 'Dr. Robert Smith',
      email: 'robert.smith@codeschool.com',
      phone: '+1 (555) 111-2222',
      specialization: 'JavaScript & React',
      experience: '8 years',
      status: 'Active',
      classes: 3,
      students: 45,
      hireDate: '2020-03-15'
    },
    {
      id: 2,
      name: 'Sarah Williams',
      email: 'sarah.williams@codeschool.com',
      phone: '+1 (555) 333-4444',
      specialization: 'Python & Django',
      experience: '6 years',
      status: 'Active',
      classes: 2,
      students: 32,
      hireDate: '2021-08-10'
    },
    {
      id: 3,
      name: 'Michael Johnson',
      email: 'michael.johnson@codeschool.com',
      phone: '+1 (555) 555-6666',
      specialization: 'Web Development',
      experience: '10 years',
      status: 'Active',
      classes: 4,
      students: 58,
      hireDate: '2019-01-20'
    },
    {
      id: 4,
      name: 'Emma Davis',
      email: 'emma.davis@codeschool.com',
      phone: '+1 (555) 777-8888',
      specialization: 'Data Science',
      experience: '5 years',
      status: 'On Leave',
      classes: 1,
      students: 18,
      hireDate: '2022-06-05'
    },
    {
      id: 5,
      name: 'Alex Chen',
      email: 'alex.chen@codeschool.com',
      phone: '+1 (555) 999-0000',
      specialization: 'Mobile Development',
      experience: '7 years',
      status: 'Active',
      classes: 2,
      students: 29,
      hireDate: '2020-11-12'
    }
  ]);

  const getStatusBadge = (status) => {
    if (status === 'Active') return 'bg-green-100 text-green-800';
    if (status === 'On Leave') return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Teacher
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Specialization
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Experience
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Classes
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Students
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {teachers.map((teacher) => (
            <tr key={teacher.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 font-semibold text-sm">
                      {teacher.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">{teacher.name}</div>
                    <div className="text-sm text-gray-500">{teacher.email}</div>
                    <div className="text-xs text-gray-400">{teacher.phone}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{teacher.specialization}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{teacher.experience}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{teacher.classes}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{teacher.students}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(teacher.status)}`}>
                  {teacher.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex space-x-2">
                  <Link
                    to={`/admin/teachers/${teacher.id}`}
                    className="text-green-600 hover:text-green-900"
                  >
                    <i className="ri-eye-line w-4 h-4 flex items-center justify-center"></i>
                  </Link>
                  <Link
                    href={`/admin/teachers/${teacher.id}/edit`}
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
    </div>
  );
}