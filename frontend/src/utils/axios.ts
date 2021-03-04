import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
})

export const setApiToken = (token: string | null) => {
  api.defaults.headers.common.Authorization = token ? `Bearer ${token}` : null
}

export default api
