import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../services/api';

const InteractiveToolsPage = () => {
  const [tools, setTools] = useState([]);

  const fetchTools = async () => {
    try {
      const response = await apiClient.get('/admin/interactive');
      setTools(response.data);
    } catch (error) {
      console.error('Error fetching interactive tools:', error);
    }
  };

  useEffect(() => {
    fetchTools();
  }, []);

  const handleDelete = async (toolId) => {
    try {
      await apiClient.delete(`/admin/interactive/${toolId}`);
      fetchTools();
    } catch (error) {
      console.error('Error deleting interactive tool:', error);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Công cụ tương tác</h1>
        <Link to="/interactive/create" className="bg-blue-500 text-white px-4 py-2 rounded">
          Tạo công cụ mới
        </Link>
      </div>
      <div className="bg-white shadow-md rounded">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Tiêu đề</th>
              <th className="py-3 px-6 text-left">Loại</th>
              <th className="py-3 px-6 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {tools.map((tool) => (
              <tr key={tool.id} className="border-b border-gray-200 hover:bg-gray-100">
                <td className="py-3 px-6 text-left whitespace-nowrap">{tool.title}</td>
                <td className="py-3 px-6 text-left">{tool.tool_type}</td>
                <td className="py-3 px-6 text-center">
                  <div className="flex item-center justify-center">
                    <Link
                      to={`/interactive/${tool.id}/edit`}
                      className="w-4 mr-2 transform hover:text-purple-500 hover:scale-110"
                    >
                      Sửa
                    </Link>
                    <button
                      onClick={() => handleDelete(tool.id)}
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

export default InteractiveToolsPage;
