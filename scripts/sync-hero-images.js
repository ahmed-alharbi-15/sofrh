#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const COUNTRIES_HTML = path.join(ROOT, 'frontend', 'countries', 'countries.html');
const COUNTRY_DIR = path.join(ROOT, 'frontend', 'countries', 'country');

function cloudinaryVariant(url, w) {
  if (!url || !url.includes('res.cloudinary.com')) return url;
  return url.replace(
    /(res\.cloudinary\.com\/[^/]+\/image\/upload\/)([^?#]+)/,
    (_, pre, rest) => pre + `f_auto,q_auto:good,w_${w},c_limit/` + rest.split('/').pop()
  );
}

function isPlaceholder(src) {
  const f = src.split('/').pop().split('?')[0];
  return /^soon\.|^placeholder\./i.test(f);
}

function parseCards(html) {
  const cards = [];
  const chunks = html.split('<div class="country-card"');
  for (let i = 1; i < chunks.length; i++) {
    const chunk = chunks[i];
    const hrefM = chunk.match(/onclick="[^"]*href='([^']+)'/);
    const imgM = chunk.match(/<img[^>]+src="([^"]+)"/);
    if (hrefM && imgM) {
      const src = imgM[1];
      cards.push({ href: hrefM[1], imgSrc: isPlaceholder(src) ? null : src });
    }
  }
  return cards;
}

function updatePage(filePath, imgSrc) {
  if (!fs.existsSync(filePath)) return false;
  let html = fs.readFileSync(filePath, 'utf8');
  const original = html;

  html = html.replace(/[ \t]*<!-- HERO-IMG-START -->[\s\S]*?<!-- HERO-IMG-END -->\n?/g, '');

  if (imgSrc) {
    const u800  = cloudinaryVariant(imgSrc, 800);
    const u1280 = cloudinaryVariant(imgSrc, 1280);
    const u1920 = cloudinaryVariant(imgSrc, 1920);
    const block = `<!-- HERO-IMG-START -->\n<link rel="preload" as="image" href="${u1920}" imagesrcset="${u800} 800w, ${u1280} 1280w, ${u1920} 1920w" imagesizes="100vw" fetchpriority="high">\n<!-- HERO-IMG-END -->`;
    html = html.replace('</head>', block + '\n</head>');
    html = html.replace(/<div class="country-name"([^>]*)>/, (_, attrs) => {
      const clean = attrs.replace(/\s*data-hero-img="[^"]*"/, '');
      return `<div class="country-name"${clean} data-hero-img="${imgSrc}">`;
    });
  } else {
    html = html.replace(/<div class="country-name"([^>]*)>/, (_, attrs) => {
      const clean = attrs.replace(/\s*data-hero-img="[^"]*"/, '');
      return `<div class="country-name"${clean}>`;
    });
  }

  if (html !== original) {
    fs.writeFileSync(filePath, html, 'utf8');
    return true;
  }
  return false;
}

const html = fs.readFileSync(COUNTRIES_HTML, 'utf8');
const cards = parseCards(html);

let updated = 0;
let noImage = [];

for (const { href, imgSrc } of cards) {
  const rel = href.startsWith('/') ? href.slice(1) : href;
  const filePath = path.join(ROOT, 'frontend', rel);
  const changed = updatePage(filePath, imgSrc);
  if (changed) updated++;
  if (!imgSrc) noImage.push(href);
}

console.log(`Updated: ${updated} pages`);
if (noImage.length) {
  console.log('No image:', noImage.join(', '));
} else {
  console.log('All countries have images.');
}
