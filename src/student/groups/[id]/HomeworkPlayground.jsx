
'use client';

import { useState, useEffect } from 'react';
import { useUser } from '../../../UserContext';
import { getHomeworks } from '../../../homeworkApi';

export default function HomeworkPlayground({ groupId }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [homeworkTasks, setHomeworkTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'true');
    }
    const handleStorageChange = () => {
      const theme = localStorage.getItem('darkMode');
      setIsDarkMode(theme === 'true');
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Save draft locally
  useEffect(() => {
    if (selectedTask && userInput) {
      localStorage.setItem(`draft_${groupId}_${selectedTask.id}`, userInput);
    }
  }, [userInput, selectedTask, groupId]);

  // Load draft when task is selected
  useEffect(() => {
    if (selectedTask) {
      const draft = localStorage.getItem(`draft_${groupId}_${selectedTask.id}`);
      if (draft) {
        setUserInput(draft);
      } else {
        setUserInput('');
      }
      setFeedback(null);
    }
  }, [selectedTask, groupId]);

  const { token } = useUser();

  useEffect(() => {
    async function fetchHomeworks() {
      if (!token || !groupId) return;
      setLoading(true);
      setError(null);
      try {
        const data = await getHomeworks(token, groupId);
        // If your API returns all homeworks, filter by groupId
        const groupTasks = Array.isArray(data) ? data.filter(hw => hw.group_id === groupId) : [];
        setHomeworkTasks(groupTasks);
      } catch (err) {
        setError('Failed to load homework tasks');
      } finally {
        setLoading(false);
      }
    }
    fetchHomeworks();
  }, [token, groupId]);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const checkAnswer = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      const task = selectedTask;
      let isCorrect = false;
      // Use backend model fields for answer validation
      if (task.type === 'code') {
        const userCode = userInput.toLowerCase().trim();
        const expectedKeywords = (task.expected_output || '').toLowerCase().split(' ');
        const hasExpectedContent = expectedKeywords.some(keyword => userCode.includes(keyword));
        isCorrect = hasExpectedContent && userInput.length > 10;
      } else {
        const userAnswer = userInput.toLowerCase().trim();
        const expectedKeywords = (task.expected_output || '').toLowerCase().split(' ');
        isCorrect = expectedKeywords.some(keyword => userAnswer.includes(keyword)) && userInput.length > 20;
      }
      setFeedback({
        isCorrect,
        message: isCorrect 
          ? "✅ Correct! Great job on completing this task." 
          : "❌ Incorrect. Please check your solution and try again.",
        points: isCorrect ? task.points : 0
      });
      setIsSubmitting(false);
      if (isCorrect) {
        localStorage.removeItem(`draft_${groupId}_${selectedTask.id}`);
      }
    }, 1500);
  };

  // ...existing code...
  if (loading) {
    return (
      <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-lg border p-6 text-center`}>
        Loading homework tasks...
      </div>
    );
  }
  if (error) {
    return (
      <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-lg border p-6 text-center text-red-600`}>
        {error}
      </div>
    );
  }
  if (selectedTask) {
    return (
      <div className="fixed inset-0 bg-black bg-black/50 flex items-center justify-center z-50 p-4">
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col`}>
          {/* Header */}
          <div className={`border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} p-6`}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                  {selectedTask.title}
                </h3>
                <div className="flex items-center space-x-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(selectedTask.difficulty)}`}>
                    {selectedTask.difficulty}
                  </span>
                  <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Due: {selectedTask.due_date}
                  </span>
                  <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {selectedTask.points} points
                  </span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    selectedTask.type === 'code' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-purple-100 text-purple-800'
                  }`}>
                    {selectedTask.type === 'code' ? 'Code' : 'Text'}
                  </span>
                </div>
              </div>
              <button
                onClick={closeTask}
                className={`p-2 rounded-full transition-colors ${isDarkMode ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'}`}
              >
                <i className="ri-close-line w-5 h-5 flex items-center justify-center"></i>
              </button>
            </div>
          </div>
          {/* Content */}
          <div className="flex-1 flex flex-col min-h-0">
            {/* Task Description */}
            <div className={`p-6 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <h4 className={`font-medium mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Task Description:</h4>
              <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
                {selectedTask.description}
              </p>
              {selectedTask.type === 'code' ? (
                <div className={`border rounded-lg overflow-hidden ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}`}>
                  <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} px-4 py-2 border-b ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}`}>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-red-400"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                      <div className="w-3 h-3 rounded-full bg-green-400"></div>
                      <span className={`text-xs ml-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>JavaScript Editor</span>
                    </div>
                  </div>
                  <textarea
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="// Write your JavaScript code here..."
                    className={`w-full h-64 p-4 font-mono text-sm resize-none focus:outline-none ${
                      isDarkMode 
                        ? 'bg-gray-800 text-green-400 placeholder-gray-500' 
                        : 'bg-gray-900 text-green-400 placeholder-gray-400'
                    }`}
                  />
                </div>
              ) : (
                <textarea
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value.slice(0, 500))}
                  placeholder="Type your answer here..."
                  className={`w-full h-64 p-4 border rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                />
              )}
            </div>
            {/* Feedback */}
            {feedback && (
              <div className={`mx-6 mb-4 p-4 rounded-lg ${
                feedback.isCorrect 
                  ? 'bg-green-50 border border-green-200' 
                  : 'bg-red-50 border border-red-200'
              }`}>
                <div className="flex items-center justify-between">
                  <p className={`font-medium ${feedback.isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                    {feedback.message}
                  </p>
                  {feedback.isCorrect && (
                    <span className="text-green-800 font-semibold">+{feedback.points} points</span>
                  )}
                </div>
              </div>
            )}
            {/* Footer */}
            <div className={`border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} p-6 flex items-center justify-between`}>
              <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <i className="ri-save-line w-4 h-4 items-center justify-center mr-1"></i>
                Draft saved automatically
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={closeTask}
                  className={`px-4 py-2 text-sm rounded-md transition-colors whitespace-nowrap ${
                    isDarkMode 
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Close
                </button>
                <button
                  onClick={checkAnswer}
                  disabled={isSubmitting || !userInput.trim()}
                  className="px-6 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
                >
                  {isSubmitting ? 'Checking...' : 'Submit Answer'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-lg border p-6`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Homework Tasks</h3>
        <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          {homeworkTasks.length} tasks available
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {homeworkTasks.map((task) => (
          <button
            key={task.id}
            onClick={() => setSelectedTask(task)}
            className={`p-4 border rounded-lg text-left transition-colors ${
              isDarkMode 
                ? 'border-gray-600 hover:bg-gray-700 hover:border-gray-500' 
                : 'border-gray-200 hover:bg-gray-50 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{task.title}</h4>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(task.difficulty)}`}>
                {task.difficulty}
              </span>
            </div>
            <p className={`text-sm mb-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {task.description?.slice(0, 80)}...
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 text-xs">
                <span className={`px-2 py-1 rounded ${
                  task.type === 'code' 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-purple-100 text-purple-800'
                }`}>
                  {task.type === 'code' ? 'Code' : 'Text'}
                </span>
                <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                  Due: {task.due_date}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`text-xs font-semibold ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                  {task.points} pts
                </span>
                <i className={`ri-arrow-right-line w-4 h-4 flex items-center justify-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}></i>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}





