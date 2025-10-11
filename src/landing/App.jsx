import React from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import PlatformApp from '../App';
import HomePage from './pages/home/Homepage';
import Enroll from './pages/Enrollment/Enroll';
import CourseDetail from './pages/courses/CourseDetail';
import Teachers from './pages/teachers/Teachers';
import Courses from './pages/courses/Courses';
import TeacherDetail from './pages/teachers/TeacherDetail';



function App() {
  return (
    <div className="App">
      <Routes>
        {/* Landing routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/enroll" element={<Enroll />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/:slug" element={<CourseDetail />} />
        <Route path="/teachers" element={<Teachers />} />
        <Route path="/teachers/:id" element={<TeacherDetail />} />

  {/* Platform (cabinet) route */}
  <Route path="/cabinet/*" element={<PlatformApp />} />
  {/* Fallback to landing */}
  <Route path="*" element={<HomePage />} />
      </Routes>
    </div>
  );
}

export default App