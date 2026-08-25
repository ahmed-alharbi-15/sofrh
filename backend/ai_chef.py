import os
import json
import psycopg2
from google import genai
from dotenv import load_dotenv

load_dotenv()

def get_db_connection():
    db_url = os.environ.get('DATABASE_URL')
    if not db_url:
        db_url = "postgresql://prostorge:e2g1E1i4ySRy768iEyks7eD25RAhp6Qv@dpg-d7gj4lpkh4rs739a6ff0-a.oregon-postgres.render.com/sofrah_web"
    return psycopg2.connect(db_url)

def fetch_db_recipes():
    """جلب الوصفات من قاعدة البيانات بأمان"""
    conn = None
    cur = None
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        
        # استعلام آمن بدون تحديد أسماء أعمدة قد تكون غير متطابقة
        cur.execute("SELECT * FROM recipes LIMIT 10;")
        rows = cur.fetchall()
        
        if not rows:
            return "لا توجد وصفات مسجلة حالياً."
            
        # تحويل الصفوف إلى نصوص واضحة
        recipes_list = [f"- {str(r)}" for r in rows]
        return "\n".join(recipes_list)
    except Exception as e:
        print(f"Database query error: {e}")
        return ""
    finally:
        if cur: cur.close()
        if conn: conn.close()

def ask_chef_agent(user_message: str) -> str:
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        return "المفتاح غير معرّف بالسيرفر."
    
    recipes_context = fetch_db_recipes()
    client = genai.Client(api_key=api_key)
    
    prompt = f"""
    أنت 'شيف سُفرة'، المساعد الذكي الخبير بالطبخ العربي والعالمي في منصة سُفرة.
    مهمتك مساعدة المستخدم واقتراح وصفات لذيذة والتحدث معه بلهجة عربية دافئة وودودة.

    بيانات من منصة سُفرة:
    {recipes_context}

    رسالة المستخدم: {user_message}
    """
    
    try:
        response = client.models.generate_content(
            model="gemini-3.6-flash",
            contents=prompt
        )
        return response.text
    except Exception as e:
        print(f"Gemini API Error: {e}")
        return f"حصل خطأ أثناء تحضير الرد: {str(e)}"