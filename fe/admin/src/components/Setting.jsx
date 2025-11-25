import { useState, useEffect } from 'react';
// Import CSS dành riêng cho trang Cài đặt
import './Setting.css';
import adminService from '../services/adminService';
import { toast } from 'react-toastify';

const Settings = () => {
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // State cho form Cài đặt chung
  const [generalData, setGeneralData] = useState({
    site_title: '',
    site_description: '',
    admin_email: '',
    allow_registration: true,
  });

  // State cho form Đổi mật khẩu
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });

  // Tải cài đặt hiện tại khi component được mở
  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const data = await adminService.getSettings();
      setGeneralData(data);
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('Không thể tải cài đặt');
    } finally {
      setLoading(false);
    }
  };


  // Xử lý thay đổi cho form Cài đặt chung
  const handleGeneralChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    setGeneralData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  // Xử lý thay đổi cho form Mật khẩu
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Xử lý Submit form Cài đặt chung
  const handleGeneralSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await adminService.updateSettings(generalData);
      toast.success('Cập nhật cài đặt chung thành công!');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Lỗi khi lưu cài đặt');
    } finally {
      setIsSaving(false);
    }
  };


  // Xử lý Submit form Đổi mật khẩu
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.new_password !== passwordData.confirm_password) {
      return toast.warn('Mật khẩu mới không khớp. Vui lòng nhập lại!');
    }
    if (passwordData.new_password.length < 6) {
      return toast.warn('Mật khẩu mới phải có ít nhất 6 ký tự');
    }
    setIsSaving(true);
    try {
      await adminService.changePassword(passwordData);
      toast.success('Đổi mật khẩu thành công!');
      setPasswordData({ current_password: '', new_password: '', confirm_password: '' });
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error(error.response?.data?.detail || 'Mật khẩu hiện tại không đúng hoặc lỗi hệ thống');
    } finally {
      setIsSaving(false);
    }
  };



  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Đang tải cài đặt...</p>
      </div>
    );
  }

  return (
    // Tái sử dụng class 'lesson-management' cho layout chung
    <div className="lesson-management">
      <div className="management-header">
        <h2>⚙️ Cài đặt hệ thống</h2>
      </div>

      <div className="settings-content">

        {/* === THẺ 1: CÀI ĐẶT CHUNG === */}
        {/* Tái sử dụng class 'lesson-form-container' để làm "thẻ" (card) */}
        <div className="lesson-form-container">
          <h3>Thông tin chung</h3>
          <form onSubmit={handleGeneralSubmit} className="lesson-form">

            <div className="form-group">
              <label>Tên Website *</label>
              <input
                type="text"
                name="site_title"
                value={generalData.site_title}
                onChange={handleGeneralChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Mô tả Website</label>
              <textarea
                name="site_description"
                value={generalData.site_description}
                onChange={handleGeneralChange}
                rows="3"
              />
            </div>

            <div className="form-group">
              <label>Email Quản trị *</label>
              <input
                type="email"
                name="admin_email"
                value={generalData.admin_email}
                onChange={handleGeneralChange}
                required
              />
            </div>

            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  name="allow_registration"
                  checked={generalData.allow_registration}
                  onChange={handleGeneralChange}
                  className="small-checkbox"
                />
                <span>Cho phép học sinh mới đăng ký</span>
              </label>
            </div>

            <div className="form-actions settings-form-actions">
              <button type="submit" className="btn-primary" disabled={isSaving}>
                {isSaving ? 'Đang lưu...' : 'Lưu Cài đặt chung'}
              </button>
            </div>
          </form>
        </div>


        {/* === THẺ 2: BẢO MẬT === */}
        <div className="lesson-form-container">
          <h3>Đổi mật khẩu Admin</h3>
          <form onSubmit={handlePasswordSubmit} className="lesson-form">

            <div className="form-group">
              <label>Mật khẩu hiện tại *</label>
              <input
                type="password"
                name="current_password"
                value={passwordData.current_password}
                onChange={handlePasswordChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Mật khẩu mới *</label>
              <input
                type="password"
                name="new_password"
                value={passwordData.new_password}
                onChange={handlePasswordChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Xác nhận mật khẩu mới *</label>
              <input
                type="password"
                name="confirm_password"
                value={passwordData.confirm_password}
                onChange={handlePasswordChange}
                required
              />
            </div>

            <div className="form-actions settings-form-actions">
              <button type="submit" className="btn-primary" disabled={isSaving}>
                {isSaving ? 'Đang lưu...' : 'Đổi mật khẩu'}
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
};

export default Settings;