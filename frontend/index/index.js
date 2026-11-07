const COUNTRIES = [
  {id:'uae',name:'الامارات – UAE',cont:'آسيا',continent:'asia',img:'/img/UAE.jpg'},
  {id:'qatar',name:'قطر – Qatar',cont:'آسيا',continent:'asia',img:'/img/Qatar.jpg'},
  {id:'kuwait',name:'الكويت – Kuwait',cont:'آسيا',continent:'asia',img:'/img/Kuwait.jpg'},
  {id:'bahrain',name:'البحرين – Bahrain',cont:'آسيا',continent:'asia',img:'/img/bahrain-logo.jpg'},
  {id:'oman',name:'عمان – Oman',cont:'آسيا',continent:'asia',img:'/img/oman-logo.jpg'},
  {id:'saudi',name:'السعودية – Saudi Arabia',cont:'آسيا',continent:'asia',img:'/img/Riyadh_Skyline.jpg'},
  {id:'jordan',name:'الأردن – Jordan',cont:'آسيا',continent:'asia',img:'/img/jordan-logo.jpg'},
  {id:'lebanon',name:'لبنان – Lebanon',cont:'آسيا',continent:'asia',img:'/img/lebanon-logo.jpg'},
  {id:'turkey',name:'تركيا – Turkey',cont:'آسيا',continent:'asia',img:'/img/Turkey.jpg'},
  {id:'maldives',name:'المالديف – Maldives',cont:'آسيا',continent:'asia',img:'/img/Maldives.jpg'},
  {id:'srilanka',name:'سريلانكا – Sri Lanka',cont:'آسيا',continent:'asia',img:'/img/Sri Lanka.jpg'},
  {id:'china',name:'الصين – China',cont:'آسيا',continent:'asia',img:'/img/China.jpg'},
  {id:'korea',name:'كوريا الجنوبية – South Korea',cont:'آسيا',continent:'asia',img:'/img/South Korea.jpg'},
  {id:'japan',name:'اليابان – Japan',cont:'آسيا',continent:'asia',img:'/img/japan-logo.jpg'},
  {id:'thailand',name:'تايلاند – Thailand',cont:'آسيا',continent:'asia',img:'/img/Thailand.jpg'},
  {id:'vietnam',name:'فيتنام – Vietnam',cont:'آسيا',continent:'asia',img:'/img/Vietnam.jpg'},
  {id:'indonesia',name:'اندونيسيا – Indonesia',cont:'آسيا',continent:'asia',img:'/img/Indonesia_logo.png'},
  {id:'malaysia',name:'ماليزيا – Malaysia',cont:'آسيا',continent:'asia',img:'/img/Malaysia.jpg'},
  {id:'singapore',name:'سنغافورة – Singapore',cont:'آسيا',continent:'asia',img:'/img/Singapore.jpg'},
  {id:'philippines',name:'الفلبين – Philippines',cont:'آسيا',continent:'asia',img:'/img/Philippines.jpg'},
  {id:'india',name:'الهند – India',cont:'آسيا',continent:'asia',img:'/img/India.jpg'},
  {id:'nepal',name:'نيبال – Nepal',cont:'آسيا',continent:'asia',img:'/img/nepal-logo.jpg'},
  {id:'cambodia',name:'كمبوديا – Cambodia',cont:'آسيا',continent:'asia',img:'/img/cambodia-logo.jpg'},
  {id:'laos',name:'لاوس – Laos',cont:'آسيا',continent:'asia',img:'/img/laos-logo.jpg'},
  {id:'georgia',name:'جورجيا – Georgia',cont:'آسيا',continent:'asia',img:'/img/georgia-logo.jpg'},
  {id:'armenia',name:'أرمينيا – Armenia',cont:'آسيا',continent:'asia',img:'/img/armenia-logo.jpg'},
  {id:'azerbaijan',name:'أذربيجان – Azerbaijan',cont:'آسيا',continent:'asia',img:'/img/azerbaijan-logo.jpg'},
  {id:'kazakhstan',name:'كازاخستان – Kazakhstan',cont:'آسيا',continent:'asia',img:'/img/kazakhstan-logo.jpg'},
  {id:'iran',name:'إيران – Iran',cont:'آسيا',continent:'asia',img:'/img/iran-logo.jpg'},
  {id:'pakistan',name:'باكستان – Pakistan',cont:'آسيا',continent:'asia',img:'/img/pakistan-logo.jpg'},
  {id:'bangladesh',name:'بنغلاديش – Bangladesh',cont:'آسيا',continent:'asia',img:'/img/bangladesh-logo.jpg'},
  {id:'bhutan',name:'بوتان – Bhutan',cont:'آسيا',continent:'asia',img:'/img/bhutan-logo.jpg'},
  {id:'myanmar',name:'ميانمار – Myanmar',cont:'آسيا',continent:'asia',img:'/img/myanmar-logo.jpg'},
  {id:'brunei',name:'بروناي – Brunei',cont:'آسيا',continent:'asia',img:'/img/brunei-logo.jpg'},
  {id:'mongolia',name:'منغوليا – Mongolia',cont:'آسيا',continent:'asia',img:'/img/mongolia-logo.jpg'},
  {id:'uzbekistan',name:'أوزبكستان – Uzbekistan',cont:'آسيا',continent:'asia',img:'/img/uzbekistan-logo.jpg'},
  {id:'kyrgyzstan',name:'قيرغيزستان – Kyrgyzstan',cont:'آسيا',continent:'asia',img:'/img/kyrgyzstan-logo.jpg'},
  {id:'tajikistan',name:'طاجيكستان – Tajikistan',cont:'آسيا',continent:'asia',img:'/img/tajikistan-logo.jpg'},
  {id:'turkmenistan',name:'تركمانستان – Turkmenistan',cont:'آسيا',continent:'asia',img:'/img/turkmenistan-logo.jpg'},
  {id:'timorleste',name:'تيمور الشرقية – Timor-Leste',cont:'آسيا',continent:'asia',img:'/img/timorleste-logo.jpg'},
  {id:'afghanistan',name:'أفغانستان – Afghanistan',cont:'آسيا',continent:'asia',img:'/img/afghanistan-logo.jpg'},
  {id:'iraq',name:'العراق – Iraq',cont:'آسيا',continent:'asia',img:'/img/iraq-logo.jpg'},
  {id:'syria',name:'سوريا – Syria',cont:'آسيا',continent:'asia',img:'/img/syria-logo.jpg'},
  {id:'yemen',name:'اليمن – Yemen',cont:'آسيا',continent:'asia',img:'/img/yemen-logo.jpg'},
  {id:'palestine',name:'فلسطين – Palestine',cont:'آسيا',continent:'asia',img:'/img/palestine-logo.jpg'},
  {id:'northkorea',name:'كوريا الشمالية – North Korea',cont:'آسيا',continent:'asia',img:'/img/northkorea-logo.jpg'},
  {id:'egypt',name:'مصر – Egypt',cont:'أفريقيا',continent:'africa',img:'/img/egypt-logo.jpeg'},
  {id:'morocco',name:'المغرب – Morocco',cont:'أفريقيا',continent:'africa',img:'/img/moroco-logo.jpg'},
  {id:'tunisia',name:'تونس – Tunisia',cont:'أفريقيا',continent:'africa',img:'/img/tunisia-logo.jpg'},
  {id:'kenya',name:'كينيا – Kenya',cont:'أفريقيا',continent:'africa',img:'/img/Kenya.jpg'},
  {id:'rwanda',name:'رواندا – Rwanda',cont:'أفريقيا',continent:'africa',img:'/img/rwanda-logo.jpg'},
  {id:'southafrica',name:'جنوب افريقيا – South Africa',cont:'أفريقيا',continent:'africa',img:'/img/south- africa.jpg'},
  {id:'tanzania',name:'تنزانيا – Tanzania',cont:'أفريقيا',continent:'africa',img:'/img/Tanzania.jpg'},
  {id:'ethiopia',name:'اثيوبيا – Ethiopia',cont:'أفريقيا',continent:'africa',img:'/img/ethiopia-logo.jpg'},
  {id:'namibia',name:'ناميبيا – Namibia',cont:'أفريقيا',continent:'africa',img:'/img/namibia-logo.jpg'},
  {id:'uganda',name:'اوغندا – Uganda',cont:'أفريقيا',continent:'africa',img:'/img/uganda-logo.jpg'},
  {id:'seychelles',name:'سيشل – Seychelles',cont:'أفريقيا',continent:'africa',img:'/img/seychelles-logo.jpg'},
  {id:'mauritius',name:'موريشيوس – Mauritius',cont:'أفريقيا',continent:'africa',img:'/img/mauritius-logo.jpg'},
  {id:'algeria',name:'الجزائر – Algeria',cont:'أفريقيا',continent:'africa',img:'/img/algeria-logo.jpg'},
  {id:'nigeria',name:'نيجيريا – Nigeria',cont:'أفريقيا',continent:'africa',img:'/img/nigeria-logo.jpg'},
  {id:'ghana',name:'غانا – Ghana',cont:'أفريقيا',continent:'africa',img:'/img/ghana-logo.jpg'},
  {id:'senegal',name:'السنغال – Senegal',cont:'أفريقيا',continent:'africa',img:'/img/senegal-logo.jpg'},
  {id:'ivorycoast',name:'ساحل العاج – Ivory Coast',cont:'أفريقيا',continent:'africa',img:'/img/ivorycoast-logo.jpg'},
  {id:'cameroon',name:'الكاميرون – Cameroon',cont:'أفريقيا',continent:'africa',img:'/img/cameroon-logo.jpg'},
  {id:'gabon',name:'الغابون – Gabon',cont:'أفريقيا',continent:'africa',img:'/img/gabon-logo.jpg'},
  {id:'congo',name:'الكونغو – Republic of Congo',cont:'أفريقيا',continent:'africa',img:'/img/congo-logo.jpg'},
  {id:'zambia',name:'زامبيا – Zambia',cont:'أفريقيا',continent:'africa',img:'/img/zambia-logo.jpg'},
  {id:'zimbabwe',name:'زيمبابوي – Zimbabwe',cont:'أفريقيا',continent:'africa',img:'/img/zimbabwe-logo.jpg'},
  {id:'botswana',name:'بوتسوانا – Botswana',cont:'أفريقيا',continent:'africa',img:'/img/botswana-logo.avif'},
  {id:'mozambique',name:'موزمبيق – Mozambique',cont:'أفريقيا',continent:'africa',img:'/img/mozambique-logo.avif'},
  {id:'malawi',name:'مالاوي – Malawi',cont:'أفريقيا',continent:'africa',img:'/img/malawi-logo.avif'},
  {id:'madagascar',name:'مدغشقر – Madagascar',cont:'أفريقيا',continent:'africa',img:'/img/madagascar-logo.webp'},
  {id:'capeverde',name:'الراس الاخضر – Cape Verde',cont:'أفريقيا',continent:'africa',img:'/img/capeverde-logo.avif'},
  {id:'gambia',name:'غامبيا – Gambia',cont:'أفريقيا',continent:'africa',img:'/img/gambia-logo.avif'},
  {id:'benin',name:'بنين – Benin',cont:'أفريقيا',continent:'africa',img:'/img/benin-logo.jpg'},
  {id:'togo',name:'توغو – Togo',cont:'أفريقيا',continent:'africa',img:'/img/togo-logo.webp'},
  {id:'djibouti',name:'جيبوتي – Djibouti',cont:'أفريقيا',continent:'africa',img:'/img/djibouti-logo.jpg'},
  {id:'angola',name:'انغولا – Angola',cont:'أفريقيا',continent:'africa',img:'/img/angola-logo.jpg'},
  {id:'mauritania',name:'موريتانيا – Mauritania',cont:'أفريقيا',continent:'africa',img:'/img/mauritania-logo.jpg'},
  {id:'guinea',name:'غينيا – Guinea',cont:'أفريقيا',continent:'africa',img:'/img/guinea-logo.jpg'},
  {id:'burkinafaso',name:'بوركينا فاسو – Burkina Faso',cont:'أفريقيا',continent:'africa',img:'/img/burkinafaso-logo.jpg'},
  {id:'centralafricanrepublic',name:'افريقيا الوسطى – Central African Republic',cont:'أفريقيا',continent:'africa',img:'/img/centralafricanrepublic-logo.jpg'},
  {id:'chad',name:'تشاد – Chad',cont:'أفريقيا',continent:'africa',img:'/img/chad-logo.jpg'},
  {id:'democraticrepubliccongo',name:'الكونغو الديمقراطية – DR Congo',cont:'أفريقيا',continent:'africa',img:'/img/democraticrepubliccongo-logo.jpg'},
  {id:'eritrea',name:'ارتيريا – Eritrea',cont:'أفريقيا',continent:'africa',img:'/img/eritrea-logo.jpg'},
  {id:'libya',name:'ليبيا – Libya',cont:'أفريقيا',continent:'africa',img:'/img/libya-logo.jpg'},
  {id:'mali',name:'مالي – Mali',cont:'أفريقيا',continent:'africa',img:'/img/mali-logo.jpg'},
  {id:'niger',name:'النيجر – Niger',cont:'أفريقيا',continent:'africa',img:'/img/niger-logo.png'},
  {id:'somalia',name:'الصومال – Somalia',cont:'أفريقيا',continent:'africa',img:'/img/somalia-logo.jpg'},
  {id:'southsudan',name:'جنوب السودان – South Sudan',cont:'أفريقيا',continent:'africa',img:'/img/southsudan-logo.jpg'},
  {id:'sudan',name:'السودان – Sudan',cont:'أفريقيا',continent:'africa',img:'/img/sudan-logo.jpg'},
  {id:'burundi',name:'بوروندي – Burundi',cont:'أفريقيا',continent:'africa',img:'/img/burundi-logo.jpg'},
  {id:'equatorialguinea',name:'غينيا الاستوائية – Equatorial Guinea',cont:'أفريقيا',continent:'africa',img:'/img/equatorialguinea-logo.jpg'},
  {id:'eswatini',name:'اسواتيني – Eswatini',cont:'أفريقيا',continent:'africa',img:'/img/eswatini-logo.jpg'},
  {id:'guineabissau',name:'غينيا بيساو – Guinea-Bissau',cont:'أفريقيا',continent:'africa',img:'/img/guineabissau-logo.jpg'},
  {id:'lesotho',name:'ليسوتو – Lesotho',cont:'أفريقيا',continent:'africa',img:'/img/lesotho-logo.jpg'},
  {id:'liberia',name:'ليبيريا – Liberia',cont:'أفريقيا',continent:'africa',img:'/img/liberia-logo.jpg'},
  {id:'saotomeprincipe',name:'ساو تومي وبرينسيب – Sao Tome and Principe',cont:'أفريقيا',continent:'africa',img:'/img/saotomeprincipe-logo.jpg'},
  {id:'sierraleone',name:'سيراليون – Sierra Leone',cont:'أفريقيا',continent:'africa',img:'/img/sierraleone-logo.jpg'},
  {id:'iceland',name:'ايسلندا – Iceland',cont:'أوروبا',continent:'europe',img:'/img/icelanda.jpg'},
  {id:'france',name:'فرنسا – France',cont:'أوروبا',continent:'europe',img:'/img/france-flag.jpg'},
  {id:'italy',name:'ايطاليا – Italy',cont:'أوروبا',continent:'europe',img:'/img/italy logo.webp'},
  {id:'spain',name:'إسبانيا – Spain',cont:'أوروبا',continent:'europe',img:'/img/spain-flag.jpg'},
  {id:'germany',name:'ألمانيا – Germany',cont:'أوروبا',continent:'europe',img:'/img/germany-flag.jpg'},
  {id:'switzerland',name:'سويسرا – Switzerland',cont:'أوروبا',continent:'europe',img:'/img/Switzerland logo.jpg'},
  {id:'greece',name:'اليونان – Greece',cont:'أوروبا',continent:'europe',img:'/img/greece-flag.jpg'},
  {id:'portugal',name:'البرتغال – Portugal',cont:'أوروبا',continent:'europe',img:'/img/portugal-flag.jpg'},
  {id:'netherlands',name:'هولندا – Netherlands',cont:'أوروبا',continent:'europe',img:'/img/netherlands-flag.jpg'},
  {id:'austria',name:'النمسا – Austria',cont:'أوروبا',continent:'europe',img:'/img/austria-flag.jpg'},
  {id:'czechrepublic',name:'التشيك – Czech Republic',cont:'أوروبا',continent:'europe',img:'/img/czechrepublic-flag.jpg'},
  {id:'hungary',name:'المجر – Hungary',cont:'أوروبا',continent:'europe',img:'/img/hungary-flag.jpg'},
  {id:'poland',name:'بولندا – Poland',cont:'أوروبا',continent:'europe',img:'/img/poland-flag.jpg'},
  {id:'croatia',name:'كرواتيا – Croatia',cont:'أوروبا',continent:'europe',img:'/img/croatia-flag.jpg'},
  {id:'norway',name:'النرويج – Norway',cont:'أوروبا',continent:'europe',img:'/img/norway-flag.jpg'},
  {id:'sweden',name:'السويد – Sweden',cont:'أوروبا',continent:'europe',img:'/img/sweden-flag.jpg'},
  {id:'denmark',name:'الدنمارك – Denmark',cont:'أوروبا',continent:'europe',img:'/img/denmark-flag.jpg'},
  {id:'finland',name:'فنلندا – Finland',cont:'أوروبا',continent:'europe',img:'/img/finland-flag.jpg'},
  {id:'ireland',name:'أيرلندا – Ireland',cont:'أوروبا',continent:'europe',img:'/img/ireland-flag.jpg'},
  {id:'serbia',name:'صربيا – Serbia',cont:'أوروبا',continent:'europe',img:'/img/serbia-flag.jpg'},
  {id:'belgium',name:'بلجيكا – Belgium',cont:'أوروبا',continent:'europe',img:'/img/belgium-flag.jpg'},
  {id:'malta',name:'مالطا – Malta',cont:'أوروبا',continent:'europe',img:'/img/malta-flag.jpg'},
  {id:'cyprus',name:'قبرص – Cyprus',cont:'أوروبا',continent:'europe',img:'/img/cyprus-flag.jpg'},
  {id:'slovenia',name:'سلوفينيا – Slovenia',cont:'أوروبا',continent:'europe',img:'/img/slovenia-flag.jpg'},
  {id:'slovakia',name:'سلوفاكيا – Slovakia',cont:'أوروبا',continent:'europe',img:'/img/slovakia-flag.jpg'},
  {id:'romania',name:'رومانيا – Romania',cont:'أوروبا',continent:'europe',img:'/img/romania-flag.jpg'},
  {id:'bulgaria',name:'بلغاريا – Bulgaria',cont:'أوروبا',continent:'europe',img:'/img/bulgaria-flag.jpg'},
  {id:'albania',name:'ألبانيا – Albania',cont:'أوروبا',continent:'europe',img:'/img/albania-flag.jpg'},
  {id:'bosnia',name:'البوسنة – Bosnia',cont:'أوروبا',continent:'europe',img:'/img/bosnia-flag.jpg'},
  {id:'montenegro',name:'الجبل الأسود – Montenegro',cont:'أوروبا',continent:'europe',img:'/img/montenegro-flag.jpg'},
  {id:'northmacedonia',name:'مقدونيا الشمالية – North Macedonia',cont:'أوروبا',continent:'europe',img:'/img/northmacedonia-flag.jpg'},
  {id:'lithuania',name:'ليتوانيا – Lithuania',cont:'أوروبا',continent:'europe',img:'/img/lithuania-flag.jpg'},
  {id:'latvia',name:'لاتفيا – Latvia',cont:'أوروبا',continent:'europe',img:'/img/latvia-flag.jpg'},
  {id:'estonia',name:'إستونيا – Estonia',cont:'أوروبا',continent:'europe',img:'/img/estonia-flag.jpg'},
  {id:'usa',name:'امريكا – USA',cont:'أمريكا الشمالية',continent:'north-america',img:'/img/usa lgo.jpg'},
  {id:'canada',name:'كندا – Canada',cont:'أمريكا الشمالية',continent:'north-america',img:'/img/Canada logo.jpg'},
  {id:'mexico',name:'المكسيك – Mexico',cont:'أمريكا الشمالية',continent:'north-america',img:'/img/mexico logo.jpg'},
  {id:'panama',name:'بنما – Panama',cont:'أمريكا الشمالية',continent:'north-america',img:'/img/panama-logo.jpg'},
  {id:'cuba',name:'كوبا – Cuba',cont:'أمريكا الشمالية',continent:'north-america',img:'/img/cuba-logo.jpg'},
  {id:'dominican',name:'جمهورية الدومينيكان – Dominican Republic',cont:'أمريكا الشمالية',continent:'north-america',img:'/img/dominican-logo.jpg'},
  {id:'jamaica',name:'جامايكا – Jamaica',cont:'أمريكا الشمالية',continent:'north-america',img:'/img/jamaica-logo.jpg'},
  {id:'bahamas',name:'الباهاما – Bahamas',cont:'أمريكا الشمالية',continent:'north-america',img:'/img/bahamas-logo.jpg'},
  {id:'trinidad',name:'ترينيداد وتوباغو – Trinidad',cont:'أمريكا الشمالية',continent:'north-america',img:'/img/trinidad-logo.jpg'},
  {id:'barbados',name:'بربادوس – Barbados',cont:'أمريكا الشمالية',continent:'north-america',img:'/img/barbados-logo.jpg'},
  {id:'haiti',name:'هايتي – Haiti',cont:'أمريكا الشمالية',continent:'north-america',img:'/img/haiti-logo.jpg'},
  {id:'brazil',name:'البرازيل – Brazil',cont:'أمريكا الجنوبية',continent:'south-america',img:'/img/brazil logo.jpg'},
  {id:'argentina',name:'الأرجنتين – Argentina',cont:'أمريكا الجنوبية',continent:'south-america',img:'/img/argentina-logo.jpg'},
  {id:'peru',name:'بيرو – Peru',cont:'أمريكا الجنوبية',continent:'south-america',img:'/img/Peru log.jpeg'},
  {id:'chile',name:'تشيلي – Chile',cont:'أمريكا الجنوبية',continent:'south-america',img:'/img/chile-logo.jpg'},
  {id:'colombia',name:'كولومبيا – Colombia',cont:'أمريكا الجنوبية',continent:'south-america',img:'/img/colomvi logo.jpg'},
  {id:'ecuador',name:'الإكوادور – Ecuador',cont:'أمريكا الجنوبية',continent:'south-america',img:'/img/ecuador-logo.jpg'},
  {id:'bolivia',name:'بوليفيا – Bolivia',cont:'أمريكا الجنوبية',continent:'south-america',img:'/img/bolivia-logo.jpg'},
  {id:'paraguay',name:'باراغواي – Paraguay',cont:'أمريكا الجنوبية',continent:'south-america',img:'/img/paraguay-logo.jpg'},
  {id:'uruguay',name:'أوروغواي – Uruguay',cont:'أمريكا الجنوبية',continent:'south-america',img:'/img/uruguay-logo.jpg'},
  {id:'guyana',name:'غيانا – Guyana',cont:'أمريكا الجنوبية',continent:'south-america',img:'/img/guyana-logo.jpg'},
  {id:'suriname',name:'سورينام – Suriname',cont:'أمريكا الجنوبية',continent:'south-america',img:'/img/suriname-logo.jpg'},
  {id:'venezuela',name:'فنزويلا – Venezuela',cont:'أمريكا الجنوبية',continent:'south-america',img:'/img/venezuela-logo.jpg'},
  {id:'australia',name:'أستراليا – Australia',cont:'أوقيانوسيا',continent:'oceania',img:'/img/australia-logo.jpg'},
  {id:'newzealand',name:'نيوزيلندا – New Zealand',cont:'أوقيانوسيا',continent:'oceania',img:'/img/newzealand-logo.jpg'},
  {id:'fiji',name:'فيجي – Fiji',cont:'أوقيانوسيا',continent:'oceania',img:'/img/fiji-logo.jpg'},
  {id:'papuanewguinea',name:'بابوا غينيا الجديدة – Papua New Guinea',cont:'أوقيانوسيا',continent:'oceania',img:'/img/papuanewguinea-logo.jpg'},
  {id:'samoa',name:'ساموا – Samoa',cont:'أوقيانوسيا',continent:'oceania',img:'/img/samoa-logo.jpg'},
  {id:'tonga',name:'تونغا – Tonga',cont:'أوقيانوسيا',continent:'oceania',img:'/img/tonga-logo.jpg'},
  {id:'vanuatu',name:'فانواتو – Vanuatu',cont:'أوقيانوسيا',continent:'oceania',img:'/img/vanuatu-logo.jpg'},
  {id:'solomonislands',name:'جزر سليمان – Solomon Islands',cont:'أوقيانوسيا',continent:'oceania',img:'/img/solomonislands-logo.jpg'},
  {id:'palau',name:'بالاو – Palau',cont:'أوقيانوسيا',continent:'oceania',img:'/img/palau-logo.jpg'},
  {id:'kiribati',name:'كيريباتي – Kiribati',cont:'أوقيانوسيا',continent:'oceania',img:'/img/kiribati-logo.jpg'},
  {id:'marshallislands',name:'جزر مارشال – Marshall Islands',cont:'أوقيانوسيا',continent:'oceania',img:'/img/marshallislands-logo.jpg'},
  {id:'micronesia',name:'ميكرونيزيا – Micronesia',cont:'أوقيانوسيا',continent:'oceania',img:'/img/micronesia-logo.jpg'},
  {id:'nauru',name:'ناورو – Nauru',cont:'أوقيانوسيا',continent:'oceania',img:'/img/nauru-logo.jpg'},
  {id:'tuvalu',name:'توفالو – Tuvalu',cont:'أوقيانوسيا',continent:'oceania',img:'/img/tuvalu-logo.jpg'},
  {id:'antiguabarbuda',name:'أنتيغوا وباربودا – Antigua and Barbuda',cont:'أمريكا الشمالية',continent:'north-america',img:'/img/antigua-logo.jpg'},
  {id:'dominica',name:'دومينيكا – Dominica',cont:'أمريكا الشمالية',continent:'north-america',img:'/img/dominica-logo.jpg'},
  {id:'grenada',name:'غرينادا – Grenada',cont:'أمريكا الشمالية',continent:'north-america',img:'/img/grenada-logo.jpg'},
  {id:'stkittsnevis',name:'سانت كيتس ونيفيس – Saint Kitts',cont:'أمريكا الشمالية',continent:'north-america',img:'/img/stkittsnevis-logo.jpg'},
  {id:'stlucia',name:'سانت لوسيا – Saint Lucia',cont:'أمريكا الشمالية',continent:'north-america',img:'/img/stlucia-logo.jpg'},
  {id:'stvincentgrenadines',name:'سانت فينسنت – Saint Vincent',cont:'أمريكا الشمالية',continent:'north-america',img:'/img/stvincentgrenadines-logo.jpg'}
];

