// src/pages/ProgressDashboard.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import lessonService from '../services/lessonService';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { getThumbnailURL } from '../utils/urlHelper';
import { motion } from 'framer-motion'; // Import Animation
import './ProgressDashboard.css';

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 }
};

const ProgressDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalLessons: 0,
    completedLessons: 0,
    inProgressLessons: 0,
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

      const completed = data.filter(l => l.progress >= 100).length;
      const inProgress = data.filter(l => l.progress > 0 && l.progress < 100).length;
      const totalProgress = data.reduce((sum, l) => sum + (l.progress || 0), 0);
      const averageProgress = data.length > 0 ? Math.round(totalProgress / data.length) : 0;

      setStats({
        totalLessons: data.length,
        completedLessons: completed,
        inProgressLessons: inProgress,
        averageProgress,
      });
    } catch (error) {
      console.error('Error fetching progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const getProgressColor = (progress) => {
    if (progress === 0) return '#94a3b8'; // Slate 400
    if (progress < 50) return '#f59e0b'; // Amber 500
    if (progress < 100) return '#3b82f6'; // Blue 500
    return '#10b981'; // Emerald 500
  };

  const getDifficultyColor = (diff) => {
    if (diff === 'easy') return 'bg-green-100 text-green-700';
    if (diff === 'medium') return 'bg-yellow-100 text-yellow-700';
    return 'bg-red-100 text-red-700';
  };

  if (loading) {
    return (
      <div className="app">
        <Header />
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Đang tải dữ liệu...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="app">
      <Header />
      <motion.main 
        className="progress-dashboard"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="dashboard-container">
          <div className="dashboard-header">
            <motion.h1 
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
            >
              👋 Chào {user?.full_name || 'bạn'},
            </motion.h1>
            <p>Đây là tổng quan quá trình học tập của bạn hôm nay.</p>
          </div>

          {/* Stats Grid - Modern Cards */}
          <div className="stats-grid">
            <motion.div className="stat-card glass-effect blue-gradient" whileHover={{ y: -5 }}>
              <div className="stat-icon">📚</div>
              <div className="stat-info">
                <h3>{stats.totalLessons}</h3>
                <p>Tổng bài học</p>
              </div>
            </motion.div>

            <motion.div className="stat-card glass-effect green-gradient" whileHover={{ y: -5 }}>
              <div className="stat-icon">✅</div>
              <div className="stat-info">
                <h3>{stats.completedLessons}</h3>
                <p>Đã hoàn thành</p>
              </div>
            </motion.div>

            <motion.div className="stat-card glass-effect yellow-gradient" whileHover={{ y: -5 }}>
              <div className="stat-icon">🔥</div>
              <div className="stat-info">
                <h3>{stats.inProgressLessons}</h3>
                <p>Đang học dở</p>
              </div>
            </motion.div>

            <motion.div className="stat-card glass-effect purple-gradient" whileHover={{ y: -5 }}>
              <div className="stat-icon">📈</div>
              <div className="stat-info">
                <h3>{stats.averageProgress}%</h3>
                <p>Tiến độ trung bình</p>
              </div>
            </motion.div>
          </div>

          <div className="dashboard-content-layout">
            {/* Left Column: Lesson List */}
            <div className="content-main">
              <div className="section-header-row">
                <h2>📚 Bài học của tôi</h2>
              </div>
              
              <motion.div 
                className="lessons-grid"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {lessons.length > 0 ? (
                  lessons.map(lesson => (
                    <motion.div
                      key={lesson.id}
                      className="lesson-card-modern glass-effect"
                      variants={itemVariants}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => navigate(`/lessons/${lesson.slug}`)}
                    >
                      <div className="lesson-thumb-wrapper">
                        <img src={getThumbnailURL(lesson.thumbnail)} alt={lesson.title} />
                        <span className={`difficulty-tag ${lesson.difficulty}`}>
                          {lesson.difficulty === 'easy' ? 'Dễ' : lesson.difficulty === 'medium' ? 'Vừa' : 'Khó'}
                        </span>
                      </div>

                      <div className="lesson-card-body">
                        <div className="lesson-card-top">
                          <span className="lesson-grade">Lớp {lesson.grade}</span>
                          <span className="lesson-duration">⏱ {lesson.duration} phút</span>
                        </div>
                        
                        <h3>{lesson.title}</h3>

                        <div className="progress-section-card">
                          <div className="progress-bar-bg">
                            <div 
                              className="progress-bar-fill" 
                              style={{ 
                                width: `${lesson.progress || 0}%`,
                                background: getProgressColor(lesson.progress || 0)
                              }}
                            ></div>
                          </div>
                          <div className="progress-text-row">
                            <span className="status-text" style={{ color: getProgressColor(lesson.progress || 0) }}>
                              {lesson.progress === 100 ? 'Hoàn thành' : lesson.progress > 0 ? 'Đang học' : 'Chưa học'}
                            </span>
                            <span className="percent-text">{lesson.progress || 0}%</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="empty-state-modern">
                    <div className="empty-icon">🌱</div>
                    <h3>Chưa có bài học nào</h3>
                    <button onClick={() => navigate('/')}>Khám phá ngay</button>
                  </div>
                )}
              </motion.div>
            </div>

            {/* Right Column: Grade Summary (Compact) */}
            <aside className="content-sidebar">
              <div className="grade-summary-card glass-effect">
                <h3>📊 Theo lớp</h3>
                <div className="grade-list">
                  {[6, 7, 8, 9].map(grade => {
                    const gradeLessons = lessons.filter(l => l.grade === grade);
                    if (gradeLessons.length === 0) return null;
                    const gradeProgress = Math.round(
                      gradeLessons.reduce((sum, l) => sum + (l.progress || 0), 0) / gradeLessons.length
                    );

                    return (
                      <div key={grade} className="grade-item">
                        <div className="grade-info">
                          <span className="grade-badge">Lớp {grade}</span>
                          <span className="grade-percent">{gradeProgress}%</span>
                        </div>
                        <div className="grade-mini-bar">
                          <div 
                            className="fill" 
                            style={{ width: `${gradeProgress}%`, background: getProgressColor(gradeProgress) }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </motion.main>
      <Footer />
    </div>
  );
};

export default ProgressDashboard;