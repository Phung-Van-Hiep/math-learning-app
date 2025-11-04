import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../services/api';

const AssessmentsPage = () => {
  const [assessments, setAssessments] = useState([]);

  const fetchAssessments = async () => {
    try {
      const response = await apiClient.get('/admin/assessment');
      setAssessments(response.data);
    } catch (error) {
      console.error('Error fetching assessments:', error);
    }
  };

  useEffect(() => {
    fetchAssessments();
  }, []);

  const handleDelete = async (assessmentId) => {
    try {
      await apiClient.delete(`/admin/assessment/${assessmentId}`);
      fetchAssessments();
    } catch (error) {
      console.error('Error deleting assessment:', error);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Đánh giá</h1>
        <Link to="/assessments/create" className="bg-blue-500 text-white px-4 py-2 rounded">
          Tạo đánh giá mới
        </Link>
      </div>
      <div className="bg-white shadow-md rounded">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Tiêu đề</th>
              <th className="py-3 px-6 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {assessments.map((assessment) => (
              <tr key={assessment.id} className="border-b border-gray-200 hover:bg-gray-100">
                <td className="py-3 px-6 text-left whitespace-nowrap">{assessment.title}</td>
                <td className="py-3 px-6 text-center">
                  <div className="flex item-center justify-center">
                    <Link
                      to={`/assessments/${assessment.id}/edit`}
                      className="w-4 mr-2 transform hover:text-purple-500 hover:scale-110"
                    >
                      Sửa
                    </Link>
                    <button
                      onClick={() => handleDelete(assessment.id)}
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

export default AssessmentsPage;
