from fastapi import FastAPI, HTTPException, UploadFile, File
from pydantic import BaseModel
import psycopg2
from passlib.context import CryptContext
from fastapi.middleware.cors import CORSMiddleware
import re
from typing import Optional
import os
import cloudinary
import cloudinary.uploader

app = FastAPI()

# إعدادات كلاوديناري - يسحبها تلقائياً من الـ Environment Variables في رندر
cloudinary.config(
    cloud_name = os.environ.get('CLOUDINARY_CLOUD_NAME'),
    api_key = os.environ.get('CLOUDINARY_API_KEY'),
    api_secret = os.environ.get('CLOUDINARY_API_SECRET')
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
    # يقرأ رابط الداتابيس السحابية من رندر، وإذا لم يجدها يستخدم الرابط الافتراضي
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
    # type: نوع العنصر المحفوظ — 'plan' | 'country' | 'city' | 'event' | 'recipe'
    # (الحقل نصي حر بدون قائمة مغلقة، فأي نوع جديد مدعوم تلقائياً)
    email: str
    type: str
    id: str
    name: str
    img: str

class RemoveFavorite(BaseModel):
    email: str
    type: str
    id: str


# --- دالة فحص قوة كلمة المرور بالشروط الجديدة ---
def check_password_strength(password: str):
    if len(password) < 8:
        raise HTTPException(status_code=400, detail="كلمة المرور يجب أن تكون 8 خانات على الأقل")
    if not re.search(r'[A-Z]', password):
        raise HTTPException(status_code=400, detail="كلمة المرور يجب أن تحتوي على حرف كبير واحد على الأقل (A-Z)")
    if not re.search(r'[a-z]', password):
        raise HTTPException(status_code=400, detail="كلمة المرور يجب أن تحتوي على حرف صغير واحد على الأقل (a-z)")
    if not re.search(r'[0-9]', password):
        raise HTTPException(status_code=400, detail="كلمة المرور يجب أن تحتوي على رقم واحد على الأقل (0-9)")


# --- إنشاء جدول المفضلة وتأكيد جدول المستخدمين عند التشغيل ---
@app.on_event("startup")
def create_tables():
    conn = get_db_connection()
    cur = conn.cursor()
    # جدول المفضلة
    cur.execute("""
        CREATE TABLE IF NOT EXISTS favorites (
            id SERIAL PRIMARY KEY,
            email TEXT NOT NULL,
            type TEXT NOT NULL,
            item_id TEXT NOT NULL,
            name TEXT NOT NULL,
            img TEXT NOT NULL,
            UNIQUE(email, type, item_id)
        )
    """)
    # التأكد من وجود عمود avatar_url في جدول المستخدمين
    cur.execute("""
        ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url TEXT;
    """)
    conn.commit()
    cur.close()
    conn.close()


# --- العمليات (Endpoints) ---

@app.post("/signup")
def signup(user: UserCreate):
    if len(user.username) < 4:
        raise HTTPException(status_code=400, detail="اسم المستخدم يجب أن يكون 4 خانات على الأقل")

    # تطبيق الفحص المطور الجديد (طول 8، كبير، صغير، رقم)
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
        # إعادة توجيه أخطاء الباسوورد لتصل للفرونت اند كـ detail
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

        # تطبيق الفحص المطور الجديد عند تغيير الباسوورد أيضاً
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
        # 1. رفع الصورة لـ Cloudinary في مجلد خاص
        upload_result = cloudinary.uploader.upload(file.file, folder="sofrah_avatars")
        image_url = upload_result.get("secure_url")

        # 2. تحديث رابط الصورة في جدول الـ users
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


# --- الصورة الشخصية ---

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