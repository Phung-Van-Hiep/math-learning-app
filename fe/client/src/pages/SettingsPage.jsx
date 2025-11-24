import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import settingsService from '../services/settingsService';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PageTransition from '../components/PageTransition'; // Import Component mới
import { toast } from 'react-toastify'; // Import Toast
import './SettingsPage.css';

const SettingsPage = () => {
  const { user, updateUser } = useAuth();
  
  const navigate = useNavigate();

  // Profile settings
  const [profile, setProfile] = useState({
    full_name: '',
    email: '',
    grade: '',
    class_name: ''
  });

  // Password change
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });

  const [loading, setLoading] = useState(false);
  

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Load current user data
    setProfile({
      full_name: user.full_name || '',
      email: user.email || '',
      grade: user.grade || '',
      class_name: user.class_name || ''
    });
  }, [user]);

  const handleProfileChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Sử dụng toast.promise để hiển thị loading -> thành công/thất bại tự động
    toast.promise(
      async () => {
        const updatedUser = await settingsService.updateSettings({
          full_name: profile.full_name,
          email: profile.email,
          grade: profile.grade ? parseInt(profile.grade) : null,
          class_name: profile.class_name
        });
        updateUser(updatedUser);
      },
      {
        pending: 'Đang lưu thông tin...',
        success: 'Cập nhật thông tin thành công! 🎉',
        error: {
          render({ data }) {
            return data.response?.data?.detail || 'Lỗi cập nhật hồ sơ';
          }
        }
      }
    ).finally(() => setLoading(false));
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordData.new_password.length < 6) {
      toast.warning('Mật khẩu mới phải có ít nhất 6 ký tự');
      return;
    }
    if (passwordData.new_password !== passwordData.confirm_password) {
      toast.error('Mật khẩu xác nhận không khớp');
      return;
    }

    setLoading(true);
    try {
        await settingsService.changePassword(
            passwordData.current_password,
            passwordData.new_password
        );
        toast.success('Đổi mật khẩu thành công! Vui lòng đăng nhập lại.');
        setPasswordData({ current_password: '', new_password: '', confirm_password: '' });
    } catch (error) {
        toast.error(error.response?.data?.detail || 'Sai mật khẩu hiện tại hoặc lỗi hệ thống');
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="app">
    <Header />
    <PageTransition className="settings-page">
      <div className="settings-container">
        <div className="settings-header">
          <h1>⚙️ Cài đặt tài khoản</h1>
          <p>Quản lý thông tin cá nhân và bảo mật</p>
        </div>

        {/* Message Display */}
        {/* {message.text && (
          <div className={`message ${message.type}`}>
            <span>{message.text}</span>
            <button onClick={() => setMessage({ type: '', text: '' })}>×</button>
          </div>
        )} */}

        {/* Profile Settings Section */}
        <div className="settings-section glass-card">
          <div className="section-header">
            <h2>👤 Thông tin cá nhân</h2>
          </div>

          <form onSubmit={handleUpdateProfile}>
            <div className="form-grid">
              {/* Hàng 1: Họ tên & Email */}
              <div className="form-group">
                <label htmlFor="full_name">Họ và tên</label>
                <input
                  type="text"
                  id="full_name"
                  name="full_name"
                  value={profile.full_name}
                  onChange={handleProfileChange}
                  required
                  className="form-input"
                  placeholder="Nhập họ tên của bạn"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={profile.email}
                  onChange={handleProfileChange}
                  required
                  className="form-input"
                  placeholder="email@example.com"
                />
              </div>

              {/* Hàng 2: Lớp & Tên lớp (Chỉ hiện nếu là student) */}
              {user?.role === 'student' && (
                <>
                  <div className="form-group">
                    <label htmlFor="grade">Khối lớp</label>
                    <select
                      id="grade"
                      name="grade"
                      value={profile.grade}
                      onChange={handleProfileChange}
                      className="form-input"
                    >
                      <option value="">-- Chọn khối --</option>
                      <option value="6">Lớp 6</option>
                      <option value="7">Lớp 7</option>
                      <option value="8">Lớp 8</option>
                      <option value="9">Lớp 9</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="class_name">Tên lớp</label>
                    <input
                      type="text"
                      id="class_name"
                      name="class_name"
                      value={profile.class_name}
                      onChange={handleProfileChange}
                      placeholder="Ví dụ: 8A"
                      className="form-input"
                    />
                  </div>
                </>
              )}
            </div>

            <div style={{ textAlign: 'right' }}>
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
              </button>
            </div>
          </form>
        </div>

        {/* Password Change Section */}
        <div className="settings-section glass-card">
          <div className="section-header">
            <h2>🔒 Bảo mật & Mật khẩu</h2>
          </div>

          <form onSubmit={handleChangePassword}>
            {/* Sử dụng class password-grid để giới hạn độ rộng */}
            <div className="password-grid">
              <div className="form-group">
                <label htmlFor="current_password">Mật khẩu hiện tại</label>
                <input
                  type="password"
                  id="current_password"
                  name="current_password"
                  value={passwordData.current_password}
                  onChange={handlePasswordChange}
                  required
                  className="form-input"
                  placeholder="••••••••"
                />
              </div>

              <div className="form-group">
                <label htmlFor="new_password">Mật khẩu mới</label>
                <input
                  type="password"
                  id="new_password"
                  name="new_password"
                  value={passwordData.new_password}
                  onChange={handlePasswordChange}
                  required
                  minLength="6"
                  className="form-input"
                  placeholder="Tối thiểu 6 ký tự"
                />
              </div>

              <div className="form-group">
                <label htmlFor="confirm_password">Xác nhận mật khẩu mới</label>
                <input
                  type="password"
                  id="confirm_password"
                  name="confirm_password"
                  value={passwordData.confirm_password}
                  onChange={handlePasswordChange}
                  required
                  className="form-input"
                  placeholder="Nhập lại mật khẩu mới"
                />
              </div>

              <div style={{ marginTop: '10px' }}>
                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? 'Đang xử lý...' : 'Đổi mật khẩu'}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Account Info Section */}
        <div className="settings-section glass card">
          <div className="section-header">
            <h2>📋 Thông tin tài khoản</h2>
          </div>

          <div className="account-info">
            <div className="info-item">
              <span className="info-label">Tên đăng nhập</span>
              <span className="info-value">{user?.username}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Vai trò</span>
              <span className="info-value">
                {user?.role === 'student' ? 'Học sinh' :
                 user?.role === 'teacher' ? 'Giáo viên' :
                 user?.role === 'admin' ? 'Quản trị viên' : user?.role}
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">Ngày tham gia</span>
              <span className="info-value">
                {new Date(user?.created_at).toLocaleDateString('vi-VN')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
    <Footer />
  </div>
  );
};

export default SettingsPage;
