import os
import re
from typing import Optional
from fastapi import FastAPI, HTTPException, UploadFile, File, BackgroundTasks
from fastapi.responses import HTMLResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import psycopg2
from passlib.context import CryptContext
import cloudinary
import cloudinary.uploader
from email_service import get_rendered_template, send_verification_email
from ai_chef import ask_chef_agent
from pydantic import BaseModel


app = FastAPI()

# إعدادات Cloudinary
cloudinary.config(
    cloud_name=os.environ.get('CLOUDINARY_CLOUD_NAME'),
    api_key=os.environ.get('CLOUDINARY_API_KEY'),
    api_secret=os.environ.get('CLOUDINARY_API_SECRET')
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_db_connection():
    db_url = os.environ.get('DATABASE_URL')
    if not db_url:
        db_url = "postgresql://prostorge:e2g1E1i4ySRy768iEyks7eD25RAhp6Qv@dpg-d7gj4lpkh4rs739a6ff0-a.oregon-postgres.render.com/sofrah_web"
    return psycopg2.connect(db_url)

# --- النماذج (Models) ---
class UserCreate(BaseModel):
    username: str
    password: str
    email: str
    phone: Optional[str] = None

class UserLogin(BaseModel):
    email: str
    password: str

class UpdateProfile(BaseModel):
    name: str
    email: str
    phone: Optional[str] = None

class ChangePassword(BaseModel):
    currentPassword: str
    newPassword: str
    email: str

class FavoriteItem(BaseModel):
    email: str
    type: str
    id: str
    name: str
    img: str

class RemoveFavorite(BaseModel):
    email: str
    type: str
    id: str


# --- فحص قوة كلمة المرور ---
def check_password_strength(password: str):
    if len(password) < 8:
        raise HTTPException(status_code=400, detail="كلمة المرور يجب أن تكون 8 خانات على الأقل")
    if not re.search(r'[A-Z]', password):
        raise HTTPException(status_code=400, detail="كلمة المرور يجب أن تحتوي على حرف كبير واحد على الأقل (A-Z)")
    if not re.search(r'[a-z]', password):
        raise HTTPException(status_code=400, detail="كلمة المرور يجب أن تحتوي على حرف صغير واحد على الأقل (a-z)")
    if not re.search(r'[0-9]', password):
        raise HTTPException(status_code=400, detail="كلمة المرور يجب أن تحتوي على رقم واحد على الأقل (0-9)")

# --- تهيئة الجداول عند الإقلاع ---
@app.on_event("startup")
def create_tables():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("""
        CREATE TABLE IF NOT EXISTS favorites (
            id SERIAL PRIMARY KEY,
            email TEXT NOT NULL,
            type TEXT NOT NULL,
            item_id TEXT NOT NULL,
            name TEXT NOT NULL,
            img TEXT NOT NULL,
            UNIQUE(email, type, item_id)
        );
    """)
    cur.execute("""
        ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url TEXT;
    """)
    cur.execute("""
        ALTER TABLE users ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;
    """)
    cur.execute("""
        CREATE TABLE IF NOT EXISTS country_ready_overrides (
            country_id  TEXT PRIMARY KEY,
            is_ready    BOOLEAN NOT NULL DEFAULT TRUE,
            updated_by  TEXT,
            updated_at  TIMESTAMP DEFAULT NOW()
        );
    """)
    # جدول الحالة الجديد — يدعم 3 حالات
    cur.execute("""
        CREATE TABLE IF NOT EXISTS country_status (
            country_id  TEXT PRIMARY KEY,
            status      TEXT NOT NULL DEFAULT 'active'
                        CHECK (status IN ('active','coming_soon','in_development')),
            updated_by  TEXT,
            updated_at  TIMESTAMP DEFAULT NOW()
        );
    """)
    # انقل البيانات القديمة تلقائياً
    cur.execute("""
        INSERT INTO country_status (country_id, status, updated_by, updated_at)
        SELECT country_id,
               CASE WHEN is_ready THEN 'active' ELSE 'coming_soon' END,
               updated_by, updated_at
        FROM country_ready_overrides
        ON CONFLICT (country_id) DO NOTHING;
    """)
    # جدول card_overrides لحفظ تعديلات المحتوى
    cur.execute("""
        CREATE TABLE IF NOT EXISTS card_overrides (
            id          SERIAL PRIMARY KEY,
            card_type   TEXT NOT NULL,
            card_id     TEXT NOT NULL,
            fields      JSONB NOT NULL DEFAULT '{}',
            updated_by  TEXT,
            updated_at  TIMESTAMP DEFAULT NOW(),
            UNIQUE(card_type, card_id)
        );
    """)
    conn.commit()

    # منح صلاحية الأدمن تلقائياً للإيميلات المحددة
    admin_emails = ["Sofrh.info@gmail.com", "alharbi-admin@alharbi-admin.com"]
    for email in admin_emails:
        cur.execute(
            "UPDATE users SET is_admin = TRUE WHERE email = %s",
            (email,)
        )
    conn.commit()

    cur.close()
    conn.close()

# --- الحسابات وتسجيل الدخول ---
@app.post("/signup")
def signup(user: UserCreate):
    if len(user.username) < 4:
        raise HTTPException(status_code=400, detail="اسم المستخدم يجب أن يكون 4 خانات على الأقل")

    check_password_strength(user.password)

    conn = get_db_connection()
    cur = conn.cursor()
    try:
        cur.execute("SELECT username FROM users WHERE username = %s", (user.username,))
        if cur.fetchone():
            raise HTTPException(status_code=400, detail="اسم المستخدم هذا مأخوذ، اختر اسماً آخر")

        cur.execute("SELECT email FROM users WHERE email = %s", (user.email,))
        if cur.fetchone():
            raise HTTPException(status_code=400, detail="هذا البريد الإلكتروني مسجل لدينا بالفعل")

        hashed_pwd = pwd_context.hash(user.password)
        cur.execute(
            "INSERT INTO users (username, password, email, phone) VALUES (%s, %s, %s, %s)",
            (user.username, hashed_pwd, user.email, user.phone)
        )
        conn.commit()
        return {"status": "success", "message": "تم إنشاء الحساب بنجاح!"}
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail="حدث خطأ في السيرفر: " + str(e))
    finally:
        cur.close()
        conn.close()

