import { useEffect, useState } from 'react'
import type { Branch } from '@/data/types'
import { cn, openState } from '@/lib/utils'

/** Перерисовывает компонент раз в минуту — чтобы статус «открыто» был актуальным */
export function useMinuteTick() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60_000)
    return () => clearInterval(t)
  }, [])
  return now
}

export function OpenBadge({ branch, className }: { branch: Branch; className?: string }) {
  const now = useMinuteTick()
  const s = openState(branch, now)
  return (
    <span
      className={cn(
        'chip',
        s.open ? (s.soon ? 'bg-peach-100 text-peach-500' : 'bg-leaf-50 text-leaf-700') : 'bg-ink/5 text-ink-mute',
        className,
      )}
    >
      <span className={cn('h-2 w-2 rounded-full', s.open ? (s.soon ? 'bg-peach-400' : 'bg-leaf-500') : 'bg-ink/30')} />
      {s.label}
    </span>
  )
}
