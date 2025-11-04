import { NavLink } from 'react-router-dom'

export default function Sidebar() {
  const menuItems = [
    { path: '/', label: 'Dashboard', icon: '📊', exact: true },
    { path: '/introduction', label: 'Giới thiệu', icon: '📖' },
    { path: '/videos', label: 'Video', icon: '🎥' },
    { path: '/content', label: 'Nội dung', icon: '📚' },
    { path: '/interactive', label: 'Tương tác', icon: '🎯' },
    { path: '/assessments', label: 'Kiểm tra', icon: '✍️' },
    { path: '/feedback', label: 'Phản hồi', icon: '📧' },
  ]

  return (
    <aside className="w-64 bg-gray-800 text-white flex flex-col">
      <div className="p-6 border-b border-gray-700">
        <h1 className="text-xl font-bold">Admin Panel</h1>
        <p className="text-sm text-gray-400">Quản lý nội dung</p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.exact}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''}`
            }
          >
            <span className="text-xl">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-700 text-sm text-gray-400">
        <p>© 2024 THCS Như Quỳnh</p>
      </div>
    </aside>
  )
}
