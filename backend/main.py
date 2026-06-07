from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import psycopg2
from passlib.context import CryptContext
from fastapi.middleware.cors import CORSMiddleware
import re
from typing import Optional
import os
import cloudinary
import cloudinary.uploader
from fastapi import UploadFile, File

app = FastAPI()

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


# --- إنشاء جدول المفضلة عند التشغيل ---
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
        )
    """)
    conn.commit()
    cur.close()
    conn.close()


# --- العمليات (Endpoints) ---

@app.post("/signup")
def signup(user: UserCreate):
    if len(user.username) < 4:
        raise HTTPException(status_code=400, detail="اسم المستخدم يجب أن يكون 4 خانات على الأقل")

    password_pattern = r"^[A-Z][a-zA-Z0-9]*[0-9][a-zA-Z0-9]*$"
    if not re.match(password_pattern, user.password):
        raise HTTPException(status_code=400, detail="كلمة المرور يجب أن تبدأ بحرف كبير وتحتوي على رقم")

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

        password_pattern = r"^[A-Z][a-zA-Z0-9]*[0-9][a-zA-Z0-9]*$"
        if not re.match(password_pattern, data.newPassword):
            raise HTTPException(status_code=400, detail="كلمة المرور الجديدة ضعيفة")

        hashed_new = pwd_context.hash(data.newPassword)
        cur.execute("UPDATE users SET password = %s WHERE email = %s", (hashed_new, data.email))
        conn.commit()
        return {"message": "تم تغيير كلمة المرور!"}
    finally:
        cur.close()
        conn.close()


@app.post("/upload-avatar")
async def upload_avatar(username: str, file: UploadFile = File(...)):
    try:
        upload_result = cloudinary.uploader.upload(file.file, folder="sofrah_avatars")
        image_url = upload_result.get("secure_url")

        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("UPDATE users SET avatar_url = %s WHERE username = %s", (image_url, username))
        conn.commit()
        cur.close()
        conn.close()

        return {"status": "success", "url": image_url}

    except Exception as e:
        return {"status": "error", "message": str(e)}


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