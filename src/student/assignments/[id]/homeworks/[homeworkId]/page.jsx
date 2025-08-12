
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';

import StudentHeader from '../../../../../../components/StudentHeader';
import HomeworkDetailClient from './HomeworkDetailClient';

export default function HomeworkDetailPage() {
  const { id, homeworkId } = useParams(); // ✅ Get from URL
  // Mock homework data
  const homeworkData = {
    '1': {
      title: 'Variable Declaration',
      description: 'Learn how to declare variables using let, const, and var keywords in JavaScript.',
      explanation: `In JavaScript, you can declare variables using three keywords: let, const, and var.

**let** - Creates a block-scoped variable that can be reassigned:
- Use for variables that will change value
- Block-scoped (only accessible within the block where defined)
- Cannot be redeclared in the same scope

**const** - Creates a block-scoped constant that cannot be reassigned:
- Use for values that won't change
- Must be initialized when declared
- Block-scoped like let

**var** - Creates a function-scoped variable (older way):
- Function-scoped or globally scoped
- Can be redeclared and updated
- Hoisted to the top of its scope

**Best Practices:**
- Use const by default
- Use let when you need to reassign the variable
- Avoid var in modern JavaScript`,
      initialCode: `// Declare variables using let, const, and var
// Complete the code below:

// 1. Create a constant for your name
const name = ;

// 2. Create a variable for your age that can change
let age = ;

// 3. Create a variable using var (for learning purposes)
var city = ;

// 4. Log all variables to console
console.log();`,
      difficulty: 'Easy',
      points: 10,
      type: 'code'
    },
    '2': {
      title: 'Data Types Understanding',
      description: 'Explore different JavaScript data types including strings, numbers, booleans, and arrays.',
      explanation: `JavaScript has several built-in data types:

**Primitive Types:**
- **String**: Text data enclosed in quotes
- **Number**: Integers and floating-point numbers
- **Boolean**: true or false values
- **undefined**: Variable declared but not assigned
- **null**: Intentional absence of value

**Non-Primitive Types:**
- **Object**: Collection of key-value pairs
- **Array**: Ordered list of values
- **Function**: Reusable blocks of code

**Type Checking:**
Use the typeof operator to check data types:
typeof "hello" // "string"
typeof 42 // "number"
typeof true // "boolean"

**Examples:**
let message = "Hello World"; // string
let count = 25; // number  
let isActive = true; // boolean
let items = [1, 2, 3]; // array (object)`,
      initialCode: `// Create variables with different data types
// Complete the assignments below:

// String variable
let firstName = ;

// Number variable
let score = ;

// Boolean variable
let isStudent = ;

// Array variable
let hobbies = ;

// Object variable
let person = {
  name: ,
  age: 
};

// Log the type of each variable
console.log(typeof firstName);
console.log(typeof score);
console.log(typeof isStudent);
console.log(typeof hobbies);
console.log(typeof person);`,
      difficulty: 'Easy',
      points: 10,
      type: 'code'
    },
    '3': {
      title: 'Type Conversion',
      description: 'Master explicit and implicit type conversion in JavaScript.',
      explanation: `Type conversion in JavaScript happens in two ways:

**Implicit Conversion (Coercion):**
JavaScript automatically converts types when needed:
- "5" + 3 = "53" (number to string)
- "5" - 3 = 2 (string to number)
- true + 1 = 2 (boolean to number)

**Explicit Conversion:**
You manually convert types using functions:

**To String:**
- String(123) → "123"
- (123).toString() → "123"

**To Number:**
- Number("123") → 123
- parseInt("123") → 123
- parseFloat("123.45") → 123.45

**To Boolean:**
- Boolean(1) → true
- Boolean(0) → false
- Boolean("") → false
- Boolean("hello") → true

**Falsy Values:** false, 0, "", null, undefined, NaN
**Truthy Values:** Everything else`,
      initialCode: `// Practice type conversion
// Complete the conversions below:

// Convert string to number
let stringNumber = "42";
let actualNumber = ;

// Convert number to string  
let num = 123;
let numAsString = ;

// Convert to boolean
let emptyString = "";
let nonEmptyString = "hello";
let boolFromEmpty = ;
let boolFromNonEmpty = ;

// Demonstrate implicit conversion
let result1 = "10" + 5; // What will this be?
let result2 = "10" - 5; // What will this be?

console.log("Explicit conversions:");
console.log(actualNumber, typeof actualNumber);
console.log(numAsString, typeof numAsString);
console.log(boolFromEmpty, boolFromNonEmpty);

console.log("Implicit conversions:");
console.log(result1, result2);`,
      difficulty: 'Medium',
      points: 15,
      type: 'code'
    }
  };

  const homework = homeworkData[homeworkId] || homeworkData['1'];

  return (
    <div>
      <StudentHeader />
      <HomeworkDetailClient 
        homework={homework}
        assignmentId={id}
        homeworkId={homeworkId}
      />
    </div>
  );
}

