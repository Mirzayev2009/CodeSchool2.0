


import { useState, useEffect } from 'react';
import { getHomeworkTasks } from '../../homeworkApi';

export default function AssignmentModal({ assignment, onClose, isDarkMode }) {
  const [homeworkTasks, setHomeworkTasks] = useState([]);
  const [currentTask, setCurrentTask] = useState(1);
  const token = localStorage.getItem('token')


useEffect(() => {
  async function fetchTasks() {
    try {
      const data = await getHomeworkTasks(assignment.id, token);

      // if backend returns paginated results
      if (Array.isArray(data)) {
        setHomeworkTasks(data);
      } else if (Array.isArray(data.results)) {
        setHomeworkTasks(data.results);
      } else {
        setHomeworkTasks([]); // fallback
      }
    } catch (error) {
      console.error('Failed to fetch homework tasks:', error);
      setHomeworkTasks([]);
    }
  }
  fetchTasks();
}, [assignment.id, token]);

  

  // const homeworkTasks = [
  //   {
  //     id: 1,
  //     title: 'Variable Declaration',
  //     description: 'Create variables using let, const, and var',
  //     status: 'completed',
  //     explanation: 'Variables are containers that store data values. In JavaScript, you can declare variables using let, const, or var keywords.',
  //     code: 'let name = "John";\nconst age = 25;\nvar city = "New York";'
  //   },
  //   {
  //     id: 2,
  //     title: 'Data Types',
  //     description: 'Work with different JavaScript data types',
  //     status: 'completed',
  //     explanation: 'JavaScript has several data types including strings, numbers, booleans, objects, and arrays.',
  //     code: 'let str = "Hello";\nlet num = 42;\nlet bool = true;\nlet arr = [1, 2, 3];'
  //   },
  //   {
  //     id: 3,
  //     title: 'Type Conversion',
  //     description: 'Convert between different data types',
  //     status: 'in_progress',
  //     explanation: 'Type conversion allows you to change one data type to another. This can be done explicitly or implicitly.',
  //     code: '// Write your code here\nlet str = "123";\n// Convert str to number\nlet num = ;\n\nconsole.log(typeof num);'
  //   },
  //   {
  //     id: 4,
  //     title: 'Variable Scope',
  //     description: 'Understand local and global scope',
  //     status: 'pending',
  //     explanation: 'Scope determines where variables can be accessed in your code. Global scope is accessible everywhere, local scope is limited.',
  //     code: '// Complete the function\nfunction scopeExample() {\n  // Add local variable here\n  \n  return localVar;\n}'
  //   },
  //   {
  //     id: 5,
  //     title: 'Hoisting',
  //     description: 'Learn about variable hoisting behavior',
  //     status: 'pending',
  //     explanation: 'Hoisting is JavaScript\'s behavior of moving declarations to the top of their scope.',
  //     code: '// Fix the hoisting issue\nconsole.log(myVar);\n// Add your variable declaration here'
  //   },
  //   {
  //     id: 6,
  //     title: 'Template Literals',
  //     description: 'Use template literals for string formatting',
  //     status: 'pending',
  //     explanation: 'Template literals allow for easier string formatting and multi-line strings using backticks.',
  //     code: '// Create a template literal\nlet name = "Alice";\nlet age = 30;\n// Create greeting using template literal'
  //   },
  //   {
  //     id: 7,
  //     title: 'Destructuring',
  //     description: 'Extract values from arrays and objects',
  //     status: 'pending',
  //     explanation: 'Destructuring allows you to extract values from arrays or properties from objects into variables.',
  //     code: '// Destructure this array\nlet colors = ["red", "green", "blue"];\n// Extract first two colors'
  //   },
  //   {
  //     id: 8,
  //     title: 'Default Parameters',
  //     description: 'Set default values for function parameters',
  //     status: 'pending',
  //     explanation: 'Default parameters allow you to set default values for function parameters when no argument is provided.',
  //     code: '// Add default parameters\nfunction greet(name, greeting) {\n  return `${greeting}, ${name}!`;\n}'
  //   },
  //   {
  //     id: 9,
  //     title: 'Arrow Functions',
  //     description: 'Convert regular functions to arrow functions',
  //     status: 'pending',
  //     explanation: 'Arrow functions provide a shorter syntax for writing functions and have different behavior with "this".',
  //     code: '// Convert to arrow function\nfunction add(a, b) {\n  return a + b;\n}'
  //   },
  //   {
  //     id: 10,
  //     title: 'Final Challenge',
  //     description: 'Combine all concepts in a complete program',
  //     status: 'pending',
  //     explanation: 'Create a program that uses variables, data types, functions, and all the concepts you\'ve learned.',
  //     code: '// Create a student information system\n// Include: name, age, grades array, average calculation'
  //   }
  // ];

  const currentTaskData = homeworkTasks.find(task => task.id === currentTask) || null;

if (!currentTaskData) {
  return <div className="p-6 text-center">Loading tasks...</div>;
}


  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50';
      case 'in_progress': return 'text-blue-600 bg-blue-50';
      case 'pending': return 'text-gray-600 bg-gray-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return 'ri-check-circle-line';
      case 'in_progress': return 'ri-play-circle-line';
      case 'pending': return 'ri-time-line';
      default: return 'ri-circle-line';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-2xl w-full max-w-7xl h-[90vh] flex flex-col`}>
        {/* Header */}
        <div className={`p-6 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {assignment.title}
              </h2>
              <p className={`mt-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {assignment.description}
              </p>
            </div>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-colors ${
                isDarkMode 
                  ? 'hover:bg-gray-700 text-gray-400 hover:text-gray-300' 
                  : 'hover:bg-gray-100 text-gray-400 hover:text-gray-600'
              }`}
            >
              <i className="ri-close-line w-6 h-6 flex items-center justify-center"></i>
            </button>
          </div>
        </div>

        <div className="flex-1 flex min-h-0">
          {/* Homework List Sidebar */}
          <div className={`w-80 ${isDarkMode ? 'bg-gray-750 border-gray-700' : 'bg-gray-50 border-gray-200'} border-r overflow-y-auto`}>
            <div className="p-4">
              <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Homework Tasks ({homeworkTasks.length})
              </h3>
              
              <div className="space-y-2">
                {homeworkTasks.map((task) => (
                  <button
                    key={task.id}
                    onClick={() => setCurrentTask(task.id)}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                      currentTask === task.id
                        ? isDarkMode
                          ? 'bg-blue-900 border-blue-700 text-blue-300'
                          : 'bg-blue-50 border-blue-200 text-blue-700'
                        : isDarkMode
                        ? 'bg-gray-700 border-gray-600 hover:bg-gray-650 text-gray-300'
                        : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">Task {task.id}</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(task.status)}`}>
                        <i className={`${getStatusIcon(task.status)} w-3 h-3 flex items-center justify-center`}></i>
                      </span>
                    </div>
                    <h4 className="font-semibold text-sm mb-1">{task.title}</h4>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {task.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 flex">
            {/* Left: Explanation */}
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="max-w-2xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Task {currentTaskData.id}: {currentTaskData.title}
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(currentTaskData.status)}`}>
                    {currentTaskData.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>

                <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-6 mb-6`}>
                  <h4 className={`text-lg font-medium mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Explanation
                  </h4>
                  <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {currentTaskData.explanation}
                  </p>
                </div>

                {/* Example/Instructions */}
                <div className={`${isDarkMode ? 'bg-blue-900' : 'bg-blue-50'} rounded-lg p-6`}>
                  <h4 className={`text-lg font-medium mb-3 ${isDarkMode ? 'text-blue-300' : 'text-blue-900'}`}>
                    Instructions
                  </h4>
                  <p className={`text-sm ${isDarkMode ? 'text-blue-200' : 'text-blue-800'}`}>
                    {currentTaskData.description}
                  </p>
                  
                  {currentTaskData.status === 'completed' && (
                    <div className="mt-4 p-3 bg-green-100 rounded-lg">
                      <div className="flex items-center text-green-800">
                        <i className="ri-check-circle-line w-4 h-4 flex items-center justify-center mr-2"></i>
                        <span className="text-sm font-medium">Task Completed!</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Code Editor */}
            <div className={`w-1/2 ${isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'} border-l flex flex-col`}>
              <div className={`p-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex items-center justify-between">
                  <h4 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Code Editor
                  </h4>
                  <div className="flex items-center space-x-2">
                    <button className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors whitespace-nowrap">
                      <i className="ri-play-line w-4 h-4 flex items-center justify-center mr-1 inline-flex"></i>
                      Run
                    </button>
                    <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors whitespace-nowrap">
                      <i className="ri-save-line w-4 h-4 flex items-center justify-center mr-1 inline-flex"></i>
                      Save
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex-1 p-4">
                <textarea
                  className={`w-full h-full p-4 font-mono text-sm border-none resize-none focus:outline-none ${
                    isDarkMode 
                      ? 'bg-gray-800 text-gray-100 placeholder-gray-400' 
                      : 'bg-white text-gray-900 placeholder-gray-500'
                  }`}
                  placeholder="// Write your JavaScript code here..."
                  defaultValue={currentTaskData.code}
                  style={{ fontFamily: 'Monaco, Consolas, "Courier New", monospace' }}
                />
              </div>

              {/* Output Console */}
              <div className={`h-32 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-100 border-gray-200'} border-t`}>
                <div className="p-3">
                  <h5 className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Console Output:
                  </h5>
                  <div className={`text-xs font-mono ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                    {'>'} Ready to run your code...
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={`p-4 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm">
              <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                Progress: {homeworkTasks.filter(t => t.status === 'completed').length} / {homeworkTasks.length} tasks
              </span>
              <div className={`w-48 h-2 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full overflow-hidden`}>
                <div 
                  className="h-full bg-blue-600 transition-all duration-300"
                  style={{ 
                    width: `${(homeworkTasks.filter(t => t.status === 'completed').length / homeworkTasks.length) * 100}%` 
                  }}
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setCurrentTask(Math.max(1, currentTask - 1))}
                disabled={currentTask === 1}
                className={`px-4 py-2 text-sm rounded-lg transition-colors whitespace-nowrap ${
                  currentTask === 1
                    ? isDarkMode ? 'bg-gray-700 text-gray-500' : 'bg-gray-100 text-gray-400'
                    : isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <i className="ri-arrow-left-line w-4 h-4 flex items-center justify-center mr-1 inline-flex"></i>
                Previous
              </button>
              
              <button
                onClick={() => setCurrentTask(Math.min(homeworkTasks.length, currentTask + 1))}
                disabled={currentTask === homeworkTasks.length}
                className={`px-4 py-2 text-sm rounded-lg transition-colors whitespace-nowrap ${
                  currentTask === homeworkTasks.length
                    ? isDarkMode ? 'bg-gray-700 text-gray-500' : 'bg-gray-100 text-gray-400'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                Next
                <i className="ri-arrow-right-line w-4 h-4 flex items-center justify-center ml-1 inline-flex"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
