import React from 'react';
import { Link } from 'react-router-dom';

// Mock Data
const resultsOverview = {
  submissions: 89,
  avgScore: 7.5,
  passRate: '78%',
  highestScore: '10/10',
  lowestScore: '3/10',
};

const studentResults = [
  { id: 1, name: 'Nguyễn Văn A', class: '8A', score: '9/10', date: '15/01 10h' },
  { id: 2, name: 'Trần Thị B', class: '8B', score: '7/10', date: '15/01 14h' },
  { id: 3, name: 'Lê Văn C', class: '8A', score: '10/10', date: '16/01 11h' },
  { id: 4, name: 'Phạm Thị D', class: '8C', score: '5/10', date: '16/01 12h' },
];

const ResultsTable = () => (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-4 font-semibold">STT</th>
            <th className="p-4 font-semibold">Họ tên</th>
            <th className="p-4 font-semibold">Lớp</th>
            <th className="p-4 font-semibold">Điểm</th>
            <th className="p-4 font-semibold">Thời gian</th>
            <th className="p-4 font-semibold">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {studentResults.map((result, index) => (
            <tr key={result.id} className="border-b hover:bg-gray-50">
              <td className="p-4">{index + 1}</td>
              <td className="p-4 font-semibold text-gray-700">{result.name}</td>
              <td className="p-4">{result.class}</td>
              <td className="p-4 font-bold text-blue-600">{result.score}</td>
              <td className="p-4 text-gray-600">{result.date}</td>
              <td className="p-4">
                <button className="text-blue-500 hover:underline">Xem chi tiết</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
);

export default function AssessmentManagement() {
  return (
    <div>
      {/* Page Header */}
      <header className="bg-white shadow-md p-6 rounded-lg mb-8 flex justify-between items-center">
        <div>
          <Link to="/dashboard" className="text-blue-500 hover:underline">← Về Dashboard</Link>
          <h1 className="text-3xl font-bold text-gray-800 mt-2">✅ Quản lý Kiểm tra & Đánh giá</h1>
        </div>
        <button className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600">💾 Lưu cài đặt</button>
      </header>

      <main className="space-y-8">
        {/* Assessment Setup */}
        <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">⚙️ Cài đặt bài kiểm tra</h2>
            <div className="space-y-4">
                <div>
                    <label className="block text-gray-700 font-semibold mb-2">Google Form URL *</label>
                    <input type="text" placeholder="Dán link Google Form embed vào đây..." className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
                </div>
                 <div>
                    <label className="block text-gray-700 font-semibold mb-2">Hướng dẫn làm bài</label>
                    <textarea rows="4" placeholder="Nhập các hướng dẫn và lưu ý cho học sinh..." className="w-full px-4 py-2 border border-gray-300 rounded-lg"></textarea>
                </div>
            </div>
        </div>

        {/* Results Overview */}
        <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">📊 Tổng quan kết quả</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 text-center mb-6">
                <div><p className="text-2xl font-bold">{resultsOverview.submissions}</p><p className="text-gray-500">Lượt làm bài</p></div>
                <div><p className="text-2xl font-bold">{resultsOverview.avgScore}</p><p className="text-gray-500">Điểm TB</p></div>
                <div><p className="text-2xl font-bold">{resultsOverview.passRate}</p><p className="text-gray-500">Tỉ lệ đạt</p></div>
                <div><p className="text-2xl font-bold text-green-500">{resultsOverview.highestScore}</p><p className="text-gray-500">Cao nhất</p></div>
                <div><p className="text-2xl font-bold text-red-500">{resultsOverview.lowestScore}</p><p className="text-gray-500">Thấp nhất</p></div>
            </div>
            <button className="px-6 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600">📥 Xuất kết quả (CSV)</button>
        </div>

        {/* Individual Results */}
        <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">📋 Kết quả chi tiết</h2>
            <ResultsTable />
        </div>
      </main>
    </div>
  );
}
