import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">
          WEBSITE DẠY HỌC TOÁN
        </Link>
        <nav>
          <Link to="/progress" className="mr-4">
            Tiến độ
          </Link>
          <Link to="/results" className="mr-4">
            Kết quả
          </Link>
          <Link to="/feedback" className="mr-4">
            Phản hồi
          </Link>
          <Link to="/login">Đăng nhập</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
