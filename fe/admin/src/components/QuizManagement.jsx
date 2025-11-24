import { useState, useEffect } from 'react';
import quizService from '../services/quizService'; // Đảm bảo bạn đã có file service này
import './QuizManagement.css';

const QuizManagement = ({ lesson, onClose }) => {
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Form state cho Quiz Info
  const [quizData, setQuizData] = useState({
    title: '',
    description: '',
    duration: 15,
    passing_score: 60,
    is_active: true,
    shuffle_questions: false,
    show_answers: true,
    questions: []
  });

  // State quản lý câu hỏi đang soạn thảo
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [showQuestionForm, setShowQuestionForm] = useState(false);

  useEffect(() => {
    if (lesson) fetchQuiz();
  }, [lesson]);

  const fetchQuiz = async () => {
    try {
      setLoading(true);
      // Gọi API lấy quiz của bài học này (Backend đã có endpoint get_quiz_by_lesson nhưng dành cho student, 
      // Admin nên dùng endpoint get_all_quizzes có filter lesson_id)
      const quizzes = await quizService.getAllQuizzes(lesson.id);
      if (quizzes && quizzes.length > 0) {
        const existingQuiz = quizzes[0]; // Giả sử 1 bài học 1 quiz
        setQuiz(existingQuiz);
        setQuizData({
          ...existingQuiz,
          questions: existingQuiz.questions || []
        });
      } else {
        // Chưa có quiz, set default title theo bài học
        setQuizData(prev => ({ ...prev, title: `Kiểm tra: ${lesson.title}` }));
      }
    } catch (error) {
      console.error("Error fetching quiz", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveQuizInfo = async () => {
    try {
      setLoading(true);
      const payload = { ...quizData, lesson_id: lesson.id };
      
      if (quiz) {
        // Update
        await quizService.updateQuiz(quiz.id, payload);
        alert('Cập nhật thông tin bài kiểm tra thành công!');
      } else {
        // Create
        const newQuiz = await quizService.createQuiz(payload);
        setQuiz(newQuiz);
        alert('Tạo bài kiểm tra thành công! Hãy thêm câu hỏi.');
      }
    } catch (error) {
      console.error(error);
      alert('Lỗi khi lưu bài kiểm tra');
    } finally {
      setLoading(false);
    }
  };

  // --- Logic quản lý câu hỏi (Local State trước khi Save Quiz) ---
  
  const handleAddQuestion = () => {
    setEditingQuestion({
      id: Date.now(), // Temp ID
      question_text: '',
      question_type: 'multiple_choice',
      points: 1,
      order: quizData.questions.length + 1,
      answers: [
        { id: 1, answer_text: '', is_correct: false },
        { id: 2, answer_text: '', is_correct: false },
        { id: 3, answer_text: '', is_correct: false },
        { id: 4, answer_text: '', is_correct: false }
      ]
    });
    setShowQuestionForm(true);
  };

  const handleSaveQuestion = () => {
    // Validate
    if (!editingQuestion.question_text) return alert("Nhập nội dung câu hỏi");
    if (!editingQuestion.answers.some(a => a.is_correct)) return alert("Chọn ít nhất 1 đáp án đúng");

    setQuizData(prev => {
      const existingIdx = prev.questions.findIndex(q => q.id === editingQuestion.id);
      let newQuestions = [...prev.questions];
      if (existingIdx >= 0) {
        newQuestions[existingIdx] = editingQuestion;
      } else {
        newQuestions.push(editingQuestion);
      }
      return { ...prev, questions: newQuestions };
    });

    setShowQuestionForm(false);
    setEditingQuestion(null);
    // Lưu ý: UX tốt hơn là nên gọi API update quiz ngay tại đây hoặc có nút "Lưu tất cả"
  };

  const updateAnswer = (idx, field, value) => {
    const newAnswers = [...editingQuestion.answers];
    newAnswers[idx] = { ...newAnswers[idx], [field]: value };
    
    // Nếu là trắc nghiệm 1 đáp án, khi chọn đúng thì các cái khác thành sai
    if (field === 'is_correct' && value === true ) {
       // Logic tùy chỉnh nếu muốn hỗ trợ nhiều đáp án đúng hay không
       newAnswers.forEach((a, i) => { if (i !== idx) a.is_correct = false; });
    }
    
    setEditingQuestion(prev => ({ ...prev, answers: newAnswers }));
  };

  if (loading) return <div>Đang tải...</div>;

  return (
    <div className="quiz-management-modal">
      <div className="quiz-mgmt-container">
        <div className="quiz-mgmt-header">
          <h2>Quản lý bài kiểm tra: {lesson.title}</h2>
          <button onClick={onClose}>Đóng</button>
        </div>

        <div className="quiz-mgmt-body">
          {/* Phần 1: Cấu hình chung */}
          <div className="section-config">
            <h3>Cấu hình chung</h3>
            <div className="form-row">
              <input 
                type="text" placeholder="Tên bài kiểm tra" 
                value={quizData.title} 
                onChange={e => setQuizData({...quizData, title: e.target.value})}
              />
              <input 
                type="number" placeholder="Thời gian (phút)" 
                value={quizData.duration}
                onChange={e => setQuizData({...quizData, duration: parseInt(e.target.value)})}
              />
              <input 
                type="number" placeholder="Điểm đạt (%)" 
                value={quizData.passing_score}
                onChange={e => setQuizData({...quizData, passing_score: parseInt(e.target.value)})}
              />
            </div>
            <button className="btn-primary" onClick={handleSaveQuizInfo}>
              {quiz ? 'Cập nhật cấu hình' : 'Tạo bài kiểm tra'}
            </button>
          </div>

          <hr />

          {/* Phần 2: Danh sách câu hỏi */}
          {quiz && (
            <div className="section-questions">
              <div className="questions-header">
                <h3>Danh sách câu hỏi ({quizData.questions.length})</h3>
                <button className="btn-success" onClick={handleAddQuestion}>+ Thêm câu hỏi</button>
              </div>

              <div className="questions-list">
                {quizData.questions.map((q, idx) => (
                  <div key={idx} className="question-item-preview">
                    <span>Câu {idx + 1}: {q.question_text}</span>
                    <span className="badge">{q.question_type}</span>
                    <button onClick={() => { setEditingQuestion(q); setShowQuestionForm(true); }}>Sửa</button>
                  </div>
                ))}
              </div>

              {/* Form sửa câu hỏi (Modal con hoặc inline) */}
              {showQuestionForm && editingQuestion && (
                <div className="question-editor">
                  <h4>Soạn thảo câu hỏi</h4>
                  <textarea 
                    placeholder="Nội dung câu hỏi..."
                    value={editingQuestion.question_text}
                    onChange={e => setEditingQuestion({...editingQuestion, question_text: e.target.value})}
                  />
                  
                  <div className="answers-editor">
                    {editingQuestion.answers.map((ans, idx) => (
                      <div key={idx} className="answer-row">
                        <input 
                          type="radio" 
                          name="correct_ans" 
                          checked={ans.is_correct}
                          onChange={e => updateAnswer(idx, 'is_correct', e.target.checked)}
                        />
                        <input 
                          type="text" 
                          placeholder={`Đáp án ${String.fromCharCode(65+idx)}`}
                          value={ans.answer_text}
                          onChange={e => updateAnswer(idx, 'answer_text', e.target.value)}
                        />
                      </div>
                    ))}
                  </div>
                  
                  <div className="editor-actions">
                    <button onClick={handleSaveQuestion}>Lưu câu hỏi này</button>
                    <button onClick={() => setShowQuestionForm(false)}>Hủy</button>
                  </div>
                </div>
              )}
              
              {/* Nút lưu cuối cùng để đẩy toàn bộ câu hỏi lên Server */}
              <div className="final-save">
                 <button className="btn-primary large" onClick={handleSaveQuizInfo}>
                    LƯU TOÀN BỘ CÂU HỎI
                 </button>
                 <p><small>Lưu ý: Bạn cần nhấn nút này để cập nhật danh sách câu hỏi mới nhất vào hệ thống.</small></p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizManagement;