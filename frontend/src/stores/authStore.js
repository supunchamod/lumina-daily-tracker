import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import api from '../lib/axios'

const useAuthStore = create(
  persist(
    (set, get) => ({
      user:  null,
      token: null,

      setUser: (user) => set({ user }),

      login: async (email, password) => {
        const { data } = await api.post('/login', { email, password })
        localStorage.setItem('lumina_token', data.token)
        set({ user: data.user, token: data.token })
        return data.user
      },

      register: async (name, email, password, password_confirmation) => {
        const { data } = await api.post('/register', {
          name, email, password, password_confirmation,
        })
        localStorage.setItem('lumina_token', data.token)
        set({ user: data.user, token: data.token })
        return data.user
      },

      logout: async () => {
        try { await api.post('/logout') } catch (_) { /* ignore */ }
        localStorage.removeItem('lumina_token')
        set({ user: null, token: null })
      },

      isAuthenticated: () => !!get().token,
    }),
    {
      name: 'lumina-auth',
      partialize: (state) => ({ token: state.token, user: state.user }),
    }
  )
)

export default useAuthStore
