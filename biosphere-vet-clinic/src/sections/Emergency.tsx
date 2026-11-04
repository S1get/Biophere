import { Navigation, Phone, Siren } from 'lucide-react'
import { Reveal } from '@/components/Reveal'
import { EMERGENCY } from '@/data/branches'
import { emergencySigns, moreServices } from '@/data/content'
import { telHref } from '@/lib/utils'

export function Ticker() {
  const items = ['Терапия', 'Хирургия', 'УЗИ', 'Рентген', 'Видеоэндоскопия', ...moreServices]
  return (
    <div className="mask-fade-x overflow-hidden border-y border-ink/5 bg-white/50 py-4" aria-hidden="true">
      <div className="flex w-max animate-marquee gap-10 whitespace-nowrap text-[15px] font-semibold text-ink-mute">
        {[...items, ...items].map((s, i) => (
          <span key={i} className="flex items-center gap-10">
            {s} <span className="h-1.5 w-1.5 rounded-full bg-leaf-400" />
          </span>
        ))}
      </div>
    </div>
  )
}

export function Emergency() {
  return (
    <section className="py-16 sm:py-20" aria-labelledby="emergency-title">
      <div className="container">
        <Reveal className="relative overflow-hidden rounded-[36px] bg-gradient-to-br from-alert-500 to-[#E06A3F] text-white shadow-lift">
          <div className="grain pointer-events-none absolute inset-0 opacity-60" />
          <div className="relative grid gap-8 p-7 sm:p-10 lg:grid-cols-[1.3fr_1fr] lg:p-12">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3.5 py-1.5 text-[13px] font-bold uppercase tracking-[0.14em]">
                <Siren className="h-4 w-4" /> Экстренная помощь 24/7
              </span>
              <h2 id="emergency-title" className="mt-5 text-[32px] font-extrabold leading-[1.08] text-white sm:text-[42px]">
                Питомцу плохо прямо сейчас?
              </h2>
              <p className="mt-4 max-w-xl text-[17px] leading-relaxed text-white/90">
                Круглосуточная клиника на {EMERGENCY.address} принимает днём и ночью, без выходных и праздников.
                Позвоните — врач подскажет, что делать по дороге.
              </p>
              <ul className="mt-6 flex flex-wrap gap-2" aria-label="Когда ехать срочно">
                {emergencySigns.map((s) => (
                  <li key={s} className="rounded-full bg-white/15 px-3 py-1.5 text-[14px] font-medium ring-1 ring-white/20">
                    {s}
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a href={telHref(EMERGENCY.phone)} className="btn btn-lg bg-white text-alert-600 shadow-lift hover:-translate-y-0.5">
                  <Phone className="h-5 w-5" /> Позвонить {EMERGENCY.phone}
                </a>
                <a
                  href={EMERGENCY.routeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-lg bg-white/10 text-white ring-1 ring-white/30 hover:bg-white/20"
                >
                  <Navigation className="h-5 w-5" /> Маршрут
                </a>
              </div>
            </div>
            <div className="relative hidden min-h-[300px] lg:block">
              <img
                src={EMERGENCY.photo}
                alt="Круглосуточная клиника на проспекте Строителей"
                className="absolute inset-0 h-full w-full rounded-[28px] object-cover shadow-lift"
                loading="lazy"
              />
              <div className="absolute bottom-4 left-4 rounded-2xl bg-white/95 px-4 py-3 text-ink shadow-lift">
                <p className="text-[13px] font-semibold text-ink-mute">Круглосуточно</p>
                <p className="font-bold">{EMERGENCY.address}</p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
