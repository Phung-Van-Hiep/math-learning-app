import React from 'react';
import { Link } from 'react-router-dom';

// Mock Data
const stats = {
  totalAssignments: 15,
  averageScore: 7.5,
  passedAssignments: 12,
  highestScore: 10,
};

const results = [
  { id: 1, title: 'Kiểm tra chương 1', score: 8, total: 10, date: '16/01/2024', time: '10:30 AM', rating: 4 },
  { id: 2, title: 'Bài tập tuần 2', score: 7, total: 10, date: '15/01/2024', time: '02:15 PM', rating: 3 },
  { id: 3, title: 'Kiểm tra giữa kỳ', score: 9, total: 10, date: '14/01/2024', time: '09:00 AM', rating: 5 },
  { id: 4, title: 'Ôn tập chương 1', score: 6, total: 10, date: '13/01/2024', time: '04:20 PM', rating: 2 },
  { id: 5, title: 'Bài tập tuần 1', score: 10, total: 10, date: '12/01/2024', time: '11:45 AM', rating: 5 },
];

const StatCard = ({ title, value, label, icon }) => (
  <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 flex flex-col items-center text-center">
    <div className="text-4xl mb-2">{icon}</div>
    <p className="text-3xl font-bold text-gray-800">{value}</p>
    <p className="text-gray-500">{title}</p>
    <p className="text-sm text-gray-400">{label}</p>
  </div>
);

const ResultsTable = () => (
  <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
    <h2 className="text-2xl font-bold text-gray-800 mb-6">📋 Danh sách bài kiểm tra</h2>
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-4 font-semibold">#</th>
            <th className="p-4 font-semibold">Tên bài kiểm tra</th>
            <th className="p-4 font-semibold">Điểm</th>
            <th className="p-4 font-semibold">Ngày làm</th>
            <th className="p-4 font-semibold">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {results.map((result, index) => (
            <tr key={result.id} className="border-b hover:bg-gray-50">
              <td className="p-4">{index + 1}</td>
              <td className="p-4 font-semibold text-gray-700">{result.title}</td>
              <td className="p-4">
                <span className="font-bold text-lg text-blue-600">{result.score}/{result.total}</span>
                <div className="text-yellow-400">{'⭐'.repeat(result.rating)}</div>
              </td>
              <td className="p-4 text-gray-600">{result.date}<br/>{result.time}</td>
              <td className="p-4 space-x-2">
                <button className="text-blue-500 hover:underline">Xem chi tiết</button>
                <button className="text-green-500 hover:underline">Làm lại</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <div className="mt-6 flex justify-between items-center text-gray-600">
      <p>Hiển thị {results.length} trên {stats.totalAssignments} bài</p>
      <div className="flex space-x-1">
        <button className="px-3 py-1 border rounded-lg bg-blue-500 text-white">1</button>
        <button className="px-3 py-1 border rounded-lg hover:bg-gray-200">2</button>
        <button className="px-3 py-1 border rounded-lg hover:bg-gray-200">3</button>
      </div>
    </div>
  </div>
);

const ProgressChart = () => (
    <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">📈 Biểu đồ tiến độ</h2>
        <div className="h-64 bg-gray-100 rounded-lg flex items-end justify-around p-4">
            {/* This is a simplified mock chart. A real implementation would use a charting library. */}
            {results.slice().reverse().map(r => (
                <div key={r.id} className="flex flex-col items-center">
                    <div 
                        className="w-8 bg-blue-500 rounded-t-lg"
                        style={{ height: `${r.score * 10}%` }}
                        title={`${r.title}: ${r.score}/${r.total}`}
                    ></div>
                    <span className="text-xs mt-2">{r.date.substring(0,5)}</span>
                </div>
            ))}
        </div>
    </div>
);


export default function ResultsPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        
        {/* Breadcrumb */}
        <nav className="text-sm mb-8" aria-label="Breadcrumb">
          <ol className="list-none p-0 inline-flex">
            <li className="flex items-center">
              <Link to="/" className="text-gray-500 hover:text-blue-600">🏠 Trang chủ</Link>
              <svg className="fill-current w-3 h-3 mx-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z"/></svg>
            </li>
            <li>
              <span className="text-gray-700 font-bold">📊 Kết quả của tôi</span>
            </li>
          </ol>
        </nav>

        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-gray-800">📊 Kết quả học tập của bạn</h1>
          <p className="text-xl text-gray-500 mt-2">Theo dõi tiến độ và thành tích của bạn</p>
        </header>

        {/* Stats Overview */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard icon="📝" title="Tổng bài" value={stats.totalAssignments} label="Bài đã làm" />
          <StatCard icon="📊" title="Điểm TB" value={stats.averageScore} label="Trung bình" />
          <StatCard icon="✅" title="Bài đạt" value={stats.passedAssignments} label="(≥ 7 điểm)" />
          <StatCard icon="🏆" title="Cao nhất" value={stats.highestScore} label="Điểm số" />
        </section>

        {/* Results Table */}
        <section className="mb-12">
          <ResultsTable />
        </section>

        {/* Progress Chart */}
        <section>
          <ProgressChart />
        </section>

      </div>
    </div>
  );
}
