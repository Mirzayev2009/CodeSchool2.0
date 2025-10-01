// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { isAuthenticated } from './auth';
// Protected Route wrapper
function ProtectedRoute({ children }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

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
import LessonsList from "./student/lessons/List";
import LessonDetail from "./student/lessons/Detail";

// Teacher Pages
import TeacherDashboard from './teacher/dashboard/page';
import TeacherGroups from './teacher/groups/page';
import TeacherGroupPage from './teacher/groups/[id]/page';
import TeacherSchedule from './teacher/schedule/page';
import TeacherStudents from './teacher/students/page'; 
import TeacherSettings from './teacher/settings/page';
import AdminDashboard from './admin/dashboard/page';
import TeachersManagement from './admin/teachers/page';
import StudentsManagement from './admin/students/page';
import PaymentAdminPage from './admin/payment/Payment';
import AdminSettingsPage from './admin/settings/Settings';
import Courses from './admin/courses/Courses';
import CourseCreate from './admin/courses/CourseCreate';
import Classes from './admin/classes/Classes';
import ClassCreate from './admin/classes/ClassCreate';
import TeacherCreate from './admin/teachers/TeacherAdd';
import StudentCreate from './admin/students/StudentAdd';
import AdminNotificationsPage from './admin/dashboard/Notifications';

function App() {
  return (

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />


  {/* Student Routes (Protected) */}
  <Route path="/student/dashboard" element={<ProtectedRoute><StudentDashboard /></ProtectedRoute>} />
  <Route path="/student/assignments" element={<ProtectedRoute><StudentAssignments /></ProtectedRoute>} />
  <Route path="/student/assignments/:id/homeworks" element={<ProtectedRoute><HomeworkList /></ProtectedRoute>} />
  <Route path="/student/assignments/:id/homeworks/:homeworkId" element={<ProtectedRoute><HomeworkDetailPage /></ProtectedRoute>} />
  <Route path="/student/groups/:id" element={<ProtectedRoute><StudentGroupDetail /></ProtectedRoute>} />
  <Route path="/student/profile" element={<ProtectedRoute><StudentProfile /></ProtectedRoute>} />
  <Route path="/student/lessons" element={<LessonsList />} />
        <Route path="/student/lessons/:id" element={<LessonDetail />} />

  {/* Teacher Routes (Protected) */}
  <Route path="/teacher/dashboard" element={<ProtectedRoute><TeacherDashboard /></ProtectedRoute>} />
  <Route path="/teacher/groups" element={<ProtectedRoute><TeacherGroups /></ProtectedRoute>} />
  <Route path="/teacher/groups/:id" element={<ProtectedRoute><TeacherGroupPage /></ProtectedRoute>} />
  <Route path="/teacher/schedule" element={<ProtectedRoute><TeacherSchedule /></ProtectedRoute>} />
  <Route path="/teacher/students" element={<ProtectedRoute><TeacherStudents /></ProtectedRoute>} />
  <Route path="/teacher/settings" element={<ProtectedRoute><TeacherSettings /></ProtectedRoute>} />

        {/* 404 Page */}
        <Route path="*" element={<NotFound />} />

        {/* admin routes */}
        <Route path="/admin/dashboard" element={<AdminDashboard/>} />
        <Route path="/admin/teachers" element={<TeachersManagement/>} /> 
        <Route path="/admin/students" element={<StudentsManagement/>} /> 
        <Route path="/admin/payment" element={<PaymentAdminPage/>} />   
        <Route path="/admin/settings" element={<AdminSettingsPage/>} /> 
        <Route path="/admin/courses" element={<Courses/>} /> 
        <Route path="/admin/courses/create" element={<CourseCreate/>} /> 
        <Route path="/admin/classes" element={<Classes/>} /> 
        <Route path="/admin/classes/create" element={<ClassCreate/>} /> 
        <Route path="/admin/teachers/add" element={<TeacherCreate/>} /> 
        <Route path="/admin/students/add" element={<StudentCreate/>} /> 
        <Route path="/admin/notifications" element={<AdminNotificationsPage/>} /> 
       
      </Routes>
  );
}

export default App;
