import os
import psycopg2
from psycopg2.extras import RealDictCursor
from google import genai
from dotenv import load_dotenv

load_dotenv()

def get_db_connection():
    db_url = os.environ.get('DATABASE_URL')
    if not db_url:
        db_url = "postgresql://prostorge:e2g1E1i4ySRy768iEyks7eD25RAhp6Qv@dpg-d7gj4lpkh4rs739a6ff0-a.oregon-postgres.render.com/sofrah_web"
    return psycopg2.connect(db_url)

def fetch_table_data(table_name: str, limit: int = 15):
    """جلب بيانات أي جدول بأمان لتحميلها في سياق الذكاء الاصطناعي"""
    conn = None
    cur = None
    try:
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        cur.execute(f"SELECT * FROM {table_name} LIMIT %s;", (limit,))
        rows = cur.fetchall()
        if not rows:
            return ""
        items_list = []
        for r in rows:
            clean_item = {k: v for k, v in r.items() if v is not None and k not in ['id', 'image_url', 'created_at']}
            items_list.append(str(clean_item))
        return "\n".join(items_list)
    except Exception as e:
        print(f"Error fetching from {table_name}: {e}")
        return ""
    finally:
        if cur: cur.close()
        if conn: conn.close()

def ask_chef_agent(user_message: str, agent_type: str = "chef") -> str:
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        return "المفتاح غير معرّف بالسيرفر."

    client = genai.Client(api_key=api_key)

    if agent_type == "guide":
        context_data = fetch_table_data("events", limit=15)
        system_role = (
            "أنت 'مرشد سُفرة 🎟️'، المرشد السياحي والمنظم الخبير بكافة الفعاليات، التذاكر، والمناسبات في منصة سُفرة. "
            "مهامك:\n"
            "1. مساعدة المستخدم في معرفة مواعيد وأماكن وأسعار الفعاليات.\n"
            "2. اقتراح فعاليات تناسب ميزانيته ووقته.\n"
            "3. التحدث بلهجة عربية حماسية ومرحبة كمرشد سياحي ممتع."
        )
    elif agent_type == "traveler":
        # قراءة بيانات الدول والمدن
        context_data = fetch_table_data("countries", limit=20)
        system_role = (
            "أنت 'رحّال سُفرة 🧭'، المستكشف والخبير بالدول، القارات، الثقافات، والمطابخ العالمية في منصة سُفرة. "
            "مهامك:\n"
            "1. إرشاد المستخدم عن عادات وتقاليد وأشهر معالم ومأكولات الدول والمدن.\n"
            "2. تقديم نصائح للسياحة الثقافية وتجربة نكهات العالم.\n"
            "3. التحدث بأسلوب مغامر، مشوق، وودود بلهجة عربية جذابة."
        )
    else:  # chef
        context_data = fetch_table_data("recipes", limit=15)
        system_role = (
            "أنت 'شيف سُفرة 👨‍🍳'، المساعد الذكي الخبير بالطبخ ووصفات المطبخ في منصة سُفرة. "
            "مهامك:\n"
            "1. مساعدة المستخدم في إيجاد وصفات بمكوناته المتوفرة.\n"
            "2. تقديم أسرار الطبخ وبدائل المكونات.\n"
            "3. التحدث بلهجة عربية دافئة وودودة ومحترفة."
        )

    prompt = f"""
    {system_role}

    بيانات حية من منصة سُفرة للاستئناس بها:
    {context_data}

    سؤال المستخدم: {user_message}
    """

    try:
        response = client.models.generate_content(
            model="gemini-3.6-flash",
            contents=prompt
        )
        return response.text
    except Exception as e:
        return f"حصل خطأ أثناء تحضير الرد: {str(e)}"