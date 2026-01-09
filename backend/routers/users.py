from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from models import User
from auth import get_current_user, get_db
import schemas

router = APIRouter(prefix="/users", tags=["users"])

@router.get('/me', response_model=schemas.UserRead)
def get_me(current_user=Depends(get_current_user)):
    return current_user

@router.get('/', response_model=list[schemas.UserRead])
def get_users(db: Session = Depends(get_db)):
    return db.query(User).all()
