import { MapPin, Phone, PhoneCall } from 'lucide-react'
import { useBooking } from './booking/BookingContext'
import { useNavGo } from './Header'
import { EMERGENCY } from '@/data/branches'
import { telHref } from '@/lib/utils'

/** Нижняя панель на телефонах: позвонить / обратный звонок / филиалы */
export function MobileBar() {
  const openBooking = useBooking()
  const go = useNavGo()
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-ink/5 bg-cream/90 px-3 pb-[max(env(safe-area-inset-bottom),10px)] pt-2.5 backdrop-blur-xl md:hidden">
      <div className="grid grid-cols-[1fr_1.4fr_1fr] gap-2">
        <a href={telHref(EMERGENCY.phone)} className="flex flex-col items-center justify-center gap-0.5 rounded-2xl bg-alert-50 px-1 py-1.5 text-center text-[12px] leading-tight font-bold text-alert-600 ring-1 ring-alert-100 active:bg-alert-100">
          <Phone className="h-5 w-5" />
          Позвонить 24/7
        </a>
        <button onClick={() => openBooking()} className="btn btn-primary h-12 gap-1.5 px-2 text-[14px]">
          <PhoneCall className="h-[18px] w-[18px] shrink-0" /> Обратный звонок
        </button>
        <button onClick={() => go({ id: 'branches', label: 'Филиалы' })} className="flex flex-col items-center gap-0.5 rounded-2xl py-1.5 text-[12px] font-semibold text-ink-soft active:bg-ink/5">
          <MapPin className="h-5 w-5" />
          Филиалы
        </button>
      </div>
    </div>
  )
}
