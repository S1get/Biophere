import { useState, type FormEvent } from 'react'
import { ArrowRight, Check, MessageCircleQuestion, Pill, Plus } from 'lucide-react'
import { Reveal } from '@/components/Reveal'
import { Modal } from '@/components/Modal'
import { useBooking } from '@/components/booking/BookingContext'
import { EMERGENCY, branches } from '@/data/branches'
import { faq } from '@/data/content'
import { telHref } from '@/lib/utils'

export function Pharmacy() {
  return (
    <section className="pb-20 sm:pb-28">
      <div className="container">
        <Reveal className="grid overflow-hidden rounded-[36px] bg-leaf-50 lg:grid-cols-2">
          <div className="relative min-h-[260px]">
            <img
              src="/photos/clinic/dsc6515.webp"
              alt="Ветаптека в холле клиники"
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
          <div className="p-7 sm:p-10 lg:p-14">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-leaf-600 shadow-soft">
              <Pill className="h-6 w-6" />
            </span>
            <h2 className="mt-5 text-[30px] font-extrabold leading-tight sm:text-[38px]">
              Ветаптека и корма — <span className="accent text-leaf-700">в каждом филиале</span>
            </h2>
            <p className="lead mt-4">
              Не нужно искать лекарства по городу: препараты, лечебные корма, ветеринарные диеты и средства ухода можно
              купить сразу после приёма. Администратор подскажет, что назначил врач.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export function Faq() {
  const [ask, setAsk] = useState(false)
  return (
    <section id="faq" className="section">
      <div className="container grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <Reveal>
          <span className="eyebrow">Вопросы</span>
          <h2 className="h2 mt-3">
            Частые <span className="accent">вопросы</span>
          </h2>
          <p className="lead mt-5">Не нашли ответ? Напишите — или позвоните в ближайший филиал.</p>
          <button onClick={() => setAsk(true)} className="btn btn-ghost btn-md mt-7">
            <MessageCircleQuestion className="h-5 w-5" /> Задать вопрос
          </button>
        </Reveal>
        <Reveal className="divide-y divide-ink/10 border-y border-ink/10">
          {faq.map((f) => (
            <details key={f.q} className="group py-1">
              <summary className="flex cursor-pointer items-center justify-between gap-6 py-5 text-[18px] font-bold transition hover:text-teal-700">
                {f.q}
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-cream transition group-open:rotate-45 group-open:bg-teal-600 group-open:text-white">
                  <Plus className="h-5 w-5" />
                </span>
              </summary>
              <p className="pb-6 pr-12 text-[16px] leading-relaxed text-ink-soft">{f.a}</p>
            </details>
          ))}
        </Reveal>
      </div>
      <AskDialog open={ask} onOpenChange={setAsk} />
    </section>
  )
}

function AskDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const [sent, setSent] = useState(false)
  const [name, setName] = useState('')
  const [text, setText] = useState('')
  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (name.trim().length < 2 || text.trim().length < 5) return
    setSent(true) // демо: никуда не отправляется
  }
  return (
    <Modal
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v)
        if (!v) setTimeout(() => setSent(false), 300)
      }}
      title={sent ? 'Вопрос записан' : 'Задать вопрос врачу'}
      description={sent ? undefined : 'Ответим в разделе вопросов или перезвоним.'}
    >
      {sent ? (
        <div className="px-6 pb-8 pt-4 sm:px-8">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-leaf-100 text-leaf-600">
            <Check className="h-7 w-7" />
          </div>
          <div className="mt-5 rounded-2xl bg-peach-100 p-4 text-[15px] leading-relaxed">
            <b>Форма работает в тестовом режиме</b> — вопрос пока не отправляется. Быстрее всего ответят по телефону
            ближайшего филиала.
          </div>
          <a href={telHref(EMERGENCY.phone)} className="btn btn-primary btn-md mt-5 w-full">
            Позвонить {EMERGENCY.phone}
          </a>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-4 px-6 pb-8 pt-4 sm:px-8">
          <div>
            <label className="label" htmlFor="q-name">Ваше имя</label>
            <input id="q-name" className="input" value={name} onChange={(e) => setName(e.target.value.slice(0, 60))} required minLength={2} />
          </div>
          <div>
            <label className="label" htmlFor="q-text">Вопрос</label>
            <textarea
              id="q-text"
              className="input h-32 resize-none py-3"
              value={text}
              onChange={(e) => setText(e.target.value.slice(0, 1000))}
              required
              minLength={5}
              placeholder="Например: нужна ли запись на УЗИ на Украинской?"
            />
          </div>
          <button className="btn btn-primary btn-md w-full">Отправить</button>
        </form>
      )}
    </Modal>
  )
}

export function FinalCta() {
  const openBooking = useBooking()
  return (
    <section className="section">
      <div className="container">
        <Reveal className="relative overflow-hidden rounded-[40px] bg-teal-600 px-7 py-12 text-white shadow-lift sm:px-12 sm:py-16 lg:px-16">
          <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-leaf-400/30 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 left-1/4 h-80 w-80 rounded-full bg-teal-300/30 blur-3xl" />
          <div className="relative grid items-center gap-10 lg:grid-cols-[1.2fr_1fr]">
            <div>
              <h2 className="text-[34px] font-extrabold leading-[1.08] text-white sm:text-[48px]">
                Запишитесь на приём — <span className="font-serif font-medium italic text-leaf-200">мы рядом</span>
              </h2>
              <p className="mt-5 max-w-lg text-[17px] leading-relaxed text-white/85">
                Выберите филиал и удобное время онлайн или позвоните — администратор подберёт врача.
              </p>
              <button onClick={() => openBooking()} className="btn btn-lg mt-8 bg-white text-teal-700 shadow-lift hover:-translate-y-0.5">
                Записаться онлайн <ArrowRight className="h-5 w-5" />
              </button>
            </div>
            <ul className="grid gap-2 sm:grid-cols-2">
              {branches.map((b) => (
                <li key={b.id}>
                  <a
                    href={telHref(b.phone)}
                    className="flex h-full flex-col rounded-2xl bg-white/10 px-4 py-3 ring-1 ring-white/15 transition hover:bg-white/15"
                  >
                    <span className="text-[13px] text-white/70">{b.address}</span>
                    <span className="text-[18px] font-extrabold">{b.phone}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
