
'use client';

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';


export default function HomeworkDetailClient({ assignmentId, homeworkId }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [code, setCode] = useState('// Write your solution here\nfunction solve() {\n  \n}');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [currentTask, setCurrentTask] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);

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

  // Mock homework data
  const homework = {
    id: parseInt(homeworkId),
    title: 'Variables and Data Types',
    description: 'Learn JavaScript fundamentals',
    totalTasks: 10,
    tasks: [
      {
        id: 1,
        title: 'Create Variables',
        explanation: `In JavaScript, variables are containers for storing data values. You can create variables using <span class="font-black text-black">let</span>, <span class="font-black text-black">const</span>, or <span class="font-black text-black">var</span> keywords.

**Using <span class="font-black text-black">let</span>:**
<span class="font-black text-black">let</span> allows you to declare variables that can be reassigned later.

Example:
\`\`\`javascript
let age = 25;
let name = "John";
age = 26; // This is allowed
\`\`\`

**Using <span class="font-black text-black">const</span>:**
<span class="font-black text-black">const</span> is used for variables that won't change their value.

Example:
\`\`\`javascript
const PI = 3.14159;
const greeting = "Hello World";
// PI = 3.14; // This would cause an error
\`\`\`

**Using <span class="font-black text-black">var</span>:**
<span class="font-black text-black">var</span> is the older way to declare variables (not recommended in modern JavaScript).

Example:
\`\`\`javascript
var oldStyle = "This is old syntax";
\`\`\`

**Your Task:**
Create three variables:
1. A <span class="font-black text-black">let</span> variable called 'userName' with your name
2. A <span class="font-black text-black">const</span> variable called 'birthYear' with your birth year  
3. A <span class="font-black text-black">var</span> variable called 'city' with your city name

Then console.log all three variables.`,
        expectedOutput: 'Variables created successfully',
        starterCode: '// Create your variables here\n// Remember to use let, const, and var\n\n// Your code goes here'
      },
      {
        id: 2,
        title: 'Data Types',
        explanation: `JavaScript has several data types. The main primitive data types are:

**String:** Text data enclosed in quotes
\`\`\`javascript
let message = "Hello World";
let name = 'John Doe';
\`\`\`

**Number:** Numeric values (integers and decimals)
\`\`\`javascript
let age = 25;
let price = 19.99;
\`\`\`

**Boolean:** True or false values
\`\`\`javascript
let isStudent = true;
let isWorking = false;
\`\`\`

**Undefined:** Variables declared but not assigned
\`\`\`javascript
let someVariable;
console.log(someVariable); // undefined
\`\`\`

**Null:** Intentionally empty value
\`\`\`javascript
let emptyValue = null;
\`\`\`

**Your Task:**
Create variables of different data types and use typeof to check their types.`,
        expectedOutput: 'Data types demonstrated',
        starterCode: '// Create variables of different data types\n// Use typeof to check their types\n\n// Your code goes here'
      }
      // Add more tasks as needed
    ]
  };

  const currentTaskData = homework.tasks[currentTask - 1] || homework.tasks[0];

  const runCode = () => {
    setIsRunning(true);
    
    setTimeout(() => {
      try {
        // Simulate code execution
        const result = eval(code);
        setOutput(currentTaskData.expectedOutput);
        setIsCompleted(true);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      } catch (error) {
        setOutput(`Error: ${error.message}`);
        setIsCompleted(false);
      }
      setIsRunning(false);
    }, 1000);
  };

  const submitHomework = () => {
    console.log('Submitting homework:', { assignmentId, homeworkId, currentTask, code });
    // Add submission logic here
  };

  const goToNextTask = () => {
    if (currentTask < homework.totalTasks) {
      setCurrentTask(prev => prev + 1);
      setCode(homework.tasks[currentTask]?.starterCode || '// Write your solution here');
      setOutput('');
      setIsCompleted(false);
      setShowSuccess(false);
    }
  };

  const goToPrevTask = () => {
    if (currentTask > 1) {
      setCurrentTask(prev => prev - 1);
      setCode(homework.tasks[currentTask - 2]?.starterCode || '// Write your solution here');
      setOutput('');
      setIsCompleted(false);
      setShowSuccess(false);
    }
  };

  const formatExplanation = (text) => {
    // Convert **bold** to <strong> and handle code blocks
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm">$1</code>')
      .replace(/```javascript\n([\s\S]*?)\n```/g, '<pre class="bg-gray-100 p-3 rounded-lg mt-2 mb-2 text-sm overflow-x-auto"><code>$1</code></pre>');
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b`}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                to={`/student/assignments/${assignmentId}/homeworks`}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg transition-colors ${
                  isDarkMode 
                    ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700' 
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                }`}
              >
                <i className="ri-arrow-left-line w-4 h-4 flex items-center justify-center"></i>
                <span>Back to Homeworks</span>
              </Link>
              
              <div className={`h-6 w-px ${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'}`}></div>
              
              <div>
                <h1 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {homework.title}
                </h1>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Task {currentTask} of {homework.totalTasks}
                </p>
              </div>
            </div>
            
            {/* Task Navigation */}
            <div className="flex items-center space-x-2">
              <button
                onClick={goToPrevTask}
                disabled={currentTask === 1}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors whitespace-nowrap ${
                  currentTask === 1
                    ? isDarkMode 
                      ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : isDarkMode
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <i className="ri-arrow-left-line w-4 h-4 flex items-center justify-center mr-1 inline-flex"></i>
                Previous
              </button>
              
              <span className={`px-3 py-1.5 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {currentTask} / {homework.totalTasks}
              </span>
              
              <button
                onClick={goToNextTask}
                disabled={!isCompleted || currentTask === homework.totalTasks}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors whitespace-nowrap ${
                  !isCompleted || currentTask === homework.totalTasks
                    ? isDarkMode 
                      ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
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

      {/* Success Notification */}
      {showSuccess && (
        <div className="fixed top-4 right-4 z-50">
          <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2">
            <i className="ri-check-line w-5 h-5 flex items-center justify-center"></i>
            <span>Task completed successfully!</span>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex h-[calc(100vh-73px)]">
        {/* Left Panel - Explanation */}
        <div className={`w-1/2 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} border-r ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} overflow-y-auto`}>
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {currentTaskData.title}
              </h2>
              
              {isCompleted && (
                <div className="flex items-center space-x-1 text-green-600">
                  <i className="ri-check-circle-fill w-5 h-5 flex items-center justify-center"></i>
                  <span className="text-sm font-medium">Completed</span>
                </div>
              )}
            </div>
            
            <div 
              className={`prose max-w-none ${isDarkMode ? 'prose-invert' : ''} text-sm leading-relaxed`}
              dangerouslySetInnerHTML={{ 
                __html: formatExplanation(currentTaskData.explanation) 
              }}
            />
            
            {/* Task Progress */}
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Progress
                </span>
                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {Math.round((currentTask / homework.totalTasks) * 100)}%
                </span>
              </div>
              <div className={`w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2`}>
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(currentTask / homework.totalTasks) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Code Editor */}
        <div className={`w-1/2 flex flex-col ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
          {/* Editor Header */}
          <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b px-4 py-3`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <i className="ri-code-line w-5 h-5 flex items-center justify-center text-blue-600"></i>
                <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Code Editor
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={runCode}
                  disabled={isRunning}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                    isRunning
                      ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  {isRunning ? (
                    <>
                      <i className="ri-loader-4-line w-4 h-4 flex items-center justify-center mr-1 inline-flex animate-spin"></i>
                      Running
                    </>
                  ) : (
                    <>
                      <i className="ri-play-line w-4 h-4 flex items-center justify-center mr-1 inline-flex"></i>
                      Run Code
                    </>
                  )}
                </button>
                
                {currentTask === homework.totalTasks && (
                  <button
                    onClick={submitHomework}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors whitespace-nowrap"
                  >
                    <i className="ri-send-plane-line w-4 h-4 flex items-center justify-center mr-1 inline-flex"></i>
                    Submit All
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Code Editor */}
          <div className="flex-1 p-4">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className={`w-full h-64 p-4 rounded-lg border text-sm font-mono resize-none ${
                isDarkMode 
                  ? 'bg-gray-800 border-gray-600 text-gray-100' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
              placeholder="Write your code here..."
              spellCheck={false}
            />
          </div>

          {/* Console Output */}
          <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-t`}>
            <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-2">
                <i className="ri-terminal-line w-4 h-4 flex items-center justify-center text-gray-500"></i>
                <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Console Output
                </span>
              </div>
            </div>
            
            <div className="p-4 h-32 overflow-y-auto">
              {output ? (
                <div className={`text-sm font-mono ${
                  output.includes('Error') 
                    ? 'text-red-600' 
                    : isCompleted 
                      ? 'text-green-600' 
                      : isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  {output}
                </div>
              ) : (
                <div className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  Click "Run Code" to see the output...
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
