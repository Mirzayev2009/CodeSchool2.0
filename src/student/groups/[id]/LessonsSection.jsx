

import { useState } from 'react';



export default function LessonsSection({ groupId }) {
const [selectedLesson, setSelectedLesson] = useState(null);
  const [showLessonModal, setShowLessonModal] = useState(false);

  const lessons = [
    {
      id: '1',
      title: 'Introduction to JavaScript',
      date: '2024-01-15',
      duration: '90 minutes',
      status: 'completed',
      materials: ['Lecture Slides', 'Code Examples', 'Practice Exercises'],
      description: 'Overview of JavaScript history, syntax basics, and setting up development environment.',
      topics: ['Variables and Data Types', 'Basic Operators', 'Console Output', 'Development Tools'],
      videoUrl: 'https://example.com/lesson1',
      resources: [
        { name: 'JavaScript Basics.pdf', type: 'pdf' },
        { name: 'Setup Guide.md', type: 'markdown' },
        { name: 'Examples.zip', type: 'archive' }
      ]
    },
    {
      id: '2',
      title: 'Variables and Data Types',
      date: '2024-01-17',
      duration: '90 minutes',
      status: 'completed',
      materials: ['Interactive Demo', 'Coding Exercises', 'Quiz'],
      description: 'Deep dive into JavaScript variables, primitive data types, and type conversion.',
      topics: ['var, let, const', 'Primitive Types', 'Type Conversion', 'Scope Rules'],
      videoUrl: 'https://example.com/lesson2',
      resources: [
        { name: 'Variables Guide.pdf', type: 'pdf' },
        { name: 'Practice Problems.js', type: 'javascript' }
      ]
    },
    {
      id: '3',
      title: 'Functions and Scope',
      date: '2024-01-19',
      duration: '90 minutes',
      status: 'available',
      materials: ['Video Recording', 'Function Examples', 'Homework'],
      description: 'Understanding function declarations, expressions, and scope in JavaScript.',
      topics: ['Function Declarations', 'Arrow Functions', 'Local vs Global Scope', 'Hoisting'],
      videoUrl: 'https://example.com/lesson3',
      resources: [
        { name: 'Functions Deep Dive.pdf', type: 'pdf' },
        { name: 'Scope Examples.js', type: 'javascript' }
      ]
    },
    {
      id: '4',
      title: 'Arrays and Objects',
      date: '2024-01-22',
      duration: '90 minutes',
      status: 'upcoming',
      materials: ['Lecture Slides', 'Live Coding', 'Group Exercise'],
      description: 'Working with arrays and objects, including methods and properties.',
      topics: ['Array Methods', 'Object Properties', 'Destructuring', 'Spread Operator'],
      videoUrl: null,
      resources: []
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'available': return 'bg-blue-100 text-blue-800';
      case 'upcoming': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return 'ri-check-circle-line';
      case 'available': return 'ri-play-circle-line';
      case 'upcoming': return 'ri-time-line';
      default: return 'ri-calendar-line';
    }
  };

  const handleViewLesson = (lesson) => {
    setSelectedLesson(lesson);
    setShowLessonModal(true);
  };

  const getResourceIcon = (type) => {
    switch (type) {
      case 'pdf': return 'ri-file-pdf-line';
      case 'javascript': return 'ri-code-line';
      case 'markdown': return 'ri-markdown-line';
      case 'archive': return 'ri-file-zip-line';
      default: return 'ri-file-line';
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-lg border border-gray-200">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Lesson Materials</h3>
            <span className="text-sm text-gray-500">{lessons.length} lessons</span>
          </div>

          <div className="space-y-4">
            {lessons.map((lesson) => (
              <div key={lesson.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="flex-shrink-0 mt-1">
                      <i className={`${getStatusIcon(lesson.status)} w-5 h-5 flex items-center justify-center text-gray-500`}></i>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="text-lg font-medium text-gray-900">{lesson.title}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(lesson.status)}`}>
                          {lesson.status.charAt(0).toUpperCase() + lesson.status.slice(1)}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3">{lesson.description}</p>
                      
                      <div className="flex items-center space-x-6 text-sm text-gray-500 mb-3">
                        <div className="flex items-center">
                          <i className="ri-calendar-line w-4 h-4 flex items-center justify-center mr-2"></i>
                          <span>{new Date(lesson.date).toLocaleDateString()}</span>
                        </div>
                        
                        <div className="flex items-center">
                          <i className="ri-time-line w-4 h-4 flex items-center justify-center mr-2"></i>
                          <span>{lesson.duration}</span>
                        </div>
                        
                        <div className="flex items-center">
                          <i className="ri-book-line w-4 h-4 flex items-center justify-center mr-2"></i>
                          <span>{lesson.materials.length} materials</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {lesson.topics.map((topic, index) => (
                          <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md">
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    {lesson.status === 'completed' || lesson.status === 'available' ? (
                      <button 
                        onClick={() => handleViewLesson(lesson)}
                        className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors whitespace-nowrap"
                      >
                        Review Lesson
                      </button>
                    ) : (
                      <button 
                        disabled
                        className="px-4 py-2 text-sm bg-gray-300 text-gray-500 rounded-md cursor-not-allowed whitespace-nowrap"
                      >
                        Not Available
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showLessonModal && selectedLesson && (
        <div className="fixed inset-0 bg-black bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-3xl w-mx-4 max-h-96 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900">{selectedLesson.title}</h3>
              <button 
                onClick={() => setShowLessonModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <i className="ri-close-line w-6 h-6 flex items-center justify-center"></i>
              </button>
            </div>
            
            <div className="mb-4">
              <p className="text-gray-600 mb-4">{selectedLesson.description}</p>
              
              <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Date:</span>
                  <span className="ml-2 text-gray-600">{new Date(selectedLesson.date).toLocaleDateString()}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Duration:</span>
                  <span className="ml-2 text-gray-600">{selectedLesson.duration}</span>
                </div>
              </div>
              
              <div className="mb-4">
                <h4 className="font-medium text-gray-700 mb-2">Topics Covered:</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedLesson.topics.map((topic, index) => (
                    <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-md">
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
              
              {selectedLesson.resources.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-medium text-gray-700 mb-2">Resources:</h4>
                  <div className="space-y-2">
                  {selectedLesson.topics.map((topic, index) => (

                      <div key={index} className="flex items-center p-2 border border-gray-200 rounded-md hover:bg-gray-50">
                        <i className={`${getResourceIcon(resource.type)} w-5 h-5 flex items-center justify-center mr-3 text-gray-500`}></i>
                        <span className="text-sm text-gray-700">{resource.name}</span>
                        <button className="ml-auto text-blue-600 hover:text-blue-800 text-sm">
                          Download
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {selectedLesson.videoUrl && (
                <div className="mb-4">
                  <button className="w-full py-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors whitespace-nowrap">
                    <i className="ri-play-line w-5 h-5 flex items-center justify-center mr-2 inline-block"></i>
                    Watch Lesson Recording
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}