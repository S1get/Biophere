import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { Branch } from '@/data/types'

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs))

/** 44-37-97 → tel:+78332443797 (код Кирова 8332) */
export const telHref = (local: string) => `tel:+78332${local.replace(/\D/g, '')}`
export const fullPhone = (local: string) => `+7 (8332) ${local}`

/** Текущее время в Кирове (UTC+3, без перехода на летнее время) */
export function kirovNow(date = new Date()) {
  const k = new Date(date.getTime() + 3 * 3600_000)
  return { day: k.getUTCDay(), hour: k.getUTCHours() + k.getUTCMinutes() / 60 }
}

export type OpenState = { open: boolean; label: string; soon?: boolean }

export function openState(branch: Branch, date = new Date()): OpenState {
  if (branch.hours === 'always') return { open: true, label: 'Открыто круглосуточно' }
  const { day, hour } = kirovNow(date)
  const today = branch.hours[day]
  const fmt = (h: number) => `${Math.floor(h)}:${String(Math.round((h % 1) * 60)).padStart(2, '0')}`
  if (today && hour >= today[0] && hour < today[1]) {
    const left = today[1] - hour
    return { open: true, label: `Открыто до ${fmt(today[1])}`, soon: left <= 1 }
  }
  if (today && hour < today[0]) return { open: false, label: `Откроется в ${fmt(today[0])}` }
  for (let i = 1; i <= 7; i++) {
    const next = branch.hours[(day + i) % 7]
    if (next) return { open: false, label: `Откроется ${i === 1 ? 'завтра' : ''} в ${fmt(next[0])}`.replace('  ', ' ') }
  }
  return { open: false, label: 'Закрыто' }
}

export const rub = (n: number) => `${n.toLocaleString('ru-RU')} ₽`

/** Склонение: plural(5, ['год', 'года', 'лет']) */
export function plural(n: number, forms: [string, string, string]) {
  const a = Math.abs(n) % 100
  const b = a % 10
  if (a > 10 && a < 20) return forms[2]
  if (b > 1 && b < 5) return forms[1]
  if (b === 1) return forms[0]
  return forms[2]
}

export const CURRENT_YEAR = new Date().getFullYear()
export const FOUNDED = 2004
export const yearsSince = (y: number) => CURRENT_YEAR - y

export const scrollToId = (id: string) => {
  const el = document.getElementById(id)
  if (!el) return false
  el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  return true
}
