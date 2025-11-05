import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import lessonService from '../services/lessonService';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { getThumbnailURL } from '../utils/urlHelper';
import './ProgressDashboard.css';

const ProgressDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalLessons: 0,
    completedLessons: 0,
    inProgressLessons: 0,
    totalTimeSpent: 0,
    averageProgress: 0,
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchProgress();
  }, [user]);

  const fetchProgress = async () => {
    try {
      setLoading(true);
      const data = await lessonService.getMyLessons();
      setLessons(data);

      // Calculate stats
      const completed = data.filter(l => l.progress >= 100).length;
      const inProgress = data.filter(l => l.progress > 0 && l.progress < 100).length;
      const totalProgress = data.reduce((sum, l) => sum + (l.progress || 0), 0);
      const averageProgress = data.length > 0 ? Math.round(totalProgress / data.length) : 0;

      setStats({
        totalLessons: data.length,
        completedLessons: completed,
        inProgressLessons: inProgress,
        totalTimeSpent: 0, // This would need to be tracked separately
        averageProgress,
      });
    } catch (error) {
      console.error('Error fetching progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const getProgressColor = (progress) => {
    if (progress === 0) return '#9ca3af';
    if (progress < 50) return '#f59e0b';
    if (progress < 100) return '#3b82f6';
    return '#10b981';
  };

  const getProgressLabel = (progress) => {
    if (progress === 0) return 'Chưa bắt đầu';
    if (progress < 50) return 'Mới bắt đầu';
    if (progress < 100) return 'Đang học';
    return 'Hoàn thành';
  };

  if (loading) {
    return (
      <div className="app">
        <Header />
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Đang tải tiến độ học tập...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="app">
      <Header />
      <main className="progress-dashboard">
        <div className="dashboard-container">
          <div className="dashboard-header">
            <h1>📊 Tiến độ học tập của bạn</h1>
            <p>Theo dõi quá trình học tập và đạt được mục tiêu của bạn</p>
          </div>

          {/* Stats Cards */}
          <div className="stats-cards">
            <div className="stat-card">
              <div className="stat-icon" style={{ background: '#dbeafe' }}>
                📚
              </div>
              <div className="stat-content">
                <div className="stat-value">{stats.totalLessons}</div>
                <div className="stat-label">Tổng bài học</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon" style={{ background: '#d1fae5' }}>
                ✅
              </div>
              <div className="stat-content">
                <div className="stat-value">{stats.completedLessons}</div>
                <div className="stat-label">Đã hoàn thành</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon" style={{ background: '#fef3c7' }}>
                📝
              </div>
              <div className="stat-content">
                <div className="stat-value">{stats.inProgressLessons}</div>
                <div className="stat-label">Đang học</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon" style={{ background: '#e0e7ff' }}>
                📈
              </div>
              <div className="stat-content">
                <div className="stat-value">{stats.averageProgress}%</div>
                <div className="stat-label">Tiến độ trung bình</div>
              </div>
            </div>
          </div>

          {/* Progress by Grade */}
          <div className="progress-section">
            <h2>Tiến độ theo lớp</h2>
            {[6, 7, 8, 9].map(grade => {
              const gradeLessons = lessons.filter(l => l.grade === grade);
              if (gradeLessons.length === 0) return null;

              const gradeProgress = Math.round(
                gradeLessons.reduce((sum, l) => sum + (l.progress || 0), 0) / gradeLessons.length
              );

              return (
                <div key={grade} className="grade-progress">
                  <div className="grade-header">
                    <h3>Lớp {grade}</h3>
                    <span className="grade-stats">
                      {gradeLessons.filter(l => l.progress >= 100).length}/{gradeLessons.length} bài hoàn thành
                    </span>
                  </div>
                  <div className="grade-progress-bar">
                    <div
                      className="grade-progress-fill"
                      style={{ width: `${gradeProgress}%`, background: getProgressColor(gradeProgress) }}
                    ></div>
                  </div>
                  <span className="grade-progress-text">{gradeProgress}%</span>
                </div>
              );
            })}
          </div>

          {/* Lesson List */}
          <div className="progress-section">
            <h2>Chi tiết tiến độ bài học</h2>
            <div className="lessons-progress-list">
              {lessons.map(lesson => (
                <div
                  key={lesson.id}
                  className="lesson-progress-card"
                  onClick={() => navigate(`/lessons/${lesson.slug}`)}
                >
                  <div className="lesson-thumbnail-small">
                    <img src={getThumbnailURL(lesson.thumbnail)} alt={lesson.title} />
                    <div className="progress-overlay" style={{ width: `${lesson.progress || 0}%` }}></div>
                  </div>

                  <div className="lesson-progress-content">
                    <h3>{lesson.title}</h3>
                    <div className="lesson-progress-meta">
                      <span>Lớp {lesson.grade}</span>
                      <span>•</span>
                      <span>{lesson.duration} phút</span>
                      <span>•</span>
                      <span className="difficulty-badge">{
                        lesson.difficulty === 'easy' ? 'Dễ' :
                        lesson.difficulty === 'medium' ? 'TB' :
                        'Khó'
                      }</span>
                    </div>

                    <div className="lesson-progress-bar-container">
                      <div className="lesson-progress-bar">
                        <div
                          className="lesson-progress-fill"
                          style={{
                            width: `${lesson.progress || 0}%`,
                            background: getProgressColor(lesson.progress || 0)
                          }}
                        ></div>
                      </div>
                      <span className="progress-percentage">{lesson.progress || 0}%</span>
                    </div>

                    <div className="progress-status" style={{ color: getProgressColor(lesson.progress || 0) }}>
                      {getProgressLabel(lesson.progress || 0)}
                    </div>
                  </div>

                  <div className="lesson-progress-action">
                    <button className="continue-btn">
                      {lesson.progress === 0 ? 'Bắt đầu học' :
                       lesson.progress >= 100 ? 'Xem lại' :
                       'Tiếp tục học'}
                      →
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {lessons.length === 0 && (
              <div className="empty-state">
                <p>Chưa có bài học nào. Hãy bắt đầu học ngay!</p>
                <button onClick={() => navigate('/')}>Xem bài học</button>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProgressDashboard;
