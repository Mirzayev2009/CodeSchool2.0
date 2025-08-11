

import { useState, useEffect } from 'react';
import TeacherSidebar from '../../../components/TeacherSidebar';

export default function TeacherStudents() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('all');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(savedDarkMode);
    
    if (savedDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const students = [
    {
      id: '1',
      name: 'Emily Johnson',
      email: 'emily.johnson@university.edu',
      avatar: 'https://readdy.ai/api/search-image?query=professional%20headshot%20of%20young%20woman%20student%20with%20blonde%20hair%2C%20bright%20smile%2C%20university%20student%20portrait%2C%20clean%20white%20background%2C%20high%20quality%20photography%2C%20natural%20lighting&width=100&height=100&seq=student1&orientation=squarish',
      group: 'Advanced Mathematics',
      attendance: 95,
      homeworkRate: 94,
      currentGrade: 'A',
      enrolledDate: 'Sep 2023',
      totalAssignments: 18,
      completedAssignments: 17,
      lastActive: '2 hours ago'
    },
    {
      id: '2',
      name: 'Michael Chen',
      email: 'michael.chen@university.edu',
      avatar: 'https://readdy.ai/api/search-image?query=professional%20headshot%20of%20young%20Asian%20man%20student%20with%20short%20black%20hair%2C%20confident%20expression%2C%20university%20student%20portrait%2C%20clean%20white%20background%2C%20high%20quality%20photography%2C%20natural%20lighting&width=100&height=100&seq=student2&orientation=squarish',
      group: 'Programming Basics',
      attendance: 88,
      homeworkRate: 89,
      currentGrade: 'B+',
      enrolledDate: 'Sep 2023',
      totalAssignments: 16,
      completedAssignments: 14,
      lastActive: '1 day ago'
    },
    {
      id: '3',
      name: 'Sarah Williams',
      email: 'sarah.williams@university.edu',
      avatar: 'https://readdy.ai/api/search-image?query=professional%20headshot%20of%20young%20woman%20student%20with%20brown%20hair%2C%20warm%20smile%2C%20university%20student%20portrait%2C%20clean%20white%20background%2C%20high%20quality%20photography%2C%20natural%20lighting&width=100&height=100&seq=student3&orientation=squarish',
      group: 'Data Structures',
      attendance: 92,
      homeworkRate: 96,
      currentGrade: 'A-',
      enrolledDate: 'Sep 2023',
      totalAssignments: 20,
      completedAssignments: 19,
      lastActive: '4 hours ago'
    },
    {
      id: '4',
      name: 'David Rodriguez',
      email: 'david.rodriguez@university.edu',
      avatar: 'https://readdy.ai/api/search-image?query=professional%20headshot%20of%20young%20Hispanic%20man%20student%20with%20dark%20hair%2C%20friendly%20expression%2C%20university%20student%20portrait%2C%20clean%20white%20background%2C%20high%20quality%20photography%2C%20natural%20lighting&width=100&height=100&seq=student4&orientation=squarish',
      group: 'Linear Algebra',
      attendance: 76,
      homeworkRate: 78,
      currentGrade: 'B-',
      enrolledDate: 'Sep 2023',
      totalAssignments: 15,
      completedAssignments: 12,
      lastActive: '3 days ago'
    },
    {
      id: '5',
      name: 'Jessica Brown',
      email: 'jessica.brown@university.edu',
      avatar: 'https://readdy.ai/api/search-image?query=professional%20headshot%20of%20young%20African%20American%20woman%20student%20with%20curly%20hair%2C%20bright%20smile%2C%20university%20student%20portrait%2C%20clean%20white%20background%2C%20high%20quality%20photography%2C%20natural%20lighting&width=100&height=100&seq=student5&orientation=squarish',
      group: 'Web Development',
      attendance: 98,
      homeworkRate: 100,
      currentGrade: 'A+',
      enrolledDate: 'Sep 2023',
      totalAssignments: 22,
      completedAssignments: 22,
      lastActive: '1 hour ago'
    },
    {
      id: '6',
      name: 'Alex Thompson',
      email: 'alex.thompson@university.edu',
      avatar: 'https://readdy.ai/api/search-image?query=professional%20headshot%20of%20young%20person%20student%20with%20short%20brown%20hair%2C%20gentle%20expression%2C%20university%20student%20portrait%2C%20clean%20white%20background%2C%20high%20quality%20photography%2C%20natural%20lighting&width=100&height=100&seq=student6&orientation=squarish',
      group: 'Statistics',
      attendance: 84,
      homeworkRate: 82,
      currentGrade: 'B',
      enrolledDate: 'Oct 2023',
      totalAssignments: 14,
      completedAssignments: 11,
      lastActive: '1 day ago'
    },
    {
      id: '7',
      name: 'Lisa Park',
      email: 'lisa.park@university.edu',
      avatar: 'https://readdy.ai/api/search-image?query=professional%20headshot%20of%20young%20Asian%20woman%20student%20with%20long%20black%20hair%2C%20confident%20smile%2C%20university%20student%20portrait%2C%20clean%20white%20background%2C%20high%20quality%20photography%2C%20natural%20lighting&width=100&height=100&seq=student7&orientation=squarish',
      group: 'Algorithm Design',
      attendance: 90,
      homeworkRate: 87,
      currentGrade: 'A-',
      enrolledDate: 'Sep 2023',
      totalAssignments: 19,
      completedAssignments: 16,
      lastActive: '5 hours ago'
    },
    {
      id: '8',
      name: 'James Wilson',
      email: 'james.wilson@university.edu',
      avatar: 'https://readdy.ai/api/search-image?query=professional%20headshot%20of%20young%20man%20student%20with%20brown%20hair%2C%20friendly%20expression%2C%20university%20student%20portrait%2C%20clean%20white%20background%2C%20high%20quality%20photography%2C%20natural%20lighting&width=100&height=100&seq=student8&orientation=squarish',
      group: 'Database Systems',
      attendance: 86,
      homeworkRate: 91,
      currentGrade: 'B+',
      enrolledDate: 'Sep 2023',
      totalAssignments: 17,
      completedAssignments: 15,
      lastActive: '6 hours ago'
    }
  ];

  const groups = ['all', 'Advanced Mathematics', 'Programming Basics', 'Data Structures', 'Linear Algebra', 'Web Development', 'Statistics', 'Algorithm Design', 'Database Systems'];

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGroup = selectedGroup === 'all' || student.group === selectedGroup;
    return matchesSearch && matchesGroup;
  });

  const getAttendanceColor = (rate) => {
    if (rate >= 90) return 'text-green-600';
    if (rate >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getHomeworkColor = (rate) => {
    if (rate >= 90) return 'text-green-600';
    if (rate >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getGradeColor = (grade) => {
    if (grade.startsWith('A')) return 'bg-green-100 text-green-800';
    if (grade.startsWith('B')) return 'bg-blue-100 text-blue-800';
    if (grade.startsWith('C')) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const handleStudentClick = (student) => {
    setSelectedStudent(student);
    setShowStudentModal(true);
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <div className="flex">
        <TeacherSidebar />
        
        <div className="flex-1 ml-64">
          <div className="p-8">
            <div className="mb-8">
              <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>Students</h1>
              <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Manage and monitor all your students</p>
            </div>

            <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-lg border`}>
              <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <i className={`ri-search-line w-5 h-5 flex items-center justify-center absolute left-3 top-1/2 transform -translate-y-1/2 ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`}></i>
                      <input
                        type="text"
                        placeholder="Search students..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={`pl-10 pr-4 py-2 border rounded-lg w-64 text-sm ${
                          isDarkMode 
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                        } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                      />
                    </div>
                    
                    <select
                      value={selectedGroup}
                      onChange={(e) => setSelectedGroup(e.target.value)}
                      className={`px-3 py-2 pr-8 border rounded-lg text-sm ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    >
                      <option value="all">All Groups</option>
                      {groups.slice(1).map(group => (
                        <option key={group} value={group}>{group}</option>
                      ))}
                    </select>
                  </div>

                  <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {filteredStudents.length} students found
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className={`border-b ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                        <th className={`text-left py-3 px-4 font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Student</th>
                        <th className={`text-left py-3 px-4 font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Group</th>
                        <th className={`text-left py-3 px-4 font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Attendance</th>
                        <th className={`text-left py-3 px-4 font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Homework Rate</th>
                        <th className={`text-left py-3 px-4 font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Grade</th>
                        <th className={`text-left py-3 px-4 font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStudents.map((student, index) => (
                        <tr 
                          key={student.id} 
                          className={`border-b ${isDarkMode ? 'border-gray-700 hover:bg-gray-750' : 'border-gray-100 hover:bg-gray-50'} transition-colors cursor-pointer`}
                          onClick={() => handleStudentClick(student)}
                        >
                          <td className="py-4 px-4">
                            <div className="flex items-center space-x-3">
                              <img
                                src={student.avatar}
                                alt={student.name}
                                className="w-10 h-10 rounded-full object-cover object-top"
                              />
                              <div>
                                <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{student.name}</div>
                                <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{student.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className={`py-4 px-4 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            {student.group}
                          </td>
                          <td className={`py-4 px-4 text-sm font-medium ${getAttendanceColor(student.attendance)}`}>
                            {student.attendance}%
                          </td>
                          <td className={`py-4 px-4 text-sm font-medium ${getHomeworkColor(student.homeworkRate)}`}>
                            {student.homeworkRate}%
                          </td>
                          <td className="py-4 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getGradeColor(student.currentGrade)}`}>
                              {student.currentGrade}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStudentClick(student);
                              }}
                              className="text-blue-600 hover:text-blue-800 text-sm font-medium whitespace-nowrap"
                            >
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showStudentModal && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto`}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <img
                  src={selectedStudent.avatar}
                  alt={selectedStudent.name}
                  className="w-16 h-16 rounded-full object-cover object-top"
                />
                <div>
                  <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{selectedStudent.name}</h3>
                  <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{selectedStudent.email}</p>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Enrolled: {selectedStudent.enrolledDate}</p>
                </div>
              </div>
              <button
                onClick={() => setShowStudentModal(false)}
                className={`${isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <i className="ri-close-line w-6 h-6 flex items-center justify-center"></i>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <h4 className={`font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Academic Performance</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Current Grade</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getGradeColor(selectedStudent.currentGrade)}`}>
                        {selectedStudent.currentGrade}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Attendance Rate</span>
                      <span className={`text-sm font-medium ${getAttendanceColor(selectedStudent.attendance)}`}>
                        {selectedStudent.attendance}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Homework Rate</span>
                      <span className={`text-sm font-medium ${getHomeworkColor(selectedStudent.homeworkRate)}`}>
                        {selectedStudent.homeworkRate}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <h4 className={`font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Assignment Progress</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Completed</span>
                      <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {selectedStudent.completedAssignments}/{selectedStudent.totalAssignments}
                      </span>
                    </div>
                    <div className={`w-full bg-gray-200 rounded-full h-2 ${isDarkMode ? 'bg-gray-600' : 'bg-gray-200'}`}>
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{
                          width: `${(selectedStudent.completedAssignments / selectedStudent.totalAssignments) * 100}%`
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <h4 className={`font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Group Information</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Current Group</span>
                      <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{selectedStudent.group}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Last Active</span>
                      <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{selectedStudent.lastActive}</span>
                    </div>
                  </div>
                </div>

                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <h4 className={`font-medium mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Quick Actions</h4>
                  <div className="space-y-2">
                    <button className="w-full px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap">
                      Send Message
                    </button>
                    <button className={`w-full px-3 py-2 text-sm rounded-lg transition-colors whitespace-nowrap ${
                      isDarkMode 
                        ? 'bg-gray-600 text-gray-300 hover:bg-gray-500' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}>
                      View Full Profile
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end">
              <button
                onClick={() => setShowStudentModal(false)}
                className={`px-4 py-2 text-sm rounded-md transition-colors whitespace-nowrap ${
                  isDarkMode 
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
