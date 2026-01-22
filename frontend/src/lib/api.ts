import axios from 'axios'
import { authStore } from '@/stores/authStore'
import toast from 'react-hot-toast'

export const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = authStore.getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      authStore.clearToken()
      window.location.href = '/login'
    }
    const message = error.response?.data?.message || error.message || 'Xatolik yuz berdi'
    toast.error(message)
    return Promise.reject(error)
  }
)
