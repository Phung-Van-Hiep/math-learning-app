import './QuickStats.css';

const QuickStats = ({ stats }) => {
  const defaultStats = {
    totalLessons: 12,
    completedLessons: 7,
    averageScore: 8.5
  };

  const displayStats = stats || defaultStats;

  return (
    <section className="quick-stats">
      <div className="stats-container">
        <div className="stat-card">
          <div className="stat-icon">📚</div>
          <div className="stat-number">{displayStats.totalLessons}</div>
          <div className="stat-label">Có sẵn</div>
          <div className="stat-title">BÀI HỌC</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-number">{displayStats.completedLessons}</div>
          <div className="stat-label">Hoàn thành</div>
          <div className="stat-title">ĐÃ HỌC</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🏆</div>
          <div className="stat-number">{displayStats.averageScore}</div>
          <div className="stat-label">Trung bình</div>
          <div className="stat-title">ĐIỂM</div>
        </div>
      </div>
    </section>
  );
};

export default QuickStats;
