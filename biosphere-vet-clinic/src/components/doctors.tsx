import { useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { CalendarHeart, ChevronDown, Expand, GraduationCap, MapPin, Sparkles, X } from 'lucide-react'
import { Modal } from './Modal'
import { useBooking } from './booking/BookingContext'
import { branchById } from '@/data/branches'
import type { BranchId, Doctor } from '@/data/types'
import { CURRENT_YEAR, cn, plural } from '@/lib/utils'

export const DIRECTIONS = [
  { id: 'therapy', label: 'Терапия', match: /терапи/ },
  { id: 'surgery', label: 'Хирургия', match: /хирург|травматолог|ортопед/ },
  { id: 'us', label: 'УЗИ', match: /узи|визуальная/ },
  { id: 'cardio', label: 'Кардиология', match: /кардиолог/ },
  { id: 'derm', label: 'Дерматология', match: /дерматолог/ },
  { id: 'eye', label: 'Офтальмология', match: /офтальмолог/ },
  { id: 'dent', label: 'Стоматология', match: /стоматолог|ортодонт/ },
  { id: 'onco', label: 'Онкология', match: /онколог/ },
  { id: 'anest', label: 'Анестезиология', match: /анестезиолог|реаниматолог/ },
] as const

export const matchesDirection = (d: Doctor, dir: string) => {
  const rule = DIRECTIONS.find((x) => x.id === dir)
  const text = `${d.specialization ?? ''} ${d.position ?? ''}`.toLowerCase()
  return !rule || rule.match.test(text)
}

export const experience = (d: Doctor) => {
  if (!d.graduated) return null
  const y = CURRENT_YEAR - d.graduated
  return `${y} ${plural(y, ['год', 'года', 'лет'])}`
}

export function DoctorCard({ doctor, onOpen }: { doctor: Doctor; onOpen: () => void }) {
  const exp = experience(doctor)
  return (
    <button
      onClick={onOpen}
      className="group flex h-full w-full flex-col overflow-hidden rounded-[28px] bg-white text-left shadow-soft ring-1 ring-ink/[0.04] transition duration-300 hover:-translate-y-1 hover:shadow-lift"
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-cream-200">
        {doctor.photo && (
          <img
            src={doctor.photo}
            alt={doctor.name}
            loading="lazy"
            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
            style={{ objectPosition: doctor.focal ?? '50% 25%' }}
          />
        )}
        {exp && (
          <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-[12px] font-bold shadow-soft">
            Стаж {exp}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-[12px] font-bold uppercase tracking-[0.1em] text-teal-600">{doctor.position}</p>
        <h3 className="mt-1.5 text-[18px] font-extrabold leading-snug">{doctor.name}</h3>
        {doctor.specialization && (
          <p className="mt-2 line-clamp-2 text-[14px] leading-relaxed text-ink-soft first-letter:uppercase">{doctor.specialization}</p>
        )}
        <p className="mt-auto flex items-start gap-1.5 pt-4 text-[13px] text-ink-mute">
          <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          {(doctor.branches as BranchId[]).length >= 6
            ? 'Все филиалы'
            : (doctor.branches as BranchId[]).map((b) => branchById[b]?.short).join(' · ')}
        </p>
      </div>
    </button>
  )
}

/** «20-22.2.2019 - Конгресс…» → { date: '20-22.2.2019', text: 'Конгресс…' } */
const splitTraining = (t: string) => {
  const m = t.match(/^([\d.\-–\s]+?)\s+[-–]\s+(.+)$/)
  return m ? { date: m[1], text: m[2] } : { date: null, text: t }
}

const TRAINING_PREVIEW = 4

export function DoctorDialog({ doctor, onClose }: { doctor: Doctor | null; onClose: () => void }) {
  return (
    <Modal open={Boolean(doctor)} onOpenChange={(v) => !v && onClose()} title={doctor?.name ?? 'Врач'} hideTitle className="sm:max-w-[860px]">
      {doctor && <DoctorDetails key={doctor.id} doctor={doctor} onClose={onClose} />}
    </Modal>
  )
}

function DoctorDetails({ doctor, onClose }: { doctor: Doctor; onClose: () => void }) {
  const openBooking = useBooking()
  const [allTraining, setAllTraining] = useState(false)
  const [zoom, setZoom] = useState(false)
  const exp = experience(doctor)
  const ids = doctor.branches as BranchId[]
  const training = allTraining ? doctor.training : doctor.training.slice(0, TRAINING_PREVIEW)
  const book = () => {
    onClose()
    openBooking({ doctorId: doctor.id ?? undefined })
  }

  return (
    <div className="grid items-start sm:grid-cols-[300px_1fr]">
      {/* Левая колонка: фото фиксированной пропорции + главное. На десктопе «прилипает», пока справа листается текст */}
      <aside className="sm:sticky sm:top-0">
        <div className="relative aspect-[4/3] overflow-hidden bg-cream-200 sm:aspect-[4/5]">
          {doctor.photo && (
            <button
              type="button"
              onClick={() => setZoom(true)}
              className="group absolute inset-0 cursor-zoom-in"
              aria-label={`Открыть фото: ${doctor.name}`}
            >
              <img
                src={doctor.photo}
                alt={doctor.name}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                style={{ objectPosition: doctor.focal ?? '50% 22%' }}
              />
              <span className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-ink opacity-0 shadow-soft transition group-hover:opacity-100 sm:right-auto sm:left-3">
                <Expand className="h-4 w-4" />
              </span>
            </button>
          )}
          {exp && (
            <span className="absolute bottom-3 left-3 rounded-full bg-white/95 px-3 py-1 text-[13px] font-bold shadow-soft">
              Стаж {exp}
            </span>
          )}
        </div>
        <div className="hidden p-5 sm:block">
          <button className="btn btn-primary btn-md w-full" onClick={book}>
            <CalendarHeart className="h-5 w-5" /> Записаться
          </button>
        </div>
      </aside>
      {doctor.photo && <PhotoLightbox open={zoom} onOpenChange={setZoom} src={fullPhoto(doctor.photo)} alt={doctor.name} />}

      <div className="p-6 sm:p-8">
        <p className="pr-10 text-[12px] font-bold uppercase tracking-[0.1em] text-teal-600">{doctor.position}</p>
        <h3 className="mt-2 pr-10 text-[26px] font-extrabold leading-tight">{doctor.name}</h3>
        {doctor.specialization && (
          <p className="mt-3 text-[16px] leading-relaxed text-ink-soft first-letter:uppercase">{doctor.specialization}</p>
        )}

        <div className="mt-5 flex flex-wrap gap-2">
          {ids.map((b) => (
            <span key={b} className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1.5 text-[13px] font-semibold text-teal-700">
              <MapPin className="h-3.5 w-3.5" />
              {branchById[b]?.address}
            </span>
          ))}
        </div>

        {doctor.education && (
          <div className="mt-6 flex gap-3 rounded-2xl bg-white p-4 shadow-soft ring-1 ring-ink/[0.04]">
            <GraduationCap className="mt-0.5 h-5 w-5 shrink-0 text-leaf-600" />
            <p className="text-[15px] leading-snug">
              {doctor.education}
              {doctor.graduated && <span className="block text-[13px] text-ink-mute">окончание — {doctor.graduated}</span>}
            </p>
          </div>
        )}

        {doctor.training.length > 0 && (
          <div className="mt-7">
            <p className="flex items-center gap-2 font-bold">
              <Sparkles className="h-5 w-5 text-leaf-600" /> Повышение квалификации
              <span className="rounded-full bg-leaf-100 px-2 py-0.5 text-[12px] font-bold text-leaf-700">{doctor.training.length}</span>
            </p>
            <ol className="mt-4 space-y-3 border-l-2 border-leaf-100 pl-5">
              {training.map((t) => {
                const { date, text } = splitTraining(t)
                return (
                  <li key={t} className="relative text-[14px] leading-relaxed text-ink-soft">
                    <span className="absolute -left-[27px] top-[7px] h-2.5 w-2.5 rounded-full border-2 border-cream-50 bg-leaf-400" />
                    {date && <span className="block text-[12px] font-bold text-ink-mute">{date}</span>}
                    {text}
                  </li>
                )
              })}
            </ol>
            {doctor.training.length > TRAINING_PREVIEW && (
              <button
                onClick={() => setAllTraining((v) => !v)}
                className="mt-4 inline-flex items-center gap-1 text-[14px] font-bold text-teal-600 hover:text-teal-700"
              >
                {allTraining ? 'Свернуть' : `Показать все (${doctor.training.length})`}
                <ChevronDown className={cn('h-4 w-4 transition', allTraining && 'rotate-180')} />
              </button>
            )}
          </div>
        )}

        {/* на мобильных кнопка внизу */}
        <button className="btn btn-primary btn-md mt-8 w-full sm:hidden" onClick={book}>
          <CalendarHeart className="h-5 w-5" /> Записаться к врачу
        </button>
      </div>
    </div>
  )
}

/** /photos/staff/x.webp → /photos/staff/full/x.webp (исходный размер для просмотра) */
const fullPhoto = (src: string) => src.replace('/photos/staff/', '/photos/staff/full/')

function PhotoLightbox({ open, onOpenChange, src, alt }: { open: boolean; onOpenChange: (v: boolean) => void; src: string; alt: string }) {
  const [ratio, setRatio] = useState<number | null>(null)
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[60] bg-ink/85 backdrop-blur-sm data-[state=open]:animate-fade-in" />
        <Dialog.Content
          className="fixed inset-0 z-[60] grid place-items-center p-4 outline-none data-[state=open]:animate-scale-in"
          onClick={() => onOpenChange(false)}
        >
          <Dialog.Title className="sr-only">{alt}</Dialog.Title>
          <Dialog.Description className="sr-only">Фото врача крупно. Нажмите в любом месте, чтобы закрыть.</Dialog.Description>
          <img
            src={src}
            alt={alt}
            onLoad={(e) => setRatio(e.currentTarget.naturalWidth / e.currentTarget.naturalHeight || null)}
            // высота — сколько позволяет экран (до 860px), но не шире 94vw с учётом пропорций фото
            style={ratio ? { height: `min(88dvh, 860px, calc(94vw / ${ratio}))`, width: 'auto' } : undefined}
            className="max-h-[88dvh] max-w-[94vw] rounded-[20px] shadow-lift"
          />
          <Dialog.Close
            className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-white/90 text-ink shadow-soft transition hover:bg-white"
            aria-label="Закрыть фото"
          >
            <X className="h-5 w-5" />
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
