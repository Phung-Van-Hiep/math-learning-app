import React from 'react';
import { Link } from 'react-router-dom';

// Mock Data
const assessmentData = {
  title: 'Bài kiểm tra chương 3: Phương trình bậc nhất',
  googleFormEmbedUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSfv_x9-7Y_i-g-Fj-g_i-g-Fj-g_i-g-Fj-g_i-g-Fj-g_i-g/viewform?embedded=true',
  details: {
    questions: '15 câu',
    time: '20 phút',
    type: 'Trắc nghiệm',
    scoring: 'Tự động',
    attempts: 'Không giới hạn',
    passingScore: '≥ 7/10 điểm',
  },
  content: [
    { title: 'Câu hỏi lý thuyết (30%)', items: ['Định nghĩa, khái niệm', 'Công thức', 'Tính chất, quy tắc'] },
    { title: 'Câu hỏi vận dụng cơ bản (50%)', items: ['Giải phương trình đơn giản', 'Áp dụng công thức', 'Bài tập SGK tương tự'] },
    { title: 'Câu hỏi vận dụng nâng cao (20%)', items: ['Bài toán thực tế', 'Tư duy logic', 'Kết hợp nhiều kiến thức'] },
  ],
};

const InfoCard = ({ title, children, icon }) => (
  <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
    <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">{icon} <span className="ml-3">{title}</span></h2>
    {children}
  </div>
);

export default function AssessmentPage() {
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
              <span className="text-gray-700 font-bold">✅ Kiểm tra & Đánh giá</span>
            </li>
          </ol>
        </nav>

        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-gray-800">✅ Kiểm tra & Đánh giá</h1>
          <p className="text-2xl text-gray-600 mt-2">{assessmentData.title}</p>
        </header>

        {/* Main Content Grid */}
        <main className="space-y-12">

          {/* Introduction */}
          <InfoCard title="Thông tin bài kiểm tra" icon="📋">
            <p className="text-gray-600 mb-4">
              Để kiểm tra mức độ hiểu bài của mình, các em hãy hoàn thành bài kiểm tra trắc nghiệm dưới đây. Bài kiểm tra sẽ giúp các em:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
              <li>Đánh giá kiến thức đã học</li>
              <li>Xác định những phần cần ôn tập thêm</li>
              <li>Củng cố và ghi nhớ kiến thức tốt hơn</li>
              <li>Nhận phản hồi ngay lập tức</li>
            </ul>
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
              <h3 className="font-bold text-yellow-800">⚠️ Lưu ý quan trọng:</h3>
              <p className="text-yellow-700">
                <strong>Đã đăng nhập:</strong> Kết quả của bạn sẽ được lưu lại và bạn có thể xem lại lịch sử trong trang Kết quả học tập.
              </p>
               <p className="text-yellow-700 mt-2">
                <strong>Chưa đăng nhập:</strong> Bạn vẫn có thể làm bài, nhưng kết quả sẽ không được lưu lại. Hãy <Link to="#" className="font-bold underline hover:text-yellow-800">đăng nhập</Link> để theo dõi tiến độ!
              </p>
            </div>
          </InfoCard>

          {/* Details & Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <InfoCard title="Thông số bài kiểm tra" icon="📊">
              <ul className="space-y-3 text-gray-700">
                <li className="flex justify-between"><strong>📝 Số câu hỏi:</strong><span>{assessmentData.details.questions}</span></li>
                <li className="flex justify-between"><strong>⏰ Thời gian:</strong><span>{assessmentData.details.time}</span></li>
                <li className="flex justify-between"><strong>📌 Dạng câu hỏi:</strong><span>{assessmentData.details.type}</span></li>
                <li className="flex justify-between"><strong>✅ Chấm điểm:</strong><span>{assessmentData.details.scoring}</span></li>
                <li className="flex justify-between"><strong>🔄 Số lần làm:</strong><span>{assessmentData.details.attempts}</span></li>
                <li className="flex justify-between"><strong>📈 Điểm đạt:</strong><span>{assessmentData.details.passingScore}</span></li>
              </ul>
            </InfoCard>
            <InfoCard title="Nội dung bài kiểm tra" icon="📚">
              <div className="space-y-4">
                {assessmentData.content.map(section => (
                  <div key={section.title}>
                    <h4 className="font-bold text-gray-800">{section.title}</h4>
                    <ul className="list-disc list-inside text-gray-600">
                      {section.items.map(item => <li key={item}>{item}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
            </InfoCard>
          </div>

          {/* Embedded Assessment */}
          <InfoCard title="Bắt đầu làm bài kiểm tra" icon="🎯">
            <div className="bg-gray-100 p-4 rounded-lg text-center">
              <p className="mb-4 text-gray-700">Bài kiểm tra sẽ được hiển thị ngay dưới đây. Chúc các em làm bài tốt!</p>
              <iframe
                src={assessmentData.googleFormEmbedUrl}
                width="100%"
                height="800"
                frameBorder="0"
                marginHeight="0"
                marginWidth="0"
                className="rounded-md"
              >
                Đang tải…
              </iframe>
               <p className="mt-4 text-sm text-gray-500">
                Nếu bài kiểm tra không hiển thị, vui lòng <a href={assessmentData.googleFormEmbedUrl.replace('viewform?embedded=true', 'viewform')} target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-600">nhấn vào đây</a>.
              </p>
            </div>
          </InfoCard>

        </main>
      </div>
    </div>
  );
}
