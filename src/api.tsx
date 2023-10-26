import axios from 'axios'

const api = axios.create({
  baseURL: `https://purrfect-adoptions-server-rimsha-gul-dev.apps.sandbox-m4.g2pi.p1.openshiftapps.com/`,
  headers: {
    'Content-Type': 'application/json'
  }
})

export default api
