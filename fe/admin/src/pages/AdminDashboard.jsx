import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import lessonService from '../services/lessonService';
import LessonManagement from '../components/LessonManagement';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState('dashboard');
  const [stats, setStats] = useState({
    totalLessons: 0,
    publishedLessons: 0,
    draftLessons: 0,
    totalStudents: 2, // Mock for now
  });

  useEffect(() => {
    if (activeView === 'dashboard') {
      fetchStats();
    }
  }, [activeView]);

  const fetchStats = async () => {
    try {
      const lessons = await lessonService.getAllLessons();
      setStats({
        totalLessons: lessons.length,
        publishedLessons: lessons.filter(l => l.is_published).length,
        draftLessons: lessons.filter(l => !l.is_published).length,
        totalStudents: 2, // Mock
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const getFirstName = (fullName) => {
    if (!fullName) return 'Admin';
    const parts = fullName.split(' ');
    return parts[parts.length - 1];
  };

  const renderContent = () => {
    switch (activeView) {
      case 'lessons':
        return <LessonManagement />;

      case 'dashboard':
      default:
        return (
          <>
            <div className="admin-welcome">
              <h2>Chào mừng, {user ? getFirstName(user.full_name) : 'Admin'}!</h2>
              <p>Quản lý hệ thống dạy học Toán THCS Như Quỳnh</p>
            </div>

            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">📚</div>
                <div className="stat-value">{stats.totalLessons}</div>
                <div className="stat-label">Tổng bài học</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">✅</div>
                <div className="stat-value">{stats.publishedLessons}</div>
                <div className="stat-label">Đã xuất bản</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">📝</div>
                <div className="stat-value">{stats.draftLessons}</div>
                <div className="stat-label">Nháp</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">👥</div>
                <div className="stat-value">{stats.totalStudents}</div>
                <div className="stat-label">Học sinh</div>
              </div>
            </div>

            <div className="quick-actions">
              <h3>Thao tác nhanh</h3>
              <div className="action-buttons">
                <button
                  className="action-btn primary"
                  onClick={() => setActiveView('lessons')}
                >
                  <span>➕</span>
                  <span>Quản lý bài học</span>
                </button>
                <button className="action-btn secondary">
                  <span>📊</span>
                  <span>Xem báo cáo</span>
                </button>
                <button className="action-btn secondary">
                  <span>👥</span>
                  <span>Quản lý học sinh</span>
                </button>
              </div>
            </div>

            <div className="recent-activity">
              <h3>Hoạt động gần đây</h3>
              <div className="activity-list">
                <div className="activity-item">
                  <div className="activity-icon">📚</div>
                  <div className="activity-content">
                    <p className="activity-title">
                      Có {stats.totalLessons} bài học trong hệ thống
                    </p>
                    <p className="activity-time">Cập nhật mới nhất</p>
                  </div>
                </div>
                <div className="activity-item">
                  <div className="activity-icon">✅</div>
                  <div className="activity-content">
                    <p className="activity-title">
                      {stats.publishedLessons} bài học đã được xuất bản
                    </p>
                    <p className="activity-time">Học sinh có thể truy cập</p>
                  </div>
                </div>
                <div className="activity-item">
                  <div className="activity-icon">📝</div>
                  <div className="activity-content">
                    <p className="activity-title">
                      {stats.draftLessons} bài học đang ở trạng thái nháp
                    </p>
                    <p className="activity-time">Chưa công khai</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <div className="admin-header-content">
          <h1>🎓 Admin Dashboard</h1>
          <div className="admin-user">
            <span>👤 {user ? getFirstName(user.full_name) : 'Admin'}</span>
            <button
              className="logout-btn"
              onClick={handleLogout}
              title="Đăng xuất"
            >
              🚪
            </button>
          </div>
        </div>
      </header>

      <div className="admin-container">
        <aside className="admin-sidebar">
          <nav className="sidebar-nav">
            <button
              className={`nav-item ${activeView === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveView('dashboard')}
            >
              <span>📊</span>
              <span>Tổng quan</span>
            </button>
            <button
              className={`nav-item ${activeView === 'lessons' ? 'active' : ''}`}
              onClick={() => setActiveView('lessons')}
            >
              <span>📚</span>
              <span>Quản lý bài học</span>
            </button>
            <button className="nav-item" disabled>
              <span>👥</span>
              <span>Quản lý học sinh</span>
            </button>
            <button className="nav-item" disabled>
              <span>📝</span>
              <span>Kết quả học tập</span>
            </button>
            <button className="nav-item" disabled>
              <span>💬</span>
              <span>Phản hồi</span>
            </button>
            <button className="nav-item" disabled>
              <span>⚙️</span>
              <span>Cài đặt</span>
            </button>
          </nav>
        </aside>

        <main className="admin-main">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
