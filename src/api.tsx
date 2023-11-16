import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL || 'http://default-url.com',
  headers: {
    'Content-Type': 'application/json'
  }
})

export default api
