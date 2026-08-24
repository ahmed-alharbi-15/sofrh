import os
import resend

# 1. مفتاح الـ API الخاص بـ Resend (يمكنك وضع المفتاح المؤقت للتجربة هنا أو في ملف .env)
RESEND_API_KEY = os.getenv("RESEND_API_KEY", "re_123456789_your_key_here")
resend.api_key = RESEND_API_KEY

def get_rendered_template(code: str, logo_url: str = "https://via.placeholder.com/150") -> str:
    """
    دالة لقراءة ملف HTML واستبدال الرمز ورابط الشعار
    """
    base_dir = os.path.dirname(os.path.abspath(__file__))
    template_path = os.path.join(base_dir, "email_template.html")
    
    with open(template_path, "r", encoding="utf-8") as file:
        html_content = file.read()
    
    # استبدال الرموز المتغيرة داخل القالب
    html_content = html_content.replace("{{ verification_code }}", code)
    html_content = html_content.replace("{{ logo_url }}", logo_url)
    
    return html_content


async def send_verification_email(email_to: str, code: str):
    """
    دالة إرسال الإيميل للمستخدم
    """
    # تجهيز محتوى الـ HTML بعد وضع الرمز
    html_body = get_rendered_template(code=code)
    
    # تجهيز بيانات الرسالة
    params = {
        "from": "سُفرة <onboarding@resend.dev>",  # الإيميل التجريبي المجاني من Resend
        "to": [email_to],
        "subject": "رمز التحقق الخاص بك - سُفرة",
        "html": html_body,
    }
    
    # إرسال الرسالة عبر Resend
    try:
        response = resend.Emails.send(params)
        return {"success": True, "data": response}
    except Exception as e:
        print(f"Error sending email: {e}")
        return {"success": False, "error": str(e)}