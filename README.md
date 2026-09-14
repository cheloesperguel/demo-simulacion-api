# Laboratorio Axios + MSW

Demo para armar un front en React **sin backend**. Axios hace peticiones HTTP normales. [Mock Service Worker](https://mswjs.io/) las intercepta en el navegador y responde con JSON.

Cuando exista la API real, se apaga MSW. Los componentes no cambian.

## Cómo correrlo

```bash
npm install
npm run dev
```

## Idea que tienen que llevarse

```
React  →  axios.get('/api/cursos')  →  MSW (Service Worker)  →  JSON
```

- `src/api/cursos.js` es el código que van a seguir usando contra el backend.
- `src/mocks/handlers.js` es el backend falso. Ahí se define qué responde cada ruta.
- `src/main.jsx` arranca MSW **antes** de renderizar la app, para no perder la primera petición.

## Archivos clave

| Archivo | Rol |
| --- | --- |
| `src/api/client.js` | Instancia de Axios (`baseURL: '/api'`) |
| `src/api/cursos.js` | `getCursos` y `crearCurso` |
| `src/mocks/handlers.js` | GET y POST simulados |
| `src/mocks/browser.js` | Registra el Service Worker |
| `public/mockServiceWorker.js` | Worker que genera `npx msw init` |

## Pasar a un backend real

1. En `.env` (o `.env.development`): `VITE_ENABLE_MSW=false`
2. En `src/api/client.js`, cambiá `baseURL` a la URL del servidor.
3. Listo: React y Axios siguen iguales.

## Qué probar en clase

1. **Cargar cursos** — GET 200 con delay de 700 ms.
2. **Simular error 500** — el handler lee `?error=1` y falla a propósito.
3. **Crear curso** — POST 201; el curso nuevo queda en memoria hasta recargar.
4. Abrir DevTools → Network: la petición existe. Axios no está “fakeado”; la red sí.

## Stack

React 19 · Vite 8 · Axios 1 · MSW 2
