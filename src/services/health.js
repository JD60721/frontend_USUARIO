export async function pingBackend({ timeoutMs = 4000 } = {}) {
  const base = import.meta.env.VITE_API_URL || 'http://localhost:5000'
  // Asegura que no haya doble /api si ya viene con /api
  const url = base.endsWith('/api') ? base : `${base}/api`
  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const res = await fetch(url, { method: 'HEAD', signal: controller.signal })
    return { ok: res.ok, status: res.status }
  } catch (err) {
    return { ok: false, error: err?.name || 'PingError' }
  } finally {
    clearTimeout(id)
  }
}