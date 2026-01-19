from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from auth import get_db, get_current_user
import schemas
from models import Booking, User
from datetime import datetime, timedelta

router = APIRouter(prefix="/bookings", tags=["bookings"])

@router.post("/guest", response_model=schemas.BookingRead)
def create_booking(booking: schemas.BookingCreate, db: Session = Depends(get_db)):
    recent_limit_window = datetime.utcnow() - timedelta(minutes=5)
    recent_count = db.query(Booking).filter(
        Booking.email == str(booking.email),
        Booking.created_at >= recent_limit_window
    ).count()
    if recent_count > 0:
        raise HTTPException(status_code=status.HTTP_429_TOO_MANY_REQUESTS, detail="Слишком частые записи. Попробуйте позже.")
    db_booking = Booking(
        branch=booking.branch,
        service=booking.service,
        doctor=booking.doctor,
        date=booking.date,
        time=booking.time,
        full_name=booking.full_name,
        phone=booking.phone,
        email=str(booking.email),
        comments=booking.comments,
    )
    db.add(db_booking)
    db.commit()
    db.refresh(db_booking)
    return db_booking

@router.get("/admin", response_model=list[schemas.BookingRead])
def list_bookings_admin(request: Request, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if not current_user.is_admin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Недостаточно прав")
    items = db.query(Booking).order_by(Booking.created_at.desc()).all()
    return items

@router.delete("/{booking_id}")
def delete_booking(booking_id: int, request: Request, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if not current_user.is_admin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Недостаточно прав")
    b = db.query(Booking).filter(Booking.id == booking_id).first()
    if not b:
        raise HTTPException(status_code=404, detail="Запись не найдена")
    db.delete(b)
    db.commit()
    return {"status": "ok"}
