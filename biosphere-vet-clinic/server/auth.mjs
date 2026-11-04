// Вход в админку: один пароль из переменной окружения ADMIN_PASSWORD.
// Сессия — подписанная (HMAC) кука HttpOnly; пароль нигде не хранится в коде.
import crypto from 'node:crypto'

const COOKIE = 'bio_admin'
const TTL_MS = 12 * 60 * 60 * 1000

// Если SESSION_SECRET не задан — генерируем случайный при старте
// (тогда после перезапуска сервера нужно войти заново).
const SECRET = process.env.SESSION_SECRET || crypto.randomBytes(32).toString('hex')

const sha = (s) => crypto.createHash('sha256').update(String(s)).digest()

export const adminConfigured = () => Boolean(process.env.ADMIN_PASSWORD && process.env.ADMIN_PASSWORD.length >= 10)

export function checkPassword(input) {
  if (!adminConfigured() || typeof input !== 'string') return false
  return crypto.timingSafeEqual(sha(input), sha(process.env.ADMIN_PASSWORD))
}

function sign(payload) {
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url')
  const mac = crypto.createHmac('sha256', SECRET).update(body).digest('base64url')
  return `${body}.${mac}`
}

function verify(token) {
  if (typeof token !== 'string' || !token.includes('.')) return null
  const [body, mac] = token.split('.')
  const expected = crypto.createHmac('sha256', SECRET).update(body).digest('base64url')
  const a = Buffer.from(mac)
  const b = Buffer.from(expected)
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null
  try {
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString())
    return payload.exp > Date.now() ? payload : null
  } catch {
    return null
  }
}

function readCookie(req, name) {
  const header = req.headers.cookie ?? ''
  for (const part of header.split(';')) {
    const [k, ...v] = part.trim().split('=')
    if (k === name) return decodeURIComponent(v.join('='))
  }
  return null
}

const cookieAttrs = (maxAgeSec) =>
  [
    `Path=/api/admin`,
    `Max-Age=${maxAgeSec}`,
    'HttpOnly',
    'SameSite=Strict',
    process.env.NODE_ENV === 'production' ? 'Secure' : '',
  ]
    .filter(Boolean)
    .join('; ')

export function issueSession(res) {
  const token = sign({ role: 'admin', exp: Date.now() + TTL_MS })
  res.setHeader('Set-Cookie', `${COOKIE}=${encodeURIComponent(token)}; ${cookieAttrs(TTL_MS / 1000)}`)
}

export function clearSession(res) {
  res.setHeader('Set-Cookie', `${COOKIE}=; ${cookieAttrs(0)}`)
}

export function requireAdmin(req, res, next) {
  if (verify(readCookie(req, COOKIE))) return next()
  res.status(401).json({ error: 'Нужно войти' })
}

// Защита от CSRF для POST: запрос должен прийти с нашего же сайта
export function sameOrigin(req, res, next) {
  const origin = req.headers.origin
  if (!origin) return next() // старые браузеры/инструменты без Origin; кука всё равно SameSite=Strict
  try {
    if (new URL(origin).host === req.headers.host) return next()
  } catch {
    /* noop */
  }
  res.status(403).json({ error: 'Запрос с чужого сайта' })
}
