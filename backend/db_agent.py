import os
import re
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

# نمط استخراج slug المدينة من استدعاء saveItem('city', 'SLUG', ...)
_CITY_SLUG_RE = re.compile(r"saveItem\s*\(\s*['\"]city['\"]\s*,\s*['\"]([^'\"]+)['\"]")


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
        countries_objs = {}   # key: اسم الدولة العربي  → Country ORM
        slug_to_country = {}  # key: slug (مثل japan)  → Country ORM
        if countries_files:
            print(f"📂 معالجة ملف الدول: {os.path.basename(countries_files[0])}...")
            with open(countries_files[0], "r", encoding="utf-8") as f:
                soup = BeautifulSoup(f.read(), "html.parser")
                cards = soup.find_all("div", class_="country-card")
                for card in cards:
                    name_tag = card.find("h1")
                    desc_tag = card.find("h2")
                    img_tag  = card.find("img")
                    region   = card.get("data-region")
                    # slug مأخوذ من href أو onclick أو data-id
                    slug_raw = (
                        card.get("data-id") or
                        card.get("data-slug") or
                        ""
                    )
                    # fallback: استخرج slug من رابط الـ <a> داخل الكرت
                    if not slug_raw:
                        a_tag = card.find("a", href=True)
                        if a_tag:
                            href = a_tag["href"]
                            # /countries/country/europe/france.html → france
                            m = re.search(r"/country/[^/]+/([^/]+)\.html", href)
                            if m:
                                slug_raw = m.group(1)

                    if name_tag:
                        name = name_tag.get_text(strip=True)
                        desc = desc_tag.get_text(strip=True) if desc_tag else ""
                        img  = img_tag.get("src") if img_tag else ""

                        cont_id = continents_objs.get(region).id if region in continents_objs else None

                        country = Country(
                            name=name,
                            description=desc,
                            image_url=img,
                            slug=slug_raw or None,
                            continent_id=cont_id
                        )
                        db.add(country)
                        db.flush()
                        countries_objs[name] = country
                        if slug_raw:
                            slug_to_country[slug_raw] = country
            print(f"✅ تم حفظ {len(countries_objs)} دولة.")

        # 3. استخراج المدن من صفحات الدول
        #    المسار: frontend/countries/country/{قارة}/{slug}.html
        frontend_dir = os.path.normpath(
            os.path.join(backend_dir, "..", "frontend", "countries", "country")
        )
        cities_count   = 0
        cities_no_slug = []   # مدن لم نجد لها slug
        cities_objs    = {}   # key: city_slug → City ORM  (لمنع التكرار)

        continent_dirs = [
            d for d in glob.glob(os.path.join(frontend_dir, "*"))
            if os.path.isdir(d) and ".claude" not in d
        ]
        for cont_dir in sorted(continent_dirs):
            for html_file in sorted(glob.glob(os.path.join(cont_dir, "*.html"))):
                if ".claude" in html_file:
                    continue

                country_slug = os.path.splitext(os.path.basename(html_file))[0]
                c_obj = slug_to_country.get(country_slug)
                if not c_obj:
                    # حاول المطابقة الجزئية لو الـ slug ما ضُبط في countries.html
                    for s, obj in slug_to_country.items():
                        if s == country_slug:
                            c_obj = obj
                            break

                with open(html_file, encoding="utf-8") as f:
                    content = f.read()

                soup       = BeautifulSoup(content, "html.parser")
                cite_divs  = soup.find_all("div", class_="cite")

                for div in cite_divs:
                    div_str    = str(div)
                    m          = _CITY_SLUG_RE.search(div_str)
                    city_slug  = m.group(1) if m else None

                    name       = div.get("data-name", "")
                    img        = div.get("data-img", "")
                    desc       = div.get("data-desc", "")
                    historic   = div.get("data-historic", "")
                    rests      = div.get("data-restaurants", "")
                    cafes      = div.get("data-cafes", "")
                    ev_list    = div.get("data-events", "")

                    if not city_slug:
                        cities_no_slug.append({
                            "file": os.path.basename(html_file),
                            "name": name,
                        })
                        continue

                    if not c_obj:
                        # نُنشئ السجل بدون country_id مؤقتاً — هذا لن يحدث في الغالب
                        # لكن نريد حفظ المدينة ولا نخسرها
                        continue

                    # استيراد آمن: لو slug موجود → حدّث، وإلا أنشئ
                    if city_slug in cities_objs:
                        existing = cities_objs[city_slug]
                        existing.name        = name
                        existing.image_url   = img
                        existing.description = desc
                        existing.historic    = historic
                        existing.restaurants = rests
                        existing.cafes       = cafes
                        existing.events_list = ev_list
                    else:
                        city_obj = City(
                            name=name,
                            slug=city_slug,
                            image_url=img,
                            description=desc,
                            historic=historic,
                            restaurants=rests,
                            cafes=cafes,
                            events_list=ev_list,
                            country_id=c_obj.id,
                        )
                        db.add(city_obj)
                        db.flush()
                        cities_objs[city_slug] = city_obj
                        cities_count += 1

        print(f"✅ تم حفظ {cities_count} مدينة.")
        if cities_no_slug:
            print(f"⚠️  مدن بدون slug ({len(cities_no_slug)}):")
            for item in cities_no_slug:
                print(f"   {item['file']}: {item['name']}")

        # 4. استخراج الفعاليات من ملف events.html
        events_files  = glob.glob(os.path.join(backend_dir, "*event*.html"))
        events_count  = 0
        cities_by_name = {}  # key: city_name (من data-location) → City ORM
        if events_files:
            print(f"📂 معالجة ملف الفعاليات: {os.path.basename(events_files[0])}...")
            with open(events_files[0], "r", encoding="utf-8") as f:
                soup = BeautifulSoup(f.read(), "html.parser")
                cards = soup.find_all("div", class_="event-card")
                for card in cards:
                    item_btn = card.find("button", class_="event-item")
                    if not item_btn:
                        continue

                    title      = item_btn.get("data-title", "")
                    img        = item_btn.get("data-img", "")
                    country_raw = (
                        item_btn.get("data-country", "")
                        .encode("ascii", "ignore").decode()  # أزل الإيموجي ASCII-safe
                        .strip()
                    )
                    # إزالة الإيموجي بطريقة أشمل
                    country_raw = re.sub(r'[^\w\s؀-ۿ,.-]', '', item_btn.get("data-country", "")).strip()
                    desc       = item_btn.get("data-desc", "")
                    location   = item_btn.get("data-location", "")
                    category   = card.get("data-region", "")

                    # البحث عن الدولة
                    c_obj = None
                    for c_name, obj in countries_objs.items():
                        if c_name in country_raw or country_raw in c_name:
                            c_obj = obj
                            break

                    # ربط الفعالية بمدينة من المدن المستوردة (لو وجدت)
                    city_obj = None
                    if location:
                        city_name = location.split("–")[0].split(",")[0].strip()
                        # ابحث في المدن المستوردة أولاً
                        for slug, obj in cities_objs.items():
                            if obj.name and (city_name in obj.name or obj.name in city_name):
                                city_obj = obj
                                break
                        # fallback: أنشئ مدينة مؤقتة (كالسلوك القديم)
                        if not city_obj and c_obj and city_name not in cities_by_name:
                            city_obj = City(name=city_name, country_id=c_obj.id)
                            db.add(city_obj)
                            db.flush()
                            cities_by_name[city_name] = city_obj
                        elif city_name in cities_by_name:
                            city_obj = cities_by_name[city_name]

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

        # 5. استخراج الوصفات من ملف recipes.html
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

                    title       = item_btn.get("data-title", "")
                    img         = item_btn.get("data-img", "")
                    country_raw = card.get("data-country", "").strip()
                    category    = card.get("data-region", "")

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
        print("\n🎉 تم ملء قاعدة البيانات بنجاح وبكافة العلاقات!")

    except Exception as e:
        db.rollback()
        print(f"❌ حدث خطأ: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()
