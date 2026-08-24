import os
import json
from google import genai
from google.genai import types
from dotenv import load_dotenv

# دعم الاستيراد المحلي وعلى السيرفر
try:
    from database import SessionLocal
    from models import Recipe, Event
except ModuleNotFoundError:
    from backend.database import SessionLocal
    from backend.models import Recipe, Event

load_dotenv()

# تهيئة عميل Gemini
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

# --- أدوات فحص قاعدة البيانات (Tools) ---

def search_recipes_by_ingredient(ingredient: str) -> str:
    """ابحث عن الوصفات التي تحتوي على مكون معين أو كلمة مفتاحية."""
    db = SessionLocal()
    try:
        results = db.query(Recipe).filter(
            (Recipe.ingredients.ilike(f"%{ingredient}%")) |
            (Recipe.name.ilike(f"%{ingredient}%"))
        ).limit(5).all()
        
        if not results:
            return json.dumps({"message": f"لم يتم العثور على وصفات تحتوي على {ingredient}"}, ensure_ascii=False)
        
        recipes_data = [
            {
                "id": r.id,
                "name": r.name,
                "country": r.country,
                "description": r.description,
                "prep_time": r.prep_time
            }
            for r in results
        ]
        return json.dumps(recipes_data, ensure_ascii=False)
    finally:
        db.close()


def get_upcoming_events() -> str:
    """استخرج قائمة الفعاليات والمناسبات المتاحة وتفاصيلها."""
    db = SessionLocal()
    try:
        results = db.query(Event).limit(5).all()
        if not results:
            return json.dumps({"message": "لا توجد فعاليات مسجلة حالياً"}, ensure_ascii=False)
        
        events_data = [
            {
                "id": e.id,
                "title": e.title,
                "date": str(e.date),
                "location": e.location,
                "price": e.price
            }
            for e in results
        ]
        return json.dumps(events_data, ensure_ascii=False)
    finally:
        db.close()


# خريطة تنفيذ الدوال للأدوات
tools_map = {
    "search_recipes_by_ingredient": search_recipes_by_ingredient,
    "get_upcoming_events": get_upcoming_events
}

# --- دالة المحادثة مع الإيجنت ---

def ask_chef_agent(user_message: str) -> str:
    """معالجة رسالة المستخدم واستدعاء الأدوات والتوليد الذكي."""
    
    system_instruction = """
    أنت 'شيف سُفرة'، المساعد الذكي الخبير بالطبخ العربي والعالمي والفعاليات في منصة سُفرة.
    مهامك:
    1. مساعدة المستخدم في إيجاد وصفات تناسب المكونات المتوفرة لديه عبر قاعدة البيانات.
    2. إرشاد المستخدم إلى الفعاليات والمناسبات المناسبة لاهتماماته.
    3. التحدث بأسلوب دافئ، مشجع، محترف وباللغة العربية.
    إذا طلب المستخدم وصفات بمكونات محددة أو فعاليات، استخدم الأدوات المتاحة لجلب بيانات دقيقة من النظام.
    """
    
    # استدعاء النموذج مع تمرير الأدوات
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=user_message,
        config=types.GenerateContentConfig(
            system_instruction=system_instruction,
            tools=[search_recipes_by_ingredient, get_upcoming_events],
            temperature=0.7
        )
    )
    
    # فحص ما إذا طلب النموذج تنفيذ أداة
    if response.function_calls:
        function_call = response.function_calls[0]
        tool_name = function_call.name
        tool_args = function_call.args
        
        # تشغيل الأداة المطلوبة
        if tool_name in tools_map:
            tool_output = tools_map[tool_name](**tool_args)
            
            # إرسال نتيجة الأداة للنموذج لصياغة الرد النهائي
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