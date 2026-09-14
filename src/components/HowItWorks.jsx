import { useState } from 'react'
import SyntaxHighlighter from 'react-syntax-highlighter/dist/esm/prism-light'
import javascript from 'react-syntax-highlighter/dist/esm/languages/prism/javascript'
import jsx from 'react-syntax-highlighter/dist/esm/languages/prism/jsx'
import oneDark from 'react-syntax-highlighter/dist/esm/styles/prism/one-dark'
import appSource from '../App.jsx?raw'
import clientSource from '../api/client.js?raw'
import cursosSource from '../api/cursos.js?raw'
import mainSource from '../main.jsx?raw'
import dataSource from '../mocks/data.js?raw'
import handlersSource from '../mocks/handlers.js?raw'

SyntaxHighlighter.registerLanguage('jsx', jsx)
SyntaxHighlighter.registerLanguage('javascript', javascript)

const files = [
  {
    path: 'src/App.jsx',
    role: 'Dispara las peticiones',
    detail:
      'Al cargar o crear un curso llama a getCursos / crearCurso. No sabe si responde MSW o un servidor.',
    source: appSource,
    language: 'jsx',
  },
  {
    path: 'src/api/cursos.js',
    role: 'Funciones de la API',
    detail:
      'GET /cursos y POST /cursos. Este archivo se queda igual cuando exista el backend.',
    source: cursosSource,
    language: 'javascript',
  },
  {
    path: 'src/api/client.js',
    role: 'Instancia de Axios',
    detail:
      'baseURL: /api. Acá se cambia la URL el día que haya servidor real.',
    source: clientSource,
    language: 'javascript',
  },
  {
    path: 'src/mocks/handlers.js',
    role: 'Backend falso',
    detail:
      'Define qué responde cada ruta: listado, alta, error 500 y delay.',
    source: handlersSource,
    language: 'javascript',
  },
  {
    path: 'src/mocks/data.js',
    role: 'Datos iniciales',
    detail:
      'Los cursos de ejemplo. Viven en memoria: se resetean al recargar.',
    source: dataSource,
    language: 'javascript',
  },
  {
    path: 'src/main.jsx',
    role: 'Arranque de MSW',
    detail:
      'Registra el Service Worker antes de renderizar, para no perder la primera petición.',
    source: mainSource,
    language: 'jsx',
  },
]

export function HowItWorks() {
  const [selectedPath, setSelectedPath] = useState(files[0].path)
  const selected = files.find((file) => file.path === selectedPath) ?? files[0]

  return (
    <section className="howto" aria-labelledby="howto-title">
      <header className="howto__head">
        <p className="kicker">Cómo funciona</p>
        <h2 id="howto-title">Revisá el repo. Toda la lógica está en estos archivos.</h2>
        <p>
          Elegí una tarjeta a la izquierda para ver el código real de ese
          archivo. Axios sale a <code>/api/cursos</code>; MSW intercepta esa
          petición en el navegador y responde con JSON.
        </p>
      </header>

      <div className="howto__split">
        <ol className="howto__files">
          {files.map((file) => {
            const active = file.path === selected.path

            return (
              <li key={file.path}>
                <button
                  type="button"
                  className={active ? 'howto__file is-active' : 'howto__file'}
                  aria-pressed={active}
                  onClick={() => setSelectedPath(file.path)}
                >
                  <code className="howto__path">{file.path}</code>
                  <p className="howto__role">{file.role}</p>
                  <p className="howto__detail">{file.detail}</p>
                </button>
              </li>
            )
          })}
        </ol>

        <div className="howto__code" aria-live="polite">
          <header className="howto__code-head">
            <h3>{selected.path}</h3>
          </header>
          <div className="howto__code-body">
            <SyntaxHighlighter
              language={selected.language}
              style={oneDark}
              showLineNumbers
              wrapLongLines={false}
              customStyle={{
                margin: 0,
                padding: '1rem',
                background: 'transparent',
                fontSize: '0.8rem',
                lineHeight: 1.55,
              }}
              codeTagProps={{
                style: {
                  fontFamily:
                    '"IBM Plex Mono", ui-monospace, Consolas, monospace',
                },
              }}
              lineNumberStyle={{
                color: '#4b5263',
                minWidth: '2.4em',
                paddingRight: '1em',
              }}
            >
              {selected.source.trimEnd()}
            </SyntaxHighlighter>
          </div>
        </div>
      </div>

    </section>
  )
}
