import axios from 'axios'
import { useAuthStore } from '@/store/authStore'

const apiUrl = import.meta.env.VITE_API_URL;
const mediaUrl = import.meta.env.VITE_MEDIA_URL;
const environment = import.meta.env.VITE_ENVIRONMENT;

export interface ApiResponse<T = any> {
  success: boolean
  status: number
  message: string
  data?: T
  details?: any
}

export const api = axios.create({
  baseURL:  environment === "prod" ? `${apiUrl}/api` : '/api',
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

    // Check if the connection request failed due to lack of network or offline server
    if (!error.response) {
      const networkErrorMessage = 'Network connection error. Please check your connection.'
      const customError = new Error(networkErrorMessage)
      
      // Inject standard response format to allow catching components to consume the message seamlessly
      ;(customError as any).response = {
        data: {
          success: false,
          message: networkErrorMessage
        }
      }
      return Promise.reject(customError)
    }

    return Promise.reject(error)
  }
)
