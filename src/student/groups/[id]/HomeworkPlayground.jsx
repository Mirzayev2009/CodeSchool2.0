
'use client';

import { useState, useEffect } from 'react';

export default function HomeworkPlayground({ groupId }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const homeworkTasks = [
    {
      id: 1,
      title: 'Variables and Data Types',
      type: 'code',
      difficulty: 'Easy',
      dueDate: '2024-12-25',
      description: 'Create variables for different data types and display them in the console. You need to create at least 4 different variables: string, number, boolean, and array.',
      expectedOutput: 'console.log',
      correctAnswer: 'let name = "John"; let age = 25; let isStudent = true; let hobbies = ["reading", "coding"]; console.log(name, age, isStudent, hobbies);',
      points: 10
    },
    {
      id: 2,
      title: 'Function Creation',
      type: 'code',
      difficulty: 'Medium',
      dueDate: '2024-12-26',
      description: 'Write a function called "calculateSum" that takes two parameters and returns their sum. The function should handle both numbers and strings that can be converted to numbers.',
      expectedOutput: 'function calculateSum',
      correctAnswer: 'function calculateSum(a, b) { return Number(a) + Number(b); }',
      points: 15
    },
    {
      id: 3,
      title: 'Array Methods',
      type: 'code',
      difficulty: 'Medium',
      dueDate: '2024-12-27',
      description: 'Create an array of numbers [1, 2, 3, 4, 5] and use array methods to: 1) Add number 6 to the end, 2) Remove the first element, 3) Find the sum of all elements using reduce method.',
      expectedOutput: 'reduce',
      correctAnswer: 'let arr = [1, 2, 3, 4, 5]; arr.push(6); arr.shift(); let sum = arr.reduce((a, b) => a + b, 0);',
      points: 20
    },
    {
      id: 4,
      title: 'Object Properties',
      type: 'code',
      difficulty: 'Easy',
      dueDate: '2024-12-28',
      description: 'Create an object called "student" with properties: name, age, grade, and subjects (array). Then access and log each property to the console.',
      expectedOutput: 'student',
      correctAnswer: 'let student = { name: "Alice", age: 20, grade: "A", subjects: ["Math", "Science"] }; console.log(student.name, student.age, student.grade, student.subjects);',
      points: 12
    },
    {
      id: 5,
      title: 'Conditional Logic',
      type: 'code',
      difficulty: 'Medium',
      dueDate: '2024-12-29',
      description: 'Write a function that takes a number as parameter and returns "positive", "negative", or "zero" based on the number value. Use if-else statements.',
      expectedOutput: 'positive',
      correctAnswer: 'function checkNumber(num) { if (num > 0) return "positive"; else if (num < 0) return "negative"; else return "zero"; }',
      points: 15
    },
    {
      id: 6,
      title: 'Loop Implementation',
      type: 'code',
      difficulty: 'Hard',
      dueDate: '2024-12-30',
      description: 'Create a for loop that prints numbers from 1 to 10, but skip number 5 and stop at number 8. Use continue and break statements appropriately.',
      expectedOutput: 'for',
      correctAnswer: 'for (let i = 1; i <= 10; i++) { if (i === 5) continue; if (i > 8) break; console.log(i); }',
      points: 25
    },
    {
      id: 7,
      title: 'JavaScript Concepts',
      type: 'text',
      difficulty: 'Easy',
      dueDate: '2024-12-31',
      description: 'Explain the difference between "let", "const", and "var" in JavaScript. Describe when you would use each one and provide examples.',
      expectedOutput: 'let const var',
      correctAnswer: 'let is block-scoped and can be reassigned, const is block-scoped and cannot be reassigned, var is function-scoped and can be reassigned',
      points: 10
    },
    {
      id: 8,
      title: 'Event Handling',
      type: 'code',
      difficulty: 'Medium',
      dueDate: '2025-01-01',
      description: 'Create a button click event handler that changes the text content of a paragraph element. Use addEventListener method.',
      expectedOutput: 'addEventListener',
      correctAnswer: 'document.getElementById("myButton").addEventListener("click", function() { document.getElementById("myParagraph").textContent = "Button clicked!"; });',
      points: 18
    },
    {
      id: 9,
      title: 'Error Handling',
      type: 'code',
      difficulty: 'Hard',
      dueDate: '2025-01-02',
      description: 'Write a try-catch block that attempts to parse a JSON string. If parsing fails, catch the error and return a default object with name: "Unknown".',
      expectedOutput: 'try catch',
      correctAnswer: 'try { let data = JSON.parse(jsonString); return data; } catch (error) { return { name: "Unknown" }; }',
      points: 22
    },
    {
      id: 10,
      title: 'Algorithm Thinking',
      type: 'text',
      difficulty: 'Hard',
      dueDate: '2025-01-03',
      description: 'Describe the steps to find the largest number in an array without using built-in Math.max() function. Write the algorithm in plain English.',
      expectedOutput: 'largest array algorithm',
      correctAnswer: 'Initialize a variable to store the largest number with the first array element. Loop through the remaining elements. Compare each element with the current largest. If current element is larger, update the largest variable. Return the largest number.',
      points: 20
    }
  ];

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
      
      if (task.type === 'code') {
        // Check if user input contains expected keywords or patterns
        const userCode = userInput.toLowerCase().trim();
        const expectedKeywords = task.expectedOutput.toLowerCase().split(' ');
        const hasExpectedContent = expectedKeywords.some(keyword => userCode.includes(keyword));
        
        // Simple keyword matching for demo purposes
        isCorrect = hasExpectedContent && userInput.length > 10;
      } else {
        // Text answer checking
        const userAnswer = userInput.toLowerCase().trim();
        const expectedKeywords = task.expectedOutput.toLowerCase().split(' ');
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
      
      // Clear draft if correct
      if (isCorrect) {
        localStorage.removeItem(`draft_${groupId}_${selectedTask.id}`);
      }
    }, 1500);
  };

  const closeTask = () => {
    setSelectedTask(null);
    setUserInput('');
    setFeedback(null);
  };

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
                    Due: {selectedTask.dueDate}
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
            </div>

            {/* Code Editor / Text Input */}
            <div className="flex-1 p-6 min-h-0">
              <div className="flex items-center justify-between mb-4">
                <h4 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Your {selectedTask.type === 'code' ? 'Code' : 'Answer'}:
                </h4>
                <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {selectedTask.type === 'text' && `${userInput.length}/500 characters`}
                </span>
              </div>
              
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
                <i className="ri-save-line w-4 h-4 flex items-center justify-center mr-1 inline-flex"></i>
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
              {task.description.slice(0, 80)}...
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
                  Due: {task.dueDate}
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
