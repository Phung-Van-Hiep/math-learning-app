import { useState, useEffect } from 'react';
// Import CSS của riêng component này
import './AcademicResults.css';
import adminService from '../services/adminService';
import { toast } from 'react-toastify';

const AcademicResults = () => {
  const [activeTab, setActiveTab] = useState('quiz'); // 'quiz' hoặc 'progress'
  const [quizAttempts, setQuizAttempts] = useState([]);
  const [lessonProgress, setLessonProgress] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchAllResults = async () => {
      try {
        setLoading(true);
        const [quizData, progressData] = await Promise.all([
          adminService.getQuizAttempts(),
          adminService.getLessonProgress(),
        ]);

        setQuizAttempts(quizData.sort((a, b) => new Date(b.submitted_at) - new Date(a.submitted_at)));
        setLessonProgress(progressData.sort((a, b) => new Date(b.last_updated) - new Date(a.last_updated)));
      } catch (error) {
        console.error('Error fetching results:', error);
        toast.error('Không thể tải kết quả học tập');
      } finally {
        setLoading(false);
      }
    };
    fetchAllResults();
  }, []);


  // ----- Helper Functions (tái sử dụng từ ResultsPage.jsx) -----
  const getScoreLabel = (score) => {
    if (score >= 80) return 'Xuất sắc';
    if (score >= 60) return 'Đạt';
    return 'Chưa đạt';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('vi-VN');
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}p ${secs}s`;
  };

  const getProgressColorClass = (progress) => {
    if (progress < 50) return 'low';
    if (progress < 100) return 'medium';
    return 'high';
  };

  // ----- Render Functions -----

  const renderQuizTable = () => (
    <div className="lessons-table">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Học sinh</th>
            <th>Bài học</th>
            <th>Điểm số</th>
            <th>Trạng thái</th>
            <th>Thời gian làm</th>
            <th>Ngày nộp</th>
          </tr>
        </thead>
        <tbody>
          {quizAttempts.map((attempt) => (
            <tr key={attempt.id}>
              <td>{attempt.id}</td>
              <td className="lesson-title">{attempt.user_name}</td>
              <td>{attempt.lesson_title}</td>
              <td><strong>{attempt.score}</strong></td>
              <td>
                <span className={`badge ${attempt.score >= 60 ? 'badge-success' : 'badge-draft'}`}>
                  {getScoreLabel(attempt.score)}
                </span>
              </td>
              <td>{formatDuration(attempt.time_spent)}</td>
              <td>{formatDate(attempt.submitted_at)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {quizAttempts.length === 0 && (
        <div className="empty-state"><p>Chưa có kết quả kiểm tra nào</p></div>
      )}
    </div>
  );

  const renderProgressTable = () => (
    <div className="lessons-table">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Học sinh</th>
            <th>Bài học</th>
            <th>Tiến độ</th>
            <th>Thời gian học</th>
            <th>Cập nhật cuối</th>
          </tr>
        </thead>
        <tbody>
          {lessonProgress.map((progress) => (
            <tr key={progress.id}>
              <td>{progress.id}</td>
              <td className="lesson-title">{progress.user_name}</td>
              <td>{progress.lesson_title}</td>
              <td>
                <div className="progress-badge-wrapper">
                  <div className="progress-bar-table">
                    <div
                      className={`progress-fill-table ${getProgressColorClass(progress.progress)}`}
                      style={{ width: `${progress.progress}%` }}
                    ></div>
                  </div>
                  <span className="progress-text-table">{progress.progress}%</span>
                </div>
              </td>
              <td>{formatDuration(progress.time_spent)}</td>
              <td>{formatDate(progress.last_updated)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {lessonProgress.length === 0 && (
        <div className="empty-state"><p>Chưa có dữ liệu tiến độ bài học</p></div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Đang tải kết quả học tập...</p>
      </div>
    );
  }

  return (
    // Tái sử dụng class 'lesson-management' cho layout chung
    <div className="lesson-management">
      <div className="management-header">
        <h2>📝 Kết quả học tập</h2>
      </div>

      {/* Thanh Tabs */}
      <div className="ar-tabs">
        <button
          className={`ar-tab-btn ${activeTab === 'quiz' ? 'active' : ''}`}
          onClick={() => setActiveTab('quiz')}
        >
          📊 Kết quả Kiểm tra
        </button>
        <button
          className={`ar-tab-btn ${activeTab === 'progress' ? 'active' : ''}`}
          onClick={() => setActiveTab('progress')}
        >
          📈 Tiến độ Bài học
        </button>
      </div>

      {/* Nội dung Tab */}
      <div className="ar-tab-content">
        {activeTab === 'quiz' ? renderQuizTable() : renderProgressTable()}
      </div>
    </div>
  );
};

export default AcademicResults;