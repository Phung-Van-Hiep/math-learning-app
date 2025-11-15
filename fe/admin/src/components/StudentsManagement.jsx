import { useState, useEffect } from 'react';
// Tái sử dụng CSS từ LessonManagement vì cấu trúc tương tự
import './LessonManagement.css'; 

// --- Dịch vụ giả (Mock Service) ---
// Vì chúng ta chưa có studentService, tôi sẽ tạo một dịch vụ giả ở đây
// để component có thể hoạt động đầy đủ (CRUD)
// Khi bạn có service thật, hãy xóa phần này và import service của bạn.

const mockStudentDB = [
  {
    id: 1,
    full_name: 'Nguyễn Văn A',
    email: 'anv@example.com',
    grade: 9,
    status: 'active',
    date_joined: '2023-01-15T10:00:00Z',
  },
  {
    id: 2,
    full_name: 'Trần Thị B',
    email: 'btt@example.com',
    grade: 7,
    status: 'inactive',
    date_joined: '2023-02-10T11:30:00Z',
  },
];

// Dịch vụ giả mô phỏng các lệnh gọi API
const fakeStudentService = {
  getAllStudents: () => {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...mockStudentDB]), 500);
    });
  },
  createStudent: (studentData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newStudent = {
          ...studentData,
          id: Math.max(...mockStudentDB.map(s => s.id)) + 1,
          date_joined: new Date().toISOString(),
        };
        mockStudentDB.push(newStudent);
        resolve(newStudent);
      }, 500);
    });
  },
  updateStudent: (id, studentData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = mockStudentDB.findIndex(s => s.id === id);
        if (index !== -1) {
          mockStudentDB[index] = { ...mockStudentDB[index], ...studentData };
          resolve(mockStudentDB[index]);
        }
      }, 500);
    });
  },
  deleteStudent: (id) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = mockStudentDB.findIndex(s => s.id === id);
        if (index !== -1) {
          mockStudentDB.splice(index, 1);
        }
        resolve();
      }, 500);
    });
  },
};
// --- Kết thúc Dịch vụ giả ---


const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '', // Chỉ dùng khi tạo mới
    grade: 6,
    status: 'active',
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      // Thay thế 'fakeStudentService' bằng 'studentService' thật của bạn
      const data = await fakeStudentService.getAllStudents(); 
      setStudents(data);
    } catch (error) {
      console.error('Error fetching students:', error);
      alert('Không thể tải danh sách học sinh');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Xác thực email đơn giản
    if (!formData.email.includes('@')) {
      alert('Vui lòng nhập email hợp lệ');
      return;
    }

    // Yêu cầu mật khẩu khi tạo mới
    if (!editingStudent && !formData.password) {
      alert('Vui lòng nhập mật khẩu cho học sinh mới');
      return;
    }

    try {
      if (editingStudent) {
        // Không gửi mật khẩu khi cập nhật
        const { password, ...updateData } = formData;
        await fakeStudentService.updateStudent(editingStudent.id, updateData);
        alert('Cập nhật học sinh thành công!');
      } else {
        await fakeStudentService.createStudent(formData);
        alert('Tạo học sinh thành công!');
      }

      setShowForm(false);
      setEditingStudent(null);
      resetForm();
      fetchStudents();
    } catch (error) {
      console.error('Error saving student:', error);
      alert('Lỗi khi lưu thông tin học sinh');
    }
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setFormData({
      full_name: student.full_name,
      email: student.email,
      password: '', // Không hiển thị mật khẩu cũ
      grade: student.grade,
      status: student.status,
    });
    setShowForm(true);
  };

  const handleDelete = async (studentId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa học sinh này?')) {
      return;
    }

    try {
      await fakeStudentService.deleteStudent(studentId);
      alert('Xóa học sinh thành công!');
      fetchStudents();
    } catch (error) {
      console.error('Error deleting student:', error);
      alert('Lỗi khi xóa học sinh');
    }
  };

  const resetForm = () => {
    setFormData({
      full_name: '',
      email: '',
      password: '',
      grade: 6,
      status: 'active',
    });
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingStudent(null);
    resetForm();
  };

  // Định dạng ngày cho dễ đọc
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
        <button
          className="btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? '❌ Hủy' : '➕ Thêm học sinh mới'}
        </button>
      </div>

      {showForm && (
        <div className="lesson-form-container">
          <h3>{editingStudent ? 'Chỉnh sửa thông tin' : 'Tạo học sinh mới'}</h3>
          <form onSubmit={handleSubmit} className="lesson-form">
            <div className="form-row">
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
                <small className="field-description">
                  Mật khẩu phải có ít nhất 6 ký tự.
                </small>
              </div>
            )}
            
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
              <th>Họ và tên</th>
              <th>Email</th>
              <th>Lớp</th>
              <th>Trạng thái</th>
              <th>Ngày tham gia</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id}>
                <td>{student.id}</td>
                {/* Tái sử dụng class 'lesson-title' */}
                <td className="lesson-title">{student.full_name}</td>
                <td>{student.email}</td>
                <td>Lớp {student.grade}</td>
                <td>
                  {/* Tái sử dụng các class 'badge' */}
                  <span className={`badge ${student.status === 'active' ? 'badge-success' : 'badge-draft'}`}>
                    {student.status === 'active' ? 'Hoạt động' : 'Ngừng'}
                  </span>
                </td>
                <td>{formatDate(student.date_joined)}</td>
                <td className="actions">
                  <button
                    className="btn-edit"
                    onClick={() => handleEdit(student)}
                    title="Chỉnh sửa"
                  >
                    ✏️
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(student.id)}
                    title="Xóa"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

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