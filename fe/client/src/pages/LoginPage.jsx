import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion'; // Import animation
import './LoginPage.css';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await login(username, password);
      if (result.success) {
        window.location.href = (result.user.role === 'admin' || result.user.role === 'teacher') ? '/admin' : '/';
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Background Shapes Animation */}
      <div className="bg-shape shape-1"></div>
      <div className="bg-shape shape-2"></div>

      <motion.div 
        className="login-container"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="login-card glass-effect">
          <div className="login-header">
            <motion.div 
              className="logo"
              initial={{ y: -20 }} animate={{ y: 0 }}
              transition={{ delay: 0.2, type: "spring" }}
            >
              📚
            </motion.div>
            <h1>Chào mừng trở lại!</h1>
            <p>Cùng tiếp tục hành trình chinh phục tri thức.</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            {error && (
              <motion.div 
                className="error-message"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <span>⚠️</span> {error}
              </motion.div>
            )}

            <div className="form-group">
              <label htmlFor="username">Tên đăng nhập</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ví dụ: student123"
                required
                disabled={loading}
                className="input-field"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Mật khẩu</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={loading}
                className="input-field"
              />
            </div>

            <motion.button 
              type="submit" 
              className="login-button" 
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? <span className="spinner-small"></span> : 'Đăng nhập ngay →'}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;