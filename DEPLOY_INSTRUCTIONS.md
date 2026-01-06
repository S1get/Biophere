# Инструкция по деплою на Render

## Настройка сервисов на Render

### 1. Backend Service

1. Создайте новый **Web Service** на Render
2. Подключите ваш GitHub репозиторий
3. Настройки:
   - **Name**: `biosphere-backend`
   - **Environment**: `Python 3`
   - **Region**: `Frankfurt` (или ближайший к вам)
   - **Branch**: `main`
   - **Root Directory**: оставьте пустым (или `backend` если нужно)
   - **Build Command**: `pip install -r backend/requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Health Check Path**: `/health`

4. Environment Variables:
   - `DATABASE_URL` - будет автоматически создан при создании PostgreSQL
   - `SECRET_KEY` - сгенерируйте случайную строку (можно использовать: `openssl rand -hex 32`)
   - `PYTHON_VERSION`: `3.13.4`

### 2. PostgreSQL Database

1. Создайте новый **PostgreSQL** на Render
2. Настройки:
   - **Name**: `biosphere-db`
   - **Database**: `biosphere`
   - **User**: `biosphere_user`
   - **Region**: тот же, что и backend

3. После создания, подключите его к Backend Service:
   - В настройках Backend Service добавьте `DATABASE_URL` из PostgreSQL

### 3. Frontend Service

1. Создайте новый **Web Service** на Render
2. Настройки:
   - **Name**: `biosphere-frontend`
   - **Environment**: `Node`
   - **Region**: тот же, что и backend
   - **Branch**: `main`
   - **Root Directory**: `biosphere-vet-clinic`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start`
   - **Health Check Path**: `/`

3. Environment Variables:
   - `VITE_API_URL`: URL вашего backend сервиса (например: `https://biosphere-backend.onrender.com`)
   - `PORT`: `10000`
   - `NODE_VERSION`: `20.x`

### 4. Настройка базы данных

После деплоя backend, выполните миграции:

```bash
# Подключитесь к серверу через SSH или используйте Render Shell
cd backend
alembic upgrade head
```

Или создайте админа:

```bash
python backend/create_admin.py
```

### 5. Предотвращение засыпания серверов

На бесплатном плане Render серверы могут "засыпать" после 15 минут бездействия. Чтобы предотвратить это:

#### Вариант 1: Использовать внешний сервис (рекомендуется)
- Зарегистрируйтесь на [UptimeRobot](https://uptimerobot.com/) (бесплатно)
- Добавьте мониторинг для:
  - Backend: `https://your-backend-url.onrender.com/ping` (каждые 5 минут)
  - Frontend: `https://your-frontend-url.onrender.com/` (каждые 5 минут)

#### Вариант 2: Использовать Render Cron Job
1. Создайте **Cron Job** на Render
2. Настройки:
   - **Schedule**: `*/10 * * * *` (каждые 10 минут)
   - **Command**: `curl https://your-backend-url.onrender.com/ping`

#### Вариант 3: Использовать другой бесплатный сервис
- [Cron-job.org](https://cron-job.org/)
- [EasyCron](https://www.easycron.com/)

### 6. Обновление CORS

Убедитесь, что в `backend/main.py` добавлен URL вашего frontend в CORS:

```python
allow_origins=[
    "https://biosphere-frontend.onrender.com",  # Ваш frontend URL
    "http://localhost:5173",
]
```

### 7. Проверка работы

1. Проверьте backend: `https://your-backend-url.onrender.com/health`
2. Проверьте frontend: `https://your-frontend-url.onrender.com/`
3. Проверьте API: `https://your-backend-url.onrender.com/`

## Важные замечания

- **Бесплатный план Render**: серверы могут засыпать после 15 минут бездействия. Первый запрос после засыпания может занять 30-60 секунд.
- **База данных**: на бесплатном плане PostgreSQL ограничен 90 днями, после чего данные могут быть удалены.
- **Переменные окружения**: не забудьте обновить `VITE_API_URL` в frontend после получения URL backend.

## Troubleshooting

### Backend не запускается
- Проверьте логи в Render Dashboard
- Убедитесь, что `main.py` в корне импортирует app из `backend.main`
- Проверьте, что все зависимости установлены

### Frontend не подключается к API
- Проверьте `VITE_API_URL` в environment variables
- Убедитесь, что CORS настроен правильно
- Проверьте логи frontend и backend

### База данных не работает
- Проверьте `DATABASE_URL` в environment variables
- Убедитесь, что миграции выполнены: `alembic upgrade head`
- Проверьте подключение к базе через Render Shell




