export default function Dashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">📊 Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Lượt xem</p>
              <p className="text-3xl font-bold">1,234</p>
            </div>
            <div className="text-4xl">👁️</div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Học sinh</p>
              <p className="text-3xl font-bold">56</p>
            </div>
            <div className="text-4xl">👥</div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Bài làm</p>
              <p className="text-3xl font-bold">342</p>
            </div>
            <div className="text-4xl">📝</div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Phản hồi</p>
              <p className="text-3xl font-bold">28</p>
            </div>
            <div className="text-4xl">📧</div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Hoạt động gần đây</h2>
        <p className="text-gray-600">Dashboard content will be implemented...</p>
      </div>
    </div>
  )
}
