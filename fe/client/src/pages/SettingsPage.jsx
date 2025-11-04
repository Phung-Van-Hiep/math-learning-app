import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Mock User Data
const userData = {
  name: 'Nguyễn Văn An',
  studentId: 'HS001',
  class: 'Lớp 8A',
  email: 'nguyenvanan@email.com',
  phone: '0xxx-xxx-xxx',
  dob: '01/01/2010',
  gender: 'Nam',
  joinDate: '01/01/2024',
  avatar: 'https://via.placeholder.com/120', // Placeholder avatar
};

const ProfileInfoTab = () => (
  <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
    <h2 className="text-2xl font-bold text-gray-800 mb-6">👤 Thông tin cá nhân</h2>
    <form className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-gray-700 font-semibold mb-2" htmlFor="fullName">Họ và tên *</label>
          <input type="text" id="fullName" defaultValue={userData.name} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
        </div>
        <div>
          <label className="block text-gray-700 font-semibold mb-2" htmlFor="studentId">Mã số học sinh</label>
          <input type="text" id="studentId" defaultValue={userData.studentId} className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed" readOnly />
        </div>
        <div>
          <label className="block text-gray-700 font-semibold mb-2" htmlFor="class">Lớp *</label>
          <select id="class" defaultValue={userData.class} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
            <option>Lớp 8A</option>
            <option>Lớp 8B</option>
            <option>Lớp 9A</option>
          </select>
        </div>
        <div>
          <label className="block text-gray-700 font-semibold mb-2" htmlFor="email">Email *</label>
          <input type="email" id="email" defaultValue={userData.email} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
        </div>
        <div>
          <label className="block text-gray-700 font-semibold mb-2" htmlFor="phone">Số điện thoại</label>
          <input type="tel" id="phone" defaultValue={userData.phone} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
        </div>
        <div>
          <label className="block text-gray-700 font-semibold mb-2" htmlFor="dob">Ngày sinh</label>
          <input type="date" id="dob" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
        </div>
      </div>
      <div>
        <span className="block text-gray-700 font-semibold mb-2">Giới tính</span>
        <div className="flex items-center space-x-6">
          <label className="flex items-center"><input type="radio" name="gender" value="Nam" defaultChecked={userData.gender === 'Nam'} className="mr-2" /> Nam</label>
          <label className="flex items-center"><input type="radio" name="gender" value="Nữ" defaultChecked={userData.gender === 'Nữ'} className="mr-2" /> Nữ</label>
          <label className="flex items-center"><input type="radio" name="gender" value="Khác" defaultChecked={userData.gender === 'Khác'} className="mr-2" /> Khác</label>
        </div>
      </div>
      <div className="flex justify-end space-x-4 pt-4">
        <button type="button" className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition duration-300">❌ Hủy</button>
        <button type="submit" className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300">💾 Lưu thay đổi</button>
      </div>
    </form>
  </div>
);

const PasswordTab = () => (
    <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">🔒 Đổi mật khẩu</h2>
        <p className="text-gray-600 mb-6">Để bảo vệ tài khoản, vui lòng sử dụng mật khẩu mạnh bao gồm chữ thường, chữ hoa, số và ký tự đặc biệt.</p>
        <form className="space-y-6 max-w-md">
            <div>
                <label className="block text-gray-700 font-semibold mb-2" htmlFor="currentPassword">Mật khẩu hiện tại *</label>
                <input type="password" id="currentPassword" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
                <label className="block text-gray-700 font-semibold mb-2" htmlFor="newPassword">Mật khẩu mới *</label>
                <input type="password" id="newPassword" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
                <label className="block text-gray-700 font-semibold mb-2" htmlFor="confirmPassword">Xác nhận mật khẩu mới *</label>
                <input type="password" id="confirmPassword" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div className="flex justify-end pt-4">
                <button type="submit" className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300">🔑 Đổi mật khẩu</button>
            </div>
        </form>
    </div>
);

