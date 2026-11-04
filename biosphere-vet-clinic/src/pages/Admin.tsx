import { useCallback, useEffect, useState, type FormEvent, type ReactNode } from 'react'
import { Activity, AlertTriangle, Eye, HeartPulse, Loader2, LogOut, RefreshCw, Server, Tag, Zap } from 'lucide-react'
import { LogoMark } from '@/components/Logo'
import { usePageTitle } from '@/lib/usePageTitle'
import { cn } from '@/lib/utils'

interface Stats {
  now: string
  server: {
    startedAt: string
    uptimeSec: number
    node: string
    memoryMb: { rss: number; heapUsed: number }
    commit: string | null
    service: string
    externalUrl: string | null
  }
  traffic: {
    requests: number
    pageviews: number
    apiCalls: number
    byStatus: Record<string, number>
    apiLatencyMs: { p50: number | null; p95: number | null }
    topPages: { path: string; views: number }[]
    hours: { hour: string; requests: number; pageviews: number; errors: number }[]
  }
  keepalive: {
    enabled: boolean
    target: string | null
    intervalMin: number | null
    history: { at: string; ok: boolean; status: number | null; ms: number | null; error: string | null }[]
  }
  pricelist: {
    source: string
    items: number
    sections: number
    fetchedAt: string | null
    lastError: string | null
    lastErrorAt: string | null
    okCount: number
    errorCount: number
    lastDurationMs: number | null
    cacheTtlHours: number
  }
  recentErrors: { at: string; message: string }[]
}

