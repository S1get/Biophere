import { ArrowRight, Phone, Star } from 'lucide-react'
import { useBooking } from '@/components/booking/BookingContext'
import { useMinuteTick } from '@/components/OpenBadge'
import { EMERGENCY, branches } from '@/data/branches'
import { doctors } from '@/data/doctors'
import { usePricelist, priceFrom } from '@/lib/pricelist'
import { FOUNDED, cn, openState, plural, rub, scrollToId, telHref, yearsSince } from '@/lib/utils'

const faces = ['ulvavilova', 'rgogoleva', 'olzhavoronkov', 'pshustova', 'kbogomolova']

export function Hero() {
  const openBooking = useBooking()
  const now = useMinuteTick()
  const openCount = branches.filter((b) => openState(b, now).open).length
  const { data } = usePricelist()
  const visit = priceFrom(data, { startsWith: 'Первичный приём (общий' })
  const years = yearsSince(FOUNDED)

  return (
    <section className="relative overflow-hidden pb-16 pt-4 sm:pb-24 lg:pt-8">
      {/* мягкие цветные пятна на фоне */}
      <div className="pointer-events-none absolute -left-32 top-10 h-[420px] w-[420px] rounded-full bg-leaf-100/70 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 -top-24 h-[520px] w-[520px] rounded-full bg-teal-100/70 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 h-[300px] w-[300px] rounded-full bg-peach-100/80 blur-3xl" />

      <div className="container relative grid items-center gap-14 lg:grid-cols-[1.05fr_1fr] lg:gap-10">
        <div className="animate-fade-up">
          <button
            onClick={() => scrollToId('branches')}
            className="inline-flex items-center gap-2 rounded-full bg-white/80 py-1.5 pl-2 pr-4 text-[14px] font-semibold shadow-soft ring-1 ring-ink/5 backdrop-blur transition hover:bg-white"
          >
            <span className="relative flex h-6 w-6 items-center justify-center rounded-full bg-leaf-100">
              <span className="absolute h-2.5 w-2.5 animate-ping rounded-full bg-leaf-400 opacity-60" />
              <span className="h-2.5 w-2.5 rounded-full bg-leaf-500" />
            </span>
            Сейчас открыто {openCount} из {branches.length} клиник
            <ArrowRight className="h-4 w-4 text-ink-mute" />
          </button>

          <h1 className="mt-6 text-[44px] font-extrabold leading-[1.02] sm:text-[60px] lg:text-[70px]">
            Окружаем <span className="accent">заботой</span>
            <br className="hidden sm:block" /> ваших питомцев
          </h1>
          <p className="lead mt-6 max-w-xl">
            Сеть ветеринарных клиник в Кирове с {FOUNDED} года: {doctors.length} врачей, {branches.length} филиалов
            и круглосуточная помощь на проспекте Строителей.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button onClick={() => openBooking()} className="btn btn-primary btn-lg">
              Записаться на приём <ArrowRight className="h-5 w-5" />
            </button>
            <a href={telHref(EMERGENCY.phone)} className="btn btn-ghost btn-lg">
              <Phone className="h-5 w-5 text-alert-500" /> Срочно? {EMERGENCY.phone}
            </a>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-5">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-3">
                {faces.map((f) => {
                  const d = doctors.find((x) => x.id === f)
                  return (
                    <img
                      key={f}
                      src={`/photos/staff/${f}.webp`}
                      alt=""
                      style={{ objectPosition: d?.focal ?? '50% 20%' }}
                      className="h-11 w-11 rounded-full object-cover ring-[3px] ring-cream"
                    />
                  )
                })}
              </div>
              <p className="text-[14px] leading-snug text-ink-soft">
                <b className="text-ink">{doctors.length} врачей</b>
                <br />
                терапевты, хирурги, кардиологи
              </p>
            </div>
            <div className="hidden h-10 w-px bg-ink/10 sm:block" />
            <p className="text-[14px] leading-snug text-ink-soft">
              <b className="text-ink">
                {years} {plural(years, ['год', 'года', 'лет'])}
              </b>
              <br />
              рядом с вами
            </p>
            {visit && (
              <>
                <div className="hidden h-10 w-px bg-ink/10 sm:block" />
                <p className="text-[14px] leading-snug text-ink-soft">
                  <b className="text-ink">Приём от {rub(visit)}</b>
                  <br />
                  без записи, в живой очереди
                </p>
              </>
            )}
          </div>
        </div>

        <HeroCollage />
      </div>
    </section>
  )
}

function Photo({ src, className, pos = '50% 25%', delay = 0 }: { src: string; className?: string; pos?: string; delay?: number }) {
  return (
    <div className={cn('absolute overflow-hidden bg-cream-200 shadow-lift animate-fade-up', className)} style={{ animationDelay: `${delay}ms` }}>
      <img src={src} alt="" className="h-full w-full object-cover" style={{ objectPosition: pos }} />
    </div>
  )
}

function HeroCollage() {
  return (
    <div className="relative mx-auto aspect-[1/1.02] w-full max-w-[560px]">
      <Photo src="/photos/staff/ulvavilova.webp" className="left-0 top-[6%] h-[86%] w-[56%] rounded-b-[44px] rounded-t-[999px]" pos="50% 30%" />
      <Photo src="/photos/staff/nbakina.webp" className="right-0 top-0 h-[47%] w-[41%] rounded-[36px]" pos="50% 45%" delay={60} />
      <Photo src="/photos/staff/irpushkareva.webp" className="bottom-[2%] right-[3%] h-[45%] w-[38%] rounded-[36px] rounded-br-[90px]" pos="50% 35%" delay={120} />

      {/* плавающие карточки */}
      <div className="absolute -left-2 bottom-[10%] w-[230px] animate-float rounded-3xl bg-white/95 p-4 shadow-lift ring-1 ring-ink/5 backdrop-blur sm:-left-6">
        <div className="flex items-center gap-2 text-[13px] font-bold uppercase tracking-wider text-alert-600">
          <span className="h-2 w-2 animate-pulse-ring rounded-full bg-alert-500" /> Круглосуточно
        </div>
        <p className="mt-1.5 text-[15px] font-bold leading-snug">Экстренная помощь на Строителей, 9к1</p>
        <a href={telHref(EMERGENCY.phone)} className="mt-1 inline-block text-[15px] font-bold text-teal-600">
          {EMERGENCY.phone}
        </a>
      </div>
      <div
        className="absolute right-[34%] top-[3%] hidden animate-float items-center gap-2 rounded-full bg-white/95 px-4 py-2.5 text-[14px] font-bold shadow-lift ring-1 ring-ink/5 sm:flex"
        style={{ animationDelay: '-3s' }}
      >
        <Star className="h-4 w-4 fill-peach-400 text-peach-400" /> С {FOUNDED} года
      </div>
    </div>
  )
}
