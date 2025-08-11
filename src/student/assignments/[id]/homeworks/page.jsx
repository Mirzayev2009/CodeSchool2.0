import { useParams } from 'react-router-dom';
import StudentHeader from '../../../../../components/StudentHeader';
import HomeworkListClient from './HomeworkListClient';

export default function AssignmentHomeworksPage() {
  const { id } = useParams();

  const assignmentData = {
    '1': {
      title: 'JavaScript Variables & Data Types',
      subject: 'JavaScript Fundamentals',
      teacher: 'Dr. Wilson',
      dueDate: '2024-12-25',
      description: 'Learn the basics of JavaScript variables, data types, and their usage in programming.',
      difficulty: 'Easy',
      points: 100
    },
    '2': {
      title: 'React Components & Props',
      subject: 'React Development',
      teacher: 'Prof. Johnson',
      dueDate: '2024-12-28',
      description: 'Build interactive React components and understand how to pass data using props.',
      difficulty: 'Medium',
      points: 150
    }
  };

  const assignment = assignmentData[id] || assignmentData['1'];

  const homeworks = [
    {
      id: 1,
      title: 'Variable Declaration',
      description: 'Learn how to declare variables using let, const, and var',
      status: 'completed',
      difficulty: 'Easy',
      points: 10,
      type: 'code'
    },
    {
      id: 2,
      title: 'Data Types Understanding',
      description: 'Explore different JavaScript data types including strings, numbers, and booleans',
      status: 'completed',
      difficulty: 'Easy',
      points: 10,
      type: 'code'
    },
    {
      id: 3,
      title: 'Type Conversion',
      description: 'Master explicit and implicit type conversion in JavaScript',
      status: 'in_progress',
      difficulty: 'Medium',
      points: 15,
      type: 'code'
    },
    {
      id: 4,
      title: 'Variable Scope',
      description: 'Understand global, function, and block scope concepts',
      status: 'pending',
      difficulty: 'Medium',
      points: 15,
      type: 'theory'
    },
    {
      id: 5,
      title: 'Hoisting Behavior',
      description: 'Learn about variable and function hoisting in JavaScript',
      status: 'pending',
      difficulty: 'Hard',
      points: 20,
      type: 'code'
    },
    {
      id: 6,
      title: 'Template Literals',
      description: 'Use template literals for string formatting and multi-line strings',
      status: 'pending',
      difficulty: 'Easy',
      points: 10,
      type: 'code'
    },
    {
      id: 7,
      title: 'Destructuring Assignment',
      description: 'Extract values from arrays and objects using destructuring',
      status: 'pending',
      difficulty: 'Medium',
      points: 15,
      type: 'code'
    },
    {
      id: 8,
      title: 'Default Parameters',
      description: 'Implement functions with default parameter values',
      status: 'pending',
      difficulty: 'Easy',
      points: 10,
      type: 'code'
    },
    {
      id: 9,
      title: 'Spread Operator',
      description: 'Use the spread operator for arrays and objects',
      status: 'pending',
      difficulty: 'Medium',
      points: 15,
      type: 'code'
    },
    {
      id: 10,
      title: 'Final Project',
      description: 'Build a complete application using all learned concepts',
      status: 'pending',
      difficulty: 'Hard',
      points: 25,
      type: 'project'
    }
  ];

  return (
    <div>
      <StudentHeader />
      <HomeworkListClient 
        assignment={assignment}
        homeworks={homeworks}
        assignmentId={id}
      />
    </div>
  );
}
