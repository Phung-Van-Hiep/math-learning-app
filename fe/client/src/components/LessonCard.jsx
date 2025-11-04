import React from 'react';
import { Link } from 'react-router-dom';

const LessonCard = ({ lesson }) => {
  const {
    id,
    title,
    grade,
    duration,
    rating,
    reviews,
    difficulty,
    progress,
    thumbnail,
  } = lesson;

  return (
    <div className="border rounded-lg overflow-hidden shadow-lg">
      <img src={thumbnail} alt={title} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-gray-600 mb-2">
          Lớp {grade} • {duration} phút
        </p>
        <div className="flex items-center mb-2">
          <span className="text-yellow-500">{'⭐'.repeat(Math.round(rating))}</span>
          <span className="ml-2 text-gray-600">
            {rating} ({reviews} đánh giá)
          </span>
        </div>
        <div className="mb-4">
          <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700">
            Độ khó: {difficulty}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
          <div
            className="bg-blue-600 h-2.5 rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <Link
          to={`/lessons/${id}`}
          className="block text-center bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
        >
          Tiếp tục học →
        </Link>
      </div>
    </div>
  );
};

export default LessonCard;
