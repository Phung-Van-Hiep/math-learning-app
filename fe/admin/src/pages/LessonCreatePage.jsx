import React from 'react';
import { useNavigate } from 'react-router-dom';
import LessonForm from '../components/LessonForm';
import apiClient from '../services/api';

const LessonCreatePage = () => {
  const navigate = useNavigate();

  const handleCreateLesson = async (lesson) => {
    console.log('Creating lesson:', lesson);
    try {
      const token = localStorage.getItem('adminToken');
      await apiClient.post('/admin/content', lesson);
      navigate('/lessons');
    } catch (error) {
      console.error('Error creating lesson:', error);
    }
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
