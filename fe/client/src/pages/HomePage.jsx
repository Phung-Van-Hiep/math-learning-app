import React from 'react';
import LessonCard from '../components/LessonCard';

const lessons = [
  {
    id: 1,
    title: 'Phương trình bậc nhất',
    grade: 8,
    duration: 45,
    rating: 4.8,
    reviews: 124,
    difficulty: 'Trung bình',
    progress: 60,
    thumbnail: 'https://via.placeholder.com/300',
  },
  {
    id: 2,
    title: 'Hệ phương trình bậc nhất hai ẩn',
    grade: 9,
    duration: 60,
    rating: 4.9,
    reviews: 250,
    difficulty: 'Khó',
    progress: 20,
    thumbnail: 'https://via.placeholder.com/300',
  },
  // Add more lessons here
];

const HomePage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Danh sách bài học</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {lessons.map((lesson) => (
          <LessonCard key={lesson.id} lesson={lesson} />
        ))}
      </div>
    </div>
  );
};

export default HomePage;
