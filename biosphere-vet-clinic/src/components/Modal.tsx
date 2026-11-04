import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export function Modal({
  open,
  onOpenChange,
  title,
  description,
  children,
  className,
  hideTitle,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  title: string
  description?: string
  children: ReactNode
  className?: string
  hideTitle?: boolean
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-sm data-[state=open]:animate-fade-in" />
        <Dialog.Content
          className={cn(
            'fixed z-50 flex max-h-[92dvh] w-full flex-col overflow-hidden bg-cream-50 shadow-lift outline-none',
            // мобильные — «шторка» снизу; с планшета — по центру (через inset+margin, без transform,
            // чтобы анимация появления не сбивала позицию)
            'inset-x-0 bottom-0 rounded-t-[28px] sm:inset-0 sm:m-auto sm:h-fit sm:max-w-xl sm:rounded-[28px]',
            'data-[state=open]:animate-scale-in',
            className,
          )}
        >
          <div className={cn('flex items-start justify-between gap-4 px-6 pt-6 sm:px-8 sm:pt-7', hideTitle && 'sr-only')}>
            <div>
              <Dialog.Title className="text-xl font-extrabold sm:text-2xl">{title}</Dialog.Title>
              {description ? (
                <Dialog.Description className="mt-1 text-[15px] text-ink-soft">{description}</Dialog.Description>
              ) : (
                <Dialog.Description className="sr-only">{title}</Dialog.Description>
              )}
            </div>
          </div>
          <Dialog.Close
            className="absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full bg-white/90 text-ink shadow-soft transition hover:bg-white"
            aria-label="Закрыть"
          >
            <X className="h-5 w-5" />
          </Dialog.Close>
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">{children}</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
