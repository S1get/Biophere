import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'
import type { BranchId } from '@/data/types'
import { BookingDialog } from './BookingDialog'

export interface BookingPreset {
  branch?: BranchId
  doctorId?: string
  service?: string
}

const Ctx = createContext<(preset?: BookingPreset) => void>(() => {})

export function BookingProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const [preset, setPreset] = useState<BookingPreset>({})
  const [key, setKey] = useState(0)
  const openBooking = useCallback((p: BookingPreset = {}) => {
    setPreset(p)
    setKey((k) => k + 1) // новая запись — новое состояние формы
    setOpen(true)
  }, [])
  return (
    <Ctx.Provider value={openBooking}>
      {children}
      <BookingDialog key={key} open={open} onOpenChange={setOpen} preset={preset} />
    </Ctx.Provider>
  )
}

export const useBooking = () => useContext(Ctx)
