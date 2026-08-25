import os
import json
import psycopg2
from google import genai
from dotenv import load_dotenv

load_dotenv()

# تهيئة الاتصال بـ Gemini
api_key = os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key=api_key) if api_key else None

def get_db_connection():
    db_url = os.environ.get('DATABASE_URL')
    if not db_url:
        db_url = "postgresql://prostorge:e2g1E1i4ySRy768iEyks7eD25RAhp6Qv@dpg-d7gj4lpkh4rs739a6ff0-a.oregon-postgres.render.com/sofrah_web"
    return psycopg2.connect(db_url)

def get_context_recipes(query_text: str) -> str:
    """جلب سياق من الوصفات لدعم الشيف بالبيانات."""
    conn = None
    cur = None
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        sql = """
            SELECT name, country, description, prep_time 
            FROM recipes 
            WHERE ingredients ILIKE %s OR name ILIKE %s 
            LIMIT 4;
        """
        search = f"%{query_text}%"
        cur.execute(sql, (search, search))
        rows = cur.fetchall()
        if not rows:
            return ""
        return "\n".join([f"- وصفة {r[0]} ({r[1]}): {r[2]} (وقت التحضير: {r[3]})" for r in rows])
    except Exception:
        return ""
    finally:
        if cur: cur.close()
        if conn: conn.close()

def ask_chef_agent(user_message: str) -> str:
    if not client:
        return "عذراً، خدمة الذكاء الاصطناعي غير متصلة حالياً. يرجى التحقق من المفتاح."
    
    # جلب سياق من قاعدة البيانات إن وجد
    db_context = get_context_recipes(user_message)
    context_note = f"\nمعلومات من قاعدة بيانات سُفرة قد تفيدك:\n{db_context}" if db_context else ""

    prompt = f"""
    أنت 'شيف سُفرة' المساعد الذكي الخبير بالطبخ والفعاليات في منصة سُفرة.
    تحدث بلهجة عربية دافئة، ودودة ومحترفة، واقترح أفكاراً شهية وسريعة.
    {context_note}

    سؤال المستخدم: {user_message}
    """

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )
    return response.text