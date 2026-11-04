import { useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, ExternalLink, Quote } from 'lucide-react'
import { Reveal } from '@/components/Reveal'
import { branches } from '@/data/branches'
import reviews from '@/data/reviews.json'
import { cn } from '@/lib/utils'

interface Review {
  name: string
  text: string
  date: string
}

const yandexBranches = branches.filter((b) => b.yandexOrgId)
const LONG = 260

function ReviewCard({ r }: { r: Review }) {
  const [full, setFull] = useState(false)
  const long = r.text.length > LONG
  return (
    <figure className="flex h-full flex-col rounded-[28px] bg-white p-6 shadow-soft ring-1 ring-ink/[0.04]">
      <Quote className="h-7 w-7 fill-leaf-100 text-leaf-400" />
      <blockquote className="mb-5 mt-3 text-[15.5px] leading-relaxed text-ink">
        {long && !full ? `${r.text.slice(0, LONG).replace(/\s+\S*$/, '')}…` : r.text}
      </blockquote>
      {long && (
        <button onClick={() => setFull(!full)} className="mt-2 text-[14px] font-bold text-teal-600 hover:text-teal-700">
          {full ? 'Свернуть' : 'Читать полностью'}
        </button>
      )}
      <figcaption className="mt-auto flex items-center gap-3 border-t border-ink/5 pt-4">
        <span className="grid h-10 w-10 place-items-center rounded-full bg-teal-50 font-extrabold text-teal-700">{r.name[0]}</span>
        <span>
          <span className="block font-bold">{r.name}</span>
          <span className="block text-[13px] text-ink-mute">{r.date}</span>
        </span>
      </figcaption>
    </figure>
  )
}

const PAD = 'px-5 scroll-px-5 sm:px-[max(1.5rem,calc((100vw_-_1280px)/2_+_2rem))] sm:scroll-px-[max(1.5rem,calc((100vw_-_1280px)/2_+_2rem))]'

export function Reviews() {
  const all = reviews as Review[]
  const track = useRef<HTMLDivElement>(null)
  const [org, setOrg] = useState(yandexBranches[0]?.yandexOrgId ?? '')
  const [showYandex, setShowYandex] = useState(false)
  const scroll = (dir: 1 | -1) => track.current?.scrollBy({ left: dir * track.current.clientWidth * 0.8, behavior: 'smooth' })

  return (
    <section id="reviews" className="section overflow-hidden">
      <div className="container">
        <Reveal className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <span className="eyebrow">Отзывы</span>
            <h2 className="h2 mt-3">
              Нам доверяют <span className="accent">самое дорогое</span>
            </h2>
            <p className="lead mt-5 max-w-xl">Настоящие слова хозяев наших пациентов — из книги отзывов клиники и с Яндекс Карт.</p>
          </div>
          <div className="hidden shrink-0 gap-2 sm:flex">
            <button onClick={() => scroll(-1)} className="grid h-12 w-12 place-items-center rounded-full bg-white shadow-soft ring-1 ring-ink/5 transition hover:bg-cream-200" aria-label="Предыдущие отзывы">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <button onClick={() => scroll(1)} className="grid h-12 w-12 place-items-center rounded-full bg-white shadow-soft ring-1 ring-ink/5 transition hover:bg-cream-200" aria-label="Следующие отзывы">
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </Reveal>
      </div>

      <div ref={track} className={cn('no-scrollbar mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 pt-1', PAD)}>
        {all.map((r, i) => (
          <div key={i} className="w-[84%] max-w-[380px] shrink-0 snap-start">
            <ReviewCard r={r} />
          </div>
        ))}
      </div>

      <div className="container">
        {!showYandex ? (
          <div className="mt-6 flex flex-col items-center gap-2 text-center">
            <button onClick={() => setShowYandex(true)} className="btn btn-ghost btn-lg">
              Все отзывы на Яндекс Картах <ArrowRight className="h-5 w-5" />
            </button>
            <p className="text-[13px] text-ink-mute">{all.length} отзывов из книги клиники · листайте вбок</p>
          </div>
        ) : (
          <div className="mt-8 overflow-hidden rounded-[32px] bg-white shadow-soft ring-1 ring-ink/[0.04] animate-fade-up">
            <div className="flex flex-col gap-5 p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h3 className="text-[22px] font-extrabold">Свежие отзывы на Яндекс Картах</h3>
                <p className="mt-1 text-[15px] text-ink-soft">Выберите филиал — покажем, что пишут о нём сейчас.</p>
              </div>
              <div className="no-scrollbar -mx-6 flex gap-2 overflow-x-auto px-6 sm:mx-0 sm:px-0">
                {yandexBranches.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => setOrg(b.yandexOrgId!)}
                    className={cn(
                      'shrink-0 rounded-full px-4 py-2 text-[14px] font-semibold transition',
                      org === b.yandexOrgId ? 'bg-ink text-white' : 'bg-cream text-ink-soft hover:text-ink',
                    )}
                  >
                    {b.short}
                  </button>
                ))}
              </div>
            </div>
            <div className="border-t border-ink/5 bg-cream-50 p-3 sm:p-5">
              <iframe
                key={org}
                src={`https://yandex.ru/maps-reviews-widget/${org}?comments`}
                title="Отзывы с Яндекс Карт"
                className="mx-auto block h-[560px] w-full max-w-[760px] rounded-2xl border-0 bg-white"
                loading="lazy"
              />
              <a
                href={`https://yandex.ru/maps/org/${org}/reviews/`}
                target="_blank"
                rel="noopener noreferrer"
                className="mx-auto mt-4 flex w-fit items-center gap-1.5 text-[14px] font-bold text-teal-600"
              >
                Открыть на Яндекс Картах и оставить отзыв <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
