// Простой мониторинг сайта в памяти процесса: запросы, просмотры страниц,
// ошибки, самопинг против засыпания. После перезапуска счётчики обнуляются.
const HOUR = 3600_000
const startedAt = Date.now()

const counters = {
  requests: 0,
  byStatus: { '2xx': 0, '3xx': 0, '4xx': 0, '5xx': 0 },
  pageviews: 0,
  apiCalls: 0,
}
const pages = new Map() // путь -> просмотры
const hourly = new Map() // начало часа (ms) -> { requests, pageviews, errors }
const recentErrors = [] // последние 25 ошибок
const apiTimings = [] // последние 200 времен ответа API, мс

const keepalive = {
  enabled: false,
  target: null,
  intervalMin: null,
  history: [], // последние 30 пингов
}

const BOT_RE = /bot|crawl|spider|slurp|uptime|monitor|curl|wget|python|axios|node-fetch|headless/i

function bucket(now = Date.now()) {
  const key = Math.floor(now / HOUR) * HOUR
  let b = hourly.get(key)
  if (!b) {
    b = { requests: 0, pageviews: 0, errors: 0 }
    hourly.set(key, b)
    // храним только последние 48 часов
    for (const k of hourly.keys()) if (k < key - 48 * HOUR) hourly.delete(k)
  }
  return b
}

export function requestMiddleware(req, res, next) {
  const t0 = performance.now()
  res.on('finish', () => {
    counters.requests++
    const cls = `${Math.floor(res.statusCode / 100)}xx`
    if (cls in counters.byStatus) counters.byStatus[cls]++
    const b = bucket()
    b.requests++
    if (req.path.startsWith('/api/')) {
      counters.apiCalls++
      apiTimings.push(performance.now() - t0)
      if (apiTimings.length > 200) apiTimings.shift()
    }
    if (res.statusCode >= 500) {
      b.errors++
      pushError(`${req.method} ${req.path} → ${res.statusCode}`)
    }
  })
  next()
}

export function pushError(message) {
  recentErrors.unshift({ at: new Date().toISOString(), message: String(message).slice(0, 300) })
  if (recentErrors.length > 25) recentErrors.pop()
}

const PATH_RE = /^\/[a-z0-9\-/]{0,60}$/i

export function trackPageview(path, userAgent) {
  if (typeof path !== 'string' || !PATH_RE.test(path)) return false
  if (BOT_RE.test(userAgent ?? '')) return false
  if (path.startsWith('/admin')) return false
  counters.pageviews++
  bucket().pageviews++
  if (pages.size < 200 || pages.has(path)) pages.set(path, (pages.get(path) ?? 0) + 1)
  return true
}

export function startKeepalive(baseUrl, intervalMin = 10) {
  if (!baseUrl) return
  keepalive.enabled = true
  keepalive.target = `${baseUrl.replace(/\/$/, '')}/api/health?source=keepalive`
  keepalive.intervalMin = intervalMin
  const ping = async () => {
    const t0 = performance.now()
    const entry = { at: new Date().toISOString(), ok: false, status: null, ms: null, error: null }
    try {
      const res = await fetch(keepalive.target, {
        headers: { 'User-Agent': 'BiosphereKeepalive/1.0' },
        signal: AbortSignal.timeout(30000),
      })
      entry.status = res.status
      entry.ok = res.ok
    } catch (err) {
      entry.error = String(err?.message ?? err).slice(0, 120)
    }
    entry.ms = Math.round(performance.now() - t0)
    keepalive.history.unshift(entry)
    if (keepalive.history.length > 30) keepalive.history.pop()
  }
  // Первый пинг через минуту после старта, затем каждые intervalMin минут
  setTimeout(ping, 60_000).unref()
  setInterval(ping, intervalMin * 60_000).unref()
}

export function snapshot(extra = {}) {
  const now = Date.now()
  const hours = []
  for (let i = 23; i >= 0; i--) {
    const key = Math.floor(now / HOUR) * HOUR - i * HOUR
    const b = hourly.get(key) ?? { requests: 0, pageviews: 0, errors: 0 }
    hours.push({ hour: new Date(key).toISOString(), ...b })
  }
  const sorted = [...apiTimings].sort((a, b) => a - b)
  const pct = (p) => (sorted.length ? Math.round(sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * p))]) : null)
  const mem = process.memoryUsage()
  return {
    now: new Date(now).toISOString(),
    server: {
      startedAt: new Date(startedAt).toISOString(),
      uptimeSec: Math.round((now - startedAt) / 1000),
      node: process.version,
      memoryMb: { rss: Math.round(mem.rss / 1048576), heapUsed: Math.round(mem.heapUsed / 1048576) },
      commit: process.env.RENDER_GIT_COMMIT?.slice(0, 7) ?? null,
      service: process.env.RENDER_SERVICE_NAME ?? 'local',
      externalUrl: process.env.RENDER_EXTERNAL_URL ?? null,
    },
    traffic: {
      ...counters,
      byStatus: { ...counters.byStatus },
      apiLatencyMs: { p50: pct(0.5), p95: pct(0.95) },
      topPages: [...pages.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10).map(([path, views]) => ({ path, views })),
      hours,
    },
    keepalive: { ...keepalive, history: keepalive.history.slice(0, 12) },
    recentErrors: recentErrors.slice(0, 10),
    ...extra,
  }
}
