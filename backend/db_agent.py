import os
import glob
from bs4 import BeautifulSoup
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import Base, Continent, Country, City, Recipe, Event

print("1. بدء تشغيل معالج ومستخرج البيانات...")

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    print("❌ خطأ: لم يتم العثور على DATABASE_URL في ملف .env")
    exit()

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# إعادة تهيئة الجداول لتطبيق العلاقات الجديدة
print("2. إعادة إنشاء الجداول في Render...")
Base.metadata.drop_all(bind=engine)
Base.metadata.create_all(bind=engine)
print("✅ تم تجهيز الجداول الجديدة (Continents, Countries, Cities, Recipes, Events).")

# قارات أساسية
CONTINENTS_MAP = {
    "asia": "آسيا",
    "europe": "أوروبا",
    "africa": "أفريقيا",
    "north-america": "أمريكا الشمالية",
    "south-america": "أمريكا الجنوبية",
    "oceania": "أوقيانوسيا"
}

def seed_database():
    db = SessionLocal()
    backend_dir = os.path.dirname(os.path.abspath(__file__))

    try:
        # 1. إنشاء القارات
        continents_objs = {}
        for code, name in CONTINENTS_MAP.items():
            cont = Continent(name=name, code=code)
            db.add(cont)
            db.flush()
            continents_objs[code] = cont

        # 2. استخراج الدول من ملف countries.html
        countries_files = glob.glob(os.path.join(backend_dir, "*countr*.html"))
        countries_objs = {}
        if countries_files:
            print(f"📂 معالجة ملف الدول: {os.path.basename(countries_files[0])}...")
            with open(countries_files[0], "r", encoding="utf-8") as f:
                soup = BeautifulSoup(f.read(), "html.parser")
                cards = soup.find_all("div", class_="country-card")
                for card in cards:
                    name_tag = card.find("h1")
                    desc_tag = card.find("h2")
                    img_tag = card.find("img")
                    region = card.get("data-region")

                    if name_tag:
                        name = name_tag.get_text(strip=True)
                        desc = desc_tag.get_text(strip=True) if desc_tag else ""
                        img = img_tag.get("src") if img_tag else ""
                        
                        cont_id = continents_objs.get(region).id if region in continents_objs else None
                        
                        country = Country(
                            name=name,
                            description=desc,
                            image_url=img,
                            continent_id=cont_id
                        )
                        db.add(country)
                        db.flush()
                        countries_objs[name] = country
            print(f"✅ تم حفظ {len(countries_objs)} دولة.")

        # 3. استخراج الفعاليات من ملف events.html
        events_files = glob.glob(os.path.join(backend_dir, "*event*.html"))
        events_count = 0
        cities_objs = {}
        if events_files:
            print(f"📂 معالجة ملف الفعاليات: {os.path.basename(events_files[0])}...")
            with open(events_files[0], "r", encoding="utf-8") as f:
                soup = BeautifulSoup(f.read(), "html.parser")
                cards = soup.find_all("div", class_="event-card")
                for card in cards:
                    item_btn = card.find("button", class_="event-item")
                    if not item_btn:
                        continue
                    
                    title = item_btn.get("data-title", "")
                    img = item_btn.get("data-img", "")
                    country_raw = item_btn.get("data-country", "").replace("🇸🇦", "").replace("🇯🇵", "").replace("🇮🇩", "").replace("🇪🇬", "").replace("🇿🇦", "").replace("🇲🇦", "").replace("🇮🇹", "").replace("🇨🇭", "").replace("🇮🇸", "").replace("🇨🇴", "").replace("🇧🇷", "").replace("🇵🇪", "").replace("🇲🇽", "").replace("🇺🇸", "").replace("🇨🇦", "").replace("🇮🇳", "").replace("🇹🇭", "").replace("🇲🇾", "").replace("🇸🇬", "").replace("🇵🇭", "").replace("🇻🇳", "").replace("🇦🇪", "").replace("🇶🇦", "").replace("🇰🇼", "").replace("🇹🇷", "").replace("🇲🇻", "").replace("🇱🇰", "").replace("🇹🇳", "").replace("🇰🇪", "").replace("🇹🇿", "").replace("🇲🇺", "").replace("🇸🇨", "").strip()
                    desc = item_btn.get("data-desc", "")
                    location = item_btn.get("data-location", "")
                    category = card.get("data-region", "")

                    # البحث عن الدولة
                    c_obj = None
                    for c_name, obj in countries_objs.items():
                        if c_name in country_raw or country_raw in c_name:
                            c_obj = obj
                            break

                    # إضافة المدينة إذا وجدت
                    city_obj = None
                    if location:
                        city_name = location.split("–")[0].split(",")[0].strip()
                        if c_obj and city_name not in cities_objs:
                            city_obj = City(name=city_name, country_id=c_obj.id)
                            db.add(city_obj)
                            db.flush()
                            cities_objs[city_name] = city_obj
                        elif city_name in cities_objs:
                            city_obj = cities_objs[city_name]

                    ev = Event(
                        title=title,
                        category=category,
                        description=desc,
                        date_info=item_btn.get("data-date", ""),
                        duration=item_btn.get("data-duration", ""),
                        weather=item_btn.get("data-weather", ""),
                        airport=item_btn.get("data-airport", ""),
                        activities=item_btn.get("data-activities", ""),
                        hotel_price=item_btn.get("data-hotel-price", ""),
                        total_cost=item_btn.get("data-total", ""),
                        image_url=img,
                        country_id=c_obj.id if c_obj else None,
                        city_id=city_obj.id if city_obj else None
                    )
                    db.add(ev)
                    events_count += 1
            print(f"✅ تم حفظ {events_count} فعالية وتجربة.")

        # 4. استخراج الوصفات من ملف recipes.html
        recipes_files = glob.glob(os.path.join(backend_dir, "*recipe*.html"))
        recipes_count = 0
        if recipes_files:
            print(f"📂 معالجة ملف الوصفات: {os.path.basename(recipes_files[0])}...")
            with open(recipes_files[0], "r", encoding="utf-8") as f:
                soup = BeautifulSoup(f.read(), "html.parser")
                cards = soup.find_all("div", class_="foods-card")
                for card in cards:
                    item_btn = card.find("button", class_="recipes-item")
                    if not item_btn:
                        continue
                    
                    title = item_btn.get("data-title", "")
                    img = item_btn.get("data-img", "")
                    country_raw = card.get("data-country", "").strip()
                    category = card.get("data-region", "")

                    c_obj = None
                    for c_name, obj in countries_objs.items():
                        if c_name in country_raw or country_raw in c_name:
                            c_obj = obj
                            break

                    rc = Recipe(
                        title=title,
                        category=category,
                        ingredients=item_btn.get("data-ingredients", ""),
                        spices=item_btn.get("data-spices", ""),
                        sauces=item_btn.get("data-sauces", ""),
                        steps=item_btn.get("data-steps", ""),
                        image_url=img,
                        country_id=c_obj.id if c_obj else None
                    )
                    db.add(rc)
                    recipes_count += 1
            print(f"✅ تم حفظ {recipes_count} وصفة طعام.")

        db.commit()
        print("\n🎉 تم ملء قاعدة البيانات في Render بنجاح وبكافة العلاقات!")

    except Exception as e:
        db.rollback()
        print(f"❌ حدث خطأ: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()