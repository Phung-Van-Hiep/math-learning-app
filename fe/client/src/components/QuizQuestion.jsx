import React, { useState } from 'react';
import './QuizQuestion.css';

const QuizQuestion = ({ question, questionNumber, selectedAnswer, onAnswerChange, showResult, correctAnswer }) => {
  const { id, question_text, question_type, points, image_url, answers } = question;

  const handleAnswerSelect = (answerId) => {
    if (!showResult) {
      onAnswerChange(id, answerId);
    }
  };

  const handleTextChange = (e) => {
    if (!showResult) {
      onAnswerChange(id, e.target.value);
    }
  };

  const isAnswerCorrect = (answerId) => {
    if (!showResult || !correctAnswer) return false;
    return answerId === correctAnswer.correct_answer_id;
  };

  const isAnswerSelected = (answerId) => {
    return selectedAnswer === answerId;
  };

  const getAnswerClassName = (answerId) => {
    const baseClass = 'quiz-answer';
    const selected = isAnswerSelected(answerId);

    if (!showResult) {
      return `${baseClass} ${selected ? 'selected' : ''}`;
    }

    const correct = isAnswerCorrect(answerId);
    if (correct) return `${baseClass} correct`;
    if (selected && !correct) return `${baseClass} incorrect`;
    return baseClass;
  };

  return (
    <div className="quiz-question">
      <div className="question-header">
        <span className="question-number">Câu hỏi {questionNumber}</span>
        <span className="question-points">{points} {points === 1 ? 'point' : 'points'}</span>
      </div>

      <div className="question-content">
        <p className="question-text">{question_text}</p>
        {image_url && (
          <div className="question-image">
            <img src={image_url} alt="Question illustration" />
          </div>
        )}
      </div>

      <div className="question-answers">
        {question_type === 'multiple_choice' && (
          <div className="multiple-choice-answers">
            {answers.map((answer, index) => (
              <div
                key={answer.id}
                className={getAnswerClassName(answer.id)}
                onClick={() => handleAnswerSelect(answer.id)}
              >
                <div className="answer-marker">
                  {String.fromCharCode(65 + index)}
                </div>
                <div className="answer-text">{answer.answer_text}</div>
                {showResult && isAnswerCorrect(answer.id) && (
                  <div className="answer-indicator correct-indicator">✓</div>
                )}
                {showResult && isAnswerSelected(answer.id) && !isAnswerCorrect(answer.id) && (
                  <div className="answer-indicator incorrect-indicator">✗</div>
                )}
              </div>
            ))}
          </div>
        )}

        {question_type === 'true_false' && (
          <div className="true-false-answers">
            {answers.map((answer) => (
              <div
                key={answer.id}
                className={getAnswerClassName(answer.id)}
                onClick={() => handleAnswerSelect(answer.id)}
              >
                <div className="answer-text">{answer.answer_text}</div>
                {showResult && isAnswerCorrect(answer.id) && (
                  <div className="answer-indicator correct-indicator">✓</div>
                )}
                {showResult && isAnswerSelected(answer.id) && !isAnswerCorrect(answer.id) && (
                  <div className="answer-indicator incorrect-indicator">✗</div>
                )}
              </div>
            ))}
          </div>
        )}

        {question_type === 'short_answer' && (
          <div className="short-answer-input">
            <input
              type="text"
              value={selectedAnswer || ''}
              onChange={handleTextChange}
              placeholder="Type your answer here..."
              disabled={showResult}
              className={showResult ? (correctAnswer?.is_correct ? 'correct' : 'incorrect') : ''}
            />
            {showResult && correctAnswer && (
              <div className="short-answer-feedback">
                {correctAnswer.is_correct ? (
                  <p className="correct-feedback">✓ Correct!</p>
                ) : (
                  <div className="incorrect-feedback">
                    <p>✗ Your answer: {selectedAnswer}</p>
                    <p>Correct answer: {correctAnswer.correct_answer_text}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {showResult && correctAnswer && (
        <div className={`question-result ${correctAnswer.is_correct ? 'correct-result' : 'incorrect-result'}`}>
          {correctAnswer.is_correct ? (
            <p>✓ Correct! You earned {points} {points === 1 ? 'point' : 'points'}.</p>
          ) : (
            <p>✗ Incorrect. You earned 0 points.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default QuizQuestion;
