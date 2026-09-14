import { useEffect, useState } from 'react'
import { subscribeLog } from '../api/log.js'

export function RequestTrace() {
  const [entries, setEntries] = useState([])

  useEffect(() => {
    return subscribeLog((entry) => {
      setEntries((current) => [entry, ...current].slice(0, 12))
    })
  }, [])

  return (
    <aside className="trace" aria-live="polite">
      <header className="trace__head">
        <p className="kicker">Traza de red</p>
        <h2>Lo que ve Axios</h2>
        <p>
          MSW intercepta esta petición en el navegador y responde. Abrí DevTools
          → Network: también aparece ahí.
        </p>
      </header>

      {entries.length === 0 ? (
        <p className="trace__empty">
          Todavía no salió ninguna petición. Cargá los cursos para ver el
          intercambio.
        </p>
      ) : (
        <ol className="trace__list">
          {entries.map((entry) => (
            <li key={entry.id} className={`trace__item trace__item--${entry.phase}`}>
              <span className="trace__phase">
                {entry.phase === 'request' ? '→' : '←'} {entry.phase}
              </span>
              <code>
                {entry.method} {entry.url}
              </code>
              {entry.status !== undefined && (
                <span className="trace__meta">
                  {entry.status || 'sin respuesta'}
                  {entry.ms != null ? ` · ${entry.ms} ms` : ''}
                  {entry.phase !== 'request' ? ' · MSW' : ''}
                </span>
              )}
              {entry.message && <p className="trace__error">{entry.message}</p>}
            </li>
          ))}
        </ol>
      )}
    </aside>
  )
}
