export default function IntroductionPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-4 text-sm text-gray-600">
        🏠 Trang chủ {'>'} 📖 Giới thiệu bài học
      </div>

      <h1 className="text-3xl font-bold mb-8 text-center">📖 Giới thiệu bài học</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Teacher Info */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="w-32 h-32 bg-gray-300 rounded-full mx-auto mb-4"></div>
            <h2 className="text-xl font-bold text-center mb-2">Thông tin giáo viên</h2>
            <div className="space-y-2 text-sm">
              <p><strong>Họ và tên:</strong> [Tên giáo viên]</p>
              <p><strong>Chức vụ:</strong> Giáo viên Toán</p>
              <p><strong>Trường:</strong> THCS Như Quỳnh</p>
              <p><strong>Email:</strong> teacher@thcsnhuquynh.edu.vn</p>
            </div>
          </div>
        </div>

        {/* Lesson Details */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">🎯 Đối tượng học sinh</h2>
            <p>Học sinh lớp [6-9] THCS</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">📚 Mục tiêu bài học</h2>

            <div className="mb-4">
              <h3 className="font-bold text-primary-600 mb-2">Kiến thức</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                <li>Hiểu được khái niệm...</li>
                <li>Nắm được công thức...</li>
              </ul>
            </div>

            <div className="mb-4">
              <h3 className="font-bold text-primary-600 mb-2">Kỹ năng</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                <li>Vận dụng kiến thức...</li>
                <li>Giải quyết bài toán...</li>
              </ul>
            </div>

            <div className="mb-4">
              <h3 className="font-bold text-primary-600 mb-2">Phẩm chất</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                <li>Tính cẩn thận, chính xác</li>
                <li>Tư duy logic</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-primary-600 mb-2">Năng lực</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                <li>Năng lực tự học</li>
                <li>Năng lực giải quyết vấn đề</li>
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">⏱️ Thời lượng học</h2>
            <p>2 tiết (90 phút)</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">📎 Tài liệu tham khảo</h2>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2">
                <span>📕</span>
                <a href="#" className="text-primary-500 hover:underline">Sách giáo khoa Toán [lớp]</a>
              </li>
              <li className="flex items-center space-x-2">
                <span>📘</span>
                <a href="#" className="text-primary-500 hover:underline">Sách bài tập Toán [lớp]</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