@app.post("/login")
def login(user: UserLogin):
    conn = get_db_connection()
    cur = conn.cursor()
    try:
        cur.execute("SELECT id, username, password FROM users WHERE email = %s", (user.email,))
        user_data = cur.fetchone()

        if not user_data or not pwd_context.verify(user.password, user_data[2]):
            raise HTTPException(status_code=401, detail="الإيميل أو كلمة المرور غير صحيحة")

        return {
            "status": "success",
            "message": f"أهلاً بك يا {user_data[1]}",
            "user_id": user_data[0],
            "username": user_data[1]
        }
    finally:
        cur.close()
        conn.close()

@app.post("/update-profile")
def update_profile(data: UpdateProfile):
    conn = get_db_connection()
    cur = conn.cursor()
    try:
        cur.execute(
            "UPDATE users SET username = %s, phone = %s WHERE email = %s",
            (data.name, data.phone, data.email)
        )
        conn.commit()
        return {"message": "تم حفظ التغييرات!"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        cur.close()
        conn.close()

@app.post("/change-password")
def change_password(data: ChangePassword):
    conn = get_db_connection()
    cur = conn.cursor()
    try:
        cur.execute("SELECT password FROM users WHERE email = %s", (data.email,))
        user_data = cur.fetchone()

        if not user_data:
            raise HTTPException(status_code=404, detail="المستخدم غير موجود")

        if not pwd_context.verify(data.currentPassword, user_data[0]):
            raise HTTPException(status_code=401, detail="كلمة المرور الحالية غلط")

        check_password_strength(data.newPassword)

        hashed_new = pwd_context.hash(data.newPassword)
        cur.execute("UPDATE users SET password = %s WHERE email = %s", (hashed_new, data.email))
        conn.commit()
        return {"message": "تم تغيير كلمة المرور!"}
    except HTTPException as he:
        raise he
    finally:
        cur.close()
        conn.close()

@app.post("/upload-avatar")
async def upload_avatar(username: str, file: UploadFile = File(...)):
    conn = None
    cur = None
    try:
        upload_result = cloudinary.uploader.upload(file.file, folder="sofrah_avatars")
        image_url = upload_result.get("secure_url")

        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("UPDATE users SET avatar_url = %s WHERE username = %s", (image_url, username))
        conn.commit()
        return {"status": "success", "url": image_url}
    except Exception as e:
        return {"status": "error", "message": str(e)}
    finally:
        if cur: cur.close()
        if conn: conn.close()

# --- المفضلة ---
@app.post("/favorites/add")
def add_favorite(item: FavoriteItem):
    conn = get_db_connection()
    cur = conn.cursor()
    try:
        cur.execute(
            "INSERT INTO favorites (email, type, item_id, name, img) VALUES (%s, %s, %s, %s, %s) ON CONFLICT DO NOTHING",
            (item.email, item.type, item.id, item.name, item.img)
        )
        conn.commit()
        return {"status": "ok"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        cur.close()
        conn.close()

@app.get("/favorites/{email}")
def get_favorites(email: str):
    conn = get_db_connection()
    cur = conn.cursor()
    try:
        cur.execute("SELECT type, item_id, name, img FROM favorites WHERE email = %s", (email,))
        rows = cur.fetchall()
        result = {}
        for row in rows:
            t, item_id, name, img = row
            if t not in result:
                result[t] = []
            result[t].append({"id": item_id, "name": name, "img": img})
        return {"favorites": result}
    finally:
        cur.close()
        conn.close()

@app.delete("/favorites/remove")
def remove_favorite(item: RemoveFavorite):
    conn = get_db_connection()
    cur = conn.cursor()
    try:
        cur.execute(
            "DELETE FROM favorites WHERE email = %s AND type = %s AND item_id = %s",
            (item.email, item.type, item.id)
        )
        conn.commit()
        return {"status": "ok"}
    finally:
        cur.close()
        conn.close()

@app.get("/avatar/{email}")
def get_avatar(email: str):
    conn = get_db_connection()
    cur = conn.cursor()
    try:
        cur.execute("SELECT avatar_url FROM users WHERE email = %s", (email,))
        row = cur.fetchone()
        return {"avatar": row[0] if row and row[0] else ""}
    finally:
        cur.close()
        conn.close()

# --- الدول ---
@app.get("/countries")
def get_countries():
    conn = get_db_connection()
    cur = conn.cursor()
    try:
        cur.execute("""
            SELECT c.id, c.name, c.description, c.image_url, c.slug,
                   cont.name AS continent
            FROM countries c
            LEFT JOIN continents cont ON c.continent_id = cont.id
            ORDER BY c.name
        """)
        rows = cur.fetchall()
        return [
            {
                "id":          row[0],
                "name":        row[1],
                "description": row[2],
                "image_url":   row[3],
                "slug":        row[4],
                "continent":   row[5],
            }
            for row in rows
        ]
    finally:
        cur.close()
        conn.close()

# --- مدن الدولة ---
@app.get("/countries/{slug}/cities")
def get_cities_by_country(slug: str):
    conn = get_db_connection()
    cur = conn.cursor()
    try:
        # جلب الدولة بالـ slug
        cur.execute("SELECT id FROM countries WHERE slug = %s", (slug,))
        country_row = cur.fetchone()
        if not country_row:
            raise HTTPException(status_code=404, detail=f"الدولة '{slug}' غير موجودة")
        country_id = country_row[0]

        cur.execute("""
            SELECT id, slug, name, image_url, description,
                   historic, restaurants, cafes, events_list
            FROM cities
            WHERE country_id = %s
            ORDER BY name
        """, (country_id,))
        rows = cur.fetchall()
        return [
            {
                "id":          row[0],
                "slug":        row[1],
                "name":        row[2],
                "image_url":   row[3],
                "description": row[4],
                "historic":    row[5] or "",
                "restaurants": row[6] or "",
                "cafes":       row[7] or "",
                "events_list": row[8] or "",
            }
            for row in rows
        ]
    finally:
        cur.close()
        conn.close()

# --- الفعاليات ---
@app.get("/events")
def get_events():
    conn = get_db_connection()
    cur = conn.cursor()
    try:
        cur.execute("""
            SELECT e.id, e.title, e.category, e.description,
                   e.date_info, e.image_url,
                   c.name AS country
            FROM events e
            LEFT JOIN countries c ON e.country_id = c.id
            ORDER BY e.title
        """)
        rows = cur.fetchall()
        return [
            {
                "id":          row[0],
                "title":       row[1],
                "category":    row[2],
                "description": row[3],
                "date_info":   row[4],
                "image_url":   row[5],
                "country":     row[6],
            }
            for row in rows
        ]
    finally:
        cur.close()
        conn.close()

# --- الوصفات ---
@app.get("/recipes")
def get_recipes():
    conn = get_db_connection()
    cur = conn.cursor()
    try:
        cur.execute("""
            SELECT r.id, r.title, r.category, r.image_url,
                   c.name AS country
            FROM recipes r
            LEFT JOIN countries c ON r.country_id = c.id
            ORDER BY r.title
        """)
        rows = cur.fetchall()
        return [
            {
                "id":       row[0],
                "title":    row[1],
                "category": row[2],
                "image_url": row[3],
                "country":  row[4],
            }
            for row in rows
        ]
    finally:
        cur.close()
        conn.close()

# --- خدمة البريد ومعاينة القالب ---
@app.post("/api/send-otp")
async def send_otp(email: str, background_tasks: BackgroundTasks):
    verification_code = "849201"
    # استدعاء دالة الإرسال في الخلفية
    background_tasks.add_task(send_verification_email, email, verification_code)
    return {
        "status": "success",
        "message": f"تم إرسال كود التحقق إلى {email}"
    }

@app.get("/preview-email", response_class=HTMLResponse)
async def preview_email():
    rendered_html = get_rendered_template(code="849201")
    return HTMLResponse(content=rendered_html, status_code=200)

# --- مسار المساعدين الذكيين (AI Agents) ---
class ChatMessage(BaseModel):
    message: str
    agent_type: str = "chef"  # chef | guide | traveler
    user_email: Optional[str] = None

@app.post("/api/chat")
def chat_with_chef(chat: ChatMessage):
    try:
        reply, is_auth = ask_chef_agent(chat.message, chat.agent_type, chat.user_email)
        if not is_auth:
            return {"status": "unauthorized", "reply": reply}
        return {"status": "success", "reply": reply}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Agent error: {str(e)}")


# ─────────────────────────────────────────────────────────────────────────────
# Admin endpoints
# ─────────────────────────────────────────────────────────────────────────────

class AdminCheck(BaseModel):
    email: str

class ToggleCountry(BaseModel):
    id: str           # مثل: "saudi"
    ready: bool
    email: str        # للتحقق من صلاحية الأدمن

class SetCountryStatus(BaseModel):
    id: str
    status: str       # active | coming_soon | in_development
    email: str

class SetAdmin(BaseModel):
    email: str        # إيميل المستخدم المراد منحه صلاحية الأدمن
    admin_email: str  # إيميل الأدمن الحالي للتحقق من صلاحيته


@app.post("/admin/check")
def admin_check(data: AdminCheck):
    """يتحقق هل المستخدم أدمن — يرجع {"admin": true} أو 403"""
    conn = get_db_connection()
    cur = conn.cursor()
    try:
        cur.execute(
            "SELECT is_admin FROM users WHERE email = %s",
            (data.email,)
        )
        row = cur.fetchone()
        if not row or not row[0]:
            raise HTTPException(status_code=403, detail="ليس لديك صلاحية الوصول")
        return {"admin": True}
    finally:
        cur.close()
        conn.close()


@app.post("/admin/toggle-country")
def toggle_country(data: ToggleCountry):
    """يحدّث حالة ready لدولة في قاعدة البيانات"""
    # تحقق من صلاحية الأدمن
    conn = get_db_connection()
    cur = conn.cursor()
    try:
        cur.execute("SELECT is_admin FROM users WHERE email = %s", (data.email,))
        row = cur.fetchone()
        if not row or not row[0]:
            raise HTTPException(status_code=403, detail="ليس لديك صلاحية")

        # حدّث أو أضف override
        cur.execute("""
            INSERT INTO country_ready_overrides (country_id, is_ready, updated_by)
            VALUES (%s, %s, %s)
            ON CONFLICT (country_id) DO UPDATE
                SET is_ready   = EXCLUDED.is_ready,
                    updated_by = EXCLUDED.updated_by,
                    updated_at = NOW()
        """, (data.id, data.ready, data.email))
        conn.commit()
        return {"status": "success", "id": data.id, "ready": data.ready}
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cur.close()
        conn.close()


@app.post("/admin/set-country-status")
def set_country_status(data: SetCountryStatus):
    """يحدّث حالة الدولة — يدعم 3 حالات"""
    valid_statuses = ('active', 'coming_soon', 'in_development')
    if data.status not in valid_statuses:
        raise HTTPException(status_code=400, detail=f"حالة غير صحيحة — المسموح: {valid_statuses}")

    conn = get_db_connection()
    cur = conn.cursor()
    try:
        cur.execute("SELECT is_admin FROM users WHERE email = %s", (data.email,))
        row = cur.fetchone()
        if not row or not row[0]:
            raise HTTPException(status_code=403, detail="ليس لديك صلاحية")

        cur.execute("""
            INSERT INTO country_status (country_id, status, updated_by)
            VALUES (%s, %s, %s)
            ON CONFLICT (country_id) DO UPDATE
                SET status     = EXCLUDED.status,
                    updated_by = EXCLUDED.updated_by,
                    updated_at = NOW()
        """, (data.id, data.status, data.email))
        conn.commit()
        return {"status": "success", "id": data.id, "new_status": data.status}
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cur.close()
        conn.close()


@app.post("/admin/set-admin")
def set_admin(data: SetAdmin):
    """يمنح صلاحية الأدمن لمستخدم — محمي: يلزم أن يكون admin_email أدمناً"""
    conn = get_db_connection()
    cur = conn.cursor()
    try:
        # تحقق من صلاحية الطالب
        cur.execute("SELECT is_admin FROM users WHERE email = %s", (data.admin_email,))
        row = cur.fetchone()
        if not row or not row[0]:
            raise HTTPException(status_code=403, detail="ليس لديك صلاحية")

        # تحقق من وجود المستخدم المستهدف
        cur.execute("SELECT id FROM users WHERE email = %s", (data.email,))
        target = cur.fetchone()
        if not target:
            raise HTTPException(status_code=404, detail="المستخدم غير موجود")

        # امنحه صلاحية الأدمن
        cur.execute(
            "UPDATE users SET is_admin = TRUE WHERE email = %s",
            (data.email,)
        )
        conn.commit()
        return {"status": "success", "email": data.email}
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cur.close()
        conn.close()


@app.post("/admin/remove-admin")
def remove_admin(data: SetAdmin):
    """يسحب صلاحية الأدمن من مستخدم"""
    conn = get_db_connection()
    cur = conn.cursor()
    try:
        cur.execute("SELECT is_admin FROM users WHERE email = %s", (data.admin_email,))
        row = cur.fetchone()
        if not row or not row[0]:
            raise HTTPException(status_code=403, detail="ليس لديك صلاحية")
        cur.execute("SELECT id FROM users WHERE email = %s", (data.email,))
        if not cur.fetchone():
            raise HTTPException(status_code=404, detail="المستخدم غير موجود")
        cur.execute("UPDATE users SET is_admin = FALSE WHERE email = %s", (data.email,))
        conn.commit()
        return {"status": "success", "email": data.email}
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cur.close()
        conn.close()


@app.get("/admin/admins")
def list_admins(admin_email: str):
    """يرجع قائمة المستخدمين الأدمن"""
    conn = get_db_connection()
    cur = conn.cursor()
    try:
        cur.execute("SELECT is_admin FROM users WHERE email = %s", (admin_email,))
        row = cur.fetchone()
        if not row or not row[0]:
            raise HTTPException(status_code=403, detail="ليس لديك صلاحية")
        cur.execute("SELECT email, username FROM users WHERE is_admin = TRUE ORDER BY email")
        rows = cur.fetchall()
        return {"admins": [{"email": r[0], "username": r[1]} for r in rows]}
    finally:
        cur.close()
        conn.close()


@app.get("/country-states")
def get_country_states():
    """يرجع حالة كل الدول — يقرأ من country_status أولاً ثم country_ready_overrides"""
    conn = get_db_connection()
    cur = conn.cursor()
    try:
        result = {}
        # القديم للتوافق
        cur.execute("SELECT country_id, is_ready FROM country_ready_overrides")
        for row in cur.fetchall():
            result[row[0]] = 'active' if row[1] else 'coming_soon'
        # الجديد يغلب القديم
        cur.execute("SELECT country_id, status FROM country_status")
        for row in cur.fetchall():
            result[row[0]] = row[1]
        return result
    finally:
        cur.close()
        conn.close()

# ─────────────────────────────────────────────────────────────────────────────
# Content update endpoint
# ─────────────────────────────────────────────────────────────────────────────

import json as _json

class UpdateCard(BaseModel):
    type:        str          # country | event | recipe | city
    id:          str          # card id
    country_id:  Optional[str] = None
    continent:   Optional[str] = None
    fields:      dict         # الحقول المعدّلة
    admin_email: str


@app.patch("/admin/update-card")
def update_card(data: UpdateCard):
    """يحفظ تعديلات كرت في DB ويحاول تحديث الـ HTML file لو FRONTEND_PATH محدد"""
    valid_types = ('country', 'event', 'recipe', 'city')
    if data.type not in valid_types:
        raise HTTPException(status_code=400, detail=f"نوع غير صحيح — المسموح: {valid_types}")

    conn = get_db_connection()
    cur  = conn.cursor()
    try:
        # تحقق من صلاحية الأدمن
        cur.execute("SELECT is_admin FROM users WHERE email = %s", (data.admin_email,))
        row = cur.fetchone()
        if not row or not row[0]:
            raise HTTPException(status_code=403, detail="ليس لديك صلاحية")

        # احفظ في DB
        cur.execute("""
            INSERT INTO card_overrides (card_type, card_id, fields, updated_by)
            VALUES (%s, %s, %s, %s)
            ON CONFLICT (card_type, card_id) DO UPDATE
                SET fields     = card_overrides.fields || EXCLUDED.fields,
                    updated_by = EXCLUDED.updated_by,
                    updated_at = NOW()
        """, (data.type, data.id, _json.dumps(data.fields, ensure_ascii=False), data.admin_email))
        conn.commit()

        # حاول تحديث الـ HTML file لو FRONTEND_PATH متاح
        html_updated = False
        frontend_path = os.environ.get('FRONTEND_PATH', '')
        if frontend_path:
            html_updated = _update_html_file(frontend_path, data)

        return {
            "status": "success",
            "db_saved": True,
            "html_updated": html_updated,
            "type": data.type,
            "id": data.id
        }
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cur.close()
        conn.close()


def _update_html_file(frontend_path: str, data: UpdateCard) -> bool:
    """يحدث الـ data-* attributes في الملف HTML المناسب"""
    import re as _re

    try:
        # حدد الملف المستهدف
        if data.type == 'event':
            file_path = os.path.join(frontend_path, 'events', 'events.html')
        elif data.type == 'recipe':
            file_path = os.path.join(frontend_path, 'recipes', 'recipes.html')
        elif data.type == 'country':
            file_path = os.path.join(frontend_path, 'countries', 'countries.html')
        elif data.type == 'city':
            # المدن موجودة في صفحات الدول
            if not data.country_id or not data.continent:
                return False
            file_path = os.path.join(
                frontend_path, 'countries', 'country',
                data.continent, f'{data.country_id}.html'
            )
        else:
            return False

        if not os.path.exists(file_path):
            return False

        with open(file_path, encoding='utf-8') as f:
            html = f.read()

        fields = data.fields

        if data.type == 'event':
            # ابحث عن .event-item button بنفس id الـ card
            # id الكرت هو id على .event-card div
            card_id = data.id
            # استبدل data-title, data-img, data-desc, إلخ داخل الكرت
            def replace_event_attrs(m):
                block = m.group(0)
                attr_map = {
                    'name': 'data-title', 'img': 'data-img', 'desc': 'data-desc',
                    'date': 'data-date', 'location': 'data-location',
                    'duration': 'data-duration', 'weather': 'data-weather',
                    'airport': 'data-airport', 'activities': 'data-activities',
                    'hotelPrice': 'data-hotel-price', 'total': 'data-total'
                }
                for field_key, attr in attr_map.items():
                    if field_key in fields:
                        val = fields[field_key].replace('"', '&quot;')
                        block = _re.sub(
                            rf'{attr}="[^"]*"',
                            f'{attr}="{val}"',
                            block
                        )
                return block

            pattern = rf'<div class="event-card"[^>]*\bid="{_re.escape(card_id)}"[\s\S]*?</div>\s*</div>'
            html_new = _re.sub(pattern, replace_event_attrs, html)

        elif data.type == 'recipe':
            card_id = data.id

            def replace_recipe_attrs(m):
                block = m.group(0)
                attr_map = {
                    'name': 'data-title', 'img': 'data-img',
                    'ingredients': 'data-ingredients', 'spices': 'data-spices',
                    'sauces': 'data-sauces', 'steps': 'data-steps'
                }
                for field_key, attr in attr_map.items():
                    if field_key in fields:
                        val = fields[field_key].replace('"', '&quot;')
                        block = _re.sub(rf'{attr}="[^"]*"', f'{attr}="{val}"', block)
                if 'country' in fields:
                    val = fields['country'].replace('"', '&quot;')
                    block = _re.sub(r'data-country="[^"]*"', f'data-country="{val}"', block)
                return block

            pattern = rf'<div class="foods-card"[^>]*\bid="{_re.escape(card_id)}"[\s\S]*?</div>\s*</div>'
            html_new = _re.sub(pattern, replace_recipe_attrs, html)

        elif data.type == 'country':
            # countries.html — كرت الدولة
            def replace_country_card(m):
                block = m.group(0)
                if 'img' in fields:
                    block = _re.sub(r'<img src="[^"]+"', f'<img src="{fields["img"]}"', block, count=1)
                if 'name' in fields:
                    block = _re.sub(r'<h1>[^<]*</h1>', f'<h1>{fields["name"]}</h1>', block)
                return block

            pattern = rf'<div class="country-card[^"]*"[^>]*{_re.escape(data.id)}[^>]*>[\s\S]*?</div>\s*</div>'
            html_new = _re.sub(pattern, replace_country_card, html)

        elif data.type == 'city':
            city_name = data.fields.get('name') or data.id.split('__')[-1].replace('_', ' ')

            def replace_city_attrs(m):
                block = m.group(0)
                attr_map = {
                    'name': 'data-name', 'img': 'data-img', 'desc': 'data-desc',
                    'historic': 'data-historic', 'restaurants': 'data-restaurants',
                    'cafes': 'data-cafes', 'events': 'data-events'
                }
                for field_key, attr in attr_map.items():
                    if field_key in fields:
                        val = fields[field_key].replace('"', '&quot;')
                        block = _re.sub(rf'{attr}="[^"]*"', f'{attr}="{val}"', block)
                return block

            original_name = data.id.split('__')[-1].replace('_', ' ')
            pattern = rf'<div class="cite"[^>]*data-name="{_re.escape(original_name)}"[\s\S]*?</div>\s*</div>'
            html_new = _re.sub(pattern, replace_city_attrs, html)

        else:
            return False

        if html_new != html:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(html_new)
            return True
        return False

    except Exception:
        return False


@app.get("/card-overrides")
def get_card_overrides():
    """يرجع كل تعديلات الكروت المحفوظة"""
    conn = get_db_connection()
    cur  = conn.cursor()
    try:
        cur.execute("SELECT card_type, card_id, fields FROM card_overrides")
        rows = cur.fetchall()
        result = {}
        for row in rows:
            card_type, card_id, fields = row
            if card_type not in result:
                result[card_type] = {}
            result[card_type][card_id] = fields
        return result
    finally:
        cur.close()
        conn.close()
