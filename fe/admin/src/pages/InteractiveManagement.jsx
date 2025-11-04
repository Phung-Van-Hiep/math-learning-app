import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Mock Data
const initialGeoGebra = [
  { id: 1, title: 'Đồ thị hàm số y = ax + b', embedCode: '<iframe...>' },
  { id: 2, title: 'Khảo sát hình học', embedCode: '<iframe...>' },
];

const TabButton = ({ label, isActive, onClick }) => (
    <button 
        onClick={onClick}
        className={`py-3 px-6 text-lg font-semibold transition duration-300 ${isActive ? 'border-b-4 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-blue-500'}`}
    >
        {label}
    </button>
);

const GeoGebraManager = () => {
    const [activities, setActivities] = useState(initialGeoGebra);
    return (
        <div className="space-y-6">
            {activities.map(act => (
                <div key={act.id} className="bg-gray-50 p-4 rounded-lg border">
                    <input type="text" defaultValue={act.title} className="w-full font-bold text-lg p-2 border-b mb-2" />
                    <textarea rows="3" defaultValue={act.embedCode} placeholder="Dán mã nhúng GeoGebra vào đây..." className="w-full p-2 border rounded-md font-mono text-sm"></textarea>
                    <button className="text-red-500 hover:text-red-700 mt-2">Xóa hoạt động</button>
                </div>
            ))}
            <button className="mt-6 px-4 py-2 bg-blue-100 text-blue-700 font-semibold rounded-lg hover:bg-blue-200">+ Thêm hoạt động GeoGebra</button>
        </div>
    );
};

// Placeholder components for other tabs
const MapleManager = () => <div className="text-center text-gray-500 p-8">Quản lý Maple sẽ được triển khai.</div>;
const MindmapManager = () => <div className="text-center text-gray-500 p-8">Quản lý Mindmap sẽ được triển khai.</div>;


export default function InteractiveManagement() {
  const [activeTab, setActiveTab] = useState('geogebra');

  const renderContent = () => {
      switch(activeTab) {
          case 'geogebra': return <GeoGebraManager />;
          case 'maple': return <MapleManager />;
          case 'mindmap': return <MindmapManager />;
          default: return null;
      }
  }

  return (
    <div>
      {/* Page Header */}
      <header className="bg-white shadow-md p-6 rounded-lg mb-8 flex justify-between items-center">
        <div>
          <Link to="/dashboard" className="text-blue-500 hover:underline">← Về Dashboard</Link>
          <h1 className="text-3xl font-bold text-gray-800 mt-2">🎯 Quản lý Tương tác & Minh họa</h1>
        </div>
        <button className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600">💾 Lưu tất cả</button>
      </header>

      <main className="bg-white p-8 rounded-lg shadow-md">
        {/* Tabs */}
        <div className="border-b border-gray-300 mb-8">
            <TabButton label="🔵 GeoGebra" isActive={activeTab === 'geogebra'} onClick={() => setActiveTab('geogebra')} />
            <TabButton label="🍁 Maple" isActive={activeTab === 'maple'} onClick={() => setActiveTab('maple')} />
            <TabButton label="🧠 Mindmap" isActive={activeTab === 'mindmap'} onClick={() => setActiveTab('mindmap')} />
        </div>

        {/* Tab Content */}
        <div>
            {renderContent()}
        </div>
      </main>
    </div>
  );
}
