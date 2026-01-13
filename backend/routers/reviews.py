from fastapi import APIRouter, Depends, HTTPException, status, Body, Request
from sqlalchemy.orm import Session
from sqlalchemy import or_
from database import SessionLocal
from auth import get_current_user, get_db
import schemas
from models import Review, User
from datetime import datetime, timedelta

router = APIRouter(prefix="/reviews", tags=["reviews"])

@router.post("/", response_model=schemas.ReviewRead)
def create_review(review: schemas.ReviewCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    db_review = Review(user_id=current_user.id, rating=review.rating, text=review.text)
    db.add(db_review)
    db.commit()
    db.refresh(db_review)
    return db_review

@router.get("/", response_model=list[schemas.PublicReviewRead])
def get_reviews(db: Session = Depends(get_db)):
    try:
        reviews = db.query(Review).all()
        for r in reviews:
            if r.user_id:
                r.user
        return reviews
    except Exception:
        raise HTTPException(status_code=500, detail="Internal Server Error")

@router.get("/admin", response_model=list[schemas.ReviewRead])
def get_reviews_admin(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    try:
        if not current_user.is_admin:
            raise HTTPException(status_code=403, detail="Требуются права администратора")
        reviews = db.query(Review).order_by(Review.created_at.desc()).all()
        for r in reviews:
            if r.user_id:
                r.user
        return reviews
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=500, detail="Internal Server Error")

@router.put("/{review_id}", response_model=schemas.ReviewRead)
def update_review(review_id: int, review: schemas.ReviewUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    db_review = db.query(Review).filter(Review.id == review_id).first()
    if not db_review:
        raise HTTPException(status_code=404, detail="Отзыв не найден")
    if db_review.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Нет доступа к изменению этого отзыва")
    if review.rating is not None:
        db_review.rating = review.rating
    if review.text is not None:
        db_review.text = review.text
    db.commit()
    db.refresh(db_review)
    return db_review

@router.delete("/{review_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_review(review_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    db_review = db.query(Review).filter(Review.id == review_id).first()
    if not db_review:
        raise HTTPException(status_code=404, detail="Отзыв не найден")
    if db_review.user_id != current_user.id and not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Нет доступа к удалению этого отзыва")
    db.delete(db_review)
    db.commit()
    return None

@router.patch("/{review_id}/reply", response_model=schemas.ReviewRead)
def admin_reply_review(review_id: int, reply: str = Body(...), db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Требуются права администратора")
    db_review = db.query(Review).filter(Review.id == review_id).first()
    if not db_review:
        raise HTTPException(status_code=404, detail="Отзыв не найден")
    db_review.admin_reply = reply
    db.commit()
    db.refresh(db_review)
    return db_review

@router.post("/guest", response_model=schemas.ReviewRead)
def create_guest_review(review: schemas.ReviewCreate, db: Session = Depends(get_db), request: Request = None):
    try:
        if not review.guest_name or not review.guest_phone:
            raise HTTPException(status_code=400, detail="Имя и телефон обязательны для гостевого отзыва")
        client_ip = None
        if request is not None:
            xff = request.headers.get("x-forwarded-for")
            client_ip = xff.split(",")[0].strip() if xff else (request.client.host if request.client else None)
        db_review = Review(
            user_id=None,
            guest_name=review.guest_name,
            guest_phone=review.guest_phone,
            ip_address=client_ip,
            rating=review.rating,
            text=review.text,
            published=True
        )
        db.add(db_review)
        db.commit()
        db.refresh(db_review)
        return db_review
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=500, detail="Internal Server Error")
