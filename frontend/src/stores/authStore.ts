import { create } from 'zustand'

interface AuthState {
  token: string | null
  setToken: (token: string) => void
  clearToken: () => void
  getToken: () => string | null
}

export const authStore = create<AuthState>()((set, get) => ({
  token: localStorage.getItem('auth_token'),
  setToken: (token: string) => {
    localStorage.setItem('auth_token', token)
    set({ token })
  },
  clearToken: () => {
    localStorage.removeItem('auth_token')
    set({ token: null })
  },
  getToken: () => get().token,
}))
