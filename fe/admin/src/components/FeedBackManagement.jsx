import { useState, useEffect } from 'react';
import './FeedBackManagement.css';
import adminService from '../services/adminService';

const FeedbackManagement = () => {
  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFeedback, setSelectedFeedback] = useState(null);

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    try {
      setLoading(true);
      // Gọi API lấy danh sách
      const data = await adminService.getFeedback();
      // Sắp xếp theo ngày mới nhất (created_at)
      setFeedbackList(data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
    } catch (error) {
      console.error('Error fetching feedback:', error);
      // Không alert lỗi để tránh spam nếu API đang lỗi nhẹ
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (feedbackId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa phản hồi này?')) return;
    try {
      await adminService.deleteFeedback(feedbackId);
      alert('Xóa phản hồi thành công!');
      fetchFeedback(); // Tải lại danh sách
      if (selectedFeedback && selectedFeedback.id === feedbackId) {
        setSelectedFeedback(null);
      }
    } catch (error) {
      console.error('Error deleting feedback:', error);
      alert('Lỗi khi xóa phản hồi');
    }
  };

  // Hàm xem chi tiết
  const handleViewDetails = (feedback) => {
    setSelectedFeedback(feedback);
  };

  // Định dạng ngày
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('vi-VN', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  // Helper render sao
  const renderStars = (rating) => {
    return "⭐".repeat(Math.round(rating));
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Đang tải danh sách...</p>
      </div>
    );
  }

  return (
    <div className="lesson-management">
      <div className="management-header">
        <h2>💬 Quản lý Phản hồi</h2>
        <button className="btn-primary" onClick={fetchFeedback}>
          🔄 Tải lại
        </button>
      </div>

      {/* MODAL CHI TIẾT */}
      {selectedFeedback && (
        <div className="lesson-form-container">
          <h3>Chi tiết Phản hồi (ID: {selectedFeedback.id})</h3>
          <div className="lesson-form">
            <div className="form-row">
              <div className="form-group">
                <label>Người gửi:</label>
                <input type="text" value={selectedFeedback.user_name} readOnly />
              </div>
              <div className="form-group">
                <label>Email:</label>
                <input type="text" value={selectedFeedback.user_email || 'Không có email'} readOnly />
              </div>
            </div>
            
            <div className="form-row">
               <div className="form-group">
                <label>Bài học:</label>
                <input type="text" value={selectedFeedback.lesson_title} readOnly />
              </div>
               <div className="form-group">
                <label>Đánh giá:</label>
                <input type="text" value={`${selectedFeedback.rating} sao`} readOnly />
              </div>
            </div>

            <div className="form-group">
              <label>Nội dung phản hồi:</label>
              {/* Sửa 'content' thành 'comment' */}
              <textarea value={selectedFeedback.comment} rows="5" readOnly />
            </div>
            
            <div className="form-actions">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setSelectedFeedback(null)}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BẢNG DANH SÁCH */}
      <div className="lessons-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Người gửi</th>
              <th>Bài học</th>
              <th>Đánh giá</th>
              <th>Ngày gửi</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {feedbackList.map((feedback) => (
              <tr key={feedback.id}>
                <td>{feedback.id}</td>
                <td>
                    <div style={{fontWeight: 'bold'}}>{feedback.user_name}</div>
                    <small>{feedback.user_email}</small>
                </td>
                {/* Sửa 'subject' thành 'lesson_title' */}
                <td className="lesson-title">{feedback.lesson_title}</td>
                <td>
                  <span style={{color: '#f1c40f'}}>
                    {renderStars(feedback.rating)} 
                  </span>
                  ({feedback.rating})
                </td>
                {/* Sửa 'submitted_at' thành 'created_at' */}
                <td>{formatDate(feedback.created_at)}</td>
                <td className="actions">
                  <button
                    className="btn-edit"
                    onClick={() => handleViewDetails(feedback)}
                    title="Xem nội dung"
                    style={{ color: '#0984e3' }}
                  >
                    👁️ Xem
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(feedback.id)}
                    title="Xóa"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {feedbackList.length === 0 && (
          <div className="empty-state">
            <p>Không có phản hồi nào.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedbackManagement;