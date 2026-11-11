# مواصفات الباك إند — ميزة إضافة المحتوى (مدينة / فعالية / أكلة)

> **ملاحظة:** الجداول `cities`، `events`، `recipes` موجودة بالفعل في `models.py` ومُعرَّفة بـ SQLAlchemy.
> المطلوب فقط **إضافة endpoints جديدة** في `main.py` وتعديل endpoints الجلب الموجودة.

---

## 1. الجداول والأعمدة

### 1.1 — جدول `cities` (موجود)

| العمود | النوع | إلزامي | ملاحظة |
|--------|-------|--------|--------|
| `id` | SERIAL PK | — | توليد تلقائي |
| `name` | VARCHAR(150) | ✅ | بصيغة "عربي – English" |
| `slug` | VARCHAR(150) UNIQUE | ✅ | يُولَّد تلقائياً: `{country_slug}_{en_name_lowercase}` |
| `image_url` | VARCHAR(500) | لا | يجب أن يبدأ بـ `https://` إذا مُرِّر |
| `description` | TEXT | لا | وصف قصير للمدينة |
| `historic` | TEXT | لا | معالم تاريخية (pipe-separated: `🏛️ المعلم – Name`) |
| `restaurants` | TEXT | لا | مطاعم (pipe-separated: `🍽️ المطعم – Name`) |
| `cafes` | TEXT | لا | مقاهي (pipe-separated: `☕ المقهى – Name`) |
| `events_list` | TEXT | لا | أنشطة وفعاليات (pipe-separated) |
| `country_id` | INT FK→countries | ✅ | رابط الدولة |

**قيد إضافي مطلوب:**
```sql
ALTER TABLE cities ADD CONSTRAINT uq_city_name_country
    UNIQUE (country_id, LOWER(name));
```

---

### 1.2 — جدول `events` (موجود)

| العمود | النوع | إلزامي | ملاحظة |
|--------|-------|--------|--------|
| `id` | SERIAL PK | — | توليد تلقائي |
| `title` | VARCHAR(255) | ✅ | بصيغة "عربي – English" |
| `category` | VARCHAR(150) | ✅ | قيمة من القائمة أدناه |
| `description` | TEXT | لا | — |
| `date_info` | VARCHAR(150) | لا | مثال: `يناير – مارس` |
| `duration` | VARCHAR(100) | لا | مثال: `3 أيام` |
| `weather` | VARCHAR(100) | لا | مثال: `حار صيفاً، معتدل شتاءً` |
| `airport` | VARCHAR(150) | لا | أقرب مطار |
| `activities` | TEXT | لا | pipe-separated `icon|price`, مثال: `🦁 صيد|300 ريال \| 🌊 غطس|200 ريال` |
| `hotel_price` | VARCHAR(100) | لا | مثال: `من 300 ريال/ليلة` |
| `total_cost` | VARCHAR(100) | لا | مثال: `2000 ريال` |
| `image_url` | VARCHAR(500) | لا | يجب أن يبدأ بـ `https://` إذا مُرِّر |
| `country_id` | INT FK→countries | ✅ | رابط الدولة |
| `city_id` | INT FK→cities | لا | مدينة اختيارية |

**قيم `category` المسموحة:**
```
food&cafe | Beaches&seas | Safari&mountains | evnents&resorts | Museums and landmarks | cultural
```
*(نفس قيم `data-region` في events.html)*

**قيد إضافي مطلوب:**
```sql
ALTER TABLE events ADD CONSTRAINT uq_event_title_country
    UNIQUE (country_id, LOWER(title));
```

---

### 1.3 — جدول `recipes` (موجود)

| العمود | النوع | إلزامي | ملاحظة |
|--------|-------|--------|--------|
| `id` | SERIAL PK | — | توليد تلقائي |
| `title` | VARCHAR(255) | ✅ | بصيغة "عربي – English" |
| `category` | VARCHAR(100) | ✅ | قيمة من القائمة أدناه |
| `ingredients` | TEXT | لا | ثلاثيات pipe-separated: `اسم|كمية|وحدة` |
| `spices` | TEXT | لا | نفس صيغة ingredients |
| `sauces` | TEXT | لا | يمكن أن يكون فارغاً |
| `steps` | TEXT | لا | pipe-separated جمل كاملة |
| `image_url` | VARCHAR(500) | لا | يجب أن يبدأ بـ `https://` إذا مُرِّر |
| `country_id` | INT FK→countries | ✅ | رابط الدولة |

