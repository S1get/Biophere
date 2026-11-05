import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { Reveal } from '@/components/Reveal'
import { Rail, railItem } from '@/components/Rail'
import { moreServices, services } from '@/data/content'
import { priceFrom, usePricelist } from '@/lib/pricelist'
import { rub } from '@/lib/utils'

export function Services() {
  const { data } = usePricelist()
  return (
    <section id="services" className="section">
      <div className="container">
        <Reveal className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <span className="eyebrow">Услуги</span>
            <h2 className="h2 mt-3">
              Всё для здоровья питомца — <span className="accent">в одной сети</span>
            </h2>
          </div>
          <div className="max-w-md">
            <p className="lead">
              От планового осмотра до сложнейших операций. Цены — из актуального прайса клиники
              {data ? `: ${data.items.filter((i) => !i.goods).length} услуг` : ''}.
            </p>
            <Link to="/prices" className="mt-4 inline-flex items-center gap-2 font-bold text-teal-600 hover:gap-3 hover:text-teal-700">
              Смотреть все цены <ArrowRight className="h-5 w-5 transition-all" />
            </Link>
          </div>
        </Reveal>

        <Rail className="mt-10 sm:mt-12 sm:grid sm:grid-cols-2 sm:gap-5 lg:grid-cols-4" label="Услуги">
          {services.map((s, i) => {
            const price = priceFrom(data, s.price)
            return (
              <Reveal key={s.id} delay={(i % 4) * 70} className={railItem}>
                <Link
                  to={`/prices${s.section ? `?section=${s.section}` : ''}`}
                  className="group flex h-full flex-col overflow-hidden rounded-[28px] bg-white shadow-soft ring-1 ring-ink/[0.04] transition duration-300 hover:-translate-y-1 hover:shadow-lift"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-cream-200">
                    <img
                      src={s.photo}
                      alt=""
                      loading="lazy"
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                      style={{ objectPosition: s.focal ?? '50% 40%' }}
                    />
                    {price !== null && (
                      <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-[13px] font-bold shadow-soft">
                        от {rub(price)}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="text-[19px] font-extrabold leading-snug">{s.title}</h3>
                    <p className="mt-2 flex-1 text-[15px] leading-relaxed text-ink-soft">{s.text}</p>
                    <span className="mt-4 inline-flex items-center gap-1 text-[14px] font-bold text-teal-600">
                      Цены <ArrowUpRight className="h-4 w-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            )
          })}
        </Rail>

        <Reveal className="no-scrollbar -mx-5 mt-6 flex items-center gap-2 overflow-x-auto px-5 pb-2 sm:mx-0 sm:mt-8 sm:flex-wrap sm:px-0">
          <span className="mr-2 shrink-0 text-[15px] font-semibold text-ink-soft">А ещё:</span>
          {moreServices.map((s) => (
            <span key={s} className="chip shrink-0 bg-white px-4 py-2 text-[14px] text-ink shadow-soft ring-1 ring-ink/[0.04]">
              {s}
            </span>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
