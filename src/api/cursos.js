import api from './client.js'

export function getCursos({ simularError = false } = {}) {
  return api.get('/cursos', {
    params: simularError ? { error: 1 } : undefined,
  })
}

export function crearCurso(payload) {
  return api.post('/cursos', payload)
}
