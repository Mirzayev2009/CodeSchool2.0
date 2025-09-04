'use client';

import { useState } from 'react';
import Link from 'next/link';
import AdminHeader from '../../../components/AdminHeader';
import AdminSidebar from '../../../components/AdminSidebar';
import StudentsTable from './StudentsTable';
import StudentsFilters from './StudentsFilters';

export default function StudentsManagement() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClass, setFilterClass] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      
      <div className="flex">
        <AdminSidebar isOpen={isSidebarOpen} />
        
        <main className="flex-1 ml-0 lg:ml-64 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Students Management</h1>
                <p className="text-gray-600 mt-1">Manage all student records and enrollments</p>
              </div>
              <Link
                href="/admin/students/add"
                className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium whitespace-nowrap flex items-center"
              >
                <i className="ri-user-add-line w-5 h-5 flex items-center justify-center mr-2"></i>
                Add New Student
              </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <StudentsFilters 
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                filterClass={filterClass}
                setFilterClass={setFilterClass}
                filterStatus={filterStatus}
                setFilterStatus={setFilterStatus}
              />
              <StudentsTable 
                searchTerm={searchTerm}
                filterClass={filterClass}
                filterStatus={filterStatus}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}