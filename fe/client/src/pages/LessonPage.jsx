import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import ContentBlock from '../components/ContentBlock';
import LessonSidebar from '../components/LessonSidebar';

const lessonContent = [
  { type: 'Giới thiệu', title: 'Giới thiệu bài học', content: 'Nội dung giới thiệu...' },
  { type: 'Video', title: 'Video bài giảng', content: 'Video player...' },
  { type: 'Nội dung', title: 'Lý thuyết', content: 'Nội dung lý thuyết...' },
  { type: 'Tương tác', title: 'Công cụ tương tác', content: 'Công cụ tương tác...' },
  { type: 'Kiểm tra', title: 'Bài kiểm tra', content: 'Nội dung bài kiểm tra...' },
];

const LessonPage = () => {
  const { lessonId } = useParams();
  const [currentSection, setCurrentSection] = useState(0);

  const handleSectionClick = (index) => {
    setCurrentSection(index);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Bài học: {lessonId}</h1>
      <div className="flex">
        <LessonSidebar
          content={lessonContent}
          currentSection={currentSection}
          onSectionClick={handleSectionClick}
        />
        <div className="flex-grow p-8">
          {lessonContent.map((item, index) => (
            <div key={index} style={{ display: index === currentSection ? 'block' : 'none' }}>
              <ContentBlock type={item.type} title={item.title}>
                {item.content}
              </ContentBlock>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LessonPage;
