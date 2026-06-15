import axios from 'axios'
import { useAuthStore } from '@/store/authStore'

export interface ApiResponse<T = any> {
  success: boolean
  status: number
  message: string
  data?: T
  details?: any
}

export const api = axios.create({
  baseURL: 'http://localhost:8005/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request Interceptor: Attach token using Zustand cache
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response Interceptor: Handle 401s globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout()
    }
    return Promise.reject(error)
  }
)
