// // src/lessonApi.js
// // API helper for lessons

// export async function getLessons(token) {
//   return fetch('/api/courses/lessons/', {
//     headers: { 'Authorization': `Token ${token}` }
//   }).then(res => res.json());
// }

// export async function getLesson(id, token) {
//   return fetch(`/api/courses/lessons/${id}/`, {
//     headers: { 'Authorization': `Token ${token}` }
//   }).then(res => res.json());
// }

// export async function createLesson(data, token) {
//   return fetch('/api/courses/lessons/', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       'Authorization': `Token ${token}`
//     },
//     body: JSON.stringify(data)
//   }).then(res => res.json());
// }

// export async function updateLesson(id, data, token) {
//   return fetch(`/api/courses/lessons/${id}/`, {
//     method: 'PUT',
//     headers: {
//       'Content-Type': 'application/json',
//       'Authorization': `Token ${token}`
//     },
//     body: JSON.stringify(data)
//   }).then(res => res.json());
// }

// export async function deleteLesson(id, token) {
//   return fetch(`/api/courses/lessons/${id}/`, {
//     method: 'DELETE',
//     headers: { 'Authorization': `Token ${token}` }
//   });
// }

// export async function assignTeacher(id, data, token) {
//   return fetch(`/api/courses/lessons/${id}/assign_teacher/`, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       'Authorization': `Token ${token}`
//     },
//     body: JSON.stringify(data)
//   }).then(res => res.json());
// }

// export async function removeTeacher(id, data, token) {
//   return fetch(`/api/courses/lessons/${id}/remove_teacher/`, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       'Authorization': `Token ${token}`
//     },
//     body: JSON.stringify(data)
//   }).then(res => res.json());
// }

// export async function getMyLessons(token) {
//   return fetch('/api/courses/lessons/my_lessons/', {
//     headers: { 'Authorization': `Token ${token}` }
//   }).then(res => res.json());
// }

// export async function searchLessons(params, token) {
//   const query = new URLSearchParams(params).toString();
//   return fetch(`/api/courses/lessons/search/?${query}`, {
//     headers: { 'Authorization': `Token ${token}` }
//   }).then(res => res.json());
// }


