import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Reveal } from '@/components/Reveal'
import { DIRECTIONS, DoctorCard, DoctorDialog, matchesDirection } from '@/components/doctors'
import { doctors } from '@/data/doctors'
import type { Doctor } from '@/data/types'
import { cn } from '@/lib/utils'

const HOME_LIMIT = 8

export function Doctors() {
  const [dir, setDir] = useState('all')
  const [open, setOpen] = useState<Doctor | null>(null)
  const list = doctors.filter((d) => dir === 'all' || matchesDirection(d, dir))

  return (
    <section id="doctors" className="section">
      <div className="container">
        <Reveal className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <span className="eyebrow">Врачи</span>
            <h2 className="h2 mt-3">
              Знакомьтесь — <span className="accent">наша команда</span>
            </h2>
          </div>
          <p className="lead max-w-md">
            Более 50 специалистов, многие из которых работают в «Биосфере» больше десяти лет. Выберите направление — покажем,
            кто вам нужен.
          </p>
        </Reveal>

        <Reveal className="no-scrollbar -mx-5 mt-10 flex gap-2 overflow-x-auto px-5 pb-2 sm:mx-0 sm:flex-wrap sm:px-0">
          {[{ id: 'all', label: 'Все' }, ...DIRECTIONS].map((d) => {
            const count = d.id === 'all' ? doctors.length : doctors.filter((x) => matchesDirection(x, d.id)).length
            return (
              <button
                key={d.id}
                onClick={() => setDir(d.id)}
                aria-pressed={dir === d.id}
                className={cn(
                  'shrink-0 rounded-full px-4 py-2.5 text-[14px] font-semibold transition',
                  dir === d.id ? 'bg-ink text-white' : 'bg-white text-ink-soft shadow-soft ring-1 ring-ink/[0.04] hover:text-ink',
                )}
              >
                {d.label} <span className={cn('ml-1', dir === d.id ? 'text-white/60' : 'text-ink-mute')}>{count}</span>
              </button>
            )
          })}
        </Reveal>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {list.slice(0, HOME_LIMIT).map((d, i) => (
            <Reveal key={d.id} delay={(i % 4) * 70}>
              <DoctorCard doctor={d} onOpen={() => setOpen(d)} />
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-10 text-center">
          <Link to={dir === 'all' ? '/doctors' : `/doctors?dir=${dir}`} className="btn btn-ghost btn-lg">
            {list.length > HOME_LIMIT ? `Все врачи — ещё ${list.length - HOME_LIMIT}` : 'Все врачи и администраторы'}
            <ArrowRight className="h-5 w-5" />
          </Link>
        </Reveal>
      </div>
      <DoctorDialog doctor={open} onClose={() => setOpen(null)} />
    </section>
  )
}