**قيم `category` المسموحة:**
```
all | main-foods | sweets | snacks
```
*(ملاحظة: `all` غير صالحة للإضافة، المسموح عند الإضافة: `main-foods`, `sweets`, `snacks`)*

**قيد إضافي مطلوب:**
```sql
ALTER TABLE recipes ADD CONSTRAINT uq_recipe_title_country
    UNIQUE (country_id, LOWER(title));
```

---

## 2. الـ Endpoints

### متطلبات مشتركة لكل endpoint إداري
- يستقبل `admin_email` في body الـ POST أو query param لـ DELETE
- يتحقق من الصلاحية: `SELECT is_admin FROM users WHERE email = $admin_email` → 403 إذا لم يكن أدمن
- يرجع 409 Conflict إذا كان العنصر موجوداً بنفس الاسم في نفس الدولة
- يرجع 404 إذا كانت الدولة غير موجودة

---

### 2.1 — إضافة مدينة

```
POST /admin/add-city
```

**Request body:**
```json
{
  "admin_email": "admin@example.com",
  "country_slug": "kenya",
  "name": "كيليفي – Kilifi",
  "image_url": "https://res.cloudinary.com/example/kilifi.jpg",
  "description": "مدينة ساحلية هادئة على المحيط الهندي",
  "historic": "🏰 قلعة كيلفي القديمة | 🏛️ المتحف الأثري",
  "restaurants": "🍽️ مطعم الصياد | 🍽️ كيلفي جريل",
  "cafes": "☕ كيلفي كافيه | ☕ أوشن فيو كافيه",
  "events_list": "🎪 مهرجان الصيد | 🌊 ركوب الأمواج"
}
```

**Response 201:**
```json
{
  "status": "success",
  "id": 42,
  "slug": "kenya_kilifi",
  "name": "كيلفي – Kilifi",
  "country_id": 7
}
```

**الأخطاء:**
- `400` — اسم فارغ أو رابط صورة لا يبدأ بـ `https://`
- `403` — ليس أدمن
- `404` — الدولة `kenya` غير موجودة
- `409` — مدينة بنفس الاسم موجودة في كينيا

---

### 2.2 — إضافة فعالية

```
POST /admin/add-event
```

**Request body:**
```json
{
  "admin_email": "admin@example.com",
  "country_slug": "kenya",
  "title": "مهرجان ليموروغو – Lemorugo Festival",
  "category": "cultural",
  "description": "مهرجان ثقافي يقام سنوياً في سهول ماساي",
  "date_info": "يوليو – أغسطس",
  "image_url": "https://res.cloudinary.com/example/lemorugo.jpg",
  "duration": "3 أيام",
  "weather": "جاف ومعتدل",
  "airport": "مطار ويلسون – Wilson Airport",
  "activities": "🥁 طبول ماساي|مجاني | 🌿 جولة سفاري|350 ريال | 🏕️ إقامة أوتد|200 ريال",
  "hotel_price": "من 280 ريال/ليلة",
  "total_cost": "2500 ريال"
}
```

**Response 201:**
```json
{
  "status": "success",
  "id": 15,
  "title": "مهرجان ليموروغو – Lemorugo Festival",
  "country_id": 7
}
```

**الأخطاء:** نفس 2.1 + `400` إذا كانت `category` خارج القيم المسموحة.

---

### 2.3 — إضافة وصفة

```
POST /admin/add-recipe
```

