import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Reusable Components
const FormSection = ({ title, children }) => (
  <div className="bg-white p-8 rounded-lg shadow-md mb-8">
    <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">{title}</h2>
    <div className="space-y-6">{children}</div>
  </div>
);

const Input = ({ label, type = 'text', placeholder, value, required }) => (
  <div>
    <label className="block text-gray-700 font-semibold mb-2">{label} {required && '*'}</label>
    <input type={type} placeholder={placeholder} defaultValue={value} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
  </div>
);

const Select = ({ label, options, required }) => (
    <div>
        <label className="block text-gray-700 font-semibold mb-2">{label} {required && '*'}</label>
        <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
            {options.map(opt => <option key={opt}>{opt}</option>)}
        </select>
    </div>
);

const DynamicList = ({ label, items, setItems }) => {
    const [newItem, setNewItem] = useState('');

    const handleAddItem = () => {
        if (newItem.trim()) {
            setItems([...items, newItem.trim()]);
            setNewItem('');
        }
    };

    const handleRemoveItem = (index) => {
        setItems(items.filter((_, i) => i !== index));
    };

    return (
        <div>
            <label className="block text-gray-700 font-semibold mb-2">{label}</label>
            <div className="space-y-3">
                {items.map((item, index) => (
                    <div key={index} className="flex items-center bg-gray-100 p-2 rounded-lg">
                        <span className="flex-grow">{item}</span>
                        <button onClick={() => handleRemoveItem(index)} className="text-red-500 hover:text-red-700 font-bold ml-4">X</button>
                    </div>
                ))}
            </div>
            <div className="flex mt-4">
                <input type="text" value={newItem} onChange={(e) => setNewItem(e.target.value)} placeholder="Thêm mục mới..." className="flex-grow px-4 py-2 border border-gray-300 rounded-l-lg"/>
                <button onClick={handleAddItem} className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-r-lg hover:bg-blue-600">+</button>
            </div>
        </div>
    );
};


export default function IntroductionManagement() {
    // Mock state for dynamic lists
    const [skills, setSkills] = useState(['Biết các phép tính cơ bản', 'Đã học về phương trình']);
    const [knowledgeGoals, setKnowledgeGoals] = useState(['Hiểu khái niệm phương trình', 'Nắm được cách giải']);
    const [references, setReferences] = useState(['Sách giáo khoa Toán 8 - NXB GDVN']);

  return (
    <div>
      {/* Page Header */}
      <header className="bg-white shadow-md p-6 rounded-lg mb-8 flex justify-between items-center">
        <div>
            <Link to="/dashboard" className="text-blue-500 hover:underline">← Về Dashboard</Link>
            <h1 className="text-3xl font-bold text-gray-800 mt-2">📚 Quản lý Giới thiệu bài học</h1>
        </div>
        <div className="flex space-x-4">
            <button className="px-6 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300">👁 Xem thử</button>
            <button className="px-6 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600">📤 Xuất bản</button>
            <button className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600">💾 Lưu</button>
        </div>
      </header>

      <main>
        <FormSection title="👨‍🏫 Thông tin giáo viên">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-1">
                    <label className="block text-gray-700 font-semibold mb-2">📷 Ảnh đại diện</label>
                    <div className="flex flex-col items-center">
                        <div className="w-40 h-40 bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                            <span className="text-gray-500">Preview</span>
                        </div>
                        <button className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 mb-2">📤 Tải ảnh lên</button>
                        <button className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">🗑 Xóa ảnh</button>
                    </div>
                </div>
                <div className="md:col-span-2 space-y-6">
                    <Input label="Họ và tên" placeholder="Nhập họ và tên giáo viên" value="Thầy Nguyễn Văn A" required />
                    <Input label="Trường" value="THCS Như Quỳnh" required />
                    <Input label="Môn dạy" value="Toán học" required />
                    <Input label="Email" type="email" placeholder="email@example.com" />
                </div>
            </div>
        </FormSection>

        <FormSection title="🎓 Đối tượng học sinh">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Select label="Lớp" options={['Lớp 6', 'Lớp 7', 'Lớp 8', 'Lớp 9']} required />
                <Select label="Trình độ" options={['Cơ bản', 'Trung bình', 'Nâng cao']} required />
            </div>
            <DynamicList label="Kỹ năng cần có" items={skills} setItems={setSkills} />
        </FormSection>

        <FormSection title="🎯 Mục tiêu bài học">
            <DynamicList label="Về kiến thức" items={knowledgeGoals} setItems={setKnowledgeGoals} />
        </FormSection>

        <FormSection title="📚 Tài liệu tham khảo">
            <DynamicList label="Danh sách tài liệu" items={references} setItems={setReferences} />
        </FormSection>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 mt-8">
            <button className="px-6 py-3 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600">❌ Hủy</button>
            <button className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600">💾 Lưu nháp</button>
            <button className="px-6 py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600">📤 Xuất bản</button>
        </div>
      </main>
    </div>
  );
}
