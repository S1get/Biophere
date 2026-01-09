# 📋 Пошаговая инструкция деплоя на Render

## 🗄️ ШАГ 1: Создайте PostgreSQL базу данных

1. Зайдите на [render.com](https://render.com) и войдите в аккаунт
2. Нажмите **"New +"** → выберите **"PostgreSQL"**
3. Заполните:
   - **Name**: `biosphere-db`
   - **Database**: `biosphere`
   - **User**: `biosphere_user`
   - **Region**: `Frankfurt` (или ближайший к вам)
   - **PostgreSQL Version**: `Latest`
   - **Plan**: `Free`
4. Нажмите **"Create Database"**
5. ⚠️ **ВАЖНО**: Дождитесь создания базы (1-2 минуты)
6. После создания откройте базу и скопируйте **"Internal Database URL"** (он понадобится для backend)

---

## 🔧 ШАГ 2: Создайте Backend (Web Service)

1. Нажмите **"New +"** → выберите **"Web Service"**
2. Подключите ваш GitHub репозиторий:
   - Нажмите **"Connect account"** если еще не подключен
   - Выберите репозиторий с вашим проектом
   - Нажмите **"Connect"**
3. Заполните настройки:

   **Основные настройки:**
   - **Name**: `biosphere-backend`
   - **Environment**: `Python 3`
   - **Region**: `Frankfurt` (тот же что база данных)
   - **Branch**: `main`
   - **Root Directory**: оставьте **ПУСТЫМ** (или укажите `backend` если нужно)

   **Build & Deploy:**
   - **Build Command**: `pip install -r backend/requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`

   **Health Check:**
   - **Health Check Path**: `/health`

4. **Environment Variables** (нажмите "Add Environment Variable"):
   - `DATABASE_URL` → вставьте **Internal Database URL** из шага 1
   - `SECRET_KEY` → сгенерируйте случайную строку (можно использовать: `python -c "import secrets; print(secrets.token_hex(32))"`)
   - `PYTHON_VERSION` → `3.13.4`

5. Нажмите **"Create Web Service"**
6. ⚠️ Дождитесь завершения деплоя (3-5 минут)
7. Скопируйте **URL вашего backend** (например: `https://biosphere-backend.onrender.com`)

---

## 🎨 ШАГ 3: Создайте Frontend (Web Service)

1. Нажмите **"New +"** → выберите **"Web Service"**
2. Выберите тот же GitHub репозиторий
3. Заполните настройки:

   **Основные настройки:**
   - **Name**: `biosphere-frontend`
   - **Environment**: `Node`
   - **Region**: `Frankfurt` (тот же что backend)
   - **Branch**: `main`
   - **Root Directory**: `biosphere-vet-clinic` ⚠️ **ВАЖНО!**

   **Build & Deploy:**
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start`

   **Health Check:**
   - **Health Check Path**: `/`

4. **Environment Variables**:
   - `VITE_API_URL` → вставьте **URL вашего backend** из шага 2 (например: `https://biosphere-backend.onrender.com`)
   - `PORT` → `10000`
   - `NODE_VERSION` → `20.x`

5. Нажмите **"Create Web Service"**
6. ⚠️ Дождитесь завершения деплоя (3-5 минут)

---

## 🗃️ ШАГ 4: Настройте базу данных

После того как backend задеплоился:

1. Откройте ваш **Backend Service** в Render Dashboard
2. Перейдите на вкладку **"Shell"** (или **"Logs"**)
3. Нажмите **"Open Shell"** (или используйте SSH)
4. Выполните команды:

```bash
cd backend
alembic upgrade head
python create_admin.py
```

Или если вы в корне проекта:
```bash
alembic upgrade head
python backend/create_admin.py
```

5. Проверьте что админ создан - попробуйте зайти на `/health` endpoint

---

## 🔄 ШАГ 5: Обновите CORS (если нужно)

Если URL вашего frontend отличается от стандартного:

1. Откройте `backend/main.py`
2. Найдите строки с `allow_origins`
3. Добавьте ваш frontend URL:

```python
allow_origins=[
    "https://biosphere-frontend.onrender.com",  # Ваш реальный URL
    "https://biosfera-frontend.onrender.com",
    "http://localhost:5173",
]
```

4. Закоммитьте и запушьте изменения (Render автоматически передеплоит)

---

## ⏰ ШАГ 6: Настройте Keep-Alive (чтобы серверы не засыпали)

### Вариант 1: UptimeRobot (рекомендуется, бесплатно)

1. Зайдите на [uptimerobot.com](https://uptimerobot.com)
2. Зарегистрируйтесь (бесплатно)
3. Нажмите **"Add New Monitor"**
4. Настройте первый монитор:
   - **Monitor Type**: `HTTP(s)`
   - **Friendly Name**: `Biosphere Backend`
   - **URL**: `https://your-backend-url.onrender.com/ping`
   - **Monitoring Interval**: `5 minutes`
   - Нажмите **"Create Monitor"**
5. Добавьте второй монитор для frontend:
   - **Monitor Type**: `HTTP(s)`
   - **Friendly Name**: `Biosphere Frontend`
   - **URL**: `https://your-frontend-url.onrender.com/`
   - **Monitoring Interval**: `5 minutes`
   - Нажмите **"Create Monitor"**

### Вариант 2: Cron-job.org

1. Зайдите на [cron-job.org](https://cron-job.org)
2. Зарегистрируйтесь
3. Создайте задачу:
   - **Title**: `Biosphere Keep-Alive`
   - **Address**: `https://your-backend-url.onrender.com/ping`
   - **Schedule**: каждые 10 минут
   - Нажмите **"Create"**

---

## ✅ ШАГ 7: Проверка работы

1. **Backend Health Check**:
   - Откройте: `https://your-backend-url.onrender.com/health`
   - Должно вернуть: `{"status": "healthy", "database": "connected"}`

2. **Backend API**:
   - Откройте: `https://your-backend-url.onrender.com/`
   - Должно вернуть: `{"message": "biosphere API is running", "status": "ok"}`

3. **Frontend**:
   - Откройте: `https://your-frontend-url.onrender.com/`
   - Должен открыться ваш сайт

4. **Вход в админку**:
   - URL: `https://your-frontend-url.onrender.com/admin/login`
   - Email: `admin@biosphere.ru`
   - Password: `ADMINBIO`

---

## 🎯 Итого: Что у вас должно быть

✅ **3 сервиса на Render:**
1. PostgreSQL база данных (`biosphere-db`)
2. Backend Web Service (`biosphere-backend`)
3. Frontend Web Service (`biosphere-frontend`)

✅ **2 URL:**
- Backend: `https://biosphere-backend.onrender.com`
- Frontend: `https://biosphere-frontend.onrender.com`

✅ **Keep-alive настроен** (UptimeRobot или другой сервис)

---

## ⚠️ Важные замечания

- **Бесплатный план**: серверы могут "засыпать" после 15 минут бездействия
- **Первый запрос** после засыпания может занять 30-60 секунд
- **База данных**: на бесплатном плане ограничена 90 днями
- **Автоматический деплой**: при каждом push в main ветку Render автоматически передеплоит

---

## 🐛 Если что-то не работает

**Backend не запускается?**
- Проверьте **Logs** в Render Dashboard
- Убедитесь что `main.py` в корне импортирует app из `backend.main`
- Проверьте что все environment variables установлены

**Frontend не подключается к API?**
- Проверьте `VITE_API_URL` в environment variables frontend
- Убедитесь что CORS настроен правильно в backend
- Проверьте логи frontend и backend

**База данных не работает?**
- Проверьте `DATABASE_URL` в environment variables backend
- Убедитесь что миграции выполнены: `alembic upgrade head`
- Проверьте логи backend






