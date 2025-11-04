import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import LessonForm from '../components/LessonForm';

const lesson = {
  id: 1,
  title: 'Phương trình bậc nhất',
  description: 'Mô tả bài học',
  grade: 8,
};

const LessonEditPage = () => {
  const { lessonId } = useParams();
  const navigate = useNavigate();

  const handleUpdateLesson = (lesson) => {
    // Handle lesson update logic here
    console.log('Updating lesson:', lesson);
    navigate('/lessons');
  };

  const handleCancel = () => {
    navigate('/lessons');
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Chỉnh sửa bài học: {lessonId}</h1>
      <LessonForm
        lesson={lesson}
        onSubmit={handleUpdateLesson}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default LessonEditPage;
