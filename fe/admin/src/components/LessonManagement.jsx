import { useState, useEffect } from 'react';
import lessonService from '../services/lessonService';
import uploadService from '../services/uploadService';
import GeoGebraManagement from './GeogebraManagement';
import { normalizeMediaURL } from '../utils/urlHelper';
import './LessonManagement.css';
import QuizManagement from './QuizManagement';
import { toast } from 'react-toastify';
const LessonManagement = () => {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingLesson, setEditingLesson] = useState(null);
  const [quizLesson, setQuizLesson] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [thumbnailMode, setThumbnailMode] = useState('url'); // 'url' or 'upload'
  const [videoMode, setVideoMode] = useState('url'); // 'url' or 'upload'
  const [slugExists, setSlugExists] = useState(false);
  const [checkingSlug, setCheckingSlug] = useState(false);
  const [geoGebraLesson, setGeoGebraLesson] = useState(null);
  const [uploadProgress, setUploadProgress] = useState({
    thumbnail: 0,
    video: 0,
  });
  const [uploading, setUploading] = useState({
    thumbnail: false,
    video: false,
  });
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
      toast.error('Không thể tải danh sách bài học');
    } finally {
      setLoading(false);
    }
  };

  // Auto-generate slug from title
  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .normalize('NFD') // Normalize to decomposed form
      .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
      .replace(/đ/g, 'd') // Replace Vietnamese đ
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
  };

  // Check if slug exists in database
  const checkSlugUniqueness = async (slug) => {
    if (!slug || slug === editingLesson?.slug) {
      setSlugExists(false);
      return;
    }

    setCheckingSlug(true);
    try {
      // Check if any lesson has this slug
      const existingLesson = lessons.find(lesson =>
        lesson.slug === slug && lesson.id !== editingLesson?.id
      );
      setSlugExists(!!existingLesson);
    } catch (error) {
      console.error('Error checking slug:', error);
    } finally {
      setCheckingSlug(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    // Auto-generate slug when title changes
    if (name === 'title' && !editingLesson) {
      const slug = generateSlug(value);
      setFormData((prev) => ({
        ...prev,
        slug: slug,
      }));
      // Check slug uniqueness
      checkSlugUniqueness(slug);
    }

    // Check slug uniqueness when slug is manually edited
    if (name === 'slug') {
      checkSlugUniqueness(value);
    }
  };

  const handleFileUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type and size
    if (type === 'thumbnail') {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        return toast.error('Định dạng ảnh không hợp lệ. Chỉ chấp nhận: JPG, PNG, GIF, WebP');

      }
      if (file.size > 5 * 1024 * 1024) { // 5MB
        return toast.error('Ảnh quá lớn. Kích thước tối đa: 5MB');

      }
    } else if (type === 'video') {
      const allowedTypes = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo'];
      if (!allowedTypes.includes(file.type)) {
        return toast.error('Định dạng video không hợp lệ. Chỉ chấp nhận: MP4, WebM, MOV, AVI');
      }
      if (file.size > 100 * 1024 * 1024) { // 100MB
        return toast.error('Video quá lớn. Kích thước tối đa: 100MB');
      }
    }

    // Set uploading state
    setUploading((prev) => ({ ...prev, [type]: true }));
    setUploadProgress((prev) => ({ ...prev, [type]: 0 }));

    try {
      let result;
      if (type === 'thumbnail') {
        result = await uploadService.uploadImage(file, (progress) => {
          setUploadProgress((prev) => ({ ...prev, thumbnail: progress }));
        });
        // Store the full URL from upload service
        setFormData((prev) => ({
          ...prev,
          thumbnail: result.url,
        }));
        toast.success('Upload ảnh thành công!');
      } else if (type === 'video') {
        result = await uploadService.uploadVideo(file, (progress) => {
          setUploadProgress((prev) => ({ ...prev, video: progress }));
        });
        // Store the full URL from upload service
        setFormData((prev) => ({
          ...prev,
          video_url: result.url,
        }));
        toast.success('Upload video thành công!');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.response?.data?.detail || 'Lỗi khi upload file');
    } finally {
      setUploading((prev) => ({ ...prev, [type]: false }));
      setUploadProgress((prev) => ({ ...prev, [type]: 0 }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingLesson) {
        await lessonService.updateLesson(editingLesson.id, formData);
        toast.success('Cập nhật bài học thành công!');
      } else {
        await lessonService.createLesson(formData);
        toast.success('Tạo bài học thành công!');
      }

      setShowForm(false);
      setEditingLesson(null);
      resetForm();
      fetchLessons();
    } catch (error) {
      console.error('Error saving lesson:', error);
      toast.error(error.response?.data?.detail || 'Lỗi khi lưu bài học');
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

  const handleDeleteClick = (id) => {
    setDeleteId(id);
  };
  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await lessonService.deleteLesson(deleteId);
      toast.success('Xóa bài học thành công!');
      fetchLessons();
    } catch (error) {
      console.error('Error deleting:', error);
      toast.error('Lỗi khi xóa bài học');
    } finally {
      setDeleteId(null);
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
                <label>
                  Slug *
                  <span className="field-hint-icon" title="Click để xem hướng dẫn">
                    💡
                    <span className="tooltip">
                      <strong>Slug là gì?</strong><br />
                      Đường dẫn URL thân thiện, tự động tạo từ tiêu đề.<br /><br />
                      <strong>Quy tắc:</strong><br />
                      • Chỉ dùng chữ thường (a-z)<br />
                      • Chỉ dùng số (0-9)<br />
                      • Dùng dấu gạch ngang (-)<br />
                      • Không dấu tiếng Việt<br />
                      • Không khoảng trắng<br /><br />
                      <strong>Ví dụ:</strong><br />
                      "Phương trình bậc hai" → "phuong-trinh-bac-hai"
                    </span>
                  </span>
                </label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                  required
                  placeholder="phuong-trinh-bac-nhat"
                  className={slugExists ? 'input-error' : checkingSlug ? 'input-checking' : ''}
                />

                {/* URL Preview */}
                {formData.slug && (
                  <div className="url-preview">
                    <span className="url-label">🔗 URL của bài học:</span>
                    <code className="url-value">
                      {window.location.origin}/lessons/{formData.slug}
                    </code>
                  </div>
                )}

                {/* Slug validation feedback */}
                {checkingSlug && (
                  <small className="field-feedback checking">⏳ Đang kiểm tra...</small>
                )}
                {slugExists && (
                  <small className="field-feedback error">
                    ❌ Slug này đã tồn tại! Vui lòng chọn slug khác.
                  </small>
                )}
                {!checkingSlug && !slugExists && formData.slug && (
                  <small className="field-feedback success">
                    ✅ Slug hợp lệ và chưa được sử dụng
                  </small>
                )}
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

            {/* Thumbnail Section */}
            <div className="form-group">
              <label>
                Ảnh bìa (Thumbnail)
                <span className="field-hint">🖼️</span>
              </label>

              <div className="input-mode-toggle">
                <button
                  type="button"
                  className={`mode-btn ${thumbnailMode === 'url' ? 'active' : ''}`}
                  onClick={() => setThumbnailMode('url')}
                >
                  🔗 Dùng đường dẫn URL
                </button>
                <button
                  type="button"
                  className={`mode-btn ${thumbnailMode === 'upload' ? 'active' : ''}`}
                  onClick={() => setThumbnailMode('upload')}
                >
                  📤 Tải ảnh lên
                </button>
              </div>

              {thumbnailMode === 'url' ? (
                <>
                  <input
                    type="url"
                    name="thumbnail"
                    value={formData.thumbnail}
                    onChange={handleInputChange}
                    placeholder="https://example.com/image.jpg"
                  />
                  <small className="field-description">
                    Nhập đường dẫn URL của ảnh bìa. Ví dụ: https://imgur.com/abc123.jpg hoặc Google Drive link.
                  </small>
                </>
              ) : (
                <>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'thumbnail')}
                    className="file-input"
                    disabled={uploading.thumbnail}
                  />
                  <small className="field-description">
                    Chọn ảnh từ máy tính (JPG, PNG, GIF, WebP). Kích thước tối đa: 5MB.
                  </small>
                  {uploading.thumbnail && (
                    <div className="upload-progress">
                      <div className="progress-bar">
                        <div
                          className="progress-fill"
                          style={{ width: `${uploadProgress.thumbnail}%` }}
                        ></div>
                      </div>
                      <span className="progress-text">Đang upload... {uploadProgress.thumbnail}%</span>
                    </div>
                  )}
                </>
              )}

              {formData.thumbnail && (
                <div className="image-preview">
                  <img src={normalizeMediaURL(formData.thumbnail)} alt="Preview" />
                </div>
              )}
            </div>

            {/* Video Section */}
            <div className="form-group">
              <label>
                Video bài giảng
                <span className="field-hint">🎥</span>
              </label>

              <div className="input-mode-toggle">
                <button
                  type="button"
                  className={`mode-btn ${videoMode === 'url' ? 'active' : ''}`}
                  onClick={() => setVideoMode('url')}
                >
                  🔗 Dùng đường dẫn URL
                </button>
                <button
                  type="button"
                  className={`mode-btn ${videoMode === 'upload' ? 'active' : ''}`}
                  onClick={() => setVideoMode('upload')}
                >
                  📤 Tải video lên
                </button>
              </div>

              {videoMode === 'url' ? (
                <>
                  <input
                    type="url"
                    name="video_url"
                    value={formData.video_url}
                    onChange={handleInputChange}
                    placeholder="https://youtube.com/watch?v=..."
                  />
                  <small className="field-description">
                    Nhập link YouTube, Google Drive, hoặc đường dẫn video trực tiếp.
                    <br />
                    <strong>Ví dụ:</strong> https://youtube.com/watch?v=abc123 hoặc https://drive.google.com/file/d/...
                  </small>
                </>
              ) : (
                <>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => handleFileUpload(e, 'video')}
                    className="file-input"
                    disabled={uploading.video}
                  />
                  <small className="field-description">
                    Chọn video từ máy tính (MP4, WebM, MOV, AVI). Kích thước tối đa: 100MB.
                  </small>
                  {uploading.video && (
                    <div className="upload-progress">
                      <div className="progress-bar">
                        <div
                          className="progress-fill"
                          style={{ width: `${uploadProgress.video}%` }}
                        ></div>
                      </div>
                      <span className="progress-text">Đang upload... {uploadProgress.video}%</span>
                    </div>
                  )}
                </>
              )}
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
                    style={{ color: 'white', marginRight: '5px' }}
                    onClick={() => setGeoGebraLesson(lesson)}
                    title="Quản lý hình học"
                  >
                    📐
                  </button>
                  <button
                    className="btn-edit"
                    style={{ color: 'white', marginRight: '5px' }}
                    onClick={() => setQuizLesson(lesson)}
                    title="Quản lý bài kiểm tra"
                  >
                    📝
                  </button>
                  <button
                    className="btn-edit"
                    onClick={() => handleEdit(lesson)}
                    title="Chỉnh sửa"
                  >
                    ✏️
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => handleDeleteClick(lesson.id)}
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
      {deleteId && (
        <div className="ggb-modal-overlay" style={{ zIndex: 1100 }}> {/* Tái sử dụng class overlay có sẵn */}
          <div className="lesson-form-container" style={{ maxWidth: '400px', padding: '20px' }}>
            <h3 style={{ color: '#dc2626', marginTop: 0 }}>⚠️ Cảnh báo</h3>
            <p style={{ textAlign: 'center', margin: '20px 0' }}>
              Bạn có chắc chắn muốn xóa bài học này?<br />
              <small style={{ color: '#666' }}>Hành động này sẽ xóa cả các bài kiểm tra liên quan.</small>
            </p>
            <div className="form-actions" style={{ justifyContent: 'flex-end' }}>
              <button className="btn-secondary" onClick={() => setDeleteId(null)}>Hủy</button>
              <button
                className="btn-primary"
                style={{ backgroundColor: '#dc2626', border: 'none' }}
                onClick={confirmDelete}
              >
                Xóa ngay
              </button>
            </div>
          </div>
        </div>
      )}
      {geoGebraLesson && (
        <div className="ggb-modal-overlay" onClick={() => setGeoGebraLesson(null)}>
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
          >
            <GeoGebraManagement
              lesson={geoGebraLesson}
              onClose={() => setGeoGebraLesson(null)}
            />
          </div>
        </div>
      )}
      {quizLesson && (
        <div className="ggb-modal-overlay" onClick={() => setQuizLesson(null)}>
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
          >
            {/* Tái sử dụng class overlay của GeoGebra cho nhanh */}
            <QuizManagement
              lesson={quizLesson}
              onClose={() => setQuizLesson(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default LessonManagement;
