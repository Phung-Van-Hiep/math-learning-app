import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Mock Data
const geogebraActivities = [
  {
    title: 'Đồ thị hàm số y = ax + b',
    embedUrl: 'https://www.geogebra.org/classic/graphing', // Placeholder URL
    instructions: [
      'Di chuyển slider a để thay đổi độ dốc của đồ thị.',
      'Di chuyển slider b để thay đổi vị trí đồ thị.',
      'Quan sát sự thay đổi của đồ thị.',
      'Thử nghiệm với các giá trị khác nhau.',
    ],
    questions: [
      'Khi a > 0, đồ thị có đặc điểm gì?',
      'Khi b tăng, đồ thị di chuyển theo hướng nào?',
      'Khi a = 0, điều gì xảy ra với đồ thị?',
      'Làm thế nào để đồ thị đi qua gốc tọa độ?',
    ],
  },
  {
    title: 'Khảo sát hình học: Tam giác và đường tròn',
    embedUrl: 'https://www.geogebra.org/classic/geometry', // Placeholder URL
    instructions: [
        'Dùng các công cụ để vẽ tam giác, đường tròn.',
        'Đo các góc, cạnh và bán kính.',
        'Khám phá các tính chất của đường trung trực, đường cao.',
    ],
    questions: [
        'Ba đường trung trực của tam giác có luôn cắt nhau tại một điểm không?',
        'Tâm đường tròn ngoại tiếp tam giác nằm ở đâu?',
    ]
  }
];

const GeoGebraTab = () => (
  <div className="space-y-12">
    {geogebraActivities.map((activity, index) => (
      <div key={index} className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">{`Hoạt động ${index + 1}: ${activity.title}`}</h3>
        <div className="bg-gray-100 p-4 rounded-lg mb-6">
          <iframe
            src={activity.embedUrl}
            width="100%"
            height="500"
            frameBorder="0"
            allowFullScreen
            className="rounded-md"
          ></iframe>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h4 className="text-xl font-semibold text-gray-700 mb-3">📋 Hướng dẫn sử dụng:</h4>
            <ul className="list-decimal list-inside space-y-2 text-gray-600">
              {activity.instructions.map((inst, i) => <li key={i}>{inst}</li>)}
            </ul>
          </div>
          <div>
            <h4 className="text-xl font-semibold text-gray-700 mb-3">💡 Câu hỏi khám phá:</h4>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              {activity.questions.map((q, i) => <li key={i}>{q}</li>)}
            </ul>
          </div>
        </div>
      </div>
    ))}
  </div>
);

const MapleTab = () => (
    <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200 space-y-8">
        <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">📝 Ví dụ: Giải phương trình với Maple</h3>
            <p className="mb-2 text-gray-600">Code:</p>
            <pre className="bg-gray-800 text-white p-4 rounded-lg"><code>solve(2*x + 6 = 0, x);</code></pre>
            <p className="mt-4 mb-2 text-gray-600">Kết quả:</p>
            <pre className="bg-gray-100 text-gray-800 p-4 rounded-lg"><code>x = -3</code></pre>
        </div>
        <hr/>
        <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">📊 Vẽ đồ thị với Maple</h3>
            <p className="mb-2 text-gray-600">Code:</p>
            <pre className="bg-gray-800 text-white p-4 rounded-lg"><code>plot(2*x + 6, x = -10..10);</code></pre>
            <p className="mt-4 mb-2 text-gray-600">Kết quả:</p>
            <div className="bg-gray-100 p-4 rounded-lg flex justify-center">
                {/* Placeholder for plot image */}
                <div className="w-full h-64 bg-white border rounded-md flex items-center justify-center text-gray-500">
                    [Hình ảnh đồ thị từ Maple]
                </div>
            </div>
        </div>
         <hr/>
        <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">💻 Thử ngay:</h3>
            <a href="https://www.maplesoft.com/products/maplecalculator/" target="_blank" rel="noopener noreferrer" className="inline-block px-6 py-3 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition duration-300">
                🔗 Link Maple Calculator online
            </a>
        </div>
    </div>
);

const MindmapTab = () => (
    <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200 text-center">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">🧠 Sơ đồ tư duy bài học</h3>
        <div className="flex justify-center mb-6">
            {/* Placeholder for mindmap image */}
            <img src="https://via.placeholder.com/800x500.png?text=Mindmap+Phương+Trình+Bậc+Nhất" alt="Mindmap" className="rounded-lg shadow-lg"/>
        </div>
        <button className="px-8 py-4 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition duration-300">
            📥 Tải xuống Mindmap (PNG)
        </button>
    </div>
);


export default function InteractivePage() {
  const [activeTab, setActiveTab] = useState('geogebra');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'geogebra':
        return <GeoGebraTab />;
      case 'maple':
        return <MapleTab />;
      case 'mindmap':
        return <MindmapTab />;
      default:
        return null;
    }
  };
  
  const tabs = [
    { id: 'geogebra', label: '🔵 GeoGebra' },
    { id: 'maple', label: '🍁 Maple' },
    { id: 'mindmap', label: '🧠 Mindmap' },
  ];

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
              <span className="text-gray-700 font-bold">🎯 Tương tác & Minh họa</span>
            </li>
          </ol>
        </nav>

        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-gray-800">🎯 Tương tác & Minh họa</h1>
          <p className="text-xl text-gray-500 mt-2">Khám phá Toán học qua công cụ số</p>
        </header>

        {/* Introduction */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-12 text-center">
            <p className="text-lg text-gray-700">
                Trang này cung cấp các công cụ tương tác để giúp các em trực quan hóa các khái niệm toán học, khám phá và thí nghiệm, và hiểu sâu hơn thông qua thao tác trực tiếp.
            </p>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex justify-center border-b border-gray-300">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-8 text-lg font-semibold transition duration-300 ${activeTab === tab.id ? 'border-b-4 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-blue-500'}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <main>
          {renderTabContent()}
        </main>

      </div>
    </div>
  );
}
