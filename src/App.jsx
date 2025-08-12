// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Public Pages
import HomePage from './page';
import LoginPage from './login/page';
import NotFound from './not-found';

// Student Pages
import StudentDashboard from './student/dashboard/page';
import StudentAssignments from './student/assignments/page';
import HomeworkList from './student/assignments/[id]/homeworks/page';
import HomeworkDetailPage from './student/assignments/[id]/homeworks/[homeworkId]/page';
import StudentGroupDetail from './student/groups/[id]/page';
import StudentProfile from './student/profile/page';

// Teacher Pages
import TeacherDashboard from './teacher/dashboard/page';
import TeacherGroups from './teacher/groups/page';
import TeacherGroupPage from './teacher/groups/[id]/page';
import TeacherSchedule from './teacher/schedule/page';
import TeacherStudents from './teacher/students/page'; 
import TeacherSettings from './teacher/settings/page';

function App() {
  return (

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Student Routes */}
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/student/assignments" element={<StudentAssignments />} />
     <Route
  path="/student/assignments/:id/homeworks"
  element={<HomeworkList />}
/>

<Route
  path="/student/assignments/:id/homeworks/:homeworkId"
  element={<HomeworkDetailPage />}
/>
        <Route path="/student/groups/:id" element={<StudentGroupDetail />} />
        <Route path="/student/profile" element={<StudentProfile />} />

        {/* Teacher Routes */}
        <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
        <Route path="/teacher/groups" element={<TeacherGroups />} />
        <Route path="/teacher/groups/:id" element={<TeacherGroupPage />} />
        <Route path="/teacher/schedule" element={<TeacherSchedule />} />
        <Route path="/teacher/students" element={<TeacherStudents />} />
        <Route path="/teacher/settings" element={<TeacherSettings />} />

        {/* 404 Page */}
        <Route path="*" element={<NotFound />} />
      </Routes>
  );
}

export default App;
