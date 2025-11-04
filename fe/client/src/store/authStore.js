import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: (user, token) => {
        set({ user, token, isAuthenticated: true })
        localStorage.setItem('token', token)
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false })
        localStorage.removeItem('token')
      },

      updateUser: (userData) => {
        set({ user: { ...get().user, ...userData } })
      },

      checkAuth: () => {
        const token = localStorage.getItem('token')
        if (token) {
          // Here you would validate the token with the backend
          return true
        }
        return false
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated
      }),
    }
  )
)

export default useAuthStore
