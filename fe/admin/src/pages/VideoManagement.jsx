import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Mock Data
const initialVideos = [
  { id: 1, title: 'VIDEO 1: LÝ THUYẾT', duration: '20:45', status: 'Đã xuất bản', uploadDate: '15/01/2024', thumbnail: 'https://via.placeholder.com/150x100?text=Video+1' },
  { id: 2, title: 'VIDEO 2: BÀI TẬP CƠ BẢN', duration: '15:30', status: 'Đã xuất bản', uploadDate: '14/01/2024', thumbnail: 'https://via.placeholder.com/150x100?text=Video+2' },
  { id: 3, title: 'VIDEO 3: BÀI TẬP NÂNG CAO', duration: '12:20', status: 'Nháp', uploadDate: '13/01/2024', thumbnail: 'https://via.placeholder.com/150x100?text=Video+3' },
];

const VideoForm = ({ currentVideo, onSave, onCancel }) => {
  const [uploadMethod, setUploadMethod] = useState('youtube');

  return (
    <div className="bg-white p-8 rounded-lg shadow-md mt-8 border-t-4 border-blue-500">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">{currentVideo ? '✏️ Chỉnh sửa video' : '➕ Thêm video mới'}</h2>
      <form className="space-y-6">
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Tiêu đề video *</label>
          <input type="text" defaultValue={currentVideo?.title} placeholder="Ví dụ: Lý thuyết phương trình bậc nhất" className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
        </div>
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Mô tả ngắn</label>
          <textarea rows="3" placeholder="Mô tả nội dung video..." className="w-full px-4 py-2 border border-gray-300 rounded-lg"></textarea>
        </div>
        
        <hr/>

        <div>
            <h3 className="text-xl font-bold text-gray-700 mb-4">🎥 Tải video lên</h3>
            <div className="flex space-x-4 mb-4">
                {['youtube', 'gdrive', 'direct'].map(method => (
                    <label key={method} className="flex items-center">
                        <input type="radio" name="uploadMethod" value={method} checked={uploadMethod === method} onChange={() => setUploadMethod(method)} className="mr-2"/>
                        {method === 'youtube' && 'YouTube'}
                        {method === 'gdrive' && 'Google Drive'}
                        {method === 'direct' && 'Tải trực tiếp'}
                    </label>
                ))}
            </div>

            {uploadMethod === 'youtube' && (
                <div>
                    <label className="block text-gray-700 font-semibold mb-2">YouTube URL *</label>
                    <input type="text" placeholder="https://www.youtube.com/watch?v=..." className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
                </div>
            )}
            {uploadMethod === 'direct' && (
                <div className="border-2 border-dashed border-gray-300 p-8 text-center rounded-lg">
                    <p className="mb-2">Kéo và thả video vào đây, hoặc</p>
                    <button type="button" className="px-4 py-2 bg-blue-500 text-white rounded-lg">Chọn file video</button>
                </div>
            )}
        </div>

        <div className="flex justify-end space-x-4 pt-4">
          <button type="button" onClick={onCancel} className="px-6 py-2 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600">Hủy</button>
          <button type="submit" onClick={onSave} className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600">Lưu video</button>
        </div>
      </form>
    </div>
  );
};

export default function VideoManagement() {
  const [videos, setVideos] = useState(initialVideos);
  const [showForm, setShowForm] = useState(false);
  const [currentVideo, setCurrentVideo] = useState(null);

  const handleAddNew = () => {
    setCurrentVideo(null);
    setShowForm(true);
  };

  const handleEdit = (video) => {
    setCurrentVideo(video);
    setShowForm(true);
  };
  
  const handleSave = (e) => {
      e.preventDefault();
      // Add save logic here
      setShowForm(false);
      setCurrentVideo(null);
  }

  return (
    <div>
      {/* Page Header */}
      <header className="bg-white shadow-md p-6 rounded-lg mb-8 flex justify-between items-center">
        <div>
          <Link to="/dashboard" className="text-blue-500 hover:underline">← Về Dashboard</Link>
          <h1 className="text-3xl font-bold text-gray-800 mt-2">🎥 Quản lý Video bài giảng</h1>
        </div>
        <div className="flex space-x-4">
          <button className="px-6 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600">📤 Xuất bản tất cả</button>
        </div>
      </header>

      {/* Video List */}
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">📹 Danh sách video đã tải lên</h2>
        <div className="space-y-6">
          {videos.map(video => (
            <div key={video.id} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-lg transition-shadow">
              <div className="flex items-center">
                <img src={video.thumbnail} alt="thumbnail" className="w-32 h-20 object-cover rounded-md mr-6" />
                <div>
                  <h3 className="font-bold text-lg text-gray-800">{video.title}</h3>
                  <p className="text-sm text-gray-500">Độ dài: {video.duration} | Ngày tải: {video.uploadDate}</p>
                  <p className={`text-sm font-semibold ${video.status === 'Nháp' ? 'text-yellow-600' : 'text-green-600'}`}>{video.status}</p>
                </div>
              </div>
              <div className="flex space-x-3">
                <button onClick={() => handleEdit(video)} className="px-4 py-2 bg-blue-100 text-blue-700 font-semibold rounded-lg hover:bg-blue-200">✏️ Sửa</button>
                <button className="px-4 py-2 bg-red-100 text-red-700 font-semibold rounded-lg hover:bg-red-200">🗑 Xóa</button>
              </div>
            </div>
          ))}
        </div>
        <button onClick={handleAddNew} className="w-full mt-6 py-4 border-2 border-dashed border-gray-300 text-gray-500 rounded-lg hover:bg-gray-100 hover:border-gray-400 transition">
          + Thêm video mới
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && <VideoForm currentVideo={currentVideo} onSave={handleSave} onCancel={() => setShowForm(false)} />}
    </div>
  );
}
