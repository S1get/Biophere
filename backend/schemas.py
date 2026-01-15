from pydantic import BaseModel, EmailStr, field_serializer, field_validator
from datetime import datetime
import re

class UserBase(BaseModel):
    name: str
    email: EmailStr
    phone: str
    is_admin: bool = False

class UserCreate(UserBase):
    password: str

class UserRead(UserBase):
    id: int
    model_config = {
        "from_attributes": True
    }

class ReviewBase(BaseModel):
    rating: int
    text: str
    admin_reply: str | None = None
    guest_name: str | None = None
    guest_phone: str | None = None
    published: bool = True

class ReviewCreate(ReviewBase):
    pass

class ReviewUpdate(BaseModel):
    rating: int | None = None
    text: str | None = None

class ReviewRead(ReviewBase):
    id: int
    user_id: int | None = None
    user: UserRead | None = None
    created_at: datetime
    model_config = {
        "from_attributes": True
    }

class QuestionBase(BaseModel):
    text: str
    admin_reply: str | None = None
    guest_name: str | None = None
    guest_phone: str | None = None
    is_read: bool = False
    published: bool = True

class QuestionCreate(QuestionBase):
    pass

class QuestionUpdate(BaseModel):
    text: str | None = None

class QuestionRead(QuestionBase):
    id: int
    user_id: int | None = None
    user: UserRead | None = None
    created_at: datetime

    @field_serializer("created_at")
    def serialize_created_at(self, value):
        return value.isoformat() if value else None

    model_config = {
        "from_attributes": True
    }

class SpecialistBase(BaseModel):
    name: str
    position: str
    specialization: str | None = None
    workplace: str | None = None
    education: str | None = None
    extra_qual: str | None = None
    photo: str | None = None

class SpecialistCreate(SpecialistBase):
    pass

class SpecialistUpdate(BaseModel):
    name: str | None = None
    position: str | None = None
    specialization: str | None = None
    workplace: str | None = None
    education: str | None = None
    extra_qual: str | None = None
    photo: str | None = None

class SpecialistRead(SpecialistBase):
    id: int
    created_at: datetime
    updated_at: datetime

    @field_serializer("created_at")
    def serialize_created_at(self, value):
        return value.isoformat() if value else None

    @field_serializer("updated_at")
    def serialize_updated_at(self, value):
        return value.isoformat() if value else None

    model_config = {
        "from_attributes": True
    }

class BookingBase(BaseModel):
    branch: str
    service: str
    doctor: str
    date: str
    time: str
    full_name: str
    phone: str
    email: EmailStr
    comments: str | None = None
    
    model_config = {
        "alias_generator": lambda field_name: ''.join(word.title() if i > 0 else word for i, word in enumerate(field_name.split('_'))),
        "populate_by_name": True
    }

    @field_validator("branch", "service", "doctor", "full_name")
    def strip_and_minlen(cls, v: str):
        v = v.strip()
        if len(v) < 2:
            raise ValueError("Недостаточная длина")
        if len(v) > 200:
            raise ValueError("Слишком длинное значение")
        return v

    @field_validator("date")
    def validate_date(cls, v: str):
        if not re.fullmatch(r"\d{4}-\d{2}-\d{2}", v.strip()):
            raise ValueError("Некорректная дата (YYYY-MM-DD)")
        return v

    @field_validator("time")
    def validate_time(cls, v: str):
        if not re.fullmatch(r"\d{2}:\d{2}", v.strip()):
            raise ValueError("Некорректное время (HH:MM)")
        return v

    @field_validator("phone")
    def validate_phone(cls, v: str):
        digits = re.sub(r"\D", "", v)
        if len(digits) < 10 or len(digits) > 15:
            raise ValueError("Некорректный телефон")
        return v.strip()

    @field_validator("comments")
    def validate_comments(cls, v: str | None):
        if v is None:
            return v
        v = v.strip()
        if len(v) > 1000:
            raise ValueError("Слишком длинный комментарий")
        return v
class BookingCreate(BookingBase):
    pass

class BookingRead(BookingBase):
    id: int
    created_at: datetime
    
    model_config = {
        "from_attributes": True,
        "populate_by_name": True
    }

# Публичные модели без телефона (для открытых эндпоинтов)
class PublicUserRead(BaseModel):
    id: int
    name: str
    model_config = {
        "from_attributes": True
    }

class PublicReviewRead(BaseModel):
    id: int
    rating: int
    text: str
    admin_reply: str | None = None
    guest_name: str | None = None
    user_id: int | None = None
    user: PublicUserRead | None = None
    created_at: datetime

    @field_serializer("created_at")
    def serialize_created_at(self, value):
        return value.isoformat() if value else None

    model_config = {
        "from_attributes": True
    }

class PublicQuestionRead(BaseModel):
    id: int
    text: str
    admin_reply: str | None = None
    guest_name: str | None = None
    is_read: bool = False
    user_id: int | None = None
    user: PublicUserRead | None = None
    created_at: datetime

    @field_serializer("created_at")
    def serialize_created_at(self, value):
        return value.isoformat() if value else None

    model_config = {
        "from_attributes": True
    }
