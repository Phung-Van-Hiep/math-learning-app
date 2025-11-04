import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="container mx-auto px-4 py-20 text-center">
      <div className="text-9xl mb-4">🔍</div>
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-2xl text-gray-600 mb-8">Không tìm thấy trang</p>
      <Link
        to="/"
        className="inline-block px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition"
      >
        🏠 Về trang chủ
      </Link>
    </div>
  )
}
