import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <aside className="w-64 bg-gray-800 text-white min-h-screen p-4">
      <h2 className="text-2xl font-bold mb-8">Admin Panel</h2>
      <nav>
        <ul>
          <li className="mb-4">
            <Link to="/" className="hover:text-gray-300">
              Dashboard
            </Link>
          </li>
          <li className="mb-4">
            <Link to="/lessons" className="hover:text-gray-300">
              Bài học
            </Link>
          </li>
          <li className="mb-4">
            <Link to="/statistics" className="hover:text-gray-300">
              Thống kê
            </Link>
          </li>
          <li className="mb-4">
            <Link to="/feedback" className="hover:text-gray-300">
              Phản hồi
            </Link>
          </li>
          <li className="mb-4">
            <Link to="/settings" className="hover:text-gray-300">
              Cài đặt
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