const DISPLAY_COUNTRIES = COUNTRIES.filter(c => !c.img.includes('coming-soon'));

const RECIPES = [
  {id:'kabsa',name:'الكبسة – Kabsa',country:'السعودية',img:'https://res.cloudinary.com/dqe6mmkzz/image/upload/f_auto,q_auto/كبسة.jpg'},
  {id:'Saleeg',name:'السليق – Saleeg',country:'السعودية',img:'https://res.cloudinary.com/dqe6mmkzz/image/upload/f_auto,q_auto/سليق.jpg'},
  {id:'sushi',name:'سوشي – Sushi',country:'اليابان',img:'https://res.cloudinary.com/dqe6mmkzz/image/upload/f_auto,q_auto/soshe.jpg'},
  {id:'ramen',name:'رامن – Ramen',country:'اليابان',img:'https://res.cloudinary.com/dqe6mmkzz/image/upload/f_auto,q_auto/رامن.jpg'},
  {id:'nasi-goreng',name:'ناسي جورينج – Nasi Goreng',country:'إندونيسيا',img:'https://res.cloudinary.com/dqe6mmkzz/image/upload/f_auto,q_auto/Nasi_Goreng.jpg'},
  {id:'pad-thai',name:'باد تاي – Pad Thai',country:'تايلاند',img:'https://res.cloudinary.com/dqe6mmkzz/image/upload/f_auto,q_auto/Pad_Thai.jpg'},
  {id:'butter-chicken',name:'زبدة الدجاج – Butter Chicken',country:'الهند',img:'https://res.cloudinary.com/dqe6mmkzz/image/upload/f_auto,q_auto/Butter_Chicken.jpg'},
  {id:'peking-duck',name:'بط بكين – Peking Duck',country:'الصين',img:'https://res.cloudinary.com/dqe6mmkzz/image/upload/f_auto,q_auto/Peking_Duck.jpg'},
  {id:'hoawshi',name:'الحواوشي – Hoawshi',country:'مصر',img:'https://res.cloudinary.com/dqe6mmkzz/image/upload/f_auto,q_auto/حواوشي.jpg'},
  {id:'iskender-kebab',name:'إسكندر كباب – Iskender Kebab',country:'تركيا',img:'https://res.cloudinary.com/dqe6mmkzz/image/upload/f_auto,q_auto/اسكندر-كباب.jpg'},
  {id:'neapolitan-pizza',name:'بيتزا نابوليتانا – Neapolitan Pizza',country:'إيطاليا',img:'https://res.cloudinary.com/dqe6mmkzz/image/upload/f_auto,q_auto/Neapolitan-Pizza.webp'},
  {id:'feijoada',name:'فيجوادا – Feijoada',country:'البرازيل',img:'https://res.cloudinary.com/dqe6mmkzz/image/upload/f_auto,q_auto/فيجوادا.jpg'},
  {id:'ceviche',name:'سيفيتشي – Ceviche',country:'بيرو',img:'https://res.cloudinary.com/dqe6mmkzz/image/upload/f_auto,q_auto/Ceviche.jpg'},
  {id:'tacos',name:'تاكو – Tacos',country:'المكسيك',img:'https://res.cloudinary.com/dqe6mmkzz/image/upload/f_auto,q_auto/Tacos.jpg'},
  {id:'burger',name:'برغر – Burger',country:'الولايات المتحدة',img:'https://res.cloudinary.com/dqe6mmkzz/image/upload/f_auto,q_auto/Burger.jpg'},
  {id:'poutine',name:'بوتين – Poutine',country:'كندا',img:'https://res.cloudinary.com/dqe6mmkzz/image/upload/f_auto,q_auto/Poutine.jpg'},
  {id:'shebakia',name:'الشباكية – Shebakia',country:'المغرب',img:'https://res.cloudinary.com/dqe6mmkzz/image/upload/f_auto,q_auto/الشباكية.jpg'},
  {id:'fondue',name:'فوندو – Fondue',country:'سويسرا',img:'https://res.cloudinary.com/dqe6mmkzz/image/upload/f_auto,q_auto/الفوندو_(Fondue).jpg'},
  {id:'vinarterta',name:'فينارتيرتا – Vinarterta',country:'آيسلندا',img:'https://res.cloudinary.com/dqe6mmkzz/image/upload/f_auto,q_auto/Vínarterta.webp'},
  {id:'bandeja-paisa',name:'بانديخا بايسا – Bandeja Paisa',country:'كولومبيا',img:'https://res.cloudinary.com/dqe6mmkzz/image/upload/f_auto,q_auto/Bandeja_Paisa.jpg'}
];

