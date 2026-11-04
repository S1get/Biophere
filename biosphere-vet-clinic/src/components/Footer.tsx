import { Link } from 'react-router-dom'
import { Logo } from './Logo'
import { NAV, useNavGo } from './Header'
import { branches } from '@/data/branches'
import { CURRENT_YEAR, FOUNDED, telHref } from '@/lib/utils'

export function Footer() {
  const go = useNavGo()
  return (
    <footer className="relative overflow-hidden bg-teal-900 pb-28 pt-16 text-white/80 md:pb-12">
      <div className="pointer-events-none absolute -right-40 -top-40 h-[480px] w-[480px] rounded-full bg-teal-700/40 blur-3xl" />
      <div className="container relative">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_2fr]">
          <div>
            <Logo light />
            <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-white/70">
              Сеть ветеринарных клиник в Кирове. Окружаем заботой с {FOUNDED} года.
            </p>
            <a
              href="https://vk.com/biosre"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/15"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
                <path d="M12.8 17.3c-5.5 0-8.6-3.8-8.7-10h2.7c.1 4.6 2.1 6.5 3.7 6.9V7.3h2.6v3.9c1.6-.2 3.2-2 3.8-3.9h2.6a7.6 7.6 0 0 1-3.5 5c1.3.6 3 2.2 3.7 5H17c-.6-1.9-2.1-3.3-4.1-3.5v3.5h-.1Z" />
              </svg>
              Мы ВКонтакте
            </a>
            <div className="mt-8 rounded-2xl bg-white/5 p-4 text-[14px] leading-relaxed ring-1 ring-white/10">
              <b className="text-white">Ищем в команду</b> ассистента ветеринарного врача.
              <br />
              Справки по телефону{' '}
              <a href={telHref('38-39-40')} className="font-semibold text-white underline-offset-2 hover:underline">
                38-39-40
              </a>
            </div>
          </div>

          <div className="grid gap-10 sm:grid-cols-[2fr_1fr]">
            <div>
              <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-white/50">Филиалы</p>
              <ul className="mt-4 grid gap-x-8 gap-y-4 sm:grid-cols-2">
                {branches.map((b) => (
                  <li key={b.id} className="text-[14px] leading-snug">
                    <span className="block font-semibold text-white">{b.address}</span>
                    <span className="block text-white/60">{b.hoursText.join(', ')}</span>
                    <a href={telHref(b.phone)} className="mt-0.5 inline-block font-bold text-leaf-300 hover:text-leaf-200">
                      {b.phone}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-white/50">Разделы</p>
              <ul className="mt-4 grid gap-2.5 text-[15px]">
                {NAV.map((n) => (
                  <li key={n.label}>
                    <button onClick={() => go(n)} className="transition hover:text-white">
                      {n.label}
                    </button>
                  </li>
                ))}
                <li>
                  <Link to="/doctors" className="transition hover:text-white">
                    Все врачи
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-white/10 pt-6 text-[13px] text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {FOUNDED}–{CURRENT_YEAR} Сеть ветеринарных клиник «Биосфера», г. Киров
          </p>
          <div className="flex gap-5">
            <Link to="/privacy" className="hover:text-white">
              Политика конфиденциальности
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
