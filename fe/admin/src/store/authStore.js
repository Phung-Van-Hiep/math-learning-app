import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useAuthStore = create(
  persist(
    (set) => ({
      admin: null,
      token: null,
      isAuthenticated: false,

      login: (admin, token) => {
        set({ admin, token, isAuthenticated: true })
        localStorage.setItem('admin_token', token)
      },

      logout: () => {
        set({ admin: null, token: null, isAuthenticated: false })
        localStorage.removeItem('admin_token')
      },
    }),
    {
      name: 'admin-auth-storage',
    }
  )
)

export default useAuthStore
