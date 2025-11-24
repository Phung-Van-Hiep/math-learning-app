import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import lessonService from '../services/lessonService';
import Header from '../components/Header';
import Footer from '../components/Footer';
import LessonsGrid from '../components/LessonsGrid';
import { motion } from 'framer-motion';
// Bạn cần tạo file HomePage.css riêng hoặc dán CSS vào index.css
import './HomePage.css'; 

const HomePage = () => {
  const { user } = useAuth();
  const [lessons, setLessons] = useState([]);
  const [filteredLessons, setFilteredLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [filters, setFilters] = useState({
    grade: 'all',
    search: ''
  });

  useEffect(() => { fetchLessons(); }, []);
  useEffect(() => { applyFilters(); }, [lessons, filters]);

  const fetchLessons = async () => {
    try {
      setLoading(true);
      // Logic fetch data giữ nguyên như cũ của bạn
      let data;
      if (user?.role === 'student') data = await lessonService.getMyLessons();
      else data = await lessonService.getAllLessons();
      
      const transformed = data.map(l => ({
        ...l, progress: l.progress || 0,
        // Giả lập màu sắc cho đẹp nếu backend chưa có
        colorTheme: ['blue', 'green', 'purple', 'orange'][l.id % 4]
      }));
      setLessons(transformed);
    } catch (err) { console.error(err); } 
    finally { setLoading(false); }
  };

  const applyFilters = () => {
    let result = [...lessons];
    if (filters.grade !== 'all') {
      result = result.filter(l => l.grade === parseInt(filters.grade));
    }
    if (filters.search) {
      result = result.filter(l => l.title.toLowerCase().includes(filters.search.toLowerCase()));
    }
    setFilteredLessons(result);
  };

  return (
    <div className="app">
      <Header />
      <main className="home-main">
        {/* Hero Section Animated */}
        <section className="hero-modern">
          <div className="hero-content">
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 1,       // Tăng từ 0.6 lên 1 giây
                ease: "easeOut",   // Hiệu ứng trượt chậm dần khi kết thúc
                delay: 0.2         // Chờ 0.2s mới bắt đầu chạy để trang load xong hẳn
              }}
            >
              Chinh phục Toán học <br/> 
              <span className="highlight-text">Dễ dàng & Thú vị</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ 
                duration: 1, 
                delay: 0.6,       // Xuất hiện sau tiêu đề (0.2 + một chút)
                ease: "easeOut" 
              }}
            >
              Hệ thống bài giảng tương tác, trực quan giúp bạn hiểu sâu, nhớ lâu.
            </motion.p>
          </div>
          <motion.div 
            className="hero-decoration"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ 
              duration: 1.2,      // Ảnh nền hiện ra rất chậm (1.2s)
              delay: 0.4, 
              type: "spring",     // Dùng lò xo nhưng mềm
              stiffness: 50       // Độ cứng thấp (số càng nhỏ càng chậm và mượt)
            }}
          >
            Floating Math Icons or Image Here
          </motion.div>
        </section>

        {/* Filter Bar & Content */}
        <div className="content-container">
          <div className="filter-modern-bar">
            <div className="search-wrapper">
              <span className="search-icon">🔍</span>
              <input 
                type="text" 
                placeholder="Tìm kiếm bài học..." 
                value={filters.search}
                onChange={(e) => setFilters({...filters, search: e.target.value})}
              />
            </div>
            
            <div className="grade-tabs">
              {['all', '6', '7', '8', '9'].map(grade => (
                <button 
                  key={grade}
                  className={`grade-tab ${filters.grade === grade ? 'active' : ''}`}
                  onClick={() => setFilters({...filters, grade})}
                >
                  {grade === 'all' ? 'Tất cả' : `Lớp ${grade}`}
                </button>
              ))}
            </div>
          </div>

          <motion.div 
            className="lessons-grid-wrapper"
            layout
            transition={{ duration: 0.5 }}
          >
            {loading ? (
              <div className="spinner"></div>
            ) : (
              <LessonsGrid lessons={filteredLessons} loading={loading} />
            )}
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;