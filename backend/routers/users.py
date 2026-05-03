from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from models import User
from auth import get_current_user, get_db
import schemas

router = APIRouter(prefix="/users", tags=["users"])

@router.get('/me', response_model=schemas.UserRead)
def get_me(current_user=Depends(get_current_user)):
    return current_user

@router.get('/', response_model=list[schemas.UserRead])
def get_users(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if not current_user.is_admin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Требуются права администратора")
    return db.query(User).order_by(User.id.desc()).all()
