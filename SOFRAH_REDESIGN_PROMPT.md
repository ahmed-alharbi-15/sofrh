# مهمة: تطبيق التصميم الجديد لسفرة على الموقع (بدون تغيير ترتيب الأقسام)

انسخ هذا الملف كامل والصقه في Claude Code وانت داخل مجلد المشروع `sofrh-main`.

مرجع التصميم المعتمد (للنظر فقط): https://claude.ai/artifact/8uLHnERfFWeP1Biqi1MEQr
اقرأ `CLAUDE.md` أول قبل أي تعديل.

---

## 0) قبل البدء (إلزامي)

1. شغّل `git status` و `git pull origin main`. نسختي المحلية كانت ورا GitHub بـ 18 commit من شريكي nasos187، لا تشتغل على نسخة قديمة.
2. أنشئ فرع: `git checkout -b redesign-v2`.
3. لا تسوي push ولا merge إلا لما أقولك.

---

## 1) القواعد الذهبية

- **لا تغيّر ترتيب أي قسم أو عنصر في أي صفحة.** التغيير على الشكل فقط: ألوان، خطوط، مسافات، حواف، ظلال، خلفيات، أنيميشن.
- **لا تحذف ولا تعيد تسمية أي `id` أو `class` موجود.** `auth.js` و `countries.js` و `recipes.js` و `events.js` و `plan.js` و `profile.js` و `admin.js` و `index.js` تعتمد عليها. أهمها:
  `#menu-btn #side-menu #close-btn #userName #userAvatar #logoutBtn #adminLink #authButtons #userMenu #dark-mode-toggle #scrollTopBtn #searchInput .filter-buttons [data-filter] [data-region] .country-card .foods-card .recipes-item .event-card .event-item .cite .foods .event #cityModal` وكل `id` في `plan.html` و `profile.html` و `admin.html`.
- **لا تلمس منطق JS الموجود** (الفلاتر، المودال، الحفظ، تسجيل الدخول، wizard خطتي). الإضافات تكون في ملفات جديدة.
- **لا تعدّل محتوى الكروت** (`data-*`) في `countries.html` / `recipes.html` / `events.html` / صفحات الدول.
- مسموح **إضافة** عناصر جديدة بدون تحريك الموجود: طبقات أنيميشن داخل الهيرو، صورة خلفية، زر، قسم «قصة الشعار» في عن سفرة.
- اشتغل بأسلوب **طبقة ثيم فوق الموجود**: ملفين جداد + سطرين في `<head>` بكل صفحة.

---

## 2) الملفات الجديدة

```
frontend/theme/sofrah-v2.css   ← كل الستايل الجديد (يُحمَّل آخر شي في <head> عشان يغلب)
frontend/theme/sofrah-v2.js    ← الأنيميشن + نقل زر الوضع الليلي للنافبار + صورة الخلفية الشفافة + لوقو الفوتر + كلاس scrolled
```

