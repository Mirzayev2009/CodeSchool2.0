
'use client';

import { Link, useNavigate } from "react-router-dom";

export default function TeacherHeader() {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to="/teacher/groups" className="flex items-center">
              <span className="text-2xl font-bold text-blue-600 font-['Pacifico']">TeacherHub</span>
            </Link>
            
            <nav className="flex items-center space-x-6">
              <Link to="/teacher/groups" className="text-gray-700 hover:text-blue-600 font-medium whitespace-nowrap">
                My Groups
              </Link>
              <Link to="/teacher/schedule" className="text-gray-500 hover:text-blue-600 font-medium whitespace-nowrap">
                Schedule
              </Link>
              <Link to="/teacher/students" className="text-gray-500 hover:text-blue-600 font-medium whitespace-nowrap">
                All Students
              </Link>
              <Link to="/teacher/reports" className="text-gray-500 hover:text-blue-600 font-medium whitespace-nowrap">
                Reports
              </Link>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-500 hover:text-gray-700">
              <i className="ri-notification-line w-5 h-5 flex items-center justify-center"></i>
            </button>
            
            <div className="flex items-center space-x-3">
              <img
                src="https://readdy.ai/api/search-image?query=professional%20headshot%20of%20middle-aged%20teacher%20with%20warm%20smile%2C%20professional%20educator%20portrait%2C%20clean%20white%20background%2C%20high%20quality%20photography%2C%20natural%20lighting%2C%20friendly%20expression&width=80&height=80&seq=teacher1&orientation=squarish"
                alt="Teacher"
                className="w-8 h-8 rounded-full object-cover object-top"
              />
              <div className="text-sm">
                <p className="font-medium text-gray-900">Dr. Sarah Mitchell</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
