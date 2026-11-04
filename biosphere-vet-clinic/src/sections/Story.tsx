import { Reveal } from '@/components/Reveal'
import { branches } from '@/data/branches'
import { timeline } from '@/data/content'
import { doctors } from '@/data/doctors'
import { usePricelist } from '@/lib/pricelist'
import { FOUNDED, plural, yearsSince } from '@/lib/utils'

export function Story() {
  const { data } = usePricelist()
  const years = yearsSince(FOUNDED)
  const stats = [
    { value: String(years), label: `${plural(years, ['год', 'года', 'лет'])} лечим животных Кирова` },
    { value: String(branches.length), label: 'клиник в разных районах города' },
    { value: String(doctors.length), label: 'врачей разных специальностей' },
    { value: '24/7', label: 'экстренная помощь на Строителей' },
  ]
  return (
    <section className="section relative overflow-hidden bg-white">
      <div className="container">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
          <Reveal>
            <span className="eyebrow">О нас</span>
            <h2 className="h2 mt-3">
              Начинали с трёх врачей. <span className="accent">Выросли в сеть</span>
            </h2>
            <p className="lead mt-6">
              Первая «Биосфера» открылась на Солнечной в {FOUNDED} году. Сегодня это многопрофильная сеть: у нас
              есть и видеоэндоскопия, и сложнейшие ортопедические и нейрохирургические операции, и узкие специалисты —
              кардиологи, офтальмологи, стоматологи, дерматологи.
            </p>
            <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-8">
              {stats.map((s) => (
                <div key={s.label} className="border-l-2 border-leaf-300 pl-4">
                  <dt className="sr-only">{s.label}</dt>
                  <dd className="text-[40px] font-extrabold leading-none tracking-tight text-teal-600 sm:text-[48px]">{s.value}</dd>
                  <dd className="mt-2 text-[14px] leading-snug text-ink-soft">{s.label}</dd>
                </div>
              ))}
            </dl>
            {data && (
              <p className="mt-8 text-[14px] text-ink-mute">
                В прайсе {data.items.length} услуг в {data.sections.length} направлениях.
              </p>
            )}
          </Reveal>

          <ol className="relative grid gap-4 sm:grid-cols-2" aria-label="История открытия клиник">
            {timeline.map((t, i) => (
              <Reveal as="li" key={t.year} delay={(i % 2) * 90} className="group">
                <div className="relative h-full overflow-hidden rounded-[28px] bg-cream shadow-soft">
                  <div className="aspect-[16/10] overflow-hidden">
                    <img src={t.photo} alt="" loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                  </div>
                  <div className="p-5">
                    <span className="inline-block rounded-full bg-teal-600 px-3 py-1 text-[14px] font-extrabold text-white">{t.year}</span>
                    <p className="mt-3 text-[15px] font-medium leading-relaxed text-ink">{t.text}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
