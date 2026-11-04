import { useEffect, useState } from 'react'
import type { PriceItem, Pricelist } from '@/data/types'

let cache: Pricelist | null = null
let inflight: Promise<Pricelist> | null = null

export function loadPricelist(): Promise<Pricelist> {
  if (cache) return Promise.resolve(cache)
  inflight ??= fetch('/api/pricelist', { headers: { Accept: 'application/json' } })
    .then(async (r) => {
      if (!r.ok) throw new Error(`Прайс недоступен (${r.status})`)
      const ct = r.headers.get('content-type') ?? ''
      if (!ct.includes('application/json')) throw new Error('Сервер прайса вернул не JSON')
      cache = (await r.json()) as Pricelist
      return cache
    })
    .finally(() => (inflight = null))
  return inflight
}

export function usePricelist() {
  const [data, setData] = useState<Pricelist | null>(cache)
  const [error, setError] = useState<string | null>(null)
  useEffect(() => {
    if (cache) return
    let alive = true
    loadPricelist()
      .then((d) => alive && setData(d))
      .catch((e: Error) => alive && setError(e.message))
    return () => {
      alive = false
    }
  }, [])
  return { data, error, loading: !data && !error }
}

export const minPrice = (item: PriceItem) => {
  const vals = item.variants.map((v) => v.from).filter((v): v is number => v !== null)
  return vals.length ? Math.min(...vals) : null
}

export interface PriceRule {
  /** точное начало названия услуги в прайсе */
  startsWith?: string
  /** минимальная цена по разделу */
  section?: number
}

/** Базовая цена услуги — первый вариант с ценой (дальше обычно идут доплаты: «за следующий снимок» и т.п.) */
const basePrice = (item: PriceItem) => item.variants.find((v) => v.from !== null && v.from > 0)?.from ?? null

/** Цена «от» по правилу; null если не нашли (тогда просто не показываем цену) */
export function priceFrom(list: Pricelist | null, rule: PriceRule): number | null {
  if (!list) return null
  if (rule.startsWith) {
    const item = list.items.find((i) => i.name.toLowerCase().startsWith(rule.startsWith!.toLowerCase()))
    return item ? basePrice(item) : null
  }
  const vals = list.items
    .filter((i) => i.section === rule.section)
    .map(basePrice)
    .filter((v): v is number => v !== null)
  return vals.length ? Math.min(...vals) : null
}

export const formatVariantPrice = (from: number | null, to: number | null) => {
  if (from === null) return 'уточняйте'
  const f = from.toLocaleString('ru-RU')
  return to !== null && to !== from ? `${f}–${to.toLocaleString('ru-RU')} ₽` : `${f} ₽`
}
