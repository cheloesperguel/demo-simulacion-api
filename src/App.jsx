import { useState } from 'react'
import { crearCurso, getCursos } from './api/cursos.js'
import { HowItWorks } from './components/HowItWorks.jsx'
import { RequestTrace } from './components/RequestTrace.jsx'

function App() {
  const [cursos, setCursos] = useState([])
  const [estado, setEstado] = useState('idle')
  const [error, setError] = useState('')
  const [simularError, setSimularError] = useState(false)
  const [nombre, setNombre] = useState('')
  const [docente, setDocente] = useState('')
  const [enviando, setEnviando] = useState(false)

  async function cargarCursos() {
    setEstado('loading')
    setError('')

    try {
      const { data } = await getCursos({ simularError })
      setCursos(data)
      setEstado('ready')
    } catch (err) {
      setCursos([])
      setEstado('error')
      setError(
        err.response?.data?.message ||
          'No se pudo cargar el listado. Revisá la traza.',
      )
    }
  }

  async function onCrear(event) {
    event.preventDefault()
    setEnviando(true)
    setError('')

    try {
      const { data } = await crearCurso({ nombre, docente })
      setCursos((actuales) => [data, ...actuales])
      setNombre('')
      setDocente('')
      setEstado('ready')
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'No se pudo crear el curso. Revisá la traza.',
      )
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="lab">
      <header className="mast">
        <p className="kicker">Desarrollo de aplicaciones web</p>
        <h1>Demo que obtiene datos de una API simulada con MSW.</h1>
        <p className="lede">
          El front llama a <code>/api/cursos</code> como si existiera un
          backend. Mock Service Worker intercepta esa petición y responde con
          JSON. 
          
          De esta forma, se puede desarrollar el front sin depender del backend.
         </p>
         <p className="lede"> En el momento que el backend esté listo, se puede reemplazar la API simulada por la real.</p>
        
        <ol className="flow" aria-label="Camino de la petición">
          <li>React llama a Axios</li>
          <li>Axios hace GET /api/cursos</li>
          <li>MSW intercepta y responde</li>
          <li>React muestra el listado</li>
        </ol>
      </header>

      <HowItWorks />

      <div className="bench">
        <main className="panel">
          <div className="toolbar">
            <button type="button" onClick={cargarCursos} disabled={estado === 'loading'}>
              {estado === 'loading' ? 'Pidiendo…' : 'Cargar cursos'}
            </button>
            <label className="switch">
              <input
                type="checkbox"
                checked={simularError}
                onChange={(event) => setSimularError(event.target.checked)}
              />
              Simular error 500
            </label>
          </div>

          <form className="composer" onSubmit={onCrear}>
            <p className="kicker">POST /api/cursos</p>
            <div className="composer__fields">
              <label>
                Nombre del curso
                <input
                  value={nombre}
                  onChange={(event) => setNombre(event.target.value)}
                  placeholder="Diseño de interfaces"
                  required
                />
              </label>
              <label>
                Docente
                <input
                  value={docente}
                  onChange={(event) => setDocente(event.target.value)}
                  placeholder="Nombre y apellido"
                />
              </label>
            </div>
            <button type="submit" disabled={enviando}>
              {enviando ? 'Creando…' : 'Crear curso'}
            </button>
          </form>

          {error && (
            <p className="banner banner--error" role="alert">
              {error}
            </p>
          )}

          {estado === 'idle' && (
            <p className="empty">
              Todavía no pediste nada. Tocá <strong>Cargar cursos</strong> para
              disparar Axios.
            </p>
          )}

          {estado === 'loading' && (
            <p className="empty">MSW está esperando 700 ms a propósito…</p>
          )}

          {estado === 'ready' && (
            <ul className="cards">
              {cursos.map((curso) => (
                <li key={curso.id}>
                  <article className="card">
                    <p className="card__id">{curso.id}</p>
                    <h3>{curso.nombre}</h3>
                    <p>{curso.docente}</p>
                    <p className="card__meta">{curso.cupos} cupos</p>
                  </article>
                </li>
              ))}
            </ul>
          )}
        </main>

        <RequestTrace />
      </div>
    </div>
  )
}

export default App
