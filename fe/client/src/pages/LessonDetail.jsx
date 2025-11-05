import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import lessonService from '../services/lessonService';
import QuizSection from '../components/QuizSection';
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

  useEffect(() => {
    fetchLesson();
  }, [slug]);

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
        if (entry.isIntersecting) {
          // Extract section index from element id (format: "section-0", "section-1", etc.)
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
  }, [lesson]);

  const fetchLesson = async () => {
    try {
      setLoading(true);
      const data = await lessonService.getLessonBySlug(slug);
      setLesson(data);

      // Calculate progress from completed sections
      if (data.content_blocks) {
        const completed = data.content_blocks.filter(block => block.completed).length;
        setProgress(Math.round((completed / data.content_blocks.length) * 100));
        setCompletedSections(new Set(data.content_blocks.filter(b => b.completed).map(b => b.id)));
      }
    } catch (error) {
      console.error('Error fetching lesson:', error);
      alert('Không thể tải bài học');
    } finally {
      setLoading(false);
    }
  };

  const handleSectionClick = (index) => {
    setActiveSection(index);
    // Smooth scroll to section
    const element = document.getElementById(`section-${index}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Auto-scroll sidebar to show active item
  useEffect(() => {
    const activeSidebarItem = document.querySelector('.sidebar-item.active');
    if (activeSidebarItem) {
      activeSidebarItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [activeSection]);

  const handleMarkComplete = async (sectionIndex) => {
    const newCompleted = new Set(completedSections);
    newCompleted.add(sectionIndex);
    setCompletedSections(newCompleted);

    const newProgress = Math.round((newCompleted.size / sections.length) * 100);
    setProgress(newProgress);

    // Update progress on backend
    if (user) {
      try {
        await lessonService.updateProgress(lesson.id, newProgress);
      } catch (error) {
        console.error('Error updating progress:', error);
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
  const sections = lesson.content_blocks || [
    {
      id: 0,
      type: 'intro',
      title: 'Giới thiệu',
      content: lesson.description || '',
      icon: '📚'
    },
    {
      id: 1,
      type: 'video',
      title: 'Video bài giảng',
      content: lesson.video_url || '',
      icon: '🎥'
    },
    {
      id: 2,
      type: 'content',
      title: 'Nội dung chi tiết',
      content: lesson.content || '',
      icon: '📝'
    },
    {
      id: 3,
      type: 'quiz',
      title: 'Bài kiểm tra',
      content: '',
      icon: '📝'
    }
  ];

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
                  ></iframe>
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

  const timeSpent = Math.floor((progress / 100) * lesson.duration);

  return (
    <div className="lesson-detail">
      {/* Lesson Header - Single Row */}
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
                  ⏱ Thời gian: {timeSpent}/{lesson.duration} phút
                </div>
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
