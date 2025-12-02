import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import './RegisterPage.css';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth(); // Lấy hàm register từ Context
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirm_password: '',
    full_name: '',
    grade: '6',     // Mặc định lớp 6
    class_name: '', // Ví dụ: 6A
    role: 'student' // Mặc định là học sinh
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Validate cơ bản
    if (formData.password !== formData.confirm_password) {
      return toast.warn("Mật khẩu xác nhận không khớp!");
    }
    if (formData.password.length < 6) {
      return toast.warn("Mật khẩu phải có ít nhất 6 ký tự");
    }

    try {
      setLoading(true);
      
      // 2. Chuẩn bị dữ liệu gửi đi (bỏ confirm_password)
      const { confirm_password, ...payload } = formData;
      // Chuyển grade sang số nguyên vì Backend yêu cầu int
      payload.grade = parseInt(payload.grade);

      // 3. Gọi API đăng ký qua AuthContext
      const result = await register(payload);

      if (result.success) {
        toast.success("Đăng ký thành công! Vui lòng đăng nhập.");
        navigate('/login');
      } else {
        // Lỗi từ backend trả về (ví dụ: trùng username)
        toast.error(result.error || "Đăng ký thất bại");
      }
    } catch (err) {
      console.error(err);
      toast.error("Lỗi kết nối server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      {/* Hiệu ứng nền giống Login */}
      <div className="bg-shape shape-1"></div>
      <div className="bg-shape shape-2"></div>

      <motion.div 
        className="register-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="register-card glass-effect">
          <div className="register-header">
            <h1>📝 Đăng ký tài khoản</h1>
            <p>Tham gia cùng chúng tôi để học Toán tốt hơn</p>
          </div>

          <form onSubmit={handleSubmit} className="register-form">
            <div className="form-grid">
              {/* Cột 1: Thông tin tài khoản */}
              <div className="form-column">
                <div className="form-group">
                  <label>Tên đăng nhập *</label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    placeholder="VD: nguyenvanan"
                  />
                </div>
                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="email@example.com"
                  />
                </div>
                <div className="form-group">
                  <label>Mật khẩu *</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="Tối thiểu 6 ký tự"
                  />
                </div>
                <div className="form-group">
                  <label>Xác nhận mật khẩu *</label>
                  <input
                    type="password"
                    name="confirm_password"
                    value={formData.confirm_password}
                    onChange={handleChange}
                    required
                    placeholder="Nhập lại mật khẩu"
                  />
                </div>
              </div>

              {/* Cột 2: Thông tin cá nhân */}
              <div className="form-column">
                <div className="form-group">
                  <label>Họ và tên *</label>
                  <input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    required
                    placeholder="VD: Nguyễn Văn An"
                  />
                </div>
                
                <div className="form-row-split">
                  <div className="form-group">
                    <label>Khối lớp *</label>
                    <select name="grade" value={formData.grade} onChange={handleChange}>
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
                      onChange={handleChange}
                      required
                      placeholder="VD: 6A1"
                    />
                  </div>
                </div>
              </div>
            </div>

            <motion.button 
              type="submit" 
              className="register-button"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? <span className="spinner-small"></span> : 'Đăng ký ngay'}
            </motion.button>
          </form>

          <div className="register-footer">
            <p>Đã có tài khoản? <Link to="/login">Đăng nhập tại đây</Link></p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;