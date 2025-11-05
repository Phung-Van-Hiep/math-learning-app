import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import quizService from '../services/quizService';
import lessonService from '../services/lessonService';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './ResultsPage.css';

const ResultsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [attempts, setAttempts] = useState([]);
  const [lessons, setLessons] = useState({});
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all'); // all, passed, failed
  const [stats, setStats] = useState({
    totalAttempts: 0,
    passedAttempts: 0,
    failedAttempts: 0,
    averageScore: 0
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchResults();
  }, [user]);

  const fetchResults = async () => {
    try {
      setLoading(true);

      // Fetch all quiz attempts
      const attemptsData = await quizService.getMyAttempts();
      setAttempts(attemptsData);

      // Fetch lessons to get lesson names
      const lessonsData = await lessonService.getMyLessons();
      const lessonsMap = {};
      lessonsData.forEach(lesson => {
        lessonsMap[lesson.id] = lesson;
      });
      setLessons(lessonsMap);

      // Calculate stats
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
    } catch (error) {
      console.error('Error fetching results:', error);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#10b981'; // green
    if (score >= 60) return '#3b82f6'; // blue
    return '#ef4444'; // red
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return 'Xuất sắc';
    if (score >= 60) return 'Đạt';
    return 'Chưa đạt';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}p${secs}s`;
  };

  const filteredAttempts = attempts.filter(attempt => {
    if (filterStatus === 'passed') return attempt.score >= 60;
    if (filterStatus === 'failed') return attempt.score < 60;
    return true;
  });

  if (loading) {
    return (
      <div className="app">
        <Header />
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Đang tải kết quả...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="app">
      <Header />
      <main className="results-page">
        <div className="results-container">
          <div className="results-header">
            <h1>📝 Kết quả bài kiểm tra</h1>
            <p>Xem lại kết quả các bài kiểm tra bạn đã làm</p>
          </div>

          {/* Stats Cards */}
          <div className="results-stats">
            <div className="stat-card">
              <div className="stat-icon" style={{ background: '#dbeafe' }}>📊</div>
              <div className="stat-content">
                <div className="stat-value">{stats.totalAttempts}</div>
                <div className="stat-label">Tổng số bài</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon" style={{ background: '#d1fae5' }}>✅</div>
              <div className="stat-content">
                <div className="stat-value">{stats.passedAttempts}</div>
                <div className="stat-label">Đạt yêu cầu</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon" style={{ background: '#fee2e2' }}>❌</div>
              <div className="stat-content">
                <div className="stat-value">{stats.failedAttempts}</div>
                <div className="stat-label">Chưa đạt</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon" style={{ background: '#fef3c7' }}>⭐</div>
              <div className="stat-content">
                <div className="stat-value">{stats.averageScore}%</div>
                <div className="stat-label">Điểm trung bình</div>
              </div>
            </div>
          </div>

          {/* Filter */}
          <div className="results-filter">
            <button
              className={`filter-btn ${filterStatus === 'all' ? 'active' : ''}`}
              onClick={() => setFilterStatus('all')}
            >
              Tất cả ({attempts.length})
            </button>
            <button
              className={`filter-btn ${filterStatus === 'passed' ? 'active' : ''}`}
              onClick={() => setFilterStatus('passed')}
            >
              Đạt ({stats.passedAttempts})
            </button>
            <button
              className={`filter-btn ${filterStatus === 'failed' ? 'active' : ''}`}
              onClick={() => setFilterStatus('failed')}
            >
              Chưa đạt ({stats.failedAttempts})
            </button>
          </div>

          {/* Results List */}
          <div className="results-list">
            {filteredAttempts.length === 0 ? (
              <div className="empty-state">
                <p>
                  {filterStatus === 'all'
                    ? 'Bạn chưa làm bài kiểm tra nào'
                    : `Không có bài kiểm tra ${filterStatus === 'passed' ? 'đạt' : 'chưa đạt'}`
                  }
                </p>
                <button onClick={() => navigate('/')}>Xem bài học</button>
              </div>
            ) : (
              filteredAttempts.map(attempt => (
                <div key={attempt.id} className="result-card">
                  <div className="result-main">
                    <div className="result-info">
                      <h3>
                        Bài kiểm tra - {lessons[attempt.quiz?.lesson_id]?.title || 'Bài học'}
                      </h3>
                      <div className="result-meta">
                        <span>📅 {formatDate(attempt.submitted_at)}</span>
                        <span>⏱ Thời gian: {formatDuration(attempt.time_spent)}</span>
                      </div>
                      <div className="result-score-details">
                        <span>Điểm: {attempt.points_earned?.toFixed(1)}/{attempt.total_points?.toFixed(1)}</span>
                      </div>
                    </div>

                    <div className="result-score">
                      <div
                        className="score-circle"
                        style={{ borderColor: getScoreColor(attempt.score) }}
                      >
                        <div className="score-value" style={{ color: getScoreColor(attempt.score) }}>
                          {Math.round(attempt.score)}%
                        </div>
                        <div
                          className="score-label"
                          style={{ color: getScoreColor(attempt.score) }}
                        >
                          {getScoreLabel(attempt.score)}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="result-actions">
                    <button
                      className="btn-secondary"
                      onClick={() => navigate(`/lessons/${lessons[attempt.quiz?.lesson_id]?.slug || ''}`)}
                    >
                      Xem bài học
                    </button>
                    <button
                      className="btn-primary"
                      onClick={() => {
                        // Could navigate to detailed results page
                        alert('Chi tiết kết quả sẽ được hiển thị ở đây');
                      }}
                    >
                      Xem chi tiết
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ResultsPage;
