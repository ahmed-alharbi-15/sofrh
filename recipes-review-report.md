# تقرير مراجعة الوصفات — recipes-review-report.md

**الملف:** `frontend/recipes/recipes.html`  
**عدد الوصفات:** 1150 وصفة  
**التاريخ:** 2026-11-14

---

## ملخص التغييرات

### 1. مكونات حرام → تم التبديل (وصفتان)

| الوصفة | التبديل |
|--------|---------|
| `vaticancity-saltimbocca` | `نبيذ أبيض للطبخ` → `مرق دجاج` (في المكونات والخطوات) |
| `newzealand-pavlova` | `خل نبيذ` → `خل التفاح` |

---

### 2. مكونات صعبة الإيجاد → تمت إضافة بديل (16 وصفة)

| الوصفة | المكوّن | البديل المضاف |
|--------|---------|---------------|
| `risotto` | جبن بارميزان | (البديل: جبن رومي مبشور) |
| `chicken-parmigiana` | جبن بارميزان | (البديل: جبن رومي مبشور) |
| `pao-de-queijo` | جبن بارميزان | (البديل: جبن رومي مبشور) |
| `aji-de-gallina` | جبن بارميزان | (البديل: جبن رومي مبشور) |
| `greece-moussaka` | جبن بارميزان مبشور | (البديل: جبن رومي مبشور) |
| `sanmarino-nidi-di-rondine` | جبنة بارميزان | (البديل: جبن رومي مبشور) |
| `fondue` | جبن غرويير | (البديل: جبن إيمنتال أو جبن شيدر) |
| `chicons-gratin` | جبن غرويير مبشور | (البديل: جبن إيمنتال أو جبن شيدر) |
| `kasespatzle` | جبن غرويير مبشور | (البديل: جبن إيمنتال أو جبن شيدر) |
| `quiche-lorraine` | جبن غرويير مبشور | (البديل: جبن إيمنتال أو جبن شيدر) |
| `malta-pastizzi` | جبن ريكوتا | (البديل: جبن قريش) |
| `malta-kannoli` | جبن ريكوتا | (البديل: جبن قريش) |
| `monaco-barbajuan` | جبنة ريكوتا | (البديل: جبن قريش) |
| `tteokbokki` | غوتشوجانغ | (البديل: معجون فلفل حار + قليل من صوص الصويا) |
| `cambodia-nom-banh-chok` | ورق الكافير لايم | (البديل: قشر الليمون العادي) |
| `northkorea-kimchi` | صلصة السمك (في التوابل) | (البديل: صوص الصويا مع قليل من عصير الليمون) |

---

### 3. إصلاح صيغة المكونات (data-ingredients) — 97 وصفة

كل الوصفات التالية كانت فيها حقل `data-ingredients` بعدد أجزاء غير قابل للقسمة على 3 (الصيغة الصحيحة: اسم|كمية|وحدة).

**الأنماط المُصلحة:**

| النمط | المثال (قبل) | المثال (بعد) |
|--------|-------------|-------------|
| `|` زائدة في النهاية | `ملح|1|ملعقة\|` | `ملح|1|ملعقة` |
| كمية نصية بدون وحدة | `سكر\|ربع كوب\|\|` | `سكر\|¼\|كوب` |
| وصف بدون كمية | `زيت للقلي\|كمية مناسبة\|\|` | `زيت للقلي\|—\|كمية مناسبة` |
| وحدة نصية كاملة | `ماء دافئ\|ثلاثة أرباع كوب\|\|` | `ماء دافئ\|¾\|كوب` |
| نزيف اسم المكوّن التالي في حقل الوحدة | `بقدونس\|حفنة\|بارميزان\|50\|غ` | `بقدونس\|1\|حفنة\|بارميزان\|50\|غ` |
| وحدة غير صحيحة | `عجين طازج\|300\|غرام دقيق` | `عجين طازج\|300\|غرام` |

