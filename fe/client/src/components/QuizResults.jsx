import React, { useState } from 'react';
import QuizQuestion from './QuizQuestion';
import './QuizResults.css';

const QuizResults = ({ results, quiz, answers, onRetake, previousAttempts }) => {
  const [showDetailedResults, setShowDetailedResults] = useState(false);
  const { attempt, passed, correct_answers } = results;

  // Format thời gian: 120s -> 2m 00s
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}p ${secs}s`;
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#16a34a'; // Xanh lá
    if (score >= 60) return '#f59e0b'; // Cam
    return '#dc2626'; // Đỏ
  };

  const getScoreEmoji = (score) => {
    if (score >= 90) return '🌟';
    if (score >= 80) return '🎉';
    if (score >= 70) return '👏';
    if (score >= 60) return '👍';
    return '💪';
  };

  const getPerformanceMessage = (score, passed) => {
    if (score >= 90) return 'Tuyệt vời! Bạn đã nắm vững kiến thức!';
    if (score >= 80) return 'Làm tốt lắm! Kết quả rất ấn tượng!';
    if (score >= 70) return 'Khá tốt! Bạn đã hiểu bài học!';
    if (score >= 60) return 'Chúc mừng! Bạn đã vượt qua bài kiểm tra!';
    return 'Đừng nản lòng! Hãy ôn tập lại và thử lại nhé!';
  };

  const correctCount = correct_answers?.filter(a => a.is_correct).length || 0;
  const totalQuestions = quiz.questions.length;

  // Tìm điểm cao nhất trong các lần làm bài trước + lần này
  const allScores = [...previousAttempts.map(a => a.score), attempt.score];
  const bestScore = Math.max(...allScores);
  // Kiểm tra xem lần này có phải kỷ lục mới không
  const isNewBest = attempt.score === bestScore && previousAttempts.length > 0;

  return (
    <div className="quiz-results">
      {/* Results Header */}
      <div className={`results-header ${passed ? 'passed' : 'failed'}`}>
        <div className="results-icon">
          {passed ? '🎉' : '📚'}
        </div>
        <h2 className="results-title">
          {passed ? 'Chúc mừng bạn!' : 'Hoàn thành bài thi'}
        </h2>
        <p className="results-message">
          {getPerformanceMessage(attempt.score, passed)}
        </p>
      </div>

      {/* Score Display */}
      <div className="score-display">
        <div className="score-circle" style={{ borderColor: getScoreColor(attempt.score) }}>
          <div className="score-emoji">{getScoreEmoji(attempt.score)}</div>
          <div className="score-value" style={{ color: getScoreColor(attempt.score) }}>
            {Math.round(attempt.score)}%
          </div>
          <div className="score-label">Điểm số</div>
        </div>

        <div className="score-details">
          <div className="score-detail-item">
            <div className="detail-icon">✓</div>
            <div className="detail-content">
              <div className="detail-label">Số câu đúng</div>
              <div className="detail-value">{correctCount} / {totalQuestions}</div>
            </div>
          </div>

          <div className="score-detail-item">
            <div className="detail-icon">⭐</div>
            <div className="detail-content">
              <div className="detail-label">Điểm đạt được</div>
              <div className="detail-value">
                {attempt.points_earned.toFixed(1)} / {attempt.total_points.toFixed(1)}
              </div>
            </div>
          </div>

          <div className="score-detail-item">
            <div className="detail-icon">⏱️</div>
            <div className="detail-content">
              <div className="detail-label">Thời gian làm</div>
              <div className="detail-value">{formatTime(attempt.time_spent)}</div>
            </div>
          </div>

          <div className="score-detail-item">
            <div className="detail-icon">🎯</div>
            <div className="detail-content">
              <div className="detail-label">Kết quả</div>
              <div className="detail-value" style={{ color: passed ? '#16a34a' : '#dc2626' }}>
                {passed ? 'ĐẠT' : 'CHƯA ĐẠT'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* New Best Score Badge */}
      {isNewBest && (
        <div className="new-best-badge">
          🏆 Kỷ lục mới! Bạn vừa đạt điểm cao nhất từ trước tới nay! 🏆
        </div>
      )}

      {/* Passing Score Info */}
      <div className="passing-score-info">
        <p>
          Điểm yêu cầu: <strong>{quiz.passing_score}%</strong>
          {passed ? (
            <span className="passed-badge">✓ Bạn đã qua môn!</span>
          ) : (
            <span className="failed-badge">
              ✗ Bạn cần thêm {(quiz.passing_score - attempt.score).toFixed(1)}% nữa để qua
            </span>
          )}
        </p>
      </div>

      {/* Performance History */}
      {previousAttempts.length > 0 && (
        <div className="performance-history">
          <h3>Lịch sử làm bài</h3>
          <div className="attempts-grid">
            {[...previousAttempts, { ...attempt, is_current: true }]
              .sort((a, b) => new Date(b.submitted_at || b.started_at) - new Date(a.submitted_at || a.started_at))
              .slice(0, 5) // Lấy 5 lần gần nhất
              .map((att, index) => (
                <div
                  key={att.id || 'current'}
                  className={`attempt-card ${att.is_current ? 'current-attempt' : ''}`}
                >
                  <div className="attempt-header">
                    <span className="attempt-number">
                      {att.is_current ? 'Mới nhất' : `Lần ${previousAttempts.length - index + 1}`}
                    </span>
                    {att.score === bestScore && (
                      <span className="best-badge">Cao nhất</span>
                    )}
                  </div>
                  <div className="attempt-score" style={{ color: getScoreColor(att.score) }}>
                    {Math.round(att.score)}%
                  </div>
                  <div className="attempt-status">
                    {att.score >= quiz.passing_score ? '✓ Đạt' : '✗ Trượt'}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Detailed Results Toggle */}
      {correct_answers && quiz.show_answers && (
        <div className="detailed-results-section">
          <button
            className="btn btn-outline"
            onClick={() => setShowDetailedResults(!showDetailedResults)}
          >
            {showDetailedResults ? '▲ Ẩn chi tiết' : '▼ Xem đáp án chi tiết'}
          </button>

          {showDetailedResults && (
            <div className="detailed-results">
              <h3>Xem lại bài làm</h3>
              <div className="questions-review">
                {quiz.questions.map((question, index) => {
                  const correctAnswer = correct_answers.find(
                    ca => ca.question_id === question.id
                  );
                  return (
                    <QuizQuestion
                      key={question.id}
                      question={question}
                      questionNumber={index + 1}
                      selectedAnswer={answers[question.id]}
                      showResult={true}
                      correctAnswer={correctAnswer}
                    />
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="results-actions">
        <button
          className="btn btn-primary btn-large"
          onClick={onRetake}
        >
          🔄 Làm lại bài thi
        </button>
        {passed && (
          <button
            className="btn btn-success btn-large"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            ✓ Học tiếp bài sau
          </button>
        )}
      </div>

      {/* Encouragement Message */}
      {!passed && (
        <div className="encouragement-box">
          <h4>💡 Mẹo để cải thiện điểm số:</h4>
          <ul>
            <li>Xem lại kỹ nội dung bài giảng và video.</li>
            <li>Đọc kỹ câu hỏi trước khi chọn đáp án.</li>
            <li>Đừng vội vàng, hãy suy nghĩ thật kỹ.</li>
            <li>Làm bài nhiều lần giúp bạn nhớ lâu hơn!</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default QuizResults;