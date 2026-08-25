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

def fetch_db_recipes(query_text: str):
    """البحث المباشر في قاعدة البيانات عن الوصفات المناسبة"""
    conn = None
    cur = None
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        
        # استخراج عينة من الوصفات أو البحث بالكلمة
        sql = """
            SELECT name, country, description, prep_time 
            FROM recipes 
            LIMIT 15;
        """
        cur.execute(sql)
        rows = cur.fetchall()
        
        if not rows:
            return "لا توجد وصفات مسجلة حالياً."
            
        recipes_list = []
        for r in rows:
            name = r[0] if len(r) > 0 else ""
            country = r[1] if len(r) > 1 else ""
            desc = r[2] if len(r) > 2 else ""
            recipes_list.append(f"- وصفة: {name} (الدولة: {country}) | التفاصيل: {desc}")
            
        return "\n".join(recipes_list)
    except Exception as e:
        print(f"Database Error: {e}")
        return ""
    finally:
        if cur: cur.close()
        if conn: conn.close()

def ask_chef_agent(user_message: str) -> str:
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        return "المفتاح غير معرّف بالسيرفر."
    
    # 1. الاتصال المباشر بقاعدة البيانات وجلب الوصفات الموجودة فيها
    recipes_context = fetch_db_recipes(user_message)
    
    # 2. تجهيز العميل والموديل
    client = genai.Client(api_key=api_key)
    
    prompt = f"""
    أنت 'شيف سُفرة'، المساعد الذكي الخبير والمرح في منصة سُفرة.
    مهمتك: مساعدة المستخدم واقتراح وصفات شهية تناسب سؤاله بالاعتماد على قاعدة بيانات سُفرة التالية:

    قائمة وصفات سُفرة من قاعدة البيانات:
    {recipes_context}

    توجيهات الرد:
    - تحدث بلهجة عربية لطيفة ودافئة كشيف محترف.
    - إذا سأل عن وصفة أو مكونات، اقترح عليه من الوصفات الموجودة بالقائمة أعلاه واشرح له الفكرة.
    - إذا كان كلامه عاماً أو ترحيباً (مثل: هلا، كيف حالك)، رحب به وعرّف بنفسك وما يمكنك مساعدته به.

    رسالة المستخدم: {user_message}
    """
    
    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )
        return response.text
    except Exception as e:
        print(f"Gemini API Error: {e}")
        return f"حصل خطأ أثناء استدعاء الذكاء الاصطناعي: {str(e)}"