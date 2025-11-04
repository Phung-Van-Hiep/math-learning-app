import { useState, useEffect } from 'react';
import lessonService from '../services/lessonService';
import './LessonManagement.css';

const LessonManagement = () => {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingLesson, setEditingLesson] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    grade: 6,
    duration: 45,
    difficulty: 'medium',
    thumbnail: '',
    video_url: '',
    content: '',
    is_published: false,
  });

  useEffect(() => {
    fetchLessons();
  }, []);

  const fetchLessons = async () => {
    try {
      setLoading(true);
      const data = await lessonService.getAllLessons();
      setLessons(data);
    } catch (error) {
      console.error('Error fetching lessons:', error);
      alert('Không thể tải danh sách bài học');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingLesson) {
        await lessonService.updateLesson(editingLesson.id, formData);
        alert('Cập nhật bài học thành công!');
      } else {
        await lessonService.createLesson(formData);
        alert('Tạo bài học thành công!');
      }

      setShowForm(false);
      setEditingLesson(null);
      resetForm();
      fetchLessons();
    } catch (error) {
      console.error('Error saving lesson:', error);
      alert(error.response?.data?.detail || 'Lỗi khi lưu bài học');
    }
  };

  const handleEdit = (lesson) => {
    setEditingLesson(lesson);
    setFormData({
      title: lesson.title,
      slug: lesson.slug,
      description: lesson.description || '',
      grade: lesson.grade,
      duration: lesson.duration,
      difficulty: lesson.difficulty,
      thumbnail: lesson.thumbnail || '',
      video_url: lesson.video_url || '',
      content: lesson.content || '',
      is_published: lesson.is_published,
    });
    setShowForm(true);
  };

  const handleDelete = async (lessonId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa bài học này?')) {
      return;
    }

    try {
      await lessonService.deleteLesson(lessonId);
      alert('Xóa bài học thành công!');
      fetchLessons();
    } catch (error) {
      console.error('Error deleting lesson:', error);
      alert('Lỗi khi xóa bài học');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      description: '',
      grade: 6,
      duration: 45,
      difficulty: 'medium',
      thumbnail: '',
      video_url: '',
      content: '',
      is_published: false,
    });
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingLesson(null);
    resetForm();
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
    <div className="lesson-management">
      <div className="management-header">
        <h2>📚 Quản lý bài học</h2>
        <button
          className="btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? '❌ Hủy' : '➕ Thêm bài học mới'}
        </button>
      </div>

      {showForm && (
        <div className="lesson-form-container">
          <h3>{editingLesson ? 'Chỉnh sửa bài học' : 'Tạo bài học mới'}</h3>
          <form onSubmit={handleSubmit} className="lesson-form">
            <div className="form-row">
              <div className="form-group">
                <label>Tiêu đề *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Slug *</label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Mô tả</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="3"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Lớp *</label>
                <select
                  name="grade"
                  value={formData.grade}
                  onChange={handleInputChange}
                  required
                >
                  <option value="6">Lớp 6</option>
                  <option value="7">Lớp 7</option>
                  <option value="8">Lớp 8</option>
                  <option value="9">Lớp 9</option>
                </select>
              </div>

              <div className="form-group">
                <label>Thời lượng (phút) *</label>
                <input
                  type="number"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  min="1"
                  required
                />
              </div>

              <div className="form-group">
                <label>Độ khó *</label>
                <select
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleInputChange}
                  required
                >
                  <option value="easy">Dễ</option>
                  <option value="medium">Trung bình</option>
                  <option value="hard">Khó</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Thumbnail URL</label>
                <input
                  type="url"
                  name="thumbnail"
                  value={formData.thumbnail}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>Video URL</label>
                <input
                  type="url"
                  name="video_url"
                  value={formData.video_url}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Nội dung (HTML)</label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                rows="5"
              />
            </div>

            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  name="is_published"
                  checked={formData.is_published}
                  onChange={handleInputChange}
                />
                <span>Xuất bản bài học</span>
              </label>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary">
                {editingLesson ? 'Cập nhật' : 'Tạo mới'}
              </button>
              <button type="button" className="btn-secondary" onClick={handleCancel}>
                Hủy
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="lessons-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Tiêu đề</th>
              <th>Lớp</th>
              <th>Độ khó</th>
              <th>Thời lượng</th>
              <th>Trạng thái</th>
              <th>Đánh giá</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {lessons.map((lesson) => (
              <tr key={lesson.id}>
                <td>{lesson.id}</td>
                <td className="lesson-title">{lesson.title}</td>
                <td>Lớp {lesson.grade}</td>
                <td>
                  <span className={`badge badge-${lesson.difficulty}`}>
                    {lesson.difficulty === 'easy' ? 'Dễ' : lesson.difficulty === 'medium' ? 'TB' : 'Khó'}
                  </span>
                </td>
                <td>{lesson.duration}p</td>
                <td>
                  <span className={`badge ${lesson.is_published ? 'badge-success' : 'badge-draft'}`}>
                    {lesson.is_published ? 'Đã xuất bản' : 'Nháp'}
                  </span>
                </td>
                <td>⭐ {lesson.rating} ({lesson.review_count})</td>
                <td className="actions">
                  <button
                    className="btn-edit"
                    onClick={() => handleEdit(lesson)}
                    title="Chỉnh sửa"
                  >
                    ✏️
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(lesson.id)}
                    title="Xóa"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {lessons.length === 0 && (
          <div className="empty-state">
            <p>Chưa có bài học nào</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LessonManagement;
