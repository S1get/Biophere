from database import engine, Base
from models import User, Review, Question, Specialist, Booking

# Создаем все таблицы
Base.metadata.create_all(bind=engine)
print("Все таблицы успешно созданы!") 