أضف في **كل** ملف HTML (كل الصفحات الرئيسية + كل صفحات الدول تحت `countries/country/**`) قبل `</head>` مباشرة:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;700&display=swap">
<link rel="stylesheet" href="/theme/sofrah-v2.css">
<script src="/theme/sofrah-v2.js" defer></script>
```

سوِّ سكربت صغير (Python) يضيفها لكل الملفات مرة وحدة، وتأكد ما تنضاف مرتين. لا تلمس `google0af4ad105f78e8f9.html`.

---

## 3) الألوان (Design Tokens)

الوضع الليلي موجود أصلاً على `html[data-theme="dark"]` (من `auth.js`). استخدمه.

```css
:root{
  --bg:#FAF5EB; --surface:#FFFFFF; --surface2:#F0EBE0; --soft:#F3ECDD; --line:#E6DDCB;
  --ink:#1F1238; --ink2:#4A3D63; --ink3:#5A4E70; --brand:#32127A; --tint:#EFE7FA;
  --accent:#F28500; --accent-ink:#8A4B00; --foot:#1A0846; --shadow:rgba(50,18,122,.22);
  --plane:#FFFFFF; --plane-win:rgba(50,18,122,.35); --trail:rgba(255,255,255,.85);
  --hero-tint:linear-gradient(to top,rgba(40,12,100,.55) 0%,rgba(40,12,100,0) 60%),linear-gradient(to left,rgba(40,12,100,.6) 0%,rgba(40,12,100,.25) 45%,rgba(40,12,100,.05) 75%);
  --photo-filter:none; --stars:0; --ghost:.16;
  --glass:rgba(255,255,255,.18); --glass-bd:rgba(255,255,255,.38);
  --fx-a:#F28500; --fx-b:#5A2BC4; --fx-sh:drop-shadow(0 0 3px rgba(255,255,255,.9));
  --lan-bg:radial-gradient(circle at 50% 35%,#FFE7A6,#F28500 60%,#C25E00);
  --lan-glow:0 0 0 1.5px rgba(50,18,122,.55),0 0 14px 4px rgba(242,133,0,.55);
  --steam:rgba(255,255,255,.75);
}
html[data-theme="dark"]{
  --bg:#110A22; --surface:#1A1233; --surface2:#231945; --soft:#160F2C; --line:#33265A;
  --ink:#F2EDFB; --ink2:#C6BCDB; --ink3:#A99DC4; --brand:#C9B6FF; --tint:#2B1D5E;
  --accent-ink:#FFAE4A; --foot:#0A0616; --shadow:rgba(0,0,0,.55);
  --plane:#E8E4FF; --plane-win:rgba(242,133,0,.85); --trail:rgba(232,228,255,.5);
  --hero-tint:linear-gradient(to bottom,rgba(20,6,52,.6),rgba(20,6,52,.25));
  --photo-filter:brightness(.4) saturate(.75) hue-rotate(15deg); --stars:1; --ghost:.22;
  --glass:rgba(20,10,40,.4); --glass-bd:rgba(255,255,255,.16);
  --fx-a:#FFD29A; --fx-b:#F28500; --fx-sh:drop-shadow(0 0 6px rgba(242,133,0,.6));
  --lan-bg:radial-gradient(circle at 50% 40%,#FFE7A6,#F28500 70%);
  --lan-glow:0 0 20px 7px rgba(242,133,0,.5);
  --steam:rgba(232,228,255,.45);
}
```

- خلفية الصفحة `var(--bg)` في كل الصفحات. القاعدة القديمة `html[data-theme="dark"] body{background:#0B0933}` تنغلب بقاعدتنا.
- في الوضع الليلي كل الكروت والمودالات والفورمات تاخذ `var(--surface)` والنص `var(--ink)`، مو بس الخلفية.
- البنفسجي `#32127A` للعناوين والأزرار الأساسية بالنهار، والبرتقالي `#F28500` للـ CTA والأرقام والمؤشرات.

---

## 4) الخطوط والمقاسات

- كل الموقع: `'IBM Plex Sans Arabic'` (body, button, input, select, textarea, h1-h6). الأرقام والأكواد الصغيرة: `'IBM Plex Mono'`.
- العناوين وزن 600، و `letter-spacing:-.01em`.

| العنصر | كمبيوتر | جوال (≤900px) |
|---|---|---|
| عنوان الهيرو h1 | 44–46px | 28px |
| عناوين الأقسام h2 | 34–36px | 22px |
| عناوين الكروت h3 | 18–21px | 16px |
| النص | 15–16px | 14px |
| العناوين الصغيرة (eyebrow) | 12px Mono, letter-spacing .12em, لون var(--accent-ink) | 11px |

---

## 5) النافبار (`header.navbar`), نفس الشكل في كل الصفحات

- يبقى `position:fixed`، لكن **شفاف فوق الهيرو**: `background:transparent; height:76px`، و `body{padding-top:0 !important}` عشان الهيرو يجي تحته.
- بعد ما ينزل المستخدم أكثر من 40px، `sofrah-v2.js` يضيف كلاس `.scrolled` للنافبار ← `background:rgba(50,18,122,.92); backdrop-filter:blur(12px)`.
- العرض: `max-width:1280px` في النص، و padding جانبي 32px.
- **الترتيب البصري** (بـ CSS `order` فقط، بدون تحريك HTML):
  - **يسار:** اللوقو `.logo` (أبيض، ارتفاع 54px، `filter:drop-shadow(0 2px 10px rgba(30,8,80,.35))`).
  - **وسط:** `.nav-list` كبسولة زجاجية: `background:var(--glass); border:1px solid var(--glass-bd); backdrop-filter:blur(12px); padding:4px; border-radius:12px; gap:2px`. كل رابط `padding:6px 14px; border-radius:8px; font:500 14px; color:#fff`. الرابط الـ active `background:rgba(255,255,255,.28)`. احذف خط `::after` القديم.
  - **يمين:** زر الوضع الليلي + «تسجيل دخول» + «إنشاء حساب».
    - `#dark-mode-toggle`: الـ JS ينقله من مكانه العائم ويحطه داخل النافبار (`position:static`، 44×44، `border-radius:10px`، زجاجي، وأيقونة SVG قمر/شمس بدل الإيموجي).
    - `.login`: زجاجي، نص أبيض، `border-radius:10px`، min-height 44.
    - `.signup`: برتقالي `#F28500`، نص `#1F1238`، وزن 700، `border-radius:10px`. غيّر نصه بالـ JS إلى «ابدأ سفرتك» (الرابط نفسه).
  - `.user-menu` (المسجل دخول): كبسولة زجاجية فيها الأفتار بإطار برتقالي واسم المستخدم. القائمة المنسدلة `var(--surface)` بحواف 14px.
- **الجوال (≤900px):** `.nav-list` مخفية. يظهر `.hamburger` كزر زجاجي 44×44 مع أيقونة ☰ SVG. «تسجيل دخول» مخفي، و«ابدأ سفرتك» برضو مخفي في الجوال. يبقى: اللوقو يسار + (☰ + الوضع الليلي) يمين. ارتفاع النافبار 64px واللوقو 40px.
- **القائمة الجانبية `#side-menu`:** نفس المنطق الموجود (`menu-open`)، لكن تصير لوحة كاملة بنفسجي `rgba(26,8,70,.97)`. الروابط بخط 600 18px، كل رابط `min-height:56px` وبينها خط فاصل `rgba(255,255,255,.12)`، والرابط الحالي برتقالي.

---

## 6) الهيرو لكل صفحة (بدون تحريك)

اعتمد على العنصر الموجود في كل صفحة كهيرو، وخلّه يمتد تحت النافبار:
`position:relative; overflow:hidden; color:#fff; min-height:560px; padding-top:140px; text-align:right`.
داخله طبقات يضيفها الـ JS كأول أبناء، وتكون `position:absolute; inset:0; z-index:0`:

1. `<img class="sfr-hero-img">` صورة كاملة، `object-fit:cover; filter:var(--photo-filter)`.
2. `<div class="sfr-hero-tint">`: `background:var(--hero-tint)`.
3. نجوم SVG (`opacity:var(--stars)`)، تظهر في الليلي بس.
4. تلاشي تحت: ارتفاعه 70px، `linear-gradient(to bottom, transparent, var(--bg))`.
5. طبقة الأنيميشن (القسم 7).

خلّ محتوى الهيرو الأصلي `position:relative; z-index:2`.

| الصفحة | عنصر الهيرو | الصورة (من `/img/`) | الأنيميشن |
|---|---|---|---|
| `index/index.html` | `.ix-hero` | `/img/Anse Royale Seychelles.jpg` (`object-position:50% 35%`) | طيارات |
| `countries/countries.html` | `section.hero` | `/img/Socotra_Island.jpeg` | طيارات |
| صفحات الدول `countries/country/**` | `.country-name` | **قيمة `data-hero-img` الموجودة على نفس العنصر** | طيارات |
| `recipes/recipes.html` | `section.hero` | `/img/Yemeni Mandi.jpeg` | بخار + بهارات |
| `events/events.html` | `section.hero` | `/img/Hanami.jpg` | ألعاب نارية + فوانيس |
| `plan/plan.html` | `.hero-open` | `/img/لوسيرن (Lucerne).jpg` | طيارات (وخلّ أنيميشن `hero-flightpath` الأصلي) |
| `about/about.html` | `.about-hero` | `/img/wadi hadramut.jpeg` | بدون |
| `profile/profile.html` | لا يوجد، يضيف الـ JS `<div class="sfr-hero sfr-hero-short">` أول عنصر بعد `#side-menu` | `/img/Anse Source d'Argent.jpg` | بدون |
| `auth/login.html` و `auth/signup.html` | `.auth-page` تاخذ الصورة كخلفية للصفحة كاملة، والكرت `.auth-card` زجاجي فوقها | `/img/Mitsamiouli.jpg` | بدون |
| `admin/admin.html` | يضيف الـ JS بانر قصير (300px) بتدرّج بنفسجي بدل الصورة: `radial-gradient(80% 120% at 85% 0%, #5A2BC4 0%, #32127A 45%, #1A0846 100%)` + بقعة برتقالية `blur(140px)` | — | طيارات |

- **النص داخل الهيرو:** h1 أبيض 44px وزن 600 مع `text-shadow:0 2px 22px rgba(30,8,80,.45)`. الوصف 17px. الـ eyebrow (لو موجود) Mono 12px بلون `#FFD29A`.
- **مربع البحث `#searchInput` وأزرار الفلاتر** اللي تجي بعد الهيرو في الدول والوصفات والفعاليات: لا تحركها. بس `.search-box` ياخذ `margin-top:-72px; position:relative; z-index:3` عشان يطلع فوق أسفل الهيرو كمربع زجاجي أبيض: `height:52px; border-radius:14px; max-width:620px; background:rgba(255,255,255,.92); color:#1F1238`.
- **أزرار الفلاتر** تصير chips: `border:1.5px solid var(--line); background:var(--surface); color:var(--brand); border-radius:999px; padding:10px 18px; min-height:44px; font:600 14px`. الـ active: `background:var(--brand); color:var(--bg)`. في الجوال: صف واحد يتمرر أفقياً (`flex-wrap:nowrap; overflow-x:auto`).

---

## 7) الأنيميشن (في `sofrah-v2.js`، يُحقن داخل الهيرو)

كل الأشكال `pointer-events:none; z-index:1`. وإذا كان `prefers-reduced-motion: reduce` تتوقف كل الحركات.

### 7.1 الطيارات (الرئيسية، الدول، صفحة الدولة، خطتي، الأدمن)

خمس طيارات بأربع أشكال تطير من اليمين لليسار. كل طيارة SVG بـ `fill:var(--plane)` و `filter:drop-shadow(0 2px 3px rgba(20,8,60,.22))`، ووراها خط دخان:
`.trail{height:2px;border-radius:2px;background:var(--trail);mask-image:linear-gradient(to right,#000,transparent)}`.

```css
@keyframes fly{0%{left:108%}100%{left:-30%}}
@keyframes bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
@keyframes blink{0%,80%,100%{opacity:0}85%{opacity:1}}
@keyframes spin{0%{transform:scaleY(1)}50%{transform:scaleY(.15)}100%{transform:scaleY(1)}}
.plane{position:absolute;animation:fly linear infinite;display:flex;align-items:center}
.plane .in{display:flex;align-items:center;direction:ltr;position:relative;animation:bob 6s ease-in-out infinite}
.plane .led{position:absolute;width:4px;height:4px;border-radius:50%;background:#FF4D4D;animation:blink 1.6s infinite;opacity:var(--stars)}
.propel{transform-origin:4px 12px;animation:spin .18s linear infinite}
```

الأسطول (top, ارتفاع px, مدة s, تأخير سالب s, طول الدخان px, opacity, الشكل):

- `90px, 30, 46, 10, 280, 1, liner`
- `170px, 26, 40, 30, 220, .95, jet`
- `250px, 20, 70, 48, 120, .85, prop`
- `60px, 18, 58, 20, 60, .8, paper`
- `320px, 16, 84, 64, 160, .7, jet`

العرض = الارتفاع × ratio. الـ `.led` (الضوء الأحمر) للـ jet و liner و prop بس.

أشكال SVG (كلها تشير لليسار):

```
jet: viewBox="0 0 24 24" ratio=1.0
<g transform="rotate(-90 12 12)"><path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/></g>
liner: viewBox="0 0 64 24" ratio=2.6
<path d="M2 13 C2 10 6 8.5 11 8.5 L48 8.5 L56 1.5 L61 1.5 L57 9 L62 10.5 L62 13.5 L11 15.5 C6 15.5 2 15 2 13 Z"/><path d="M24 12.5 L39 22 L44 22 L35 12.5 Z"/><path d="M52 10 L58 6 L60 6 L56 11 Z" opacity=".6"/><g style="fill: var(--plane-win)"><circle cx="16" cy="11.2" r=".9"/><circle cx="19" cy="11.2" r=".9"/><circle cx="22" cy="11.2" r=".9"/><circle cx="25" cy="11.2" r=".9"/><circle cx="28" cy="11.2" r=".9"/><circle cx="31" cy="11.2" r=".9"/><circle cx="34" cy="11.2" r=".9"/><circle cx="37" cy="11.2" r=".9"/><circle cx="40" cy="11.2" r=".9"/></g>
prop: viewBox="0 0 48 24" ratio=1.9
<path d="M6 12 C6 9.5 9 8.5 13 8.5 L36 9.5 L42 3 L46 3 L43 10.5 L46 12 L46 14 L13 15.5 C9 15.5 6 14.5 6 12 Z"/><path d="M17 12 L13 21 L17 21 L24 12 Z"/><path d="M15 9 L19 5 L25 5 L24 9 Z" style="fill: var(--plane-win)"/><rect x="4" y="11" width="3" height="2" rx="1"/><ellipse class="propel" cx="4" cy="12" rx="1.2" ry="7" opacity=".7"/>
paper: viewBox="0 0 48 28" ratio=1.7
<path d="M2 14 L46 2 L32 26 L24 18 Z"/><path d="M2 14 L46 2 L24 18 Z" style="fill: var(--plane-win)" opacity=".55"/><path d="M24 18 L26 25 L32 26 Z" opacity=".75"/>
```

### 7.2 الوصفات: بخار + بهارات (بنفس ستايل الطيارات: أبيض بالنهار، بنفسجي فاتح بالليل)

- **3 خطوط بخار:** SVG ‏60×200، `<path d="M30 200 C 10 160 50 130 30 95 C 12 62 48 38 30 0" fill="none" stroke-width="14" stroke-linecap="round" style="stroke:var(--steam);filter:blur(5px)"/>` (في الليلي `blur(7px)`). مواقعها: left `10%/16%/23%`، المدد `6/7.5/6.5s`، `bottom:60px`.
- **6 بهارات:** المواقع (left%، الحجم px، المدة s، التأخير s): `(6,40,18,0) (16,32,22,8) (32,44,19,3) (58,34,23,12) (72,42,20,6) (90,34,21,15)`. الترتيب: هيل، قرفة، ورق غار، يانسون، فلفل، ورق غار.

```css
@keyframes spice2{0%{transform:translateY(0) rotate(0deg) translateX(0);opacity:0}10%{opacity:1}50%{transform:translateY(-180px) rotate(120deg) translateX(18px)}90%{opacity:1}100%{transform:translateY(-380px) rotate(240deg) translateX(-10px);opacity:0}}
.spice2{position:absolute;bottom:20px;animation:spice2 ease-in-out infinite;filter:drop-shadow(0 2px 3px rgba(20,8,60,.22))}
```

أشكال البهارات:

```
card: <svg viewBox="0 0 40 40" style="width:100%;height:100%"><g transform="rotate(-35 20 20)"><ellipse cx="20" cy="20" rx="8" ry="15" style="fill: var(--plane)"/><path d="M20 6 C 17 14 17 26 20 34" fill="none" style="stroke: var(--plane-win)" stroke-width="1.3" opacity=".7"/><path d="M20 5 L20 2" style="stroke: var(--plane-win)" stroke-width="1.8" stroke-linecap="round"/></g></svg>
cin: <svg viewBox="0 0 40 40" style="width:100%;height:100%"><g transform="rotate(25 20 20)"><rect x="6" y="14" width="28" height="12" rx="5" style="fill: var(--plane)"/><path d="M10 14 v12 M15 14 v12" style="stroke: var(--plane-win)" stroke-width="1" opacity=".45"/><circle cx="31" cy="20" r="5.5" style="fill: var(--plane)"/><path d="M31 20 m-2.5 0 a2.5 2.5 0 1 1 2.5 2.5" fill="none" style="stroke: var(--plane-win)" stroke-width="1.3"/></g></svg>
bay: <svg viewBox="0 0 40 40" style="width:100%;height:100%"><g transform="rotate(-20 20 20)"><path d="M20 3 C 31 12 31 28 20 37 C 9 28 9 12 20 3 Z" style="fill: var(--plane)" stroke-linejoin="round"/><path d="M20 6 V36 M20 14 L26 10 M20 20 L27 16 M20 26 L26 23 M20 14 L14 10 M20 20 L13 16 M20 26 L14 23" fill="none" style="stroke: var(--plane-win)" stroke-width="1.1" opacity=".6"/></g></svg>
star: <svg viewBox="0 0 40 40" style="width:100%;height:100%"><ellipse cx="20" cy="10" rx="4.2" ry="9" transform="rotate(0 20 20)" style="fill: var(--plane)"/><ellipse cx="20" cy="10" rx="4.2" ry="9" transform="rotate(45 20 20)" style="fill: var(--plane)"/><ellipse cx="20" cy="10" rx="4.2" ry="9" transform="rotate(90 20 20)" style="fill: var(--plane)"/><ellipse cx="20" cy="10" rx="4.2" ry="9" transform="rotate(135 20 20)" style="fill: var(--plane)"/><ellipse cx="20" cy="10" rx="4.2" ry="9" transform="rotate(180 20 20)" style="fill: var(--plane)"/><ellipse cx="20" cy="10" rx="4.2" ry="9" transform="rotate(225 20 20)" style="fill: var(--plane)"/><ellipse cx="20" cy="10" rx="4.2" ry="9" transform="rotate(270 20 20)" style="fill: var(--plane)"/><ellipse cx="20" cy="10" rx="4.2" ry="9" transform="rotate(315 20 20)" style="fill: var(--plane)"/><circle cx="20" cy="20" r="4" style="fill: var(--plane-win)"/></svg>
chili: <svg viewBox="0 0 40 40" style="width:100%;height:100%"><path d="M12 9 C 10 20 18 31 33 34 C 27 27 22 18 20 9 C 18 6 14 6 12 9 Z" style="fill: var(--plane)" stroke-linejoin="round"/><path d="M15 8 C 15 5 17 3 20 3" fill="none" style="stroke: var(--plane)" stroke-width="2.6" stroke-linecap="round"/><path d="M15 14 C 16 20 20 25 25 28" fill="none" style="stroke: var(--plane-win)" stroke-width="1.6" stroke-linecap="round"/></svg>
```

### 7.3 الفعاليات: ألعاب نارية + فوانيس

```css
@keyframes steam{0%{transform:translateY(0) scaleX(1);opacity:0}15%{opacity:.75}100%{transform:translateY(-260px) scaleX(1.6);opacity:0}}
@keyframes spice{0%{transform:translateY(0) rotate(0);opacity:0}10%{opacity:.9}100%{transform:translateY(-320px) rotate(220deg);opacity:0}}
@keyframes burst{0%{transform:scale(.1);opacity:0}15%{opacity:1}70%{opacity:.8}100%{transform:scale(1);opacity:0}}
@keyframes rise{0%{transform:translateY(40px);opacity:0}20%{opacity:1}100%{transform:translateY(-300px);opacity:0}}
.steam{position:absolute;bottom:60px;width:60px;height:200px;animation:steam ease-out infinite;pointer-events:none;z-index:1}
.spice{position:absolute;bottom:40px;width:7px;height:7px;border-radius:2px;animation:spice linear infinite;pointer-events:none;z-index:1}
.burst{position:absolute;width:170px;height:170px;animation:burst ease-out infinite;pointer-events:none;z-index:1;filter:var(--fx-sh)}
.lantern{position:absolute;bottom:0;width:18px;height:23px;border-radius:5px 5px 7px 7px;background:var(--lan-bg);box-shadow:var(--lan-glow);animation:rise linear infinite;pointer-events:none;z-index:1}
@media (prefers-reduced-motion: reduce){.steam,.spice,.burst,.lantern{animation:none !important;opacity:.5}}
```

- **5 ألعاب نارية:** SVG ‏170×170، فيها 16 خط من المركز (85,85) بطول 70 وبزاوية 22.5° بين كل خط والثاني. `stroke-width:3.2; stroke-dasharray:2 9; stroke-linecap:round`، والألوان تتناوب `var(--fx-a)` و `var(--fx-b)`. المواقع (left%، top px، المدة s، التأخير s): `(10,90,4.5,0) (24,170,5,2.2) (70,70,4.2,1.1) (84,150,5.4,3.3) (48,40,4.8,3.9)`.
- **6 فوانيس:** المواقع (left%، المدة s، التأخير s): `(6,14,0) (17,18,6) (29,15,10) (63,17,3) (77,13,8) (90,16,12)`.

---

## 8) الكروت والأقسام (تنسيق فقط)

- **كل الكروت** (`.country-card .ix-dest-card .ix-recipe-card .ix-event-card .foods-card .event-card .cite .foods .event .feature-card .step-card .vm-card .stat-box .fav-section .settings-group .ticket-card`):
  `background:var(--surface); border:1px solid var(--line); border-radius:16–24px; box-shadow:0 30px 60px -40px var(--shadow)`. النص `var(--ink)` والعناوين `var(--brand)`.
- **كروت الصور** (`.country-card` و `.ix-dest-card` وكروت الأحداث بصور): الصورة تغطي الكرت كامل، وفوقها تدرّج `linear-gradient(to top,rgba(16,6,40,.88),rgba(16,6,40,0) 62%)`، والنص أبيض تحت. الـ hover: الصورة تكبر `scale(1.05)` خلال `.8s`.
- **الأزرار:**
  - الأساسية: `background:var(--brand); color:var(--bg); border-radius:12–14px; min-height:44–48px; font-weight:700`.
  - الـ CTA: برتقالي `#F28500` مع نص `#1F1238`.
  - روابط «عرض الكل»: `border-bottom:1px solid #F28500` بدل الخلفية.
- **أزرار الحفظ** `.save-btn`: مربع أبيض 44×44، `border-radius:12px`، فوق يسار الكرت. خلّ الإيموجي الموجود.
- **المودالات** (`#cityModal` ومودال الوصفة والفعالية): `background:var(--surface); border-radius:24px`. الوسوم (tags) `background:var(--surface2)`.
- **الرئيسية:** أقسام `ix-destinations / ix-recipes / ix-events / ix-cta` بنفس ترتيبها:
  - عنوان كل قسم h2 34px بنفسجي، ورقم صغير Mono برتقالي فوقه بالـ CSS `::before`: (01 — الدول)، (02 — الوصفات)، (03 — الفعاليات).
  - `.ix-cta`: شريط بنفسجي بتدرّج `radial-gradient(120% 140% at 85% 0%, #5A2BC4 0%, #32127A 45%, #1A0846 100%)`، حواف 32px، واللوقو الأبيض باهت `opacity:.06` كخلفية.
- **الفوتر `.site-footer`:** `background:#1A0846` (`#0A0616` بالليل)، النص `#E8E0F5`، والعناوين برتقالي فاتح `#FFAE4A` بخط Mono صغير. الـ JS يستبدل نص `h2.footer-logo` بصورة اللوقو الأبيض (ارتفاع 72px) ويخلي النص `alt="سفرة"`.
- **صفحة الدولة:**
  - `.cities-grid` و `.foods-grid` و `.events-grid`: grid بـ 6 أعمدة للكمبيوتر، 3 للتابلت، 2 للجوال. الكروت مربعة بصورة فوق (`height:150px; border-radius:14px`).
  - العناوين `.main-cites / .main-foods / .events-main`: نفس ستايل h2 مع eyebrow.
  - `.back-btn`: زجاجي فوق الهيرو.
- **خطتي:** `ticket-card` بحواف 32px، وشريط التقدم `#stepsFill` برتقالي. `trip-card / hotel-chip / continent-chip / activity-chip` تصير كروت اختيار: الحد `var(--line)`، والمختار `background:var(--brand); color:var(--bg)`.
- **الملف الشخصي:**
  - `.profile-sidebar` تصير كرت أعلى الصفحة متراكب على الهيرو (`margin-top:-90px`)، فيه الأفتار مربع 104px بحواف 28px وإطار برتقالي.
  - `.profile-nav` و `.profile-mobile-nav` تصير شريط تبويبات أفقي (`.tabs`): خلفية `var(--surface)`، والتبويب المختار بنفسجي بنص كريمي.
  - `.fav-grid`: `grid-template-columns:repeat(auto-fill,minmax(240px,1fr))`، وكروت الصور 260px.
- **الأدمن:** الجداول `th` بخلفية `var(--surface2)` و `td` حدود `var(--line)`. حالات الدول pills:
  - متاح: `rgba(47,158,98,.14)` / `#1F7A48`
  - قريباً: `rgba(242,133,0,.16)` / `#9A4E00`
  - قيد التطوير: `var(--tint)` / `var(--brand)`

---

## 9) الصورة الشفافة في الخلفية عند الاختيار

في `sofrah-v2.js`:

- عند الضغط على `.recipes-item` أو `.event-item` أو `.cite`، خذ الصورة من `data-img`.
- اعرضها في طبقة ثابتة `#sfr-ghost` خلف المحتوى: `position:fixed; inset:0; z-index:-1`. الصورة `object-fit:cover; opacity:var(--ghost); filter:blur(3px)`، ومعها تلاشي فوق وتحت من `var(--bg)`.
- دخولها: fade + `scale(1.04→1)` خلال `.7s`.
- **لا تغيّر أي handler موجود**، استخدم `addEventListener` إضافي بس.

---

## 10) عن سفرة: إضافة «قصة الشعار»

أضف قسم جديد في `about/about.html` **بعد** `section.about-intro` مباشرة، بدون تحريك أي قسم ثاني.

**العنوان:** eyebrow «قصة الشعار»، وتحته h2 «شعار يجمع بين **السفر** والطعام» (كلمة السفر برتقالي).

**التخطيط:** عمودين.

- **يمين:** لوحة بنفسجية `radial-gradient(90% 70% at 50% 30%, #4A1FA8, #32127A 55%, #1A0846)` بحواف 28px. داخلها اللوقو الأبيض (عرض 220px)، وتحته «عالم من النكهات» ثم «ورحلات لا تنتهي» بلون `#FFB054`.
- **يسار:** شبكة 6 كروت، كل كرت فيه أيقونة 56×56 بخلفية `var(--tint)`، ورقم Mono 0X، وعنوان، وشرح:

1. السين على شكل شوكة: رمز للطعام والمائدة والضيافة، والشوكة جزء أساسي من تجربة الأكل.
2. الفاء على شكل ملعقة: رمز للأكل والمذاق والتجربة الشهية، والاستمتاع بالطعام.
3. التاء المربوطة زيتونة: الزيتون رمز للصحة والنكهات العربية، وتنوع مطابخ العالم.
4. الراء كما هي: بقت على شكلها الأصلي، حفاظاً على الهوية العربية والأصالة.
5. الضمة وفوقها فتحة: نطقين لكلمة وحدة: **سُفرة** المائدة، و**سَفرة** الرحلة.
6. مسار الطائرة: يمر في الشوكة والملعقة. كل رحلة تبدأ بخطوة، وكل رحلة لها قصة.

**تحت الشبكة:** شريط فيه «طعام ومذاق · سفر وترحال · اكتشاف ثقافات العالم»، وجنبه قلب برتقالي و«سافر بالعين… وتذوق بالذوق».

**أيقونات الكروت:** SVG خطّي `stroke:currentColor; stroke-width:2`:
- شوكة `M10 3v9a6 6 0 0 0 12 0V3M16 3v9M16 18v11`
- ملعقة `ellipse cx16 cy10 rx6 ry7.5 + M16 17.5V29`
- زيتونة `ellipse cx16 cy19 rx7 ry9 + ورقة`
- «ر» حرف 34px
- «سُ/سَ» حرفين
- مسار متقطع + طيارة

---

## 11) الجوال (≤900px)

- الأقسام: `padding-block:36px`، والـ wrap `padding-inline:18px`.
- الهيرو: `height:auto; padding-top:120px; padding-bottom:56px`.
- الشبكات: 4 أعمدة تصير 2، و 3 و 2 يصيرون 1. «وجهات مختارة» والفلاتر تتمرر أفقياً.
- الأرقام الكبيرة (الإحصائيات) 2×2 بحجم 24px.
- كروت الوصفات 2 بالصف بصورة 110px. صف الفعالية صورته 92×80، والسعر مخفي في القائمة.
- مافي أي عنصر يطلع برا عرض الشاشة. تأكد بـ `document.documentElement.scrollWidth === 390`.

---

## 12) الفحص قبل ما تقولي خلصت

1. شغّل سيرفر محلي من `frontend/` (`python3 -m http.server 8000`) وافتح كل صفحة.
2. صوّر بـ Playwright: كل صفحة × (نهاري/ليلي) × (1440px / 390px). الصفحات: الرئيسية، الدول، صفحة تركيا + صفحتين دول ثانية، الوصفات، الفعاليات، خطتي، الملف الشخصي، الدخول، التسجيل، عن سفرة، الأدمن.
3. تأكد إن هذي كلها تشتغل:
   - فلترة الدول والوصفات والفعاليات
   - البحث
   - فتح مودال المدينة والوصفة والفعالية
   - الروابط العميقة `?recipe=kabsa` و `?event=sodh`
   - أزرار الحفظ
   - تسجيل الدخول والخروج وظهور اسم المستخدم
   - القائمة الجانبية في الجوال
   - زر الوضع الليلي، ويتحفظ بعد التحديث
   - كل خطوات wizard خطتي إلى النتيجة
   - تبويبات الملف الشخصي
   - أقسام الأدمن
4. ما فيه أخطاء في Console.
5. `git diff --stat`: التغييرات المتوقعة سطرين في كل HTML + الملفين الجداد + قسم قصة الشعار في `about.html` بس.
6. اعرض لي الصور وملخص التغييرات، واستناني أوافق قبل الـ commit.
