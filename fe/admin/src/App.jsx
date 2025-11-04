import { Routes, Route, Navigate } from 'react-router-dom'
import useAuthStore from '@store/authStore'
import LoginPage from '@pages/LoginPage'
import Layout from '@components/Layout'

// Admin Pages
import Dashboard from '@pages/Dashboard'
import IntroductionManagement from '@pages/IntroductionManagement'
import VideoManagement from '@pages/VideoManagement'
import ContentManagement from '@pages/ContentManagement'
import InteractiveManagement from '@pages/InteractiveManagement'
import AssessmentManagement from '@pages/AssessmentManagement'
import FeedbackManagement from '@pages/FeedbackManagement'

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuthStore()
  return isAuthenticated ? children : <Navigate to="/login" replace />
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route path="/" element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
        <Route index element={<Dashboard />} />
        <Route path="introduction" element={<IntroductionManagement />} />
        <Route path="videos" element={<VideoManagement />} />
        <Route path="content" element={<ContentManagement />} />
        <Route path="interactive" element={<InteractiveManagement />} />
        <Route path="assessments" element={<AssessmentManagement />} />
        <Route path="feedback" element={<FeedbackManagement />} />
      </Route>
    </Routes>
  )
}

export default App
