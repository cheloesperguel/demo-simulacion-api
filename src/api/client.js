import axios from 'axios'
import { pushLog } from './log.js'

// Misma instancia que usarías contra un backend real.
// Cuando exista la API, cambiá baseURL. El resto del front no se toca.
const api = axios.create({
  baseURL: '/api',
  timeout: 8000,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  config.metadata = { startedAt: performance.now() }
  pushLog({
    phase: 'request',
    method: (config.method || 'get').toUpperCase(),
    url: `${config.baseURL ?? ''}${config.url ?? ''}`,
  })
  return config
})

api.interceptors.response.use(
  (response) => {
    const startedAt = response.config.metadata?.startedAt
    pushLog({
      phase: 'response',
      method: (response.config.method || 'get').toUpperCase(),
      url: `${response.config.baseURL ?? ''}${response.config.url ?? ''}`,
      status: response.status,
      ms: startedAt ? Math.round(performance.now() - startedAt) : undefined,
    })
    return response
  },
  (error) => {
    const config = error.config
    const startedAt = config?.metadata?.startedAt
    pushLog({
      phase: 'error',
      method: (config?.method || 'get').toUpperCase(),
      url: config ? `${config.baseURL ?? ''}${config.url ?? ''}` : 'desconocida',
      status: error.response?.status ?? 0,
      ms: startedAt ? Math.round(performance.now() - startedAt) : undefined,
      message: error.response?.data?.message || error.message,
    })
    return Promise.reject(error)
  },
)

export default api
