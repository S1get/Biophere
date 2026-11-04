import { Children, useRef, useState, type ElementType, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

/**
 * На телефоне — горизонтальная карусель со «снапом» и точками-индикатором,
 * с планшета — обычная раскладка, которую задаёт className (например, sm:grid sm:grid-cols-2).
 * Дочерним элементам нужна ширина для мобильной карусели: `w-[82%] shrink-0 snap-start sm:w-auto`.
 */
export function Rail({
  children,
  className,
  as: Tag = 'div',
  label,
}: {
  children: ReactNode
  className?: string
  as?: ElementType
  label?: string
}) {
  const ref = useRef<HTMLElement>(null)
  const [active, setActive] = useState(0)
  const count = Children.count(children)

  const onScroll = () => {
    const el = ref.current
    if (!el) return
    const max = el.scrollWidth - el.clientWidth
    setActive(max > 0 ? Math.round((el.scrollLeft / max) * (count - 1)) : 0)
  }

  const goTo = (i: number) => {
    const el = ref.current
    const child = el?.children[i] as HTMLElement | undefined
    if (el && child) el.scrollTo({ left: child.offsetLeft - el.offsetLeft - 20, behavior: 'smooth' })
  }

  return (
    <>
      <Tag
        ref={ref}
        onScroll={onScroll}
        aria-label={label}
        className={cn(
          // мобильная карусель
          'no-scrollbar -mx-5 flex snap-x snap-mandatory scroll-px-5 gap-4 overflow-x-auto px-5 pb-4 pt-1',
          // с планшета карусель выключается
          'sm:mx-0 sm:snap-none sm:overflow-visible sm:px-0 sm:pb-0 sm:pt-0',
          className,
        )}
      >
        {children}
      </Tag>
      {count > 1 && (
        <div className="mt-1 flex justify-center gap-1.5 sm:hidden" aria-hidden>
          {Array.from({ length: count }, (_, i) => (
            <button
              key={i}
              tabIndex={-1}
              onClick={() => goTo(i)}
              className={cn('h-2 rounded-full transition-all', i === active ? 'w-6 bg-teal-500' : 'w-2 bg-ink/15')}
            />
          ))}
        </div>
      )}
    </>
  )
}

/** Классы ширины для элемента карусели */
export const railItem = 'w-[82%] shrink-0 snap-start sm:w-auto'
