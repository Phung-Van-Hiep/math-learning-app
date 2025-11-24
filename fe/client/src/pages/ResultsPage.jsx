// src/pages/ResultsPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import quizService from '../services/quizService';
import lessonService from '../services/lessonService';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { motion, AnimatePresence } from 'framer-motion'; // Animation
import './ResultsPage.css';

const ResultsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [attempts, setAttempts] = useState([]);
  const [lessons, setLessons] = useState({});
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [stats, setStats] = useState({
    totalAttempts: 0,
    passedAttempts: 0,
    failedAttempts: 0,
    averageScore: 0
  });

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    fetchResults();
  }, [user]);

  const fetchResults = async () => {
    try {
      setLoading(true);
      const attemptsData = await quizService.getMyAttempts();
      setAttempts(attemptsData);

      const lessonsData = await lessonService.getMyLessons();
      const lessonsMap = {};
      lessonsData.forEach(lesson => { lessonsMap[lesson.id] = lesson; });
      setLessons(lessonsMap);

      const passed = attemptsData.filter(a => a.score >= 60).length;
      const failed = attemptsData.filter(a => a.score < 60).length;
      const avgScore = attemptsData.length > 0
        ? Math.round(attemptsData.reduce((sum, a) => sum + a.score, 0) / attemptsData.length)
        : 0;

      setStats({
        totalAttempts: attemptsData.length,
        passedAttempts: passed,
        failedAttempts: failed,
        averageScore: avgScore
      });
    } catch (error) { console.error(error); } 
    finally { setLoading(false); }
  };

  const filteredAttempts = attempts.filter(attempt => {
    if (filterStatus === 'passed') return attempt.score >= 60;
    if (filterStatus === 'failed') return attempt.score < 60;
    return true;
  });

  const getScoreColor = (score) => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#3b82f6';
    return '#ef4444';
  };

  // Helper cho định dạng ngày giờ
  const formatDateTime = (dateStr) => {
     return new Date(dateStr).toLocaleString('vi-VN', {
       dateStyle: 'medium', timeStyle: 'short'
     });
  };

  if (loading) return (/* ...giữ nguyên loading... */ 
    <div className="loading-container"><div className="spinner"></div></div>
  );

  return (
    <div className="app">
      <Header />
      <div className="results-page">
        <div className="results-container">
          <div className="results-header">
            <h1>📜 Lịch sử kiểm tra</h1>
            <div className="score-summary-banner">
              <div className="banner-item">
                <span className="banner-label">Điểm trung bình</span>
                <span className="banner-value highlight">{stats.averageScore}</span>
              </div>
              <div className="divider"></div>
              <div className="banner-item">
                <span className="banner-label">Đã đạt</span>
                <span className="banner-value text-green">{stats.passedAttempts}</span>
              </div>
              <div className="divider"></div>
              <div className="banner-item">
                <span className="banner-label">Chưa đạt</span>
                <span className="banner-value text-red">{stats.failedAttempts}</span>
              </div>
            </div>
          </div>

          {/* Modern Filter Tabs */}
          <div className="filter-tabs">
            {['all', 'passed', 'failed'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`tab-btn ${filterStatus === status ? 'active' : ''}`}
              >
                {status === 'all' ? 'Tất cả' : status === 'passed' ? 'Đạt yêu cầu' : 'Chưa đạt'}
                {filterStatus === status && (
                  <motion.div layoutId="activeTab" className="active-indicator" />
                )}
              </button>
            ))}
          </div>

          <motion.div layout className="results-list">
            <AnimatePresence>
              {filteredAttempts.length > 0 ? (
                filteredAttempts.map(attempt => (
                  <motion.div
                    key={attempt.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="result-row glass-effect"
                  >
                    <div className="result-left">
                      <div className="lesson-info">
                        <h3>{lessons[attempt.quiz?.lesson_id]?.title || 'Bài học không xác định'}</h3>
                        <p className="time-info">📅 {formatDateTime(attempt.submitted_at)} • ⏱ {Math.round(attempt.time_spent/60)} phút</p>
                      </div>
                    </div>

                    <div className="result-right">
                      <div className="score-badge" style={{ 
                        background: getScoreColor(attempt.score) + '20', // thêm độ trong suốt
                        color: getScoreColor(attempt.score),
                        borderColor: getScoreColor(attempt.score)
                      }}>
                        <span className="score-num">{Math.round(attempt.score)}</span>
                        <span className="score-unit">/100</span>
                      </div>
                      
                      <button 
                        className="btn-detail"
                        onClick={() => navigate(`/lessons/${lessons[attempt.quiz?.lesson_id]?.slug}`)}
                      >
                        Xem lại →
                      </button>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="empty-state">Không tìm thấy kết quả nào.</div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ResultsPage;