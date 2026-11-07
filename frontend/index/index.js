const heroSlides = [
  { country:'السعودية', countryEn:'Saudi Arabia', continent:'asia', id:'saudi',
    countryImg:'https://res.cloudinary.com/dqe6mmkzz/image/upload/f_auto,q_auto/Riyadh_Skyline.jpg',
    recipe:'الكبسة – Kabsa', recipeId:'kabsa',
    recipeImg:'https://res.cloudinary.com/dqe6mmkzz/image/upload/f_auto,q_auto/كبسة.jpg' },
  { country:'اليابان', countryEn:'Japan', continent:'asia', id:'japan',
    countryImg:'https://res.cloudinary.com/dqe6mmkzz/image/upload/f_auto,q_auto/japan-logo.jpg',
    recipe:'سوشي – Sushi', recipeId:'sushi',
    recipeImg:'https://res.cloudinary.com/dqe6mmkzz/image/upload/f_auto,q_auto/soshe.jpg' },
  { country:'تركيا', countryEn:'Turkey', continent:'asia', id:'turkey',
    countryImg:'https://res.cloudinary.com/dqe6mmkzz/image/upload/f_auto,q_auto/Turkey.jpg',
    recipe:'إسكندر كباب – Iskender Kebab', recipeId:'iskender-kebab',
    recipeImg:'https://res.cloudinary.com/dqe6mmkzz/image/upload/f_auto,q_auto/اسكندر.jpg' },
  { country:'فرنسا', countryEn:'France', continent:'europe', id:'france',
    countryImg:'https://res.cloudinary.com/dqe6mmkzz/image/upload/f_auto,q_auto/france-flag.jpg',
    recipe:'راتاتوي – Ratatouille', recipeId:'ratatouille',
    recipeImg:'https://res.cloudinary.com/dqe6mmkzz/image/upload/f_auto,q_auto/Ratatouille.jpg' },
  { country:'ايطاليا', countryEn:'Italy', continent:'europe', id:'italy',
    countryImg:'https://res.cloudinary.com/dqe6mmkzz/image/upload/v1788072054/italy_logo.webp',
    recipe:'بيتزا نابوليتانا – Neapolitan Pizza', recipeId:'neapolitan-pizza',
    recipeImg:'https://res.cloudinary.com/dqe6mmkzz/image/upload/f_auto,q_auto/Neapolitan-Pizza.webp' }
];

const dailyRecipes = [
  { id:'kabsa', name:'الكبسة – Kabsa', country:'السعودية', img:'https://res.cloudinary.com/dqe6mmkzz/image/upload/f_auto,q_auto/كبسة.jpg' },
  { id:'sushi', name:'سوشي – Sushi', country:'اليابان', img:'https://res.cloudinary.com/dqe6mmkzz/image/upload/f_auto,q_auto/soshe.jpg' },
  { id:'iskender-kebab', name:'إسكندر كباب – Iskender Kebab', country:'تركيا', img:'https://res.cloudinary.com/dqe6mmkzz/image/upload/f_auto,q_auto/اسكندر.jpg' },
  { id:'butter-chicken', name:'دجاج بالزبدة – Butter Chicken', country:'الهند', img:'https://res.cloudinary.com/dqe6mmkzz/image/upload/f_auto,q_auto/butter-chicken.jpg' },
  { id:'neapolitan-pizza', name:'بيتزا نابوليتانا – Neapolitan Pizza', country:'ايطاليا', img:'https://res.cloudinary.com/dqe6mmkzz/image/upload/f_auto,q_auto/Neapolitan-Pizza.webp' },
  { id:'nasi-goreng', name:'ناسي غورينغ – Nasi Goreng', country:'إندونيسيا', img:'https://res.cloudinary.com/dqe6mmkzz/image/upload/f_auto,q_auto/Nasi-Goreng.jpg' },
  { id:'ratatouille', name:'راتاتوي – Ratatouille', country:'فرنسا', img:'https://res.cloudinary.com/dqe6mmkzz/image/upload/f_auto,q_auto/Ratatouille.jpg' }
];

const homeEvents = [
  { id:'sodh', name:'سوق عكاظ – Souq Okaz', country:'🇸🇦 السعودية', date:'يوليو – أغسطس', img:'https://res.cloudinary.com/dqe6mmkzz/image/upload/f_auto,q_auto/Souq-Okaz.jpg' },
  { id:'hanami', name:'مهرجان هاناما – Hanami', country:'🇯🇵 اليابان', date:'مارس – أبريل', img:'https://res.cloudinary.com/dqe6mmkzz/image/upload/f_auto,q_auto/hanami.jpg' },
  { id:'Waterfalls', name:'شلالات جاوا – Java Waterfalls', country:'🇮🇩 إندونيسيا', date:'طوال العام', img:'https://res.cloudinary.com/dqe6mmkzz/image/upload/f_auto,q_auto/java-waterfalls.jpg' },
  { id:'GizaPyramids', name:'أهرامات الجيزة – Giza Pyramids', country:'🇪🇬 مصر', date:'طوال العام', img:'https://res.cloudinary.com/dqe6mmkzz/image/upload/f_auto,q_auto/Giza-Pyramids.jpg' },
  { id:'KrugerNationalPark', name:'منتزه كروغر – Kruger Park', country:'🇿🇦 جنوب أفريقيا', date:'مايو – سبتمبر', img:'https://res.cloudinary.com/dqe6mmkzz/image/upload/f_auto,q_auto/Kruger-National-Park.jpg' },
  { id:'CamelTrek', name:'رحلة الجمال – Camel Trek', country:'🇲🇦 المغرب', date:'أكتوبر – أبريل', img:'https://res.cloudinary.com/dqe6mmkzz/image/upload/f_auto,q_auto/Morocco-Camel-Trek.jpg' },
  { id:'AmalfiCoast', name:'ساحل أمالفي – Amalfi Coast', country:'🇮🇹 ايطاليا', date:'مايو – أكتوبر', img:'https://res.cloudinary.com/dqe6mmkzz/image/upload/f_auto,q_auto/Amalfi-Coast.jpg' },
  { id:'NorthernLights', name:'الشفق القطبي – Northern Lights', country:'🇮🇸 آيسلندا', date:'سبتمبر – مارس', img:'https://res.cloudinary.com/dqe6mmkzz/image/upload/f_auto,q_auto/northern-lights.jpg' }
];

