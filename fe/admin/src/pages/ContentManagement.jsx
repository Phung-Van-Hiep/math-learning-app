import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Mock Data - This would typically come from an API
const initialContent = {
  theory: 'Đây là nội dung tóm tắt lý thuyết. Sử dụng trình soạn thảo văn bản để chỉnh sửa, thêm công thức toán học (hỗ trợ LaTeX), và hình ảnh minh họa.',
  examples: [
    { id: 1, title: 'Ví dụ 1: Giải phương trình 2x + 6 = 0', solution: '2x = -6\nx = -3' },
    { id: 2, title: 'Ví dụ 2: Giải phương trình 5x - 15 = 0', solution: '5x = 15\nx = 3' },
  ],
  exercises: [
    { id: 1, title: 'Bài tập 1 (Trang 10 - SGK)', problem: 'Giải phương trình: 4x - 20 = 0', hint: 'Áp dụng quy tắc chuyển vế và quy tắc chia.', answer: 'x = 5' },
  ],
};

// Reusable Components
const SectionEditor = ({ title, children }) => (
  <div className="bg-white p-8 rounded-lg shadow-md mb-8">
    <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">{title}</h2>
    {children}
  </div>
);

const RichTextEditor = ({ label, value, setValue }) => (
    <div>
        <label className="block text-gray-700 font-semibold mb-2">{label}</label>
        <textarea 
            rows="8" 
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            placeholder="Nhập nội dung..."
        ></textarea>
        <div className="text-xs text-gray-500 mt-2">Trình soạn thảo hỗ trợ định dạng văn bản, công thức toán, và hình ảnh.</div>
    </div>
);

export default function ContentManagement() {
  const [theory, setTheory] = useState(initialContent.theory);
  const [examples, setExamples] = useState(initialContent.examples);
  const [exercises, setExercises] = useState(initialContent.exercises);

  return (
    <div>
      {/* Page Header */}
      <header className="bg-white shadow-md p-6 rounded-lg mb-8 flex justify-between items-center">
        <div>
          <Link to="/dashboard" className="text-blue-500 hover:underline">← Về Dashboard</Link>
          <h1 className="text-3xl font-bold text-gray-800 mt-2">📝 Quản lý Nội dung Toán học</h1>
        </div>
        <div className="flex space-x-4">
          <button className="px-6 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600">📤 Xuất bản</button>
          <button className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600">💾 Lưu thay đổi</button>
        </div>
      </header>

      <main>
        <SectionEditor title="📚 I. Tóm tắt lý thuyết">
          <RichTextEditor label="Nội dung lý thuyết" value={theory} setValue={setTheory} />
        </SectionEditor>

        <SectionEditor title="📊 II. Ví dụ minh họa">
          <div className="space-y-6">
            {examples.map((ex, index) => (
              <div key={ex.id} className="bg-gray-50 p-4 rounded-lg border">
                <input type="text" defaultValue={ex.title} className="w-full font-bold text-lg p-2 border-b mb-2" />
                <textarea rows="3" defaultValue={ex.solution} className="w-full p-2 border rounded-md"></textarea>
                <button className="text-red-500 hover:text-red-700 mt-2">Xóa ví dụ</button>
              </div>
            ))}
          </div>
          <button className="mt-6 px-4 py-2 bg-blue-100 text-blue-700 font-semibold rounded-lg hover:bg-blue-200">+ Thêm ví dụ</button>
        </SectionEditor>

        <SectionEditor title="📖 III. Bài tập SGK">
          <div className="space-y-6">
            {exercises.map((ex, index) => (
              <div key={ex.id} className="bg-gray-50 p-4 rounded-lg border">
                <input type="text" defaultValue={ex.title} className="w-full font-bold text-lg p-2 border-b mb-2" />
                <label className="font-semibold">Đề bài:</label>
                <textarea rows="2" defaultValue={ex.problem} className="w-full p-2 border rounded-md mb-2"></textarea>
                <label className="font-semibold">Hướng dẫn:</label>
                <textarea rows="2" defaultValue={ex.hint} className="w-full p-2 border rounded-md mb-2"></textarea>
                 <label className="font-semibold">Đáp án:</label>
                <input type="text" defaultValue={ex.answer} className="w-full p-2 border rounded-md" />
                <button className="text-red-500 hover:text-red-700 mt-2">Xóa bài tập</button>
              </div>
            ))}
          </div>
          <button className="mt-6 px-4 py-2 bg-blue-100 text-blue-700 font-semibold rounded-lg hover:bg-blue-200">+ Thêm bài tập</button>
        </SectionEditor>
      </main>
    </div>
  );
}
