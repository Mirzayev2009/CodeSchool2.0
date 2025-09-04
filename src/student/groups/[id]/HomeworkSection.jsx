
'use client';

import { useState, useEffect } from 'react';
import { useUser } from '../../UserContext';
import { getHomeworks } from '../../homeworkApi';

  const { token } = useUser();
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [codeInput, setCodeInput] = useState('');
  const [textInput, setTextInput] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
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

  useEffect(() => {
    async function fetchTasks() {
      if (!token || !groupId) return;
      setLoading(true);
      setError(null);
      try {
        const data = await getHomeworks(token);
        // Filter or map homeworks for this group if needed
        const groupTasks = Array.isArray(data) ? data.filter(hw => hw.group_id === groupId) : [];
        setTasks(groupTasks);
      } catch (err) {
        setError('Failed to load homework tasks');
      } finally {
        setLoading(false);
      }
    }
    fetchTasks();
  }, [token, groupId]);

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setCodeInput('');
    setTextInput('');
    setFeedback('');
  };

  const handleSubmit = () => {
    const userAnswer = selectedTask.type === 'code' ? codeInput : textInput;
    
    if (!userAnswer.trim()) {
      setFeedback('❌ Please provide an answer before submitting.');
      return;
    }

    if (userAnswer.length > 500) {
      setFeedback('❌ Answer is too long. Please limit your response to 500 characters.');
      return;
    }

    // Simple feedback logic
    const isCorrect = userAnswer.toLowerCase().includes(selectedTask.correctAnswer.toLowerCase());
    
    if (isCorrect) {
      setFeedback('✅ Excellent work! Your solution demonstrates good understanding. ' + selectedTask.explanation);
    } else {
      setFeedback('❌ Good attempt, but there are some areas to improve. Hint: ' + selectedTask.explanation);
    }
  };

  const closeTask = () => {
    setSelectedTask(null);
    setCodeInput('');
    setTextInput('');
    setFeedback('');
  };

  const handleInputChange = (value) => {
    if (selectedTask.type === 'code') {
      setCodeInput(value);
    } else {
      if (value.length <= 500) {
        setTextInput(value);
      }
    }
  };

// Example:
// let name = 'Your Name';
// const age = 25;"
  if (loading) {
    return <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-lg border p-6 text-center`}>Loading homework tasks...</div>;
  }
  if (error) {
    return <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-lg border p-6 text-center text-red-600`}>{error}</div>;
  }
  return (
    <>
      <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-lg border`}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Homework Tasks</h3>
            <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{tasks.length} tasks</span>
          </div>
          <div className={`border-t pt-6 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}> 
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tasks.map((task, index) => (
                <button
                  key={task.id}
                  onClick={() => handleTaskClick(task)}
                  className={`text-left p-4 border rounded-lg transition-all cursor-pointer ${
                    isDarkMode 
                      ? 'border-gray-600 hover:bg-gray-700 hover:border-blue-500' 
                      : 'border-gray-200 hover:bg-gray-50 hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}> 
                        Task {index + 1}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        task.type === 'code' 
                          ? 'text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-300' 
                          : 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-300'
                      }`}>
                        {task.type}
                      </span>
                    </div>
                  </div>
                  <h5 className={`font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{task.title}</h5>
                  <p className={`text-sm mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{task.points}</p>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      task.difficulty === 'Easy' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                      task.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
                      'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                    }`}>
                      {task.difficulty}
                    </span>
                    <i className={`ri-arrow-right-line w-4 h-4 flex items-center justify-center ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}></i>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Task Modal */}
      {selectedTask && (
        <div className="fixed inset-0 bg-black bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden`}>
            {/* Header */}
            <div className={`border-b p-6 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}> 
              <div className="flex items-center justify-between">
                <div>
                  <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{selectedTask.title}</h3>
                  <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{selectedTask.points} • {selectedTask.difficulty}</p>
                </div>
                <button 
                  onClick={closeTask}
                  className={`p-2 rounded-full transition-colors ${isDarkMode ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'}`}
                >
                  <i className="ri-close-line w-5 h-5 flex items-center justify-center"></i>
                </button>
              </div>
            </div>
            <div className="overflow-y-auto" style={{maxHeight: 'calc(90vh - 140px)'}}>
              {/* Problem Explanation */}
              <div className={`p-6 border-b ${isDarkMode ? 'border-gray-700 bg-gray-700' : 'border-gray-200 bg-gray-50'}`}> 
                <h4 className={`text-lg font-medium mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Problem</h4>
                <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>{selectedTask.description}</p>
              </div>
              {/* Code/Text Input */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h4 className={`text-lg font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Your Solution</h4>
                  {selectedTask.type === 'text' && (
                    <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}> 
                      {(selectedTask.type === 'code' ? codeInput : textInput).length}/500 characters
                    </span>
                  )}
                </div>
                {selectedTask.type === 'code' ? (
                  <div>
                    <div className="bg-gray-900 rounded-lg p-4 mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-400">JavaScript</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        </div>
                      </div>
                      <textarea
                        value={codeInput}
                        onChange={(e) => handleInputChange(e.target.value)}
                        className="w-full bg-transparent text-green-400 font-mono text-sm resize-none outline-none placeholder-gray-500"
                        rows={10}
                        placeholder="// Write your JavaScript code here...\n// Example:\n// let name = 'Your Name';\n// const age = 25;"
                      />
                    </div>
                  </div>
                ) : (
                  <textarea
                    value={textInput}
                    onChange={(e) => handleInputChange(e.target.value)}
                    className={`w-full p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                    rows={8}
                    placeholder="Type your detailed answer here... (max 500 characters)"
                    maxLength={500}
                  />
                )}
                {/* Feedback */}
                {feedback && (
                  <div className={`mt-4 p-4 rounded-lg ${
                    feedback.startsWith('✅') 
                      ? 'bg-green-50 border border-green-200 dark:bg-green-900 dark:border-green-700' 
                      : 'bg-red-50 border border-red-200 dark:bg-red-900 dark:border-red-700'
                  }`}>
                    <p className={`text-sm ${
                      feedback.startsWith('✅') 
                        ? 'text-green-800 dark:text-green-200' 
                        : 'text-red-800 dark:text-red-200'
                    }`}>
                      {feedback}
                    </p>
                  </div>
                )}
              </div>
            </div>
            {/* Footer */}
            <div className={`border-t p-6 flex items-center justify-between ${isDarkMode ? 'border-gray-700 bg-gray-700' : 'border-gray-200 bg-gray-50'}`}> 
              <button 
                onClick={closeTask}
                className={`px-4 py-2 text-sm rounded-md transition-colors whitespace-nowrap ${isDarkMode ? 'bg-gray-600 text-gray-300 hover:bg-gray-500' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                Cancel
              </button>
              <button 
                onClick={handleSubmit}
                className="px-6 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors whitespace-nowrap"
              >
                Submit Answer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
