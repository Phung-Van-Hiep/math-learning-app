import { useState } from 'react'
import useAuthStore from '@store/authStore'

export default function Header() {
  const { admin, logout } = useAuthStore()
  const [showDropdown, setShowDropdown] = useState(false)

  return (
    <header className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">
          Hệ thống quản lý nội dung
        </h2>
      </div>

      <div className="flex items-center space-x-4">
        <button className="p-2 hover:bg-gray-100 rounded-lg">
          🔔
          <span className="ml-1 text-xs bg-red-500 text-white px-2 py-1 rounded-full">3</span>
        </button>

        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg"
          >
            <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold">
              {admin?.name?.[0] || 'A'}
            </div>
            <span>{admin?.name || 'Admin'}</span>
            <span>{showDropdown ? '▲' : '▼'}</span>
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 border z-50">
              <div className="px-4 py-2 border-b">
                <p className="font-medium">{admin?.name}</p>
                <p className="text-sm text-gray-500">{admin?.email}</p>
              </div>
              <button
                onClick={() => {
                  logout()
                  setShowDropdown(false)
                }}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
              >
                🚪 Đăng xuất
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
