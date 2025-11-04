import React from 'react';
import { Link } from 'react-router-dom';

// Mock Data
const videoData = {
  id: 'dQw4w9WgXcQ', // Example YouTube Video ID
  title: 'Giải phương trình bậc nhất một ẩn',
  duration: '20:45',
  views: '1,234,567',
  uploadDate: '01/01/2024',
  description: [
    'Khái niệm phương trình bậc nhất',
    'Cách giải phương trình',
    'Các dạng bài tập thường gặp',
    'Ứng dụng thực tế',
  ],
  timestamps: [
    { time: '00:00 - 02:00', topic: 'Giới thiệu và ôn tập kiến thức cũ' },
    { time: '02:00 - 08:00', topic: 'Lý thuyết cơ bản' },
    { time: '08:00 - 15:00', topic: 'Ví dụ minh họa chi tiết' },
    { time: '15:00 - 20:00', topic: 'Bài tập vận dụng' },
    { time: '20:00 - 20:45', topic: 'Tổng kết và dặn dò' },
  ],
  keyTakeaways: [
    'Phương trình bậc nhất có dạng ax + b = 0, với a ≠ 0',
    'Nghiệm của phương trình là x = -b/a',
    'Các bước giải: Chuyển vế - Rút gọn - Tìm ẩn',
  ],
};

const VideoPlayer = ({ videoId }) => (
  <div className="aspect-w-16 aspect-h-9">
    <iframe
      className="w-full h-full rounded-lg shadow-xl"
      src={`https://www.youtube.com/embed/${videoId}`}
      title="YouTube video player"
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    ></iframe>
  </div>
);

const VideoDescription = ({ description, timestamps }) => (
  <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
    <h2 className="text-2xl font-bold text-gray-800 mb-4">📝 Mô tả nội dung video</h2>
    <p className="text-gray-600 mb-6">Trong video này, các em sẽ được học:</p>
    <ul className="list-disc list-inside space-y-2 mb-8 text-gray-700">
      {description.map((item, index) => <li key={index}>{item}</li>)}
    </ul>
    <h3 className="text-xl font-semibold text-gray-800 mb-4">📖 Video được chia thành các phần:</h3>
    <div className="space-y-2">
      {timestamps.map((ts, index) => (
        <div key={index} className="flex justify-between p-3 bg-gray-50 rounded-lg">
          <span className="font-mono text-blue-600">{ts.time}</span>
          <span className="text-gray-700">{ts.topic}</span>
        </div>
      ))}
    </div>
  </div>
);

const KeyTakeaways = ({ takeaways }) => (
  <div className="bg-blue-50 p-8 rounded-lg border-l-4 border-blue-500">
    <h2 className="text-2xl font-bold text-gray-800 mb-4">💡 Điểm cần ghi nhớ</h2>
    <div className="space-y-4">
      {takeaways.map((item, index) => (
        <div key={index} className="bg-white p-4 rounded-lg shadow flex items-start">
          <span className="text-green-500 font-bold mr-3">✓</span>
          <p className="text-gray-700">{item}</p>
        </div>
      ))}
    </div>
  </div>
);

export default function VideoPage() {
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
              <span className="text-gray-700 font-bold">🎥 Video bài giảng</span>
            </li>
          </ol>
        </nav>

        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-gray-800">🎥 Video bài giảng</h1>
          <p className="text-2xl text-gray-600 mt-2">{videoData.title}</p>
        </header>

        {/* Main Content */}
        <main className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            {/* Video Player */}
            <section className="mb-8">
              <VideoPlayer videoId={videoData.id} />
              <div className="flex justify-between items-center mt-4 text-gray-600">
                <span>📊 Độ dài: {videoData.duration}</span>
                <span>👁 Lượt xem: {videoData.views}</span>
                <span>📅 Ngày đăng: {videoData.uploadDate}</span>
              </div>
            </section>

            {/* Video Description */}
            <section>
              <VideoDescription description={videoData.description} timestamps={videoData.timestamps} />
            </section>
          </div>

          {/* Key Takeaways */}
          <aside>
            <KeyTakeaways takeaways={videoData.keyTakeaways} />
          </aside>
        </main>

      </div>
    </div>
  );
}
