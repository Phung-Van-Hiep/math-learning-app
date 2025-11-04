import { Link } from 'react-router-dom'

export default function HomePage() {
  const sections = [
    { path: '/introduction', title: 'Giới thiệu bài học', icon: '📖', color: 'bg-blue-500' },
    { path: '/video', title: 'Video bài giảng', icon: '🎥', color: 'bg-red-500' },
    { path: '/content', title: 'Nội dung Toán học', icon: '📚', color: 'bg-green-500' },
    { path: '/interactive', title: 'Tương tác & Minh họa', icon: '🎯', color: 'bg-purple-500' },
    { path: '/assessment', title: 'Kiểm tra & Đánh giá', icon: '✍️', color: 'bg-orange-500' },
    { path: '/feedback', title: 'Phản hồi & Liên hệ', icon: '📧', color: 'bg-pink-500' },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Banner */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-700 text-white rounded-lg p-12 mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">
          Chào mừng đến với Website Dạy Học Toán THCS
        </h1>
        <p className="text-xl mb-6">
          Học Toán trở nên thú vị và hiệu quả hơn
        </p>
        <div className="flex justify-center items-center space-x-2">
          <span className="text-2xl">📐</span>
          <span className="text-2xl">➗</span>
          <span className="text-2xl">📊</span>
          <span className="text-2xl">🧮</span>
        </div>
      </div>

      {/* Navigation Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sections.map((section) => (
          <Link
            key={section.path}
            to={section.path}
            className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition transform hover:-translate-y-1"
          >
            <div className={`w-16 h-16 ${section.color} rounded-full flex items-center justify-center text-3xl mb-4`}>
              {section.icon}
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              {section.title}
            </h2>
            <p className="text-gray-600">
              Nhấn để xem chi tiết →
            </p>
          </Link>
        ))}
      </div>

      {/* School Info */}
      <div className="mt-12 bg-gray-50 rounded-lg p-8 text-center">
        <div className="w-24 h-24 bg-primary-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-3xl font-bold">
          NQ
        </div>
        <h3 className="text-2xl font-bold mb-2">Trường THCS Như Quỳnh</h3>
        <p className="text-gray-600">
          Huyện Như Quỳnh, Tỉnh Hưng Yên
        </p>
      </div>
    </div>
  )
}