**Request body:**
```json
{
  "admin_email": "admin@example.com",
  "country_slug": "kenya",
  "title": "أوغالي بالخضار – Ugali na Mboga",
  "category": "main-foods",
  "image_url": "https://res.cloudinary.com/example/ugali.jpg",
  "ingredients": "دقيق الذرة|2|كوب|مياه|4|كوب|زيت|2|ملعقة",
  "spices": "ملح|1|ملعقة صغيرة",
  "sauces": "",
  "steps": "يُغلى الماء مع إضافة الملح | يُضاف دقيق الذرة تدريجياً مع التقليب المستمر | يُطهى على نار هادئة 15 دقيقة حتى يتماسك | يُقدَّم ساخناً مع الخضار المطهوة"
}
```

**Response 201:**
```json
{
  "status": "success",
  "id": 23,
  "title": "أوغالي بالخضار – Ugali na Mboga",
  "country_id": 7
}
```

**الأخطاء:** نفس 2.1 + `400` إذا كانت `category` هي `all`.

---

### 2.4 — تعديل مدينة

```
PATCH /admin/update-city/{city_id}
```

**Request body:** أي حقل أو أكثر من حقول المدينة (جزئي — PATCH):
```json
{
  "admin_email": "admin@example.com",
  "description": "وصف محدّث للمدينة",
  "restaurants": "🍽️ مطعم جديد | 🍽️ مطعم قديم"
}
```

**Response 200:**
```json
{
  "status": "success",
  "id": 42,
  "updated_fields": ["description", "restaurants"]
}
```

---

### 2.5 — تعديل فعالية

```
PATCH /admin/update-event/{event_id}
```

**Request body:** أي حقل (جزئي):
```json
{
  "admin_email": "admin@example.com",
  "hotel_price": "من 350 ريال/ليلة",
  "total_cost": "3000 ريال"
}
```

**Response 200:**
```json
{
  "status": "success",
  "id": 15,
  "updated_fields": ["hotel_price", "total_cost"]
}
```

---

### 2.6 — تعديل وصفة

```
PATCH /admin/update-recipe/{recipe_id}
```

**Request body:** أي حقل (جزئي):
```json
{
  "admin_email": "admin@example.com",
  "steps": "خطوة 1 محدّثة | خطوة 2 محدّثة",
  "image_url": "https://res.cloudinary.com/example/ugali-v2.jpg"
}
```

**Response 200:**
```json
{
  "status": "success",
  "id": 23,
  "updated_fields": ["steps", "image_url"]
}
```

---

### 2.7 — حذف مدينة

```
DELETE /admin/delete-city?id={city_id}&admin_email={email}
```

**Response 200:**
```json
{ "status": "success", "deleted_id": 42 }
```

---

### 2.8 — حذف فعالية

```
DELETE /admin/delete-event?id={event_id}&admin_email={email}
```

**Response 200:**
```json
{ "status": "success", "deleted_id": 15 }
```

---

### 2.9 — حذف وصفة

```
DELETE /admin/delete-recipe?id={recipe_id}&admin_email={email}
```

**Response 200:**
```json
{ "status": "success", "deleted_id": 23 }
```

---

### 2.10 — جلب مدن الدولة (موجود — لا يحتاج تعديل)

```
GET /countries/{slug}/cities
```

يرجع كل الحقول المطلوبة كما هو. لا يحتاج تعديلاً.

**Response 200 (مثال):**
```json
[
  {
    "id": 42,
    "slug": "kenya_kilifi",
    "name": "كيلفي – Kilifi",
    "image_url": "https://...",
    "description": "...",
    "historic": "🏰 قلعة ... | ...",
    "restaurants": "🍽️ ... | ...",
    "cafes": "☕ ... | ...",
    "events_list": "🎪 ... | ..."
  }
]
```

---

### 2.11 — جلب الفعاليات (موجود — يحتاج توسعة)

```
GET /events
GET /events?country_slug={slug}
GET /events?category={category}
GET /events?country_slug={slug}&category={category}
```

**الحالة الحالية:** يرجع `id, title, category, description, date_info, image_url, country` فقط.

**المطلوب:** إضافة `duration, weather, airport, activities, hotel_price, total_cost, country_slug`.