const EVENTS = [
  {id:'sodh',name:'موسم السودة – Al-Soudah Season',country:'السعودية',date:'يونيو – سبتمبر',img:'https://res.cloudinary.com/dqe6mmkzz/image/upload/f_auto,q_auto/السوده.webp'},
  {id:'hanami',name:'مهرجان أزهار الكرز – Hanami',country:'اليابان',date:'مارس – أبريل',img:'https://res.cloudinary.com/dqe6mmkzz/image/upload/f_auto,q_auto/Hanami.jpg'},
  {id:'GizaPyramids',name:'زيارة الأهرامات – The Pyramids',country:'مصر',date:'أكتوبر – أبريل',img:'https://res.cloudinary.com/dqe6mmkzz/image/upload/f_auto,q_auto/زيارة الأهرامات.jpg'},
  {id:'KrugerNationalPark',name:'سفاري كروغر – Kruger National Park',country:'جنوب أفريقيا',date:'مايو – سبتمبر',img:'https://res.cloudinary.com/dqe6mmkzz/image/upload/f_auto,q_auto/السفاري في حديقة كروغر الوطنية.jpg'},
  {id:'AmalfiCoast',name:'ساحل أمالفي – Amalfi Coast',country:'إيطاليا',date:'يونيو – أغسطس',img:'https://res.cloudinary.com/dqe6mmkzz/image/upload/f_auto,q_auto/amalve.jpg'},
  {id:'NorthernLights',name:'الشفق القطبي – Northern Lights',country:'آيسلندا',date:'سبتمبر – مارس',img:'https://res.cloudinary.com/dqe6mmkzz/image/upload/v1788074284/Northern_Lights_Aurora_Borealis.webp'},
  {id:'CamelTrek',name:'رحلة بالجمال في الصحراء – Camel Trek',country:'المغرب',date:'أكتوبر – أبريل',img:'https://res.cloudinary.com/dqe6mmkzz/image/upload/f_auto,q_auto/رحلة الجمال في الصحراء.jpg'},
  {id:'Waterfalls',name:'الاسترخاء في الشلالات – Waterfalls',country:'إندونيسيا',date:'مايو – أكتوبر',img:'https://res.cloudinary.com/dqe6mmkzz/image/upload/v1793799671/Waterfalls.jpg'}
];

