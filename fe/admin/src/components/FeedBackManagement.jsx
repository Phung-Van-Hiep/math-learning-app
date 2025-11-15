import { useState, useEffect } from 'react';
// Tái sử dụng CSS từ LessonManagement
import './LessonManagement.css';

// --- Dịch vụ giả (Mock Service) ---
// Giả lập dữ liệu phản hồi từ học sinh
const mockFeedbackDB = [
  {
    id: 1,
    user_name: 'Nguyễn Văn A',
    user_email: 'anv@example.com',
    subject: 'Lỗi video bài "Phương trình bậc hai"',
    content: 'Em chào cô, video của bài này bị dừng ở 5:30 và không xem tiếp được ạ. Cô xem lại giúp em với.',
    status: 'new',
    submitted_at: '2023-11-12T14:30:00Z',
  },
  {
    id: 2,
    user_name: 'Trần Thị B',
    user_email: 'btt@example.com',
    subject: 'Hỏi về bài tập',
    content: 'Bài 3 trong phần luyện tập "Hệ thức Vi-et" em làm ra đáp án khác, cô có thể giải thích lại không ạ?',
    status: 'new',
    submitted_at: '2023-11-11T09:15:00Z',
  },
  {
    id: 3,
    user_name: 'Lê Văn C',
    user_email: 'clv@example.com',
    subject: 'Góp ý giao diện',
    content: 'Giao diện web rất đẹp và dễ dùng. Cảm ơn cô!',
    status: 'read',
    submitted_at: '2023-11-10T17:00:00Z',
  },
];

// Dịch vụ giả mô phỏng các lệnh gọi API
const fakeFeedbackService = {
  getAllFeedback: () => {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...mockFeedbackDB]), 500);
    });
  },
  markAsRead: (id) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = mockFeedbackDB.findIndex(f => f.id === id);
        if (index !== -1) {
          mockFeedbackDB[index].status = 'read';
          resolve(mockFeedbackDB[index]);
        }
      }, 300);
    });
  },
  deleteFeedback: (id) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = mockFeedbackDB.findIndex(f => f.id === id);
        if (index !== -1) {
          mockFeedbackDB.splice(index, 1);
        }
        resolve();
      }, 500);
    });
  },
};
// --- Kết thúc Dịch vụ giả ---


const FeedbackManagement = () => {
  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFeedback, setSelectedFeedback] = useState(null); // Để xem chi tiết

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    try {
      setLoading(true);
      // Thay thế 'fakeFeedbackService' bằng service thật của bạn
      const data = await fakeFeedbackService.getAllFeedback(); 
      setFeedbackList(data.sort((a, b) => new Date(b.submitted_at) - new Date(a.submitted_at))); // Sắp xếp mới nhất lên đầu
    } catch (error) {
      console.error('Error fetching feedback:', error);
      alert('Không thể tải danh sách phản hồi');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (feedback) => {
    if (feedback.status === 'read') return;

    try {
      await fakeFeedbackService.markAsRead(feedback.id);
      // Cập nhật lại UI ngay lập tức
      setFeedbackList(prevList =>
        prevList.map(item =>
          item.id === feedback.id ? { ...item, status: 'read' } : item
        )
      );
      if (selectedFeedback && selectedFeedback.id === feedback.id) {
        setSelectedFeedback(prev => ({ ...prev, status: 'read' }));
      }
    } catch (error) {
      console.error('Error marking as read:', error);
      alert('Lỗi khi đánh dấu đã đọc');
    }
  };

  const handleDelete = async (feedbackId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa phản hồi này?')) {
      return;
    }

    try {
      await fakeFeedbackService.deleteFeedback(feedbackId);
      alert('Xóa phản hồi thành công!');
      fetchFeedback(); // Tải lại danh sách
      if (selectedFeedback && selectedFeedback.id === feedbackId) {
        setSelectedFeedback(null); // Đóng cửa sổ chi tiết nếu đang xem
      }
    } catch (error) {
      console.error('Error deleting feedback:', error);
      alert('Lỗi khi xóa phản hồi');
    }
  };

  // Hàm xem chi tiết
  const handleViewDetails = (feedback) => {
    setSelectedFeedback(feedback);
    // Tự động đánh dấu là đã đọc khi xem
    if (feedback.status === 'new') {
      handleMarkAsRead(feedback);
    }
  };

  // Định dạng ngày cho dễ đọc
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Đang tải...</p>
      </div>
    );
  }

  return (
    // Tái sử dụng class 'lesson-management'
    <div className="lesson-management">
      <div className="management-header">
        <h2>💬 Quản lý Phản hồi</h2>
        <button
          className="btn-primary"
          onClick={fetchFeedback}
        >
          Tải lại danh sách
        </button>
      </div>

      {/* Cửa sổ xem chi tiết (Modal giả lập) */}
      {selectedFeedback && (
        // Tái sử dụng class 'lesson-form-container'
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
                <input type="text" value={selectedFeedback.user_email} readOnly />
              </div>
            </div>
            <div className="form-group">
              <label>Chủ đề:</label>
              <input type="text" value={selectedFeedback.subject} readOnly />
            </div>
            <div className="form-group">
              <label>Nội dung:</label>
              <textarea value={selectedFeedback.content} rows="5" readOnly />
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

      {/* Tái sử dụng class 'lessons-table' */}
      <div className="lessons-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Người gửi</th>
              <th>Chủ đề</th>
              <th>Trạng thái</th>
              <th>Ngày gửi</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {feedbackList.map((feedback) => (
              <tr key={feedback.id} style={{ fontWeight: feedback.status === 'new' ? 'bold' : 'normal' }}>
                <td>{feedback.id}</td>
                <td>{feedback.user_name}</td>
                {/* Tái sử dụng class 'lesson-title' */}
                <td className="lesson-title">{feedback.subject}</td>
                <td>
                  {/* Tái sử dụng các class 'badge' */}
                  <span className={`badge ${feedback.status === 'new' ? 'badge-medium' : 'badge-draft'}`}>
                    {feedback.status === 'new' ? 'Mới' : 'Đã đọc'}
                  </span>
                </td>
                <td>{formatDate(feedback.submitted_at)}</td>
                <td className="actions">
                  <button
                    className="btn-edit"
                    onClick={() => handleViewDetails(feedback)}
                    title="Xem chi tiết"
                    style={{ color: '#0984e3' }} // Màu xanh cho "Xem"
                  >
                    👁️
                  </button>
                  {feedback.status === 'new' && (
                    <button
                      className="btn-edit"
                      onClick={() => handleMarkAsRead(feedback)}
                      title="Đánh dấu đã đọc"
                      style={{ color: '#27ae60' }} // Màu xanh lá
                    >
                      ✔️
                    </button>
                  )}
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
            <p>Không có phản hồi nào</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedbackManagement;