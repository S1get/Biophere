import { cn } from '@/lib/utils'

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <circle cx="50" cy="50" r="48" fill="#C6EBB0" />
      <path fill="#fff" d="M34 0h32v100H34zM0 34h100v32H0z" />
      <g fill="#1E879C">
        <rect x="37" y="5" width="26" height="26" rx="5" />
        <rect x="5" y="37" width="26" height="26" rx="5" />
        <rect x="37" y="37" width="26" height="26" rx="5" />
        <rect x="69" y="37" width="26" height="26" rx="5" />
        <rect x="37" y="69" width="26" height="26" rx="5" />
      </g>
    </svg>
  )
}

export function Logo({ className, light }: { className?: string; light?: boolean }) {
  return (
    <span className={cn('flex items-center gap-2.5', className)}>
      <LogoMark className="h-9 w-9 shrink-0" />
      <span className="flex flex-col leading-none">
        <span className={cn('text-[19px] font-extrabold tracking-[0.06em]', light ? 'text-white' : 'text-teal-600')}>
          БИОСФЕРА
        </span>
        <span className={cn('mt-1 text-[11px] font-medium tracking-wide', light ? 'text-white/70' : 'text-ink-mute')}>
          ветеринарная клиника
        </span>
      </span>
    </span>
  )
}
