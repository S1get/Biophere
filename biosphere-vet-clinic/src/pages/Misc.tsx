import { Link } from 'react-router-dom'
import { usePageTitle } from '@/lib/usePageTitle'
import { EMERGENCY } from '@/data/branches'
import { telHref } from '@/lib/utils'

export function NotFound() {
  usePageTitle('Страница не найдена')
  return (
    <div className="container grid min-h-[60vh] place-items-center py-20 text-center">
      <div>
        <p className="font-serif text-[120px] italic leading-none text-teal-200">404</p>
        <h1 className="mt-2 text-3xl font-extrabold">Такой страницы нет</h1>
        <p className="lead mt-3">Возможно, ссылка устарела. Начните с главной.</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link to="/" className="btn btn-primary btn-md">
            На главную
          </Link>
          <a href={telHref(EMERGENCY.phone)} className="btn btn-ghost btn-md">
            Позвонить {EMERGENCY.phone}
          </a>
        </div>
      </div>
    </div>
  )
}

export function Privacy() {
  usePageTitle('Политика конфиденциальности')
  return (
    <div className="container max-w-3xl pb-24 pt-8">
      <h1 className="text-[36px] font-extrabold leading-tight sm:text-[44px]">Политика конфиденциальности</h1>
      <div className="mt-8 space-y-5 text-[16px] leading-relaxed text-ink-soft [&_h2]:mt-10 [&_h2]:text-[22px] [&_h2]:font-extrabold [&_h2]:text-ink">
        <p className="rounded-2xl bg-peach-100 p-4 text-ink">
          Черновик. Перед запуском обратного звонка текст нужно согласовать с клиникой: указать юридическое лицо, ИНН и
          адрес оператора персональных данных.
        </p>
        <h2>Какие данные мы получаем</h2>
        <p>
          Когда вы оставляете заявку на обратный звонок или задаёте вопрос, вы сообщаете имя, номер телефона, сведения о питомце и
          комментарий. Других персональных данных сайт не собирает.
        </p>
        <h2>Зачем</h2>
        <p>Только чтобы связаться с вами, записать на приём и ответить на вопрос. Мы не передаём данные третьим лицам и не используем их для рекламы.</p>
        <h2>Статистика посещений</h2>
        <p>
          Сайт считает число просмотров страниц без cookies и без сохранения IP-адресов — чтобы понимать, какие разделы
          полезны посетителям.
        </p>
        <h2>Как отозвать согласие</h2>
        <p>
          Позвоните в любой филиал или в круглосуточную клинику по номеру{' '}
          <a href={telHref(EMERGENCY.phone)} className="font-semibold text-teal-600">
            {EMERGENCY.phone}
          </a>{' '}
          — мы удалим ваши данные.
        </p>
      </div>
    </div>
  )
}