let heroIdx = 0, heroTimer = null;

function setHeroSlide(idx, instant) {
  const s = heroSlides[idx];
  const bgImg = document.getElementById('heroBgImg');
  const recipeImg = document.getElementById('heroRecipeImg');
  const countryName = document.getElementById('heroCountryName');
  const recipeTag = document.getElementById('heroRecipeTag');
  const recipeName = document.getElementById('heroRecipeName');
  const recipeLink = document.getElementById('heroRecipeLink');
  const exploreBtn = document.getElementById('heroExploreBtn');

  if (!bgImg) return;

  if (!instant) {
    bgImg.style.opacity = '0';
    recipeImg.style.opacity = '0';
  }

  setTimeout(() => {
    bgImg.src = s.countryImg;
    recipeImg.src = s.recipeImg;
    countryName.textContent = s.country;
    recipeName.textContent = s.recipe;
    recipeTag.textContent = s.country + ' — ' + s.countryEn;
    recipeLink.href = '/recipes/recipes.html?recipe=' + s.recipeId;
    exploreBtn.href = '/countries/country/' + s.continent + '/' + s.id + '.html';

    bgImg.style.opacity = '1';
    recipeImg.style.opacity = '1';
  }, instant ? 0 : 250);

  document.querySelectorAll('.hero-dot').forEach((d, i) => {
    d.classList.toggle('active', i === idx);
  });
}

function startHeroRotation() {
  if (heroTimer) clearInterval(heroTimer);
  heroTimer = setInterval(() => {
    heroIdx = (heroIdx + 1) % heroSlides.length;
    setHeroSlide(heroIdx);
  }, 5000);
}

function buildDots() {
  const wrap = document.getElementById('heroDots');
  if (!wrap) return;
  heroSlides.forEach((_, i) => {
    const btn = document.createElement('button');
    btn.className = 'hero-dot' + (i === 0 ? ' active' : '');
    btn.addEventListener('click', () => {
      heroIdx = i;
      setHeroSlide(i);
      startHeroRotation();
    });
    wrap.appendChild(btn);
  });
}

function buildDish() {
  const day = new Date().getDay();
  const r = dailyRecipes[day % dailyRecipes.length];
  const img = document.getElementById('dishImg');
  const name = document.getElementById('dishName');
  const country = document.getElementById('dishCountry');
  const link = document.getElementById('dishLink');
  const days = ['الأحد','الاثنين','الثلاثاء','الأربعاء','الخميس','الجمعة','السبت'];
  const badge = document.getElementById('dishDayBadge');
  if (img) img.src = r.img;
  if (name) name.textContent = r.name;
  if (country) country.textContent = r.country;
  if (link) link.href = '/recipes/recipes.html?recipe=' + r.id;
  if (badge) badge.textContent = 'وصفة ' + days[day];
}

function buildEvents() {
  const track = document.getElementById('eventsScrollTrack');
  if (!track) return;
  homeEvents.forEach(ev => {
    const a = document.createElement('a');
    a.className = 'event-strip-card';
    a.href = '/events/events.html?event=' + ev.id;
    a.innerHTML = '<img src="' + ev.img + '" alt="' + ev.name + '" loading="lazy">' +
      '<div class="event-strip-info">' +
        '<span class="event-strip-country">' + ev.country + '</span>' +
        '<span class="event-strip-name">' + ev.name + '</span>' +
        '<span class="event-strip-date">' + ev.date + '</span>' +
      '</div>';
    track.appendChild(a);
  });
  enableDragScroll(track);
}

function enableDragScroll(el) {
  let isDown = false, startX, scrollLeft;
  el.addEventListener('mousedown', e => {
    isDown = true;
    startX = e.pageX - el.offsetLeft;
    scrollLeft = el.scrollLeft;
  });
  el.addEventListener('mouseleave', () => isDown = false);
  el.addEventListener('mouseup', () => isDown = false);
  el.addEventListener('mousemove', e => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - el.offsetLeft;
    el.scrollLeft = scrollLeft - (x - startX);
  });
}

const scrollBtn = document.getElementById('scrollTopBtn');
if (scrollBtn) {
  window.addEventListener('scroll', () => {
    scrollBtn.classList.toggle('visible', window.scrollY > 400);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  buildDots();
  setHeroSlide(0, true);
  startHeroRotation();
  buildDish();
  buildEvents();

  const bgImg = document.getElementById('heroBgImg');
  const recipeImg = document.getElementById('heroRecipeImg');
  if (bgImg) bgImg.style.transition = 'opacity 0.5s ease, transform 0.8s ease';
  if (recipeImg) recipeImg.style.transition = 'opacity 0.5s ease, transform 0.8s ease';
});
