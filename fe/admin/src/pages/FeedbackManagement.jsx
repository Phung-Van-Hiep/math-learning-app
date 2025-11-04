import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Mock Data
const initialFeedbacks = [
  { id: 1, name: 'Nguyễn Văn A', class: '8A', date: '16/01/2024 10:30', rating: 5, comment: 'Em rất thích video bài giảng của thầy. Video rất dễ hiểu và có nhiều ví dụ minh họa.', status: 'new' },
  { id: 2, name: 'Trần Thị B', class: '8B', date: '15/01/2024 14:20', rating: 4, comment: 'Em muốn có thêm bài tập nâng cao hơn ở phần cuối.', status: 'replied' },
  { id: 3, name: 'Lê Văn C', class: '8A', date: '14/01/2024 09:00', rating: 5, comment: 'Website rất hữu ích ạ!', status: 'read' },
];

const feedbackStats = {
    total: 45,
    unread: 12,
    replied: 28,
    avgRating: 4.5,
};

const FeedbackCard = ({ feedback }) => {
    const statusStyles = {
        new: { text: 'Mới', bg: 'bg-blue-100', textC: 'text-blue-700', border: 'border-blue-500' },
        read: { text: 'Đã đọc', bg: 'bg-gray-100', textC: 'text-gray-700', border: 'border-gray-300' },
        replied: { text: 'Đã trả lời', bg: 'bg-green-100', textC: 'text-green-700', border: 'border-green-500' },
    };
    const currentStatus = statusStyles[feedback.status];

    return (
        <div className={`p-6 rounded-lg shadow-md border-l-4 ${currentStatus.border} bg-white`}>
            <div className="flex justify-between items-start mb-2">
                <div>
                    <p className="font-bold text-lg text-gray-800">{feedback.name} - <span className="font-normal">{feedback.class}</span></p>
                    <p className="text-sm text-gray-500">{feedback.date}</p>
                </div>
                <span className={`px-3 py-1 text-sm font-semibold rounded-full ${currentStatus.bg} ${currentStatus.textC}`}>{currentStatus.text}</span>
            </div>
            <div className="text-yellow-400 mb-2">{'⭐'.repeat(feedback.rating)}</div>
            <p className="text-gray-700 italic">"{feedback.comment}"</p>
            <div className="flex justify-end space-x-3 mt-4">
                <button className="text-blue-600 hover:underline">Xem chi tiết</button>
                <button className="text-green-600 hover:underline">Trả lời</button>
                <button className="text-red-600 hover:underline">Xóa</button>
            </div>
        </div>
    );
};

export default function FeedbackManagement() {
  const [feedbacks, setFeedbacks] = useState(initialFeedbacks);

  return (
    <div>
      {/* Page Header */}
      <header className="bg-white shadow-md p-6 rounded-lg mb-8">
        <h1 className="text-3xl font-bold text-gray-800">💬 Quản lý Phản hồi & Liên hệ</h1>
      </header>

      <main className="space-y-8">
        {/* Statistics */}
        <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">📊 Thống kê phản hồi</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div><p className="text-3xl font-bold">{feedbackStats.total}</p><p className="text-gray-500">Tổng cộng</p></div>
                <div><p className="text-3xl font-bold text-blue-500">{feedbackStats.unread}</p><p className="text-gray-500">Chưa đọc</p></div>
                <div><p className="text-3xl font-bold text-green-500">{feedbackStats.replied}</p><p className="text-gray-500">Đã trả lời</p></div>
                <div><p className="text-3xl font-bold text-yellow-500">{feedbackStats.avgRating}/5 ⭐</p><p className="text-gray-500">Đánh giá TB</p></div>
            </div>
        </div>

        {/* Feedback List */}
        <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">📋 Danh sách phản hồi</h2>
            
            {/* Filters and Search */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex space-x-4">
                    <select className="border border-gray-300 rounded-lg px-3 py-2">
                        <option>Tất cả</option>
                        <option>Chưa đọc</option>
                        <option>Đã trả lời</option>
                    </select>
                </div>
                <input type="text" placeholder="Tìm kiếm theo tên..." className="border border-gray-300 rounded-lg px-3 py-2" />
            </div>

            <div className="space-y-6">
                {feedbacks.map(fb => <FeedbackCard key={fb.id} feedback={fb} />)}
            </div>
        </div>
      </main>
    </div>
  );
}