export async function generateStaticParams() {
  return [
    // Assignment 1 homeworks
    { id: '1', homeworkId: '1' },
    { id: '1', homeworkId: '2' },
    { id: '1', homeworkId: '3' },
    { id: '1', homeworkId: '4' },
    { id: '1', homeworkId: '5' },
    { id: '1', homeworkId: '6' },
    { id: '1', homeworkId: '7' },
    { id: '1', homeworkId: '8' },
    { id: '1', homeworkId: '9' },
    { id: '1', homeworkId: '10' },
    // Assignment 2 homeworks
    { id: '2', homeworkId: '1' },
    { id: '2', homeworkId: '2' },
    { id: '2', homeworkId: '3' },
    { id: '2', homeworkId: '4' },
    { id: '2', homeworkId: '5' },
    { id: '2', homeworkId: '6' },
    { id: '2', homeworkId: '7' },
    { id: '2', homeworkId: '8' },
    { id: '2', homeworkId: '9' },
    { id: '2', homeworkId: '10' },
    // Assignment 3 homeworks
    { id: '3', homeworkId: '1' },
    { id: '3', homeworkId: '2' },
    { id: '3', homeworkId: '3' },
    { id: '3', homeworkId: '4' },
    { id: '3', homeworkId: '5' },
    { id: '3', homeworkId: '6' },
    { id: '3', homeworkId: '7' },
    { id: '3', homeworkId: '8' },
    { id: '3', homeworkId: '9' },
    { id: '3', homeworkId: '10' },
    // Assignment 4 homeworks
    { id: '4', homeworkId: '1' },
    { id: '4', homeworkId: '2' },
    { id: '4', homeworkId: '3' },
    { id: '4', homeworkId: '4' },
    { id: '4', homeworkId: '5' },
    { id: '4', homeworkId: '6' },
    { id: '4', homeworkId: '7' },
    { id: '4', homeworkId: '8' },
    { id: '4', homeworkId: '9' },
    { id: '4', homeworkId: '10' },
    // Assignment 5 homeworks
    { id: '5', homeworkId: '1' },
    { id: '5', homeworkId: '2' },
    { id: '5', homeworkId: '3' },
    { id: '5', homeworkId: '4' },
    { id: '5', homeworkId: '5' },
    { id: '5', homeworkId: '6' },
    { id: '5', homeworkId: '7' },
    { id: '5', homeworkId: '8' },
    { id: '5', homeworkId: '9' },
    { id: '5', homeworkId: '10' },
    // Assignment 6 homeworks
    { id: '6', homeworkId: '1' },
    { id: '6', homeworkId: '2' },
    { id: '6', homeworkId: '3' },
    { id: '6', homeworkId: '4' },
    { id: '6', homeworkId: '5' },
    { id: '6', homeworkId: '6' },
    { id: '6', homeworkId: '7' },
    { id: '6', homeworkId: '8' },
    { id: '6', homeworkId: '9' },
    { id: '6', homeworkId: '10' }
  ];
}
