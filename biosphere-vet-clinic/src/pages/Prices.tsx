import { useDeferredValue, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AlertCircle, Loader2, Phone, Search, X } from 'lucide-react'
import { useBooking } from '@/components/booking/BookingContext'
import { EMERGENCY } from '@/data/branches'
import type { PriceItem } from '@/data/types'
import { formatVariantPrice, usePricelist } from '@/lib/pricelist'
import { usePageTitle } from '@/lib/usePageTitle'
import { cn, telHref } from '@/lib/utils'

const norm = (s: string) => s.toLowerCase().replace(/ё/g, 'е')

function Row({ item, query }: { item: PriceItem; query: string }) {
  const single = item.variants.length === 1 && !item.variants[0].name
  const highlight = (text: string) => {
    if (!query) return text
    const i = norm(text).indexOf(norm(query))
    if (i < 0) return text
    return (
      <>
        {text.slice(0, i)}
        <mark className="rounded bg-peach-200 px-0.5 text-ink">{text.slice(i, i + query.length)}</mark>
        {text.slice(i + query.length)}
      </>
    )
  }
  return (
    <li className="py-4">
      <div className="flex items-start justify-between gap-4">
        <p className="text-[15.5px] font-semibold leading-snug">{highlight(item.name)}</p>
        {single && (
          <p className="shrink-0 whitespace-nowrap text-[15.5px] font-extrabold text-teal-700">
            {formatVariantPrice(item.variants[0].from, item.variants[0].to)}
          </p>
        )}
      </div>
      {!single && item.variants.length > 0 && (
        <ul className="mt-2 grid gap-1.5">
          {item.variants.map((v, i) => (
            <li key={i} className="flex items-baseline gap-3 text-[14.5px] text-ink-soft">
              <span>{v.name || 'стоимость'}</span>
              <span className="mb-1 flex-1 border-b border-dotted border-ink/20" />
              <span className="whitespace-nowrap font-bold text-ink">{formatVariantPrice(v.from, v.to)}</span>
            </li>
          ))}
        </ul>
      )}
    </li>
  )
}

export default function Prices() {
  usePageTitle('Цены на услуги', 'Полный прайс-лист сети ветеринарных клиник «Биосфера» в Кирове с поиском по услугам.')
  const { data, error, loading } = usePricelist()
  const [params, setParams] = useSearchParams()
  const [query, setQuery] = useState('')
  const q = useDeferredValue(query.trim())
  const section = Number(params.get('section')) || null
  const openBooking = useBooking()

  const groups = useMemo(() => {
    if (!data) return []
    return data.sections
      .filter((s) => !section || s.id === section)
      .map((s) => ({
        ...s,
        items: data.items.filter((i) => i.section === s.id && (!q || norm(i.name).includes(norm(q)) || i.variants.some((v) => norm(v.name).includes(norm(q))))),
      }))
      .filter((g) => g.items.length)
  }, [data, section, q])

  const total = groups.reduce((n, g) => n + g.items.length, 0)
  const setSection = (id: number | null) => {
    const p = new URLSearchParams(params)
    if (id) p.set('section', String(id))
    else p.delete('section')
    setParams(p, { replace: true })
  }

  return (
    <div className="pb-24 pt-6 sm:pt-10">
      <div className="container">
        <span className="eyebrow">Прайс-лист</span>
        <h1 className="mt-3 text-[40px] font-extrabold leading-[1.05] sm:text-[56px]">
          Цены на <span className="accent">услуги</span>
        </h1>
        <p className="lead mt-4 max-w-2xl">
          Прайс загружается напрямую из системы клиники, поэтому цены всегда актуальны. Точную стоимость лечения врач
          назовёт после осмотра.
        </p>

        <div className="sticky top-[72px] z-20 -mx-5 mt-8 bg-cream/90 px-5 py-3 backdrop-blur-xl sm:mx-0 sm:rounded-3xl sm:px-0">
          <div className="relative">
            <Search className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-mute" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Найти услугу: УЗИ, кастрация, анализ крови…"
              className="input h-14 rounded-full pl-14 pr-12 text-[16px] shadow-soft"
              aria-label="Поиск по прайсу"
            />
            {query && (
              <button onClick={() => setQuery('')} className="absolute right-4 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full bg-ink/5" aria-label="Очистить">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {loading && (
          <div className="mt-16 flex items-center justify-center gap-3 text-ink-soft">
            <Loader2 className="h-6 w-6 animate-spin" /> Загружаем актуальный прайс…
          </div>
        )}

        {error && (
          <div className="mt-10 flex items-start gap-4 rounded-3xl bg-alert-50 p-6">
            <AlertCircle className="h-6 w-6 shrink-0 text-alert-600" />
            <div>
              <p className="font-bold">Не получилось загрузить прайс</p>
              <p className="mt-1 text-ink-soft">Попробуйте обновить страницу или уточните цену по телефону.</p>
              <a href={telHref(EMERGENCY.phone)} className="mt-3 inline-flex items-center gap-2 font-bold text-teal-600">
                <Phone className="h-4 w-4" /> {EMERGENCY.phone}
              </a>
            </div>
          </div>
        )}

        {data && (
          <div className="mt-8 grid gap-8 lg:grid-cols-[260px_1fr]">
            <aside className="lg:sticky lg:top-[160px] lg:self-start">
              <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 lg:mx-0 lg:max-h-[calc(100vh-190px)] lg:flex-col lg:overflow-y-auto lg:px-0">
                {[{ id: 0, name: 'Все разделы' }, ...data.sections].map((s) => {
                  const active = (s.id || null) === section
                  return (
                    <button
                      key={s.id}
                      onClick={() => setSection(s.id || null)}
                      className={cn(
                        'shrink-0 rounded-full px-4 py-2 text-left text-[14px] font-semibold transition lg:rounded-2xl',
                        active ? 'bg-ink text-white' : 'bg-white text-ink-soft hover:text-ink lg:bg-transparent lg:hover:bg-white',
                      )}
                    >
                      {s.name}
                    </button>
                  )
                })}
              </div>
            </aside>

            <div>
              <p className="mb-4 text-[14px] text-ink-mute">
                {q ? `Найдено: ${total}` : `${total} услуг`} · обновлено{' '}
                {new Date(data.updatedAt).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}
                {data.source === 'snapshot' && ' (сохранённая копия)'}
              </p>
              {groups.length === 0 && (
                <div className="rounded-3xl bg-white p-8 text-center shadow-soft">
                  <p className="text-lg font-bold">Ничего не нашли по запросу «{q}»</p>
                  <p className="mt-2 text-ink-soft">Попробуйте другое слово или спросите администратора по телефону.</p>
                </div>
              )}
              <div className="grid gap-5">
                {groups.map((g) => (
                  <section key={g.id} className="rounded-[28px] bg-white px-6 py-2 shadow-soft ring-1 ring-ink/[0.04] sm:px-8">
                    <h2 className="border-b border-ink/5 py-5 text-[22px] font-extrabold">{g.name}</h2>
                    <ul className="divide-y divide-ink/5">
                      {g.items.map((i) => (
                        <Row key={i.id} item={i} query={q} />
                      ))}
                    </ul>
                  </section>
                ))}
              </div>
              <div className="mt-8 flex flex-col items-start gap-4 rounded-[28px] bg-teal-50 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
                <p className="text-[16px] font-semibold">Остались вопросы по стоимости? Администратор подскажет.</p>
                <button onClick={() => openBooking()} className="btn btn-primary btn-md">
                  Записаться на приём
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