const NotificationsTab = () => (
    <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">🔔 Cài đặt thông báo</h2>
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold text-gray-700">Thông báo qua Email</h3>
                <div className="space-y-3 mt-2 text-gray-600">
                    <label className="flex items-center"><input type="checkbox" className="mr-3 h-5 w-5" defaultChecked /> Gửi email khi có bài tập mới.</label>
                    <label className="flex items-center"><input type="checkbox" className="mr-3 h-5 w-5" defaultChecked /> Gửi email khi bài tập được chấm điểm.</label>
                    <label className="flex items-center"><input type="checkbox" className="mr-3 h-5 w-5" /> Gửi email tổng hợp hàng tuần.</label>
                </div>
            </div>
            <hr/>
            <div>
                <h3 className="text-lg font-semibold text-gray-700">Thông báo trên web</h3>
                <div className="space-y-3 mt-2 text-gray-600">
                    <label className="flex items-center"><input type="checkbox" className="mr-3 h-5 w-5" defaultChecked /> Hiển thị thông báo khi có cập nhật từ giáo viên.</label>
                    <label className="flex items-center"><input type="checkbox" className="mr-3 h-5 w-5" /> Âm thanh thông báo.</label>
                </div>
            </div>
            <div className="flex justify-end pt-4">
                <button className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300">💾 Lưu cài đặt</button>
            </div>
        </div>
    </div>
);

const AccountTab = () => (
    <div className="bg-white p-8 rounded-lg shadow-md border border-red-500">
        <h2 className="text-2xl font-bold text-red-600 mb-6">🗑 Xóa tài khoản</h2>
        <p className="text-gray-600 mb-4">
            Hành động này không thể hoàn tác. Tất cả dữ liệu của bạn, bao gồm kết quả học tập, bài làm và thông tin cá nhân sẽ bị xóa vĩnh viễn.
        </p>
        <p className="text-gray-600 mb-6">
            Vui lòng nhập mật khẩu của bạn để xác nhận.
        </p>
        <form className="space-y-6 max-w-md">
            <div>
                <label className="block text-gray-700 font-semibold mb-2" htmlFor="deleteConfirmPassword">Mật khẩu *</label>
                <input type="password" id="deleteConfirmPassword" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500" />
            </div>
            <div className="flex justify-end pt-4">
                <button type="submit" className="px-8 py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition duration-300">XÓA TÀI KHOẢN CỦA TÔI</button>
            </div>
        </form>
    </div>
);


export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('info');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'info':
        return <ProfileInfoTab />;
      case 'password':
        return <PasswordTab />;
      case 'notifications':
        return <NotificationsTab />;
      case 'account':
        return <AccountTab />;
      default:
        return null;
    }
  };

  const tabs = [
    { id: 'info', label: '👤 Thông tin', icon: '👤' },
    { id: 'password', label: '🔒 Mật khẩu', icon: '🔒' },
    { id: 'notifications', label: '🔔 Thông báo', icon: '🔔' },
    { id: 'account', label: '🗑 Tài khoản', icon: '🗑' },
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
              <span className="text-gray-700 font-bold">⚙️ Cài đặt</span>
            </li>
          </ol>
        </nav>

        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-gray-800">⚙️ Cài đặt tài khoản</h1>
          <p className="text-xl text-gray-500 mt-2">Quản lý thông tin cá nhân của bạn</p>
        </header>

        {/* Profile Header */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-12 flex items-center space-x-6">
            <img src={userData.avatar} alt="Avatar" className="w-32 h-32 rounded-full border-4 border-blue-500" />
            <div>
                <h2 className="text-3xl font-bold text-gray-800">{userData.name}</h2>
                <p className="text-gray-600">{userData.class}</p>
                <p className="text-gray-500 text-sm">Thành viên từ: {userData.joinDate}</p>
                <button className="mt-4 px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition duration-300">
                    📷 Đổi ảnh đại diện
                </button>
            </div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex border-b border-gray-300">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-6 text-lg font-semibold transition duration-300 ${activeTab === tab.id ? 'border-b-4 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-blue-500'}`}
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
