import sys
import os
import re
from datetime import datetime
from pathlib import Path
import shutil
import uuid

# Добавляем текущую директорию в PYTHONPATH для корректной работы импортов
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from fastapi import FastAPI, Depends, HTTPException, status, UploadFile, File, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.exceptions import RequestValidationError

from database import Base, engine, SessionLocal
from auth import router as auth_router, get_current_user
from routers.users import router as users_router
from routers.reviews import router as reviews_router
from routers.questions import router as questions_router
from routers.specialists import router as specialists_router
from routers.bookings import router as bookings_router
from routers.pricelist import router as pricelist_router
from models import User, Review, Question, Specialist, Booking
import schemas
from create_admin import create_admin
from sqlalchemy import inspect, text

app = FastAPI()

# Добавляем обработчики ошибок для гарантии CORS заголовков
@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    response = JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail},
    )
    origin = request.headers.get("origin")
    if origin:
        if origin in allowed_origins or re.match(r"^https?://.*\.onrender\.com$", origin):
             response.headers["Access-Control-Allow-Origin"] = origin
             response.headers["Access-Control-Allow-Credentials"] = "true"
    return response

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    response = JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"detail": exc.errors()},
    )
    origin = request.headers.get("origin")
    if origin:
        if origin in allowed_origins or re.match(r"^https?://.*\.onrender\.com$", origin):
             response.headers["Access-Control-Allow-Origin"] = origin
             response.headers["Access-Control-Allow-Credentials"] = "true"
    return response

# Создаем папку для загрузок если ее нет
UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

# Монтируем статику для доступа к загруженным файлам
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# CORS: разрешаем локальную разработку и продакшн
frontend_origin = os.getenv("FRONTEND_ORIGIN")
allowed_origins = [
    "https://biosphere-frontend.onrender.com",
    "https://biosfera-frontend.onrender.com",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://1y0ld6yrx4.space.minimax.io",
    "https://biosphere-kirov.ru",
    "http://biosphere-kirov.ru",
    "https://biosfera-kirov.ru",
    "http://biosfera-kirov.ru",
]
if frontend_origin:
    allowed_origins.append(frontend_origin)
    
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_origin_regex=r"^https?://.*\.onrender\.com$|^https?://(?:.+\.)?biosfer[ea]-kirov\.ru$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(users_router)
app.include_router(reviews_router)
app.include_router(questions_router)
app.include_router(specialists_router)
app.include_router(bookings_router)
app.include_router(pricelist_router)

@app.post("/upload")
async def upload_file(file: UploadFile = File(...), current_user: User = Depends(get_current_user)):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Недостаточно прав")

    allowed_types = {"image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp"}
    content_type = (file.content_type or "").lower()
    if content_type not in allowed_types:
        raise HTTPException(status_code=400, detail="Разрешены только изображения (jpg, png, webp)")

    max_bytes = int(os.getenv("UPLOAD_MAX_BYTES", str(5 * 1024 * 1024)))  # 5MB default
    ext = allowed_types[content_type]
    file_name = f"{uuid.uuid4().hex}{ext}"
    file_path = UPLOAD_DIR / file_name

    written = 0
    with file_path.open("wb") as buffer:
        while True:
            chunk = await file.read(1024 * 1024)  # 1MB
            if not chunk:
                break
            written += len(chunk)
            if written > max_bytes:
                try:
                    file_path.unlink(missing_ok=True)
                except Exception:
                    pass
                raise HTTPException(status_code=413, detail="Файл слишком большой")
            buffer.write(chunk)

    return {"url": f"/uploads/{file_name}"}

@app.on_event("startup")
def on_startup():
    print("=== BIOSPHERE API STARTED ===")
    print({"allowed_origins": allowed_origins})
    
    from database import DATABASE_URL
    if DATABASE_URL.startswith('sqlite'):
        try:
            Base.metadata.create_all(bind=engine)
            print("Database tables created/verified")
        except Exception as e:
            print(f"Warning: Could not create tables: {e}")
    else:
        try:
            from alembic.config import Config
            from alembic import command
            alembic_ini_path = os.path.join(os.path.dirname(__file__), "alembic.ini")
            if os.path.exists(alembic_ini_path):
                alembic_cfg = Config(alembic_ini_path)
                command.upgrade(alembic_cfg, "head")
                print("Database migrations completed")
        except Exception as e:
            print(f"Warning: Could not run migrations automatically: {e}")

        try:
            Base.metadata.create_all(bind=engine)
            print("Database tables verified/created (fallback)")
        except Exception as e:
            print(f"Warning: Fallback table creation failed: {e}")

    try:
        insp = inspect(engine)
        with engine.begin() as conn:
            q_cols = {c['name'] for c in insp.get_columns('questions')}
            r_cols = {c['name'] for c in insp.get_columns('reviews')}

            def add_col(table: str, col_def: str):
                try:
                    conn.execute(text(f"ALTER TABLE {table} ADD COLUMN {col_def}"))
                except Exception:
                    pass

            if 'guest_name' not in q_cols: add_col('questions', 'guest_name TEXT')
            if 'guest_phone' not in q_cols: add_col('questions', 'guest_phone TEXT')
            if 'ip_address' not in q_cols: add_col('questions', 'ip_address TEXT')
            if 'admin_reply' not in q_cols: add_col('questions', 'admin_reply TEXT')
            if 'is_read' not in q_cols: add_col('questions', 'is_read BOOLEAN DEFAULT FALSE')
            if 'published' not in q_cols: add_col('questions', 'published BOOLEAN DEFAULT TRUE')

            if 'guest_name' not in r_cols: add_col('reviews', 'guest_name TEXT')
            if 'guest_phone' not in r_cols: add_col('reviews', 'guest_phone TEXT')
            if 'ip_address' not in r_cols: add_col('reviews', 'ip_address TEXT')
            if 'admin_reply' not in r_cols: add_col('reviews', 'admin_reply TEXT')
            if 'published' not in r_cols: add_col('reviews', 'published BOOLEAN DEFAULT TRUE')

            # Убеждаемся в существовании таблицы bookings
            if not insp.has_table('bookings'):
                Booking.__table__.create(engine)
                print("Table 'bookings' created")
    except Exception as e:
        print(f"Warning: Column ensure failed: {e}")
    
    try:
        db = SessionLocal()
        try:
            specialist_count = db.query(Specialist).count()
            if specialist_count == 0:
                from seed_specialists import seed_specialists
                seed_specialists()
        finally:
            db.close()
    except Exception as e:
        print(f"Warning: Could not seed specialists: {e}")

    try:
        create_admin()
    except Exception:
        pass

@app.get("/")
def root():
    return {"message": "biosphere API is running", "status": "ok"}

@app.get("/health")
def health_check():
    try:
        db = SessionLocal()
        db.execute(text("SELECT 1"))
        db.close()
        return {"status": "healthy", "database": "connected"}
    except Exception as e:
        return JSONResponse(status_code=503, content={"status": "unhealthy", "error": str(e)})

@app.get("/ping")
def ping():
    return {"status": "ok", "timestamp": datetime.utcnow().isoformat()}

@app.post("/admin/clear_all")
def clear_all(current_user: User = Depends(get_current_user)):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Недостаточно прав")
    db = SessionLocal()
    db.query(Review).delete()
    db.query(Question).delete()
    db.query(User).delete()
    db.query(Specialist).delete()
    db.commit()
    db.close()
    return {"status": "ok"}
