import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import LessonsListPage from './pages/LessonsListPage';
import LessonCreatePage from './pages/LessonCreatePage';
import LessonEditPage from './pages/LessonEditPage';
import LessonContentPage from './pages/LessonContentPage';
import StatisticsPage from './pages/StatisticsPage';
import FeedbackPage from './pages/FeedbackPage';
import SettingsPage from './pages/SettingsPage';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';
import Sidebar from './components/Sidebar';

function App() {
  return (
    <Router>
      <div className="flex">
        <Sidebar />
        <main className="flex-grow p-8">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/lessons" element={<LessonsListPage />} />
            <Route path="/lessons/create" element={<LessonCreatePage />} />
            <Route path="/lessons/:lessonId/edit" element={<LessonEditPage />} />
            <Route path="/lessons/:lessonId/content" element={<LessonContentPage />} />
            <Route path="/statistics" element={<StatisticsPage />} />
            <Route path="/feedback" element={<FeedbackPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
