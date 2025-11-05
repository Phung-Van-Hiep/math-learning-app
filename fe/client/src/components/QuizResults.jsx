import React, { useState } from 'react';
import QuizQuestion from './QuizQuestion';
import './QuizResults.css';

const QuizResults = ({ results, quiz, answers, onRetake, previousAttempts }) => {
  const [showDetailedResults, setShowDetailedResults] = useState(false);
  const { attempt, passed, correct_answers } = results;

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#16a34a';
    if (score >= 60) return '#f59e0b';
    return '#dc2626';
  };

  const getScoreEmoji = (score) => {
    if (score >= 90) return '🌟';
    if (score >= 80) return '🎉';
    if (score >= 70) return '👏';
    if (score >= 60) return '👍';
    return '💪';
  };

  const getPerformanceMessage = (score, passed) => {
    if (score >= 90) return 'Outstanding! You mastered this quiz!';
    if (score >= 80) return 'Excellent work! You did great!';
    if (score >= 70) return 'Good job! You passed with solid understanding!';
    if (score >= 60) return 'You passed! Keep practicing to improve!';
    return 'Don\'t give up! Review the material and try again!';
  };

  const correctCount = correct_answers?.filter(a => a.is_correct).length || 0;
  const totalQuestions = quiz.questions.length;

  // Get best score from previous attempts
  const allScores = [...previousAttempts.map(a => a.score), attempt.score];
  const bestScore = Math.max(...allScores);
  const isNewBest = attempt.score === bestScore && previousAttempts.length > 0;

  return (
    <div className="quiz-results">
      {/* Results Header */}
      <div className={`results-header ${passed ? 'passed' : 'failed'}`}>
        <div className="results-icon">
          {passed ? '🎉' : '📚'}
        </div>
        <h2 className="results-title">
          {passed ? 'Congratulations!' : 'Quiz Completed'}
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
            {attempt.score.toFixed(1)}%
          </div>
          <div className="score-label">Your Score</div>
        </div>

        <div className="score-details">
          <div className="score-detail-item">
            <div className="detail-icon">✓</div>
            <div className="detail-content">
              <div className="detail-label">Correct Answers</div>
              <div className="detail-value">{correctCount} / {totalQuestions}</div>
            </div>
          </div>

          <div className="score-detail-item">
            <div className="detail-icon">⭐</div>
            <div className="detail-content">
              <div className="detail-label">Points Earned</div>
              <div className="detail-value">
                {attempt.points_earned.toFixed(1)} / {attempt.total_points.toFixed(1)}
              </div>
            </div>
          </div>

          <div className="score-detail-item">
            <div className="detail-icon">⏱️</div>
            <div className="detail-content">
              <div className="detail-label">Time Spent</div>
              <div className="detail-value">{formatTime(attempt.time_spent)}</div>
            </div>
          </div>

          <div className="score-detail-item">
            <div className="detail-icon">🎯</div>
            <div className="detail-content">
              <div className="detail-label">Status</div>
              <div className="detail-value" style={{ color: passed ? '#16a34a' : '#dc2626' }}>
                {passed ? 'PASSED' : 'FAILED'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* New Best Score Badge */}
      {isNewBest && (
        <div className="new-best-badge">
          🏆 New Personal Best! 🏆
        </div>
      )}

      {/* Passing Score Info */}
      <div className="passing-score-info">
        <p>
          Passing Score: <strong>{quiz.passing_score}%</strong>
          {passed ? (
            <span className="passed-badge">✓ You passed!</span>
          ) : (
            <span className="failed-badge">
              ✗ You need {(quiz.passing_score - attempt.score).toFixed(1)}% more to pass
            </span>
          )}
        </p>
      </div>

      {/* Performance History */}
      {previousAttempts.length > 0 && (
        <div className="performance-history">
          <h3>Your Performance History</h3>
          <div className="attempts-grid">
            {[...previousAttempts, { ...attempt, is_current: true }]
              .sort((a, b) => new Date(b.submitted_at || b.started_at) - new Date(a.submitted_at || a.started_at))
              .slice(0, 5)
              .map((att, index) => (
                <div
                  key={att.id || 'current'}
                  className={`attempt-card ${att.is_current ? 'current-attempt' : ''}`}
                >
                  <div className="attempt-header">
                    <span className="attempt-number">
                      {att.is_current ? 'Latest' : `Attempt ${previousAttempts.length - index + 1}`}
                    </span>
                    {att.score === bestScore && (
                      <span className="best-badge">Best</span>
                    )}
                  </div>
                  <div className="attempt-score" style={{ color: getScoreColor(att.score) }}>
                    {att.score.toFixed(1)}%
                  </div>
                  <div className="attempt-status">
                    {att.score >= quiz.passing_score ? '✓ Passed' : '✗ Failed'}
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
            {showDetailedResults ? '▲ Hide' : '▼ Show'} Detailed Results
          </button>

          {showDetailedResults && (
            <div className="detailed-results">
              <h3>Question Review</h3>
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
          🔄 Retake Quiz
        </button>
        {passed && (
          <button
            className="btn btn-success btn-large"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            ✓ Continue Learning
          </button>
        )}
      </div>

      {/* Encouragement Message */}
      {!passed && (
        <div className="encouragement-box">
          <h4>💡 Tips for Improvement:</h4>
          <ul>
            <li>Review the lesson content carefully</li>
            <li>Pay attention to the question details</li>
            <li>Take your time to think through each answer</li>
            <li>Practice makes perfect - try again!</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default QuizResults;
