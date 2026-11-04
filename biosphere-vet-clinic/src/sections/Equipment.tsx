import { useRef } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Reveal } from '@/components/Reveal'
import { equipment } from '@/data/content'

export function Equipment() {
  const track = useRef<HTMLDivElement>(null)
  const scroll = (dir: 1 | -1) => track.current?.scrollBy({ left: dir * track.current.clientWidth * 0.8, behavior: 'smooth' })
  return (
    <section className="section overflow-hidden bg-teal-900 text-white">
      <div className="container">
        <Reveal className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <span className="eyebrow text-leaf-300">Оборудование</span>
            <h2 className="h2 mt-3 text-white">
              Видим то, что <span className="font-serif font-medium italic text-leaf-300">скрыто</span>
            </h2>
            <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-white/75">
              Современная диагностика и наркозное оборудование помогают ставить точный диагноз и делать операции безопаснее.
            </p>
          </div>
          <div className="hidden gap-2 sm:flex">
            <button onClick={() => scroll(-1)} className="grid h-12 w-12 place-items-center rounded-full bg-white/10 transition hover:bg-white/20" aria-label="Назад">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <button onClick={() => scroll(1)} className="grid h-12 w-12 place-items-center rounded-full bg-white/10 transition hover:bg-white/20" aria-label="Вперёд">
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </Reveal>
      </div>
      <div
        ref={track}
        className="no-scrollbar mt-12 flex snap-x snap-mandatory scroll-px-5 gap-5 overflow-x-auto scroll-smooth px-5 pb-2 sm:scroll-px-[max(1.5rem,calc((100vw_-_1280px)/2_+_2rem))] sm:px-[max(1.5rem,calc((100vw_-_1280px)/2_+_2rem))]"
      >
        {equipment.map((e) => (
          <article key={e.title} className="w-[78vw] max-w-[340px] shrink-0 snap-start overflow-hidden rounded-[28px] bg-white/[0.06] ring-1 ring-white/10">
            <div className="aspect-[4/3] overflow-hidden bg-white">
              <img src={e.photo} alt={e.title} loading="lazy" className={e.contain ? 'h-full w-full object-contain p-3' : 'h-full w-full object-cover'} />
            </div>
            <div className="p-5">
              <h3 className="text-[18px] font-bold text-white">{e.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-white/70">{e.text}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
