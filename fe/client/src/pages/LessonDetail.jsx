import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import lessonService from '../services/lessonService';
import QuizSection from '../components/QuizSection';
import GeoGebraInteractive from '../components/GeoGebraInteractive';
import geogebraService from '../services/geogebraService';
import './LessonDetail.css';

const LessonDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [activeSection, setActiveSection] = useState(0);
  const [completedSections, setCompletedSections] = useState(new Set());
  const [videoProgress, setVideoProgress] = useState(0);
  const [contentScrollProgress, setContentScrollProgress] = useState({});
  const [timeSpentInSeconds, setTimeSpentInSeconds] = useState(0);
  const [isManualScrolling, setIsManualScrolling] = useState(false);
  const [geoGebraList, setGeoGebraList] = useState([]);
  useEffect(() => {
    fetchLesson();
    loadLocalProgress();
  }, [slug]);

  // Load progress from localStorage (per-device backup)
  const loadLocalProgress = () => {
    if (!user) return;

    try {
      const key = `lesson_progress_${user.id}_${slug}`;
      const saved = localStorage.getItem(key);
      if (saved) {
        const data = JSON.parse(saved);
        if (data.completedSections) {
          setCompletedSections(new Set(data.completedSections));
        }
        if (data.progress) {
          setProgress(data.progress);
        }
      }
    } catch (error) {
      console.error('Error loading local progress:', error);
    }
  };

  // Save progress to localStorage (per-device backup)
  const saveLocalProgress = (progressData) => {
    if (!user) return;

    try {
      const key = `lesson_progress_${user.id}_${slug}`;
      localStorage.setItem(key, JSON.stringify({
        completedSections: Array.from(progressData.completedSections),
        progress: progressData.progress,
        timestamp: new Date().toISOString()
      }));
    } catch (error) {
      console.error('Error saving local progress:', error);
    }
  };

  // Time tracking effect - increments every second while page is active
  useEffect(() => {
    if (!lesson || !user) return;

    const timer = setInterval(() => {
      setTimeSpentInSeconds(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [lesson, user]);

  // Auto-save progress periodically (every 30 seconds)
  useEffect(() => {
    if (!lesson || !user || progress === 0) return;

    const autoSaveTimer = setInterval(() => {
      saveProgressToBackend();
    }, 30000); // 30 seconds

    return () => clearInterval(autoSaveTimer);
  }, [lesson, user, progress]);

  // Scroll tracking effect - updates active section based on scroll position
  useEffect(() => {
    if (!lesson) return;

    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -70% 0px', // Trigger when section enters top 20% of viewport
      threshold: 0
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        // 🚨 THÊM ĐIỀU KIỆN KIỂM TRA MỚI:
        if (isManualScrolling) {
            return; // Bỏ qua cập nhật nếu đang cuộn thủ công
        }
        
        if (entry.isIntersecting) {
          const sectionId = entry.target.id;
          const index = parseInt(sectionId.split('-')[1]);
          if (!isNaN(index)) {
            setActiveSection(index);
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Observe all section elements
    const sectionElements = document.querySelectorAll('[id^="section-"]');
    sectionElements.forEach((element) => observer.observe(element));

    // Cleanup
    return () => {
      sectionElements.forEach((element) => observer.unobserve(element));
    };
  }, [lesson,isManualScrolling]);

  const fetchLesson = async () => {
    try {
      setLoading(true);

      // Fetch lesson with progress from backend
      const data = user
        ? await lessonService.getLessonWithProgress(slug)
        : await lessonService.getLessonBySlug(slug);

      setLesson(data);

      try {
        const ggbData = await geogebraService.getByLesson(data.id);
        setGeoGebraList(ggbData);
      } catch (err) {
        console.error("Lỗi tải GeoGebra:", err);
      }

      // Load saved progress from backend
      if (user && data.progress !== undefined) {
        setProgress(data.progress);

        // Load completed sections from backend if available
        if (data.completed_sections && Array.isArray(data.completed_sections)) {
          setCompletedSections(new Set(data.completed_sections));
          console.log('✓ Loaded progress from backend:', {
            progress: data.progress + '%',
            sections: data.completed_sections.length
          });
        } else {
          // Fallback: estimate based on progress percentage
          const sections = data.content_blocks || [
            { id: 0, type: 'intro' },
            { id: 1, type: 'video' },
            { id: 2, type: 'content' },
            { id: 3, type: 'quiz' }
          ];

          const numToComplete = Math.floor((data.progress / 100) * sections.length);
          const completed = new Set();
          for (let i = 0; i < numToComplete; i++) {
            completed.add(sections[i].id);
          }
          setCompletedSections(completed);
        }
      }

      // Load from content_blocks if available
      if (data.content_blocks) {
        const completed = data.content_blocks.filter(block => block.completed).length;
        if (completed > 0) {
          setProgress(Math.round((completed / data.content_blocks.length) * 100));
          setCompletedSections(new Set(data.content_blocks.filter(b => b.completed).map(b => b.id)));
        }
      }
    } catch (error) {
      console.error('Error fetching lesson:', error);
      toast.error('Không thể tải bài học');
    } finally {
      setLoading(false);
    }
  };

  const handleSectionClick = (index) => {
    setActiveSection(index);
    const element = document.getElementById(`section-${index}`);
    if (element) {
        // 1. Bật cờ báo hiệu cuộn thủ công
        setIsManualScrolling(true); 

        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        // 2. Tắt cờ sau một khoảng thời gian đủ cho quá trình cuộn mượt (ví dụ: 800ms)
        // Độ dài thời gian này cần lớn hơn thời gian cuộn mượt tối đa của bạn
        setTimeout(() => {
            setIsManualScrolling(false);
        }, 800); 
    }
};

  // Auto-scroll sidebar to show active item
  useEffect(() => {
    const activeSidebarItem = document.querySelector('.sidebar-item.active');
    if (activeSidebarItem) {
      activeSidebarItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [activeSection]);

  // Calculate overall progress based on multiple factors
  const calculateProgress = (newCompletedSections) => {
    if (!lesson) return 0;

    const sections = lesson.content_blocks || [
      { id: 0, type: 'intro' },
      { id: 1, type: 'video' },
      { id: 2, type: 'content' },
      { id: 3, type: 'quiz' },
      { id:4, type: 'geogebra'}
    ];

    // Weight different section types
    const weights = {
      intro: 10,
      video: 30,
      content: 40,
      quiz: 20
    };

    let totalWeight = 0;
    let completedWeight = 0;

    sections.forEach((section) => {
      const weight = weights[section.type] || 25;
      totalWeight += weight;

      if (newCompletedSections.has(section.id)) {
        completedWeight += weight;
      } else if (section.type === 'video' && videoProgress > 0) {
        // Partial credit for video watching
        completedWeight += (videoProgress / 100) * weight;
      } else if (section.type === 'content' && contentScrollProgress[section.id]) {
        // Partial credit for content scrolling
        completedWeight += contentScrollProgress[section.id] * weight;
      }
    });

    return Math.min(Math.round((completedWeight / totalWeight) * 100), 100);
  };

  // Save progress to backend
  const saveProgressToBackend = async () => {
    if (!user || !lesson) return;

    try {
      // Convert Set to Array for API
      const sectionsArray = Array.from(completedSections);

      await lessonService.updateProgress(
        lesson.id,
        progress,
        sectionsArray,
        timeSpentInSeconds
      );

      // Also save to localStorage
      saveLocalProgress({
        completedSections,
        progress
      });

      console.log('✓ Progress saved:', {
        progress: progress + '%',
        sections: sectionsArray.length,
        time: Math.floor(timeSpentInSeconds / 60) + 'min'
      });
    } catch (error) {
      console.error('Error saving progress:', error);
      // Even if backend fails, save to localStorage
      saveLocalProgress({
        completedSections,
        progress
      });
    }
  };

  const handleMarkComplete = async (sectionIndex) => {
    const newCompleted = new Set(completedSections);
    newCompleted.add(sectionIndex);
    setCompletedSections(newCompleted);

    const newProgress = calculateProgress(newCompleted);
    setProgress(newProgress);

    // Save to localStorage immediately
    saveLocalProgress({
      completedSections: newCompleted,
      progress: newProgress
    });

    // Update progress on backend immediately when marking complete
    if (user && lesson) {
      try {
        const sectionsArray = Array.from(newCompleted);
        await lessonService.updateProgress(
          lesson.id,
          newProgress,
          sectionsArray,
          timeSpentInSeconds
        );
        console.log('✓ Progress saved to backend:', newProgress + '%');
      } catch (error) {
        console.error('Error updating progress:', error);
        // Progress is still saved in localStorage
      }
    }
  };

  const handlePreviousSection = () => {
    if (activeSection > 0) {
      handleSectionClick(activeSection - 1);
    }
  };

  const handleNextSection = () => {
    if (activeSection < sections.length - 1) {
      handleSectionClick(activeSection + 1);
      // Auto-mark previous section as complete
      if (!completedSections.has(activeSection)) {
        handleMarkComplete(activeSection);
      }
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Đang tải bài học...</p>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="error-container">
        <h2>Không tìm thấy bài học</h2>
        <button onClick={() => navigate('/')}>Quay lại trang chủ</button>
      </div>
    );
  }

  // Parse content blocks from lesson content or create default structure
  let builtSections = [
    { 
      type: 'intro', 
      title: 'Giới thiệu', 
      content: lesson.description || '', 
      icon: '📚' 
    },
    { 
      type: 'video', 
      title: 'Video bài giảng', 
      content: lesson.video_url || '', 
      icon: '🎥' 
    },
    { 
      type: 'content', 
      title: 'Nội dung chi tiết', 
      content: lesson.content || '', 
      icon: '📝' 
    }
  ];

  // 2. Chèn thêm các hình GeoGebra (Lấy từ API) vào danh sách
  // geoGebraList là state bạn vừa thêm ở bước trước
  if (geoGebraList && geoGebraList.length > 0) {
    const ggbSections = geoGebraList.map((ggb) => ({
      type: 'geogebra',
      title: ggb.title,        // Tiêu đề hình
      base64: ggb.ggb_base64,  // Dữ liệu hình
      icon: '📐'
    }));
    
    // Nối danh sách hình vào sau phần Nội dung chi tiết
    builtSections = [...builtSections, ...ggbSections];
  }

  // 3. Thêm bài Kiểm tra (Quiz) vào cuối cùng
  builtSections.push({
    type: 'quiz',
    title: 'Bài kiểm tra',
    content: '',
    icon: '✅'
  });

  // 4. Đánh lại số thứ tự ID (0, 1, 2, 3...) để Sidebar hoạt động đúng
  // Bước này RẤT QUAN TRỌNG để khi click sidebar nó cuộn đến đúng chỗ
  const sections = builtSections.map((section, index) => ({
    ...section,
    id: index 
  }));

  const getSectionIcon = (section) => {
    if (completedSections.has(section.id)) return '✅';
    if (activeSection === section.id) return '→';
    return '○';
  };

  const renderContentBlock = (section, index) => {
    switch (section.type) {
      case 'intro':
        return (
          <div className="content-block intro-block">
            <div className="block-header">
              <div className="block-title">
                <span className="block-icon">📚</span>
                <h2>GIỚI THIỆU BÀI HỌC</h2>
              </div>
            </div>
            <div className="block-divider"></div>
            <div className="block-content">
              <p>{section.content}</p>

              <div className="lesson-meta">
                <div className="meta-section">
                  <h3>🎯 MỤC TIÊU HỌC TẬP</h3>
                  <div className="objectives">
                    <div className="objective-group">
                      <strong>Kiến thức:</strong>
                      <ul>
                        <li>Hiểu được khái niệm cơ bản</li>
                        <li>Nắm vững lý thuyết</li>
                      </ul>
                    </div>
                    <div className="objective-group">
                      <strong>Kỹ năng:</strong>
                      <ul>
                        <li>Giải các bài tập cơ bản</li>
                        <li>Vận dụng vào thực tế</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="meta-section">
                  <h3>⏱ THỜI GIAN DỰ KIẾN</h3>
                  <p>{lesson.duration} phút</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'video':
        return (
          <div className="content-block video-block">
            <div className="block-header">
              <div className="block-title">
                <span className="block-icon">🎥</span>
                <h2>VIDEO BÀI GIẢNG</h2>
              </div>
            </div>
            <div className="block-divider"></div>
            <div className="block-content">
              {section.content ? (
                <div className="video-container">
                  <iframe
                    src={getEmbedUrl(section.content)}
                    title={section.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    onLoad={(e) => {
                      // Track when video iframe is loaded
                      console.log('Video loaded');
                    }}
                  ></iframe>
                  {videoProgress < 100 && (
                    <div className="video-progress-hint">
                      <p>💡 Xem hết video để tự động đánh dấu hoàn thành phần này</p>
                      <div className="video-progress-bar">
                        <div className="video-progress-fill" style={{ width: `${videoProgress}%` }}></div>
                      </div>
                      <span className="video-progress-text">{videoProgress}% đã xem</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="no-video">
                  <p>Chưa có video cho phần này</p>
                </div>
              )}

              <div className="video-meta">
                <p>💡 <strong>ĐIỂM CHÍNH:</strong></p>
                <ul>
                  <li>Theo dõi video để hiểu rõ khái niệm</li>
                  <li>Có thể tạm dừng và ghi chú khi cần</li>
                  <li>Xem lại nhiều lần để nắm vững</li>
                </ul>
                {videoProgress >= 80 && !completedSections.has(section.id) && (
                  <button
                    className="auto-complete-btn"
                    onClick={() => handleMarkComplete(section.id)}
                  >
                    ✓ Bạn đã xem video - Click để hoàn thành phần này
                  </button>
                )}
              </div>
            </div>
          </div>
        );

      case 'content':
        return (
          <div className="content-block text-block">
            <div className="block-header">
              <div className="block-title">
                <span className="block-icon">📝</span>
                <h2>NỘI DUNG CHI TIẾT</h2>
              </div>
            </div>
            <div className="block-divider"></div>
            <div
              className="block-content rich-content"
              dangerouslySetInnerHTML={{ __html: section.content || '<p>Nội dung đang được cập nhật...</p>' }}
            />
          </div>
        );
        case 'geogebra':
        return (
          <div className="content-block geogebra-block">
            <div className="block-header">
              <div className="block-title">
                <span className="block-icon">📐</span>
                {/* Sử dụng title thực tế của hình */}
                <h2>{section.title || 'HOẠT ĐỘNG TƯƠNG TÁC'}</h2>
              </div>
            </div>
            <div className="block-divider"></div>
            <div className="block-content">
              {section.base64 ? (
                <GeoGebraInteractive
                  title={section.title}
                  base64={section.base64} // Truyền đúng props base64
                  width="100%"
                  height={600}
                />
              ) : (
                <div className="no-video">
                  <p>Đang tải hình ảnh...</p>
                </div>
              )}
            </div>
          </div>
        );

      case 'quiz':
        return (
          <div className="content-block quiz-block">
            <div className="block-header">
              <div className="block-title">
                <span className="block-icon">📝</span>
                <h2>BÀI KIỂM TRA</h2>
              </div>
            </div>
            <div className="block-divider"></div>
            <div className="block-content">
              <QuizSection
                lessonId={lesson.id}
                onQuizComplete={(results) => {
                  // Mark quiz section as complete if passed
                  if (results.passed && !completedSections.has(section.id)) {
                    handleMarkComplete(section.id);
                  }
                }}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const getEmbedUrl = (url) => {
    if (!url) return '';

    // YouTube
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId = url.includes('youtu.be')
        ? url.split('youtu.be/')[1]?.split('?')[0]
        : url.split('v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }

    // Google Drive
    if (url.includes('drive.google.com')) {
      const fileId = url.match(/[-\w]{25,}/);
      return fileId ? `https://drive.google.com/file/d/${fileId[0]}/preview` : url;
    }

    return url;
  };

  const timeSpentMinutes = Math.floor(timeSpentInSeconds / 60);
  const displayTimeSpent = timeSpentMinutes > lesson.duration ? lesson.duration : timeSpentMinutes;

  return (
    <div className="lesson-detail">
      {/* Lesson Header - Si ngle Row */}
      <div className="lesson-header">
        <div className="header-content">
          <button className="back-button" onClick={() => navigate('/')}>
            ← Quay lại
          </button>
          <h1 className="lesson-title">{lesson.title}</h1>
          <div className="lesson-metadata">
            <span className="metadata-item">Lớp {lesson.grade}</span>
            <span className="metadata-separator">•</span>
            <span className="metadata-item">{lesson.duration} phút</span>
            <span className="metadata-separator">•</span>
            <span className="progress-badge">{progress}%</span>
          </div>
        </div>
      </div>

      <div className="lesson-container">
        {/* Sidebar */}
        <aside className="lesson-sidebar">
          <div className="sidebar-header">
            <h3>📖 MỤC LỤC</h3>
          </div>
          <div className="sidebar-content">
            {sections.map((section, index) => (
              <div
                key={index}
                className={`sidebar-item ${activeSection === index ? 'active' : ''}`}
                onClick={() => handleSectionClick(index)}
              >
                <span className="section-status">{getSectionIcon(section)}</span>
                <span className="section-number">{index + 1}.</span>
                <span className="section-title">{section.title}</span>
              </div>
            ))}
          </div>
          <div className="sidebar-footer">
            <div className="progress-summary">
              <div className="progress-title">Tiến độ học tập</div>
              <div className="progress-bar-container">
                <div className="progress-bar-sidebar">
                  <div className="progress-fill-sidebar" style={{ width: `${progress}%` }}></div>
                </div>
                <span className="progress-percentage">{progress}%</span>
              </div>
              <div className="progress-details">
                <div className="progress-detail-item">
                  ✓ Hoàn thành: {completedSections.size}/{sections.length} phần
                </div>
                <div className="progress-detail-item">
                  ⏱ Thời gian học: {displayTimeSpent} phút
                </div>
                {user && progress > 0 && (
                  <div className="progress-detail-item">
                    💾 Tiến độ được lưu tự động
                  </div>
                )}
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="lesson-main">
          {sections.map((section, index) => (
            <section
              key={index}
              id={`section-${index}`}
              className="content-section"
            >
              {renderContentBlock(section, index)}

              {!completedSections.has(section.id) && (
                <button
                  className="mark-complete-btn"
                  onClick={() => handleMarkComplete(section.id)}
                >
                  ✓ Đánh dấu hoàn thành
                </button>
              )}
            </section>
          ))}

          {/* Navigation Buttons */}
          <div className="section-navigation">
            <button
              className="nav-btn prev-btn"
              onClick={handlePreviousSection}
              disabled={activeSection === 0}
            >
              ← Phần trước
              {activeSection > 0 && <span className="nav-title">: {sections[activeSection - 1].title}</span>}
            </button>
            <button
              className="nav-btn next-btn"
              onClick={handleNextSection}
              disabled={activeSection === sections.length - 1}
            >
              Phần sau
              {activeSection < sections.length - 1 && <span className="nav-title">: {sections[activeSection + 1].title}</span>}
              →
            </button>
          </div>

          {/* Completion Message */}
          {progress === 100 && (
            <div className="completion-section">
              <div className="completion-icon">🎉</div>
              <h2>Chúc mừng! Bạn đã hoàn thành bài học!</h2>
              <p>Bạn thấy bài học này thế nào?</p>
              <div className="rating-stars">
                {[1, 2, 3, 4, 5].map(star => (
                  <span key={star} className="star">⭐</span>
                ))}
              </div>
              <textarea
                className="review-text"
                placeholder="Viết nhận xét của bạn..."
                rows="4"
              />
              <div className="completion-actions">
                <button className="btn-secondary">Bỏ qua</button>
                <button className="btn-primary">Gửi đánh giá</button>
              </div>
              <div className="completion-navigation">
                <button onClick={() => navigate('/')}>← Về trang chủ</button>
                <button>Bài học tiếp theo →</button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default LessonDetail;
