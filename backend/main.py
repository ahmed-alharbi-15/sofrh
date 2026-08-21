from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import psycopg2
from passlib.context import CryptContext
from fastapi.middleware.cors import CORSMiddleware
import re
from typing import Optional
from fastapi.middleware.cors import CORSMiddleware
import os
import cloudinary
import cloudinary.uploader
from fastapi import UploadFile, File

app = FastAPI()

# إعدادات كلاوديناري - يسحبها تلقائياً من الـ Environment Variables اللي حطيناها في رندر
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
    # الرابط اللي أعطيتني إياه نحطه هنا كمتغير واحد
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

# --- العمليات (Endpoints) ---

@app.post("/signup")
def signup(user: UserCreate):
    # 1. التحقق من طول اسم المستخدم وشروط كلمة المرور (موجودة سابقاً)
    if len(user.username) < 4:
        raise HTTPException(status_code=400, detail="اسم المستخدم يجب أن يكون 4 خانات على الأقل")

    password_pattern = r"^[A-Z][a-zA-Z0-9]*[0-9][a-zA-Z0-9]*$"
    if not re.match(password_pattern, user.password):
        raise HTTPException(status_code=400, detail="كلمة المرور يجب أن تبدأ بحرف كبير وتحتوي على رقم")

    conn = get_db_connection()
    cur = conn.cursor()
    try:
        # 2. التحقق من وجود اسم المستخدم مسبقاً
        cur.execute("SELECT username FROM users WHERE username = %s", (user.username,))
        if cur.fetchone():
            raise HTTPException(status_code=400, detail="اسم المستخدم هذا مأخوذ، اختر اسماً آخر")

        # 3. التحقق من وجود البريد الإلكتروني مسبقاً
        cur.execute("SELECT email FROM users WHERE email = %s", (user.email,))
        if cur.fetchone():
            raise HTTPException(status_code=400, detail="هذا البريد الإلكتروني مسجل لدينا بالفعل")

        # 4. إذا لم يوجد تكرار، نقوم بالتشفير والإضافة
        hashed_pwd = pwd_context.hash(user.password)
        cur.execute(
            "INSERT INTO users (username, password, email, phone) VALUES (%s, %s, %s, %s)",
            (user.username, hashed_pwd, user.email, user.phone)
        )
        conn.commit()
        return {"status": "success", "message": "تم إنشاء الحساب بنجاح!"}

    except Exception as e:
        # في حال وجود أي خطأ غير متوقع
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

        # التحقق من الشروط أولاً
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
        # 1. إرسال الصورة للسحاب (في مجلد خاص بمشروع سفرة)  
        upload_result = cloudinary.uploader.upload(file.file, folder="sofrah_avatars")
        
        # 2. استخراج الرابط المباشر للصورة
        image_url = upload_result.get("secure_url")

        # 3. حفظ الرابط في الداتابيس للمستخدم المعني
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("UPDATE users SET avatar_url = %s WHERE username = %s", (image_url, username))
        conn.commit()
        cur.close()
        conn.close()

        return {"status": "success", "url": image_url}

    except Exception as e:
        return {"status": "error", "message": str(e)}   