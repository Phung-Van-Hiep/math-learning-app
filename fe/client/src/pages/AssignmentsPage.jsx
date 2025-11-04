import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Mock Data
const inProgressAssignments = [
  {
    id: 1,
    title: 'BÀI KIỂM TRA CHƯƠNG 2',
    progress: 40,
    questionsDone: 4,
    totalQuestions: 10,
    startTime: '16/01/2024 10:00 AM',
    timeSpent: '8 phút 23 giây',
  },
  {
    id: 2,
    title: 'BÀI TẬP TỰ LUYỆN 3',
    progress: 60,
    questionsDone: 6,
    totalQuestions: 10,
    startTime: '15/01/2024 02:30 PM',
    timeSpent: '12 phút 45 giây',
  },
  {
    id: 3,
    title: 'ÔN TẬP HỆ PHƯƠNG TRÌNH',
    progress: 10,
    questionsDone: 1,
    totalQuestions: 10,
    startTime: '14/01/2024 09:15 AM',
    timeSpent: '2 phút 10 giây',
  },
];

const completedAssignments = [
  {
    id: 1,
    title: 'KIỂM TRA CHƯƠNG 1',
    score: 8,
    totalScore: 10,
    rating: 4,
    completionTime: '16/01/2024 10:48 AM',
    timeTaken: '18 phút 35 giây',
    status: 'Đạt',
  },
    {
    id: 2,
    title: 'BÀI TẬP VỀ NHÀ BUỔI 5',
    score: 9,
    totalScore: 10,
    rating: 5,
    completionTime: '12/01/2024 08:12 PM',
    timeTaken: '15 phút 12 giây',
    status: 'Xuất sắc',
  },
];

const allAssignments = [...inProgressAssignments, ...completedAssignments];

const AssignmentCardInProgress = ({ assignment }) => (
  <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-6">
    <h3 className="text-xl font-bold text-gray-800 mb-3">📝 {assignment.title}</h3>
    <div className="space-y-2 text-gray-600">
      <div className="flex items-center">
        <span className="w-24">Tiến độ:</span>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div className="bg-blue-500 h-4 rounded-full" style={{ width: `${assignment.progress}%` }}></div>
        </div>
        <span className="ml-3 font-semibold">{assignment.progress}%</span>
      </div>
      <p><span className="font-semibold">Câu đã làm:</span> {assignment.questionsDone}/{assignment.totalQuestions}</p>
      <p><span className="font-semibold">Bắt đầu:</span> {assignment.startTime}</p>
      <p><span className="font-semibold">Thời gian đã dùng:</span> {assignment.timeSpent}</p>
    </div>
    <div className="mt-6 flex space-x-4">
      <button className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300">
        ▶️ Tiếp tục làm
      </button>
      <button className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300">
        🗑 Xóa bài
      </button>
    </div>
  </div>
);

const AssignmentCardCompleted = ({ assignment }) => (
  <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-6">
    <h3 className="text-xl font-bold text-green-700 mb-3">✅ {assignment.title}</h3>
    <div className="space-y-2 text-gray-600">
      <p><span className="font-semibold">Điểm:</span> <span className="font-bold text-lg text-green-600">{assignment.score}/{assignment.totalScore}</span> {'⭐'.repeat(assignment.rating)}</p>
      <p><span className="font-semibold">Hoàn thành:</span> {assignment.completionTime}</p>
      <p><span className="font-semibold">Thời gian làm:</span> {assignment.timeTaken}</p>
      <p><span className="font-semibold">Trạng thái:</span> <span className="font-bold text-green-600">{assignment.status}</span></p>
    </div>
    <div className="mt-6 flex flex-wrap gap-4">
      <button className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300">
        👁 Xem kết quả
      </button>
      <button className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300">
        🔄 Làm lại
      </button>
      <button className="flex-1 bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300">
        📥 Tải PDF
      </button>
    </div>
  </div>
);


export default function AssignmentsPage() {
  const [activeTab, setActiveTab] = useState('in-progress');

  const renderContent = () => {
    switch (activeTab) {
      case 'in-progress':
        return (
          <div>
            <h2 className="text-2xl font-bold text-gray-700 mb-4">🔄 Bài đang làm dở</h2>
            {inProgressAssignments.map(a => <AssignmentCardInProgress key={a.id} assignment={a} />)}
          </div>
        );
      case 'completed':
        return (
          <div>
            <h2 className="text-2xl font-bold text-gray-700 mb-4">✅ Bài đã hoàn thành</h2>
            {/* Filter UI could go here */}
            {completedAssignments.map(a => <AssignmentCardCompleted key={a.id} assignment={a} />)}
          </div>
        );
      case 'all':
        return (
          <div>
            <h2 className="text-2xl font-bold text-gray-700 mb-4">📚 Tất cả bài tập</h2>
            {allAssignments.map(a => (
              a.score !== undefined
                ? <AssignmentCardCompleted key={`comp-${a.id}`} assignment={a} />
                : <AssignmentCardInProgress key={`prog-${a.id}`} assignment={a} />
            ))}
          </div>
        );
      default:
        return null;
    }
  };

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
              <span className="text-gray-700 font-bold">📝 Bài làm của tôi</span>
            </li>
          </ol>
        </nav>

        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-gray-800">📝 Bài làm của tôi</h1>
          <p className="text-xl text-gray-500 mt-2">Lịch sử và bài tập đang thực hiện</p>
        </header>

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex border-b border-gray-300">
            <button 
              onClick={() => setActiveTab('in-progress')}
              className={`py-4 px-6 text-lg font-semibold transition duration-300 ${activeTab === 'in-progress' ? 'border-b-4 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-blue-500'}`}
            >
              🔄 Đang làm ({inProgressAssignments.length} bài)
            </button>
            <button 
              onClick={() => setActiveTab('completed')}
              className={`py-4 px-6 text-lg font-semibold transition duration-300 ${activeTab === 'completed' ? 'border-b-4 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-blue-500'}`}
            >
              ✅ Đã hoàn thành ({completedAssignments.length})
            </button>
            <button 
              onClick={() => setActiveTab('all')}
              className={`py-4 px-6 text-lg font-semibold transition duration-300 ${activeTab === 'all' ? 'border-b-4 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-blue-500'}`}
            >
              📚 Tất cả ({allAssignments.length} bài)
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <main>
          {renderContent()}
        </main>

      </div>
    </div>
  );
}
