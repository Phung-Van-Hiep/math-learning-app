import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import settingsService from '../services/settingsService';
import Header from '../components/Header';
import Footer from '../components/Footer';
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
  const [message, setMessage] = useState({ type: '', text: '' });

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
    setMessage({ type: '', text: '' });

    try {
      const updatedUser = await settingsService.updateSettings({
        full_name: profile.full_name,
        email: profile.email,
        grade: profile.grade ? parseInt(profile.grade) : null,
        class_name: profile.class_name
      });

      // Update user context
      updateUser(updatedUser);

      setMessage({ type: 'success', text: 'Cập nhật thông tin thành công!' });
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({
        type: 'error',
        text: error.response?.data?.detail || 'Có lỗi xảy ra khi cập nhật thông tin'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    // Validate passwords
    if (passwordData.new_password.length < 6) {
      setMessage({ type: 'error', text: 'Mật khẩu mới phải có ít nhất 6 ký tự' });
      return;
    }

    if (passwordData.new_password !== passwordData.confirm_password) {
      setMessage({ type: 'error', text: 'Mật khẩu xác nhận không khớp' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      await settingsService.changePassword(
        passwordData.current_password,
        passwordData.new_password
      );

      setMessage({ type: 'success', text: 'Đổi mật khẩu thành công!' });

      // Reset password form
      setPasswordData({
        current_password: '',
        new_password: '',
        confirm_password: ''
      });
    } catch (error) {
      console.error('Error changing password:', error);
      setMessage({
        type: 'error',
        text: error.response?.data?.detail || 'Có lỗi xảy ra khi đổi mật khẩu'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <Header />
      <main className="settings-page">
        <div className="settings-container">
          <div className="settings-header">
            <h1>⚙️ Cài đặt tài khoản</h1>
            <p>Quản lý thông tin cá nhân và bảo mật tài khoản</p>
          </div>

          {/* Message Display */}
          {message.text && (
            <div className={`message ${message.type}`}>
              <span>{message.text}</span>
              <button onClick={() => setMessage({ type: '', text: '' })}>×</button>
            </div>
          )}

          {/* Profile Settings */}
          <div className="settings-section">
            <div className="section-header">
              <h2>👤 Thông tin cá nhân</h2>
            </div>

            <form onSubmit={handleUpdateProfile} className="settings-form">
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="full_name">Họ và tên *</label>
                  <input
                    type="text"
                    id="full_name"
                    name="full_name"
                    value={profile.full_name}
                    onChange={handleProfileChange}
                    required
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={profile.email}
                    onChange={handleProfileChange}
                    required
                    className="form-input"
                  />
                </div>

                {user?.role === 'student' && (
                  <>
                    <div className="form-group">
                      <label htmlFor="grade">Lớp</label>
                      <select
                        id="grade"
                        name="grade"
                        value={profile.grade}
                        onChange={handleProfileChange}
                        className="form-input"
                      >
                        <option value="">-- Chọn lớp --</option>
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
                        placeholder="Ví dụ: 8A, 9B"
                        className="form-input"
                      />
                    </div>
                  </>
                )}
              </div>

              <button
                type="submit"
                className="btn-primary"
                disabled={loading}
              >
                {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
              </button>
            </form>
          </div>

          {/* Password Change */}
          <div className="settings-section">
            <div className="section-header">
              <h2>🔒 Đổi mật khẩu</h2>
            </div>

            <form onSubmit={handleChangePassword} className="settings-form">
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="current_password">Mật khẩu hiện tại *</label>
                  <input
                    type="password"
                    id="current_password"
                    name="current_password"
                    value={passwordData.current_password}
                    onChange={handlePasswordChange}
                    required
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="new_password">Mật khẩu mới *</label>
                  <input
                    type="password"
                    id="new_password"
                    name="new_password"
                    value={passwordData.new_password}
                    onChange={handlePasswordChange}
                    required
                    minLength="6"
                    className="form-input"
                  />
                  <small>Tối thiểu 6 ký tự</small>
                </div>

                <div className="form-group">
                  <label htmlFor="confirm_password">Xác nhận mật khẩu mới *</label>
                  <input
                    type="password"
                    id="confirm_password"
                    name="confirm_password"
                    value={passwordData.confirm_password}
                    onChange={handlePasswordChange}
                    required
                    className="form-input"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn-primary"
                disabled={loading}
              >
                {loading ? 'Đang đổi...' : 'Đổi mật khẩu'}
              </button>
            </form>
          </div>

          {/* Account Info */}
          <div className="settings-section">
            <div className="section-header">
              <h2>📋 Thông tin tài khoản</h2>
            </div>

            <div className="account-info">
              <div className="info-item">
                <span className="info-label">Tên đăng nhập:</span>
                <span className="info-value">{user?.username}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Vai trò:</span>
                <span className="info-value">
                  {user?.role === 'student' ? 'Học sinh' :
                   user?.role === 'teacher' ? 'Giáo viên' :
                   user?.role === 'admin' ? 'Quản trị viên' : user?.role}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Ngày tạo:</span>
                <span className="info-value">
                  {new Date(user?.created_at).toLocaleDateString('vi-VN')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SettingsPage;
