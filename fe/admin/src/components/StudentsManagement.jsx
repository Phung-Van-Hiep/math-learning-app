
import { useState, useEffect } from 'react';
import adminService from '../services/adminService';
import './StudentManagement.css';
import { toast } from 'react-toastify';
const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    full_name: '',
    email: '',
    password: '', // Chỉ dùng khi tạo mới
    grade: 6,
    class_name: '',
    status: 'active',
  });
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const data = await adminService.getStudents();
        setStudents(data);
      } catch (error) {
        console.error('Error fetching students:', error);
        toast.error('Không thể tải danh sách học sinh');
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email.includes('@')) {
      return toast.warn('Vui lòng nhập email hợp lệ');
    }

    if (!editingStudent && !formData.password) {
      return toast.warn('Vui lòng nhập mật khẩu cho học sinh mới');
    }

    try {
      if (editingStudent) {

        const { password, status, ...updateData } = formData;
        updateData.is_active = status === 'active';
        await adminService.updateStudent(editingStudent.id, updateData);
        toast.success('Cập nhật học sinh thành công!');
      } else {

        const { status, ...createData } = formData;
        createData.is_active = status === 'active';
        await adminService.createStudent(createData);
        toast.success('Tạo học sinh thành công!');
      }

      setShowForm(false);
      setEditingStudent(null);
      resetForm();
      const data = await adminService.getStudents();
      setStudents(data);
    } catch (error) {
      console.error('Error saving student:', error);
      toast.error(error.response?.data?.detail || 'Lỗi khi lưu thông tin học sinh');
    }
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setFormData({
      username: student.username,
      full_name: student.full_name,
      email: student.email,
      password: '',
      grade: student.grade || 6,
      class_name: student.class_name || '',
      status: student.is_active ? 'active' : 'inactive',
    });
    setShowForm(true);
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
  };
  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await adminService.deleteStudent(deleteId);
      toast.success('Xóa học sinh thành công!');
      const data = await adminService.getStudents();
      setStudents(data);
    } catch (error) {
      console.error('Error deleting:', error);
      toast.error('Lỗi khi xóa học sinh');
    } finally {
      setDeleteId(null);
    }
  };

  const resetForm = () => {
    setFormData({
      username: '',
      full_name: '',
      email: '',
      password: '',
      grade: 6,
      class_name: '',
      status: 'active',
    });
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingStudent(null);
    resetForm();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
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
        <h2>👥 Quản lý học sinh</h2>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? '❌ Hủy' : '➕ Thêm học sinh mới'}
        </button>
      </div>



      {showForm && (
        <div className="lesson-form-container">
          <h3>{editingStudent ? 'Chỉnh sửa thông tin' : 'Tạo học sinh mới'}</h3>
          <form onSubmit={handleSubmit} className="lesson-form">
            <div className="form-row">
              <div className="form-group">
                <label>Tên đăng nhập *</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Họ và tên *</label>
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              {!editingStudent && (
                <div className="form-group">
                  <label>Mật khẩu *</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Nhập mật khẩu cho học sinh mới"
                    required
                  />
                </div>
              )}
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
                <label>Tên lớp *</label>
                <input
                  type="text"
                  name="class_name"
                  value={formData.class_name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Trạng thái *</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  required
                >
                  <option value="active">Đang hoạt động</option>
                  <option value="inactive">Ngừng hoạt động</option>
                </select>
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary">
                {editingStudent ? 'Cập nhật' : 'Tạo mới'}
              </button>
              <button type="button" className="btn-secondary" onClick={handleCancel}>
                Hủy
              </button>
            </div>
          </form>
        </div>
      )}


      {/* Tái sử dụng class 'lessons-table' */}
      <div className="lessons-table">

        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên đăng nhập</th>
              <th>Họ và tên</th>
              <th>Email</th>
              <th>Lớp</th>
              <th>Tên lớp</th>
              <th>Trạng thái</th>
              <th>Ngày tham gia</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id}>
                <td>{student.id}</td>
                <td>{student.username}</td>
                <td className="lesson-title">{student.full_name}</td>
                <td>{student.email}</td>
                <td>Lớp {student.grade}</td>
                <td>{student.class_name}</td>
                <td>
                  <span className={`badge ${student.is_active ? 'badge-success' : 'badge-draft'}`}>
                    {student.is_active ? 'Hoạt động' : 'Ngừng'}
                  </span>
                </td>
                <td>{formatDate(student.created_at)}</td>
                <td className="actions">
                  <button className="btn-edit" onClick={() => handleEdit(student)} title="Chỉnh sửa">
                    ✏️
                  </button>
                  <button className="btn-delete" onClick={() => handleDeleteClick(student.id)} title="Xóa">
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {deleteId && (
          <div className="modal-overlay" style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
            justifyContent: 'center', alignItems: 'center', zIndex: 1100
          }}>
            <div className="lesson-form-container" style={{ maxWidth: '400px', padding: '20px', margin: 0 }}>
              <h3 style={{ color: '#dc2626', marginTop: 0 }}>⚠️ Xác nhận xóa</h3>
              <p style={{ textAlign: 'center', margin: '20px 0' }}>
                Bạn có chắc chắn muốn xóa học sinh này?<br />
                <small style={{ color: '#666' }}>Dữ liệu điểm số và tiến độ cũng sẽ bị xóa.</small>
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
        {students.length === 0 && (
          <div className="empty-state">
            <p>Chưa có học sinh nào</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentManagement;
