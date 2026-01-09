# ⚡ Быстрый старт деплоя на Render

## Что уже готово:

✅ `render.yaml` - конфигурация для автоматического деплоя  
✅ `/health` endpoint для health checks  
✅ `/ping` endpoint для предотвращения засыпания  
✅ Автоматические миграции при старте  
✅ CORS настроен  
✅ Frontend готов к деплою  

## 🎯 Что нужно сделать:

### 1. Задеплойте через Render Dashboard

**Вариант A: Используя render.yaml (автоматически)**
1. В Render Dashboard → **New** → **Blueprint**
2. Подключите GitHub репозиторий
3. Render автоматически создаст все сервисы из `render.yaml`

**Вариант B: Вручную (рекомендуется для первого раза)**
Следуйте инструкции в `RENDER_DEPLOY.md`

### 2. После деплоя backend:

```bash
# Через Render Shell или SSH
cd backend
alembic upgrade head
python create_admin.py
```

### 3. Настройте keep-alive:

Используйте [UptimeRobot](https://uptimerobot.com) (бесплатно):
- Добавьте мониторинг для `/ping` endpoint каждые 5 минут

## 📝 Чеклист:

- [ ] PostgreSQL создан
- [ ] Backend задеплоен и работает (`/health` возвращает OK)
- [ ] Frontend задеплоен и работает
- [ ] Миграции выполнены (`alembic upgrade head`)
- [ ] Админ создан (`python create_admin.py`)
- [ ] Keep-alive настроен (UptimeRobot)
- [ ] CORS обновлен с правильным frontend URL
- [ ] `VITE_API_URL` в frontend указывает на backend URL

## 🔗 Полезные ссылки:

- Полная инструкция: `RENDER_DEPLOY.md`
- Детальная инструкция: `DEPLOY_INSTRUCTIONS.md`







