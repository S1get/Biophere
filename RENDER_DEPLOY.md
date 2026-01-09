# 🚀 Быстрый деплой на Render

## Шаг 1: Создайте PostgreSQL базу данных

1. В Render Dashboard → **New** → **PostgreSQL**
2. Настройки:
   - **Name**: `biosphere-db`
   - **Database**: `biosphere`
   - **User**: `biosphere_user`
   - **Region**: `Frankfurt` (или ближайший)
   - **Plan**: `Free`

3. После создания скопируйте **Internal Database URL**

## Шаг 2: Создайте Backend Service

1. **New** → **Web Service**
2. Подключите GitHub репозиторий
3. Настройки:
   ```
   Name: biosphere-backend
   Environment: Python 3
   Region: Frankfurt
   Branch: main
   Root Directory: (оставьте пустым)
   Build Command: pip install -r backend/requirements.txt
   Start Command: uvicorn main:app --host 0.0.0.0 --port $PORT
   ```
4. **Environment Variables**:
   - `DATABASE_URL` → вставьте Internal Database URL из шага 1
   - `SECRET_KEY` → сгенерируйте: `openssl rand -hex 32`
   - `PYTHON_VERSION` → `3.13.4`
5. **Health Check Path**: `/health`
6. Нажмите **Create Web Service**

## Шаг 3: Создайте Frontend Service

1. **New** → **Web Service**
2. Подключите тот же GitHub репозиторий
3. Настройки:
   ```
   Name: biosphere-frontend
   Environment: Node
   Region: Frankfurt (тот же что backend)
   Branch: main
   Root Directory: biosphere-vet-clinic
   Build Command: npm install && npm run build
   Start Command: npm run start
   ```
4. **Environment Variables**:
   - `VITE_API_URL` → URL вашего backend (например: `https://biosphere-backend.onrender.com`)
   - `PORT` → `10000`
   - `NODE_VERSION` → `20.x`
5. **Health Check Path**: `/`
6. Нажмите **Create Web Service**

## Шаг 4: Настройте базу данных

После деплоя backend:

1. Откройте **Render Shell** для backend сервиса
2. Выполните:
   ```bash
   cd backend
   alembic upgrade head
   python create_admin.py
   ```

Или через SSH:
```bash
# Подключитесь к серверу
cd /opt/render/project/src/backend
alembic upgrade head
python create_admin.py
```

## Шаг 5: Предотвратите засыпание серверов

### Вариант 1: UptimeRobot (рекомендуется, бесплатно)

1. Зарегистрируйтесь на [uptimerobot.com](https://uptimerobot.com)
2. Добавьте 2 монитора:
   - **Backend**: `https://your-backend-url.onrender.com/ping` (каждые 5 минут)
   - **Frontend**: `https://your-frontend-url.onrender.com/` (каждые 5 минут)

### Вариант 2: Cron-job.org (бесплатно)

1. Зайдите на [cron-job.org](https://cron-job.org)
2. Создайте задачу:
   - **URL**: `https://your-backend-url.onrender.com/ping`
   - **Schedule**: каждые 10 минут

### Вариант 3: Render Cron Job

1. В Render → **New** → **Cron Job**
2. Настройки:
   ```
   Schedule: */10 * * * *
   Command: curl https://your-backend-url.onrender.com/ping
   ```

## Шаг 6: Обновите CORS (если нужно)

Если ваш frontend URL отличается, обновите в `backend/main.py`:

```python
allow_origins=[
    "https://your-frontend-url.onrender.com",  # Ваш URL
    "http://localhost:5173",
]
```

## ✅ Проверка

1. Backend: `https://your-backend-url.onrender.com/health` → должен вернуть `{"status": "healthy"}`
2. Frontend: `https://your-frontend-url.onrender.com/` → должен открыться сайт
3. API: `https://your-backend-url.onrender.com/` → должен вернуть `{"message": "biosphere API is running"}`

## 🔑 Вход в админку

- **Email**: `admin@biosphere.ru`
- **Password**: `ADMINBIO`
- **URL**: `https://your-frontend-url.onrender.com/admin/login`

## ⚠️ Важно

- На бесплатном плане первый запрос после засыпания может занять 30-60 секунд
- Используйте UptimeRobot для предотвращения засыпания
- База данных на бесплатном плане ограничена 90 днями

## 🐛 Troubleshooting

**Backend не запускается?**
- Проверьте логи в Render Dashboard
- Убедитесь, что `main.py` в корне импортирует `app` из `backend.main`

**Frontend не подключается к API?**
- Проверьте `VITE_API_URL` в environment variables
- Убедитесь, что CORS настроен правильно

**База данных не работает?**
- Проверьте `DATABASE_URL` в environment variables
- Выполните миграции: `alembic upgrade head`







