// Сервер сайта «Биосфера»: отдаёт собранный сайт (dist) и небольшое API.
//   GET  /api/health          — проверка, что сервер жив (её же дёргает самопинг)
//   GET  /api/pricelist       — прайс из p.bios.re (кэш 6 ч, запасная копия)
//   POST /api/track           — счётчик просмотров страниц (без IP и cookies)
//   POST /api/admin/login     — вход в админку (пароль из ADMIN_PASSWORD)
//   POST /api/admin/logout
//   GET  /api/admin/stats     — данные мониторинга
import express from 'express'
import helmet from 'helmet'
import compression from 'compression'
import rateLimit from 'express-rate-limit'
import path from 'node:path'
import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { getPricelist, pricelistStatus } from './pricelist.mjs'
import { requestMiddleware, trackPageview, startKeepalive, snapshot, pushError } from './monitor.mjs'
import { adminConfigured, checkPassword, issueSession, clearSession, requireAdmin, sameOrigin } from './auth.mjs'

const here = path.dirname(fileURLToPath(import.meta.url))
const DIST = path.resolve(here, '..', 'dist')
const PORT = Number(process.env.PORT) || 3001
const isProd = process.env.NODE_ENV === 'production' || Boolean(process.env.RENDER)

const app = express()
app.disable('x-powered-by')
app.set('trust proxy', 1) // Render стоит перед нами прокси — берём реальный IP для лимитов

app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: false,
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", 'https://mc.yandex.ru'],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', 'https://mc.yandex.ru', 'https://*.yandex.ru', 'https://*.yandex.net'],
        fontSrc: ["'self'", 'data:'],
        connectSrc: ["'self'", 'https://mc.yandex.ru'],
        frameSrc: ['https://yandex.ru', 'https://*.yandex.ru'],
        objectSrc: ["'none'"],
        baseUri: ["'self'"],
        formAction: ["'self'"],
        frameAncestors: ["'none'"],
        upgradeInsecureRequests: isProd ? [] : null,
      },
    },
    crossOriginEmbedderPolicy: false,
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    hsts: isProd ? { maxAge: 31536000, includeSubDomains: true } : false,
  }),
)
// Пока сайт тестовый (адрес onrender.com), прячем его от поисковиков.
// Когда переедет на домен клиники — задать INDEXING=on в Render.
const indexing = process.env.INDEXING === 'on'
app.use((_req, res, next) => {
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()')
  if (!indexing) res.setHeader('X-Robots-Tag', 'noindex, nofollow')
  next()
})
app.use(compression())
app.use(requestMiddleware)
app.use('/api', express.json({ limit: '4kb' }))

// ---------- API ----------
const apiLimiter = rateLimit({ windowMs: 60_000, limit: 120, standardHeaders: 'draft-7', legacyHeaders: false })
const trackLimiter = rateLimit({ windowMs: 60_000, limit: 30, standardHeaders: 'draft-7', legacyHeaders: false })
const loginLimiter = rateLimit({
  windowMs: 15 * 60_000,
  limit: 8,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: 'Слишком много попыток. Подождите 15 минут.' },
})

app.get('/api/health', (_req, res) => {
  res.set('Cache-Control', 'no-store').json({ ok: true, uptimeSec: Math.round(process.uptime()) })
})

app.get('/api/pricelist', apiLimiter, async (_req, res) => {
  try {
    const data = await getPricelist()
    if (!data) return res.status(503).json({ error: 'Прайс временно недоступен' })
    res.set('Cache-Control', 'public, max-age=600').json(data)
  } catch (err) {
    pushError(`pricelist: ${err?.message ?? err}`)
    res.status(503).json({ error: 'Прайс временно недоступен' })
  }
})

app.post('/api/track', trackLimiter, sameOrigin, (req, res) => {
  trackPageview(req.body?.path, req.headers['user-agent'])
  res.status(204).end()
})

app.post('/api/admin/login', loginLimiter, sameOrigin, (req, res) => {
  if (!adminConfigured()) {
    return res.status(503).json({ error: 'Админка не настроена: задайте ADMIN_PASSWORD (от 10 символов) в Render' })
  }
  if (!checkPassword(req.body?.password)) {
    return res.status(401).json({ error: 'Неверный пароль' })
  }
  issueSession(res)
  res.json({ ok: true })
})

app.post('/api/admin/logout', sameOrigin, (_req, res) => {
  clearSession(res)
  res.json({ ok: true })
})

app.get('/api/admin/stats', apiLimiter, requireAdmin, async (_req, res) => {
  res.set('Cache-Control', 'no-store').json(snapshot({ pricelist: pricelistStatus() }))
})

app.use('/api', (_req, res) => res.status(404).json({ error: 'Не найдено' }))

// ---------- Сайт ----------
if (existsSync(DIST)) {
  app.use(
    '/assets',
    express.static(path.join(DIST, 'assets'), { immutable: true, maxAge: '1y', index: false }),
  )
  app.use(
    express.static(DIST, {
      index: false,
      maxAge: '7d',
      setHeaders: (res, file) => {
        if (file.endsWith('.html')) res.setHeader('Cache-Control', 'no-cache')
      },
    }),
  )
  // SPA: все остальные адреса отдают index.html (роутинг в браузере)
  app.get('*', (req, res) => {
    if (path.extname(req.path)) return res.status(404).end()
    if (req.path.startsWith('/admin')) res.setHeader('X-Robots-Tag', 'noindex, nofollow')
    res.setHeader('Cache-Control', 'no-cache')
    res.sendFile(path.join(DIST, 'index.html'))
  })
} else {
  app.get('/', (_req, res) => res.type('text').send('Сначала соберите сайт: npm run build'))
}

app.use((err, _req, res, _next) => {
  pushError(err?.message ?? err)
  res.status(500).json({ error: 'Внутренняя ошибка' })
})

app.listen(PORT, () => {
  console.log(`Биосфера: http://localhost:${PORT}  (prod=${isProd}, admin=${adminConfigured() ? 'вкл' : 'выкл'})`)
  // Антисон: на бесплатном Render сервис засыпает через 15 минут без трафика
  if (process.env.RENDER_EXTERNAL_URL && process.env.KEEPALIVE !== 'off') {
    startKeepalive(process.env.RENDER_EXTERNAL_URL, Number(process.env.KEEPALIVE_MIN) || 10)
  }
  // Прогреваем кэш прайса
  getPricelist().catch(() => {})
})
