# Биосфера — сайт сети ветеринарных клиник (Киров)

Лендинг с функциями: запись на приём (пока демо — заявки никуда не отправляются), живой прайс
из системы клиники, врачи с фильтрами, филиалы на карте со статусом «открыто сейчас», отзывы,
вопросы-ответы и закрытая страница мониторинга `/admin`.

Код — в папке [`biosphere-vet-clinic`](biosphere-vet-clinic).

## Стек

- **Фронтенд:** Vite + React 18 + TypeScript + Tailwind, шрифты Manrope и Lora (свои, без Google Fonts).
- **Сервер:** Node + Express (`server/server.mjs`) — раздаёт собранный сайт и API:
  - `GET /api/health` — проверка живости (её же пингует «антисон»);
  - `GET /api/pricelist` — прайс с `p.bios.re`, кэш 6 часов, при сбое — сохранённая копия `server/data/pricelist.snapshot.json`;
  - `POST /api/track` — анонимный счётчик просмотров (без IP и cookies);
  - `/api/admin/*` — вход по паролю и статистика для `/admin`.
- **Безопасность:** helmet с CSP, HSTS, rate limit, подписанная HttpOnly-cookie для админки,
  проверка Origin, `noindex` пока не включён `INDEXING=on`.

## Локальный запуск

```bash
cd biosphere-vet-clinic
npm install
npm run build
ADMIN_PASSWORD=придумайте-пароль npm start   # http://localhost:3001
```

Для разработки с горячей перезагрузкой: `npm run dev:server` и `npm run dev` в соседнем терминале
(Vite проксирует `/api` на порт 3001).

Обновить сохранённую копию прайса: `npm run prices:update`.

## Переменные окружения

| Переменная | Зачем |
|---|---|
| `ADMIN_PASSWORD` | пароль для `/admin`, не короче 10 символов; без него вход выключен |
| `SESSION_SECRET` | ключ подписи cookie админки (на Render генерируется сам) |
| `INDEXING=on` | разрешить индексацию (сейчас сайт закрыт от поисковиков) |
| `KEEPALIVE=off` / `KEEPALIVE_MIN` | выключить антисон / задать интервал в минутах |
| `RENDER_EXTERNAL_URL` | задаёт Render; по нему сервер пингует сам себя, чтобы не засыпать |

## Деплой на Render

Один web-сервис по [`render.yaml`](render.yaml): build `npm install && npm run build`,
start `npm start`, health check `/api/health`. На бесплатном тарифе сервис засыпает через 15 минут
без запросов — встроенный антисон пингует его каждые 10 минут.

## Что поправить в данных

- Врачи и администраторы — `src/data/doctors.ts`, фото — `public/photos/staff/{id}.webp`.
- Филиалы, телефоны, часы работы — `src/data/branches.ts`.
- Услуги, оборудование, FAQ, история — `src/data/content.ts`.
- Отзывы — `src/data/reviews.json`.
