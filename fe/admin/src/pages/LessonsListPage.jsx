import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const LessonsListPage = () => {
  const [lessons, setLessons] = useState([]);

  const fetchLessons = async () => {
    try {
      const response = await axios.get('/api/content/math');
      setLessons(response.data);
    } catch (error) {
      console.error('Error fetching lessons:', error);
    }
  };

  useEffect(() => {
    fetchLessons();
  }, []);

  const handleDelete = async (lessonId) => {
    try {
      const token = localStorage.getItem('adminToken');
      await axios.delete(`/api/admin/content/${lessonId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchLessons(); // Refresh lessons after deletion
    } catch (error) {
      console.error('Error deleting lesson:', error);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Danh sách bài học</h1>
        <Link to="/lessons/create" className="bg-blue-500 text-white px-4 py-2 rounded">
          Tạo bài học mới
        </Link>
      </div>
      <div className="bg-white shadow-md rounded">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Tiêu đề</th>
              <th className="py-3 px-6 text-left">Lớp</th>
              <th className="py-3 px-6 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {lessons.map((lesson) => (
              <tr key={lesson.id} className="border-b border-gray-200 hover:bg-gray-100">
                <td className="py-3 px-6 text-left whitespace-nowrap">{lesson.title}</td>
                <td className="py-3 px-6 text-left">{lesson.grade}</td>
                <td className="py-3 px-6 text-center">
                  <div className="flex item-center justify-center">
                    <Link
                      to={`/lessons/edit/${lesson.id}`}
                      className="w-4 mr-2 transform hover:text-purple-500 hover:scale-110"
                    >
                      Sửa
                    </Link>
                    <button
                      onClick={() => handleDelete(lesson.id)}
                      className="w-4 mr-2 transform hover:text-red-500 hover:scale-110"
                    >
                      Xóa
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LessonsListPage;
