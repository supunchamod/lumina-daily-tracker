import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,   // send cookies for Sanctum session auth
  headers: {
    'Accept':       'application/json',
    'Content-Type': 'application/json',
  },
})

// Attach Bearer token from localStorage if present (token-based flow)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('lumina_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Redirect to login on 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('lumina_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
