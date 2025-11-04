import React from 'react';
import { Link } from 'react-router-dom';

// Mock Data
const teacherInfo = {
  name: 'Thầy Nguyễn Văn B',
  title: 'Giáo viên Toán',
  school: 'Trường THCS Như Quỳnh',
  avatar: 'https://via.placeholder.com/150', // Placeholder avatar
  email: 'giaovien.b@example.com',
  phone: '0123-456-789',
  zaloQR: 'https://via.placeholder.com/150.png?text=Zalo+QR', // Placeholder QR
  facebook: 'https://facebook.com/giaovien.b',
};

const feedbackFormUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSc_some_hash/viewform?embedded=true'; // Placeholder URL

const FeedbackForm = () => (
  <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
    <h2 className="text-2xl font-bold text-gray-800 mb-4">📝 Gửi phản hồi cho giáo viên</h2>
    <div className="bg-gray-100 p-2 rounded-lg">
      <iframe
        src={feedbackFormUrl}
        width="100%"
        height="1000"
        frameBorder="0"
        marginHeight="0"
        marginWidth="0"
        className="rounded-md"
      >
        Đang tải…
      </iframe>
    </div>
    <p className="mt-4 text-sm text-gray-500 text-center">
      Nếu biểu mẫu không hiển thị, vui lòng <a href={feedbackFormUrl.replace('?embedded=true', '')} target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-600">nhấn vào đây</a>.
    </p>
  </div>
);

const ContactInfo = () => (
  <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
    <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">👨‍🏫 Thông tin giáo viên</h2>
    <div className="flex flex-col items-center mb-6">
      <img src={teacherInfo.avatar} alt="Teacher Avatar" className="w-32 h-32 rounded-full border-4 border-blue-500 mb-4" />
      <h3 className="text-xl font-bold text-gray-800">{teacherInfo.name}</h3>
      <p className="text-gray-600">{teacherInfo.title}</p>
      <p className="text-gray-500">{teacherInfo.school}</p>
    </div>
    
    <div className="space-y-6">
        <h3 className="text-xl font-bold text-gray-800 border-b pb-2">📞 Liên hệ trực tiếp</h3>
        <div className="flex items-center space-x-4">
            <span className="text-2xl">📧</span>
            <div>
                <p className="font-semibold">Email:</p>
                <a href={`mailto:${teacherInfo.email}`} className="text-blue-600 hover:underline">{teacherInfo.email}</a>
            </div>
        </div>
        <div className="flex items-center space-x-4">
            <span className="text-2xl">📱</span>
            <div>
                <p className="font-semibold">Số điện thoại:</p>
                <a href={`tel:${teacherInfo.phone}`} className="text-blue-600 hover:underline">{teacherInfo.phone}</a>
            </div>
        </div>
        <div className="flex items-start space-x-4">
            <span className="text-2xl">💬</span>
            <div>
                <p className="font-semibold">Zalo:</p>
                <img src={teacherInfo.zaloQR} alt="Zalo QR Code" className="w-24 h-24 mt-2 border rounded-md"/>
                <p className="text-sm text-gray-500 mt-1">Quét mã để kết bạn</p>
            </div>
        </div>
         <div className="flex items-center space-x-4">
            <span className="text-2xl">🌐</span>
            <div>
                <p className="font-semibold">Facebook:</p>
                <a href={teacherInfo.facebook} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Nhắn tin Facebook</a>
            </div>
        </div>
    </div>
  </div>
);


export default function FeedbackPage() {
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
              <span className="text-gray-700 font-bold">💬 Phản hồi & Liên hệ</span>
            </li>
          </ol>
        </nav>

        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-gray-800">💬 Phản hồi & Liên hệ</h1>
          <p className="text-xl text-gray-500 mt-2">Chúng tôi luôn lắng nghe ý kiến của bạn</p>
        </header>

        {/* Introduction */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-12 text-center">
            <p className="text-lg text-gray-700">
                Ý kiến phản hồi của các em rất quan trọng để giúp thầy/cô cải thiện chất lượng bài học. Hãy chia sẻ suy nghĩ, thắc mắc hoặc đề xuất của mình qua biểu mẫu dưới đây.
            </p>
        </div>

        {/* Main Content Grid */}
        <main className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          <div className="lg:col-span-3">
            <FeedbackForm />
          </div>
          <div className="lg:col-span-2">
            <ContactInfo />
          </div>
        </main>

      </div>
    </div>
  );
}
