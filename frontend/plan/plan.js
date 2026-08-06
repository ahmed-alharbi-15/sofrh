const planUser = JSON.parse(localStorage.getItem('safraUser'));
if (!planUser) {
    window.location.href = '/auth/login.html';
}

document.addEventListener("DOMContentLoaded", () => {

        // ===== القائمة الجانبية =====
        const menuBtn = document.getElementById("menu-btn");
        const sideMenu = document.getElementById("side-menu");
        const closeBtn = document.getElementById("close-btn");
        if (menuBtn && sideMenu && closeBtn) {
                menuBtn.addEventListener("click", () => {
                        sideMenu.style.right = "0px";
                        requestAnimationFrame(() => sideMenu.classList.add("menu-open"));
                });
                closeBtn.addEventListener("click", () => {
                        sideMenu.style.right = "-260px";
                        sideMenu.classList.remove("menu-open");
                });
                document.addEventListener("click", (e) => {
                        if (!sideMenu.contains(e.target) && !menuBtn.contains(e.target)) {
                                sideMenu.style.right = "-260px";
                                sideMenu.classList.remove("menu-open");
                        }
                });
        }

        // ===== أسماء القارات بالعربي (للعرض) =====
        const continentNames = {
                asia: "آسيا",
                europe: "أوروبا",
                africa: "أفريقيا",
                north_america: "أمريكا الشمالية",
                south_america: "أمريكا الجنوبية",
                oceania: "أوقيانوسيا",
        };

        function getCountryLink(country) {
                return `https://sofrh.vercel.app/countries/country/${country.continent}/${country.id}.html`;
        }

        // ===== بيانات الدول (١٦١ دولة تغطي كل قارات العالم) =====
        // dailyCost: متوسط تكلفة الفرد باليوم بالريال (إقامة + أكل + تنقل + أنشطة)، غير شامل تذاكر الطيران
        // الأرقام مبنية على متوسطات بيانات سفر حقيقية منشورة (مثل Budget Your Trip) ومحوّلة لتقريب بالريال السعودي
        // ملاحظة: تم استبعاد عدد قليل من الدول التي تشهد حالياً نزاعات مسلحة فعلية لعدم وجود بنية سياحية آمنة فيها
        // عدّل القيم والصور لاحقاً حسب بياناتك الفعلية — مسار الصور img/{id}.jpg
        const countries =
                [
                        {
                                "id": "uae",
                                "nameAr": "الامارات",
                                "nameEn": "UAE",
                                "continent": "asia",
                                "img": "/img/UAE.jpg",
                                "dailyCost": 490,
                                "durationMin": 3,
                                "durationMax": 7,
                                "tripTypes": [
                                        "family",
                                        "honeymoon"
                                ],
                                "activities": [
                                        "beaches",
                                        "amusement",
                                        "resorts",
                                        "landmarks"
                                ],
                                "bestTime": "نوفمبر - مارس"
                        },
                        {
                                "id": "qatar",
                                "nameAr": "قطر",
                                "nameEn": "Qatar",
                                "continent": "asia",
                                "img": "/img/Qatar.jpg",
                                "dailyCost": 450,
                                "durationMin": 3,
                                "durationMax": 6,
                                "tripTypes": [
                                        "family",
                                        "honeymoon"
                                ],
                                "activities": [
                                        "beaches",
                                        "museums",
                                        "landmarks",
                                        "resorts"
                                ],
                                "bestTime": "نوفمبر - مارس"
                        },
                        {
                                "id": "kuwait",
                                "nameAr": "الكويت",
                                "nameEn": "Kuwait",
                                "continent": "asia",
                                "img": "/img/Kuwait.jpg",
                                "dailyCost": 340,
                                "durationMin": 2,
                                "durationMax": 5,
                                "tripTypes": [
                                        "family",
                                        "youth"
                                ],
                                "activities": [
                                        "beaches",
                                        "landmarks"
                                ],
                                "bestTime": "نوفمبر - مارس"
                        },
                        {
                                "id": "bahrain",                                "nameAr": "البحرين",
                                "nameEn": "Bahrain",
                                "continent": "asia",
                                "img": "/img/bahrain-logo.jpg",
                                "dailyCost": 320,
                                "durationMin": 2,
                                "durationMax": 4,
                                "tripTypes": [
                                        "family",
                                        "youth"
                                ],
                                "activities": [
                                        "beaches",
                                        "landmarks",
                                        "amusement"
                                ],
                                "bestTime": "نوفمبر - مارس"
                        },
                        {
                                "id": "oman",                                "nameAr": "عمان",
                                "nameEn": "Oman",
                                "continent": "asia",
                                "img": "/img/oman-logo.jpg",
                                "dailyCost": 280,
                                "durationMin": 4,
                                "durationMax": 8,
                                "tripTypes": [
                                        "family",
                                        "youth",
                                        "honeymoon"
                                ],
                                "activities": [
                                        "mountains",
                                        "beaches",
                                        "sea",
                                        "landmarks"
                                ],
                                "bestTime": "أكتوبر - أبريل"
                        },
                        {
                                "id": "saudi",
                                "nameAr": "السعودية",
                                "nameEn": "Saudi Arabia",
                                "continent": "asia",
                                "img": "/img/Riyadh_Skyline.jpg",
                                "dailyCost": 300,
                                "durationMin": 3,
                                "durationMax": 7,
                                "tripTypes": [
                                        "family",
                                        "youth",
                                        "honeymoon"
                                ],
                                "activities": [
                                        "landmarks",
                                        "mountains",
                                        "beaches",
                                        "resorts"
                                ],
                                "bestTime": "أكتوبر - أبريل"
                        },
                        {
                                "id": "jordan",                                "nameAr": "الأردن",
                                "nameEn": "Jordan",
                                "continent": "asia",
                                "img": "/img/jordan-logo.jpg",
                                "dailyCost": 360,
                                "durationMin": 4,
                                "durationMax": 7,
                                "tripTypes": [
                                        "family",
                                        "youth",
                                        "honeymoon"
                                ],
                                "activities": [
                                        "landmarks",
                                        "mountains",
                                        "sea"
                                ],
                                "bestTime": "مارس - مايو"
                        },
                        {
                                "id": "lebanon",
                                "nameAr": "لبنان",
                                "nameEn": "Lebanon",
                                "continent": "asia",
                                "img": "/img/lebanon-logo.jpg",
                                "dailyCost": 250,
                                "durationMin": 4,
                                "durationMax": 7,
                                "tripTypes": [
                                        "youth",
                                        "family"
                                ],
                                "activities": [
                                        "mountains",
                                        "landmarks",
                                        "beaches"
                                ],
                                "bestTime": "أبريل - يونيو"
                        },
                        {
                                "id": "turkey",
                                "nameAr": "تركيا",
                                "nameEn": "Turkey",
                                "continent": "asia",
                                "img": "/img/Turkey.jpg",
                                "dailyCost": 250,
                                "durationMin": 7,
                                "durationMax": 14,
                                "tripTypes": [
                                        "youth",
                                        "family",
                                        "honeymoon"
                                ],
                                "activities": [
                                        "beaches",
                                        "sea",
                                        "mountains",
                                        "landmarks",
                                        "museums",
                                        "amusement"
                                ],
                                "bestTime": "أبريل - يونيو"
                        },
                        {
                                "id": "maldives",
                                "nameAr": "المالديف",
                                "nameEn": "Maldives",
                                "continent": "asia",
                                "img": "/img/Maldives.jpg",
                                "dailyCost": 1120,
                                "durationMin": 5,
                                "durationMax": 10,
                                "tripTypes": [
                                        "honeymoon"
                                ],
                                "activities": [
                                        "beaches",
                                        "sea",
                                        "resorts"
                                ],
                                "bestTime": "نوفمبر - أبريل"
                        },
                        {
                                "id": "srilanka",
                                "nameAr": "سريلانكا",
                                "nameEn": "Sri Lanka",
                                "continent": "asia",
                                "img": "/img/Sri Lanka.jpg",
                                "dailyCost": 200,
                                "durationMin": 7,
                                "durationMax": 12,
                                "tripTypes": [
                                        "family",
                                        "youth"
                                ],
                                "activities": [
                                        "safari",
                                        "mountains",
                                        "beaches",
                                        "sea",
                                        "landmarks"
                                ],
                                "bestTime": "ديسمبر - مارس"
                        },
                        {
                                "id": "china",
                                "nameAr": "الصين",
                                "nameEn": "China",
                                "continent": "asia",
                                "img": "/img/China.jpg",
                                "dailyCost": 300,
                                "durationMin": 8,
                                "durationMax": 15,
                                "tripTypes": [
                                        "youth",
                                        "family"
                                ],
                                "activities": [
                                        "museums",
                                        "landmarks",
                                        "amusement"
                                ],
                                "bestTime": "مارس - مايو"
                        },
                        {
                                "id": "korea",
                                "nameAr": "كوريا الجنوبية",
                                "nameEn": "South Korea",
                                "continent": "asia",
                                "img": "/img/South Korea.jpg",
                                "dailyCost": 420,
                                "durationMin": 6,
                                "durationMax": 10,
                                "tripTypes": [
                                        "youth",
                                        "family"
                                ],
                                "activities": [
                                        "amusement",
                                        "museums",
                                        "landmarks"
                                ],
                                "bestTime": "مارس - مايو"
                        },
                        {
                                "id": "japan",
                                "nameAr": "اليابان",
                                "nameEn": "Japan",
                                "continent": "asia",
                                "img": "/img/japan-logo.jpg",
                                "dailyCost": 460,
                                "durationMin": 7,
                                "durationMax": 12,
                                "tripTypes": [
                                        "youth",
                                        "family",
                                        "honeymoon"
                                ],
                                "activities": [
                                        "landmarks",
                                        "museums",
                                        "amusement",
                                        "mountains"
                                ],
                                "bestTime": "مارس - مايو"
                        },
                        {
                                "id": "thailand",
                                "nameAr": "تايلاند",
                                "nameEn": "Thailand",
                                "continent": "asia",
                                "img": "/img/Thailand.jpg",
                                "dailyCost": 210,
                                "durationMin": 7,
                                "durationMax": 12,
                                "tripTypes": [
                                        "youth",
                                        "family",
                                        "honeymoon"
                                ],
                                "activities": [
                                        "beaches",
                                        "sea",
                                        "landmarks",
                                        "amusement"
                                ],
                                "bestTime": "نوفمبر - فبراير"
                        },
                        {
                                "id": "vietnam",
                                "nameAr": "فيتنام",
                                "nameEn": "Vietnam",
                                "continent": "asia",
                                "img": "/img/Vietnam.jpg",
                                "dailyCost": 225,
                                "durationMin": 7,
                                "durationMax": 12,
                                "tripTypes": [
                                        "youth",
                                        "family"
                                ],
                                "activities": [
                                        "beaches",
                                        "sea",
                                        "mountains",
                                        "landmarks"
                                ],
                                "bestTime": "فبراير - أبريل"
                        },
                        {
                                "id": "indonesia",
                                "nameAr": "اندونيسيا",
                                "nameEn": "Indonesia",
                                "continent": "asia",
                                "img": "/img/Indonesia_logo.png",
                                "dailyCost": 210,
                                "durationMin": 7,
                                "durationMax": 12,
                                "tripTypes": [
                                        "youth",
                                        "honeymoon",
                                        "family"
                                ],
                                "activities": [
                                        "beaches",
                                        "sea",
                                        "mountains",
                                        "landmarks"
                                ],
                                "bestTime": "أبريل - أكتوبر"
                        },
                        {
                                "id": "malaysia",
                                "nameAr": "ماليزيا",
                                "nameEn": "Malaysia",
                                "continent": "asia",
                                "img": "/img/Malaysia.jpg",
                                "dailyCost": 230,
                                "durationMin": 5,
                                "durationMax": 9,
                                "tripTypes": [
                                        "youth",
                                        "family"
                                ],
                                "activities": [
                                        "beaches",
                                        "landmarks",
                                        "amusement"
                                ],
                                "bestTime": "يونيو - أغسطس"
                        },
                        {
                                "id": "singapore",
                                "nameAr": "سنغافورة",
                                "nameEn": "Singapore",
                                "continent": "asia",
                                "img": "/img/Singapore.jpg",
                                "dailyCost": 580,
                                "durationMin": 3,
                                "durationMax": 5,
                                "tripTypes": [
                                        "family",
                                        "youth"
                                ],
                                "activities": [
                                        "amusement",
                                        "landmarks",
                                        "museums"
                                ],
                                "bestTime": "فبراير - أبريل"
                        },
                        {
                                "id": "philippines",
                                "nameAr": "الفلبين",
                                "nameEn": "Philippines",
                                "continent": "asia",
                                "img": "/img/Philippines.jpg",
                                "dailyCost": 230,
                                "durationMin": 7,
                                "durationMax": 12,
                                "tripTypes": [
                                        "youth",
                                        "honeymoon",
                                        "family"
                                ],
                                "activities": [
                                        "beaches",
                                        "sea",
                                        "landmarks"
                                ],
                                "bestTime": "ديسمبر - مايو"
                        },
                        {
                                "id": "india",
                                "nameAr": "الهند",
                                "nameEn": "India",
                                "continent": "asia",
                                "img": "/img/India.jpg",
                                "dailyCost": 150,
                                "durationMin": 8,
                                "durationMax": 15,
                                "tripTypes": [
                                        "youth",
                                        "family"
                                ],
                                "activities": [
                                        "landmarks",
                                        "museums",
                                        "mountains"
                                ],
                                "bestTime": "أكتوبر - مارس"
                        },
                        {
                                "id": "nepal",                                "nameAr": "نيبال",
                                "nameEn": "Nepal",
                                "continent": "asia",
                                "img": "/img/nepal-logo.jpg",
                                "dailyCost": 150,
                                "durationMin": 7,
                                "durationMax": 12,
                                "tripTypes": [
                                        "youth"
                                ],
                                "activities": [
                                        "mountains",
                                        "landmarks"
                                ],
                                "bestTime": "أكتوبر - نوفمبر"
                        },
                        {
                                "id": "cambodia",
                                "nameAr": "كمبوديا",
                                "nameEn": "Cambodia",
                                "continent": "asia",
                                "img": "/img/cambodia-logo.jpg",
                                "dailyCost": 190,
                                "durationMin": 4,
                                "durationMax": 7,
                                "tripTypes": [
                                        "youth",
                                        "family"
                                ],
                                "activities": [
                                        "landmarks",
                                        "museums"
                                ],
                                "bestTime": "نوفمبر - فبراير"
                        },
                        {
                                "id": "laos",
                                "nameAr": "لاوس",
                                "nameEn": "Laos",
                                "continent": "asia",
                                "img": "/img/laos-logo.jpg",
                                "dailyCost": 90,
                                "durationMin": 5,
                                "durationMax": 9,
                                "tripTypes": [
                                        "youth"
                                ],
                                "activities": [
                                        "mountains",
                                        "landmarks"
                                ],
                                "bestTime": "نوفمبر - فبراير"
                        },
                        {
                                "id": "hongkong",
                                "ready": false,
                                "nameAr": "هونغ كونغ",
                                "nameEn": "Hong Kong",
                                "continent": "asia",
                                "img": "/img/coming-soon.jpg",
                                "dailyCost": 650,
                                "durationMin": 3,
                                "durationMax": 5,
                                "tripTypes": [
                                        "youth",
                                        "family"
                                ],
                                "activities": [
                                        "amusement",
                                        "landmarks",
                                        "museums"
                                ],
                                "bestTime": "أكتوبر - ديسمبر"
                        },
                        {
                                "id": "taiwan",
                                "ready": false,
                                "nameAr": "تايوان",
                                "nameEn": "Taiwan",
                                "continent": "asia",
                                "img": "/img/coming-soon.jpg",
                                "dailyCost": 300,
                                "durationMin": 5,
                                "durationMax": 8,
                                "tripTypes": [
                                        "youth",
                                        "family"
                                ],
                                "activities": [
                                        "mountains",
                                        "landmarks",
                                        "amusement"
                                ],
                                "bestTime": "أكتوبر - ديسمبر"
                        },
                        {
                                "id": "georgia",                                "nameAr": "جورجيا",
                                "nameEn": "Georgia",
                                "continent": "asia",
                                "img": "/img/georgia-logo.jpg",
                                "dailyCost": 135,
                                "durationMin": 5,
                                "durationMax": 9,
                                "tripTypes": [
                                        "youth",
                                        "family",
                                        "honeymoon"
                                ],
                                "activities": [
                                        "mountains",
                                        "landmarks"
                                ],
                                "bestTime": "مايو - سبتمبر"
                        },
                        {
                                "id": "armenia",
                                "nameAr": "أرمينيا",
                                "nameEn": "Armenia",
                                "continent": "asia",
                                "img": "/img/armenia-logo.jpg",
                                "dailyCost": 135,
                                "durationMin": 4,
                                "durationMax": 7,
                                "tripTypes": [
                                        "youth",
                                        "family"
                                ],
                                "activities": [
                                        "mountains",
                                        "landmarks"
                                ],
                                "bestTime": "مايو - سبتمبر"
                        },
                        {
                                "id": "azerbaijan",
                                "nameAr": "أذربيجان",
                                "nameEn": "Azerbaijan",
                                "continent": "asia",
                                "img": "/img/azerbaijan-logo.jpg",
                                "dailyCost": 190,
                                "durationMin": 4,
                                "durationMax": 7,
                                "tripTypes": [
                                        "youth",
                                        "family"
                                ],
                                "activities": [
                                        "mountains",
                                        "landmarks"
                                ],
                                "bestTime": "أبريل - يونيو"
                        },
                        {
                                "id": "kazakhstan",
                                "nameAr": "كازاخستان",
                                "nameEn": "Kazakhstan",
                                "continent": "asia",
                                "img": "/img/kazakhstan-logo.jpg",
                                "dailyCost": 90,
                                "durationMin": 5,
                                "durationMax": 9,
                                "tripTypes": [
                                        "youth"
                                ],
                                "activities": [
                                        "mountains",
                                        "landmarks"
                                ],
                                "bestTime": "مايو - سبتمبر"
                        },
                        {
                                "id": "iran",
                                "nameAr": "إيران",
                                "nameEn": "Iran",
                                "continent": "asia",
                                "img": "/img/iran-logo.jpg",
                                "dailyCost": 150,
                                "durationMin": 6,
                                "durationMax": 10,
                                "tripTypes": [
                                        "youth",
                                        "family"
                                ],
                                "activities": [
                                        "landmarks",
                                        "museums",
                                        "mountains"
                                ],
                                "bestTime": "مارس - مايو"
                        },
                        {
                                "id": "pakistan",
                                "nameAr": "باكستان",
                                "nameEn": "Pakistan",
                                "continent": "asia",
                                "img": "/img/pakistan-logo.jpg",
                                "dailyCost": 110,
                                "durationMin": 6,
                                "durationMax": 10,
                                "tripTypes": [
                                        "youth"
                                ],
                                "activities": [
                                        "mountains",
                                        "landmarks"
                                ],
                                "bestTime": "مارس - مايو"
                        },
                        {
                                "id": "bangladesh",
                                "nameAr": "بنغلاديش",
                                "nameEn": "Bangladesh",
                                "continent": "asia",
                                "img": "/img/bangladesh-logo.jpg",
                                "dailyCost": 110,
                                "durationMin": 5,
                                "durationMax": 8,
                                "tripTypes": [
                                        "youth"
                                ],
                                "activities": [
                                        "landmarks"
                                ],
                                "bestTime": "أكتوبر - مارس"
                        },
                        {
                                "id": "bhutan",
                                "nameAr": "بوتان",
                                "nameEn": "Bhutan",
                                "continent": "asia",
                                "img": "/img/bhutan-logo.jpg",
                                "dailyCost": 700,
                                "durationMin": 5,
                                "durationMax": 8,
                                "tripTypes": [
                                        "honeymoon",
                                        "youth"
                                ],
                                "activities": [
                                        "mountains",
                                        "landmarks"
                                ],
                                "bestTime": "مارس - مايو"
                        },
                        {
                                "id": "myanmar",
                                "nameAr": "ميانمار",
                                "nameEn": "Myanmar",
                                "continent": "asia",
                                "img": "/img/myanmar-logo.jpg",
                                "dailyCost": 140,
                                "durationMin": 6,
                                "durationMax": 10,
                                "tripTypes": [
                                        "youth"
                                ],
                                "activities": [
                                        "landmarks",
                                        "museums"
                                ],
                                "bestTime": "نوفمبر - فبراير"
                        },
                        {
                                "id": "brunei",
                                "nameAr": "بروناي",
                                "nameEn": "Brunei",
                                "continent": "asia",
                                "img": "/img/brunei-logo.jpg",
                                "dailyCost": 350,
                                "durationMin": 3,
                                "durationMax": 5,
                                "tripTypes": [
                                        "family"
                                ],
                                "activities": [
                                        "landmarks",
                                        "mountains"
                                ],
                                "bestTime": "مارس - أبريل"
                        },
                        {
                                "id": "mongolia",
                                "nameAr": "منغوليا",
                                "nameEn": "Mongolia",
                                "continent": "asia",
                                "img": "/img/mongolia-logo.jpg",
                                "dailyCost": 150,
                                "durationMin": 6,
                                "durationMax": 10,
                                "tripTypes": [
                                        "youth"
                                ],
                                "activities": [
                                        "mountains",
                                        "safari"
                                ],
                                "bestTime": "يونيو - سبتمبر"
                        },
                        {
                                "id": "uzbekistan",
                                                                "nameAr": "أوزبكستان",
                                "nameEn": "Uzbekistan",
                                "continent": "asia",
                                "img": "/img/uzbekistan-logo.jpg",
                                "dailyCost": 140,
                                "durationMin": 6,
                                "durationMax": 9,
                                "tripTypes": [
                                        "youth",
                                        "family"
                                ],
                                "activities": [
                                        "landmarks",
                                        "museums"
                                ],
                                "bestTime": "مارس - مايو"
                        },
                        {
                                "id": "kyrgyzstan",
                                "nameAr": "قيرغيزستان",
                                "nameEn": "Kyrgyzstan",
                                "continent": "asia",
                                "img": "/img/kyrgyzstan-logo.jpg",
                                "dailyCost": 120,
                                "durationMin": 5,
                                "durationMax": 8,
                                "tripTypes": [
                                        "youth"
                                ],
                                "activities": [
                                        "mountains"
                                ],
                                "bestTime": "مايو - سبتمبر"
                        },
                        {
                                "id": "tajikistan",
                                "nameAr": "طاجيكستان",
                                "nameEn": "Tajikistan",
                                "continent": "asia",
                                "img": "/img/tajikistan-logo.jpg",
                                "dailyCost": 110,
                                "durationMin": 5,
                                "durationMax": 8,
                                "tripTypes": [
                                        "youth"
                                ],
                                "activities": [
                                        "mountains"
                                ],
                                "bestTime": "مايو - سبتمبر"
                        },
                        {
                                "id": "turkmenistan",
                                                                "nameAr": "تركمانستان",
                                "nameEn": "Turkmenistan",
                                "continent": "asia",
                                "img": "/img/turkmenistan-logo.jpg",
                                "dailyCost": 250,
                                "durationMin": 4,
                                "durationMax": 7,
                                "tripTypes": [
                                        "youth"
                                ],
                                "activities": [
                                        "landmarks"
                                ],
                                "bestTime": "مارس - مايو"
                        },
                        {
                                "id": "timorleste",
                                "nameAr": "تيمور الشرقية",
                                "nameEn": "Timor-Leste",
                                "continent": "asia",
                                "img": "/img/timorleste-logo.jpg",
                                "dailyCost": 170,
                                "durationMin": 4,
                                "durationMax": 7,
                                "tripTypes": [
                                        "youth"
                                ],
                                "activities": [
                                        "beaches",
                                        "sea"
                                ],
                                "bestTime": "مايو - نوفمبر"
                        },
                        {
                                "id": "egypt",
                                "nameAr": "مصر",
                                "nameEn": "Egypt",
                                "continent": "africa",
                                "img": "/img/egypt-logo.jpeg",
                                "dailyCost": 170,
                                "durationMin": 5,
                                "durationMax": 9,
                                "tripTypes": [
                                        "family",
                                        "youth",
                                        "honeymoon"
                                ],
                                "activities": [
                                        "landmarks",
                                        "museums",
                                        "sea",
                                        "beaches"
                                ],
                                "bestTime": "أكتوبر - أبريل"
                        },
                        {
                                "id": "morocco",
                                "nameAr": "المغرب",
                                "nameEn": "Morocco",
                                "continent": "africa",
                                "img": "/img/moroco-logo.jpg",
                                "dailyCost": 210,
                                "durationMin": 6,
                                "durationMax": 10,
                                "tripTypes": [
                                        "youth",
                                        "family",
                                        "honeymoon"
                                ],
                                "activities": [
                                        "landmarks",
                                        "mountains",
                                        "beaches"
                                ],
                                "bestTime": "مارس - مايو"
                        },
                        {
                                "id": "tunisia",
                                "nameAr": "تونس",
                                "nameEn": "Tunisia",
                                "continent": "africa",
                                "img": "/img/tunisia-logo.jpg",
                                "dailyCost": 150,
                                "durationMin": 5,
                                "durationMax": 9,
                                "tripTypes": [
                                        "family",
                                        "youth"
                                ],
                                "activities": [
                                        "beaches",
                                        "sea",
                                        "landmarks"
                                ],
                                "bestTime": "مارس - مايو"
                        },
                        {
                                "id": "kenya",
                                "nameAr": "كينيا",
                                "nameEn": "Kenya",
                                "continent": "africa",
                                "img": "/img/Kenya.jpg",
                                "dailyCost": 460,
                                "durationMin": 6,
                                "durationMax": 10,
                                "tripTypes": [
                                        "youth",
                                        "family",
                                        "honeymoon"
                                ],
                                "activities": [
                                        "safari"
                                ],
                                "bestTime": "يونيو - أكتوبر"
                        },
                        {
                                "id": "rwanda",
                                "nameAr": "رواندا",
                                "nameEn": "Rwanda",
                                "continent": "africa",
                                "img": "/img/rwanda-logo.jpg",
                                "dailyCost": 750,
                                "durationMin": 5,
                                "durationMax": 8,
                                "tripTypes": [
                                        "youth",
                                        "honeymoon"
                                ],
                                "activities": [
                                        "safari",
                                        "mountains"
                                ],
                                "bestTime": "يونيو - سبتمبر"
                        },
                        {
                                "id": "southafrica",
                                "nameAr": "جنوب افريقيا",
                                "nameEn": "South Africa",
                                "continent": "africa",
                                "img": "/img/south- africa.jpg",
                                "dailyCost": 300,
                                "durationMin": 7,
                                "durationMax": 12,
                                "tripTypes": [
                                        "youth",
                                        "family",
                                        "honeymoon"
                                ],
                                "activities": [
                                        "safari",
                                        "landmarks",
                                        "mountains",
                                        "beaches"
                                ],
                                "bestTime": "مايو - سبتمبر"
                        },
                        {
                                "id": "tanzania",
                                "nameAr": "تنزانيا",
                                "nameEn": "Tanzania",
                                "continent": "africa",
                                "img": "/img/Tanzania.jpg",
                                "dailyCost": 620,
                                "durationMin": 6,
                                "durationMax": 10,
                                "tripTypes": [
                                        "youth",
                                        "family",
                                        "honeymoon"
                                ],
                                "activities": [
                                        "safari",
                                        "beaches"
                                ],
                                "bestTime": "يونيو - أكتوبر"
                        },
                        {
                                "id": "ethiopia",
                                "nameAr": "اثيوبيا",
                                "nameEn": "Ethiopia",
                                "continent": "africa",
                                "img": "/img/ethiopia-logo.jpg",
                                "dailyCost": 95,
                                "durationMin": 5,
                                "durationMax": 9,
                                "tripTypes": [
                                        "youth"
                                ],
                                "activities": [
                                        "mountains",
                                        "landmarks"
                                ],
                                "bestTime": "أكتوبر - يناير"
                        },
                        {
                                "id": "namibia",
                                "nameAr": "ناميبيا",
                                "nameEn": "Namibia",
                                "continent": "africa",
                                "img": "/img/namibia-logo.jpg",
                                "dailyCost": 350,
                                "durationMin": 7,
                                "durationMax": 12,
                                "tripTypes": [
                                        "youth",
                                        "honeymoon"
                                ],
                                "activities": [
                                        "safari",
                                        "mountains"
                                ],
                                "bestTime": "مايو - أكتوبر"
                        },
                        {
                                "id": "uganda",
                                "nameAr": "اوغندا",
                                "nameEn": "Uganda",
                                "continent": "africa",
                                "img": "/img/uganda-logo.jpg",
                                "dailyCost": 560,
                                "durationMin": 5,
                                "durationMax": 8,
                                "tripTypes": [
                                        "youth"
                                ],
                                "activities": [
                                        "safari",
                                        "mountains"
                                ],
                                "bestTime": "يونيو - سبتمبر"
                        },
                        {
                                "id": "seychelles",
                                "nameAr": "سيشل",
                                "nameEn": "Seychelles",
                                "continent": "africa",
                                "img": "/img/seychelles-logo.jpg",
                                "dailyCost": 850,
                                "durationMin": 5,
                                "durationMax": 9,
                                "tripTypes": [
                                        "honeymoon"
                                ],
                                "activities": [
                                        "beaches",
                                        "sea",
                                        "resorts"
                                ],
                                "bestTime": "أبريل - مايو"
                        },
                        {
                                "id": "mauritius",
                                "nameAr": "موريشيوس",
                                "nameEn": "Mauritius",
                                "continent": "africa",
                                "img": "/img/mauritius-logo.jpg",
                                "dailyCost": 500,
                                "durationMin": 6,
                                "durationMax": 10,
                                "tripTypes": [
                                        "honeymoon",
                                        "family"
                                ],
                                "activities": [
                                        "beaches",
                                        "sea",
                                        "resorts"
                                ],
                                "bestTime": "مايو - ديسمبر"
                        },
                        {
                                "id": "algeria",
                                "nameAr": "الجزائر",
                                "nameEn": "Algeria",
                                "continent": "africa",
                                "img": "/img/algeria-logo.jpg",
                                "dailyCost": 170,
                                "durationMin": 5,
                                "durationMax": 9,
                                "tripTypes": [
                                        "youth",
                                        "family"
                                ],
                                "activities": [
                                        "landmarks",
                                        "mountains"
                                ],
                                "bestTime": "مارس - مايو"
                        },
                        {
                                "id": "nigeria",
                                "nameAr": "نيجيريا",
                                "nameEn": "Nigeria",
                                "continent": "africa",
                                "img": "/img/nigeria-logo.jpg",
                                "dailyCost": 230,
                                "durationMin": 4,
                                "durationMax": 7,
                                "tripTypes": [
                                        "youth"
                                ],
                                "activities": [
                                        "landmarks"
                                ],
                                "bestTime": "نوفمبر - فبراير"
                        },
                        {
                                "id": "ghana",
                                "nameAr": "غانا",
                                "nameEn": "Ghana",
                                "continent": "africa",
                                "img": "/img/ghana-logo.jpg",
                                "dailyCost": 200,
                                "durationMin": 5,
                                "durationMax": 8,
                                "tripTypes": [
                                        "youth"
                                ],
                                "activities": [
                                        "beaches",
                                        "landmarks"
                                ],
                                "bestTime": "نوفمبر - مارس"
                        },
                        {
                                "id": "senegal",
                                "nameAr": "السنغال",
                                "nameEn": "Senegal",
                                "continent": "africa",
                                "img": "/img/senegal-logo.jpg",
                                "dailyCost": 220,
                                "durationMin": 5,
                                "durationMax": 8,
                                "tripTypes": [
                                        "youth"
                                ],
                                "activities": [
                                        "beaches",
                                        "landmarks"
                                ],
                                "bestTime": "نوفمبر - مايو"
                        },
                        {
                                "id": "ivorycoast",
                                "nameAr": "ساحل العاج",
                                "nameEn": "Ivory Coast",
                                "continent": "africa",
                                "img": "/img/ivorycoast-logo.jpg",
                                "dailyCost": 240,
                                "durationMin": 5,
                                "durationMax": 8,
                                "tripTypes": [
                                        "youth"
                                ],
                                "activities": [
                                        "beaches",
                                        "landmarks"
                                ],
                                "bestTime": "نوفمبر - فبراير"
                        },
                        {
                                "id": "cameroon",
                                "nameAr": "الكاميرون",
                                "nameEn": "Cameroon",
                                "continent": "africa",
                                "img": "/img/cameroon-logo.jpg",
                                "dailyCost": 230,
                                "durationMin": 5,
                                "durationMax": 8,
                                "tripTypes": [
                                        "youth"
                                ],
                                "activities": [
                                        "mountains",
                                        "safari"
                                ],
                                "bestTime": "نوفمبر - فبراير"
                        },
                        {
                                "id": "gabon",
                                "nameAr": "الغابون",
                                "nameEn": "Gabon",
                                "continent": "africa",
                                "img": "/img/gabon-logo.jpg",
                                "dailyCost": 400,
                                "durationMin": 5,
                                "durationMax": 8,
                                "tripTypes": [
                                        "youth"
                                ],
                                "activities": [
                                        "safari"
                                ],
                                "bestTime": "يونيو - سبتمبر"
                        },
                        {
                                "id": "congo",
                                "nameAr": "الكونغو",
                                "nameEn": "Republic of Congo",
                                "continent": "africa",
                                "img": "/img/congo-logo.jpg",
                                "dailyCost": 380,
                                "durationMin": 5,
                                "durationMax": 8,
                                "tripTypes": [
                                        "youth"
                                ],
                                "activities": [
                                        "safari"
                                ],
                                "bestTime": "يونيو - سبتمبر"
                        },
                        {
                                "id": "zambia",
                                "nameAr": "زامبيا",
                                "nameEn": "Zambia",
                                "continent": "africa",
                                "img": "/img/zambia-logo.jpg",
                                "dailyCost": 480,
                                "durationMin": 6,
                                "durationMax": 9,
                                "tripTypes": [
                                        "youth",
                                        "honeymoon"
                                ],
                                "activities": [
                                        "safari"
                                ],
                                "bestTime": "مايو - أكتوبر"
                        },
                        {
                                "id": "zimbabwe",
                                "nameAr": "زيمبابوي",
                                "nameEn": "Zimbabwe",
                                "continent": "africa",
                                "img": "/img/zimbabwe-logo.jpg",
                                "dailyCost": 420,
                                "durationMin": 5,
                                "durationMax": 8,
                                "tripTypes": [
                                        "youth",
                                        "honeymoon"
                                ],
                                "activities": [
                                        "safari",
                                        "landmarks"
                                ],
                                "bestTime": "مايو - أكتوبر"
                        },
                        {
                                "id": "botswana",
                                "nameAr": "بوتسوانا",
                                "nameEn": "Botswana",
                                "continent": "africa",
                                "img": "/img/botswana-logo.avif",
                                "dailyCost": 650,
                                "durationMin": 5,
                                "durationMax": 9,
                                "tripTypes": [
                                        "youth",
                                        "honeymoon"
                                ],
                                "activities": [
                                        "safari"
                                ],
                                "bestTime": "مايو - أكتوبر"
                        },
                        {
                                "id": "mozambique",
                                "nameAr": "موزمبيق",
                                "nameEn": "Mozambique",
                                "continent": "africa",
                                "img": "/img/mozambique-logo.avif",
                                "dailyCost": 350,
                                "durationMin": 5,
                                "durationMax": 9,
                                "tripTypes": [
                                        "honeymoon",
                                        "youth"
                                ],
                                "activities": [
                                        "beaches",
                                        "sea"
                                ],
                                "bestTime": "مايو - نوفمبر"
                        },
                        {
                                "id": "malawi",
                                "nameAr": "مالاوي",
                                "nameEn": "Malawi",
                                "continent": "africa",
                                "img": "/img/malawi-logo.avif",
                                "dailyCost": 250,
                                "durationMin": 5,
                                "durationMax": 8,
                                "tripTypes": [
                                        "youth"
                                ],
                                "activities": [
                                        "safari",
                                        "beaches"
                                ],
                                "bestTime": "مايو - أكتوبر"
                        },
                        {
                                "id": "madagascar",
                                "nameAr": "مدغشقر",
                                "nameEn": "Madagascar",
                                "continent": "africa",
                                "img": "/img/madagascar-logo.webp",
                                "dailyCost": 280,
                                "durationMin": 7,
                                "durationMax": 12,
                                "tripTypes": [
                                        "youth",
                                        "honeymoon"
                                ],
                                "activities": [
                                        "beaches",
                                        "safari"
                                ],
                                "bestTime": "أبريل - نوفمبر"
                        },
                        {
                                "id": "comoros",
                                "ready": false,
                                "nameAr": "جزر القمر",
                                "nameEn": "Comoros",
                                "continent": "africa",
                                "img": "/img/comoros-logo.jpg",
                                "dailyCost": 300,
                                "durationMin": 5,
                                "durationMax": 8,
                                "tripTypes": [
                                        "honeymoon"
                                ],
                                "activities": [
                                        "beaches",
                                        "sea"
                                ],
                                "bestTime": "مايو - نوفمبر"
                        },
                        {
                                "id": "capeverde",
                                "nameAr": " الراس الاخضر",
                                "nameEn": "Cape Verde",
                                "continent": "africa",
                                "img": "/img/capeverde-logo.avif",
                                "dailyCost": 350,
                                "durationMin": 5,
                                "durationMax": 9,
                                "tripTypes": [
                                        "honeymoon",
                                        "family"
                                ],
                                "activities": [
                                        "beaches",
                                        "sea",
                                        "resorts"
                                ],
                                "bestTime": "نوفمبر - يونيو"
                        },
                        {
                                "id": "gambia",
                                "nameAr": "غامبيا",
                                "nameEn": "Gambia",
                                "continent": "africa",
                                "img": "/img/gambia-logo.avif",
                                "dailyCost": 220,
                                "durationMin": 5,
                                "durationMax": 8,
                                "tripTypes": [
                                        "youth",
                                        "family"
                                ],
                                "activities": [
                                        "beaches"
                                ],
                                "bestTime": "نوفمبر - مايو"
                        },
                        {
                                "id": "benin",
                                "nameAr": "بنين",
                                "nameEn": "Benin",
                                "continent": "africa",
                                "img": "/img/benin-logo.jpg",
                                "dailyCost": 200,
                                "durationMin": 4,
                                "durationMax": 7,
                                "tripTypes": [
                                        "youth"
                                ],
                                "activities": [
                                        "landmarks"
                                ],
                                "bestTime": "نوفمبر - فبراير"
                        },
                        {
                                "id": "togo",
                                "nameAr": "توغو",
                                "nameEn": "Togo",
                                "continent": "africa",
                                "img": "/img/togo-logo.webp",
                                "dailyCost": 200,
                                "durationMin": 4,
                                "durationMax": 7,
                                "tripTypes": [
                                        "youth"
                                ],
                                "activities": [
                                        "beaches",
                                        "landmarks"
                                ],
                                "bestTime": "نوفمبر - مارس"
                        },
                        {
                                "id": "djibouti",
                                "nameAr": "جيبوتي",
                                "nameEn": "Djibouti",
                                "continent": "africa",
                                "img": "/img/djibouti-logo.jpg",
                                "dailyCost": 300,
                                "durationMin": 4,
                                "durationMax": 7,
                                "tripTypes": [
                                        "youth"
                                ],
                                "activities": [
                                        "sea",
                                        "mountains"
                                ],
                                "bestTime": "نوفمبر - فبراير"
                        },
                        {
                                "id": "angola",
                                "nameAr": "انغولا",
                                "nameEn": "Angola",
                                "continent": "africa",
                                "img": "/img/angola-logo.jpg",
                                "dailyCost": 450,
                                "durationMin": 5,
                                "durationMax": 8,
                                "tripTypes": [
                                        "youth"
                                ],
                                "activities": [
                                        "beaches",
                                        "landmarks"
                                ],
                                "bestTime": "مايو - سبتمبر"
                        },
                        {
                                "id": "mauritania",
                                "nameAr": "موريتانيا",
                                "nameEn": "Mauritania",
                                "continent": "africa",
                                "img": "/img/mauritania-logo.jpg",
                                "dailyCost": 230,
                                "durationMin": 4,
                                "durationMax": 7,
                                "tripTypes": [
                                        "youth"
                                ],
                                "activities": [
                                        "mountains",
                                        "landmarks"
                                ],
                                "bestTime": "نوفمبر - فبراير"
                        },
                        {
                                "id": "guinea",
                                "nameAr": "غينيا",
                                "nameEn": "Guinea",
                                "continent": "africa",
                                "img": "/img/guinea-logo.jpg",
                                "dailyCost": 230,
                                "durationMin": 4,
                                "durationMax": 7,
                                "tripTypes": [
                                        "youth"
                                ],
                                "activities": [
                                        "beaches",
                                        "mountains"
                                ],
                                "bestTime": "نوفمبر - مارس"
                        },
                        {
                                "id": "iceland",
                                "nameAr": "ايسلندا",
                                "nameEn": "Iceland",
                                "continent": "europe",
                                "img": "/img/icelanda.jpg",
                                "dailyCost": 750,
                                "durationMin": 6,
                                "durationMax": 10,
                                "tripTypes": [
                                        "honeymoon",
                                        "youth"
                                ],
                                "activities": [
                                        "mountains",
                                        "landmarks"
                                ],
                                "bestTime": "يونيو - أغسطس"
                        },
                        {
                                "id": "uk",

                                "nameAr": "بريطانيا",
                                "nameEn": "United Kingdom",
                                "continent": "europe",
                                "img": "/img/coming-soon.jpg",
                                "dailyCost": 690,
                                "durationMin": 6,
                                "durationMax": 10,
                                "tripTypes": [
                                        "family",
                                        "youth"
                                ],
                                "activities": [
                                        "landmarks",
                                        "museums"
                                ],
                                "bestTime": "مايو - سبتمبر"
                        },
                        {
                                "id": "france",
                                "nameAr": "فرنسا",
                                "nameEn": "France",
                                "continent": "europe",
                                "img": "/img/france-flag.jpg",
                                "dailyCost": 550,
                                "durationMin": 6,
                                "durationMax": 10,
                                "tripTypes": [
                                        "family",
                                        "honeymoon",
                                        "youth"
                                ],
                                "activities": [
                                        "landmarks",
                                        "museums"
                                ],
                                "bestTime": "أبريل - يونيو"
                        },
                        {
                                "id": "italy",
                                "nameAr": "ايطاليا",
                                "nameEn": "Italy",
                                "continent": "europe",
                                "img": "/img/italy logo.webp",
                                "dailyCost": 660,
                                "durationMin": 7,
                                "durationMax": 12,
                                "tripTypes": [
                                        "honeymoon",
                                        "family",
                                        "youth"
                                ],
                                "activities": [
                                        "landmarks",
                                        "museums",
                                        "beaches"
                                ],
                                "bestTime": "أبريل - يونيو"
                        },
                        {
                                "id": "spain",
                                "nameAr": "إسبانيا",
                                "nameEn": "Spain",
                                "continent": "europe",
                                "img": "/img/spain-flag.jpg",
                                "dailyCost": 420,
                                "durationMin": 6,
                                "durationMax": 10,
                                "tripTypes": [
                                        "youth",
                                        "family",
                                        "honeymoon"
                                ],
                                "activities": [
                                        "beaches",
                                        "landmarks",
                                        "museums"
                                ],
                                "bestTime": "أبريل - يونيو"
                        },
                        {
                                "id": "germany",
                                "nameAr": "ألمانيا",
                                "nameEn": "Germany",
                                "continent": "europe",
                                "img": "/img/germany-flag.jpg",
                                "dailyCost": 460,
                                "durationMin": 6,
                                "durationMax": 10,
                                "tripTypes": [
                                        "family",
                                        "youth"
                                ],
                                "activities": [
                                        "landmarks",
                                        "museums"
                                ],
                                "bestTime": "مايو - سبتمبر"
                        },
                        {
                                "id": "switzerland",
                                "nameAr": "سويسرا",
                                "nameEn": "Switzerland",
                                "continent": "europe",
                                "img": "/img/Switzerland logo.jpg",
                                "dailyCost": 850,
                                "durationMin": 5,
                                "durationMax": 9,
                                "tripTypes": [
                                        "honeymoon",
                                        "family"
                                ],
                                "activities": [
                                        "mountains",
                                        "landmarks"
                                ],
                                "bestTime": "يونيو - سبتمبر"
                        },
                        {
                                "id": "greece",
                                "nameAr": "اليونان",
                                "nameEn": "Greece",
                                "continent": "europe",
                                "img": "/img/greece-flag.jpg",
                                "dailyCost": 380,
                                "durationMin": 6,
                                "durationMax": 10,
                                "tripTypes": [
                                        "honeymoon",
                                        "youth",
                                        "family"
                                ],
                                "activities": [
                                        "beaches",
                                        "sea",
                                        "landmarks"
                                ],
                                "bestTime": "مايو - سبتمبر"
                        },
                        {
                                "id": "portugal",
                                "nameAr": "البرتغال",
                                "nameEn": "Portugal",
                                "continent": "europe",
                                "img": "/img/portugal-flag.jpg",
                                "dailyCost": 350,
                                "durationMin": 6,
                                "durationMax": 9,
                                "tripTypes": [
                                        "youth",
                                        "family",
                                        "honeymoon"
                                ],
                                "activities": [
                                        "beaches",
                                        "landmarks"
                                ],
                                "bestTime": "أبريل - يونيو"
                        },
                        {
                                "id": "netherlands",
                                "nameAr": "هولندا",
                                "nameEn": "Netherlands",
                                "continent": "europe",
                                "img": "/img/netherlands-flag.jpg",
                                "dailyCost": 560,
                                "durationMin": 4,
                                "durationMax": 7,
                                "tripTypes": [
                                        "family",
                                        "youth"
                                ],
                                "activities": [
                                        "landmarks",
                                        "museums"
                                ],
                                "bestTime": "أبريل - يونيو"
                        },
                        {
                                "id": "austria",
                                "nameAr": "النمسا",
                                "nameEn": "Austria",
                                "continent": "europe",
                                "img": "/img/austria-flag.jpg",
                                "dailyCost": 480,
                                "durationMin": 5,
                                "durationMax": 8,
                                "tripTypes": [
                                        "family",
                                        "honeymoon"
                                ],
                                "activities": [
                                        "mountains",
                                        "landmarks"
                                ],
                                "bestTime": "يونيو - سبتمبر"
                        },
                        {
                                "id": "czechrepublic",
                                "nameAr": "التشيك",
                                "nameEn": "Czech Republic",
                                "continent": "europe",
                                "img": "/img/czechrepublic-flag.jpg",
                                "dailyCost": 300,
                                "durationMin": 4,
                                "durationMax": 7,
                                "tripTypes": [
                                        "youth",
                                        "family"
                                ],
                                "activities": [
                                        "landmarks",
                                        "museums"
                                ],
                                "bestTime": "أبريل - يونيو"
                        },
                        {
                                "id": "hungary",
                                "nameAr": "المجر",
                                "nameEn": "Hungary",
                                "continent": "europe",
                                "img": "/img/hungary-flag.jpg",
                                "dailyCost": 270,
                                "durationMin": 4,
                                "durationMax": 7,
                                "tripTypes": [
                                        "youth",
                                        "family"
                                ],
                                "activities": [
                                        "landmarks",
                                        "museums"
                                ],
                                "bestTime": "أبريل - يونيو"
                        },
                        {
                                "id": "poland",
                                "nameAr": "بولندا",
                                "nameEn": "Poland",
                                "continent": "europe",
                                "img": "/img/poland-flag.jpg",
                                "dailyCost": 280,
                                "durationMin": 5,
                                "durationMax": 8,
                                "tripTypes": [
                                        "family",
                                        "youth"
                                ],
                                "activities": [
                                        "landmarks",
                                        "museums"
                                ],
                                "bestTime": "مايو - سبتمبر"
                        },
                        {
                                "id": "croatia",
                                "nameAr": "كرواتيا",
                                "nameEn": "Croatia",
                                "continent": "europe",
                                "img": "/img/croatia-flag.jpg",
                                "dailyCost": 350,
                                "durationMin": 6,
                                "durationMax": 9,
                                "tripTypes": [
                                        "youth",
                                        "honeymoon",
                                        "family"
                                ],
                                "activities": [
                                        "beaches",
                                        "sea",
                                        "landmarks"
                                ],
                                "bestTime": "مايو - سبتمبر"
                        },
                        {
                                "id": "norway",
                                "nameAr": "النرويج",
                                "nameEn": "Norway",
                                "continent": "europe",
                                "img": "/img/norway-flag.jpg",
                                "dailyCost": 750,
                                "durationMin": 6,
                                "durationMax": 10,
                                "tripTypes": [
                                        "honeymoon",
                                        "youth"
                                ],
                                "activities": [
                                        "mountains",
                                        "landmarks"
                                ],
                                "bestTime": "يونيو - أغسطس"
                        },
                        {
                                "id": "sweden",
                                "nameAr": "السويد",
                                "nameEn": "Sweden",
                                "continent": "europe",
                                "img": "/img/sweden-flag.jpg",
                                "dailyCost": 580,
                                "durationMin": 5,
                                "durationMax": 8,
                                "tripTypes": [
                                        "family",
                                        "youth"
                                ],
                                "activities": [
                                        "landmarks",
                                        "mountains"
                                ],
                                "bestTime": "مايو - أغسطس"
                        },
                        {
                                "id": "denmark",
                                "nameAr": "الدنمارك",
                                "nameEn": "Denmark",
                                "continent": "europe",
                                "img": "/img/denmark-flag.jpg",
                                "dailyCost": 580,
                                "durationMin": 4,
                                "durationMax": 7,
                                "tripTypes": [
                                        "family",
                                        "youth"
                                ],
                                "activities": [
                                        "landmarks",
                                        "museums"
                                ],
                                "bestTime": "مايو - أغسطس"
                        },
                        {
                                "id": "finland",
                                "nameAr": "فنلندا",
                                "nameEn": "Finland",
                                "continent": "europe",
                                "img": "/img/finland-flag.jpg",
                                "dailyCost": 500,
                                "durationMin": 5,
                                "durationMax": 8,
                                "tripTypes": [
                                        "honeymoon",
                                        "youth"
                                ],
                                "activities": [
                                        "mountains",
                                        "landmarks"
                                ],
                                "bestTime": "ديسمبر - مارس"
                        },
                        {
                                "id": "ireland",
                                "nameAr": "أيرلندا",
                                "nameEn": "Ireland",
                                "continent": "europe",
                                "img": "/img/ireland-flag.jpg",
                                "dailyCost": 560,
                                "durationMin": 5,
                                "durationMax": 8,
                                "tripTypes": [
                                        "family",
                                        "youth",
                                        "honeymoon"
                                ],
                                "activities": [
                                        "landmarks",
                                        "mountains"
                                ],
                                "bestTime": "مايو - سبتمبر"
                        },
                        {
                                "id": "russia",

                                "nameAr": "روسيا",
                                "nameEn": "Russia",
                                "continent": "europe",
                                "img": "/img/coming-soon.jpg",
                                "dailyCost": 300,
                                "durationMin": 6,
                                "durationMax": 10,
                                "tripTypes": [
                                        "youth",
                                        "family"
                                ],
                                "activities": [
                                        "landmarks",
                                        "museums"
                                ],
                                "bestTime": "مايو - سبتمبر"
                        },
                        {
                                "id": "ukraine",

                                "nameAr": "أوكرانيا",
                                "nameEn": "Ukraine",
                                "continent": "europe",
                                "img": "/img/coming-soon.jpg",
                                "dailyCost": 90,
                                "durationMin": 5,
                                "durationMax": 8,
                                "tripTypes": [
                                        "youth"
                                ],
                                "activities": [
                                        "landmarks",
                                        "museums"
                                ],
                                "bestTime": "مايو - سبتمبر"
                        },
                        {
                                "id": "serbia",
                                "nameAr": "صربيا",
                                "nameEn": "Serbia",
                                "continent": "europe",
                                "img": "/img/serbia-flag.jpg",
                                "dailyCost": 170,
                                "durationMin": 4,
                                "durationMax": 7,
                                "tripTypes": [
                                        "youth"
                                ],
                                "activities": [
                                        "landmarks",
                                        "museums"
                                ],
                                "bestTime": "أبريل - أكتوبر"
                        },
                        {
                                "id": "belgium",
                                "nameAr": "بلجيكا",
                                "nameEn": "Belgium",
                                "continent": "europe",
                                "img": "/img/belgium-flag.jpg",
                                "dailyCost": 520,
                                "durationMin": 4,
                                "durationMax": 6,
                                "tripTypes": [
                                        "family",
                                        "youth"
                                ],
                                "activities": [
                                        "landmarks",
                                        "museums"
                                ],
                                "bestTime": "أبريل - سبتمبر"
                        },
                        {
                                "id": "luxembourg",
                                "nameAr": "لوكسمبورغ",
                                "nameEn": "Luxembourg",
                                "continent": "europe",
                                "img": "/img/coming-soon.jpg",
                                "dailyCost": 600,
                                "durationMin": 2,
                                "durationMax": 4,
                                "tripTypes": [
                                        "family"
                                ],
                                "activities": [
                                        "landmarks"
                                ],
                                "bestTime": "أبريل - سبتمبر"
                        },
                        {
                                "id": "monaco",

                                "nameAr": "موناكو",
                                "nameEn": "Monaco",
                                "continent": "europe",
                                "img": "/img/coming-soon.jpg",
                                "dailyCost": 950,
                                "durationMin": 2,
                                "durationMax": 4,
                                "tripTypes": [
                                        "honeymoon"
                                ],
                                "activities": [
                                        "beaches",
                                        "landmarks",
                                        "resorts"
                                ],
                                "bestTime": "مايو - سبتمبر"
                        },
                        {
                                "id": "andorra",
                                "nameAr": "أندورا",
                                "nameEn": "Andorra",
                                "continent": "europe",
                                "img": "/img/coming-soon.jpg",
                                "dailyCost": 400,
                                "durationMin": 3,
                                "durationMax": 6,
                                "tripTypes": [
                                        "family",
                                        "youth"
                                ],
                                "activities": [
                                        "mountains"
                                ],
                                "bestTime": "ديسمبر - مارس"
                        },
                        {
                                "id": "liechtenstein",
                                "nameAr": "ليختنشتاين",
                                "nameEn": "Liechtenstein",
                                "continent": "europe",
                                "img": "/img/coming-soon.jpg",
                                "dailyCost": 550,
                                "durationMin": 2,
                                "durationMax": 4,
                                "tripTypes": [
                                        "family"
                                ],
                                "activities": [
                                        "mountains"
                                ],
                                "bestTime": "يونيو - سبتمبر"
                        },
                        {
                                "id": "malta",
                                "nameAr": "مالطا",
                                "nameEn": "Malta",
                                "continent": "europe",
                                "img": "/img/malta-flag.jpg",
                                "dailyCost": 380,
                                "durationMin": 5,
                                "durationMax": 8,
                                "tripTypes": [
                                        "youth",
                                        "honeymoon",
                                        "family"
                                ],
                                "activities": [
                                        "beaches",
                                        "sea",
                                        "landmarks"
                                ],
                                "bestTime": "مايو - أكتوبر"
                        },
                        {
                                "id": "cyprus",
                                "nameAr": "قبرص",
                                "nameEn": "Cyprus",
                                "continent": "europe",
                                "img": "/img/cyprus-flag.jpg",
                                "dailyCost": 360,
                                "durationMin": 5,
                                "durationMax": 8,
                                "tripTypes": [
                                        "family",
                                        "honeymoon"
                                ],
                                "activities": [
                                        "beaches",
                                        "sea",
                                        "landmarks"
                                ],
                                "bestTime": "مايو - أكتوبر"
                        },
                        {
                                "id": "slovenia",
                                "nameAr": "سلوفينيا",
                                "nameEn": "Slovenia",
                                "continent": "europe",
                                "img": "/img/slovenia-flag.jpg",
                                "dailyCost": 330,
                                "durationMin": 4,
                                "durationMax": 7,
                                "tripTypes": [
                                        "family",
                                        "honeymoon"
                                ],
                                "activities": [
                                        "mountains",
                                        "landmarks"
                                ],
                                "bestTime": "مايو - سبتمبر"
                        },
                        {
                                "id": "slovakia",
                                "nameAr": "سلوفاكيا",
                                "nameEn": "Slovakia",
                                "continent": "europe",
                                "img": "/img/slovakia-flag.jpg",
                                "dailyCost": 260,
                                "durationMin": 4,
                                "durationMax": 6,
                                "tripTypes": [
                                        "youth",
                                        "family"
                                ],
                                "activities": [
                                        "mountains",
                                        "landmarks"
                                ],
                                "bestTime": "مايو - سبتمبر"
                        },
                        {
                                "id": "romania",
                                "nameAr": "رومانيا",
                                "nameEn": "Romania",
                                "continent": "europe",
                                "img": "/img/romania-flag.jpg",
                                "dailyCost": 220,
                                "durationMin": 5,
                                "durationMax": 8,
                                "tripTypes": [
                                        "youth",
                                        "family"
                                ],
                                "activities": [
                                        "mountains",
                                        "landmarks"
                                ],
                                "bestTime": "مايو - سبتمبر"
                        },
                        {
                                "id": "bulgaria",
                                "nameAr": "بلغاريا",
                                "nameEn": "Bulgaria",
                                "continent": "europe",
                                "img": "/img/bulgaria-flag.jpg",
                                "dailyCost": 190,
                                "durationMin": 5,
                                "durationMax": 8,
                                "tripTypes": [
                                        "youth",
                                        "family"
                                ],
                                "activities": [
                                        "beaches",
                                        "mountains"
                                ],
                                "bestTime": "مايو - سبتمبر"
                        },
                        {
                                "id": "albania",
                                "nameAr": "ألبانيا",
                                "nameEn": "Albania",
                                "continent": "europe",
                                "img": "/img/albania-flag.jpg",
                                "dailyCost": 170,
                                "durationMin": 5,
                                "durationMax": 8,
                                "tripTypes": [
                                        "youth"
                                ],
                                "activities": [
                                        "beaches",
                                        "mountains"
                                ],
                                "bestTime": "مايو - سبتمبر"
                        },
                        {
                                "id": "bosnia",
                                "nameAr": "البوسنة",
                                "nameEn": "Bosnia and Herzegovina",
                                "continent": "europe",
                                "img": "/img/bosnia-flag.jpg",
                                "dailyCost": 180,
                                "durationMin": 4,
                                "durationMax": 7,
                                "tripTypes": [
                                        "youth"
                                ],
                                "activities": [
                                        "mountains",
                                        "landmarks"
                                ],
                                "bestTime": "مايو - سبتمبر"
                        },
                        {
                                "id": "montenegro",
                                "nameAr": "الجبل الأسود",
                                "nameEn": "Montenegro",
                                "continent": "europe",
                                "img": "/img/montenegro-flag.jpg",
                                "dailyCost": 250,
                                "durationMin": 4,
                                "durationMax": 7,
                                "tripTypes": [
                                        "youth",
                                        "honeymoon"
                                ],
                                "activities": [
                                        "beaches",
                                        "mountains"
                                ],
                                "bestTime": "مايو - سبتمبر"
                        },
                        {
                                "id": "northmacedonia",
                                "nameAr": "مقدونيا الشمالية",
                                "nameEn": "North Macedonia",
                                "continent": "europe",
                                "img": "/img/northmacedonia-flag.jpg",
                                "dailyCost": 170,
                                "durationMin": 4,
                                "durationMax": 6,
                                "tripTypes": [
                                        "youth"
                                ],
                                "activities": [
                                        "mountains",
                                        "landmarks"
                                ],
                                "bestTime": "مايو - سبتمبر"
                        },
                        {
                                "id": "moldova",
                                "nameAr": "مولدوفا",
                                "nameEn": "Moldova",
                                "continent": "europe",
                                "img": "/img/coming-soon.jpg",
                                "dailyCost": 150,
                                "durationMin": 3,
                                "durationMax": 5,
                                "tripTypes": [
                                        "youth"
                                ],
                                "activities": [
                                        "landmarks"
                                ],
                                "bestTime": "مايو - سبتمبر"
                        },
                        {
                                "id": "belarus",
                                "nameAr": "بيلاروسيا",
                                "nameEn": "Belarus",
                                "continent": "europe",
                                "img": "/img/coming-soon.jpg",
                                "dailyCost": 150,
                                "durationMin": 4,
                                "durationMax": 7,
                                "tripTypes": [
                                        "youth"
                                ],
                                "activities": [
                                        "landmarks"
                                ],
                                "bestTime": "مايو - سبتمبر"
                        },
                        {
                                "id": "lithuania",
                                "nameAr": "ليتوانيا",
                                "nameEn": "Lithuania",
                                "continent": "europe",
                                "img": "/img/lithuania-flag.jpg",
                                "dailyCost": 260,
                                "durationMin": 4,
                                "durationMax": 6,
                                "tripTypes": [
                                        "youth",
                                        "family"
                                ],
                                "activities": [
                                        "landmarks"
                                ],
                                "bestTime": "مايو - سبتمبر"
                        },
                        {
                                "id": "latvia",
                                "nameAr": "لاتفيا",
                                "nameEn": "Latvia",
                                "continent": "europe",
                                "img": "/img/latvia-flag.jpg",
                                "dailyCost": 260,
                                "durationMin": 4,
                                "durationMax": 6,
                                "tripTypes": [
                                        "youth",
                                        "family"
                                ],
                                "activities": [
                                        "landmarks"
                                ],
                                "bestTime": "مايو - سبتمبر"
                        },
                        {
                                "id": "estonia",
                                "nameAr": "إستونيا",
                                "nameEn": "Estonia",
                                "continent": "europe",
                                "img": "/img/estonia-flag.jpg",
                                "dailyCost": 290,
                                "durationMin": 4,
                                "durationMax": 6,
                                "tripTypes": [
                                        "youth",
                                        "family"
                                ],
                                "activities": [
                                        "landmarks"
                                ],
                                "bestTime": "مايو - سبتمبر"
                        },
                        {
                                "id": "sanmarino",

                                "nameAr": "سان مارينو",
                                "nameEn": "San Marino",
                                "continent": "europe",
                                "img": "/img/coming-soon.jpg",
                                "dailyCost": 350,
                                "durationMin": 2,
                                "durationMax": 3,
                                "tripTypes": [
                                        "family"
                                ],
                                "activities": [
                                        "landmarks"
                                ],
                                "bestTime": "أبريل - سبتمبر"
                        },
                        {
                                "id": "kosovo",
                                "nameAr": "كوسوفو",
                                "nameEn": "Kosovo",
                                "continent": "europe",
                                "img": "/img/coming-soon.jpg",
                                "dailyCost": 150,
                                "durationMin": 3,
                                "durationMax": 5,
                                "tripTypes": [
                                        "youth"
                                ],
                                "activities": [
                                        "landmarks",
                                        "mountains"
                                ],
                                "bestTime": "مايو - سبتمبر"
                        },
                        {
                                "id": "usa",
                                "nameAr": "امريكا",
                                "nameEn": "USA",
                                "continent": "north_america",
                                "img": "/img/usa lgo.jpg",
                                "dailyCost": 940,
                                "durationMin": 8,
                                "durationMax": 15,
                                "tripTypes": [
                                        "family",
                                        "youth",
                                        "honeymoon"
                                ],
                                "activities": [
                                        "landmarks",
                                        "amusement",
                                        "museums",
                                        "mountains",
                                        "beaches"
                                ],
                                "bestTime": "أبريل - يونيو"
                        },
                        {
                                "id": "canada",
                                "nameAr": "كندا",
                                "nameEn": "Canada",
                                "continent": "north_america",
                                "img": "/img/Canada logo.jpg",
                                "dailyCost": 620,
                                "durationMin": 7,
                                "durationMax": 12,
                                "tripTypes": [
                                        "family",
                                        "youth",
                                        "honeymoon"
                                ],
                                "activities": [
                                        "mountains",
                                        "landmarks",
                                        "museums"
                                ],
                                "bestTime": "يونيو - سبتمبر"
                        },
                        {
                                "id": "mexico",
                                "nameAr": "المكسيك",
                                "nameEn": "Mexico",
                                "continent": "north_america",
                                "img": "/img/mexico logo.jpg",
                                "dailyCost": 260,
                                "durationMin": 6,
                                "durationMax": 10,
                                "tripTypes": [
                                        "youth",
                                        "family",
                                        "honeymoon"
                                ],
                                "activities": [
                                        "beaches",
                                        "sea",
                                        "landmarks"
                                ],
                                "bestTime": "نوفمبر - أبريل"
                        },
                        {
                                "id": "costarica",
                                                                "nameAr": "كوستاريكا",
                                "nameEn": "Costa Rica",
                                "continent": "north_america",
                                "img": "/img/coming-soon.jpg",
                                "dailyCost": 340,
                                "durationMin": 6,
                                "durationMax": 10,
                                "tripTypes": [
                                        "youth",
                                        "honeymoon"
                                ],
                                "activities": [
                                        "safari",
                                        "beaches",
                                        "mountains"
                                ],
                                "bestTime": "ديسمبر - أبريل"
                        },
                        {
                                "id": "panama",
                                "nameAr": "بنما",
                                "nameEn": "Panama",
                                "continent": "north_america",
                                "img": "/img/panama-logo.jpg",
                                "dailyCost": 300,
                                "durationMin": 5,
                                "durationMax": 8,
                                "tripTypes": [
                                        "youth",
                                        "family"
                                ],
                                "activities": [
                                        "beaches",
                                        "mountains",
                                        "landmarks"
                                ],
                                "bestTime": "ديسمبر - أبريل"
                        },
                        {
                                "id": "cuba",
                                "nameAr": "كوبا",
                                "nameEn": "Cuba",
                                "continent": "north_america",
                                "img": "/img/cuba-logo.jpg",
                                "dailyCost": 260,
                                "durationMin": 6,
                                "durationMax": 9,
                                "tripTypes": [
                                        "youth",
                                        "honeymoon"
                                ],
                                "activities": [
                                        "beaches",
                                        "landmarks"
                                ],
                                "bestTime": "نوفمبر - أبريل"
                        },
                        {
                                "id": "dominican",
                                "nameAr": "جمهورية الدومينيكان",
                                "nameEn": "Dominican Republic",
                                "continent": "north_america",
                                "img": "/img/dominican-logo.jpg",
                                "dailyCost": 300,
                                "durationMin": 5,
                                "durationMax": 9,
                                "tripTypes": [
                                        "honeymoon",
                                        "family"
                                ],
                                "activities": [
                                        "beaches",
                                        "sea",
                                        "resorts"
                                ],
                                "bestTime": "ديسمبر - أبريل"
                        },
                        {
                                "id": "jamaica",
                                "nameAr": "جامايكا",
                                "nameEn": "Jamaica",
                                "continent": "north_america",
                                "img": "/img/jamaica-logo.jpg",
                                "dailyCost": 380,
                                "durationMin": 5,
                                "durationMax": 8,
                                "tripTypes": [
                                        "honeymoon",
                                        "youth"
                                ],
                                "activities": [
                                        "beaches",
                                        "sea",
                                        "resorts"
                                ],
                                "bestTime": "ديسمبر - أبريل"
                        },
                        {
                                "id": "guatemala",
                                                                "nameAr": "غواتيمالا",
                                "nameEn": "Guatemala",
                                "continent": "north_america",
                                "img": "/img/coming-soon.jpg",
                                "dailyCost": 230,
                                "durationMin": 5,
                                "durationMax": 8,
                                "tripTypes": [
                                        "youth"
                                ],
                                "activities": [
                                        "mountains",
                                        "landmarks"
                                ],
                                "bestTime": "نوفمبر - أبريل"
                        },
                        {
                                "id": "honduras",
                                                                "nameAr": "هندوراس",
                                "nameEn": "Honduras",
                                "continent": "north_america",
                                "img": "/img/coming-soon.jpg",
                                "dailyCost": 220,
                                "durationMin": 5,
                                "durationMax": 8,
                                "tripTypes": [
                                        "youth"
                                ],
                                "activities": [
                                        "beaches",
                                        "mountains"
                                ],
                                "bestTime": "نوفمبر - أبريل"
                        },
                        {
                                "id": "elsalvador",
                                                                "nameAr": "السلفادور",
                                "nameEn": "El Salvador",
                                "continent": "north_america",
                                "img": "/img/coming-soon.jpg",
                                "dailyCost": 220,
                                "durationMin": 4,
                                "durationMax": 7,
                                "tripTypes": [
                                        "youth"
                                ],
                                "activities": [
                                        "beaches",
                                        "mountains"
                                ],
                                "bestTime": "نوفمبر - أبريل"
                        },
                        {
                                "id": "nicaragua",
                                                                "nameAr": "نيكاراغوا",
                                "nameEn": "Nicaragua",
                                "continent": "north_america",
                                "img": "/img/coming-soon.jpg",
                                "dailyCost": 210,
                                "durationMin": 5,
                                "durationMax": 8,
                                "tripTypes": [
                                        "youth"
                                ],
                                "activities": [
                                        "beaches",
                                        "mountains"
                                ],
                                "bestTime": "نوفمبر - أبريل"
                        },
                        {
                                "id": "belize",
                                "ready": false,
                                "nameAr": "بليز",
                                "nameEn": "Belize",
                                "continent": "north_america",
                                "img": "/img/coming-soon.jpg",
                                "dailyCost": 350,
                                "durationMin": 5,
                                "durationMax": 8,
                                "tripTypes": [
                                        "honeymoon",
                                        "youth"
                                ],
                                "activities": [
                                        "beaches",
                                        "sea"
                                ],
                                "bestTime": "ديسمبر - أبريل"
                        },
                        {
                                "id": "bahamas",
                                "nameAr": "الباهاما",
                                "nameEn": "Bahamas",
                                "continent": "north_america",
                                "img": "/img/bahamas-logo.jpg",
                                "dailyCost": 550,
                                "durationMin": 5,
                                "durationMax": 8,
                                "tripTypes": [
                                        "honeymoon",
                                        "family"
                                ],
                                "activities": [
                                        "beaches",
                                        "sea",
                                        "resorts"
                                ],
                                "bestTime": "ديسمبر - أبريل"
                        },
                        {
                                "id": "trinidad",
                                "nameAr": "ترينيداد وتوباغو",
                                "nameEn": "Trinidad and Tobago",
                                "continent": "north_america",
                                "img": "/img/trinidad-logo.jpg",
                                "dailyCost": 350,
                                "durationMin": 4,
                                "durationMax": 7,
                                "tripTypes": [
                                        "youth",
                                        "family"
                                ],
                                "activities": [
                                        "beaches",
                                        "sea"
                                ],
                                "bestTime": "يناير - مايو"
                        },
                        {
                                "id": "barbados",
                                "nameAr": "بربادوس",
                                "nameEn": "Barbados",
                                "continent": "north_america",
                                "img": "/img/barbados-logo.jpg",
                                "dailyCost": 500,
                                "durationMin": 5,
                                "durationMax": 8,
                                "tripTypes": [
                                        "honeymoon",
                                        "family"
                                ],
                                "activities": [
                                        "beaches",
                                        "sea",
                                        "resorts"
                                ],
                                "bestTime": "ديسمبر - أبريل"
                        },
                        {
                                "id": "puertorico",
                                "ready": false,
                                "nameAr": "بورتوريكو",
                                "nameEn": "Puerto Rico",
                                "continent": "north_america",
                                "img": "/img/coming-soon.jpg",
                                "dailyCost": 420,
                                "durationMin": 5,
                                "durationMax": 8,
                                "tripTypes": [
                                        "youth",
                                        "honeymoon"
                                ],
                                "activities": [
                                        "beaches",
                                        "sea"
                                ],
                                "bestTime": "ديسمبر - أبريل"
                        },
                        {
                                "id": "brazil",
                                "nameAr": "البرازيل",
                                "nameEn": "Brazil",
                                "continent": "south_america",
                                "img": "/img/brazil logo.jpg",
                                "dailyCost": 300,
                                "durationMin": 8,
                                "durationMax": 14,
                                "tripTypes": [
                                        "youth",
                                        "family"
                                ],
                                "activities": [
                                        "beaches",
                                        "landmarks",
                                        "mountains"
                                ],
                                "bestTime": "مايو - سبتمبر"
                        },
                        {
                                "id": "argentina",
                                "nameAr": "الأرجنتين",
                                "nameEn": "Argentina",
                                "continent": "south_america",
                                "img": "/img/argentina-logo.jpg",
                                "dailyCost": 315,
                                "durationMin": 8,
                                "durationMax": 14,
                                "tripTypes": [
                                        "youth",
                                        "honeymoon"
                                ],
                                "activities": [
                                        "mountains",
                                        "landmarks"
                                ],
                                "bestTime": "أكتوبر - أبريل"
                        },
                        {
                                "id": "peru",
                                "nameAr": "بيرو",
                                "nameEn": "Peru",
                                "continent": "south_america",
                                "img": "/img/Peru log.jpeg",
                                "dailyCost": 230,
                                "durationMin": 7,
                                "durationMax": 12,
                                "tripTypes": [
                                        "youth"
                                ],
                                "activities": [
                                        "mountains",
                                        "landmarks"
                                ],
                                "bestTime": "مايو - سبتمبر"
                        },
                        {
                                "id": "chile",
                                "nameAr": "تشيلي",
                                "nameEn": "Chile",
                                "continent": "south_america",
                                "img": "/img/chile-logo.jpg",
                                "dailyCost": 350,
                                "durationMin": 7,
                                "durationMax": 12,
                                "tripTypes": [
                                        "youth",
                                        "honeymoon"
                                ],
                                "activities": [
                                        "mountains",
                                        "landmarks"
                                ],
                                "bestTime": "أكتوبر - أبريل"
                        },
                        {
                                "id": "colombia",
                                "nameAr": "كولومبيا",
                                "nameEn": "Colombia",
                                "continent": "south_america",
                                "img": "/img/colomvi logo.jpg",
                                "dailyCost": 215,
                                "durationMin": 6,
                                "durationMax": 10,
                                "tripTypes": [
                                        "youth"
                                ],
                                "activities": [
                                        "beaches",
                                        "mountains",
                                        "landmarks"
                                ],
                                "bestTime": "ديسمبر - مارس"
                        },
                        {
                                "id": "ecuador",
                                "nameAr": "الإكوادور",
                                "nameEn": "Ecuador",
                                "continent": "south_america",
                                "img": "/img/ecuador-logo.jpg",
                                "dailyCost": 215,
                                "durationMin": 6,
                                "durationMax": 10,
                                "tripTypes": [
                                        "youth"
                                ],
                                "activities": [
                                        "mountains",
                                        "safari",
                                        "landmarks"
                                ],
                                "bestTime": "يونيو - سبتمبر"
                        },
                        {
                                "id": "bolivia",
                                "nameAr": "بوليفيا",
                                "nameEn": "Bolivia",
                                "continent": "south_america",
                                "img": "/img/bolivia-logo.jpg",
                                "dailyCost": 180,
                                "durationMin": 6,
                                "durationMax": 10,
                                "tripTypes": [
                                        "youth"
                                ],
                                "activities": [
                                        "mountains",
                                        "landmarks"
                                ],
                                "bestTime": "مايو - أكتوبر"
                        },
                        {
                                "id": "paraguay",                                "nameAr": "باراغواي",
                                "nameEn": "Paraguay",
                                "continent": "south_america",
                                "img": "/img/paraguay-logo.jpg",
                                "dailyCost": 190,
                                "durationMin": 5,
                                "durationMax": 8,
                                "tripTypes": [
                                        "youth"
                                ],
                                "activities": [
                                        "landmarks"
                                ],
                                "bestTime": "مايو - أكتوبر"
                        },
                        {
                                "id": "uruguay",
                                "nameAr": "أوروغواي",
                                "nameEn": "Uruguay",
                                "continent": "south_america",
                                "img": "/img/uruguay-logo.jpg",
                                "dailyCost": 350,
                                "durationMin": 5,
                                "durationMax": 8,
                                "tripTypes": [
                                        "family",
                                        "honeymoon"
                                ],
                                "activities": [
                                        "beaches",
                                        "landmarks"
                                ],
                                "bestTime": "ديسمبر - مارس"
                        },
                        {
                                "id": "guyana",                                "nameAr": "غيانا",
                                "nameEn": "Guyana",
                                "continent": "south_america",
                                "img": "/img/guyana-logo.jpg",
                                "dailyCost": 260,
                                "durationMin": 5,
                                "durationMax": 8,
                                "tripTypes": [
                                        "youth"
                                ],
                                "activities": [
                                        "mountains",
                                        "safari"
                                ],
                                "bestTime": "سبتمبر - أبريل"
                        },
                        {
                                "id": "suriname",                                "nameAr": "سورينام",
                                "nameEn": "Suriname",
                                "continent": "south_america",
                                "img": "/img/suriname-logo.jpg",
                                "dailyCost": 260,
                                "durationMin": 5,
                                "durationMax": 8,
                                "tripTypes": [
                                        "youth"
                                ],
                                "activities": [
                                        "mountains",
                                        "safari"
                                ],
                                "bestTime": "أغسطس - نوفمبر"
                        },
                        {
                                "id": "australia",
                                                                "nameAr": "أستراليا",
                                "nameEn": "Australia",
                                "continent": "oceania",
                                "img": "/img/australia-logo.jpg",
                                "dailyCost": 710,
                                "durationMin": 10,
                                "durationMax": 18,
                                "tripTypes": [
                                        "youth",
                                        "family",
                                        "honeymoon"
                                ],
                                "activities": [
                                        "beaches",
                                        "landmarks",
                                        "safari"
                                ],
                                "bestTime": "سبتمبر - نوفمبر"
                        },
                        {
                                "id": "newzealand",
                                                                "nameAr": "نيوزيلندا",
                                "nameEn": "New Zealand",
                                "continent": "oceania",
                                "img": "/img/newzealand-logo.jpg",
                                "dailyCost": 600,
                                "durationMin": 8,
                                "durationMax": 14,
                                "tripTypes": [
                                        "youth",
                                        "honeymoon"
                                ],
                                "activities": [
                                        "mountains",
                                        "landmarks"
                                ],
                                "bestTime": "ديسمبر - فبراير"
                        },
                        {
                                "id": "fiji",
                                                                "nameAr": "فيجي",
                                "nameEn": "Fiji",
                                "continent": "oceania",
                                "img": "/img/fiji-logo.jpg",
                                "dailyCost": 500,
                                "durationMin": 5,
                                "durationMax": 9,
                                "tripTypes": [
                                        "honeymoon",
                                        "family"
                                ],
                                "activities": [
                                        "beaches",
                                        "sea",
                                        "resorts"
                                ],
                                "bestTime": "مايو - أكتوبر"
                        },
                        {
                                "id": "papuanewguinea",
                                                                "nameAr": "بابوا غينيا الجديدة",
                                "nameEn": "Papua New Guinea",
                                "continent": "oceania",
                                "img": "/img/papuanewguinea-logo.jpg",
                                "dailyCost": 450,
                                "durationMin": 6,
                                "durationMax": 10,
                                "tripTypes": [
                                        "youth"
                                ],
                                "activities": [
                                        "mountains",
                                        "safari"
                                ],
                                "bestTime": "مايو - أكتوبر"
                        },
                        {
                                "id": "samoa",
                                "nameAr": "ساموا",
                                "nameEn": "Samoa",
                                "continent": "oceania",
                                "img": "/img/samoa-logo.jpg",
                                "dailyCost": 420,
                                "durationMin": 5,
                                "durationMax": 9,
                                "tripTypes": [
                                        "honeymoon"
                                ],
                                "activities": [
                                        "beaches",
                                        "sea"
                                ],
                                "bestTime": "مايو - أكتوبر"
                        },
                        {
                                "id": "tonga",
                                "nameAr": "تونغا",
                                "nameEn": "Tonga",
                                "continent": "oceania",
                                "img": "/img/tonga-logo.jpg",
                                "dailyCost": 420,
                                "durationMin": 5,
                                "durationMax": 9,
                                "tripTypes": [
                                        "honeymoon"
                                ],
                                "activities": [
                                        "beaches",
                                        "sea"
                                ],
                                "bestTime": "مايو - أكتوبر"
                        },
                        {
                                "id": "vanuatu",
                                "nameAr": "فانواتو",
                                "nameEn": "Vanuatu",
                                "continent": "oceania",
                                "img": "/img/vanuatu-logo.jpg",
                                "dailyCost": 450,
                                "durationMin": 5,
                                "durationMax": 9,
                                "tripTypes": [
                                        "honeymoon",
                                        "youth"
                                ],
                                "activities": [
                                        "beaches",
                                        "sea"
                                ],
                                "bestTime": "مايو - أكتوبر"
                        },
                        {
                                "id": "solomonislands",
                                                                "nameAr": "جزر سليمان",
                                "nameEn": "Solomon Islands",
                                "continent": "oceania",
                                "img": "/img/solomonislands-logo.jpg",
                                "dailyCost": 450,
                                "durationMin": 5,
                                "durationMax": 9,
                                "tripTypes": [
                                        "youth"
                                ],
                                "activities": [
                                        "beaches",
                                        "sea"
                                ],
                                "bestTime": "مايو - أكتوبر"
                        },
                        {
                                "id": "palau",
                                "nameAr": "بالاو",
                                "nameEn": "Palau",
                                "continent": "oceania",
                                "img": "/img/palau-logo.jpg",
                                "dailyCost": 650,
                                "durationMin": 5,
                                "durationMax": 8,
                                "tripTypes": [
                                        "honeymoon"
                                ],
                                "activities": [
                                        "beaches",
                                        "sea",
                                        "resorts"
                                ],
                                "bestTime": "نوفمبر - أبريل"
                        },
                        {
                                "id": "cookislands",
                                "ready": false,
                                "nameAr": "جزر كوك",
                                "nameEn": "Cook Islands",
                                "continent": "oceania",
                                "img": "/img/coming-soon.jpg",
                                "dailyCost": 600,
                                "durationMin": 5,
                                "durationMax": 9,
                                "tripTypes": [
                                        "honeymoon"
                                ],
                                "activities": [
                                        "beaches",
                                        "sea",
                                        "resorts"
                                ],
                                "bestTime": "مايو - أكتوبر"
                        },
                        {
                                "id": "frenchpolynesia",
                                "ready": false,
                                "nameAr": "بولينيزيا الفرنسية",
                                "nameEn": "French Polynesia",
                                "continent": "oceania",
                                "img": "/img/coming-soon.jpg",
                                "dailyCost": 900,
                                "durationMin": 5,
                                "durationMax": 9,
                                "tripTypes": [
                                        "honeymoon"
                                ],
                                "activities": [
                                        "beaches",
                                        "sea",
                                        "resorts"
                                ],
                                "bestTime": "مايو - أكتوبر"
                        },
                        {
                                "id": "afghanistan",
                                                                "nameAr": "أفغانستان",
                                "nameEn": "Afghanistan",
                                "continent": "asia",
                                "img": "/img/afghanistan-logo.jpg",
                                "dailyCost": 90,
                                "durationMin": 5,
                                "durationMax": 8,
                                "tripTypes": [
                                        "youth"
                                ],
                                "activities": [
                                        "mountains",
                                        "landmarks"
                                ],
                                "bestTime": "أبريل - يونيو",
                                "advisory": true
                        },
                        {
                                "id": "burkinafaso",
                                "nameAr": "بوركينا فاسو",
                                "nameEn": "Burkina Faso",
                                "continent": "africa",
                                "img": "/img/burkinafaso-logo.jpg",
                                "dailyCost": 150,
                                "durationMin": 5,
                                "durationMax": 8,
                                "tripTypes": [
                                        "youth"
                                ],
                                "activities": [
                                        "mountains",
                                        "landmarks"
                                ],
                                "bestTime": "نوفمبر - فبراير",
                                "advisory": true
                        },
                        {
                                "id": "centralafricanrepublic",
                                "nameAr": "افريقيا الوسطى",
                                "nameEn": "Central African Republic",
                                "continent": "africa",
                                "img": "/img/centralafricanrepublic-logo.jpg",
                                "dailyCost": 200,
                                "durationMin": 5,
                                "durationMax": 9,
                                "tripTypes": [
                                        "youth"
                                ],
                                "activities": [
                                        "safari"
                                ],
                                "bestTime": "ديسمبر - فبراير",
                                "advisory": true
                        },
                        {
                                "id": "chad",
                                "nameAr": "تشاد",
                                "nameEn": "Chad",
                                "continent": "africa",
                                "img": "/img/chad-logo.jpg",
                                "dailyCost": 150,
                                "durationMin": 5,
                                "durationMax": 9,
                                "tripTypes": [
                                        "youth"
                                ],
                                "activities": [
                                        "safari",
                                        "mountains"
                                ],
                                "bestTime": "نوفمبر - فبراير",
                                "advisory": true
                        },
                        {
                                "id": "democraticrepubliccongo",
                                "nameAr": "الكونغو الديمقراطية",
                                "nameEn": "Democratic Republic of the Congo",
                                "continent": "africa",
                                "img": "/img/democraticrepubliccongo-logo.jpg",
                                "dailyCost": 250,
                                "durationMin": 6,
                                "durationMax": 10,
                                "tripTypes": [
                                        "youth"
                                ],
                                "activities": [
                                        "safari",
                                        "mountains"
                                ],
                                "bestTime": "يونيو - سبتمبر",
                                "advisory": true
                        },
                        {
                                "id": "eritrea",
                                "nameAr": "ارتيريا",
                                "nameEn": "Eritrea",
                                "continent": "africa",
                                "img": "/img/eritrea-logo.jpg",
                                "dailyCost": 200,
                                "durationMin": 5,
                                "durationMax": 8,
                                "tripTypes": [
                                        "youth"
                                ],
                                "activities": [
                                        "landmarks",
                                        "beaches"
                                ],
                                "bestTime": "أكتوبر - فبراير",
                                "advisory": true
                        },
                        {
                                "id": "haiti",
                                "nameAr": "هايتي",
                                "nameEn": "Haiti",
                                "continent": "north_america",
                                "img": "/img/haiti-logo.jpg",
                                "dailyCost": 200,
                                "durationMin": 5,
                                "durationMax": 8,
                                "tripTypes": [
                                        "youth"
                                ],
                                "activities": [
                                        "beaches",
                                        "landmarks"
                                ],
                                "bestTime": "ديسمبر - أبريل",
                                "advisory": true
                        },
                        {
                                "id": "iraq",
                                "nameAr": "العراق",
                                "nameEn": "Iraq",
                                "continent": "asia",
                                "img": "/img/iraq-logo.jpg",
                                "dailyCost": 120,
                                "durationMin": 5,
                                "durationMax": 9,
                                "tripTypes": [
                                        "youth",
                                        "family"
                                ],
                                "activities": [
                                        "landmarks",
                                        "museums"
                                ],
                                "bestTime": "مارس - مايو",
                                "advisory": true
                        },
                        {
                                "id": "libya",
                                "nameAr": "ليبيا",
                                "nameEn": "Libya",
                                "continent": "africa",
                                "img": "/img/libya-logo.jpg",
                                "dailyCost": 150,
                                "durationMin": 5,
                                "durationMax": 9,
                                "tripTypes": [
                                        "youth"
                                ],
                                "activities": [
                                        "landmarks",
                                        "beaches"
                                ],
                                "bestTime": "مارس - مايو",
                                "advisory": true
                        },
                        {
                                "id": "mali",
                                "nameAr": "مالي",
                                "nameEn": "Mali",
                                "continent": "africa",
                                "img": "/img/mali-logo.jpg",
                                "dailyCost": 120,
                                "durationMin": 5,
                                "durationMax": 9,
                                "tripTypes": [
                                        "youth"
                                ],
                                "activities": [
                                        "landmarks",
                                        "mountains"
                                ],
                                "bestTime": "نوفمبر - فبراير",
                                "advisory": true
                        },
                        {
                                "id": "niger",
                                "nameAr": "النيجر",
                                "nameEn": "Niger",
                                "continent": "africa",
                                "img": "/img/niger-logo.png",
                                "dailyCost": 120,
                                "durationMin": 5,
                                "durationMax": 9,
                                "tripTypes": [
                                        "youth"
                                ],
                                "activities": [
                                        "landmarks",
                                        "mountains"
                                ],
                                "bestTime": "نوفمبر - فبراير",
                                "advisory": true
                        },
                        {
                                "id": "northkorea",
                                "nameAr": "كوريا الشمالية",
                                "nameEn": "North Korea",
                                "continent": "asia",
                                "img": "/img/northkorea-logo.jpg",
                                "dailyCost": 600,
                                "durationMin": 4,
                                "durationMax": 7,
                                "tripTypes": [
                                        "youth"
                                ],
                                "activities": [
                                        "landmarks",
                                        "museums"
                                ],
                                "bestTime": "أبريل - أكتوبر",
                                "advisory": true
                        },
                        {
                                "id": "somalia",
                                "nameAr": "الصومال",
                                "nameEn": "Somalia",
                                "continent": "africa",
                                "img": "/img/somalia-logo.jpg",
                                "dailyCost": 150,
                                "durationMin": 5,
                                "durationMax": 8,
                                "tripTypes": [
                                        "youth"
                                ],
                                "activities": [
                                        "beaches",
                                        "landmarks"
                                ],
                                "bestTime": "ديسمبر - فبراير",
                                "advisory": true
                        },
                        {
                                "id": "southsudan",
                                "nameAr": "جنوب السودان",
                                "nameEn": "South Sudan",
                                "continent": "africa",
                                "img": "/img/southsudan-logo.jpg",
                                "dailyCost": 250,
                                "durationMin": 5,
                                "durationMax": 8,
                                "tripTypes": [
                                        "youth"
                                ],
                                "activities": [
                                        "safari"
                                ],
                                "bestTime": "نوفمبر - فبراير",
                                "advisory": true
                        },
                        {
                                "id": "sudan",
                                "nameAr": "السودان",
                                "nameEn": "Sudan",
                                "continent": "africa",
                                "img": "/img/sudan-logo.jpg",
                                "dailyCost": 100,
                                "durationMin": 5,
                                "durationMax": 9,
                                "tripTypes": [
                                        "youth"
                                ],
                                "activities": [
                                        "landmarks",
                                        "safari"
                                ],
                                "bestTime": "نوفمبر - فبراير",
                                "advisory": true
                        },
                        {
                                "id": "syria",
                                "nameAr": "سوريا",
                                "nameEn": "Syria",
                                "continent": "asia",
                                "img": "/img/syria-logo.jpg",
                                "dailyCost": 100,
                                "durationMin": 5,
                                "durationMax": 9,
                                "tripTypes": [
                                        "youth"
                                ],
                                "activities": [
                                        "landmarks",
                                        "museums"
                                ],
                                "bestTime": "مارس - مايو",
                                "advisory": true
                        },
                        {
                                "id": "venezuela",                                "nameAr": "فنزويلا",
                                "nameEn": "Venezuela",
                                "continent": "south_america",
                                "img": "/img/venezuela-logo.jpg",
                                "dailyCost": 150,
                                "durationMin": 6,
                                "durationMax": 10,
                                "tripTypes": [
                                        "youth"
                                ],
                                "activities": [
                                        "mountains",
                                        "beaches",
                                        "landmarks"
                                ],
                                "bestTime": "ديسمبر - أبريل",
                                "advisory": true
                        },
                        {
                                "id": "yemen",
                                                                "nameAr": "اليمن",
                                "nameEn": "Yemen",
                                "continent": "asia",
                                "img": "/img/yemen-logo.jpg",
                                "dailyCost": 90,
                                "durationMin": 5,
                                "durationMax": 9,
                                "tripTypes": [
                                        "youth"
                                ],
                                "activities": [
                                        "landmarks",
                                        "mountains"
                                ],
                                "bestTime": "أكتوبر - مارس",
                                "advisory": true
                        },
                        {
                                "id": "palestine",
                                "nameAr": "فلسطين",
                                "nameEn": "Palestine",
                                "continent": "asia",
                                "img": "/img/palestine-logo.jpg",
                                "dailyCost": 250,
                                "durationMin": 4,
                                "durationMax": 7,
                                "tripTypes": [
                                        "youth",
                                        "family"
                                ],
                                "activities": [
                                        "landmarks",
                                        "museums"
                                ],
                                "bestTime": "مارس - مايو",
                                "advisory": true
                        },
                        {
                                "id": "vaticancity",
                                "nameAr": "الفاتيكان",
                                "nameEn": "Vatican City",
                                "continent": "europe",
                                "img": "/img/coming-soon.jpg",
                                "dailyCost": 700,
                                "durationMin": 1,
                                "durationMax": 2,
                                "tripTypes": [
                                        "family",
                                        "youth",
                                        "honeymoon"
                                ],
                                "activities": [
                                        "landmarks",
                                        "museums"
                                ],
                                "bestTime": "أبريل - يونيو"
                        },
                        {
                                "id": "antiguabarbuda",
                                "nameAr": "أنتيغوا وباربودا",
                                "nameEn": "Antigua and Barbuda",
                                "continent": "north_america",
                                "img": "/img/antigua-logo.jpg",
                                "dailyCost": 550,
                                "durationMin": 5,
                                "durationMax": 8,
                                "tripTypes": [
                                        "honeymoon",
                                        "family"
                                ],
                                "activities": [
                                        "beaches",
                                        "sea",
                                        "resorts"
                                ],
                                "bestTime": "ديسمبر - أبريل"
                        },
                        {
                                "id": "burundi",
                                "nameAr": "بوروندي",
                                "nameEn": "Burundi",
                                "continent": "africa",
                                "img": "/img/burundi-logo.jpg",
                                "dailyCost": 180,
                                "durationMin": 5,
                                "durationMax": 8,
                                "tripTypes": [
                                        "youth"
                                ],
                                "activities": [
                                        "safari",
                                        "mountains"
                                ],
                                "bestTime": "يونيو - أغسطس"
                        },
                        {
                                "id": "dominica",
                                "nameAr": "دومينيكا",
                                "nameEn": "Dominica",
                                "continent": "north_america",
                                "img": "/img/dominica-logo.jpg",
                                "dailyCost": 400,
                                "durationMin": 5,
                                "durationMax": 8,
                                "tripTypes": [
                                        "youth",
                                        "honeymoon"
                                ],
                                "activities": [
                                        "mountains",
                                        "beaches",
                                        "sea"
                                ],
                                "bestTime": "ديسمبر - يونيو"
                        },
                        {
                                "id": "equatorialguinea",
                                "nameAr": "غينيا الاستوائية",
                                "nameEn": "Equatorial Guinea",
                                "continent": "africa",
                                "img": "/img/equatorialguinea-logo.jpg",
                                "dailyCost": 450,
                                "durationMin": 5,
                                "durationMax": 8,
                                "tripTypes": [
                                        "youth"
                                ],
                                "activities": [
                                        "beaches",
                                        "mountains"
                                ],
                                "bestTime": "ديسمبر - فبراير"
                        },
                        {
                                "id": "eswatini",
                                "nameAr": "اسواتيني",
                                "nameEn": "Eswatini",
                                "continent": "africa",
                                "img": "/img/eswatini-logo.jpg",
                                "dailyCost": 300,
                                "durationMin": 4,
                                "durationMax": 7,
                                "tripTypes": [
                                        "youth",
                                        "family"
                                ],
                                "activities": [
                                        "safari",
                                        "mountains"
                                ],
                                "bestTime": "مايو - سبتمبر"
                        },
                        {
                                "id": "grenada",
                                "nameAr": "غرينادا",
                                "nameEn": "Grenada",
                                "continent": "north_america",
                                "img": "/img/grenada-logo.jpg",
                                "dailyCost": 500,
                                "durationMin": 5,
                                "durationMax": 8,
                                "tripTypes": [
                                        "honeymoon",
                                        "family"
                                ],
                                "activities": [
                                        "beaches",
                                        "sea",
                                        "resorts"
                                ],
                                "bestTime": "ديسمبر - أبريل"
                        },
                        {
                                "id": "guineabissau",
                                "nameAr": "غينيا بيساو",
                                "nameEn": "Guinea-Bissau",
                                "continent": "africa",
                                "img": "/img/guineabissau-logo.jpg",
                                "dailyCost": 250,
                                "durationMin": 4,
                                "durationMax": 7,
                                "tripTypes": [
                                        "youth"
                                ],
                                "activities": [
                                        "beaches",
                                        "sea"
                                ],
                                "bestTime": "ديسمبر - مايو"
                        },
                        {
                                "id": "kiribati",
                                "nameAr": "كيريباتي",
                                "nameEn": "Kiribati",
                                "continent": "oceania",
                                "img": "/img/kiribati-logo.jpg",
                                "dailyCost": 450,
                                "durationMin": 5,
                                "durationMax": 8,
                                "tripTypes": [
                                        "youth"
                                ],
                                "activities": [
                                        "beaches",
                                        "sea"
                                ],
                                "bestTime": "مايو - أكتوبر"
                        },
                        {
                                "id": "lesotho",
                                "nameAr": "ليسوتو",
                                "nameEn": "Lesotho",
                                "continent": "africa",
                                "img": "/img/lesotho-logo.jpg",
                                "dailyCost": 250,
                                "durationMin": 4,
                                "durationMax": 7,
                                "tripTypes": [
                                        "youth"
                                ],
                                "activities": [
                                        "mountains"
                                ],
                                "bestTime": "مايو - سبتمبر"
                        },
                        {
                                "id": "liberia",
                                "nameAr": "ليبيريا",
                                "nameEn": "Liberia",
                                "continent": "africa",
                                "img": "/img/liberia-logo.jpg",
                                "dailyCost": 280,
                                "durationMin": 5,
                                "durationMax": 8,
                                "tripTypes": [
                                        "youth"
                                ],
                                "activities": [
                                        "beaches",
                                        "mountains"
                                ],
                                "bestTime": "نوفمبر - مارس"
                        },
                        {
                                "id": "marshallislands",
                                "nameAr": "جزر مارشال",
                                "nameEn": "Marshall Islands",
                                "continent": "oceania",
                                "img": "/img/marshallislands-logo.jpg",
                                "dailyCost": 500,
                                "durationMin": 5,
                                "durationMax": 8,
                                "tripTypes": [
                                        "honeymoon",
                                        "youth"
                                ],
                                "activities": [
                                        "beaches",
                                        "sea"
                                ],
                                "bestTime": "ديسمبر - أبريل"
                        },
                        {
                                "id": "micronesia",
                                "nameAr": "ميكرونيزيا",
                                "nameEn": "Micronesia",
                                "continent": "oceania",
                                "img": "/img/micronesia-logo.jpg",
                                "dailyCost": 480,
                                "durationMin": 5,
                                "durationMax": 8,
                                "tripTypes": [
                                        "honeymoon",
                                        "youth"
                                ],
                                "activities": [
                                        "beaches",
                                        "sea"
                                ],
                                "bestTime": "ديسمبر - أبريل"
                        },
                        {
                                "id": "nauru",
                                "nameAr": "ناورو",
                                "nameEn": "Nauru",
                                "continent": "oceania",
                                "img": "/img/nauru-logo.jpg",
                                "dailyCost": 600,
                                "durationMin": 3,
                                "durationMax": 5,
                                "tripTypes": [
                                        "youth"
                                ],
                                "activities": [
                                        "beaches"
                                ],
                                "bestTime": "مايو - أكتوبر"
                        },
                        {
                                "id": "stkittsnevis",
                                "nameAr": "سانت كيتس ونيفيس",
                                "nameEn": "Saint Kitts and Nevis",
                                "continent": "north_america",
                                "img": "/img/stkittsnevis-logo.jpg",
                                "dailyCost": 550,
                                "durationMin": 5,
                                "durationMax": 8,
                                "tripTypes": [
                                        "honeymoon",
                                        "family"
                                ],
                                "activities": [
                                        "beaches",
                                        "sea",
                                        "resorts"
                                ],
                                "bestTime": "ديسمبر - أبريل"
                        },
                        {
                                "id": "stlucia",
                                "nameAr": "سانت لوسيا",
                                "nameEn": "Saint Lucia",
                                "continent": "north_america",
                                "img": "/img/stlucia-logo.jpg",
                                "dailyCost": 600,
                                "durationMin": 5,
                                "durationMax": 8,
                                "tripTypes": [
                                        "honeymoon"
                                ],
                                "activities": [
                                        "beaches",
                                        "sea",
                                        "resorts",
                                        "mountains"
                                ],
                                "bestTime": "ديسمبر - أبريل"
                        },
                        {
                                "id": "stvincentgrenadines",
                                "nameAr": "سانت فينسنت والغرينادين",
                                "nameEn": "Saint Vincent and the Grenadines",
                                "continent": "north_america",
                                "img": "/img/stvincentgrenadines-logo.jpg",
                                "dailyCost": 550,
                                "durationMin": 5,
                                "durationMax": 8,
                                "tripTypes": [
                                        "honeymoon"
                                ],
                                "activities": [
                                        "beaches",
                                        "sea",
                                        "resorts"
                                ],
                                "bestTime": "ديسمبر - أبريل"
                        },
                        {
                                "id": "saotomeprincipe",
                                "nameAr": "ساو تومي وبرينسيب",
                                "nameEn": "Sao Tome and Principe",
                                "continent": "africa",
                                "img": "/img/saotomeprincipe-logo.jpg",
                                "dailyCost": 400,
                                "durationMin": 5,
                                "durationMax": 8,
                                "tripTypes": [
                                        "honeymoon",
                                        "youth"
                                ],
                                "activities": [
                                        "beaches",
                                        "sea"
                                ],
                                "bestTime": "يونيو - سبتمبر"
                        },
                        {
                                "id": "sierraleone",
                                "nameAr": "سيراليون",
                                "nameEn": "Sierra Leone",
                                "continent": "africa",
                                "img": "/img/sierraleone-logo.jpg",
                                "dailyCost": 280,
                                "durationMin": 5,
                                "durationMax": 8,
                                "tripTypes": [
                                        "youth"
                                ],
                                "activities": [
                                        "beaches"
                                ],
                                "bestTime": "نوفمبر - أبريل"
                        },
                        {
                                "id": "tuvalu",
                                "nameAr": "توفالو",
                                "nameEn": "Tuvalu",
                                "continent": "oceania",
                                "img": "/img/tuvalu-logo.jpg",
                                "dailyCost": 500,
                                "durationMin": 4,
                                "durationMax": 7,
                                "tripTypes": [
                                        "youth"
                                ],
                                "activities": [
                                        "beaches",
                                        "sea"
                                ],
                                "bestTime": "مايو - أكتوبر"
                        }
                ];

        // ===== حالة المعالج =====
        const state = {
                step: 1,
                budget: 3000,
                tripType: null,
                people: 1,
                duration: 5,
                hotelStars: null,
                continent: null,   // null = كل العالم
                isRandom: false,
                isSkipAll: false,
                activities: [],
        };

        const stepsMeta = [
                { ar: "الميزانية", code: "BUDGET" },
                { ar: "نوع الرحلة", code: "TRIP TYPE" },
                { ar: "المسافرين والمدة", code: "TRAVELERS" },
                { ar: "الفندق", code: "HOTEL" },
                { ar: "الوجهة", code: "DESTINATION" },
                { ar: "الفعاليات", code: "ACTIVITIES" },
        ];

        // ===== عناصر الصفحة =====
        const wizard = document.getElementById("wizard");
        const resultsSection = document.getElementById("resultsSection");
        const resultsGrid = document.getElementById("resultsGrid");
        const resultsTitle = document.getElementById("resultsTitle");
        const resultsSubtitle = document.getElementById("resultsSubtitle");
        const steps = document.querySelectorAll(".wizard-step");
        const prevBtn = document.getElementById("prevBtn");
        const nextBtn = document.getElementById("nextBtn");
        const restartBtn = document.getElementById("restartBtn");
        const rerollBtn = document.getElementById("rerollBtn");
        const stepCodeEl = document.getElementById("stepCode");
        const stepsFillEl = document.getElementById("stepsFill");
        const stubFields = document.getElementById("stubFields");
        const TOTAL_STEPS = steps.length;

        const budgetRange = document.getElementById("budgetRange");
        const budgetDisplay = document.getElementById("budgetDisplay");
        const peopleDisplay = document.getElementById("peopleDisplay");
        const increasePeople = document.getElementById("increasePeople");
        const decreasePeople = document.getElementById("decreasePeople");
        const durationDisplay = document.getElementById("durationDisplay");
        const increaseDuration = document.getElementById("increaseDuration");
        const decreaseDuration = document.getElementById("decreaseDuration");
        const randomBtn = document.getElementById("randomBtn");
        const skipAllBtn = document.getElementById("skipAllBtn");
        const resultsSearchWrap = document.getElementById("resultsSearchWrap");
        const resultsSearch = document.getElementById("resultsSearch");
        const resultsContiFilter = document.getElementById("resultsContiFilter");

        function formatNumber(n) {
                return n.toLocaleString("en-US");
        }

        function arabicDigits(n) {
                return n.toString().replace(/[0-9]/g, (d) => "٠١٢٣٤٥٦٧٨٩"[d]);
        }

        // تطبيع الهمزة فوق/تحت الألف (أ، إ، آ) إلى ألف عادية — يخلي البحث يلقى
        // النتيجة سواء كتب الزائر الاسم بالهمزة أو بدونها، بدون ما نغيّر شكل
        // الاسم المعروض بالكرت (يضل مكتوب صح إملائياً)
        function normalizeArabic(str) {
                return str.replace(/[أإآ]/g, "ا");
        }

        function tripTypeArabicLabel(t) {
                if (t === "youth") return "شبابية";
                if (t === "family") return "عائلية";
                if (t === "honeymoon") return "شهر عسل";
                return "—";
        }

        function airportCode(nameEn) {
                return nameEn.replace(/[^A-Za-z]/g, "").slice(0, 3).toUpperCase() || "—";
        }

        // ===== تحديث بطاقة الستب الحية =====
        function renderTicketStub() {
                if (!stubFields) return;
                const destLabel = state.isRandom
                        ? "عشوائي 🎲"
                        : (state.continent ? continentNames[state.continent] : "كل العالم");
                const activitiesLabel = state.activities.length
                        ? `${arabicDigits(state.activities.length)} مختارة`
                        : "—";

                stubFields.innerHTML = `
            <div class="stub-row"><span class="stub-k">BUDGET</span><span class="stub-v">${formatNumber(state.budget)} ﷼</span></div>
            <div class="stub-row"><span class="stub-k">CLASS</span><span class="stub-v">${tripTypeArabicLabel(state.tripType)}</span></div>
            <div class="stub-row"><span class="stub-k">PAX</span><span class="stub-v">${arabicDigits(state.people)}</span></div>
            <div class="stub-row"><span class="stub-k">NIGHTS</span><span class="stub-v">${arabicDigits(state.duration)}</span></div>
            <div class="stub-row"><span class="stub-k">HOTEL</span><span class="stub-v">${state.hotelStars ? "★".repeat(state.hotelStars) : "—"}</span></div>
            <div class="stub-row"><span class="stub-k">DEST</span><span class="stub-v">${destLabel}</span></div>
            <div class="stub-row"><span class="stub-k">ACTV</span><span class="stub-v">${activitiesLabel}</span></div>
        `;
        }

        // ===== التحكم بالميزانية =====
        function updateBudgetTrack() {
                if (!budgetRange) return;
                const min = parseInt(budgetRange.min, 10);
                const max = parseInt(budgetRange.max, 10);
                const percent = ((state.budget - min) / (max - min)) * 100;
                budgetRange.style.background = `linear-gradient(to right, var(--caramel) 0%, var(--caramel) ${percent}%, var(--cream-soft) ${percent}%, var(--cream-soft) 100%)`;
        }

        budgetRange?.addEventListener("input", () => {
                state.budget = parseInt(budgetRange.value, 10);
                if (budgetDisplay) budgetDisplay.textContent = formatNumber(state.budget);
                updateBudgetTrack();
                renderTicketStub();
        });
        updateBudgetTrack();

        // ===== نوع الرحلة =====
        document.querySelectorAll(".trip-card").forEach((card) => {
                card.addEventListener("click", () => {
                        document.querySelectorAll(".trip-card").forEach((c) => c.classList.remove("active"));
                        card.classList.add("active");
                        state.tripType = card.dataset.type;

                        // شهر العسل: أشخاص يبدأ من ٢ والميزانية من ٢٠٠٠٠
                        if (state.tripType === "honeymoon") {
                                if (state.people < 2) {
                                        state.people = 2;
                                        if (peopleDisplay) peopleDisplay.textContent = state.people;
                                }
                                if (state.budget < 20000) {
                                        state.budget = 20000;
                                        if (budgetRange) budgetRange.value = 20000;
                                        if (budgetDisplay) budgetDisplay.textContent = formatNumber(20000);
                                        updateBudgetTrack();
                                }
                        }

                        updateNextButtonState();
                        renderTicketStub();
                });
        });

        // ===== عدد المسافرين =====
        increasePeople?.addEventListener("click", () => {
                if (state.people < 20) {
                        state.people++;
                        if (peopleDisplay) peopleDisplay.textContent = state.people;
                        renderTicketStub();
                }
        });
        decreasePeople?.addEventListener("click", () => {
                const minPeople = state.tripType === "honeymoon" ? 2 : 1;
                if (state.people > minPeople) {
                        state.people--;
                        if (peopleDisplay) peopleDisplay.textContent = state.people;
                        renderTicketStub();
                }
        });

        // ===== مدة الإقامة =====
        increaseDuration?.addEventListener("click", () => {
                if (state.duration < 30) {
                        state.duration++;
                        if (durationDisplay) durationDisplay.textContent = state.duration;
                        renderTicketStub();
                }
        });
        decreaseDuration?.addEventListener("click", () => {
                if (state.duration > 1) {
                        state.duration--;
                        if (durationDisplay) durationDisplay.textContent = state.duration;
                        renderTicketStub();
                }
        });

        // ===== اختيار القارة =====
        document.querySelectorAll(".continent-chip").forEach((chip) => {
                chip.addEventListener("click", () => {
                        const already = chip.classList.contains("active");
                        document.querySelectorAll(".continent-chip").forEach((c) => c.classList.remove("active"));
                        // لا نشيل العشوائي هنا — القارة والعشوائي يعملان معاً

                        if (already) {
                                state.continent = null;
                        } else {
                                chip.classList.add("active");
                                state.continent = chip.dataset.continent;
                        }
                        renderTicketStub();
                });
        });

        // ===== زر العشوائي =====
        randomBtn?.addEventListener("click", () => {
                const wasActive = randomBtn.classList.contains("active");
                // لا نشيل القارة المختارة — تبقى لتضيّق نطاق العشوائي

                if (wasActive) {
                        randomBtn.classList.remove("active");
                        state.isRandom = false;
                } else {
                        randomBtn.classList.add("active");
                        state.isRandom = true;
                }
                renderTicketStub();
        });

        // ===== الفعاليات =====
        const ALL_ACTIVITIES = ['beaches', 'sea', 'safari', 'mountains', 'amusement', 'resorts', 'museums', 'landmarks'];

        document.querySelectorAll(".activity-chip").forEach((chip) => {
                chip.addEventListener("click", () => {
                        const act = chip.dataset.activity;
                        const allChip = document.querySelector('.activity-chip[data-activity="all"]');

                        if (act === "all") {
                                const wasActive = chip.classList.contains("active");
                                document.querySelectorAll(".activity-chip").forEach((c) => c.classList.remove("active"));
                                if (!wasActive) {
                                        chip.classList.add("active");
                                        document.querySelectorAll(".activity-chip:not([data-activity='all'])").forEach((c) => c.classList.add("active"));
                                        state.activities = [...ALL_ACTIVITIES];
                                } else {
                                        state.activities = [];
                                }
                        } else {
                                // إلغاء "الكل" عند اختيار فردي
                                if (allChip) allChip.classList.remove("active");
                                chip.classList.toggle("active");
                                if (state.activities.includes(act)) {
                                        state.activities = state.activities.filter((a) => a !== act);
                                } else {
                                        state.activities.push(act);
                                }
                                // لو اختار كل الفعاليات يدوياً — نفعّل زر "الكل" تلقائياً
                                if (ALL_ACTIVITIES.every((a) => state.activities.includes(a)) && allChip) {
                                        allChip.classList.add("active");
                                }
                        }

                        updateNextButtonState();
                        renderTicketStub();
                });
        });

        // ===== التنقل بين الخطوات =====
        function showStep(n) {
                steps.forEach((s) => s.classList.toggle("active", parseInt(s.dataset.step, 10) === n));
                if (stepCodeEl) {
                        const meta = stepsMeta[n - 1];
                        stepCodeEl.textContent = `STEP ${String(n).padStart(2, "0")}/0${TOTAL_STEPS} · ${meta.code}`;
                }
                if (stepsFillEl) stepsFillEl.style.width = `${(n / TOTAL_STEPS) * 100}%`;
                if (prevBtn) prevBtn.disabled = n === 1;
                if (nextBtn) nextBtn.textContent = n === TOTAL_STEPS ? "عرض النتائج" : "التالي";
                updateNextButtonState();
        }

        // ===== الفنادق =====
        document.querySelectorAll(".hotel-chip").forEach((chip) => {
                chip.addEventListener("click", () => {
                        const already = chip.classList.contains("active");
                        document.querySelectorAll(".hotel-chip").forEach((c) => c.classList.remove("active"));
                        if (already) {
                                state.hotelStars = null;
                        } else {
                                chip.classList.add("active");
                                state.hotelStars = parseInt(chip.dataset.stars, 10);
                        }
                        renderTicketStub();
                });
        });

        function updateNextButtonState() {
                if (!nextBtn) return;
                if (state.step === 2) {
                        nextBtn.disabled = !state.tripType;
                } else if (state.step === 6) {
                        nextBtn.disabled = state.activities.length === 0;
                } else {
                        nextBtn.disabled = false;
                }
        }

        nextBtn?.addEventListener("click", () => {
                if (state.step === TOTAL_STEPS) {
                        if (wizard) wizard.style.display = "none";
                        if (resultsSection) resultsSection.style.display = "block";
                        renderResults();
                        resultsSection?.scrollIntoView({ behavior: "smooth" });
                        return;
                }
                state.step++;
                showStep(state.step);
        });

        prevBtn?.addEventListener("click", () => {
                if (state.step > 1) {
                        state.step--;
                        showStep(state.step);
                }
        });

        skipAllBtn?.addEventListener("click", () => {
                state.isSkipAll = true;
                if (wizard) wizard.style.display = "none";
                if (resultsSection) resultsSection.style.display = "block";
                renderResults();
                resultsSection?.scrollIntoView({ behavior: "smooth" });
        });

        restartBtn?.addEventListener("click", () => {
                state.step = 1;
                state.budget = 3000;
                state.tripType = null;
                state.people = 1;
                state.duration = 5;
                state.continent = null;
                state.hotelStars = null;
                state.isRandom = false;
                state.isSkipAll = false;
                state.activities = [];

                if (budgetRange) budgetRange.value = 3000;
                if (budgetDisplay) budgetDisplay.textContent = "3,000";
                updateBudgetTrack();
                if (peopleDisplay) peopleDisplay.textContent = "1";
                if (durationDisplay) durationDisplay.textContent = "5";
                document.querySelectorAll(".trip-card").forEach((c) => c.classList.remove("active"));
                document.querySelectorAll(".hotel-chip").forEach((c) => c.classList.remove("active"));
                document.querySelectorAll(".continent-chip").forEach((c) => c.classList.remove("active"));
                randomBtn?.classList.remove("active");
                document.querySelectorAll(".activity-chip").forEach((c) => c.classList.remove("active"));

                if (resultsSection) resultsSection.style.display = "none";
                if (wizard) wizard.style.display = "block";
                showStep(1);
                renderTicketStub();
                wizard?.scrollIntoView({ behavior: "smooth" });
        });

        // ===== حساب نسبة التطابق (حسب نوع الرحلة والفعاليات فقط) =====
        function calculateMatch(country) {
                let score = 0;

                if (country.tripTypes.includes(state.tripType)) {
                        score += Math.round(40 - (country.tripTypes.length - 1) * 5);
                } else {
                        score += 5;
                }

                if (state.activities.length > 0) {
                        const matched = state.activities.filter((a) => country.activities.includes(a)).length;
                        score += Math.round((matched / state.activities.length) * 60);
                }

                return Math.min(100, Math.max(0, score));
        }

        // ===== ملاحظة الميزانية (تحذير أو إيجابي) =====
        function budgetNoteHtml(country) {
                const daysAffordable = Math.floor(state.budget / country.dailyCost);

                if (daysAffordable >= state.duration) {
                        return `
            <div class="bp-note ok">
                <span class="note-icon">✅</span>
                <span>ميزانيتك (${formatNumber(state.budget)} ريال) تكفي رحلتك كاملة (${arabicDigits(state.duration)} ${state.duration === 1 ? "يوم" : "أيام"})، وتزيد.</span>
            </div>`;
                }

                if (daysAffordable <= 0) {
                        return `
            <div class="bp-note warn">
                <span class="note-icon">⚠️</span>
                <span>ميزانيتك (${formatNumber(state.budget)} ريال) أقل من تكلفة يوم واحد هنا. جرّب تزود الميزانية أو تختار وجهة أوفر.</span>
            </div>`;
                }

                return `
        <div class="bp-note warn">
            <span class="note-icon">⚠️</span>
            <span>ميزانيتك ما تكفي ${arabicDigits(state.duration)} ${state.duration === 1 ? "يوم" : "أيام"}. تقدر تقعد <strong>${arabicDigits(daysAffordable)} ${daysAffordable === 1 ? "يوم" : "أيام"}</strong> بهذا المبلغ.</span>
        </div>`;
        }

        // ===== كرت بطاقة الصعود =====
        function cardTemplate(country, index, isFeaturedSingle, skipMode) {
                const featuredClass = (!skipMode && (index === 0 || isFeaturedSingle)) ? " featured" : "";
                const tag = skipMode
                        ? ""
                        : ((index === 0 && !isFeaturedSingle)
                                ? '<span class="bp-tag">الأنسب لرحلتك ⭐</span>'
                                : (isFeaturedSingle ? '<span class="bp-tag">اختيارك العشوائي 🎲</span>' : ""));
                const seatNum = `${arabicDigits(index + 1).padStart(2, "٠")}A`;

                const fieldsHtml = skipMode
                        ? `
                    <div class="bp-field"><span class="bp-k">DURATION</span><span class="bp-v">${arabicDigits(country.durationMin)}–${arabicDigits(country.durationMax)} يوم</span></div>
                    <div class="bp-field"><span class="bp-k">BUDGET</span><span class="bp-v">${formatNumber(country.dailyCost * country.durationMin)}–${formatNumber(country.dailyCost * country.durationMax)} ﷼</span></div>
                    <div class="bp-field"><span class="bp-k">BOARDING</span><span class="bp-v">${country.bestTime}</span></div>`
                        : `
                    <div class="bp-field"><span class="bp-k">MATCH</span><span class="bp-v">${country.score}%</span></div>
                    <div class="bp-field"><span class="bp-k">CLASS</span><span class="bp-v">${tripTypeArabicLabel(state.tripType)}</span></div>
                    <div class="bp-field"><span class="bp-k">BOARDING</span><span class="bp-v">${country.bestTime}</span></div>`;

                const noteHtml = skipMode ? "" : budgetNoteHtml(country);
                const advisoryBadge = country.advisory
                        ? '<span class="bp-advisory">⚠️ راجع تنبيهات السفر</span>'
                        : "";
                const readyBadge = country.ready === false
                        ? '<span class="bp-not-ready">🚧 قريباً</span>'
                        : '<span class="bp-ready">✅ متاح</span>';

                // زر حفظ الخطة — يظهر فقط في نتائج الخطة الحقيقية (مو في وضع تصفح كل الدول)
                const saveBtnHtml = skipMode
                        ? ""
                        : `
                <button type="button" class="bp-save-plan"
                        data-id="${country.id}"
                        data-name="${country.nameAr}"
                        data-img="${country.img}">💾 احفظ هذه الخطة</button>`;

                return `
        <div class="bp-card${featuredClass}">
            <div class="bp-main">
                <div class="bp-photo">
                    <img src="${country.img}" alt="${country.nameAr}">
                    ${advisoryBadge}
                    ${readyBadge}
                    ${tag}
                </div>
                <div class="bp-route">
                    <span>RUH</span><span class="bp-arrow">✈</span><span>${airportCode(country.nameEn)}</span>
                </div>
                <h3 class="bp-title">${country.nameAr}<small>${country.nameEn}</small></h3>
                <div class="bp-fields">${fieldsHtml}
                </div>
                ${noteHtml}
                ${saveBtnHtml}
            </div>
            <div class="bp-perf" aria-hidden="true"></div>
            <div class="bp-stub">
                <div>
                    <span class="bp-seat-label">SEAT</span>
                    <span class="bp-seat-num">${seatNum}</span>
                </div>
                <div class="bp-barcode" aria-hidden="true"></div>
                <a href="${getCountryLink(country)}" class="bp-link">افتح ←</a>
            </div>
        </div>`;
        }
        // ===== حفظ الخطة في المفضلة =====
        // planId  = id الدولة + تاريخ اليوم
        // planName = اسم الدولة + الميزانية + عدد الأيام
        resultsGrid?.addEventListener("click", (e) => {
                const btn = e.target.closest(".bp-save-plan");
                if (!btn) return;

                const countryId = btn.dataset.id;
                const countryName = btn.dataset.name;
                const countryImg = btn.dataset.img;

                const today = new Date().toISOString().slice(0, 10);
                const planId = `${countryId}-${today}`;
                const dayWord = state.duration === 1 ? "يوم" : "أيام";
                const planName = `${countryName} – ${formatNumber(state.budget)} ريال – ${arabicDigits(state.duration)} ${dayWord}`;

                saveItem("plan", planId, planName, countryImg);
        });

        // ===== منع تكرار نفس الدولة مرتين متتاليتين بالاختيار العشوائي =====
        function pickRandomCountry() {
                const lastId = localStorage.getItem("sofrhLastRandomCountry");
                let pool = countries.filter((c) => Math.floor(state.budget / c.dailyCost) >= state.duration);
                pool = pool.filter((c) => c.ready !== false);
                if (pool.length === 0) {
                        pool = countries.filter((c) => Math.floor(state.budget / c.dailyCost) >= 1);
                        pool = pool.filter((c) => c.ready !== false);
                }
                if (pool.length === 0) {
                        pool = countries.filter((c) => c.ready !== false);
                }
                // تصفية حسب القارة لو مختارة
                if (state.continent) {
                        const continentPool = pool.filter((c) => c.continent === state.continent);
                        if (continentPool.length > 0) pool = continentPool;
                }
                if (pool.length > 1 && lastId) {
                        const filtered = pool.filter((c) => c.id !== lastId);
                        if (filtered.length > 0) pool = filtered;
                }
                const choice = pool[Math.floor(Math.random() * pool.length)];
                localStorage.setItem("sofrhLastRandomCountry", choice.id);
                return choice;
        }
        // ===== البحث الحي داخل النتائج =====
        let currentResultsList = [];
        let currentResultsSkipMode = false;
        let currentFilterContinent = null;

        function applySearchFilter() {
                if (!resultsGrid) return;
                const q = normalizeArabic((resultsSearch?.value || "").trim().toLowerCase());

                let filtered = currentFilterContinent
                        ? currentResultsList.filter((c) => c.continent === currentFilterContinent)
                        : currentResultsList;

                if (q) {
                        filtered = filtered.filter((c) =>
                                normalizeArabic(c.nameAr.toLowerCase()).includes(q) || c.nameEn.toLowerCase().includes(q)
                        );
                }

                if (filtered.length === 0) {
                        resultsGrid.innerHTML = `<p class="no-results">ما لقينا دولة تطابق بحثك 🔍 — جرّب اسم ثاني.</p>`;
                        return;
                }
                const sorted = [...filtered].sort((a, b) => {
                        const aReady = a.ready !== false ? 1 : 0;
                        const bReady = b.ready !== false ? 1 : 0;
                        return bReady - aReady;
                });
                resultsGrid.innerHTML = sorted.map((c, i) => cardTemplate(c, i, false, currentResultsSkipMode)).join("");
        }

        resultsSearch?.addEventListener("input", applySearchFilter);

        // فلتر القارات في صفحة النتائج (skipAll)
        resultsContiFilter?.querySelectorAll(".rcf-chip").forEach((chip) => {
                chip.addEventListener("click", () => {
                        resultsContiFilter.querySelectorAll(".rcf-chip").forEach((c) => c.classList.remove("active"));
                        chip.classList.add("active");
                        const val = chip.dataset.continent;
                        currentFilterContinent = val === "all" ? null : val;
                        if (resultsSearch) resultsSearch.value = "";
                        applySearchFilter();
                });
        });

        function renderResults() {
                if (!resultsGrid) return;
                if (resultsSearch) resultsSearch.value = "";

                if (state.isSkipAll) {
                        resultsGrid.classList.remove("random-mode");
                        if (rerollBtn) rerollBtn.style.display = "none";
                        if (resultsSearchWrap) resultsSearchWrap.style.display = "block";
                        if (resultsContiFilter) {
                                resultsContiFilter.style.display = "block";
                                // إعادة تعيين الفلتر
                                resultsContiFilter.querySelectorAll(".rcf-chip").forEach((c) => c.classList.remove("active"));
                                const allChip = resultsContiFilter.querySelector('[data-continent="all"]');
                                if (allChip) allChip.classList.add("active");
                                currentFilterContinent = null;
                        }
                        if (resultsTitle) resultsTitle.textContent = "كل دول العالم";
                        if (resultsSubtitle) {
                                resultsSubtitle.textContent = `بدون أي تصفية حسب تفضيلاتك — ${arabicDigits(countries.length)} وجهة، مرتبة أبجدياً`;
                        }
                        currentResultsList = countries.slice().sort((a, b) => a.nameAr.localeCompare(b.nameAr, "ar"));
                        currentResultsSkipMode = true;
                        applySearchFilter();
                        return;
                }

                if (resultsContiFilter) resultsContiFilter.style.display = "none";
                currentFilterContinent = null;

                if (state.isRandom) {
                        const picked = pickRandomCountry();
                        const scoredCountry = { ...picked, score: calculateMatch(picked) };
                        const continentLabel = state.continent ? ` من ${continentNames[state.continent]}` : "";
                        if (resultsTitle) resultsTitle.textContent = "وجهتك العشوائية";
                        if (resultsSubtitle) resultsSubtitle.textContent = `اخترنا لك دولة عشوائية${continentLabel} — اضغط جرّب وجهة ثانية لاختيار غيرها`;
                        if (resultsSearchWrap) resultsSearchWrap.style.display = "none";
                        resultsGrid.classList.add("random-mode");
                        resultsGrid.innerHTML = cardTemplate(scoredCountry, 0, true, false);
                        if (rerollBtn) rerollBtn.style.display = "inline-block";
                        return;
                }

                resultsGrid.classList.remove("random-mode");
                if (rerollBtn) rerollBtn.style.display = "none";
                if (resultsSearchWrap) resultsSearchWrap.style.display = "block";

                let pool = countries;
                if (state.continent) {
                        pool = countries.filter((c) => c.continent === state.continent);
                        if (resultsTitle) resultsTitle.textContent = `أفضل وجهات ${continentNames[state.continent] || ""} لك`;
                } else {
                        if (resultsTitle) resultsTitle.textContent = "أفضل وجهات العالم لك";
                }
                if (resultsSubtitle) {
                        resultsSubtitle.textContent = `كل الدول ظاهرة مرتبة من الأقرب لاختياراتك — ${arabicDigits(pool.length)} وجهة`;
                }

                currentResultsList = pool
                        .map((c) => ({ ...c, score: calculateMatch(c) }))
                        .sort((a, b) => b.score - a.score);
                currentResultsSkipMode = false;
                applySearchFilter();
        }

        rerollBtn?.addEventListener("click", () => {
                renderResults();
                resultsSection?.scrollIntoView({ behavior: "smooth" });
        });

        // ===== إحصائيات الهيرو (محسوبة تلقائياً من بيانات الدول) =====
        const heroStats = document.getElementById("heroStats");
        if (heroStats) {
                const continentCount = new Set(countries.map((c) => c.continent)).size;
                heroStats.innerHTML = `
            <div class="hero-stat">
                <span class="hero-stat-num">${arabicDigits(countries.length)}</span>
                <span class="hero-stat-label">وجهة حول العالم</span>
            </div>
            <span class="hero-stat-divider"></span>
            <div class="hero-stat">
                <span class="hero-stat-num">${arabicDigits(continentCount)}</span>
                <span class="hero-stat-label">قارات</span>
            </div>
            <span class="hero-stat-divider"></span>
            <div class="hero-stat">
                <span class="hero-stat-num">٣٠٠٠+</span>
                <span class="hero-stat-label">ريال نقطة البداية</span>
            </div>
        `;
        }

        renderTicketStub();
        showStep(1);
});