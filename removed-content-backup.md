# Removed Content Backup

> ملاحظة: لم تُحذف أي كروت HTML من ملفات الدولة أو الوصفات — الـ working tree كان نظيفاً (لا تغييرات بعد آخر commit في HTML).

---

## الإصلاحات المُنجزة

### 1. حذف كود JavaScript يعرض محتوى من API

| الملف | الدالة | الأسطر المحذوفة |
|-------|--------|-----------------|
| `frontend/countries/countries.js` | `appendApiContent()` IIFE | 425–511 |
| `frontend/events/events.js` | `appendApiEvents()` IIFE + comment | 167–214 |
| `frontend/index/index.js` | `appendApiHomeContent()` IIFE | 577–640 |

**السبب:** هذه الـ IIFEs كانت تجلب بيانات من API (`/events`, `/recipes`, `/countries/{slug}/cities`) وتضيفها ككروت في الصفحات، رغم أن هذه البيانات مستوردة من ملفات HTML نفسها (عبر db_agent.py) ولم تُضَف فعلياً من لوحة الأدمن. لا توجد حتى الآن endpoints لإضافة محتوى جديد عبر الأدمن، لذا لا يوجد محتوى حقيقي لعرضه من API.

---

### 2. إصلاح تعارض ID في events.html

| الصفحة | الحقل | القيمة القديمة | القيمة الجديدة |
|--------|-------|---------------|--------------|
| `frontend/events/events.html` (السطر 22127) | `id` | `IntiRaymi` | `IntiRaymiEcuador` |
| `frontend/events/events.html` (السطر 22148) | `saveItem` | `'IntiRaymi'` | `'IntiRaymiEcuador'` |

**السبب:** كرتان بنفس الـ `id="IntiRaymi"` — الأول مهرجان بيرو (السطر 1835) والثاني مهرجان الإكوادور (السطر 22127). أُبقي الكرتان وأُعيدت تسمية الإكوادور لتجنب تعارض الـ ID وضمان عمل الـ deep link لكل منهما.

---

## ملفات HTML التي لم تتغير

- لا يوجد أي كرت مدينة أو أكلة أو فعالية أُضيف إلى HTML بعد آخر commit.
- جميع كروت صفحات الدول موجودة في HEAD.
