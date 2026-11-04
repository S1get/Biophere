// Прайс-лист клиники берём из их собственной системы p.bios.re.
// Браузер не может ходить туда напрямую (нет CORS), поэтому сервер
// забирает прайс, нормализует, кэширует и отдаёт сайту через /api/pricelist.
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const API_BASE = 'https://p.bios.re/api'
const ITEMS_URL = `${API_BASE}/pricelist?version=services`
const SECTIONS_URL = `${API_BASE}/pricelist/sections?version=services`
const CACHE_TTL_MS = 6 * 60 * 60 * 1000 // 6 часов
const RETRY_AFTER_ERROR_MS = 10 * 60 * 1000 // при ошибке пробуем снова через 10 минут

const here = path.dirname(fileURLToPath(import.meta.url))
export const SNAPSHOT_PATH = path.join(here, 'data', 'pricelist.snapshot.json')

const num = (v) => (typeof v === 'number' && Number.isFinite(v) ? v : null)
const clean = (s) => String(s ?? '').replace(/\s+/g, ' ').trim()

export function normalize(rawItems, rawSections) {
  const sections = Object.entries(rawSections ?? {})
    .map(([id, name]) => ({ id: Number(id), name: clean(name) }))
    .filter((s) => Number.isFinite(s.id) && s.name)
    .sort((a, b) => a.id - b.id)

  const items = (Array.isArray(rawItems) ? rawItems : [])
    .map((it, i) => ({
      id: clean(it?._id?.$oid) || `i${i}`,
      section: Number(it?.section),
      name: clean(it?.name),
      variants: (Array.isArray(it?.variants) ? it.variants : [])
        .map((v) => ({ name: clean(v?.name), from: num(v?.service_start), to: num(v?.service_end) }))
        .filter((v) => v.name || v.from !== null),
    }))
    .filter((it) => it.name)

  const used = new Set(items.map((i) => i.section))
  return { sections: sections.filter((s) => used.has(s.id)), items }
}

export async function fetchFromSource(timeoutMs = 20000) {
  const headers = { 'User-Agent': 'BiosphereSite/2.0', Accept: 'application/json' }
  const get = async (url) => {
    const res = await fetch(url, { headers, signal: AbortSignal.timeout(timeoutMs) })
    if (!res.ok) throw new Error(`HTTP ${res.status} от ${new URL(url).host}`)
    return res.json()
  }
  const [rawSections, rawItems] = await Promise.all([get(SECTIONS_URL), get(ITEMS_URL)])
  const data = normalize(rawItems, rawSections)
  if (data.items.length < 10) throw new Error(`Подозрительно мало позиций: ${data.items.length}`)
  return data
}

export async function writeSnapshot(data) {
  await mkdir(path.dirname(SNAPSHOT_PATH), { recursive: true })
  await writeFile(SNAPSHOT_PATH, JSON.stringify({ savedAt: new Date().toISOString(), ...data }))
}

async function readSnapshot() {
  try {
    return JSON.parse(await readFile(SNAPSHOT_PATH, 'utf8'))
  } catch {
    return null
  }
}

// --- кэш в памяти + статус для мониторинга ---
const state = {
  data: null,
  fetchedAt: 0,
  source: 'none', // live | snapshot | none
  lastAttemptAt: 0,
  lastError: null,
  lastErrorAt: 0,
  okCount: 0,
  errorCount: 0,
  lastDurationMs: null,
  inflight: null,
}

async function refresh() {
  state.lastAttemptAt = Date.now()
  const t0 = performance.now()
  try {
    const data = await fetchFromSource()
    state.data = data
    state.fetchedAt = Date.now()
    state.source = 'live'
    state.okCount++
    state.lastError = null
    state.lastDurationMs = Math.round(performance.now() - t0)
  } catch (err) {
    state.errorCount++
    state.lastError = String(err?.message ?? err)
    state.lastErrorAt = Date.now()
    state.lastDurationMs = Math.round(performance.now() - t0)
    if (!state.data) {
      const snap = await readSnapshot()
      if (snap) {
        state.data = { sections: snap.sections, items: snap.items }
        state.fetchedAt = Date.parse(snap.savedAt) || 0
        state.source = 'snapshot'
      }
    }
  }
}

export async function getPricelist() {
  const now = Date.now()
  const stale = now - state.fetchedAt > CACHE_TTL_MS || state.source !== 'live'
  const mayRetry = now - state.lastAttemptAt > (state.lastError ? RETRY_AFTER_ERROR_MS : 0)
  if (!state.data || (stale && mayRetry)) {
    state.inflight ??= refresh().finally(() => (state.inflight = null))
    // Если что-то уже есть в кэше — отдаём сразу, обновление идёт в фоне
    if (!state.data) await state.inflight
  }
  if (!state.data) return null
  return {
    updatedAt: new Date(state.fetchedAt).toISOString(),
    source: state.source,
    ...state.data,
  }
}

export function pricelistStatus() {
  return {
    source: state.source,
    items: state.data?.items.length ?? 0,
    sections: state.data?.sections.length ?? 0,
    fetchedAt: state.fetchedAt ? new Date(state.fetchedAt).toISOString() : null,
    lastAttemptAt: state.lastAttemptAt ? new Date(state.lastAttemptAt).toISOString() : null,
    lastError: state.lastError,
    lastErrorAt: state.lastErrorAt ? new Date(state.lastErrorAt).toISOString() : null,
    okCount: state.okCount,
    errorCount: state.errorCount,
    lastDurationMs: state.lastDurationMs,
    cacheTtlHours: CACHE_TTL_MS / 3600000,
  }
}