**الوصفات المُصلحة (97):**
elsalvador-yuca-frita, elsalvador-atol-de-elote, guatemala-jocon, guatemala-tamales-guatemaltecos,
honduras-baleadas, honduras-yuca-con-chicharon, honduras-tajadas, nicaragua-gallo-pinto,
nicaragua-vigoron, nicaragua-nacatamal, nicaragua-indio-viejo, nicaragua-quesillo, panama-ceviche,
panama-ropa-vieja, antigua-fungee-pepperpot, antigua-ducana, antigua-coconut-tart,
antigua-pepperpot-stew, bahamas-cracked-conch, bahamas-peas-and-rice, bahamas-johnny-cake,
barbados-flying-fish-coucou, barbados-macaroni-pie, barbados-coconut-bread, cuba-ropa-vieja-pollo,
cuba-tostones, cuba-yuca-mojo, cuba-picadillo-pollo, jamaica-ackee-saltfish,
bahrain-mutabbaq, oman-shuwa, oman-luqaimat, nepal-sel-roti, georgia-badji, georgia-churchkhela,
bangladesh-fuchka, brunei-nasi-katok, brunei-laksa, iran-ash-reshteh, iraq-quzi,
kazakhstan-beshbarmak, kazakhstan-baursak, kazakhstan-kumiss, mongolia-khuushuur,
mongolia-boodog, mongolia-airag-tea, myanmar-laphet, myanmar-nan-gyi-thoke, myanmar-samusa,
myanmar-htamin-jin, newzealand-mussels, papuanewguinea-mumu, fiji-lovo,
vanuatu-laplap, vanuatu-namalao, vanuatu-tuluk, vanuatu-kokiyo, vanuatu-roastedfish, vanuatu-poipoi,
samoa-palusami, samoa-sapasui, samoa-faapapa, samoa-kokosamoa, samoa-taro,
tonga-lumealofa, tonga-kapisi, tonga-otaika, tonga-tofukofe, tonga-octopus, tonga-vakalolo,
kiribati-babai, kiribati-toddy, kiribati-coconutcrab, kiribati-fishsoup, kiribati-breadfruit,
tuvalu-pulaka, tuvalu-coconutcrab, tuvalu-coconutmilk, tuvalu-pawpaw,
nauru-coconutfish, nauru-breadfruit, nauru-coconutcrab,
palau-coconutfish, palau-taro, palau-fishsoup, palau-cassava, palau-tropicalfruit,
micronesia-taro, micronesia-coconutcrab, micronesia-fishcurry, micronesia-ulu,
micronesia-octopus, micronesia-coconutrice,
marshallislands-coconutrice, marshallislands-breadfruit, marshallislands-coconutcrab,
marshallislands-fishsoup

---

### 4. إصلاح صيغة التوابل (data-spices) — 9 وصفات

| الوصفة | الإصلاح |
|--------|---------|
| `iran-ash-reshteh` | `زعفران\|رشة` → `زعفران\|—\|رشة` |
| `kazakhstan-kumiss` | `ملح\|رشة\|زبدة...` → `ملح\|—\|رشة\|زبدة...` |
| `mongolia-guriltai-shul` | `بقدونس\|حفنة` → `بقدونس\|1\|حفنة`، وحقل الكمية |
| `mongolia-airag-tea` | `ملح\|رشة\|زبدة...` → `ملح\|—\|رشة\|زبدة...` |
| `myanmar-ohn-no-khao-swe` | `كزبرة\|حفنة` → `كزبرة\|1\|حفنة` |
| `northkorea-seolleongtang` | `ملح\|حسب الذوق\|فلفل...` → `ملح\|—\|حسب الذوق\|فلفل...` |
| `papuanewguinea-kokoda` | `كزبرة طازجة\|حفنة` → `كزبرة طازجة\|1\|حفنة` |
| `fiji-kokoda` | `كزبرة\|حفنة` → `كزبرة\|1\|حفنة` |
| `solomonislands-seafoodsoup` | `كزبرة\|حفنة\|فلفل...` → `كزبرة\|1\|حفنة\|فلفل...` |

إضافة إلى ذلك: 50 وصفة أخرى كان في توابلها `|` زائدة في النهاية، تم حذفها.

---

## ما لم يتغيّر

- لا توجد وصفات بمكونات حرام أخرى (جميع حالات `مخمر/تخمر` هي تخمير طعام حلال)
- لا توجد صور مفقودة بحاجة إلى تعديل في الوصفات
- الأصالة الغذائية: الوصفات تبدو أصيلة لثقافاتها — لم تُعدَّل السياقات الثقافية
- لا تعارض في الـ ID بين الوصفات

---

## ملفات احتياطية

- `frontend/recipes/recipes-backup-before-review.html` — نسخة احتياطية قبل أي تعديل
