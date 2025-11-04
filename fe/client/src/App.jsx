import { Routes, Route } from 'react-router-dom'
import Layout from '@components/Layout'
import ProtectedRoute from '@components/ProtectedRoute'

// Public Pages
import HomePage from '@pages/HomePage'
import IntroductionPage from '@pages/IntroductionPage'
import VideoPage from '@pages/VideoPage'
import ContentPage from '@pages/ContentPage'
import InteractivePage from '@pages/InteractivePage'
import AssessmentPage from '@pages/AssessmentPage'
import FeedbackPage from '@pages/FeedbackPage'

// Protected Pages
import ResultsPage from '@pages/ResultsPage'
import AssignmentsPage from '@pages/AssignmentsPage'
import SettingsPage from '@pages/SettingsPage'

// Auth Pages
import NotFoundPage from '@pages/NotFoundPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Public Routes */}
        <Route index element={<HomePage />} />
        <Route path="introduction" element={<IntroductionPage />} />
        <Route path="video" element={<VideoPage />} />
        <Route path="content" element={<ContentPage />} />
        <Route path="interactive" element={<InteractivePage />} />
        <Route path="assessment" element={<AssessmentPage />} />
        <Route path="feedback" element={<FeedbackPage />} />

        {/* Protected Routes */}
        <Route path="results" element={
          <ProtectedRoute>
            <ResultsPage />
          </ProtectedRoute>
        } />
        <Route path="assignments" element={
          <ProtectedRoute>
            <AssignmentsPage />
          </ProtectedRoute>
        } />
        <Route path="settings" element={
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        } />

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default App
