import React from 'react';
import { useParams } from 'react-router-dom';
import ContentBuilder from '../components/ContentBuilder';

const LessonContentPage = () => {
  const { lessonId } = useParams();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Nội dung bài học: {lessonId}</h1>
      <ContentBuilder />
    </div>
  );
};

export default LessonContentPage;
