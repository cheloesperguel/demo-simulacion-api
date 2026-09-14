const listeners = new Set()

export function subscribeLog(listener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function pushLog(entry) {
  const event = {
    id: crypto.randomUUID(),
    at: new Date().toISOString(),
    ...entry,
  }
  listeners.forEach((listener) => listener(event))
}
