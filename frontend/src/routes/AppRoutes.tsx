import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import LoginPage from '@/pages/auth/LoginPage'
import RegisterPage from '@/pages/auth/RegisterPage'
import AdminLayout from '@/layouts/AdminLayout'
import TeacherLayout from '@/layouts/TeacherLayout'
import StudentLayout from '@/layouts/StudentLayout'
import AdminDashboard from '@/pages/admin/Dashboard'
import AdminUsers from '@/pages/admin/Users'
import AdminGroups from '@/pages/admin/Groups'
import AdminExams from '@/pages/admin/Exams'
import AdminLeads from '@/pages/admin/Leads'
import AdminFinance from '@/pages/admin/Finance'
import TeacherDashboard from '@/pages/teacher/Dashboard'
import TeacherGroups from '@/pages/teacher/Groups'
import TeacherExams from '@/pages/teacher/Exams'
import TeacherAttendance from '@/pages/teacher/Attendance'
import StudentDashboard from '@/pages/student/Dashboard'
import StudentWallet from '@/pages/student/Wallet'
import StudentExams from '@/pages/student/Exams'
import StudentSchedule from '@/pages/student/Schedule'

function AppRoutes() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    )
  }

  return (
    <Routes>
      {user.role === 'admin' && (
        <>
          <Route path="/admin/*" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="groups" element={<AdminGroups />} />
            <Route path="exams" element={<AdminExams />} />
            <Route path="leads" element={<AdminLeads />} />
            <Route path="finance" element={<AdminFinance />} />
            <Route path="" element={<Navigate to="dashboard" replace />} />
          </Route>
          <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
        </>
      )}

      {user.role === 'teacher' && (
        <>
          <Route path="/teacher/*" element={<TeacherLayout />}>
            <Route path="dashboard" element={<TeacherDashboard />} />
            <Route path="groups" element={<TeacherGroups />} />
            <Route path="exams" element={<TeacherExams />} />
            <Route path="attendance" element={<TeacherAttendance />} />
            <Route path="" element={<Navigate to="dashboard" replace />} />
          </Route>
          <Route path="*" element={<Navigate to="/teacher/dashboard" replace />} />
        </>
      )}

      {user.role === 'student' && (
        <>
          <Route path="/student/*" element={<StudentLayout />}>
            <Route path="dashboard" element={<StudentDashboard />} />
            <Route path="wallet" element={<StudentWallet />} />
            <Route path="exams" element={<StudentExams />} />
            <Route path="schedule" element={<StudentSchedule />} />
            <Route path="" element={<Navigate to="dashboard" replace />} />
          </Route>
          <Route path="*" element={<Navigate to="/student/dashboard" replace />} />
        </>
      )}
    </Routes>
  )
}

export default AppRoutes
