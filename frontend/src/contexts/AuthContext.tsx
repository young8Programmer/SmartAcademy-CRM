import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { authStore } from '@/stores/authStore'
import { api } from '@/lib/api'

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: 'admin' | 'teacher' | 'student'
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (data: any) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const token = authStore.getToken()
    if (token) {
      api.get('/users/profile')
        .then((res) => setUser(res.data))
        .catch(() => authStore.clearToken())
        .finally(() => setIsLoading(false))
    } else {
      setIsLoading(false)
    }
  }, [])

  const login = async (email: string, password: string) => {
    const res = await api.post('/auth/login', { email, password })
    authStore.setToken(res.data.access_token)
    setUser(res.data.user)
  }

  const register = async (data: any) => {
    const res = await api.post('/auth/register', data)
    authStore.setToken(res.data.access_token)
    setUser(res.data.user)
  }

  const logout = () => {
    authStore.clearToken()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
