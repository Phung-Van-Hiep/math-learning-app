import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import feedbackService from '../services/feedbackService';
import lessonService from '../services/lessonService';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './FeedbackPage.css';

const FeedbackPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [myFeedback, setMyFeedback] = useState([]);
  const [lessons, setLessons] = useState({});
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch my feedback
      const feedbackData = await feedbackService.getMyFeedback();
      setMyFeedback(feedbackData);

      // Fetch all lessons
      const lessonsData = await lessonService.getMyLessons();
      const lessonsMap = {};
      lessonsData.forEach(lesson => {
        lessonsMap[lesson.id] = lesson;
      });
      setLessons(lessonsMap);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitFeedback = async () => {
    if (!selectedLesson) return;

    try {
      setSubmitting(true);
      await feedbackService.createFeedback(selectedLesson.id, rating, comment);

      // Refresh feedback list
      await fetchData();

      // Reset form
      setShowCreateModal(false);
      setSelectedLesson(null);
      setRating(5);
      setComment('');

      alert('Cảm ơn bạn đã gửi phản hồi!');
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteFeedback = async (feedbackId) => {
    if (!confirm('Bạn có chắc muốn xóa phản hồi này?')) return;

    try {
      await feedbackService.deleteFeedback(feedbackId);
      await fetchData();
      alert('Đã xóa phản hồi');
    } catch (error) {
      console.error('Error deleting feedback:', error);
      alert('Có lỗi xảy ra khi xóa phản hồi');
    }
  };

  const renderStars = (currentRating, interactive = false, onChange = null) => {
    return (
      <div className="star-rating">
        {[1, 2, 3, 4, 5].map(star => (
          <button
            key={star}
            type="button"
            className={`star ${star <= currentRating ? 'filled' : ''} ${interactive ? 'interactive' : ''}`}
            onClick={() => interactive && onChange && onChange(star)}
            disabled={!interactive}
          >
            {star <= currentRating ? '⭐' : '☆'}
          </button>
        ))}
      </div>
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Get lessons that don't have feedback yet
  const lessonsWithoutFeedback = Object.values(lessons).filter(
    lesson => !myFeedback.some(fb => fb.lesson_id === lesson.id)
  );

  if (loading) {
    return (
      <div className="app">
        <Header />
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Đang tải...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="app">
      <Header />
      <main className="feedback-page">
        <div className="feedback-container">
          <div className="feedback-header">
            <h1>💬 Phản hồi của bạn</h1>
            <p>Chia sẻ ý kiến của bạn về các bài học</p>
          </div>

          {/* Create Feedback Button */}
          {lessonsWithoutFeedback.length > 0 && (
            <div className="create-feedback-section">
              <button
                className="btn-create-feedback"
                onClick={() => setShowCreateModal(true)}
              >
                + Tạo phản hồi mới
              </button>
            </div>
          )}

          {/* My Feedback List */}
          <div className="feedback-list">
            {myFeedback.length === 0 ? (
              <div className="empty-state">
                <p>Bạn chưa có phản hồi nào</p>
                <button onClick={() => setShowCreateModal(true)}>Tạo phản hồi đầu tiên</button>
              </div>
            ) : (
              myFeedback.map(feedback => (
                <div key={feedback.id} className="feedback-card">
                  <div className="feedback-lesson">
                    <h3>{lessons[feedback.lesson_id]?.title || 'Bài học'}</h3>
                    <span className="feedback-date">{formatDate(feedback.created_at)}</span>
                  </div>

                  <div className="feedback-rating">
                    {renderStars(feedback.rating)}
                    <span className="rating-text">{feedback.rating}/5</span>
                  </div>

                  {feedback.comment && (
                    <div className="feedback-comment">
                      <p>{feedback.comment}</p>
                    </div>
                  )}

                  <div className="feedback-actions">
                    <button
                      className="btn-edit"
                      onClick={() => {
                        setSelectedLesson(lessons[feedback.lesson_id]);
                        setRating(feedback.rating);
                        setComment(feedback.comment || '');
                        setShowCreateModal(true);
                      }}
                    >
                      ✏️ Sửa
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDeleteFeedback(feedback.id)}
                    >
                      🗑️ Xóa
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Create/Edit Modal */}
        {showCreateModal && (
          <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{selectedLesson ? 'Cập nhật phản hồi' : 'Tạo phản hồi mới'}</h2>
                <button
                  className="modal-close"
                  onClick={() => setShowCreateModal(false)}
                >
                  ×
                </button>
              </div>

              <div className="modal-body">
                {/* Lesson Selection */}
                {!selectedLesson && (
                  <div className="form-group">
                    <label>Chọn bài học</label>
                    <select
                      value={selectedLesson?.id || ''}
                      onChange={(e) => setSelectedLesson(lessons[e.target.value])}
                      className="form-select"
                    >
                      <option value="">-- Chọn bài học --</option>
                      {lessonsWithoutFeedback.map(lesson => (
                        <option key={lesson.id} value={lesson.id}>
                          {lesson.title}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {selectedLesson && (
                  <>
                    <div className="form-group">
                      <label>Bài học: {selectedLesson.title}</label>
                    </div>

                    <div className="form-group">
                      <label>Đánh giá</label>
                      {renderStars(rating, true, setRating)}
                    </div>

                    <div className="form-group">
                      <label>Nhận xét (tùy chọn)</label>
                      <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Chia sẻ ý kiến của bạn..."
                        rows="5"
                        className="form-textarea"
                        maxLength="1000"
                      />
                      <small>{comment.length}/1000 ký tự</small>
                    </div>
                  </>
                )}
              </div>

              <div className="modal-footer">
                <button
                  className="btn-cancel"
                  onClick={() => setShowCreateModal(false)}
                  disabled={submitting}
                >
                  Hủy
                </button>
                <button
                  className="btn-submit"
                  onClick={handleSubmitFeedback}
                  disabled={!selectedLesson || submitting}
                >
                  {submitting ? 'Đang gửi...' : 'Gửi phản hồi'}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default FeedbackPage;
