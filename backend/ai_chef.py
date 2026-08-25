import os
import json
import psycopg2
from google import genai
from dotenv import load_dotenv

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

def get_db_connection():
    db_url = os.environ.get('DATABASE_URL')
    if not db_url:
        db_url = "postgresql://prostorge:e2g1E1i4ySRy768iEyks7eD25RAhp6Qv@dpg-d7gj4lpkh4rs739a6ff0-a.oregon-postgres.render.com/sofrah_web"
    return psycopg2.connect(db_url)

def search_recipes_by_ingredient(ingredient: str) -> str:
    """ابحث عن الوصفات التي تحتوي على مكون معين أو كلمة مفتاحية."""
    conn = None
    cur = None
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        query = """
            SELECT id, name, country, description, prep_time 
            FROM recipes 
            WHERE ingredients ILIKE %s OR name ILIKE %s 
            LIMIT 5;
        """
        search_term = f"%{ingredient}%"
        cur.execute(query, (search_term, search_term))
        rows = cur.fetchall()
        
        if not rows:
            return f"لم يتم العثور على وصفات تحتوي على {ingredient}"
        
        recipes_data = [
            {"id": r[0], "name": r[1], "country": r[2], "description": r[3], "prep_time": r[4]}
            for r in rows
        ]
        return json.dumps(recipes_data, ensure_ascii=False)
    except Exception as e:
        return f"Error: {str(e)}"
    finally:
        if cur: cur.close()
        if conn: conn.close()

def get_upcoming_events() -> str:
    """استخرج قائمة الفعاليات والمناسبات المتاحة وتفاصيلها."""
    conn = None
    cur = None
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        query = "SELECT id, title, date, location, price FROM events LIMIT 5;"
        cur.execute(query)
        rows = cur.fetchall()
        
        if not rows:
            return "لا توجد فعاليات مسجلة حالياً"
        
        events_data = [
            {"id": r[0], "title": r[1], "date": str(r[2]), "location": r[3], "price": r[4]}
            for r in rows
        ]
        return json.dumps(events_data, ensure_ascii=False)
    except Exception as e:
        return f"Error: {str(e)}"
    finally:
        if cur: cur.close()
        if conn: conn.close()

def ask_chef_agent(user_message: str) -> str:
    system_instruction = (
        "أنت 'شيف سُفرة'، المساعد الذكي الخبير بالطبخ العربي والعالمي والفعاليات في منصة سُفرة. "
        "مهامك:\n"
        "1. مساعدة المستخدم في إيجاد وصفات تناسب المكونات المتوفرة لديه عبر قاعدة البيانات.\n"
        "2. إرشاد المستخدم إلى الفعاليات والمناسبات المتاحة.\n"
        "3. التحدث بأسلوب دافئ، مشجع، محترف وباللغة العربية.\n"
        "استخدم الأدوات المتاحة للبحث في قاعدة البيانات عند الحاجة."
    )
    
    chat = client.chats.create(
        model="gemini-2.5-flash",
        config={
            "system_instruction": system_instruction,
            "tools": [search_recipes_by_ingredient, get_upcoming_events],
            "temperature": 0.7,
        }
    )
    
    response = chat.send_message(user_message)
    return response.text