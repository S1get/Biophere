# Инструкция по загрузке специалистов в базу данных

## Проблема

В файле `backend/seed_specialists.py` есть синтаксические ошибки - отсутствуют запятые в словарях Python.

## Решение

### Вариант 1: Автоматическое исправление (рекомендуется)

1. Запустите скрипт для исправления:
```bash
cd backend
python fix_seed_syntax.py
```

2. Проверьте что файл исправлен:
```bash
python -m py_compile seed_specialists.py
```

3. Если ошибок нет, загрузите специалистов:
```bash
python seed_specialists.py
```

### Вариант 2: Ручное исправление

В файле `backend/seed_specialists.py` нужно добавить запятые после каждого значения в словарях, кроме последнего.

**Было:**
```python
{
    "name": "Имя"
    "position": "Должность"
    "photo": "photo.jpg"
}
```

**Должно быть:**
```python
{
    "name": "Имя",
    "position": "Должность",
    "photo": "photo.jpg"
},
```

### Вариант 3: После деплоя на Render

После деплоя backend на Render, специалисты будут загружены автоматически при первом запуске (если база пустая).

Или вручную через Render Shell:
```bash
cd backend
python seed_specialists.py
```

## Проверка

После загрузки проверьте:
```bash
# Локально
curl http://localhost:8000/specialists

# На Render
curl https://your-backend-url.onrender.com/specialists
```

Должен вернуться список всех специалистов.



