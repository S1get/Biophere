import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Menu, Phone, X } from 'lucide-react'
import { Logo } from './Logo'
import { useBooking } from './booking/BookingContext'
import { EMERGENCY, branches } from '@/data/branches'
import { cn, scrollToId, telHref } from '@/lib/utils'

export const NAV = [
  { id: 'services', label: 'Услуги' },
  { href: '/doctors', label: 'Врачи' },
  { href: '/prices', label: 'Цены' },
  { id: 'branches', label: 'Филиалы' },
  { id: 'reviews', label: 'Отзывы' },
  { id: 'faq', label: 'Вопросы' },
] as const

export function useNavGo() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  return (item: (typeof NAV)[number]) => {
    if ('href' in item) return navigate(item.href)
    if (pathname === '/' && scrollToId(item.id)) {
      history.replaceState(null, '', `#${item.id}`)
      return
    }
    navigate(`/#${item.id}`)
  }
}

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menu, setMenu] = useState(false)
  const openBooking = useBooking()
  const go = useNavGo()
  const { pathname } = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setMenu(false), [pathname])
  useEffect(() => {
    document.body.style.overflow = menu ? 'hidden' : ''
  }, [menu])

  return (
    <header
      className={cn(
        'sticky top-0 z-40 transition-all duration-300',
        scrolled || menu ? 'bg-cream/85 shadow-[0_1px_0_rgba(29,43,48,.06)] backdrop-blur-xl' : 'bg-transparent',
      )}
    >
      <div className="container flex h-[72px] items-center gap-6">
        <Link to="/" aria-label="Биосфера — на главную" onClick={() => pathname === '/' && window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <Logo />
        </Link>

        <nav className="ml-4 hidden items-center gap-1 lg:flex" aria-label="Основное меню">
          {NAV.map((item) => (
            <button
              key={item.label}
              onClick={() => go(item)}
              className={cn(
                'rounded-full px-3.5 py-2 text-[15px] font-semibold text-ink-soft transition hover:bg-ink/5 hover:text-ink',
                'href' in item && pathname === item.href && 'bg-ink/5 text-ink',
              )}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <a
            href={telHref(EMERGENCY.phone)}
            className="hidden items-center gap-2.5 rounded-full py-1.5 pl-1.5 pr-4 transition hover:bg-ink/5 md:flex lg:hidden xl:flex"
          >
            <span className="relative grid h-9 w-9 place-items-center rounded-full bg-alert-50 text-alert-500">
              <span className="absolute inset-0 animate-pulse-ring rounded-full" />
              <Phone className="h-4 w-4" />
            </span>
            <span className="leading-tight">
              <span className="block text-[15px] font-bold">{EMERGENCY.phone}</span>
              <span className="block text-[12px] font-medium text-ink-mute">круглосуточно</span>
            </span>
          </a>
          <button onClick={() => openBooking()} className="btn btn-primary btn-sm hidden sm:inline-flex sm:h-11 sm:px-5">
            Записаться
          </button>
          <button
            className="grid h-11 w-11 place-items-center rounded-full bg-white/80 shadow-soft lg:hidden"
            onClick={() => setMenu((v) => !v)}
            aria-expanded={menu}
            aria-label={menu ? 'Закрыть меню' : 'Открыть меню'}
          >
            {menu ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Мобильное меню */}
      {menu && (
        <div className="fixed inset-x-0 bottom-0 top-[72px] z-40 overflow-y-auto bg-cream px-5 pb-28 pt-4 animate-fade-in lg:hidden">
          <nav className="grid gap-1" aria-label="Мобильное меню">
            {NAV.map((item) => (
              <button
                key={item.label}
                onClick={() => {
                  setMenu(false)
                  setTimeout(() => go(item), 50)
                }}
                className="rounded-2xl px-4 py-3.5 text-left text-[22px] font-bold transition active:bg-ink/5"
              >
                {item.label}
              </button>
            ))}
          </nav>
          <div className="mt-6 grid gap-2">
            <p className="px-4 text-[13px] font-semibold uppercase tracking-[0.14em] text-ink-mute">Телефоны филиалов</p>
            {branches.map((b) => (
              <a key={b.id} href={telHref(b.phone)} className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 shadow-soft">
                <span className="text-[15px] font-semibold">{b.address}</span>
                <span className="font-bold text-teal-600">{b.phone}</span>
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}
