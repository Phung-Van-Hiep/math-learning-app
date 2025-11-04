import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import LessonForm from '../components/LessonForm';

const LessonEditPage = () => {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState(null);

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const response = await axios.get('/api/content/math');
        const lessonToEdit = response.data.find(l => l.id === parseInt(lessonId));
        setLesson(lessonToEdit);
      } catch (error) {
        console.error('Error fetching lesson:', error);
      }
    };

    fetchLesson();
  }, [lessonId]);

  const handleUpdateLesson = async (updatedLesson) => {
    try {
      const token = localStorage.getItem('adminToken');
      await axios.put(`/api/admin/content/${lessonId}`, updatedLesson, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      navigate('/lessons');
    } catch (error) {
      console.error('Error updating lesson:', error);
    }
  };

  const handleCancel = () => {
    navigate('/lessons');
  };

  if (!lesson) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Chỉnh sửa bài học: {lesson.title}</h1>
      <LessonForm
        lesson={lesson}
        onSubmit={handleUpdateLesson}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default LessonEditPage;
