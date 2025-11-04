import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Get first name from full name
  const getFirstName = (fullName) => {
    if (!fullName) return 'User';
    const parts = fullName.split(' ');
    return parts[parts.length - 1]; // In Vietnamese, last word is usually first name
  };

  return (
    <header className="header">
      <div className="header-container">
        {/* Left side - Logo and Title */}
        <div className="header-left">
          <div className="logo-container">
            <div className="logo">
              <span>📚</span>
            </div>
            <h1 className="site-title">Website Hỗ Trợ Dạy Học Toán</h1>
          </div>
        </div>

        {/* Right side - Search and User Menu */}
        <div className="header-right">
          {/* Search */}
          <div className={`search-container ${isSearchExpanded ? 'expanded' : ''}`}>
            {isSearchExpanded && (
              <input
                type="text"
                className="search-input"
                placeholder="Tìm kiếm..."
                autoFocus
                onBlur={() => setIsSearchExpanded(false)}
              />
            )}
            <button
              className="search-button"
              onClick={() => setIsSearchExpanded(!isSearchExpanded)}
              aria-label="Tìm kiếm"
            >
              🔍
            </button>
          </div>

          {/* User Dropdown */}
          <div className="user-menu">
            <button
              className="user-button"
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              aria-label="Menu người dùng"
            >
              <span className="user-icon">👤</span>
              <span className="user-name">{user ? getFirstName(user.full_name) : 'User'}</span>
              <span className="dropdown-arrow">▼</span>
            </button>

            {isUserMenuOpen && (
              <div className="user-dropdown">
                <div className="dropdown-header">
                  <span className="user-icon">👤</span>
                  <span>Xin chào, {user ? getFirstName(user.full_name) : 'User'}</span>
                </div>
                <div className="dropdown-info">
                  <small>{user?.email}</small>
                  {user?.grade && user?.class_name && (
                    <small>Lớp {user.grade}{user.class_name}</small>
                  )}
                </div>
                <div className="dropdown-divider"></div>
                <a href="/" className="dropdown-item">
                  <span>🏠</span>
                  <span>Trang chủ</span>
                </a>
                <a href="/progress" className="dropdown-item">
                  <span>📊</span>
                  <span>Tiến độ</span>
                </a>
                <a href="/results" className="dropdown-item">
                  <span>📝</span>
                  <span>Kết quả</span>
                </a>
                <a href="/feedback" className="dropdown-item">
                  <span>💬</span>
                  <span>Phản hồi</span>
                </a>
                <a href="/settings" className="dropdown-item">
                  <span>⚙️</span>
                  <span>Cài đặt</span>
                </a>
                <div className="dropdown-divider"></div>
                <button onClick={handleLogout} className="dropdown-item logout">
                  <span>🚪</span>
                  <span>Đăng xuất</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