const time = (iso: string | null) =>
  iso ? new Date(iso).toLocaleString('ru-RU', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : '—'

const uptime = (s: number) => {
  const d = Math.floor(s / 86400)
  const h = Math.floor((s % 86400) / 3600)
  const m = Math.floor((s % 3600) / 60)
  return [d && `${d} д`, h && `${h} ч`, `${m} мин`].filter(Boolean).join(' ')
}

function Card({ title, icon, children, status }: { title: string; icon: ReactNode; children: ReactNode; status?: 'ok' | 'warn' | 'bad' }) {
  return (
    <section className="rounded-3xl bg-white p-6 shadow-soft ring-1 ring-ink/[0.04]">
      <header className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-2xl bg-cream text-teal-600">{icon}</span>
        <h2 className="text-[17px] font-extrabold">{title}</h2>
        {status && (
          <span
            className={cn(
              'ml-auto chip',
              status === 'ok' && 'bg-leaf-50 text-leaf-700',
              status === 'warn' && 'bg-peach-100 text-peach-500',
              status === 'bad' && 'bg-alert-50 text-alert-600',
            )}
          >
            <span className={cn('h-2 w-2 rounded-full', status === 'ok' ? 'bg-leaf-500' : status === 'warn' ? 'bg-peach-400' : 'bg-alert-500')} />
            {status === 'ok' ? 'Норма' : status === 'warn' ? 'Внимание' : 'Проблема'}
          </span>
        )}
      </header>
      <div className="mt-5">{children}</div>
    </section>
  )
}

function Metric({ label, value, hint }: { label: string; value: ReactNode; hint?: string }) {
  return (
    <div>
      <p className="text-[13px] font-medium text-ink-mute">{label}</p>
      <p className="mt-0.5 text-[24px] font-extrabold leading-tight">{value}</p>
      {hint && <p className="text-[12px] text-ink-mute">{hint}</p>}
    </div>
  )
}

function Login({ onDone }: { onDone: () => void }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setError(null)
    try {
      const r = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      if (r.ok) return onDone()
      const j = await r.json().catch(() => ({}))
      setError(j.error ?? 'Не удалось войти')
    } catch {
      setError('Сервер недоступен')
    } finally {
      setBusy(false)
    }
  }
  return (
    <div className="grid min-h-[80vh] place-items-center px-5">
      <form onSubmit={submit} className="w-full max-w-sm rounded-[32px] bg-white p-8 shadow-lift">
        <LogoMark className="h-12 w-12" />
        <h1 className="mt-5 text-2xl font-extrabold">Мониторинг сайта</h1>
        <p className="mt-1 text-[15px] text-ink-soft">Только для администраторов</p>
        <label className="label mt-6" htmlFor="adm-pass">Пароль</label>
        <input
          id="adm-pass"
          type="password"
          className="input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          autoFocus
        />
        {error && <p className="mt-3 text-[14px] font-semibold text-alert-600">{error}</p>}
        <button className="btn btn-primary btn-md mt-6 w-full" disabled={busy || !password}>
          {busy ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Войти'}
        </button>
      </form>
    </div>
  )
}

export default function Admin() {
  usePageTitle('Мониторинг')
  const [stats, setStats] = useState<Stats | null>(null)
  const [state, setState] = useState<'loading' | 'login' | 'ok' | 'error'>('loading')
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null)

  useEffect(() => {
    const meta = document.createElement('meta')
    meta.name = 'robots'
    meta.content = 'noindex, nofollow'
    document.head.appendChild(meta)
    return () => meta.remove()
  }, [])

  const load = useCallback(async () => {
    try {
      const r = await fetch('/api/admin/stats', { credentials: 'same-origin' })
      if (r.status === 401) return setState('login')
      if (!r.ok) throw new Error()
      setStats(await r.json())
      setUpdatedAt(new Date())
      setState('ok')
    } catch {
      setState('error')
    }
  }, [])

  useEffect(() => {
    load()
    const t = setInterval(() => state === 'ok' && load(), 30_000)
    return () => clearInterval(t)
  }, [load, state])

  const logout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' })
    setStats(null)
    setState('login')
  }

  if (state === 'login') return <Login onDone={load} />
  if (state === 'loading')
    return (
      <div className="grid min-h-[60vh] place-items-center">
        <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
      </div>
    )
  if (state === 'error' || !stats)
    return (
      <div className="container py-20 text-center">
        <p className="text-lg font-bold">Сервер мониторинга не отвечает</p>
        <button onClick={load} className="btn btn-ghost btn-md mt-4">
          Повторить
        </button>
      </div>
    )

  const { server, traffic, keepalive, pricelist, recentErrors } = stats
  const lastPing = keepalive.history[0]
  const pingStatus = !keepalive.enabled ? 'warn' : lastPing && !lastPing.ok ? 'bad' : 'ok'
  const priceStatus = pricelist.source === 'live' && !pricelist.lastError ? 'ok' : pricelist.source === 'none' ? 'bad' : 'warn'
  const maxHour = Math.max(1, ...traffic.hours.map((h) => h.pageviews))

  return (
    <div className="container pb-24 pt-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-[32px] font-extrabold">Мониторинг сайта</h1>
          <p className="text-[14px] text-ink-mute">
            Обновлено {updatedAt?.toLocaleTimeString('ru-RU')} · автообновление каждые 30 секунд · счётчики сбрасываются при перезапуске сервера
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={load} className="btn btn-ghost btn-sm">
            <RefreshCw className="h-4 w-4" /> Обновить
          </button>
          <button onClick={logout} className="btn btn-ghost btn-sm">
            <LogOut className="h-4 w-4" /> Выйти
          </button>
        </div>
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-3">
        <Card title="Сервер" icon={<Server className="h-5 w-5" />} status="ok">
          <div className="grid grid-cols-2 gap-5">
            <Metric label="Работает без перезапуска" value={uptime(server.uptimeSec)} hint={`с ${time(server.startedAt)}`} />
            <Metric label="Память" value={`${server.memoryMb.rss} МБ`} hint={`heap ${server.memoryMb.heapUsed} МБ`} />
            <Metric label="Версия кода" value={server.commit ?? 'local'} hint={server.service} />
            <Metric label="Node.js" value={server.node} />
          </div>
        </Card>

        <Card title="Антисон" icon={<HeartPulse className="h-5 w-5" />} status={pingStatus}>
          {keepalive.enabled ? (
            <>
              <p className="text-[14px] text-ink-soft">
                Сервер сам пингует себя каждые {keepalive.intervalMin} мин, чтобы Render не усыплял сайт.
              </p>
              <div className="mt-4 flex gap-1" aria-label="Последние пинги">
                {[...keepalive.history].reverse().map((p) => (
                  <span
                    key={p.at}
                    title={`${time(p.at)} — ${p.ok ? `${p.ms} мс` : p.error ?? p.status}`}
                    className={cn('h-8 flex-1 rounded-md', p.ok ? 'bg-leaf-400' : 'bg-alert-500')}
                  />
                ))}
                {keepalive.history.length === 0 && <span className="text-[14px] text-ink-mute">Первый пинг — через минуту после старта</span>}
              </div>
              {lastPing && (
                <p className="mt-3 text-[13px] text-ink-mute">
                  Последний: {time(lastPing.at)} · {lastPing.ok ? `${lastPing.ms} мс` : lastPing.error ?? `HTTP ${lastPing.status}`}
                </p>
              )}
            </>
          ) : (
            <p className="text-[14px] text-ink-soft">
              Выключен: работает только на Render (нужна переменная RENDER_EXTERNAL_URL — Render задаёт её сам).
            </p>
          )}
        </Card>

        <Card title="Прайс из p.bios.re" icon={<Tag className="h-5 w-5" />} status={priceStatus}>
          <div className="grid grid-cols-2 gap-5">
            <Metric
              label="Источник"
              value={pricelist.source === 'live' ? 'Живой' : pricelist.source === 'snapshot' ? 'Копия' : 'Нет'}
              hint={`кэш ${pricelist.cacheTtlHours} ч`}
            />
            <Metric label="Услуг" value={pricelist.items} hint={`${pricelist.sections} разделов`} />
            <Metric label="Загружен" value={<span className="text-[18px]">{time(pricelist.fetchedAt)}</span>} hint={pricelist.lastDurationMs ? `${pricelist.lastDurationMs} мс` : undefined} />
            <Metric label="Успешно / ошибок" value={`${pricelist.okCount} / ${pricelist.errorCount}`} />
          </div>
          {pricelist.lastError && (
            <p className="mt-4 rounded-2xl bg-alert-50 p-3 text-[13px] text-alert-700">
              {time(pricelist.lastErrorAt)}: {pricelist.lastError}
            </p>
          )}
        </Card>

        <div className="lg:col-span-2">
          <Card title="Посещаемость за 24 часа" icon={<Eye className="h-5 w-5" />}>
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
              <Metric label="Просмотров страниц" value={traffic.pageviews.toLocaleString('ru-RU')} hint="с момента запуска" />
              <Metric label="Всего запросов" value={traffic.requests.toLocaleString('ru-RU')} />
              <Metric label="Ответ API (p50 / p95)" value={traffic.apiLatencyMs.p50 !== null ? `${traffic.apiLatencyMs.p50} / ${traffic.apiLatencyMs.p95} мс` : '—'} />
              <Metric label="Ошибки 5xx" value={traffic.byStatus['5xx'] ?? 0} hint={`4xx: ${traffic.byStatus['4xx'] ?? 0}`} />
            </div>
            <div className="mt-6 flex h-36 items-end gap-1" role="img" aria-label="Просмотры по часам">
              {traffic.hours.map((h) => (
                <div key={h.hour} className="group relative flex h-full flex-1 flex-col justify-end">
                  <div
                    className={cn('rounded-t-md transition', h.errors ? 'bg-alert-500' : 'bg-teal-400 group-hover:bg-teal-600')}
                    style={{ height: `${Math.max(3, (h.pageviews / maxHour) * 100)}%`, opacity: h.pageviews ? 1 : 0.25 }}
                  />
                  <span className="pointer-events-none absolute -top-8 left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded-lg bg-ink px-2 py-1 text-[11px] text-white group-hover:block">
                    {new Date(h.hour).getHours()}:00 — {h.pageviews}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-1 flex justify-between text-[11px] text-ink-mute">
              <span>24 ч назад</span>
              <span>сейчас</span>
            </div>
          </Card>
        </div>

        <Card title="Популярные страницы" icon={<Activity className="h-5 w-5" />}>
          {traffic.topPages.length ? (
            <ul className="space-y-2.5">
              {traffic.topPages.map((p) => (
                <li key={p.path} className="flex items-center justify-between gap-3 text-[14px]">
                  <span className="truncate font-mono">{p.path}</span>
                  <span className="font-bold">{p.views}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-[14px] text-ink-mute">Пока нет просмотров</p>
          )}
        </Card>

        <div className="lg:col-span-3">
          <Card title="Последние ошибки" icon={recentErrors.length ? <AlertTriangle className="h-5 w-5" /> : <Zap className="h-5 w-5" />} status={recentErrors.length ? 'warn' : 'ok'}>
            {recentErrors.length ? (
              <ul className="divide-y divide-ink/5 text-[14px]">
                {recentErrors.map((e, i) => (
                  <li key={i} className="flex gap-4 py-2">
                    <span className="shrink-0 text-ink-mute">{time(e.at)}</span>
                    <span className="font-mono">{e.message}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-[14px] text-ink-mute">Ошибок нет 🎉</p>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