**Response 200 (مثال مفصّل):**
```json
[
  {
    "id": 15,
    "title": "مهرجان ليموروغو – Lemorugo Festival",
    "category": "cultural",
    "description": "مهرجان ثقافي يقام سنوياً في سهول ماساي",
    "date_info": "يوليو – أغسطس",
    "image_url": "https://...",
    "country": "كينيا",
    "country_slug": "kenya",
    "duration": "3 أيام",
    "weather": "جاف ومعتدل",
    "airport": "مطار ويلسون – Wilson Airport",
    "activities": "🥁 طبول ماساي|مجاني | ...",
    "hotel_price": "من 280 ريال/ليلة",
    "total_cost": "2500 ريال"
  }
]
```

---

### 2.12 — جلب الوصفات (موجود — يحتاج إضافة فلتر)

```
GET /recipes
GET /recipes?country_slug={slug}
GET /recipes?category={category}
```

**المطلوب:** إضافة query param اختياري `country_slug` وإضافة `country_slug` في الرد.

**Response 200 (مثال):**
```json
[
  {
    "id": 23,
    "title": "أوغالي بالخضار – Ugali na Mboga",
    "category": "main-foods",
    "image_url": "https://...",
    "country": "كينيا",
    "country_slug": "kenya"
  }
]
```

---

### 2.13 — جلب وصفة واحدة كاملة (جديد)

```
GET /recipes/{recipe_id}
```

**Response 200:**
```json
{
  "id": 23,
  "title": "أوغالي بالخضار – Ugali na Mboga",
  "category": "main-foods",
  "image_url": "https://...",
  "country": "كينيا",
  "country_slug": "kenya",
  "ingredients": "دقيق الذرة|2|كوب|مياه|4|كوب|زيت|2|ملعقة",
  "spices": "ملح|1|ملعقة صغيرة",
  "sauces": "",
  "steps": "يُغلى الماء مع إضافة الملح | يُضاف دقيق الذرة ..."
}
```

**Response 404:** إذا لم تُوجد الوصفة.

---

## 3. قواعد التحقق (Validation Rules)

### مشتركة لكل الأنواع
| القاعدة | التفاصيل |
|---------|---------|
| **admin_email مطلوب** | يجب أن يكون موجوداً في users وعنده `is_admin = true` |
| **country_slug مطلوب** | يجب أن يكون موجوداً في جدول `countries` |
| **رابط الصورة** | إذا مُرِّر يجب أن يبدأ بـ `https://` |
| **منع التكرار** | نفس العنوان (case-insensitive) في نفس الدولة → 409 Conflict |

### المدينة (City)
| الحقل | القاعدة |
|-------|--------|
| `name` | مطلوب، غير فارغ، بصيغة "عربي – English" |
| `slug` | يُولَّد تلقائياً من `country_slug` + الجزء الإنجليزي من `name` (lowercase، spaces→underscores) — مثال: `kenya_kilifi` |
| `historic` / `restaurants` / `cafes` / `events_list` | اختيارية، pipe-separated، كل عنصر: `emoji اسم عربي – English Name` |

### الفعالية (Event)
| الحقل | القاعدة |
|-------|--------|
| `title` | مطلوب، غير فارغ |
| `category` | مطلوب، قيمة من: `food&cafe`, `Beaches&seas`, `Safari&mountains`, `evnents&resorts`, `Museums and landmarks`, `cultural` |
| `activities` | اختياري، pipe-separated pairs: `icon+نص|سعر بالريال` |

### الوصفة (Recipe)
| الحقل | القاعدة |
|-------|--------|
| `title` | مطلوب، غير فارغ |
| `category` | مطلوب، واحدة من: `main-foods`, `sweets`, `snacks` (ليس `all`) |
| `ingredients` | اختياري، triplets pipe-separated: `اسم|كمية|وحدة` — عدد القيم يجب أن يكون مضاعفاً لـ 3 |
| `spices` | نفس صيغة ingredients |
| `steps` | اختياري، pipe-separated جمل كاملة |
| الامتثال للحلال | لا يُقبَل أي محتوى يتعلق بالكحول أو المواد المحرمة |

---

## 4. شكل الأخطاء الموحّد

