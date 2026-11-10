import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Check, Phone, PhoneCall } from 'lucide-react'
import { Modal } from '@/components/Modal'
import { branches, branchById, EMERGENCY } from '@/data/branches'
import { doctors } from '@/data/doctors'
import type { BranchId } from '@/data/types'
import { cn, telHref } from '@/lib/utils'
import type { BookingPreset } from './BookingContext'

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

/**
 * «Обратный звонок»: имя + телефон (+ филиал и комментарий по желанию).
 * Онлайн-запись по слотам заказчик решил пока не делать — администратор перезванивает и записывает сам.
 */
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
  const [branch, setBranch] = useState<BranchId | ''>(
    preset.branch ?? (presetDoctor?.branches.length === 1 ? (presetDoctor.branches[0] as BranchId) : ''),
  )
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [comment, setComment] = useState(
    presetDoctor ? `Хочу записаться к врачу: ${presetDoctor.name}` : preset.service ? `Интересует: ${preset.service}` : '',
  )
  const [consent, setConsent] = useState(false)
  const [done, setDone] = useState(false)
  const [touched, setTouched] = useState(false)

  const phoneOk = phone.replace(/\D/g, '').length === 11
  const nameOk = name.trim().length >= 2
  const b = branch ? branchById[branch] : null
  const branchOptions = presetDoctor ? branches.filter((x) => (presetDoctor.branches as string[]).includes(x.id)) : branches

  const submit = (e: FormEvent) => {
    e.preventDefault()
    setTouched(true)
    if (!(nameOk && phoneOk && consent)) return
    // Демо-режим: заявка никуда не отправляется (по договорённости — пока заглушка)
    setDone(true)
  }

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={done ? 'Заявка заполнена' : 'Обратный звонок'}
      description={done ? undefined : 'Оставьте номер — администратор перезвонит, ответит на вопросы и запишет на приём.'}
    >
      {done ? (
        <div className="px-6 pb-8 pt-4 sm:px-8">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-leaf-100 text-leaf-600">
            <Check className="h-8 w-8" strokeWidth={2.5} />
          </div>
          <p className="mt-5 text-center text-lg font-bold">{name.trim().split(' ')[0]}, спасибо!</p>
          <div className="mt-5 rounded-2xl bg-peach-100 p-4 text-[15px] leading-relaxed text-ink">
            <b>Обратный звонок работает в тестовом режиме</b> — заявка пока не отправляется в клинику. Чтобы точно
            записаться, позвоните администратору — это займёт минуту.
          </div>
          <a href={telHref((b ?? EMERGENCY).phone)} className="btn btn-primary btn-lg mt-5 w-full">
            <Phone className="h-5 w-5" /> Позвонить: {(b ?? EMERGENCY).phone}
          </a>
          <button className="btn btn-ghost btn-md mt-3 w-full" onClick={() => onOpenChange(false)}>
            Закрыть
          </button>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-4 px-6 pb-7 pt-4 sm:px-8" noValidate>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="cb-name">Ваше имя</label>
              <input
                id="cb-name"
                className={cn('input', touched && !nameOk && 'border-alert-500')}
                value={name}
                onChange={(e) => setName(e.target.value.slice(0, 60))}
                autoComplete="given-name"
                placeholder="Анна"
              />
            </div>
            <div>
              <label className="label" htmlFor="cb-phone">Телефон</label>
              <input
                id="cb-phone"
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
            <label className="label" htmlFor="cb-branch">
              Филиал <span className="font-normal text-ink-mute">(необязательно)</span>
            </label>
            <select id="cb-branch" className="input" value={branch} onChange={(e) => setBranch(e.target.value as BranchId | '')}>
              <option value="">Любой, где удобнее</option>
              {branchOptions.map((x) => (
                <option key={x.id} value={x.id}>
                  {x.address}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="cb-comment">
              Что беспокоит <span className="font-normal text-ink-mute">(необязательно)</span>
            </label>
            <textarea
              id="cb-comment"
              rows={2}
              className="input h-auto resize-none py-3"
              value={comment}
              onChange={(e) => setComment(e.target.value.slice(0, 300))}
              placeholder="Например: нужна прививка коту"
            />
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
          <button type="submit" className="btn btn-primary btn-lg w-full">
            <PhoneCall className="h-5 w-5" /> Перезвоните мне
          </button>
          <a
            href={telHref(EMERGENCY.phone)}
            className="btn btn-md w-full bg-alert-50 text-alert-600 ring-1 ring-alert-100 hover:bg-alert-100"
          >
            <Phone className="h-5 w-5" /> Срочно? Круглосуточно: {EMERGENCY.phone}
          </a>
        </form>
      )}
    </Modal>
  )
}
