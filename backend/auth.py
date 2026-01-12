from fastapi import APIRouter, Depends, HTTPException, status, Response
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
from typing import Optional
from database import SessionLocal
from models import User
import schemas
import os

SECRET_KEY = os.getenv('SECRET_KEY', 'supersecret')
ALGORITHM = 'HS256'
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 дней

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/token")

router = APIRouter(prefix="/auth", tags=["auth"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

@router.post('/register', response_model=schemas.UserRead)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    raise HTTPException(status_code=403, detail="Регистрация отключена. Используйте гостевые формы для вопросов и отзывов.")

@router.post('/admin/register', response_model=schemas.UserRead)
def register_admin(user: schemas.UserCreate, db: Session = Depends(get_db)):
    if get_user_by_email(db, user.email):
        raise HTTPException(status_code=400, detail="Email уже зарегистрирован")
    
    # Проверяем специальный email для создания админа
    if user.email != 'admin@biosphere.ru':
        raise HTTPException(status_code=403, detail="Доступ запрещен")
    
    db_user = User(
        name=user.name,
        email=user.email,
        phone=user.phone,
        password_hash=get_password_hash(user.password),
        is_admin=True  # Только для специального эндпоинта
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@router.post('/token')
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db), response: Response = None):
    raise HTTPException(status_code=403, detail="Обычный вход отключен. Доступ только для администратора.")

@router.post('/admin/token')
def admin_login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db), response: Response = None):
    user = get_user_by_email(db, form_data.username)
    admin_email = os.getenv("ADMIN_EMAIL", "admin@biosphere.ru")
    if not user or user.email != admin_email or not verify_password(form_data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Неверный email или пароль")
    
    if not user.is_admin:
        raise HTTPException(status_code=403, detail="Доступ только для администратора")
    
    access_token = create_access_token(data={"sub": str(user.id)})
    if response is not None:
        response.set_cookie(
            key="access_token",
            value=access_token,
            httponly=True,
            secure=True,
            samesite="none",
            max_age=ACCESS_TOKEN_EXPIRE_MINUTES * 60
        )
    return {"access_token": access_token, "token_type": "bearer"}

from fastapi import Request
from fastapi.security.utils import get_authorization_scheme_param

def get_current_user(request: Request, db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    token: Optional[str] = None
    # Пытаемся получить токен из заголовка Authorization
    auth_header = request.headers.get("Authorization")
    if auth_header:
        scheme, param = get_authorization_scheme_param(auth_header)
        if scheme and scheme.lower() == "bearer" and param:
            token = param

    # Фоллбек: пробуем получить токен из куки (для cross-site входа)
    if not token:
        token = request.cookies.get("access_token")

    if not token:
        raise credentials_exception

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = db.query(User).filter(User.id == int(user_id)).first()
    if user is None:
        raise credentials_exception
    return user
