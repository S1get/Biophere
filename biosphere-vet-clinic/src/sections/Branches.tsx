import { useState } from 'react'
import { CalendarHeart, Clock, Navigation, Phone } from 'lucide-react'
import { Reveal } from '@/components/Reveal'
import { OpenBadge } from '@/components/OpenBadge'
import { useBooking } from '@/components/booking/BookingContext'
import { branches } from '@/data/branches'
import type { BranchId } from '@/data/types'
import { cn, telHref } from '@/lib/utils'

function mapSrc(selected: BranchId | null) {
  const pts = branches
    .map((b, i) => `${b.coords[1]},${b.coords[0]},${b.id === selected ? 'pm2rdl' : 'pm2dbm'}${i + 1}`)
    .join('~')
  const sel = branches.find((b) => b.id === selected)
  const center = sel ? `${sel.coords[1]},${sel.coords[0]}` : '49.645,58.578'
  return `https://yandex.ru/map-widget/v1/?ll=${center}&z=${sel ? 15 : 11}&pt=${pts}&lang=ru_RU`
}

export function Branches() {
  const [selected, setSelected] = useState<BranchId | null>(null)
  const openBooking = useBooking()
  return (
    <section id="branches" className="section bg-white">
      <div className="container">
        <Reveal className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <span className="eyebrow">Филиалы</span>
            <h2 className="h2 mt-3">
              Шесть клиник — <span className="accent">по всему Кирову</span>
            </h2>
          </div>
          <p className="lead max-w-md">Выберите ближайшую: покажем на карте, часы работы и как добраться.</p>
        </Reveal>

        <div className="mt-12 grid gap-6 lg:grid-cols-[1fr_1.1fr]">
          <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {branches.map((b, i) => (
              <Reveal as="li" key={b.id} delay={(i % 2) * 60}>
                <div
                  className={cn(
                    'group flex h-full gap-4 rounded-[24px] p-3 pr-4 ring-1 transition',
                    selected === b.id ? 'bg-teal-50 ring-teal-300' : 'bg-cream ring-transparent hover:ring-ink/10',
                  )}
                >
                  <button
                    onClick={() => setSelected(selected === b.id ? null : b.id)}
                    className="relative h-[104px] w-[104px] shrink-0 overflow-hidden rounded-2xl"
                    aria-label={`Показать на карте: ${b.address}`}
                  >
                    <img src={b.photo} alt="" loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                    <span className="absolute left-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-white text-[13px] font-extrabold text-teal-700 shadow-soft">
                      {i + 1}
                    </span>
                  </button>
                  <div className="min-w-0 flex-1">
                    <button onClick={() => setSelected(selected === b.id ? null : b.id)} className="text-left">
                      <h3 className="text-[17px] font-extrabold leading-snug">{b.address}</h3>
                      <p className="text-[13px] text-ink-mute">{b.district}</p>
                    </button>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <OpenBadge branch={b} className="py-0.5 text-[12px]" />
                    </div>
                    <p className="mt-2 flex items-start gap-1.5 text-[13px] text-ink-soft">
                      <Clock className="mt-0.5 h-3.5 w-3.5 shrink-0" /> {b.hoursText.join(' · ')}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-[14px] font-bold">
                      <a href={telHref(b.phone)} className="inline-flex items-center gap-1.5 text-teal-600 hover:text-teal-700">
                        <Phone className="h-4 w-4" /> {b.phone}
                      </a>
                      <a href={b.routeUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-ink-soft hover:text-ink">
                        <Navigation className="h-4 w-4" /> Маршрут
                      </a>
                      <button onClick={() => openBooking({ branch: b.id })} className="inline-flex items-center gap-1.5 text-ink-soft hover:text-ink">
                        <CalendarHeart className="h-4 w-4" /> Записаться
                      </button>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </ol>

          <Reveal className="lg:sticky lg:top-24 lg:self-start">
            <div className="relative overflow-hidden rounded-[28px] bg-cream-200 shadow-soft ring-1 ring-ink/5">
              <iframe
                key={selected ?? 'all'}
                src={mapSrc(selected)}
                title="Филиалы «Биосферы» на карте Кирова"
                className="block h-[420px] w-full sm:h-[520px] lg:h-[640px]"
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
              />
              {selected && (
                <button
                  onClick={() => setSelected(null)}
                  className="absolute left-3 top-3 rounded-full bg-white px-4 py-2 text-[14px] font-bold shadow-lift"
                >
                  ← Все филиалы
                </button>
              )}
            </div>
            {selected && <SelectedInfo id={selected} />}
          </Reveal>
        </div>
      </div>
    </section>
  )
}

function SelectedInfo({ id }: { id: BranchId }) {
  const b = branches.find((x) => x.id === id)!
  return (
    <div className="mt-4 rounded-[24px] bg-cream p-5 animate-fade-in">
      <p className="text-[15px] leading-relaxed text-ink-soft">
        <b className="text-ink">Открыта {b.opened}.</b> {b.about}
      </p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {b.features.map((f) => (
          <span key={f} className="chip bg-white text-ink-soft">
            {f}
          </span>
        ))}
      </div>
    </div>
  )
}
