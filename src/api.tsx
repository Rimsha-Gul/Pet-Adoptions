import axios from 'axios'
import getEnv from './envConfig'

const { serverUrl } = getEnv()

const api = axios.create({
  baseURL: serverUrl || 'http://default-url.com',
  headers: {
    'Content-Type': 'application/json'
  }
})

export default api
