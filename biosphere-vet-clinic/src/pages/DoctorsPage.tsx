import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { DIRECTIONS, DoctorCard, DoctorDialog, matchesDirection } from '@/components/doctors'
import { administrators, doctors } from '@/data/doctors'
import { branches, branchById } from '@/data/branches'
import type { BranchId, Doctor } from '@/data/types'
import { usePageTitle } from '@/lib/usePageTitle'
import { cn } from '@/lib/utils'

export default function DoctorsPage() {
  usePageTitle('Врачи', 'Врачи сети ветеринарных клиник «Биосфера» в Кирове: терапевты, хирурги, кардиологи, офтальмологи.')
  const [params, setParams] = useSearchParams()
  const dir = params.get('dir') ?? 'all'
  const branch = (params.get('branch') as BranchId | null) ?? null
  const [open, setOpen] = useState<Doctor | null>(null)

  const set = (key: string, value: string | null) => {
    const p = new URLSearchParams(params)
    if (value) p.set(key, value)
    else p.delete(key)
    setParams(p, { replace: true })
  }

  const list = doctors.filter(
    (d) => (dir === 'all' || matchesDirection(d, dir)) && (!branch || (d.branches as string[]).includes(branch)),
  )
  const admins = administrators.filter((a) => !branch || (a.branches as string[]).includes(branch))

  return (
    <div className="pb-24 pt-6 sm:pt-10">
      <div className="container">
        <span className="eyebrow">Команда</span>
        <h1 className="mt-3 text-[40px] font-extrabold leading-[1.05] sm:text-[56px]">
          Наши <span className="accent">врачи</span>
        </h1>
        <p className="lead mt-4 max-w-2xl">Нажмите на карточку — расскажем об образовании врача и о том, где он принимает.</p>

        <div className="mt-8 grid gap-3">
          <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:flex-wrap sm:px-0">
            {[{ id: 'all', label: 'Все направления' }, ...DIRECTIONS].map((d) => (
              <button
                key={d.id}
                onClick={() => set('dir', d.id === 'all' ? null : d.id)}
                className={cn(
                  'shrink-0 rounded-full px-4 py-2.5 text-[14px] font-semibold transition',
                  dir === d.id ? 'bg-ink text-white' : 'bg-white text-ink-soft shadow-soft hover:text-ink',
                )}
              >
                {d.label}
              </button>
            ))}
          </div>
          <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:flex-wrap sm:px-0">
            {[{ id: null, short: 'Все филиалы' }, ...branches].map((b) => (
              <button
                key={b.id ?? 'all'}
                onClick={() => set('branch', b.id)}
                className={cn(
                  'shrink-0 rounded-full border px-4 py-2 text-[14px] font-semibold transition',
                  branch === b.id ? 'border-teal-600 bg-teal-50 text-teal-700' : 'border-ink/10 text-ink-soft hover:text-ink',
                )}
              >
                {b.short}
              </button>
            ))}
          </div>
        </div>

        <p className="mt-6 text-[14px] text-ink-mute">
          {list.length ? `Врачей: ${list.length}` : 'Никого не нашли — попробуйте другой фильтр'}
          {branch && ` · ${branchById[branch].address}`}
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {list.map((d) => (
            <DoctorCard key={d.id} doctor={d} onOpen={() => setOpen(d)} />
          ))}
        </div>

        {dir === 'all' && admins.length > 0 && (
          <>
            <h2 className="mt-20 text-[30px] font-extrabold">Администраторы</h2>
            <p className="mt-2 text-ink-soft">Встретят, запишут и подскажут по телефону.</p>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-6">
              {admins.map((a) => (
                <figure key={a.id} className="overflow-hidden rounded-[24px] bg-white shadow-soft">
                  <div className="aspect-square bg-cream-200">
                    {a.photo && <img src={a.photo} alt={a.name} loading="lazy" className="h-full w-full object-cover" style={{ objectPosition: a.focal ?? '50% 25%' }} />}
                  </div>
                  <figcaption className="p-4">
                    <p className="text-[15px] font-bold leading-snug">{a.name}</p>
                    <p className="mt-1 text-[13px] text-ink-mute">{(a.branches as BranchId[]).map((b) => branchById[b]?.short).join(', ')}</p>
                  </figcaption>
                </figure>
              ))}
            </div>
          </>
        )}
      </div>
      <DoctorDialog doctor={open} onClose={() => setOpen(null)} />
    </div>
  )
}
