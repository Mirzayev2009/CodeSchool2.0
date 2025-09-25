// File: src/teacher/dashboardApi.js
export const BASE_URL =  'https://sanjar1718.pythonanywhere.com';

/**
 * Fetch list of teacher students from backend.
 * token is optional — if present it will be sent as `Authorization: Token <token>`
 * Returns an array (raw backend shape) — caller should normalize if needed.
 */
export async function getTeacherStudents(token) {
  const headers = token ? { Authorization: `Token ${token}` } : {};
  const res = await fetch(`${BASE_URL}/api/students/`, { headers });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`Failed to fetch students: ${res.status} ${body}`);
  }
  const data = await res.json();
  // backend might return an array or a paginated object { results: [] }
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.results)) return data.results;
  // unknown shape -> return empty array to avoid breaking the UI
  return [];
}


// File: src/teacher/components/TeacherStudents.jsx
import React, { useState, useEffect, useMemo } from 'react';
import TeacherSidebar from '../../../components/TeacherSidebar';
// import { getTeacherStudents } from '../../teacher/dashboardApi';

export default function TeacherStudents() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('all');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // data states
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(savedDarkMode);

    if (savedDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function fetchStudents() {
      setLoading(true);
      setError(null);

      try {
        // Try to find an auth token in localStorage — common keys checked
        const token =
          localStorage.getItem('authToken') ||
          localStorage.getItem('token') ||
          localStorage.getItem('dashboardToken') ||
          localStorage.getItem('teacherToken') ||
          null;

        const raw = await getTeacherStudents(token);

        if (cancelled) return;

        // Normalize backend fields into the shape expected by the UI
        const normalized = raw.map((s) => {
          const fullName =
            s.name || s.full_name || `${s.first_name || ''} ${s.last_name || ''}`.trim() || 'Student';

          const avatar =
            s.avatar || s.avatar_url || s.profile_picture ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=fff&color=000&size=128`;

          const groupName =
            (s.group && (typeof s.group === 'string' ? s.group : s.group.name)) ||
            s.group_name ||
            s.course ||
            'Ungrouped';

          const enrolledDate =
            s.enrolled_date || s.enrolledDate || (s.created_at ? formatShortDate(s.created_at) : 'Unknown');

          const totalAssignments = s.total_assignments ?? s.totalAssignments ?? s.assignments_count ?? 0;
          const completedAssignments = s.completed_assignments ?? s.completedAssignments ?? s.completed_count ?? 0;

          return {
            id: String(s.id ?? s.pk ?? Math.random()),
            name: fullName,
            email: s.email || s.contact_email || '',
            avatar,
            group: groupName,
            attendance: Number(s.attendance ?? s.attendance_rate ?? s.attendancePercent ?? 0),
            homeworkRate: Number(s.homework_rate ?? s.homeworkRate ?? s.homeworkPercent ?? 0),
            currentGrade: s.current_grade ?? s.grade ?? (s.gpa ? String(s.gpa) : 'N/A'),
            enrolledDate,
            totalAssignments,
            completedAssignments,
            lastActive: s.last_active || s.lastActive || s.last_login || null,
          };
        });

        setStudents(normalized);
      } catch (err) {
        setError(err.message || 'Failed to load students');
      } finally {
        setLoading(false);
      }
    }

    fetchStudents();

    return () => {
      cancelled = true;
    };
  }, []);

  // derive groups from fetched students so UI stays consistent
  const groups = useMemo(() => ['all', ...Array.from(new Set(students.map(s => s.group).filter(Boolean)))], [students]);

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (student.email || '').toLowerCase().includes(searchTerm.toLowerCase());
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
    if (String(grade).startsWith('A')) return 'bg-green-100 text-green-800';
    if (String(grade).startsWith('B')) return 'bg-blue-100 text-blue-800';
    if (String(grade).startsWith('C')) return 'bg-yellow-100 text-yellow-800';
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
                      {groups.slice(1).map((group) => (
                        <option key={group} value={group}>
                          {group}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {loading ? 'Loading students...' : `${filteredStudents.length} students found`}
                  </div>
                </div>

                {error && (
                  <div className="mb-4 text-sm text-red-600">Error loading students: {error}</div>
                )}

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
                      {loading ? (
                        <tr>
                          <td colSpan={6} className="py-6 px-4 text-center text-sm text-gray-500">
                            Loading students...
                          </td>
                        </tr>
                      ) : filteredStudents.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-6 px-4 text-center text-sm text-gray-500">
                            No students found.
                          </td>
                        </tr>
                      ) : (
                        filteredStudents.map((student) => (
                          <tr
                            key={student.id}
                            className={`border-b ${isDarkMode ? 'border-gray-700 hover:bg-gray-750' : 'border-gray-100 hover:bg-gray-50'} transition-colors cursor-pointer`}
                            onClick={() => handleStudentClick(student)}
                          >
                            <td className="py-4 px-4">
                              <div className="flex items-center space-x-3">
                                <img src={student.avatar} alt={student.name} className="w-10 h-10 rounded-full object-cover object-top" />
                                <div>
                                  <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{student.name}</div>
                                  <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{student.email}</div>
                                </div>
                              </div>
                            </td>
                            <td className={`py-4 px-4 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{student.group}</td>
                            <td className={`py-4 px-4 text-sm font-medium ${getAttendanceColor(student.attendance)}`}>{student.attendance}%</td>
                            <td className={`py-4 px-4 text-sm font-medium ${getHomeworkColor(student.homeworkRate)}`}>{student.homeworkRate}%</td>
                            <td className="py-4 px-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getGradeColor(student.currentGrade)}`}>{student.currentGrade}</span>
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
                        ))
                      )}
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
                <img src={selectedStudent.avatar} alt={selectedStudent.name} className="w-16 h-16 rounded-full object-cover object-top" />
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
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getGradeColor(selectedStudent.currentGrade)}`}>{selectedStudent.currentGrade}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Attendance Rate</span>
                      <span className={`text-sm font-medium ${getAttendanceColor(selectedStudent.attendance)}`}>{selectedStudent.attendance}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Homework Rate</span>
                      <span className={`text-sm font-medium ${getHomeworkColor(selectedStudent.homeworkRate)}`}>{selectedStudent.homeworkRate}%</span>
                    </div>
                  </div>
                </div>

                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <h4 className={`font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Assignment Progress</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Completed</span>
                      <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{selectedStudent.completedAssignments}/{selectedStudent.totalAssignments}</span>
                    </div>
                    <div className={`w-full bg-gray-200 rounded-full h-2 ${isDarkMode ? 'bg-gray-600' : 'bg-gray-200'}`}>
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{
                          width: `${(selectedStudent.completedAssignments / Math.max(1, selectedStudent.totalAssignments)) * 100}%`
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
                      <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{formatRelative(selectedStudent.lastActive)}</span>
                    </div>
                  </div>
                </div>

                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <h4 className={`font-medium mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Quick Actions</h4>
                  <div className="space-y-2">
                    <button className="w-full px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap">Send Message</button>
                    <button className={`w-full px-3 py-2 text-sm rounded-lg transition-colors whitespace-nowrap ${isDarkMode ? 'bg-gray-600 text-gray-300 hover:bg-gray-500' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>View Full Profile</button>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end">
              <button
                onClick={() => setShowStudentModal(false)}
                className={`px-4 py-2 text-sm rounded-md transition-colors whitespace-nowrap ${isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
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

// ------------------ helper functions ------------------
function formatShortDate(value) {
  try {
    return new Date(value).toLocaleDateString();
  } catch (_e) {
    return value;
  }
}

function formatRelative(value) {
  if (!value) return 'Unknown';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  const diff = Date.now() - d.getTime();
  const sec = Math.floor(diff / 1000);
  if (sec < 60) return `${sec} sec ago`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min} min ago`;
  const hrs = Math.floor(min / 60);
  if (hrs < 24) return `${hrs} hours ago`;
  const days = Math.floor(hrs / 24);
  return `${days} days ago`;
}
