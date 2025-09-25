
"use client";

import { useState, useEffect } from "react";
import {
  getAttendanceByGroup,
  bulkCreateAttendance,
  getTeacherGroupDetail,
  getTeacherStudents
} from "../../../attendance"; // Updated import path
import { useUser } from "../../../UserContext";
import React from "react";  

export default function LessonCalendar({ groupId }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [currentWeek, setCurrentWeek] = useState(0);
  const [openedDates, setOpenedDates] = useState({});
  const { token } = useUser();
  const [students, setStudents] = useState([]);
  const [attendanceData, setAttendanceData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      if (!groupId || !token) return;
      setLoading(true);
      setError(null);
      try {
        // Fetch group details with students
        const groupData = await getTeacherGroupDetail(groupId, token);
        console.log('Group data:', groupData);
        
        // Set students - adjust based on actual API response structure
        if (groupData.students) {
          setStudents(groupData.students);
        } else if (groupData.members) {
          setStudents(groupData.members);
        } else {
          // Fallback: fetch students separately
          const studentsData = await getTeacherStudents(token, groupId);
          setStudents(studentsData);
        }

        // Fetch attendance for current week
        const weekStart = getWeekStartDate();
        const dateStr = weekStart.toISOString().slice(0, 10);
        const attData = await getAttendanceByGroup(groupId, dateStr, token);
        console.log('Attendance data:', attData);
        
        // Process attendance data into the format expected by the component
        const processedAttendance = processAttendanceData(attData);
        setAttendanceData(processedAttendance);
        
      } catch (err) {
        console.error('Error fetching data:', err);
        setError("Failed to load group or attendance data");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [groupId, token, currentWeek]);

  // Process attendance data from API into component format
  const processAttendanceData = (apiData) => {
    const processed = {};
    if (!apiData || !Array.isArray(apiData)) return processed;
    
    apiData.forEach(record => {
      if (!processed[record.student_id]) {
        processed[record.student_id] = {};
      }
      
      // Convert date to day of week
      const recordDate = new Date(record.date);
      const dayName = days[recordDate.getDay() === 0 ? 6 : recordDate.getDay() - 1]; // Adjust for Monday start
      
      processed[record.student_id][dayName] = record.status;
    });
    
    return processed;
  };

  // Get week start date based on current week offset
  const getWeekStartDate = () => {
    const currentDate = new Date();
    const firstDayOfWeek = new Date(currentDate);
    const dayOfWeek = currentDate.getDay();
    const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Monday as first day
    firstDayOfWeek.setDate(currentDate.getDate() + diff + currentWeek * 7);
    return firstDayOfWeek;
  };

  useEffect(() => {
    // Check for saved dark mode preference
    const savedTheme = localStorage.getItem("darkMode");
    if (savedTheme) {
      setIsDarkMode(savedTheme === "true");
    }

    const handleStorageChange = () => {
      const theme = localStorage.getItem("darkMode");
      setIsDarkMode(theme === "true");
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const getWeekDates = () => {
    const currentDate = new Date();
    const firstDayOfWeek = new Date(currentDate);
    const dayOfWeek = currentDate.getDay();
    const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    firstDayOfWeek.setDate(currentDate.getDate() + diff + currentWeek * 7);

    const weekDates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(firstDayOfWeek);
      date.setDate(firstDayOfWeek.getDate() + i);
      weekDates.push(date);
    }
    return weekDates;
  };

  const weekDates = getWeekDates();

  const isPastDate = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const isFutureDate = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date > today;
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const toggleAttendance = (studentId, dayIndex) => {
    const date = weekDates[dayIndex];
    const isTodayDate = isToday(date);
    const isPast = isPastDate(date);
    const isFuture = isFutureDate(date);

    // Only allow toggle if today OR past with edit mode OR future that's unlocked
    const dayKey = `${dayIndex}_${currentWeek}`;
    const isFutureUnlocked = isFuture && openedDates[dayKey];
    
    if (!(isTodayDate || (isPast && isEditMode) || isFutureUnlocked)) return;

    setAttendanceData((prev) => {
      const studentAttendance = prev[studentId] || {};
      const current = studentAttendance[days[dayIndex]] || "";

      // Cycle through states: "" -> "present" -> "absent" -> "excused" -> ""
      let next = "";
      if (current === "") next = "present";
      else if (current === "present") next = "absent";
      else if (current === "absent") next = "excused";
      else if (current === "excused") next = "";

      setHasChanges(true);

      return {
        ...prev,
        [studentId]: {
          ...studentAttendance,
          [days[dayIndex]]: next,
        },
      };
    });
  };

  const toggleDateAccess = (dayIndex) => {
    const date = weekDates[dayIndex];
    const dayKey = `${dayIndex}_${currentWeek}`;

    if (isFutureDate(date)) {
      setOpenedDates((prev) => ({
        ...prev,
        [dayKey]: !prev[dayKey],
      }));
    }
  };

  const saveChanges = async () => {
    try {
      setLoading(true);
      
      // Convert attendance data to API format
      const attendanceRecords = [];
      Object.keys(attendanceData).forEach(studentId => {
        Object.keys(attendanceData[studentId]).forEach(dayName => {
          const status = attendanceData[studentId][dayName];
          if (status) { // Only save non-empty statuses
            const dayIndex = days.indexOf(dayName);
            const date = weekDates[dayIndex];
            attendanceRecords.push({
              student_id: parseInt(studentId),
              group_id: parseInt(groupId),
              date: date.toISOString().slice(0, 10),
              status: status
            });
          }
        });
      });

      await bulkCreateAttendance(attendanceRecords, token);
      setIsEditMode(false);
      setHasChanges(false);
      
      // Show success feedback
      const successMsg = document.createElement("div");
      successMsg.className = "fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50";
      successMsg.textContent = "Attendance saved successfully!";
      document.body.appendChild(successMsg);
      setTimeout(() => {
        if (document.body.contains(successMsg)) {
          document.body.removeChild(successMsg);
        }
      }, 3000);
    } catch (err) {
      console.error('Save error:', err);
      setError("Failed to save attendance");
    } finally {
      setLoading(false);
    }
  };

  const cancelEdit = () => {
    setIsEditMode(false);
    setHasChanges(false);
    setOpenedDates({});
  };

  const changeWeek = (direction) => {
    setCurrentWeek((prev) => prev + direction);
    setOpenedDates({});
    setIsEditMode(false);
    setHasChanges(false);
  };

  const getAttendanceIcon = (status) => {
    switch (status) {
      case "present": return "✅";
      case "absent": return "❌";
      case "excused": return "➖";
      case "late": return "⏰";
      default: return "";
    }
  };

  const getAttendanceColor = (status, isDisabled = false) => {
    if (isDisabled) {
      return "text-gray-400 bg-gray-100 cursor-not-allowed opacity-50";
    }
    switch (status) {
      case "present": return "text-green-600 bg-green-50";
      case "absent": return "text-red-600 bg-red-50";
      case "excused": return "text-yellow-600 bg-yellow-50";
      case "late": return "text-orange-600 bg-orange-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  const getAttendanceStats = () => {
    let totalPresent = 0, totalAbsent = 0, totalExcused = 0, totalLate = 0;

    students.forEach((student) => {
      days.forEach((day) => {
        const status = attendanceData[student.id]?.[day] || "";
        if (status === "present") totalPresent++;
        else if (status === "absent") totalAbsent++;
        else if (status === "excused") totalExcused++;
        else if (status === "late") totalLate++;
      });
    });

    const total = totalPresent + totalAbsent + totalExcused + totalLate;
    const attendanceRate = total > 0 ? Math.round((totalPresent / total) * 100) : 0;

    return { attendanceRate, totalPresent, totalAbsent, totalExcused, totalLate };
  };

  const stats = getAttendanceStats();

  if (loading) {
    return (
      <div className={`${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} rounded-xl shadow-lg border`}>
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className={`mt-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Loading attendance...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} rounded-xl shadow-lg border`}>
        <div className="p-8 text-center">
          <p className={`text-red-500 ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} rounded-xl shadow-lg border`}>
      {/* Header with Stats and Controls */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-4">
            <h3 className={`text-lg font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
              Weekly Attendance Management
            </h3>

            {/* Week Navigation */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => changeWeek(-1)}
                className={`p-1 rounded transition-colors ${
                  isDarkMode
                    ? "hover:bg-gray-700 text-gray-400 hover:text-gray-200"
                    : "hover:bg-gray-100 text-gray-500 hover:text-gray-700"
                }`}
              >
                ←
              </button>

              <span className={`text-sm px-3 py-1 rounded-lg ${
                  isDarkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-700"
                }`}>
                {currentWeek === 0
                  ? "This Week"
                  : currentWeek > 0
                  ? `${currentWeek} Week${currentWeek > 1 ? "s" : ""} Ahead`
                  : `${Math.abs(currentWeek)} Week${Math.abs(currentWeek) > 1 ? "s" : ""} Ago`}
              </span>

              <button
                onClick={() => changeWeek(1)}
                className={`p-1 rounded transition-colors ${
                  isDarkMode
                    ? "hover:bg-gray-700 text-gray-400 hover:text-gray-200"
                    : "hover:bg-gray-100 text-gray-500 hover:text-gray-700"
                }`}
              >
                →
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
              {weekDates[0].toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}{" "}
              -{" "}
              {weekDates[6].toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </div>

            {/* Edit/Save Controls */}
            <div className="flex items-center space-x-2">
              {!isEditMode && !hasChanges && (
                <button
                  onClick={() => setIsEditMode(true)}
                  className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
                >
                  Edit Mode
                </button>
              )}
              {hasChanges && (
                <>
                  <button
                    onClick={cancelEdit}
                    className={`px-3 py-1.5 text-sm rounded-lg transition-colors whitespace-nowrap ${
                      isDarkMode
                        ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveChanges}
                    className="px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors whitespace-nowrap"
                  >
                    Save Changes
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Edit Mode Indicator */}
        {isEditMode && (
          <div className="mb-3 p-2 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center text-blue-800">
              <span className="text-sm font-medium">
                Edit Mode Active - Click attendance marks to modify. Future dates must be unlocked first.
              </span>
              {hasChanges && (
                <span className="ml-2 text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">
                  Unsaved changes
                </span>
              )}
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-3 text-xs">
          <div className={`text-center p-2 rounded ${isDarkMode ? "bg-gray-700" : "bg-gray-50"}`}>
            <div className={`font-bold text-lg ${isDarkMode ? "text-white" : "text-gray-900"}`}>
              {students.length}
            </div>
            <div className={isDarkMode ? "text-gray-400" : "text-gray-600"}>Total Students</div>
          </div>
          <div className={`text-center p-2 rounded ${isDarkMode ? "bg-green-900" : "bg-green-50"}`}>
            <div className={`font-bold text-lg ${isDarkMode ? "text-green-400" : "text-green-600"}`}>
              {stats.attendanceRate}%
            </div>
            <div className={isDarkMode ? "text-green-300" : "text-green-600"}>Week Average</div>
          </div>
          <div className={`text-center p-2 rounded ${isDarkMode ? "bg-blue-900" : "bg-blue-50"}`}>
            <div className={`font-bold text-lg ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}>
              {stats.totalPresent}
            </div>
            <div className={isDarkMode ? "text-blue-300" : "text-blue-600"}>Present</div>
          </div>
          <div className={`text-center p-2 rounded ${isDarkMode ? "bg-red-900" : "bg-red-50"}`}>
            <div className={`font-bold text-lg ${isDarkMode ? "text-red-400" : "text-red-600"}`}>
              {stats.totalAbsent}
            </div>
            <div className={isDarkMode ? "text-red-300" : "text-red-600"}>Absent</div>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="p-2">
        <div className="grid grid-cols-8 gap-1 text-xs">
          {/* Header */}
          <div className={`p-2 font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
            Student
          </div>
          {days.map((day, dayIndex) => {
            const date = weekDates[dayIndex];
            const dayKey = `${dayIndex}_${currentWeek}`;
            const isTodayDate = isToday(date);
            const isPast = isPastDate(date);
            const isFuture = isFutureDate(date);
            const isOpened = openedDates[dayKey];

            return (
              <div
                key={day}
                className={`p-2 text-center font-medium rounded transition-colors ${
                  isTodayDate
                    ? "bg-blue-600 text-white"
                    : isFuture && !isOpened
                    ? isDarkMode
                      ? "bg-gray-700 text-gray-500 cursor-pointer hover:bg-gray-600"
                      : "bg-gray-200 text-gray-500 cursor-pointer hover:bg-gray-300"
                    : isDarkMode
                    ? "text-gray-300"
                    : "text-gray-700"
                }`}
                onClick={() => toggleDateAccess(dayIndex)}
                title={isFuture && !isOpened ? "Click to unlock this date for editing" : ""}
              >
                <div>{day}</div>
                <div className="text-xs opacity-75">{date.getDate()}</div>
                {isFuture && !isOpened && <div className="text-xs">🔒</div>}
                {isFuture && isOpened && <div className="text-xs">🔓</div>}
              </div>
            );
          })}

          {/* Student Rows */}
          {students.map((student) => (
            <React.Fragment key={student.id}>
              <div
                className={`p-1 text-xs font-medium truncate ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
                title={student.first_name + ' ' + (student.last_name || '')}
              >
                {student.first_name || student.name || `Student ${student.id}`}
              </div>
              {days.map((day, dayIndex) => {
                const date = weekDates[dayIndex];
                const isTodayDate = isToday(date);
                const isPast = isPastDate(date);
                const isFuture = isFutureDate(date);
                const dayKey = `${dayIndex}_${currentWeek}`;

                let isDisabled = false;
                if (isTodayDate) {
                  isDisabled = false;
                } else if (isPast) {
                  isDisabled = !isEditMode;
                } else if (isFuture) {
                  isDisabled = !openedDates[dayKey];
                }

                const studentAttendance = attendanceData[student.id] || {};
                const dayValue = studentAttendance[day] || "";

                return (
                  <button
                    key={`${student.id}-${day}`}
                    onClick={() => toggleAttendance(student.id, dayIndex)}
                    className={`p-1 m-0.5 rounded text-xs font-medium transition-colors ${getAttendanceColor(
                      dayValue,
                      isDisabled
                    )} ${
                      !isDisabled
                        ? "hover:opacity-80 cursor-pointer ring-2 ring-transparent hover:ring-blue-300"
                        : "cursor-default"
                    }`}
                    title={`${student.first_name} - ${day}: ${dayValue || "—"} ${
                      !isDisabled ? "(Click to change)" : "(Disabled)"
                    }`}
                    disabled={isDisabled}
                  >
                    {getAttendanceIcon(dayValue)}
                  </button>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className={`px-4 py-2 border-t ${
          isDarkMode ? "border-gray-700 bg-gray-750" : "border-gray-200 bg-gray-50"
        }`}>
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <span className="mr-1">✅</span>
              <span className={isDarkMode ? "text-gray-300" : "text-gray-600"}>Present</span>
            </div>
            <div className="flex items-center">
              <span className="mr-1">❌</span>
              <span className={isDarkMode ? "text-gray-300" : "text-gray-600"}>Absent</span>
            </div>
            <div className="flex items-center">
              <span className="mr-1">➖</span>
              <span className={isDarkMode ? "text-gray-300" : "text-gray-600"}>Excused</span>
            </div>
            <div className="flex items-center">
              <span className="mr-1">⏰</span>
              <span className={isDarkMode ? "text-gray-300" : "text-gray-600"}>Late</span>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center">
              <span className="mr-1">🔒</span>
              <span className={isDarkMode ? "text-gray-300" : "text-gray-600"}>Locked Future Date</span>
            </div>
            <div className="flex items-center">
              <span className="mr-1">🔓</span>
              <span className={isDarkMode ? "text-gray-300" : "text-gray-600"}>Unlocked for Editing</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}