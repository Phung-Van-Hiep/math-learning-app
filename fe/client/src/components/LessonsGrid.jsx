import LessonCard from './LessonCard';
import './LessonsGrid.css';

const LessonsGrid = ({ lessons, loading }) => {
  if (loading) {
    return (
      <section className="lessons-grid-section">
        <div className="lessons-grid">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="lesson-card-skeleton">
              <div className="skeleton skeleton-thumbnail"></div>
              <div className="skeleton-content">
                <div className="skeleton skeleton-title"></div>
                <div className="skeleton skeleton-text"></div>
                <div className="skeleton skeleton-text-short"></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (!lessons || lessons.length === 0) {
    return (
      <section className="lessons-grid-section">
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <h3>Không tìm thấy bài học</h3>
          <p>Thử thay đổi bộ lọc hoặc tìm kiếm với từ khóa khác</p>
          <button className="reset-button">Xóa bộ lọc</button>
        </div>
      </section>
    );
  }

  return (
    <section className="lessons-grid-section">
      <div className="lessons-grid">
        {lessons.map((lesson) => (
          <LessonCard key={lesson.id} lesson={lesson} />
        ))}
      </div>

      {lessons.length >= 12 && (
        <div className="load-more-section">
          <button className="load-more-button">
            Xem thêm bài học →
          </button>
        </div>
      )}
    </section>
  );
};

export default LessonsGrid;
