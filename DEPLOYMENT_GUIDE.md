# 🚀 Полное руководство по деплою проекта на Render

Это руководство объединяет информацию из `RENDER_STEP_BY_STEP.md`, `DEPLOY_INSTRUCTIONS.md` и `QUICK_START.md` для предоставления полного пошагового процесса развертывания вашего проекта на Render.

## 🎯 Что уже готово в проекте:

- `render.yaml` - конфигурация для автоматического деплоя (Blueprint)
- `/health` endpoint для health checks
- `/ping` endpoint для предотвращения засыпания
- Автоматические миграции при старте (через `alembic`)
- CORS настроен
- Frontend готов к деплою

## ⚡ Варианты деплоя:

Вы можете выбрать один из двух вариантов деплоя:

### Вариант A: Автоматический деплой с использованием `render.yaml` (рекомендуется для быстрого старта)

1.  Зайдите на [render.com](https://render.com) и войдите в аккаунт.
2.  Нажмите **"New +"** → выберите **"Blueprint"**.
3.  Подключите ваш GitHub репозиторий, содержащий `render.yaml`.
4.  Render автоматически создаст все необходимые сервисы (PostgreSQL, Backend, Frontend) согласно конфигурации в `render.yaml`.
5.  Перейдите к **"ШАГ 4: Настройте базу данных"** после завершения автоматического деплоя.

### Вариант B: Ручной пошаговый деплой (рекомендуется для первого раза и полного понимания процесса)

Следуйте инструкциям ниже.

---

## 🗄️ ШАГ 1: Создайте PostgreSQL базу данных

1.  Зайдите на [render.com](https://render.com) и войдите в аккаунт.
2.  Нажмите **"New +"** → выберите **"PostgreSQL"**.
3.  Заполните:
    -   **Name**: `biosphere-db`
    -   **Database**: `biosphere`
    -   **User**: `biosphere_user`
    -   **Region**: `Frankfurt` (или ближайший к вам, важно выбрать тот же регион для всех сервисов)
    -   **PostgreSQL Version**: `Latest`
    -   **Plan**: `Free`
4.  Нажмите **"Create Database"**.
5.  ⚠️ **ВАЖНО**: Дождитесь создания базы (1-2 минуты).
6.  После создания откройте базу и скопируйте **"Internal Database URL"** (он понадобится для backend).

---

## 🔧 ШАГ 2: Создайте Backend (Web Service)

1.  Нажмите **"New +"** → выберите **"Web Service"**.
2.  Подключите ваш GitHub репозиторий:
    -   Нажмите **"Connect account"** если еще не подключен.
    -   Выберите репозиторий с вашим проектом.
    -   Нажмите **"Connect"**.
3.  Заполните настройки:

    **Основные настройки:**
    -   **Name**: `biosphere-backend`
    -   **Environment**: `Python 3`
    -   **Region**: `Frankfurt` (тот же что база данных)
    -   **Branch**: `main`
    -   **Root Directory**: оставьте **ПУСТЫМ** (или укажите `backend` если ваш репозиторий содержит несколько проектов и `backend` находится в поддиректории `backend`)

    **Build & Deploy:**
    -   **Build Command**: `pip install -r backend/requirements.txt`
    -   **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`

    **Health Check:**
    -   **Health Check Path**: `/health`

4.  **Environment Variables** (нажмите "Add Environment Variable"):
    -   `DATABASE_URL` → вставьте **Internal Database URL** из шага 1.
    -   `SECRET_KEY` → сгенерируйте случайную строку (можно использовать: `python -c "import secrets; print(secrets.token_hex(32))"` или `openssl rand -hex 32` в терминале).
    -   `PYTHON_VERSION` → `3.13.4` (или актуальная версия Python, используемая в проекте).

5.  Нажмите **"Create Web Service"**.
6.  ⚠️ Дождитесь завершения деплоя (3-5 минут).
7.  Скопируйте **URL вашего backend** (например: `https://biosphere-backend.onrender.com`). Он понадобится для frontend.

---

## 🎨 ШАГ 3: Создайте Frontend (Web Service)

1.  Нажмите **"New +"** → выберите **"Web Service"**.
2.  Выберите тот же GitHub репозиторий.
3.  Заполните настройки:

    **Основные настройки:**
    -   **Name**: `biosphere-frontend`
    -   **Environment**: `Node`
    -   **Region**: `Frankfurt` (тот же что backend)
    -   **Branch**: `main`
    -   **Root Directory**: `biosphere-vet-clinic` ⚠️ **ВАЖНО!** Укажите путь к директории вашего frontend проекта.

    **Build & Deploy:**
    -   **Build Command**: `npm install && npm run build`
    -   **Start Command**: `npm run start`

    **Health Check:**
    -   **Health Check Path**: `/`

4.  **Environment Variables**:
    -   `VITE_API_URL` → вставьте **URL вашего backend** из шага 2 (например: `https://biosphere-backend.onrender.com`).
    -   `PORT` → `10000` (или другой порт, если требуется).
    -   `NODE_VERSION` → `20.x` (или актуальная версия Node.js, используемая в проекте).

5.  Нажмите **"Create Web Service"**.
6.  ⚠️ Дождитесь завершения деплоя (3-5 минут).

---

## 🗃️ ШАГ 4: Настройте базу данных (после деплоя backend)

После того как backend задеплоился и запустился:

1.  Откройте ваш **Backend Service** в Render Dashboard.
2.  Перейдите на вкладку **"Shell"** (или **"Logs"**).
3.  Нажмите **"Open Shell"** (или используйте SSH).
4.  Выполните команды для применения миграций и создания администратора:

    ```bash
    cd backend
    alembic upgrade head
    python create_admin.py
    ```

    *Примечание: Если вы находитесь в корне проекта, команды могут быть такими:*
    ```bash
    alembic upgrade head
    python backend/create_admin.py
    ```

5.  Проверьте, что админ создан, попробовав зайти на `/health` endpoint.

---

## 🔄 ШАГ 5: Обновите CORS (если нужно)

Если URL вашего frontend отличается от стандартного или вы столкнулись с ошибками CORS:

1.  Откройте `backend/main.py` в вашем локальном репозитории.
2.  Найдите строки с `allow_origins`.
3.  Добавьте ваш frontend URL в список разрешенных источников. Пример:

    ```python
    allow_origins=[
        "https://biosphere-frontend.onrender.com",  # Ваш реальный URL frontend
        "https://biosfera-frontend.onrender.com", # Пример другого URL
        "http://localhost:5173", # Для локальной разработки
    ]
    ```

4.  Закоммитьте и запушьте изменения в ваш GitHub репозиторий. Render автоматически передеплоит ваш backend.

---

## ⏰ ШАГ 6: Настройте Keep-Alive (чтобы серверы не засыпали)

На бесплатном плане Render серверы могут "засыпать" после 15 минут бездействия. Чтобы предотвратить это, настройте внешний мониторинг:

### Вариант 1: UptimeRobot (рекомендуется, бесплатно)

1.  Зайдите на [uptimerobot.com](https://uptimerobot.com).
2.  Зарегистрируйтесь (бесплатно).
3.  Нажмите **"Add New Monitor"**.
4.  Настройте первый монитор для Backend:
    -   **Monitor Type**: `HTTP(s)`
    -   **Friendly Name**: `Biosphere Backend`
    -   **URL**: `https://your-backend-url.onrender.com/ping` (замените на реальный URL вашего backend)
    -   **Monitoring Interval**: `5 minutes`
    -   Нажмите **"Create Monitor"**.
5.  Добавьте второй монитор для Frontend:
    -   **Monitor Type**: `HTTP(s)`
    -   **Friendly Name**: `Biosphere Frontend`
    -   **URL**: `https://your-frontend-url.onrender.com/` (замените на реальный URL вашего frontend)
    -   **Monitoring Interval**: `5 minutes`
    -   Нажмите **"Create Monitor"**.

### Вариант 2: Cron-job.org

1.  Зайдите на [cron-job.org](https://cron-job.org).
2.  Зарегистрируйтесь.
3.  Создайте задачу:
    -   **Title**: `Biosphere Keep-Alive`
    -   **Address**: `https://your-backend-url.onrender.com/ping` (замените на реальный URL вашего backend)
    -   **Schedule**: каждые 10 минут
    -   Нажмите **"Create"**.

### Вариант 3: Render Cron Job (если вы хотите использовать ресурсы Render)

1.  Создайте **Cron Job** на Render.
2.  Настройки:
    -   **Schedule**: `*/10 * * * *` (каждые 10 минут)
    -   **Command**: `curl https://your-backend-url.onrender.com/ping` (замените на реальный URL вашего backend)

---

## ✅ ШАГ 7: Проверка работы

После выполнения всех предыдущих шагов, проверьте работоспособность вашего приложения:

1.  **Backend Health Check**:
    -   Откройте: `https://your-backend-url.onrender.com/health`
    -   Должно вернуть: `{"status": "healthy", "database": "connected"}`

2.  **Backend API**:
    -   Откройте: `https://your-backend-url.onrender.com/`
    -   Должно вернуть: `{"message": "biosphere API is running", "status": "ok"}`

3.  **Frontend**:
    -   Откройте: `https://your-frontend-url.onrender.com/`
    -   Должен открыться ваш сайт.

4.  **Вход в админку**:
    -   URL: `https://your-frontend-url.onrender.com/admin/login`
    -   Email: `admin@biosphere.ru`
    -   Password: `ADMINBIO`

---

## 🎯 Итого: Что у вас должно быть

✅ **3 сервиса на Render:**
1.  PostgreSQL база данных (`biosphere-db`)
2.  Backend Web Service (`biosphere-backend`)
3.  Frontend Web Service (`biosphere-frontend`)

✅ **2 URL:**
-   Backend: `https://biosphere-backend.onrender.com`
-   Frontend: `https://biosphere-frontend.onrender.com`

✅ **Keep-alive настроен** (UptimeRobot или другой сервис)

---

## ⚠️ Важные замечания

-   **Бесплатный план Render**: серверы могут "засыпать" после 15 минут бездействия. Первый запрос после засыпания может занять 30-60 секунд.
-   **База данных**: на бесплатном плане PostgreSQL ограничен 90 днями, после чего данные могут быть удалены.
-   **Переменные окружения**: не забудьте обновить `VITE_API_URL` в frontend после получения URL backend.

---

## 🛠️ Troubleshooting (Устранение неполадок)

### Backend не запускается
-   Проверьте логи в Render Dashboard.
-   Убедитесь, что `main.py` в корне импортирует `app` из `backend.main` (если структура проекта отличается).
-   Проверьте, что все зависимости установлены (`pip install -r backend/requirements.txt`).

### Frontend не подключается к API
-   Проверьте `VITE_API_URL` в environment variables frontend сервиса. Убедитесь, что он указывает на правильный URL вашего backend.
-   Убедитесь, что CORS настроен правильно в `backend/main.py` и включает URL вашего frontend.
-   Проверьте логи frontend и backend на наличие ошибок.

### База данных не работает
-   Проверьте `DATABASE_URL` в environment variables backend сервиса. Убедитесь, что он содержит правильный Internal Database URL из PostgreSQL.
-   Убедитесь, что миграции выполнены: `alembic upgrade head`.
-   Проверьте подключение к базе через Render Shell.