```json
{
  "detail": "وصف الخطأ بالعربية"
}
```

| كود | الحالة |
|-----|--------|
| `400` | بيانات غير صالحة (حقل فارغ، رابط خاطئ، category غير مسموحة) |
| `403` | ليس لديك صلاحية — admin_email غير صالح |
| `404` | الدولة أو العنصر غير موجود |
| `409` | تعارض — عنصر بنفس الاسم موجود في هذه الدولة |
| `500` | خطأ داخلي في السيرفر |

---

## 5. ملاحظات للتنفيذ

1. **الـ slug للمدن** — استخرج الجزء الإنجليزي من `name` (بعد `–`):
   ```python
   en_part = name.split("–")[1].strip().lower().replace(" ", "_") if "–" in name else name.lower().replace(" ", "_")
   slug = f"{country_slug}_{en_part}"
   ```

2. **منع التكرار** — الأسلم إضافة `UNIQUE` constraint على مستوى DB (القيد في §1). في حال التعارض يرجع PostgreSQL `UniqueViolation` → `catch` → رجع 409.

3. **جلب country_id من slug** — نفس الطريقة المستخدمة في `GET /countries/{slug}/cities`:
   ```sql
   SELECT id FROM countries WHERE slug = $country_slug
   ```

4. **توسعة GET /events و GET /recipes** — أضف query param اختياري `country_slug`:
   ```python
   @app.get("/events")
   def get_events(country_slug: Optional[str] = None, category: Optional[str] = None):
       # WHERE ($country_slug IS NULL OR c.slug = $country_slug)
       #   AND ($category IS NULL OR e.category = $category)
   ```

5. **التحقق من صلاحية الأدمن** — نفس النمط الموجود في `main.py`:
   ```python
   cur.execute("SELECT is_admin FROM users WHERE email = %s", (admin_email,))
   row = cur.fetchone()
   if not row or not row[0]:
       raise HTTPException(status_code=403, detail="ليس لديك صلاحية")
   ```

6. **Pydantic models مقترحة:**
   ```python
   class AddCity(BaseModel):
       admin_email: str
       country_slug: str
       name: str
       image_url: Optional[str] = None
       description: Optional[str] = None
       historic: Optional[str] = None
       restaurants: Optional[str] = None
       cafes: Optional[str] = None
       events_list: Optional[str] = None

   class AddEvent(BaseModel):
       admin_email: str
       country_slug: str
       title: str
       category: str
       description: Optional[str] = None
       date_info: Optional[str] = None
       image_url: Optional[str] = None
       duration: Optional[str] = None
       weather: Optional[str] = None
       airport: Optional[str] = None
       activities: Optional[str] = None
       hotel_price: Optional[str] = None
       total_cost: Optional[str] = None

   class AddRecipe(BaseModel):
       admin_email: str
       country_slug: str
       title: str
       category: str
       image_url: Optional[str] = None
       ingredients: Optional[str] = None
       spices: Optional[str] = None
       sauces: Optional[str] = None
       steps: Optional[str] = None

   class UpdateCity(BaseModel):
       admin_email: str
       name: Optional[str] = None
       image_url: Optional[str] = None
       description: Optional[str] = None
       historic: Optional[str] = None
       restaurants: Optional[str] = None
       cafes: Optional[str] = None
       events_list: Optional[str] = None

   class UpdateEvent(BaseModel):
       admin_email: str
       title: Optional[str] = None
       category: Optional[str] = None
       description: Optional[str] = None
       date_info: Optional[str] = None
       image_url: Optional[str] = None
       duration: Optional[str] = None
       weather: Optional[str] = None
       airport: Optional[str] = None
       activities: Optional[str] = None
       hotel_price: Optional[str] = None
       total_cost: Optional[str] = None

   class UpdateRecipe(BaseModel):
       admin_email: str
       title: Optional[str] = None
       category: Optional[str] = None
       image_url: Optional[str] = None
       ingredients: Optional[str] = None
       spices: Optional[str] = None
       sauces: Optional[str] = None
       steps: Optional[str] = None
   ```
