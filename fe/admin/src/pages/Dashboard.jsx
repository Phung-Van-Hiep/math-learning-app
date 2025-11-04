import React from 'react';
import { Link } from 'react-router-dom';

// Mock Data
const stats = [
  { title: 'Lượt xem', value: '1,234', change: '+15%', icon: '👁️', color: 'blue' },
  { title: 'Học sinh', value: '56', change: 'Đã đăng ký', icon: '👥', color: 'green' },
  { title: 'Bài làm', value: '89', change: 'Bài kiểm tra', icon: '📝', color: 'purple' },
  { title: 'Phản hồi', value: '12', change: 'Chờ xem', icon: '💬', color: 'orange' },
];

const quickActions = [
  { title: 'Thêm bài học mới', icon: '📚', path: '/content' },
  { title: 'Tải video ngay', icon: '🎥', path: '/video' },
  { title: 'Tạo bài kiểm tra', icon: '✍️', path: '/assessment' },
  { title: 'Xem trang học', icon: '👁️', path: '/', external: true },
];

const contentStatus = [
  { title: 'Giới thiệu bài học', status: 'Đã xuất bản', updated: '15/01/2024', path: '/introduction' },
  { title: 'Video bài giảng', status: '3 video đã tải lên', updated: '14/01/2024', path: '/video' },
  { title: 'Nội dung toán học', status: 'Đã xuất bản', updated: '13/01/2024', path: '/content' },
  { title: 'Tương tác & Minh họa', status: 'Nháp', updated: '12/01/2024', path: '/interactive' },
  { title: 'Kiểm tra & Đánh giá', status: 'Đã xuất bản - 89 bài làm', updated: '10/01/2024', path: '/assessment' },
  { title: 'Phản hồi & Liên hệ', status: 'Đã xuất bản - 12 phản hồi mới', updated: '16/01/2024', path: '/feedback' },
];

const recentFeedbacks = [
    { name: 'Nguyễn Văn A', class: '8A', rating: 5, comment: 'Em rất thích video bài giảng của thầy...', time: '16/01 10:30' },
    { name: 'Trần Thị B', class: '8B', rating: 4, comment: 'Em muốn có thêm bài tập nâng cao...', time: '15/01 14:20' },
];

const StatCard = ({ item }) => (
    <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-gray-500 text-sm font-semibold">{item.title}</p>
                <p className="text-3xl font-bold text-gray-800">{item.value}</p>
                <p className={`text-sm ${item.change.startsWith('+') ? 'text-green-500' : 'text-gray-400'}`}>{item.change}</p>
            </div>
            <div className="text-4xl bg-blue-100 p-3 rounded-full">{item.icon}</div>
        </div>
    </div>
);

export default function Dashboard() {
  const today = new Date();
  const date = today.toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div>
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-8 rounded-lg shadow-lg mb-8">
        <h1 className="text-3xl font-bold">👋 Xin chào, Thầy/Cô!</h1>
        <p className="mt-2">Hôm nay là {date}</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map(item => <StatCard key={item.title} item={item} />)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Quick Actions */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4 text-gray-700">⚡ Hành động nhanh</h2>
            <div className="grid grid-cols-2 gap-4">
              {quickActions.map(action => (
                <Link to={action.path} key={action.title} target={action.external ? '_blank' : ''} className="flex items-center justify-center p-4 bg-gray-100 hover:bg-blue-100 rounded-lg transition duration-300">
                  <span className="text-2xl mr-3">{action.icon}</span>
                  <span className="font-semibold text-gray-800">{action.title}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Content Management */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4 text-gray-700">📂 Quản lý nội dung</h2>
            <div className="space-y-4">
              {contentStatus.map(content => (
                <div key={content.title} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-bold text-gray-800">{content.title}</p>
                    <p className={`text-sm ${content.status === 'Nháp' ? 'text-yellow-600' : 'text-green-600'}`}>{content.status}</p>
                    <p className="text-xs text-gray-400">Cập nhật: {content.updated}</p>
                  </div>
                  <div className="space-x-2">
                    <Link to={content.path} className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm">Sửa</Link>
                    <Link to="/" target="_blank" className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-sm">Xem</Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-8">
            {/* Recent Feedback */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold mb-4 text-gray-700">💬 Phản hồi gần đây</h2>
                <div className="space-y-4">
                    {recentFeedbacks.map((fb, i) => (
                        <div key={i} className="border-b pb-3">
                            <div className="flex justify-between text-sm">
                                <p className="font-semibold">{fb.name} - {fb.class}</p>
                                <p className="text-gray-500">{fb.time}</p>
                            </div>
                            <p className="text-yellow-400">{'⭐'.repeat(fb.rating)}</p>
                            <p className="text-gray-600 italic">"{fb.comment}"</p>
                        </div>
                    ))}
                </div>
                <Link to="/feedback" className="text-blue-500 hover:underline mt-4 block text-right">Xem tất cả →</Link>
            </div>
        </div>
      </div>
    </div>
  );
}
