import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import useAuthStore from '@store/authStore'
import LoginModal from './LoginModal'

export default function NavigationBar() {
  const location = useLocation()
  const { isAuthenticated, user, logout } = useAuthStore()
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)

  const navItems = [
    { path: '/', label: 'Trang chủ', icon: '🏠' },
    { path: '/introduction', label: 'Giới thiệu', icon: '📖' },
    { path: '/video', label: 'Video bài giảng', icon: '🎥' },
    { path: '/content', label: 'Nội dung', icon: '📚' },
    { path: '/interactive', label: 'Tương tác', icon: '🎯' },
    { path: '/assessment', label: 'Kiểm tra', icon: '✍️' },
    { path: '/feedback', label: 'Liên hệ', icon: '📧' },
  ]

  const handleLogout = () => {
    logout()
    setShowUserMenu(false)
  }

  return (
    <>
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Title */}
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-primary-500 rounded-lg flex items-center justify-center text-white font-bold">
                NQ
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-800">
                  Website Hỗ Trợ Dạy Học Toán
                </h1>
                <p className="text-sm text-gray-600">Trường THCS Như Quỳnh</p>
              </div>
            </div>

            {/* Auth Section */}
            <div className="flex items-center space-x-4">
              {!isAuthenticated ? (
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition flex items-center space-x-2"
                >
                  <span>🔐</span>
                  <span>Đăng nhập</span>
                </button>
              ) : (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition"
                  >
                    <span>👤</span>
                    <span>Xin chào, {user?.name || 'Học sinh'}</span>
                    <span>{showUserMenu ? '▲' : '▼'}</span>
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 border">
                      <Link
                        to="/results"
                        className="block px-4 py-2 hover:bg-gray-100 transition"
                        onClick={() => setShowUserMenu(false)}
                      >
                        📊 Kết quả
                      </Link>
                      <Link
                        to="/assignments"
                        className="block px-4 py-2 hover:bg-gray-100 transition"
                        onClick={() => setShowUserMenu(false)}
                      >
                        📝 Bài làm
                      </Link>
                      <Link
                        to="/settings"
                        className="block px-4 py-2 hover:bg-gray-100 transition"
                        onClick={() => setShowUserMenu(false)}
                      >
                        ⚙️ Cài đặt
                      </Link>
                      <hr className="my-2" />
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100 transition text-red-600"
                      >
                        🚪 Đăng xuất
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex space-x-1 pb-2 overflow-x-auto">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition ${
                  location.pathname === item.path
                    ? 'bg-primary-500 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="mr-2">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}
    </>
  )
}
