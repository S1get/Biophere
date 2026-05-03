from fastapi import APIRouter, Depends, HTTPException, status, Body, Request
from sqlalchemy.orm import Session
from sqlalchemy import or_
from database import SessionLocal
from auth import get_current_user, get_db
import schemas
from models import Question, User
from datetime import datetime, timedelta
from sqlalchemy import inspect
from sqlalchemy import desc

router = APIRouter(prefix="/questions", tags=["questions"])

@router.post("/", response_model=schemas.QuestionRead)
def create_question(question: schemas.QuestionCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    db_question = Question(user_id=current_user.id, text=question.text)
    db.add(db_question)
    db.commit()
    db.refresh(db_question)
    return db_question

@router.get("/", response_model=list[schemas.PublicQuestionRead])
def get_questions(db: Session = Depends(get_db)):
    try:
        questions = (
            db.query(Question)
            .filter(Question.published == True)  # noqa: E712
            .order_by(desc(Question.created_at))
            .all()
        )
        for q in questions:
            if q.user_id:
                q.user
        return questions
    except Exception:
        return []

@router.get("/admin", response_model=list[schemas.QuestionRead])
def get_questions_admin(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    try:
        if not current_user.is_admin:
            raise HTTPException(status_code=403, detail="Требуются права администратора")
        questions = db.query(Question).order_by(Question.created_at.desc()).all()
        for q in questions:
            if q.user_id:
                q.user
        return questions
    except HTTPException:
        raise
    except Exception:
        return []

@router.put("/{question_id}", response_model=schemas.QuestionRead)
def update_question(question_id: int, question: schemas.QuestionUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    db_question = db.query(Question).filter(Question.id == question_id).first()
    if not db_question:
        raise HTTPException(status_code=404, detail="Вопрос не найден")
    
    # Проверяем права доступа
    if db_question.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Нет доступа к изменению этого вопроса")
    
    if question.text is not None:
        db_question.text = question.text
    db.commit()
    db.refresh(db_question)
    return db_question

@router.delete("/{question_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_question(question_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    db_question = db.query(Question).filter(Question.id == question_id).first()
    if not db_question:
        raise HTTPException(status_code=404, detail="Вопрос не найден")
    
    # Проверяем права доступа
    if db_question.user_id != current_user.id and not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Нет доступа к удалению этого вопроса")
    
    db.delete(db_question)
    db.commit()
    return None

@router.patch("/{question_id}/reply", response_model=schemas.QuestionRead)
def admin_reply_question(question_id: int, reply: str = Body(...), db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Требуются права администратора")
    db_question = db.query(Question).filter(Question.id == question_id).first()
    if not db_question:
        raise HTTPException(status_code=404, detail="Вопрос не найден")
    db_question.admin_reply = reply
    db.commit()
    db.refresh(db_question)
    return db_question

@router.patch("/{question_id}/publish", response_model=schemas.QuestionRead)
def set_question_published(question_id: int, published: bool = Body(...), db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Требуются права администратора")
    db_question = db.query(Question).filter(Question.id == question_id).first()
    if not db_question:
        raise HTTPException(status_code=404, detail="Вопрос не найден")
    db_question.published = bool(published)
    db.commit()
    db.refresh(db_question)
    return db_question

@router.post("/guest", response_model=schemas.QuestionRead)
def create_guest_question(question: schemas.QuestionCreate, db: Session = Depends(get_db), request: Request = None):
    try:
        if not question.guest_name or not question.guest_phone:
            raise HTTPException(status_code=400, detail="Имя и телефон обязательны для гостевого вопроса")
        # Мини-anti-spam: ограничиваем частоту по телефону (1 вопрос / 2 минуты)
        recent_limit_window = datetime.utcnow() - timedelta(minutes=2)
        recent_count = db.query(Question).filter(
            Question.guest_phone == str(question.guest_phone),
            Question.created_at >= recent_limit_window
        ).count()
        if recent_count > 0:
            raise HTTPException(status_code=status.HTTP_429_TOO_MANY_REQUESTS, detail="Слишком часто. Попробуйте позже.")
        client_ip = None
        if request is not None:
            xff = request.headers.get("x-forwarded-for")
            client_ip = xff.split(",")[0].strip() if xff else (request.client.host if request.client else None)

        inspector = inspect(db.bind)
        columns = {col['name'] for col in inspector.get_columns('questions')}

        payload = {
            'text': question.text,
            'user_id': None,
        }
        if 'guest_name' in columns:
            payload['guest_name'] = question.guest_name
        if 'guest_phone' in columns:
            payload['guest_phone'] = question.guest_phone
        if 'ip_address' in columns:
            payload['ip_address'] = client_ip
        if 'published' in columns:
            payload['published'] = True
        if 'is_read' in columns and getattr(question, 'is_read', None) is not None:
            payload['is_read'] = question.is_read

        db_question = Question(**payload)
        db.add(db_question)
        db.commit()
        db.refresh(db_question)
        return db_question
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=500, detail="Internal Server Error")

@router.patch("/{question_id}/read", response_model=schemas.QuestionRead)
def mark_question_as_read(question_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Требуются права администратора")
    db_question = db.query(Question).filter(Question.id == question_id).first()
    if not db_question:
        raise HTTPException(status_code=404, detail="Вопрос не найден")
    db_question.is_read = True
    db.commit()
    db.refresh(db_question)
    return db_question

@router.patch("/{question_id}/unread", response_model=schemas.QuestionRead)
def mark_question_as_unread(question_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Требуются права администратора")
    db_question = db.query(Question).filter(Question.id == question_id).first()
    if not db_question:
        raise HTTPException(status_code=404, detail="Вопрос не найден")
    db_question.is_read = False
    db.commit()
    db.refresh(db_question)
    return db_question
