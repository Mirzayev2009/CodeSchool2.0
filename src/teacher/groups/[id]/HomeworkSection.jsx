'use client';

import { useState, useEffect } from 'react';
import { useUser } from "../../../UserContext";
import { getLessons, getLessonHomeworkTasks } from '../../../lessonApi'; // API helper functions

export default function LessonHomeworkSection() {
  const { token } = useUser();  // ✅ get token from context/provider
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [lessons, setLessons] = useState([]);
  const [lessonHomeworks, setLessonHomeworks] = useState({});
  const [savedLessons, setSavedLessons] = useState([]);
  const [activeLesson, setActiveLesson] = useState(null);
  const [selectedHomeworks, setSelectedHomeworks] = useState({});
  const [finalHomeworks, setFinalHomeworks] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadingHomeworks, setLoadingHomeworks] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) return; // wait until token is ready
    setIsDarkMode(false); 
    loadLessons();
  }, [token]);

  const loadLessons = async () => {
    try {
      setLoading(true);
      setError(null);
      const lessonsData = await getLessons(token); // ✅ pass token
      setLessons(lessonsData);
    } catch (error) {
      console.error('Error loading lessons:', error);
      setError("Failed to load lessons");
    } finally {
      setLoading(false);
    }
  };

  const loadHomeworks = async (lessonId) => {
    if (lessonHomeworks[lessonId]) return;
    setLoadingHomeworks(true);
    try {
      const homeworkData = await getLessonHomeworkTasks(lessonId, token); // ✅ pass token
      setLessonHomeworks(prev => ({
        ...prev,
        [lessonId]: homeworkData
      }));
    } catch (error) {
      console.error('Error loading homeworks:', error);
      setError("Failed to load homeworks");
    } finally {
      setLoadingHomeworks(false);
    }
  };

  // ... keep the rest of your component the same


  // Mock function - implement based on your auth system
  const getAuthToken = () => {
    // Return your auth token here
    // For now, returning empty string as fallback
    return '';
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleLessonClick = (lessonId) => {
    setActiveLesson(lessonId); // show its homeworks
    loadHomeworks(lessonId);
  };

  const handleHomeworkClick = (lessonId, hwId) => {
    setSelectedHomeworks((prev) => {
      const current = prev[lessonId] || [];
      if (current.includes(hwId)) {
        return { ...prev, [lessonId]: current.filter((id) => id !== hwId) };
      } else {
        return { ...prev, [lessonId]: [...current, hwId] };
      }
    });
  };

  const handleSave = () => {
    if (!activeLesson) return;
    // mark lesson green
    if (!savedLessons.includes(activeLesson)) {
      setSavedLessons((prev) => [...prev, activeLesson]);
    }
    // persist homeworks
    setFinalHomeworks((prev) => ({
      ...prev,
      [activeLesson]: selectedHomeworks[activeLesson] || [],
    }));
  };

  if (loading) {
    return (
      <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-lg border`}>
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className={`mt-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Loading lessons...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-lg border`}>
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Lesson & Homework Manager
        </h3>
      </div>

      <div className="p-4 grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Left side: Lessons */}
        <div>
          <h4 className={`text-md font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Lessons ({lessons.length})
          </h4>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[500px] overflow-y-auto">
            {lessons.map((lesson) => {
              const isSaved = savedLessons.includes(lesson.id);
              const isActive = activeLesson === lesson.id;

              let styles = "p-3 rounded-lg text-sm font-medium transition-colors border ";
              if (isSaved) {
                styles += "bg-green-500 text-white border-green-600";
              } else if (isActive) {
                styles += "bg-blue-500 text-white border-blue-600";
              } else {
                styles += isDarkMode
                  ? "bg-gray-700 text-gray-300 border-gray-600"
                  : "bg-gray-100 text-gray-800 border-gray-300";
              }

              return (
                <button
                  key={lesson.id}
                  onClick={() => handleLessonClick(lesson.id)}
                  className={styles}
                >
                  {lesson.title}
                  <div className="text-xs opacity-70">{lesson.topic}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right side: Homeworks */}
        <div>
          <h4 className={`text-md font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {activeLesson ? `Homeworks for ${lessons.find(l => l.id === activeLesson)?.title}` : "Select a lesson"}
          </h4>

          {!activeLesson ? (
            <div className={`text-center py-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              <p>Please select a lesson to see its homeworks</p>
            </div>
          ) : loadingHomeworks ? (
            <div className={`text-center py-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2">Loading homeworks...</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[500px] overflow-y-auto">
              {(lessonHomeworks[activeLesson] || []).length === 0 ? (
                <div className={`text-center py-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  <p>No homeworks for this lesson</p>
                </div>
              ) : (
                lessonHomeworks[activeLesson].map(hw => {
                  const isSelected = (selectedHomeworks[activeLesson] || []).includes(hw.id);
                  return (
                    <div
                      key={hw.id}
                      onClick={() => handleHomeworkClick(activeLesson, hw.id)}
                      className={`p-4 rounded-lg border cursor-pointer transition-colors
                        ${isSelected
                          ? 'bg-blue-500 text-white border-blue-600'
                          : isDarkMode
                            ? 'bg-gray-700 border-gray-600 hover:bg-gray-600 text-gray-300'
                            : 'bg-white border-gray-200 hover:bg-gray-100 text-gray-800'
                        }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-semibold">{hw.title}</h5>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(hw.difficulty)}`}>
                          {hw.difficulty}
                        </span>
                      </div>
                      <p className="text-sm opacity-80">{hw.description}</p>
                    </div>
                  );
                })
              )}
              {/* Save button */}
              {lessonHomeworks[activeLesson]?.length > 0 && (
                <button
                  onClick={handleSave}
                  className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                >
                  Save
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}