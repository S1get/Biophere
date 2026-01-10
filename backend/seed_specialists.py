from database import SessionLocal
from models import Specialist
from datetime import datetime

# Данные специалистов из specialists-data.js
specialists_data = [
    {
        "name": "Орлова Роза Сергеевна",
        "position": "Главный врач",
        "specialization": "терапия, визуальная диагностика (УЗИ), кардиология, онкология, неврология",
        "workplace": "ул. Солнечная, ул. Московская, д. 4",
        "education": "Московская Ветеринарная Академия",
        "extra_qual": "Кардиология, УЗИ-диагностика",
        "photo": "/doctors/rgogoleva.jpg"
    },
    {
        "name": "Черемисинова Анастасия Сергеевна",
        "position": "Главный врач",
        "specialization": "терапия, онкология",
        "workplace": "пр-т. Строителей, д. 9, к. 1",
        "education": "Московская Ветеринарная Академия",
        "extra_qual": "Кардиология, УЗИ-диагностика",
        "photo": "./doctors/ancheremisinova.jpg"
    },
    {
        "name": "Малышева Ольга Юрьевна",
        "position": "Ветеринарный врач-хирург",
        "specialization": "торакальная хирургия, абдоминальная хирургия, косметическая и реконструктивная хирургия",
        "workplace": "ул. Чернышевского, д. 7, ул. Солнечная",
        "education": "Московская Ветеринарная Академия",
        "extra_qual": "Кардиология, УЗИ-диагностика",
        "photo": "./doctors/olmalisheva.jpg"
    },
    {
        "name": "Онегов Иван Александрович",
        "position": "Ветеринарный врач-хирург",
        "specialization": "хирургия, кардиология, рентгенология, стоматология, ортодонтия",
        "workplace": "ул. Солнечная, ул. Чернышевского, д. 7",
        "education": "Московская Ветеринарная Академия",
        "extra_qual": "Кардиология, УЗИ-диагностика",
        "photo": "./doctors/ivonegov.jpg"
    },
    {
        "name": "Жаворонков Олег Николаевич",
        "position": "Главный хирург сети клиник",
        "specialization": "травматология, ортопедия, нейрохирургия, абдоминальная и торакальная хирургия",
        "workplace": "ул. Московская, д. 4",
        "education": "Московская Ветеринарная Академия",
        "extra_qual": "Кардиология, УЗИ-диагностика",
        "photo": "./doctors/olzhavoronkov.jpg"
    },
    {
        "name": "Вавилова Ульяна Юрьевна",
        "position": "Главный врач",
        "specialization": "терапия, офтальмология",
        "workplace": "ул. Московская, д. 4, ул. Молодой Гвардии",
        "education": "Московская Ветеринарная Академия",
        "extra_qual": "Кардиология, УЗИ-диагностика",
        "photo": "./doctors/ulvavilova.jpg"
    },
    {
        "name": "Казанцева Елена Валерьевна",
        "position": "Ведущий терапевт",
        "specialization": "терапия, визуальная диагностика (УЗИ), кардиология, анестезиология",
        "workplace": "ул. Московская, д. 4, пр-т. Строителей, д. 9, к. 1",
        "education": "Московская Ветеринарная Академия",
        "extra_qual": "Кардиология, УЗИ-диагностика",
        "photo": "./doctors/elborovicheva.jpg"
    },
    {
        "name": "Панина Станислава Ивановна",
        "position": "Ветеринарный врач",
        "specialization": "терапия, визуальная диагностика (УЗИ)",
        "workplace": "ул. Солнечная",
        "education": "Московская Ветеринарная Академия",
        "extra_qual": "Кардиология, УЗИ-диагностика",
        "photo": "./doctors/slobanova.jpg"
    },
    {
        "name": "Безденежных Анна Николаевна",
        "position": "Ветеринарный врач-хирург",
        "specialization": "абдоминальная, торакальная, косметическая и реконструктивная хирургия",
        "workplace": "ул. Молодой Гвардии",
        "education": "Московская Ветеринарная Академия",
        "extra_qual": "Кардиология, УЗИ-диагностика",
        "photo": "./doctors/anbezdenezhnih.jpg"
    },
    {
        "name": "Гурьева Ольга Вадимовна",
        "position": "Ветеринарный врач-хирург",
        "specialization": "терапия, абдоминальная хирургия, косметическая и реконструктивная хирургия",
        "workplace": "пр-т. Строителей, д. 9, к. 1",
        "education": "Московская Ветеринарная Академия",
        "extra_qual": "Кардиология, УЗИ-диагностика",
        "photo": "./doctors/olguryeva.jpg"
    },
    {
        "name": "Кудрявцева Юлия Юрьевна",
        "position": "Ветеринарный врач",
        "specialization": "терапия, дерматология, лабораторная диагностика",
        "workplace": "ул. Московская, д. 4, Нововятский район, ул. Молодой Гвардии",
        "education": "Московская Ветеринарная Академия",
        "extra_qual": "Кардиология, УЗИ-диагностика",
        "photo": "./doctors/ulkudryavceva.jpg"
    },
    {
        "name": "Суханова Елена Михайловна",
        "position": "Ветеринарный врач",
        "specialization": "терапия, дерматология, лабораторная диагностика",
        "workplace": "ул. Солнечная, ул. Чернышевского, д. 7",
        "education": "Московская Ветеринарная Академия",
        "extra_qual": "Кардиология, УЗИ-диагностика",
        "photo": "./doctors/elsuhanova.jpg"
    },
    {
        "name": "Пушкарёва Ирина Сергеевна",
        "position": "Ветеринарный врач",
        "specialization": "терапия",
        "workplace": "ул. Солнечная",
        "education": "Московская Ветеринарная Академия",
        "extra_qual": "Кардиология, УЗИ-диагностика",
        "photo": "./doctors/irpushkareva.jpg"
    },
    {
        "name": "Целищева Марина Владимировна",
        "position": "Ветеринарный врач",
        "specialization": "терапия, дерматология, лабораторная диагностика",
        "workplace": "ул. Московская, д. 4",
        "education": "Московская Ветеринарная Академия",
        "extra_qual": "Кардиология, УЗИ-диагностика",
        "photo": "./doctors/mcelisheva.jpg"
    },
    {
        "name": "Вохмянина Елена Олеговна",
        "position": "Ветеринарный врач",
        "specialization": "терапия, хирургия, визуальная диагностика (УЗИ)",
        "workplace": "пр-т. Строителей, д. 9, к. 1",
        "education": "Московская Ветеринарная Академия",
        "extra_qual": "Кардиология, УЗИ-диагностика",
        "photo": "./doctors/elvohmyanina.jpg"
    },
    {
        "name": "Ронжина Алёна Владимировна",
        "position": "Ветеринарный врач",
        "specialization": "терапия",
        "workplace": "ул. Солнечная, ул. Московская, д. 4",
        "education": "Московская Ветеринарная Академия",
        "extra_qual": "Кардиология, УЗИ-диагностика",
        "photo": "./doctors/alkovyazina.jpg"
    },
    {
        "name": "Токмалаева Ирина Васильевна",
        "position": "Ветеринарный врач",
        "specialization": "анестезиология, реаниматология",
        "workplace": "ул. Московская, д. 4",
        "education": "Московская Ветеринарная Академия",
        "extra_qual": "Кардиология, УЗИ-диагностика",
        "photo": "./doctors/irtokmalaeva.jpg"
    },
    {
        "name": "Воротилина Ольга Леонидовна",
        "position": "Ветеринарный врач",
        "specialization": "терапия, груминг",
        "workplace": "ул. Московская, д. 4, ул. Чернышевского, д. 7, Нововятский район, ул. Молодой Гвардии",
        "education": "Московская Ветеринарная Академия",
        "extra_qual": "Кардиология, УЗИ-диагностика",
        "photo": "./doctors/olvorotilina.jpg"
    },
    {
        "name": "Казаковцева Екатерина Владимировна",
        "position": "Ветеринарный врач",
        "specialization": "терапия",
        "workplace": "Нововятский район, ул. Молодой Гвардии",
        "education": "Московская Ветеринарная Академия",
        "extra_qual": "Кардиология, УЗИ-диагностика",
        "photo": "./doctors/ekkazakovceva.jpg"
    },
    {
        "name": "Черезова Оксана Васильевна",
        "position": "Ветеринарный врач",
        "specialization": "терапия",
        "workplace": "ул. Солнечная, пр-т. Строителей, д. 9, к. 1",
        "education": "Московская Ветеринарная Академия",
        "extra_qual": "Кардиология, УЗИ-диагностика",
        "photo": "./doctors/okcherezova.jpg"
    },
    {
        "name": "Шустова Полина Сергеевна",
        "position": "Ветеринарный врач",
        "specialization": "терапия, хирургия, визуальная диагностика (УЗИ), кардиология",
        "workplace": "пр-т. Строителей, д. 9, к. 1",
        "education": "Московская Ветеринарная Академия",
        "extra_qual": "Кардиология, УЗИ-диагностика",
        "photo": "./doctors/pshustova.jpg"
    },
    {
        "name": "Заварухин Иван Сергеевич",
        "position": "Ветеринарный врач",
        "specialization": "терапия, визуальная диагностика (УЗИ)",
        "workplace": "ул. Чернышевского, д. 7, ул. Московская, д. 4",
        "education": "Московская Ветеринарная Академия",
        "extra_qual": "Кардиология, УЗИ-диагностика",
        "photo": "./doctors/ivzavaruhin.jpg"
    },
    {
        "name": "Лисова-Новгородцева Ксения Игоревна",
        "position": "Ветеринарный врач",
        "specialization": "терапия, дерматология, лабораторная диагностика, репродуктология",
        "workplace": "ул. Солнечная, ул. Чернышевского, д. 7",
        "education": "Московская Ветеринарная Академия",
        "extra_qual": "Кардиология, УЗИ-диагностика",
        "photo": "./doctors/knovgorodceva.jpg"
    },
    {
        "name": "Александрова Александра Андреевна",
        "position": "Ветеринарный врач",
        "specialization": "терапия",
        "workplace": "пр-т. Строителей, д. 9, к. 1",
        "education": "Московская Ветеринарная Академия",
        "extra_qual": "Кардиология, УЗИ-диагностика",
        "photo": "./doctors/alkoroza.jpg"
    },
    {
        "name": "Заболотская Анастасия Михайловна",
        "position": "Ветеринарный врач",
        "specialization": "терапия, визуальная диагностика (УЗИ)",
        "workplace": "пр-т. Строителей, д. 9, к. 1",
        "education": "Московская Ветеринарная Академия",
        "extra_qual": "Кардиология, УЗИ-диагностика",
        "photo": "./doctors/anvvedenskaya.jpg"
    },
    {
        "name": "Маликова Ксения Фуатовна",
        "position": "Ветеринарный врач",
        "specialization": "терапия",
        "workplace": "ул. Московская, д. 4, ул. Солнечная",
        "education": "Московская Ветеринарная Академия",
        "extra_qual": "Кардиология, УЗИ-диагностика",
        "photo": "./doctors/kmalikova.jpg"
    },
    {
        "name": "Богомолова Карина Александровна",
        "position": "Ветеринарный врач",
        "specialization": "терапия",
        "workplace": "ул. Московская, д. 4, Нововятский район, ул. Молодой Гвардии",
        "education": "Московская Ветеринарная Академия",
        "extra_qual": "Кардиология, УЗИ-диагностика",
        "photo": "./doctors/kbogomolova.jpg"
    },
    {
        "name": "Коробейникова Марина Васильевна",
        "position": "Ветеринарный врач",
        "specialization": "терапия",
        "workplace": "ул. Московская, д. 4, Нововятский район, ул. Молодой Гвардии",
        "education": "Московская Ветеринарная Академия",
        "extra_qual": "Кардиология, УЗИ-диагностика",
        "photo": "./doctors/mkorobeynikova.jpg"
    },
    {
        "name": "Махнёва Дарья Валентиновна",
        "position": "Ветеринарный врач",
        "specialization": "терапия",
        "workplace": "Нововятский район, ул. Молодой Гвардии",
        "education": "Московская Ветеринарная Академия",
        "extra_qual": "Кардиология, УЗИ-диагностика",
        "photo": "./doctors/dmahneva.jpg"
    },
    {
        "name": "Просвирнина Ксения Алексеевна",
        "position": "Администратор",
        "specialization": "",
        "workplace": "",
        "education": "",
        "extra_qual": "",
        "photo": "kprosvirnina.jpg"
    },
    {
        "name": "Ефимова Елизавета Леонидовна",
        "position": "Администратор",
        "specialization": "",
        "workplace": "",
        "education": "",
        "extra_qual": "",
        "photo": "elivanova.jpg"
    },
    {
        "name": "Ишимова Людмила Дмитриевна",
        "position": "Администратор",
        "specialization": "",
        "workplace": "",
        "education": "",
        "extra_qual": "",
        "photo": "lishimova.jpg"
    },
    {
        "name": "Бакина Наталья Владимировна",
        "position": "Администратор",
        "specialization": "",
        "workplace": "",
        "education": "",
        "extra_qual": "",
        "photo": "nbakina.jpg"
    },
    {
        "name": "Орлова Алла Геннадьевна",
        "position": "Администратор",
        "specialization": "",
        "workplace": "",
        "education": "",
        "extra_qual": "",
        "photo": "alorlova.jpg"
    },
    {
        "name": "Юрченко Татьяна Алексеевна",
        "position": "Администратор",
        "specialization": "",
        "workplace": "",
        "education": "",
        "extra_qual": "",
        "photo": "tyurchenko.jpg"
    },
]

def seed_specialists():
    db = SessionLocal()
    try:
        # Проверяем, есть ли уже специалисты в базе
        existing_count = db.query(Specialist).count()
        if existing_count > 0:
            print(f"В базе уже есть {existing_count} специалистов. Пропускаем заполнение.")
            return
        
        # Добавляем специалистов
        for specialist_data in specialists_data:
            specialist = Specialist(
                name=specialist_data["name"],
                position=specialist_data["position"],
                specialization=specialist_data.get("specialization", ""),
                workplace=specialist_data.get("workplace", ""),
                education=specialist_data.get("education", ""),
                extra_qual=specialist_data.get("extra_qual", ""),
                photo=specialist_data.get("photo", ""),
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow()
            )
            db.add(specialist)
        
        db.commit()
        print(f"Успешно добавлено {len(specialists_data)} специалистов в базу данных.")
        
    except Exception as e:
        db.rollback()
        print(f"Ошибка при заполнении базы данных: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_specialists()