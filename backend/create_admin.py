from database import SessionLocal
from models import User
from auth import get_password_hash
import os


def create_admin():
    db = SessionLocal()
    try:
        admin_email = os.getenv("ADMIN_EMAIL", "admin@biosphere.ru")
        admin_password = os.getenv("ADMIN_PASSWORD")
        env = os.getenv("ENVIRONMENT", "development").lower()

        existing_admin = db.query(User).filter(User.is_admin == True).first()
        if existing_admin:
            # Если админ уже есть, не трогаем его автоматически, если не задан ADMIN_PASSWORD
            if not admin_password:
                print("ADMIN_PASSWORD is not set; existing admin will not be modified.")
                return
            if existing_admin.email != admin_email:
                existing_admin.is_admin = False
                print(f"Убран статус админа у пользователя {existing_admin.email}")

        existing_user = db.query(User).filter(User.email == admin_email).first()

        if existing_user:
            existing_user.is_admin = True
            if not admin_password:
                print("ADMIN_PASSWORD is not set; cannot update admin password.")
                return
            existing_user.password_hash = get_password_hash(admin_password)
            existing_user.name = existing_user.name or "Admin"
            existing_user.phone = existing_user.phone or "0000000000"
            print(f"Обновлен существующий пользователь {admin_email} как админ")
        else:
            if not admin_password:
                if env in {"development", "dev", "local"}:
                    admin_password = "ADMINBIO"
                    print("ADMIN_PASSWORD is not set; using default dev password (development only).")
                else:
                    print("ADMIN_PASSWORD is not set; admin user will not be created in production.")
                    return
            admin_user = User(
                name="Admin",
                email=admin_email,
                phone="0000000000",
                password_hash=get_password_hash(admin_password),
                is_admin=True,
            )
            db.add(admin_user)
            print(f"Создан новый админ {admin_email}")

        db.commit()
        print(f"Админ {admin_email} успешно создан/обновлен")

    except Exception as e:
        db.rollback()
        print(f"Ошибка: {e}")
    finally:
        db.close()


if __name__ == "__main__":
    create_admin()

