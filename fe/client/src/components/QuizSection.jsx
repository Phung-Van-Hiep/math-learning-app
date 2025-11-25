import React, { useState, useEffect } from 'react';
import QuizQuestion from './QuizQuestion';
import QuizResults from './QuizResults';
import quizService from '../services/quizService';
import './QuizSection.css';
import { toast } from 'react-toastify';
const QuizSection = ({ lessonId, onQuizComplete }) => {
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isStarted, setIsStarted] = useState(false);
  const [error, setError] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeSpent, setTimeSpent] = useState(0);
  const [quizStartTime, setQuizStartTime] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quizResults, setQuizResults] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [previousAttempts, setPreviousAttempts] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  // Load quiz and previous attempts
  useEffect(() => {
    loadQuiz();
  }, [lessonId]);

  // Timer
  useEffect(() => {
    if (isStarted && quizStartTime && !showResults) {
      const interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - quizStartTime) / 1000);
        setTimeSpent(elapsed);

        // Auto-submit nếu hết giờ
        if (quiz?.duration && elapsed >= quiz.duration * 60) {
          handleSubmit();
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isStarted, quizStartTime, showResults, quiz]);

  const loadQuiz = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load quiz
      const quizData = await quizService.getLessonQuiz(lessonId);
      setQuiz(quizData);

      // Load previous attempts
      try {
        const attempts = await quizService.getMyAttempts(quizData.id);
        setPreviousAttempts(attempts);
      } catch (err) {
        console.log('No previous attempts found');
      }

      // Start timer
      // setQuizStartTime(Date.now());
    } catch (err) {
      console.error('Error loading quiz:', err);
      setError(err.response?.data?.detail || 'No quiz available for this lesson');
    } finally {
      setLoading(false);
    }
  };

  const handleStartQuiz = () => {
    setIsStarted(true);
    setQuizStartTime(Date.now());
    setTimeSpent(0);
  };

  const handleAnswerChange = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handlePreSubmit = () => {
    const unansweredCount = quiz.questions.filter(
      q => !answers[q.id] || answers[q.id] === ''
    ).length;

    if (unansweredCount > 0) {
      // Nếu còn câu chưa làm -> Mở Modal
      setShowConfirmModal(true);
    } else {
      // Nếu làm hết rồi -> Nộp luôn
      submitQuizData();
    }
  };
  const submitQuizData = async () => {
    try {
      setIsSubmitting(true);
      setShowConfirmModal(false); // Đóng modal nếu đang mở

      const submitData = {
        answers: answers,
        time_spent: timeSpent
      };

      const results = await quizService.submitQuiz(quiz.id, submitData);
      setQuizResults(results);
      setShowResults(true);
      setIsStarted(false);
      
      if (onQuizComplete) {
        onQuizComplete(results);
      }
    } catch (err) {
      console.error('Error submitting quiz:', err);
      toast.error('Không nộp được bài kiểm tra. Vui lòng thử lại');
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleRetake = () => {
    setAnswers({});
    setCurrentQuestionIndex(0);
    setTimeSpent(0);
    setQuizStartTime(Date.now());
    setShowResults(false);
    setQuizResults(null);
    setIsStarted(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getAnsweredCount = () => {
    return Object.values(answers).filter(a => a !== null && a !== '').length;
  };

  const getProgressPercentage = () => {
    return Math.round((getAnsweredCount() / quiz.questions.length) * 100);
  };

  if (loading) {
    return (
      <div className="quiz-section loading">
        <div className="spinner"></div>
        <p>Loading quiz...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="quiz-section error">
        <div className="error-icon">📝</div>
        <h3>No Quiz Available</h3>
        <p>{error}</p>
      </div>
    );
  }

  if (showResults && quizResults) {
    return (
      <QuizResults
        results={quizResults}
        quiz={quiz}
        answers={answers}
        onRetake={handleRetake}
        previousAttempts={previousAttempts}
      />
    );
  }
  if (!isStarted) {
    return (
      <div className="quiz-section start-screen">
        <div className="quiz-header-center">
          <h2>📝 {quiz.title}</h2>
          {quiz.description && <p className="quiz-desc">{quiz.description}</p>}
        </div>
        
        <div className="quiz-info-grid">
          <div className="info-card">
            <span className="icon">⏱️</span>
            <span className="label">Thời gian</span>
            <span className="value">{quiz.duration} phút</span>
          </div>
          <div className="info-card">
            <span className="icon">❓</span>
            <span className="label">Số câu hỏi</span>
            <span className="value">{quiz.questions.length} câu</span>
          </div>
          <div className="info-card">
            <span className="icon">🎯</span>
            <span className="label">Điểm đạt</span>
            <span className="value">{quiz.passing_score}</span>
          </div>
        </div>

        {previousAttempts.length > 0 && (
          <div className="history-alert">
            Bạn đã làm bài này {previousAttempts.length} lần. 
            Điểm cao nhất: <strong>{Math.max(...previousAttempts.map(a => a.score)).toFixed(1)}</strong>
          </div>
        )}

        <button className="btn-start-quiz" onClick={handleStartQuiz}>
          Bắt đầu làm bài ►
        </button>
      </div>
    );
  }
  if (!quiz || !quiz.questions || quiz.questions.length === 0) {
    return (
      <div className="quiz-section error">
        <div className="error-icon">📭</div>
        <h3>Bài kiểm tra chưa có câu hỏi</h3>
        <p>Vui lòng liên hệ giáo viên hoặc quay lại sau.</p>
        <button className="btn btn-secondary" onClick={handleRetake}>Quay lại</button>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;

  return (
    <div className="quiz-section">
      {/* Quiz Header */}
      <div className="quiz-header">
        <div className="quiz-title-section">
          <h2>{quiz.title}</h2>
          {quiz.description && <p className="quiz-description">{quiz.description}</p>}
        </div>

        <div className="quiz-meta">
          <div className="quiz-meta-item">
            ⏱ {formatTime(timeSpent)}{quiz.duration && ` / ${quiz.duration}:00`}
          </div>
          <div className="quiz-meta-item">
            📊 {getAnsweredCount()} / {quiz.questions.length}
          </div>
          <div className="quiz-meta-item">
            🎯 Yêu cầu cần đạt được: {quiz.passing_score} điểm
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="quiz-progress-bar">
        <div
          className="quiz-progress-fill"
          style={{ width: `${getProgressPercentage()}%` }}
        />
      </div>

      {/* Question Navigation Dots */}
      <div className="question-navigation">
        {quiz.questions.map((q, index) => (
          <button
            key={q.id}
            className={`nav-dot ${index === currentQuestionIndex ? 'active' : ''} ${
              answers[q.id] ? 'answered' : ''
            }`}
            onClick={() => setCurrentQuestionIndex(index)}
            title={`Question ${index + 1}`}
          >
            {index + 1}
          </button>
        ))}
      </div>

      {/* Current Question */}
      <QuizQuestion
        question={currentQuestion}
        questionNumber={currentQuestionIndex + 1}
        selectedAnswer={answers[currentQuestion.id]}
        onAnswerChange={handleAnswerChange}
        showResult={false}
      />

      {/* Navigation Buttons */}
      <div className="quiz-navigation">
        <button
          className="btn btn-secondary"
          onClick={handlePreviousQuestion}
          disabled={currentQuestionIndex === 0}
        >
          ← Câu trước
        </button>

        <div className="nav-center">
          <span className="question-counter">
            Question {currentQuestionIndex + 1} of {quiz.questions.length}
          </span>
        </div>

        {!isLastQuestion ? (
          <button
            className="btn btn-primary"
            onClick={handleNextQuestion}
          >
            Câu sau →
          </button>
        ) : (
          <button
            className="btn btn-success"
            onClick={handlePreSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Chờ nộp...' : 'Nộp bài'}
          </button>
        )}
      </div>

      {/* Previous Attempts Info */}
      {previousAttempts.length > 0 && (
        <div className="previous-attempts-info">
          <p>
            📊 You've attempted this quiz {previousAttempts.length} time(s).
            Best score: {Math.max(...previousAttempts.map(a => a.score)).toFixed(1)}
          </p>
        </div>
      )}
      {showConfirmModal && (
        <div className="quiz-modal-overlay">
          <div className="quiz-modal">
            <div className="quiz-modal-header">
              <h3>⚠️ Xác nhận nộp bài</h3>
            </div>
            <div className="quiz-modal-body">
              <p>
                Bạn vẫn còn <strong>{quiz.questions.filter(q => !answers[q.id]).length}</strong> câu hỏi chưa trả lời.
              </p>
              <p>Bạn có chắc chắn muốn nộp bài ngay bây giờ không?</p>
            </div>
            <div className="quiz-modal-footer">
              <button 
                className="btn btn-secondary" 
                onClick={() => setShowConfirmModal(false)}
              >
                Xem lại
              </button>
              <button 
                className="btn btn-primary" 
                onClick={submitQuizData}
              >
                Nộp bài luôn
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizSection;
