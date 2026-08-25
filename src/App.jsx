import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";

import LoginPage from "./pages/LoginPage.jsx";

import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import StudentsPage from "./pages/admin/StudentsPage.jsx";
import CoursesPage from "./pages/admin/CoursesPage.jsx";
import ExamsPage from "./pages/admin/ExamsPage.jsx";
import QuestionsEditorPage from "./pages/admin/QuestionsEditorPage.jsx";
import ExamResultsPage from "./pages/admin/ExamResultsPage.jsx";

import MyExamsPage from "./pages/student/MyExamsPage.jsx";
import TakeExamPage from "./pages/student/TakeExamPage.jsx";
import ExamResultPage from "./pages/student/ExamResultPage.jsx";
import MyResultsPage from "./pages/student/MyResultsPage.jsx";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/admin/dashboard"
          element={
            <PrivateRoute allowedRole="admin">
              <AdminDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/students"
          element={
            <PrivateRoute allowedRole="admin">
              <StudentsPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/courses"
          element={
            <PrivateRoute allowedRole="admin">
              <CoursesPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/exams"
          element={
            <PrivateRoute allowedRole="admin">
              <ExamsPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/exams/:examId/questions"
          element={
            <PrivateRoute allowedRole="admin">
              <QuestionsEditorPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/exams/:examId/results"
          element={
            <PrivateRoute allowedRole="admin">
              <ExamResultsPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/student/exams"
          element={
            <PrivateRoute allowedRole="student">
              <MyExamsPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/student/exams/:examId"
          element={
            <PrivateRoute allowedRole="student">
              <TakeExamPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/student/exams/:examId/result"
          element={
            <PrivateRoute allowedRole="student">
              <ExamResultPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/student/results"
          element={
            <PrivateRoute allowedRole="student">
              <MyResultsPage />
            </PrivateRoute>
          }
        />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  );
}

export default App;