function dayOfYear() {
  const now = new Date();
  return Math.floor((now - new Date(now.getFullYear(), 0, 0)) / 86400000);
}

function seededShuffle(arr, seed) {
  const a = arr.slice();
  let s = seed >>> 0;
  for (let i = a.length - 1; i > 0; i--) {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    const j = s % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickForDay(pool, n) {
  const seed = parseInt(new Date().toISOString().slice(0, 10).replace(/-/g, ''), 10);
  return seededShuffle(pool, seed).slice(0, n);
}

function thumbUrl(url) {
  if (!url) return '';
  if (url.includes('res.cloudinary.com') && url.includes('/upload/')) {
    return url.replace('/upload/', '/upload/f_auto,q_auto:good,w_120,h_120,c_fill/');
  }
  return url;
}

function getArabicDate() {
  const days = ['الأحد','الاثنين','الثلاثاء','الأربعاء','الخميس','الجمعة','السبت'];
  const months = ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];
  const now = new Date();
  return days[now.getDay()] + '، ' + now.getDate() + ' ' + months[now.getMonth()] + ' ' + now.getFullYear();
}

function buildRow(name, img, detail, href) {
  const a = document.createElement('a');
  a.className = 'menu-row';
  a.href = href;
  const imgEl = document.createElement('img');
  imgEl.className = 'menu-row-img';
  imgEl.src = thumbUrl(img);
  imgEl.alt = name.split('–')[0].trim();
  imgEl.loading = 'lazy';
  const nameEl = document.createElement('span');
  nameEl.className = 'menu-row-name';
  nameEl.textContent = name;
  const dots = document.createElement('span');
  dots.className = 'menu-dots';
  dots.setAttribute('aria-hidden', 'true');
  const detailEl = document.createElement('span');
  detailEl.className = 'menu-row-detail';
  detailEl.textContent = detail;
  a.append(imgEl, nameEl, dots, detailEl);
  return a;
}

function handleSearch() {
  const val = document.getElementById('menuSearch').value.trim().toLowerCase();
  if (!val) return;
  const match = DISPLAY_COUNTRIES.find(c =>
    c.name.includes(val) || c.name.toLowerCase().includes(val) || c.id === val
  );
  if (match) {
    window.location.href = '/countries/country/' + match.continent + '/' + match.id + '.html';
  } else {
    window.location.href = '/countries/countries.html';
  }
}

const scrollBtn = document.getElementById('scrollTopBtn');
if (scrollBtn) {
  window.addEventListener('scroll', () => {
    scrollBtn.classList.toggle('visible', window.scrollY > 300);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const dateEl = document.getElementById('menuDate');
  if (dateEl) dateEl.textContent = getArabicDate();

  const countriesEl = document.getElementById('countriesRows');
  if (countriesEl) {
    pickForDay(DISPLAY_COUNTRIES, 6).forEach(c => {
      const url = '/countries/country/' + c.continent + '/' + c.id + '.html';
      countriesEl.appendChild(buildRow(c.name, c.img, c.cont, url));
    });
  }

  const recipesEl = document.getElementById('recipesRows');
  if (recipesEl) {
    pickForDay(RECIPES, 6).forEach(r => {
      const url = '/recipes/recipes.html?recipe=' + r.id;
      recipesEl.appendChild(buildRow(r.name, r.img, r.country, url));
    });
  }

  const eventsEl = document.getElementById('eventsRows');
  if (eventsEl) {
    pickForDay(EVENTS, 4).forEach(ev => {
      const url = '/events/events.html?event=' + ev.id;
      const detail = ev.country + ' · ' + ev.date;
      eventsEl.appendChild(buildRow(ev.name, ev.img, detail, url));
    });
  }

  const searchInput = document.getElementById('menuSearch');
  const searchBtn = document.getElementById('menuSearchBtn');
  if (searchInput) {
    searchInput.addEventListener('keydown', e => { if (e.key === 'Enter') handleSearch(); });
  }
  if (searchBtn) {
    searchBtn.addEventListener('click', handleSearch);
  }
});
