export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">Về chúng tôi</h3>
            <p className="text-gray-300 text-sm">
              Website hỗ trợ dạy học môn Toán THCS
              <br />
              Trường THCS Như Quỳnh
            </p>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">Liên kết</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/" className="text-gray-300 hover:text-white">Trang chủ</a></li>
              <li><a href="/introduction" className="text-gray-300 hover:text-white">Giới thiệu</a></li>
              <li><a href="/video" className="text-gray-300 hover:text-white">Video bài giảng</a></li>
              <li><a href="/feedback" className="text-gray-300 hover:text-white">Liên hệ</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">Liên hệ</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>📧 Email: contact@thcsnhuquynh.edu.vn</li>
              <li>📱 Điện thoại: (024) 1234 5678</li>
              <li>📍 Địa chỉ: Như Quỳnh, Hưng Yên</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm text-gray-400">
          <p>&copy; 2024 Trường THCS Như Quỳnh. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
