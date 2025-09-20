'use client';

import { useState } from 'react';
import { Link } from 'react-router-dom';

// import AdminHeader from '../../../components/AdminHeader';
import AdminSidebar from '../../../components/AdminSidebar';
import TeachersTable from './TeachersTable';

export default function TeachersManagement() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* <AdminHeader isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} /> */}
      
      <div className="flex">
        <AdminSidebar isOpen={isSidebarOpen} />
        
        <main className="flex-1 ml-0 lg:ml-64 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Teachers Management</h1>
                <p className="text-gray-600 mt-1">Manage instructor profiles and assignments</p>
              </div>
              <Link
                to="/admin/teachers/add"
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium whitespace-nowrap flex items-center"
              >
                <i className="ri-user-star-line w-5 h-5 flex items-center justify-center mr-2"></i>
                Add New Teacher
              </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <TeachersTable />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}