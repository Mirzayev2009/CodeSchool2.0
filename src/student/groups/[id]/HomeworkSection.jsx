
'use client';

import { useState, useEffect } from 'react';

export default function HomeworkSection({ groupId }) {
  const [selectedTask, setSelectedTask] = useState(null);
  const [codeInput, setCodeInput] = useState('');
  const [textInput, setTextInput] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);

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

  const tasks = [
    {
      id: '1',
      title: 'Variable Declaration',
      description: 'Practice declaring variables using let and const. Create a variable for storing your name and another for your age. Show understanding of when to use let vs const.',
      type: 'code',
      points: '10 points',
      difficulty: 'Easy',
      correctAnswer: 'let',
      explanation: 'Variables should be declared with let for mutable values and const for immutable values.'
    },
    {
      id: '2', 
      title: 'Function Creation',
      description: 'Write a function called "calculateSum" that takes two parameters (a and b) and returns their sum. Then create an arrow function version called "addNumbers" that does the same thing.',
      type: 'code',
      points: '15 points',
      difficulty: 'Medium',
      correctAnswer: 'function',
      explanation: 'Functions can be declared using function keyword or arrow syntax for shorter expressions.'
    },
    {
      id: '3',
      title: 'Array Methods',
      description: 'Explain the difference between map(), filter(), and reduce() methods in JavaScript. Provide a simple example for each method showing how they work with an array of numbers.',
      type: 'text',
      points: '12 points',
      difficulty: 'Medium',
      correctAnswer: 'map',
      explanation: 'Understanding array methods is crucial for functional programming in JavaScript.'
    },
    {
      id: '4',
      title: 'Conditional Statements',
      description: 'Write a function that checks if a number is positive, negative, or zero. Use if-else statements and return appropriate messages for each case.',
      type: 'code',
      points: '8 points',
      difficulty: 'Easy',
      correctAnswer: 'if',
      explanation: 'Conditional statements help control program flow based on different conditions.'
    },
    {
      id: '5',
      title: 'Loops Practice',
      description: 'Create a for loop that prints numbers from 1 to 10. Then create a while loop that does the same thing. Show the difference between these two loop types.',
      type: 'code',
      points: '10 points',
      difficulty: 'Easy',
      correctAnswer: 'for',
      explanation: 'Loops allow you to repeat code execution multiple times with different conditions.'
    },
    {
      id: '6',
      title: 'Object Creation',
      description: 'Create a JavaScript object representing a student with properties: name, age, grade, and subjects (array). Then write a method to display the student information.',
      type: 'code',
      points: '18 points',
      difficulty: 'Medium',
      correctAnswer: 'object',
      explanation: 'Objects in JavaScript store data in key-value pairs and can contain methods.'
    },
    {
      id: '7',
      title: 'String Methods',
      description: 'Demonstrate the use of at least 5 different string methods in JavaScript. Explain what each method does and provide examples with different strings.',
      type: 'text',
      points: '14 points',
      difficulty: 'Medium',
      correctAnswer: 'string',
      explanation: 'String methods help manipulate and work with text data in various ways.'
    },
    {
      id: '8',
      title: 'Error Handling',
      description: 'Write a function that uses try-catch blocks to handle potential errors. Create a scenario where an error might occur and show how to handle it gracefully.',
      type: 'code',
      points: '16 points',
      difficulty: 'Hard',
      correctAnswer: 'try',
      explanation: 'Error handling prevents your program from crashing and provides better user experience.'
    },
    {
      id: '9',
      title: 'DOM Manipulation',
      description: 'Explain how to select elements from the DOM using different methods. Describe how to change text content, add/remove classes, and handle events.',
      type: 'text',
      points: '20 points',
      difficulty: 'Hard',
      correctAnswer: 'dom',
      explanation: 'DOM manipulation allows JavaScript to interact with HTML elements dynamically.'
    },
    {
      id: '10',
      title: 'Async Programming',
      description: 'Create a simple async function that simulates fetching data with setTimeout. Show how to use async/await and explain the difference from Promises.',
      type: 'code',
      points: '22 points',
      difficulty: 'Hard',
      correctAnswer: 'async',
      explanation: 'Async programming allows handling time-consuming operations without blocking code execution.'
    }
  ];

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

  return (
    <>
      <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-lg border`}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Today's Lesson</h3>
            <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>JavaScript Basics</span>
          </div>

          <div className="mb-6">
            <h4 className={`text-lg font-medium mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Introduction to JavaScript Programming</h4>
            <ul className={`space-y-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Understanding variable declaration and data types in JavaScript
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Learning function creation and different syntax approaches
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Working with arrays, objects, and their built-in methods
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Implementing control flow with loops and conditional statements
              </li>
            </ul>
          </div>

          <div className={`border-t pt-6 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <h4 className={`text-lg font-medium mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Homework Tasks ({tasks.length} Tasks)</h4>
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
                        placeholder="// Write your JavaScript code here...
// Example:
// let name = 'Your Name';
// const age = 25;"
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
}
