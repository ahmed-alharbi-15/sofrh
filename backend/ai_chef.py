import os
import json
import psycopg2
from google import genai
from google.genai import types
from dotenv import load_dotenv

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

def get_db_connection():
    db_url = os.environ.get('DATABASE_URL')
    if not db_url:
        db_url = "postgresql://prostorge:e2g1E1i4ySRy768iEyks7eD25RAhp6Qv@dpg-d7gj4lpkh4rs739a6ff0-a.oregon-postgres.render.com/sofrah_web"
    return psycopg2.connect(db_url)

def search_recipes_by_ingredient(ingredient: str) -> str:
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
            return json.dumps({"message": f"لم يتم العثور على وصفات تحتوي على {ingredient}"}, ensure_ascii=False)
        
        recipes_data = [
            {
                "id": r[0],
                "name": r[1],
                "country": r[2],
                "description": r[3],
                "prep_time": r[4]
            }
            for r in rows
        ]
        return json.dumps(recipes_data, ensure_ascii=False)
    except Exception as e:
        return json.dumps({"error": str(e)}, ensure_ascii=False)
    finally:
        if cur: cur.close()
        if conn: conn.close()

def get_upcoming_events() -> str:
    conn = None
    cur = None
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        query = "SELECT id, title, date, location, price FROM events LIMIT 5;"
        cur.execute(query)
        rows = cur.fetchall()
        
        if not rows:
            return json.dumps({"message": "لا توجد فعاليات مسجلة حالياً"}, ensure_ascii=False)
        
        events_data = [
            {
                "id": r[0],
                "title": r[1],
                "date": str(r[2]),
                "location": r[3],
                "price": r[4]
            }
            for r in rows
        ]
        return json.dumps(events_data, ensure_ascii=False)
    except Exception as e:
        return json.dumps({"error": str(e)}, ensure_ascii=False)
    finally:
        if cur: cur.close()
        if conn: conn.close()

tools_map = {
    "search_recipes_by_ingredient": search_recipes_by_ingredient,
    "get_upcoming_events": get_upcoming_events
}

def ask_chef_agent(user_message: str) -> str:
    system_instruction = """
    أنت 'شيف سُفرة'، المساعد الذكي الخبير بالطبخ العربي والعالمي والفعاليات في منصة سُفرة.
    مهامك:
    1. مساعدة المستخدم في إيجاد وصفات تناسب المكونات المتوفرة لديه عبر قاعدة البيانات.
    2. إرشاد المستخدم إلى الفعاليات والمناسبات المناسبة لاهتماماته.
    3. التحدث بأسلوب دافئ، مشجع، محترف وباللغة العربية.
    إذا طلب المستخدم وصفات بمكونات محددة أو فعاليات، استخدم الأدوات المتاحة لجلب بيانات دقيقة من النظام.
    """
    
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=user_message,
        config=types.GenerateContentConfig(
            system_instruction=system_instruction,
            tools=[search_recipes_by_ingredient, get_upcoming_events],
            temperature=0.7
        )
    )
    
    if response.function_calls:
        function_call = response.function_calls[0]
        tool_name = function_call.name
        tool_args = function_call.args
        
        if tool_name in tools_map:
            tool_output = tools_map[tool_name](**tool_args)
            
            final_response = client.models.generate_content(
                model="gemini-2.5-flash",
                contents=[
                    types.Content(role="user", parts=[types.Part.from_text(text=user_message)]),
                    types.Content(role="model", parts=[types.Part.from_function_call(name=tool_name, args=tool_args)]),
                    types.Content(role="user", parts=[
                        types.Part.from_function_response(
                            name=tool_name,
                            response={"result": tool_output}
                        )
                    ])
                ],
                config=types.GenerateContentConfig(
                    system_instruction=system_instruction
                )
            )
            return final_response.text

    return response.text