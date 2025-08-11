


import { useState } from 'react';



export default function StudentsInfo({ groupId }) {
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [showStudentModal, setShowStudentModal] = useState(false);

  const students = [
    {
      id: '1',
      name: 'Emily Johnson',
      email: 'emily.johnson@university.edu',
      avatar: 'https://readdy.ai/api/search-image?query=professional%20headshot%20of%20young%20woman%20student%20with%20blonde%20hair%2C%20bright%20smile%2C%20university%20student%20portrait%2C%20clean%20white%20background%2C%20high%20quality%20photography%2C%20natural%20lighting&width=100&height=100&seq=student1&orientation=squarish',
      attendance: 95,
      grade: 'A',
      assignments: 18,
      assignmentsCompleted: 17,
      lastActive: '2 hours ago',
      status: 'active'
    },
    {
      id: '2',
      name: 'Michael Chen',
      email: 'michael.chen@university.edu',
      avatar: 'https://readdy.ai/api/search-image?query=professional%20headshot%20of%20young%20Asian%20man%20student%20with%20short%20black%20hair%2C%20confident%20expression%2C%20university%20student%20portrait%2C%20clean%20white%20background%2C%20high%20quality%20photography%2C%20natural%20lighting&width=100&height=100&seq=student2&orientation=squarish',
      attendance: 88,
      grade: 'B+',
      assignments: 18,
      assignmentsCompleted: 16,
      lastActive: '1 day ago',
      status: 'active'
    },
    {
      id: '3',
      name: 'Sarah Williams',
      email: 'sarah.williams@university.edu',
      avatar: 'https://readdy.ai/api/search-image?query=professional%20headshot%20of%20young%20woman%20student%20with%20brown%20hair%2C%20warm%20smile%2C%20university%20student%20portrait%2C%20clean%20white%20background%2C%20high%20quality%20photography%2C%20natural%20lighting&width=100&height=100&seq=student3&orientation=squarish',
      attendance: 92,
      grade: 'A-',
      assignments: 18,
      assignmentsCompleted: 17,
      lastActive: '4 hours ago',
      status: 'active'
    },
    {
      id: '4',
      name: 'David Rodriguez',
      email: 'david.rodriguez@university.edu',
      avatar: 'https://readdy.ai/api/search-image?query=professional%20headshot%20of%20young%20Hispanic%20man%20student%20with%20dark%20hair%2C%20friendly%20expression%2C%20university%20student%20portrait%2C%20clean%20white%20background%2C%20high%20quality%20photography%2C%20natural%20lighting&width=100&height=100&seq=student4&orientation=squarish',
      attendance: 76,
      grade: 'B-',
      assignments: 18,
      assignmentsCompleted: 14,
      lastActive: '3 days ago',
      status: 'needs attention'
    },
    {
      id: '5',
      name: 'Jessica Brown',
      email: 'jessica.brown@university.edu',
      avatar: 'https://readdy.ai/api/search-image?query=professional%20headshot%20of%20young%20African%20American%20woman%20student%20with%20curly%20hair%2C%20bright%20smile%2C%20university%20student%20portrait%2C%20clean%20white%20background%2C%20high%20quality%20photography%2C%20natural%20lighting&width=100&height=100&seq=student5&orientation=squarish',
      attendance: 98,
      grade: 'A+',
      assignments: 18,
      assignmentsCompleted: 18,
      lastActive: '1 hour ago',
      status: 'excellent'
    },
    {
      id: '6',
      name: 'Alex Thompson',
      email: 'alex.thompson@university.edu',
      avatar: 'https://readdy.ai/api/search-image?query=professional%20headshot%20of%20young%20person%20student%20with%20short%20brown%20hair%2C%20gentle%20expression%2C%20university%20student%20portrait%2C%20clean%20white%20background%2C%20high%20quality%20photography%2C%20natural%20lighting&width=100&height=100&seq=student6&orientation=squarish',
      attendance: 84,
      grade: 'B',
      assignments: 18,
      assignmentsCompleted: 15,
      lastActive: '1 day ago',
      status: 'active'
    }
  ];

  const getGradeColor = (grade) => {
    if (grade.startsWith('A')) return 'bg-green-100 text-green-800';
    if (grade.startsWith('B')) return 'bg-blue-100 text-blue-800';
    if (grade.startsWith('C')) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'excellent': return 'bg-green-100 text-green-800';
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'needs attention': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStudentClick = (student) => {
    setSelectedStudent(student);
    setShowStudentModal(true);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Students Information</h3>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">{students.length} students</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {students.map((student) => (
            <div 
              key={student.id}
              onClick={() => handleStudentClick(student)}
              className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <img
                    src={student.avatar}
                    alt={student.name}
                    className="w-12 h-12 rounded-full object-cover object-top"
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-base font-medium text-gray-900 truncate">{student.name}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getGradeColor(student.grade)}`}>
                      {student.grade}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                    <span>Attendance: {student.attendance}%</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(student.status)}`}>
                      {student.status.replace('_', ' ')}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{student.assignmentsCompleted}/{student.assignments} assignments</span>
                    <span>Active: {student.lastActive}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showStudentModal && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-mx-4">
            <div className="flex items-center space-x-4 mb-6">
              <img
                src={selectedStudent.avatar}
                alt={selectedStudent.name}
                className="w-16 h-16 rounded-full object-cover object-top"
              />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{selectedStudent.name}</h3>
                <p className="text-gray-600">{selectedStudent.email}</p>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Current Grade</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getGradeColor(selectedStudent.grade)}`}>
                  {selectedStudent.grade}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Attendance Rate</span>
                <span className="text-sm font-medium text-gray-900">{selectedStudent.attendance}%</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Assignments Completed</span>
                <span className="text-sm font-medium text-gray-900">{selectedStudent.assignmentsCompleted}/{selectedStudent.assignments}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Status</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedStudent.status)}`}>
                  {selectedStudent.status.replace('_', ' ')}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Last Active</span>
                <span className="text-sm font-medium text-gray-900">{selectedStudent.lastActive}</span>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3">
              <button 
                onClick={() => setShowStudentModal(false)}
                className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors whitespace-nowrap"
              >
                Close
              </button>
              <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors whitespace-nowrap">
                Send Message
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
