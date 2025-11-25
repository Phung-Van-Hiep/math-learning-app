import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import feedbackService from '../services/feedbackService';
import lessonService from '../services/lessonService';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './FeedbackPage.css';
import { toast } from 'react-toastify';

const FeedbackPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [myFeedback, setMyFeedback] = useState([]);
  const [lessons, setLessons] = useState({});
  const [loading, setLoading] = useState(true);
  
  // State cho Modal Tạo/Sửa
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // State cho Modal Xóa (MỚI)
  const [deleteId, setDeleteId] = useState(null);

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
      const feedbackData = await feedbackService.getMyFeedback();
      setMyFeedback(feedbackData);

      const lessonsData = await lessonService.getMyLessons();
      const lessonsMap = {};
      lessonsData.forEach(lesson => {
        lessonsMap[lesson.id] = lesson;
      });
      setLessons(lessonsMap);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error("Không thể tải dữ liệu phản hồi");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitFeedback = async () => {
    if (!selectedLesson) return;

    try {
      setSubmitting(true);
      await feedbackService.createFeedback(selectedLesson.id, rating, comment);
      await fetchData();
      setShowCreateModal(false);
      setSelectedLesson(null);
      setRating(5);
      setComment('');
      toast.success('Cảm ơn bạn đã gửi phản hồi!');
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast.error('Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  };

  // Hàm mở modal xác nhận xóa (Thay thế hàm cũ)
  const handleDeleteClick = (feedbackId) => {
    setDeleteId(feedbackId);
  };

  // Hàm thực hiện xóa thật sự
  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await feedbackService.deleteFeedback(deleteId);
      await fetchData();
      toast.success('Đã xóa phản hồi');
    } catch (error) {
      console.error('Error deleting feedback:', error);
      toast.error('Có lỗi xảy ra khi xóa phản hồi');
    } finally {
      setDeleteId(null); // Đóng modal
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
      year: 'numeric', month: 'long', day: 'numeric'
    });
  };

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
                onClick={() => {
                  setSelectedLesson(null); // Reset selection
                  setRating(5);
                  setComment('');
                  setShowCreateModal(true);
                }}
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
                {lessonsWithoutFeedback.length > 0 && (
                   <button onClick={() => setShowCreateModal(true)}>Tạo phản hồi đầu tiên</button>
                )}
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
                        // Logic sửa: tìm lại lesson object từ ID
                        const lesson = lessons[feedback.lesson_id];
                        if (lesson) {
                            setSelectedLesson(lesson);
                            setRating(feedback.rating);
                            setComment(feedback.comment || '');
                            setShowCreateModal(true);
                        } else {
                            toast.error("Không tìm thấy thông tin bài học này");
                        }
                      }}
                    >
                      ✏️ Sửa
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDeleteClick(feedback.id)} // Gọi hàm mở Modal
                    >
                      🗑️ Xóa
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* MODAL TẠO/SỬA (Giữ nguyên logic cũ nhưng chỉnh lại điều kiện hiển thị select) */}
        {showCreateModal && (
          <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                {/* Nếu selectedLesson đã có -> Đang Sửa hoặc đã Chọn bài để tạo. Nếu chưa -> Đang Tạo mới từ đầu */}
                <h2>{selectedLesson ? 'Viết phản hồi' : 'Chọn bài học để phản hồi'}</h2>
                <button className="modal-close" onClick={() => setShowCreateModal(false)}>×</button>
              </div>

              <div className="modal-body">
                {/* Nếu chưa chọn bài (trường hợp tạo mới) thì hiện select box */}
                {!selectedLesson ? (
                  <div className="form-group">
                    <label>Chọn bài học</label>
                    <select
                      className="form-select"
                      onChange={(e) => {
                          const lessonId = parseInt(e.target.value);
                          const lesson = lessons[lessonId];
                          setSelectedLesson(lesson);
                      }}
                      defaultValue=""
                    >
                      <option value="" disabled>-- Chọn bài học --</option>
                      {lessonsWithoutFeedback.map(lesson => (
                        <option key={lesson.id} value={lesson.id}>
                          {lesson.title}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  // Nếu đã chọn bài (hoặc đang sửa), hiện form nhập liệu
                  <>
                    <div className="form-group">
                      <label>Bài học: <strong>{selectedLesson.title}</strong></label>
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
                <button className="btn-cancel" onClick={() => setShowCreateModal(false)}>Hủy</button>
                {selectedLesson && (
                    <button className="btn-submit" onClick={handleSubmitFeedback} disabled={submitting}>
                    {submitting ? 'Đang gửi...' : 'Gửi phản hồi'}
                    </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* MODAL XÁC NHẬN XÓA (MỚI THÊM) */}
        {deleteId && (
          <div className="modal-overlay" style={{ zIndex: 1100 }}>
            <div className="modal-content" style={{ maxWidth: '400px', padding: '0' }}>
              <div className="modal-header" style={{ borderBottom: 'none', paddingBottom: '0' }}>
                <h2 style={{ color: '#dc2626' }}>⚠️ Xác nhận xóa</h2>
              </div>
              <div className="modal-body" style={{ textAlign: 'center', padding: '20px' }}>
                <p>Bạn có chắc chắn muốn xóa phản hồi này không?</p>
                <p style={{ fontSize: '0.9rem', color: '#6b7280', marginTop: '5px' }}>
                  Hành động này không thể hoàn tác.
                </p>
              </div>
              <div className="modal-footer" style={{ justifyContent: 'center', paddingBottom: '20px' }}>
                <button className="btn-cancel" onClick={() => setDeleteId(null)}>Hủy bỏ</button>
                <button 
                  className="btn-submit" 
                  style={{ backgroundColor: '#dc2626', border: 'none' }}
                  onClick={confirmDelete}
                >
                  Xóa ngay
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