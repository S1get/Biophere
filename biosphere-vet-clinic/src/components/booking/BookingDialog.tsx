import { useMemo, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Cat, Check, Dog, PawPrint, Phone, Rabbit } from 'lucide-react'
import { Modal } from '@/components/Modal'
import { OpenBadge } from '@/components/OpenBadge'
import { branches, branchById } from '@/data/branches'
import { doctors } from '@/data/doctors'
import { services } from '@/data/content'
import type { BranchId } from '@/data/types'
import { cn, kirovNow, telHref } from '@/lib/utils'
import type { BookingPreset } from './BookingContext'

const STEPS = ['Филиал', 'Услуга', 'Время', 'Контакты'] as const
const WEEKDAYS = ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб']
const MONTHS = ['янв', 'фев', 'мар', 'апр', 'мая', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек']

interface Day {
  key: string
  weekday: number
  label: string
  date: string
  isToday: boolean
}

function nextDays(count = 14): Day[] {
  const base = new Date(Date.now() + 3 * 3600_000) // «сейчас» по Кирову
  return Array.from({ length: count }, (_, i) => {
    const d = new Date(Date.UTC(base.getUTCFullYear(), base.getUTCMonth(), base.getUTCDate() + i))
    return {
      key: d.toISOString().slice(0, 10),
      weekday: d.getUTCDay(),
      label: i === 0 ? 'Сегодня' : i === 1 ? 'Завтра' : WEEKDAYS[d.getUTCDay()],
      date: `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]}`,
      isToday: i === 0,
    }
  })
}

function slotsFor(branchId: BranchId, day: Day): string[] {
  const b = branchById[branchId]
  // Для круглосуточной клиники плановые визиты — с 8 до 22
  const hours = b.hours === 'always' ? ([8, 22] as const) : b.hours[day.weekday]
  if (!hours) return []
  const now = kirovNow()
  const out: string[] = []
  for (let t = hours[0]; t <= hours[1] - 1; t += 0.5) {
    if (day.isToday && t < now.hour + 1) continue
    out.push(`${Math.floor(t)}:${t % 1 ? '30' : '00'}`)
  }
  return out
}

/** Маска +7 (XXX) XXX-XX-XX. Понимает ввод «8900…», «+7900…», «900…» и вставку целого номера. */
export function formatPhone(raw: string) {
  let d = raw.replace(/\D/g, '')
  if (raw.trim().startsWith('+7')) d = d.slice(1) // уже есть префикс маски
  else if (d.length >= 11 && /^[78]/.test(d)) d = d.slice(1)
  // набрали «8…» или «7…» после +7 — когда цифр стало 11, лишняя первая отбрасывается
  if (d.length > 10 && /^[78]/.test(d)) d = d.slice(1)
  const p = d.slice(0, 10)
  let out = '+7'
  if (p.length) out += ` (${p.slice(0, 3)}`
  if (p.length >= 3) out += ')'
  if (p.length > 3) out += ` ${p.slice(3, 6)}`
  if (p.length > 6) out += `-${p.slice(6, 8)}`
  if (p.length > 8) out += `-${p.slice(8, 10)}`
  return out
}

const PETS = [
  { id: 'cat', label: 'Кошка', icon: Cat },
  { id: 'dog', label: 'Собака', icon: Dog },
  { id: 'small', label: 'Грызун, кролик', icon: Rabbit },
  { id: 'other', label: 'Другое', icon: PawPrint },
]

export function BookingDialog({
  open,
  onOpenChange,
  preset,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  preset: BookingPreset
}) {
  const presetDoctor = doctors.find((d) => d.id === preset.doctorId)
  const [step, setStep] = useState(preset.branch ? 1 : 0)
  const [branch, setBranch] = useState<BranchId | null>(
    preset.branch ?? (presetDoctor?.branches.length === 1 ? (presetDoctor.branches[0] as BranchId) : null),
  )
  const [service, setService] = useState(preset.service ?? (presetDoctor ? 'Приём у врача' : ''))
  const [doctorId, setDoctorId] = useState(preset.doctorId ?? '')
  const days = useMemo(() => nextDays(), [])
  const [dayKey, setDayKey] = useState(days[0].key)
  const [time, setTime] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [pet, setPet] = useState('cat')
  const [petName, setPetName] = useState('')
  const [comment, setComment] = useState('')
  const [consent, setConsent] = useState(false)
  const [done, setDone] = useState(false)
  const [touched, setTouched] = useState(false)

  const day = days.find((d) => d.key === dayKey) ?? days[0]
  const slots = branch ? slotsFor(branch, day) : []
  const branchDoctors = doctors.filter((d) => !branch || (d.branches as string[]).includes(branch))
  const phoneOk = phone.replace(/\D/g, '').length === 11
  const nameOk = name.trim().length >= 2

  const canNext = [Boolean(branch), Boolean(service), Boolean(time), nameOk && phoneOk && consent][step]

  const submit = (e: FormEvent) => {
    e.preventDefault()
    setTouched(true)
    if (!canNext) return
    // Демо-режим: заявка никуда не отправляется (по договорённости — пока заглушка)
    setDone(true)
  }

  const b = branch ? branchById[branch] : null

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={done ? 'Заявка заполнена' : 'Запись на приём'}
      description={done ? undefined : `Шаг ${step + 1} из 4 · ${STEPS[step]}`}
    >
      {done ? (
        <div className="px-6 pb-8 pt-4 sm:px-8">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-leaf-100 text-leaf-600">
            <Check className="h-8 w-8" strokeWidth={2.5} />
          </div>
          <p className="mt-5 text-center text-lg font-bold">
            {name.split(' ')[0]}, спасибо! {b?.short && `Филиал: ${b.short}`}, {day.label.toLowerCase()} {day.date} в {time}
          </p>
          <div className="mt-5 rounded-2xl bg-peach-100 p-4 text-[15px] leading-relaxed text-ink">
            <b>Онлайн-запись работает в тестовом режиме</b> — заявка пока не отправляется в клинику. Чтобы точно
            записаться, позвоните администратору — это займёт минуту.
          </div>
          {b && (
            <a href={telHref(b.phone)} className="btn btn-primary btn-lg mt-5 w-full">
              <Phone className="h-5 w-5" /> Позвонить: {b.phone}
            </a>
          )}
          <button className="btn btn-ghost btn-md mt-3 w-full" onClick={() => onOpenChange(false)}>
            Закрыть
          </button>
        </div>
      ) : (
        <form onSubmit={submit} className="flex min-h-full flex-col">
          {/* Прогресс */}
          <div className="flex gap-1.5 px-6 pt-4 sm:px-8">
            {STEPS.map((s, i) => (
              <div key={s} className={cn('h-1.5 flex-1 rounded-full transition', i <= step ? 'bg-teal-500' : 'bg-ink/10')} />
            ))}
          </div>

          <div className="flex-1 px-6 py-5 sm:px-8">
            {step === 0 && (
              <div className="grid gap-2.5">
                {branches.map((br) => (
                  <button
                    type="button"
                    key={br.id}
                    onClick={() => {
                      setBranch(br.id)
                      setTime('')
                      if (doctorId && !doctors.find((d) => d.id === doctorId)?.branches.includes(br.id)) setDoctorId('')
                    }}
                    className={cn(
                      'flex items-center gap-3 rounded-2xl border bg-white p-3 text-left transition',
                      branch === br.id ? 'border-teal-500 ring-4 ring-teal-500/15' : 'border-ink/10 hover:border-ink/25',
                    )}
                  >
                    <img src={br.photo} alt="" className="h-14 w-14 shrink-0 rounded-xl object-cover" />
                    <span className="min-w-0 flex-1">
                      <span className="block font-bold">{br.address}</span>
                      <span className="mt-1 block">
                        <OpenBadge branch={br} className="px-2 py-0.5 text-[12px]" />
                      </span>
                    </span>
                    {branch === br.id && <Check className="h-5 w-5 shrink-0 text-teal-600" />}
                  </button>
                ))}
              </div>
            )}

            {step === 1 && (
              <div className="space-y-5">
                <div>
                  <span className="label">Что нужно питомцу?</span>
                  <div className="flex flex-wrap gap-2">
                    {['Приём у врача', ...services.slice(1).map((s) => s.title), 'Другое'].map((s) => (
                      <button
                        type="button"
                        key={s}
                        onClick={() => setService(s)}
                        className={cn(
                          'rounded-full border px-4 py-2 text-[14px] font-medium transition',
                          service === s ? 'border-teal-600 bg-teal-600 text-white' : 'border-ink/10 bg-white hover:border-ink/25',
                        )}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="label" htmlFor="bk-doctor">
                    Врач <span className="font-normal text-ink-mute">(необязательно)</span>
                  </label>
                  <select id="bk-doctor" className="input" value={doctorId} onChange={(e) => setDoctorId(e.target.value)}>
                    <option value="">Любой свободный врач</option>
                    {branchDoctors.map((d) => (
                      <option key={d.id} value={d.id ?? ''}>
                        {d.name} — {d.position?.toLowerCase()}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {step === 2 && b && (
              <div className="space-y-5">
                <div>
                  <span className="label">День</span>
                  <div className="no-scrollbar -mx-6 flex gap-2 overflow-x-auto px-6 pb-1 sm:-mx-8 sm:px-8">
                    {days.map((d) => (
                      <button
                        type="button"
                        key={d.key}
                        onClick={() => {
                          setDayKey(d.key)
                          setTime('')
                        }}
                        className={cn(
                          'flex w-[74px] shrink-0 flex-col items-center rounded-2xl border py-2.5 transition',
                          dayKey === d.key ? 'border-teal-600 bg-teal-600 text-white' : 'border-ink/10 bg-white hover:border-ink/25',
                        )}
                      >
                        <span className={cn('text-[12px] font-semibold', dayKey === d.key ? 'text-white/80' : 'text-ink-mute')}>
                          {d.label}
                        </span>
                        <span className="text-[15px] font-bold">{d.date}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="label">Удобное время</span>
                  {slots.length ? (
                    <div className="grid grid-cols-4 gap-2 sm:grid-cols-5">
                      {slots.map((s) => (
                        <button
                          type="button"
                          key={s}
                          onClick={() => setTime(s)}
                          className={cn(
                            'h-11 rounded-xl border text-[15px] font-semibold transition',
                            time === s ? 'border-teal-600 bg-teal-600 text-white' : 'border-ink/10 bg-white hover:border-ink/25',
                          )}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="rounded-2xl bg-white p-4 text-[15px] text-ink-soft">
                      {b.id === 'stl'
                        ? 'Плановая запись на сегодня закрыта — выберите другой день. Если помощь нужна сейчас, приезжайте: клиника работает круглосуточно, телефон 44-37-97.'
                        : 'На сегодня записаться уже не получится — выберите другой день. Если нужна срочная помощь — круглосуточная клиника на Строителей, 44-37-97.'}
                    </p>
                  )}
                  <p className="mt-3 text-[13px] text-ink-mute">Администратор перезвонит и подтвердит время.</p>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="label" htmlFor="bk-name">Ваше имя</label>
                    <input
                      id="bk-name"
                      className={cn('input', touched && !nameOk && 'border-alert-500')}
                      value={name}
                      onChange={(e) => setName(e.target.value.slice(0, 60))}
                      autoComplete="given-name"
                      placeholder="Анна"
                    />
                  </div>
                  <div>
                    <label className="label" htmlFor="bk-phone">Телефон</label>
                    <input
                      id="bk-phone"
                      className={cn('input', touched && !phoneOk && 'border-alert-500')}
                      value={phone}
                      onChange={(e) => setPhone(formatPhone(e.target.value))}
                      onFocus={() => !phone && setPhone('+7')}
                      inputMode="tel"
                      autoComplete="tel"
                      placeholder="+7 (900) 000-00-00"
                    />
                  </div>
                </div>
                <div>
                  <span className="label">Питомец</span>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {PETS.map(({ id, label, icon: Icon }) => (
                      <button
                        type="button"
                        key={id}
                        onClick={() => setPet(id)}
                        className={cn(
                          'flex flex-col items-center gap-1 rounded-2xl border py-3 text-[13px] font-semibold transition',
                          pet === id ? 'border-teal-600 bg-teal-50 text-teal-700' : 'border-ink/10 bg-white hover:border-ink/25',
                        )}
                      >
                        <Icon className="h-6 w-6" />
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="label" htmlFor="bk-pet">Кличка</label>
                    <input id="bk-pet" className="input" value={petName} onChange={(e) => setPetName(e.target.value.slice(0, 40))} placeholder="Мурзик" />
                  </div>
                  <div>
                    <label className="label" htmlFor="bk-comment">Что беспокоит</label>
                    <input id="bk-comment" className="input" value={comment} onChange={(e) => setComment(e.target.value.slice(0, 300))} placeholder="Коротко, если хотите" />
                  </div>
                </div>
                <label className="flex cursor-pointer items-start gap-3 text-[14px] leading-snug text-ink-soft">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="mt-0.5 h-5 w-5 shrink-0 accent-teal-600"
                  />
                  <span className={cn(touched && !consent && 'text-alert-600')}>
                    Согласен(на) на обработку персональных данных по{' '}
                    <Link to="/privacy" target="_blank" className="font-semibold text-teal-600 underline-offset-2 hover:underline">
                      политике конфиденциальности
                    </Link>
                  </span>
                </label>
              </div>
            )}
          </div>

          {/* Итог + кнопки */}
          <div className="sticky bottom-0 border-t border-ink/5 bg-cream-50/95 px-6 py-4 backdrop-blur sm:px-8">
            {b && step > 0 && (
              <p className="mb-3 truncate text-[13px] text-ink-mute">
                {b.address}
                {service && ` · ${service}`}
                {time && ` · ${day.label.toLowerCase()} ${day.date}, ${time}`}
              </p>
            )}
            <div className="flex gap-3">
              {step > 0 && (
                <button type="button" className="btn btn-ghost btn-md w-14 px-0" onClick={() => setStep(step - 1)} aria-label="Назад">
                  <ArrowLeft className="h-5 w-5" />
                </button>
              )}
              {step < 3 ? (
                <button type="button" className="btn btn-primary btn-md flex-1" disabled={!canNext} onClick={() => setStep(step + 1)}>
                  Дальше <ArrowRight className="h-5 w-5" />
                </button>
              ) : (
                <button type="submit" className="btn btn-primary btn-md flex-1">
                  Записаться
                </button>
              )}
            </div>
          </div>
        </form>
      )}
    </Modal>
  )
}
