import React from 'react';
import { useNavigate } from 'react-router-dom';
import LessonForm from '../components/LessonForm';

const LessonCreatePage = () => {
  const navigate = useNavigate();

  const handleCreateLesson = (lesson) => {
    // Handle lesson creation logic here
    console.log('Creating lesson:', lesson);
    navigate('/lessons');
  };

  const handleCancel = () => {
    navigate('/lessons');
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Tạo bài học mới</h1>
      <LessonForm onSubmit={handleCreateLesson} onCancel={handleCancel} />
    </div>
  );
};

export default LessonCreatePage;