export const lessonsMock = [
  {
    id: "alg-101",
    title: "Introduction to Algorithms",
    description: "Understand what algorithms are and how to analyze them with simple examples.",
    videoUrl: "https://www.youtube.com/embed/8hly31xKli0",
    tasksCount: 3,
    duration: 24,
    createdAt: "2025-06-01T09:00:00Z",
    updatedAt: "2025-07-01T10:00:00Z",
    objectives: [
      "Define what an algorithm is",
      "Recognize inputs and outputs",
      "Express algorithms in plain English",
      "Understand determinism and finiteness",
      "Differentiate time vs space complexity",
      "Explain Big-O at a high level",
      "Trace a simple algorithm step-by-step",
      "Compare multiple solutions by growth rate",
      "Identify best, average and worst case",
      "Use counting operations as a complexity proxy",
      "Spot constant, logarithmic, linear patterns",
      "Explain why constants are dropped in Big-O",
      "Describe linear search",
      "Describe binary search",
      "Identify preconditions for binary search",
      "Walk through binary search on a sorted list",
      "Relate algorithms to real-life processes",
      "Understand stability in sorting at a glance",
      "Recognize brute force vs heuristic approaches",
      "Articulate trade-offs in picking an approach",
      "Plan a solution using pseudocode",
      "Test with small cases and edge cases",
      "Communicate algorithm ideas clearly"
    ],
    resources: [
      { label: "Slides PDF", href: "#" },
      { label: "Cheatsheet", href: "#" }
    ]
  },
  {
    id: "ds-201",
    title: "Data Structures Basics",
    description: "Arrays, linked lists, stacks vs queues with real life analogies.",
    videoUrl: "https://www.youtube.com/embed/RBSGKlAvoiM",
    tasksCount: 5,
    duration: 32,
    createdAt: "2025-06-05T10:00:00Z",
    updatedAt: "2025-07-02T10:00:00Z",
    objectives: [
      "Explain what a data structure is",
      "Understand contiguous vs linked storage",
      "Create and index arrays",
      "Insert and delete in arrays (cost overview)",
      "Traverse singly linked lists",
      "Compare singly vs doubly linked lists",
      "Use stacks (push/pop) and their use cases",
      "Use queues (enqueue/dequeue) and scenarios",
      "Identify when to prefer stack vs queue",
      "Describe hash tables conceptually",
      "Explain collisions at a high level",
      "Compare average vs worst lookup costs",
      "Understand trees as hierarchical structures",
      "See binary tree terms: root, leaf, height",
      "Recognize BFS vs DFS traversal patterns",
      "Map real problems to core structures",
      "Choose the right structure by access/update",
      "Articulate trade-offs with examples"
    ],
    resources: [
      { label: "Practice problems", href: "#" }
    ]
  },
  {
    id: "py-110",
    title: "Python Control Flow",
    description: "If/else, loops, and list comprehensions with step-by-step visuals.",
    videoUrl: "https://www.youtube.com/embed/f79MRyMsjrQ",
    tasksCount: 4,
    duration: 28,
    createdAt: "2025-06-10T11:00:00Z",
    updatedAt: "2025-07-03T11:00:00Z",
    objectives: [
      "Write boolean expressions",
      "Use if/elif/else for branching",
      "Avoid deep nesting via early returns",
      "Iterate with for loops",
      "Iterate with while loops",
      "Break and continue responsibly",
      "Enumerate items with index",
      "Loop over dictionaries safely",
      "Build list comprehensions",
      "Use conditionals in comprehensions",
      "Create dict and set comprehensions",
      "Handle off-by-one loop mistakes",
      "Recognize mutable default pitfalls",
      "Readability tips for loops",
      "Measure simple loop performance"
    ],
    resources: [
      { label: "Notebook template", href: "#" }
    ]
  },
  {
    id: "sql-105",
    title: "SQL Selects & Joins",
    description: "Reading data and combining tables the right way.",
    videoUrl: "https://www.youtube.com/embed/9Pzj7Aj25lw",
    tasksCount: 6,
    duration: 35,
    createdAt: "2025-06-12T12:00:00Z",
    updatedAt: "2025-07-04T11:30:00Z",
    objectives: [
      "Select specific columns",
      "Filter rows with WHERE",
      "Sort results with ORDER BY",
      "Limit and offset result sets",
      "Use aggregate functions (COUNT, SUM)",
      "Group results with GROUP BY",
      "Filter groups with HAVING",
      "Understand primary/foreign keys",
      "Perform INNER JOIN",
      "Perform LEFT JOIN",
      "Recognize RIGHT and FULL joins",
      "Disambiguate columns with aliases",
      "Resolve join duplication issues",
      "Write subqueries for filtering",
      "Use COALESCE and NULL handling",
      "Explain query execution order"
    ],
    resources: [
      { label: "Sample dataset", href: "#" }
    ]
  },
  {
    id: "git-101",
    title: "Git Fundamentals",
    description: "Version control essentials: init, commit, branch, and merge.",
    videoUrl: "https://www.youtube.com/embed/USjZcfj8yxE",
    tasksCount: 2,
    duration: 20,
    createdAt: "2025-06-15T12:00:00Z",
    updatedAt: "2025-07-03T12:00:00Z",
    objectives: [
      "Initialize a repo",
      "Stage and commit changes",
      "Write useful commit messages",
      "View history with log",
      "Create and switch branches",
      "Merge branches",
      "Resolve simple merge conflicts",
      "Use .gitignore effectively",
      "Undo with revert and reset (high level)",
      "Link local to remote",
      "Push and pull changes",
      "Create pull requests conceptually",
      "Review code basics"
    ],
    resources: [
      { label: "Git cheat-sheet", href: "#" }
    ]
  },
  {
    id: "web-120",
    title: "Web Basics: HTML/CSS",
    description: "Structure and style the web with modern best practices.",
    videoUrl: "https://www.youtube.com/embed/pQN-pnXPaVg",
    tasksCount: 3,
    duration: 26,
    createdAt: "2025-06-20T12:00:00Z",
    updatedAt: "2025-07-05T09:30:00Z",
    objectives: [
      "Use semantic HTML tags",
      "Structure pages with header/main/footer",
      "Apply accessible labels",
      "Control spacing with CSS",
      "Use Flexbox for layout",
      "Use Grid for complex layouts",
      "Build responsive designs",
      "Manage colors and contrast",
      "Create reusable utility classes",
      "Avoid anti-patterns like !important",
      "Organize CSS logically",
      "Debug layout issues",
      "Optimize for performance",
      "Validate HTML and CSS"
    ],
    resources: [
      { label: "Starter template", href: "#" }
    ]
  }
]
// Helper: get last updated lesson
export function getLastLesson(lessons = lessonsMock) {
  if (!lessons?.length) return null;
  const sorted = [...lessons].sort(
    (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
  );
  return sorted[0];
}

// ----------------------
// 2. Tiny mock API
// ----------------------
export async function getLessons() {
  return [
    { id: 1, title: "Lesson 1", topic: "Intro to Variables" },
    { id: 2, title: "Lesson 2", topic: "Data Types" },
    { id: 3, title: "Lesson 3", topic: "Functions" },
    { id: 4, title: "Lesson 4", topic: "Loops" },
    { id: 5, title: "Lesson 5", topic: "Arrays" },
    { id: 6, title: "Lesson 6", topic: "CSS Basics" },
  ];
}

export async function getLesson(id) {
  const lessons = await getLessons();
  return lessons.find((l) => l.id === Number(id));
}
