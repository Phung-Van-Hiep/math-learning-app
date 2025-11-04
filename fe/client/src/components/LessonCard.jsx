import './LessonCard.css';

const LessonCard = ({ lesson }) => {
  const {
    title,
    thumbnail,
    grade,
    duration,
    rating,
    reviewCount,
    difficulty,
    progress,
    slug
  } = lesson;

  // Determine button text and style based on progress
  const getButtonInfo = () => {
    if (progress === 0) {
      return { text: 'Bắt đầu học →', className: 'start' };
    } else if (progress === 100) {
      return { text: '✓ Xem lại', className: 'completed' };
    } else {
      return { text: 'Tiếp tục học →', className: 'continue' };
    }
  };

  const buttonInfo = getButtonInfo();

  // Generate progress dots (8 dots total)
  const renderProgressDots = () => {
    const totalDots = 8;
    const filledDots = Math.round((progress / 100) * totalDots);

    return (
      <div className="progress-dots">
        {[...Array(totalDots)].map((_, index) => (
          <span
            key={index}
            className={`dot ${index < filledDots ? 'filled' : 'empty'}`}
          >
            ●
          </span>
        ))}
        <span className="progress-percentage">{progress}%</span>
      </div>
    );
  };

  // Render star rating
  const renderStars = () => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    return (
      <div className="rating-stars">
        {[...Array(fullStars)].map((_, index) => (
          <span key={index} className="star filled">⭐</span>
        ))}
        {hasHalfStar && <span className="star half">⭐</span>}
      </div>
    );
  };

  // Get difficulty badge class
  const getDifficultyClass = () => {
    switch (difficulty) {
      case 'easy':
        return 'easy';
      case 'medium':
        return 'medium';
      case 'hard':
        return 'hard';
      default:
        return 'medium';
    }
  };

  const getDifficultyLabel = () => {
    switch (difficulty) {
      case 'easy':
        return 'Dễ';
      case 'medium':
        return 'Trung bình';
      case 'hard':
        return 'Khó';
      default:
        return 'Trung bình';
    }
  };

  const handleCardClick = () => {
    // Navigate to lesson detail page
    window.location.href = `/lessons/${slug}`;
  };

  return (
    <div className="lesson-card" onClick={handleCardClick}>
      <div className="card-thumbnail">
        <img src={thumbnail} alt={title} />
        <div className="thumbnail-overlay">
          <span>Xem chi tiết</span>
        </div>
      </div>

      <div className="card-content">
        <h3 className="card-title">
          📚 {title}
        </h3>

        <div className="card-metadata">
          <span>Lớp {grade}</span>
          <span className="separator">•</span>
          <span>⏱ {duration} phút</span>
        </div>

        <div className="card-rating">
          {renderStars()}
          <span className="rating-number">{rating}</span>
          <span className="rating-count">({reviewCount})</span>
        </div>

        <div className={`difficulty-badge ${getDifficultyClass()}`}>
          🎯 Độ khó: {getDifficultyLabel()}
        </div>

        <div className="progress-section">
          {renderProgressDots()}
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        <button
          className={`cta-button ${buttonInfo.className}`}
          onClick={(e) => {
            e.stopPropagation();
            handleCardClick();
          }}
        >
          {buttonInfo.text}
        </button>
      </div>
    </div>
  );
};

export default LessonCard;
