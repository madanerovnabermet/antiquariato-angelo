// Page templates. Every page is static HTML with real text, so search engines
// and visitors without JavaScript see the full content.
import { categories, items, featured, homeFeature, categoryCover } from "./data.mjs";
import { t, seg, shop, waLink } from "./i18n.mjs";

export const SITE = "https://antiquariatoangelo.com"; // domain confirmed by the shop
export const GSAP = "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5";
const LANGS = ["it", "en"];

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
// "words *italic.*" -> <em>
const em = (s) => s.replace(/\*(.+?)\*/g, "<em>$1</em>");
// masked word reveal for big headings
const words = (s) => s.split(" ").map((w) => {
  const it = /^\*(.+)\*$/.exec(w);
  return `<span class="w"><span class="w__i" data-word>${it ? `<em>${it[1]}</em>` : w}</span></span>`;
}).join(" ");

export const live = items.filter((i) => i.status !== "draft");
const byId = Object.fromEntries(categories.map((c) => [c.id, c]));
const bySlug = Object.fromEntries(live.map((i) => [i.slug, i]));
const countIn = (id) => live.filter((i) => i.cat === id).length;
const newest = (a, b) => (b.added.localeCompare(a.added)) || (items.indexOf(b) - items.indexOf(a));

// ---------- paths ----------
// A page path is like "it/collezione/lalique/". In preview mode links point at
// index.html files relative to the current page (the preview host has no
// directory index); in production they are clean absolute URLs.
export const paths = {
  home: (l) => `${l}/`,
  collection: (l) => `${l}/${seg[l].collection}/`,
  category: (l, id) => `${l}/${seg[l].collection}/${byId[id].slug[l]}/`,
  item: (l, slug) => `${l}/${seg[l].item}/${slug}/`,
  story: (l) => `${l}/${seg[l].story}/`,
  sell: (l) => `${l}/${seg[l].sell}/`,
  contact: (l) => `${l}/${seg[l].contact}/`,
};

// changes on every build, so browsers fetch fresh styles and scripts after an update
const BUILD = Date.now().toString(36);

function linker(from, preview) {
  if (preview === "embed") return {     // single-file preview: tokens resolved by the preview player
    page: (p) => "page:" + p + "index.html",
    asset: (p) => `@@ASSET:${p}@@`,
    photo: (n, ext = "jpg") => /^https?:/.test(n) ? n : `@@IMG:${n}.${ext}@@`,
  };
  const up = preview ? "../".repeat(from.split("/").filter(Boolean).length) : "/";
  return {
    page: (p) => preview ? up + p + "index.html" : "/" + p,
    asset: (p) => preview ? up + p : `${up}${p}?v=${BUILD}`,
    photo: (n, ext = "jpg") => /^https?:/.test(n) ? n : `${up}photos/${n}.${ext}`,
  };
}
const abs = (p) => SITE + "/" + p;

const ICON = {
  wa: `<svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.21 3.07.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.7.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2.01-1.42.25-.7.25-1.29.17-1.42-.07-.12-.27-.2-.57-.35m-5.42 7.4h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.89-9.88 2.64 0 5.12 1.03 6.99 2.9a9.82 9.82 0 0 1 2.89 6.99c0 5.45-4.44 9.88-9.88 9.88m8.41-18.3A11.81 11.81 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.88 11.88 0 0 0 5.68 1.45h.01c6.55 0 11.89-5.34 11.89-11.89 0-3.18-1.24-6.16-3.48-8.41Z"/></svg>`,
  search: `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>`,
  close: `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M6 6l12 12M18 6 6 18"/></svg>`,
  prev: `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6"><path d="m15 5-7 7 7 7"/></svg>`,
  next: `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6"><path d="m9 5 7 7-7 7"/></svg>`,
  ig: `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>`,
  tt: `<svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M16.6 5.82A4.28 4.28 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 0 1-2.59 2.5 2.6 2.6 0 0 1 0-5.2c.27 0 .53.04.78.12V9.66a5.68 5.68 0 0 0-.78-.05 5.69 5.69 0 1 0 5.69 5.69V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3a4.3 4.3 0 0 1-3.25-1.48Z"/></svg>`,
  phone: `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/></svg>`,
  pin: `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg>`,
};
const arr = `<span class="arr" aria-hidden="true">↗</span>`;

// ---------- layout ----------
function layout({ lang, path, alt, title, desc, body, L, nav, image, jsonld = [], bodyClass = "", noindex = false }) {
  const s = t[lang];
  const navItems = ["collection", "story", "sell", "contact"].map((k) =>
    `<li><a href="${L.page(paths[k](lang))}"${nav === k ? ' aria-current="page"' : ""}>${s.nav[k]}</a></li>`).join("");
  const langLinks = LANGS.map((l) => `<a href="${L.page(alt[l])}" hreflang="${l}" lang="${l}"${l === lang ? ' aria-current="true"' : ""} aria-label="${l === "it" ? "Italiano" : "English"}">${l.toUpperCase()}</a>`).join("");
  const langNav = `<nav class="lang" aria-label="${s.langLabel}">${langLinks}</nav>`;
  const brand = `<a class="brand" href="${L.page(paths.home(lang))}"><span class="brand__name">Antiquariato Angelo</span><span class="brand__place">Roma · 1970</span></a>`;
  const store = {
    "@context": "https://schema.org", "@type": "Store", name: shop.name, url: abs(paths.home(lang)), telephone: shop.phone, foundingDate: "1970",
    address: { "@type": "PostalAddress", streetAddress: shop.street, addressLocality: "Roma", postalCode: "00186", addressCountry: "IT" },
    openingHoursSpecification: [{ "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], opens: "11:00", closes: "20:00" }],
    sameAs: [shop.instagram, shop.tiktok],
  };
  return `<!doctype html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
${noindex ? '<meta name="robots" content="noindex">' : `<link rel="canonical" href="${abs(path)}">
${LANGS.map((l) => `<link rel="alternate" hreflang="${l}" href="${abs(alt[l])}">`).join("\n")}
<link rel="alternate" hreflang="x-default" href="${abs(alt.it)}">`}
<meta property="og:type" content="website">
<meta property="og:site_name" content="Antiquariato Angelo">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:locale" content="${s.locale}">
<meta property="og:url" content="${abs(path)}">
${image ? `<meta property="og:image" content="${/^https?:/.test(image) ? image : `${SITE}/photos/${image}.jpg`}">` : ""}
<meta name="theme-color" content="#F3F1EC">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300..600;1,300..600&family=Jost:wght@300..500&display=swap">
<link rel="stylesheet" href="${L.asset("assets/styles.css")}">
<script>(function(){var d=document.documentElement;d.classList.add('js');if(matchMedia('(prefers-reduced-motion: no-preference)').matches){d.classList.add('intro-pending');setTimeout(function(){d.classList.remove('intro-pending')},2500)}})();</script>
${[store, ...jsonld].map((j) => `<script type="application/ld+json">${JSON.stringify(j)}</script>`).join("\n")}
</head>
<body class="${bodyClass}">
<a class="skip-link" href="#main">${s.skip}</a>
<header class="masthead">
  <div class="masthead__inner" data-intro-head>
    ${brand}
    <nav class="main-nav" aria-label="${s.navLabel}"><ul>${navItems}</ul></nav>
    <div class="masthead__actions">
      ${langNav}
      <a class="btn btn--dark btn--small masthead__wa" href="${waLink()}" target="_blank" rel="noopener">WhatsApp ${arr}</a>
      <button class="menu-toggle" type="button" aria-haspopup="dialog" aria-controls="mobile-menu" aria-expanded="false">${s.menu}</button>
    </div>
  </div>
</header>
<dialog class="mobile-menu" id="mobile-menu" aria-label="${s.navLabel}">
  <div class="mobile-menu__inner">
    <div class="mobile-menu__top">${brand}<button class="mobile-menu__close" type="button" autofocus>${s.close}</button></div>
    <nav class="mobile-menu__nav" aria-label="${s.navLabel}"><ul>${navItems}</ul></nav>
    <div class="mobile-menu__lang"><span>${s.langLabel}</span>${langNav}</div>
    <div class="mobile-menu__contact">
      <a class="btn btn--dark" href="${waLink()}" target="_blank" rel="noopener">${ICON.wa}${s.whatsapp}</a>
      <p>${s.call}: <a class="nowrap" href="${shop.phoneHref}">${shop.phone}</a><br>${shop.street} · Roma<br>${s.hoursShort} · ${s.closedShort}</p>
    </div>
  </div>
</dialog>
<main id="main">
${body}
</main>
${footer(lang, L)}
<script src="${GSAP}/gsap.min.js"></script>
<script src="${GSAP}/ScrollTrigger.min.js"></script>
<script src="${L.asset("assets/site.js")}"></script>
<script src="${L.asset("assets/motion.js")}"></script>
</body>
</html>`;
}

function footer(lang, L) {
  const s = t[lang];
  return `<footer class="site-footer">
  <div class="site-footer__inner">
    <div class="site-footer__brand">
      <p class="site-footer__name">Antiquariato Angelo</p>
      <p>${s.footerTag}</p>
      <a class="btn btn--light" href="${waLink()}" target="_blank" rel="noopener">${ICON.wa}${s.whatsapp}</a>
    </div>
    <nav class="site-footer__col" aria-label="${s.footerNav}">
      <p class="site-footer__label">${s.footerNav}</p>
      <ul>${["collection", "story", "sell", "contact"].map((k) => `<li><a href="${L.page(paths[k](lang))}">${s.nav[k]}</a></li>`).join("")}</ul>
    </nav>
    <div class="site-footer__col">
      <p class="site-footer__label">${s.footerVisit}</p>
      <p>${shop.street}<br>${shop.city}</p>
      <p>${s.hoursShort}<br>${s.closedShort}</p>
      <p><a href="${shop.phoneHref}">${shop.phone}</a></p>
      <a class="link-under" href="${shop.maps}" target="_blank" rel="noopener">${s.directions} ${arr}</a>
    </div>
    <div class="site-footer__col">
      <p class="site-footer__label">${s.footerFollow}</p>
      <ul class="site-footer__social">
        <li><a href="${shop.instagram}" target="_blank" rel="noopener">${ICON.ig}Instagram</a></li>
        <li><a href="${shop.tiktok}" target="_blank" rel="noopener">${ICON.tt}TikTok</a></li>
      </ul>
    </div>
  </div>
  <p class="site-footer__legal">© ${new Date().getFullYear()} Antiquariato Angelo · Roma</p>
</footer>`;
}

// ---------- shared pieces ----------
const priceLine = (s, it) => it.status === "sold"
  ? `<span class="badge badge--sold">${s.sold}</span>`
  : `<span class="card__price">${s.price}</span>`;

function card(lang, L, it, extra = "") {
  const s = t[lang];
  return `<a class="card${it.status === "sold" ? " is-sold" : ""}" href="${L.page(paths.item(lang, it.slug))}" data-name="${esc((it.name[lang] + " " + it.ref).toLowerCase())}" data-added="${it.added}-${String(items.indexOf(it)).padStart(4, "0")}" ${extra}>
  <div class="card__media"><img src="${L.photo(it.photos[0])}" alt="${esc(it.alt[lang])}" width="1280" height="1600" loading="lazy" decoding="async"></div>
  <div class="card__body">
    <span class="card__cat">${byId[it.cat][lang]}</span>
    <h3 class="card__title">${esc(it.name[lang])}</h3>
    ${priceLine(s, it)}
  </div>
</a>`;
}

const pageHead = (kicker, h1, intro) => `<header class="page-head">
  ${kicker ? `<p class="eyebrow" data-intro>${kicker}</p>` : ""}
  <h1 class="page-head__title display">${words(h1)}</h1>
  ${intro ? `<p class="page-head__intro" data-intro>${intro}</p>` : ""}
</header>`;

// ---------- pages ----------
export function home(lang, preview) {
  const path = paths.home(lang), L = linker(path, preview), s = t[lang], h = s.home;
  const feat = featured.map((sl) => bySlug[sl]).filter(Boolean);
  const cu = homeFeature;
  const cuLink = abs(paths.home(lang));
  const catRow = (hidden) => `<ul class="marquee__row"${hidden ? ' aria-hidden="true"' : ""}>${categories.map((c) => `<li><a href="${L.page(paths.category(lang, c.id))}"${hidden ? ' tabindex="-1"' : ""}>${c[lang]}</a></li>`).join("")}</ul>`;
  const catTiles = categories.map((c) => {
    const n = countIn(c.id), cover = categoryCover[c.id];
    return `<a class="cat-tile${cover ? "" : " cat-tile--empty"}" href="${L.page(paths.category(lang, c.id))}" data-reveal>
      <span class="cat-tile__media">${cover ? `<img src="${L.photo(cover)}" alt="" width="1280" height="1600" loading="lazy" decoding="async">` : `<span class="cat-tile__mono" aria-hidden="true">${c[lang].charAt(0)}</span>`}</span>
      <span class="cat-tile__label"><span class="cat-tile__name">${c[lang]}</span><span class="cat-tile__count">${n ? h.pieces(n) : h.soon}</span></span>
    </a>`;
  }).join("");

  const body = `
<section class="hero" aria-labelledby="hero-title">
  <div class="hero__grid">
    <div class="hero__text">
      <p class="eyebrow" data-intro>${h.eyebrow}</p>
      <h1 class="hero__title display" id="hero-title">${words(h.h1)}</h1>
      <p class="hero__lead" data-intro>${h.lead}</p>
      <div class="hero__actions" data-intro>
        <a class="btn btn--dark magnetic" href="${L.page(paths.collection(lang))}">${h.cta} ${arr}</a>
        <a class="btn btn--ghost" href="${L.page(paths.contact(lang))}">${h.visit}</a>
      </div>
      <a class="scroll-cue" href="#vetrina" data-intro><span class="scroll-cue__ring" aria-hidden="true">↓</span>${h.scroll}</a>
    </div>
    <aside class="visit-card" data-intro-chip aria-label="${h.visit}"><span class="chip__dot" aria-hidden="true"></span><span>${h.chip[0]}<br><strong>${h.chip[1]}</strong></span></aside>
  </div>
</section>

<section class="statement" id="vetrina" aria-labelledby="stmt-title">
  <p class="statement__kicker">${h.stmtKicker}</p>
  <h2 class="statement__title display" id="stmt-title">${words(h.stmtTitle)}</h2>
  <span class="statement__rule" aria-hidden="true"></span>
  <p class="statement__info">${h.stmtInfo}<br><a class="link-under" href="${shop.phoneHref}">${shop.phone}</a> <span aria-hidden="true">·</span> <a class="link-under" href="${waLink()}" target="_blank" rel="noopener">WhatsApp</a></p>
</section>

<nav class="marquee" aria-label="${h.marquee}"><div class="marquee__track">${catRow(false)}${catRow(true)}</div></nav>

<section class="arrivals" id="arrivals" aria-labelledby="arrivals-title">
  <div class="arrivals__head">
    <h2 class="arrivals__title display" id="arrivals-title">${words(h.arrivals)}</h2>
    <div class="arrivals__aside">
      <p class="arrivals__intro">${h.arrivalsIntro}</p>
      <ul class="arrivals__facts">${h.facts.map((f) => `<li>${f}</li>`).join("")}</ul>
    </div>
  </div>
  <article class="feature" aria-labelledby="feature-title">
    <div class="feature__pin">
      <div class="feature__text">
        <p class="feature__cat">${h.closer} · ${h.featKicker}</p>
        <h3 class="feature__title" id="feature-title">${esc(cu.name[lang])}</h3>
        ${cu.text && cu.text[lang] ? `<p class="feature__lead">${esc(cu.text[lang])}</p>` : ""}
        <ol class="feature__steps">${h.steps.map(([n, d], i) => `<li class="step" data-step="${i}"><span class="step__name">${n}</span><span class="step__desc">${d}</span></li>`).join("")}</ol>
        <div class="feature__progress" aria-hidden="true"><i></i></div>
        <p class="feature__price">${s.price}</p>
        <a class="btn btn--light magnetic" href="${waLink(h.featMsg(cu.name[lang], cuLink))}" target="_blank" rel="noopener">${ICON.wa}${h.featAsk}</a>
        <p class="feature__note">${h.featStaged}</p>
      </div>
      <div class="feature__stage" data-focus="${cu.focus.map((f) => f.join(",")).join(";")}">
        <div class="frame"><img class="feature__img" src="${L.photo(cu.photo)}" alt="${esc(cu.alt[lang])}" width="${cu.w}" height="${cu.h}" loading="lazy" decoding="async"></div>
        <div class="feature__details" role="group" aria-label="${h.closer}">
          <figure class="crop crop--a"><div class="crop__box"><img src="${L.photo(cu.photo)}" alt="" loading="lazy" decoding="async"></div><figcaption>${h.steps[1][0]}</figcaption></figure>
          <figure class="crop crop--b"><div class="crop__box"><img src="${L.photo(cu.photo)}" alt="" loading="lazy" decoding="async"></div><figcaption>${h.steps[2][0]}</figcaption></figure>
        </div>
      </div>
    </div>
  </article>
  <div class="cards">${feat.map((it) => card(lang, L, it)).join("")}</div>
  <p class="arrivals__more"><a class="btn btn--ghost" href="${L.page(paths.collection(lang))}">${h.seeAll} ${arr}</a></p>
</section>

<section class="cats" aria-labelledby="cats-title">
  <div class="section-head">
    <h2 class="section-head__title display" id="cats-title">${words(h.catsTitle)}</h2>
    <p class="section-head__intro">${h.catsIntro}</p>
  </div>
  <div class="cats__grid">${catTiles}</div>
</section>

<section class="trade" aria-labelledby="trade-title">
  <div class="trade__panel">
    <h2 class="trade__title display" id="trade-title">${words(h.tradeTitle)}</h2>
    <div class="trade__grid">
      <div class="trade__item" data-reveal><h3>${h.buyTitle}</h3><p>${h.buyText}</p><a class="btn btn--dark" href="${L.page(paths.sell(lang))}">${h.buyCta} ${arr}</a></div>
      <div class="trade__item" data-reveal><h3>${h.sellTitle}</h3><p>${h.sellText}</p><a class="btn btn--ghost" href="${L.page(paths.collection(lang))}">${h.sellCta} ${arr}</a></div>
      <div class="trade__item trade__item--ship" data-reveal><h3>${h.shipTitle}</h3><p>${h.shipText}</p><a class="btn btn--ghost" href="${waLink()}" target="_blank" rel="noopener">${ICON.wa}WhatsApp</a></div>
    </div>
  </div>
</section>

<section class="story-teaser" aria-labelledby="story-title">
  <figure class="story-teaser__photo" data-reveal><img src="${L.photo("vetrina-insegna")}" alt="${esc(s.story.altWindow)}" width="1740" height="1090" loading="lazy" decoding="async"></figure>
  <div class="story-teaser__text" data-reveal>
    <p class="eyebrow">1970 – ${new Date().getFullYear()}</p>
    <h2 class="story-teaser__title" id="story-title">${h.storyTitle}</h2>
    <p>${h.storyText}</p>
    <a class="btn btn--ghost" href="${L.page(paths.story(lang))}">${h.storyCta} ${arr}</a>
  </div>
</section>

${visitBlock(lang, L, h.visitTitle, h.visitText)}`;

  return layout({ lang, path, alt: { it: paths.home("it"), en: paths.home("en") }, title: h.title, desc: h.desc, body, L, nav: null, image: homeFeature.photo, bodyClass: "page-home" });
}

function visitBlock(lang, L, title, text) {
  const s = t[lang];
  return `<section class="visit" aria-labelledby="visit-title">
  <div class="visit__panel">
    <div class="visit__text">
      <h2 class="visit__title display" id="visit-title">${words(title)}</h2>
      <p>${text}</p>
    </div>
    <dl class="visit__facts">
      <div data-reveal><dt>${ICON.pin}<span>${s.contact.address}</span></dt><dd>${shop.street}<br>${shop.city}</dd></div>
      <div data-reveal><dt>${ICON.phone}<span>${s.contact.hours}</span></dt><dd>${s.hoursShort}<br>${s.closedShort}</dd></div>
    </dl>
    <div class="visit__actions">
      <a class="btn btn--light magnetic" href="${shop.maps}" target="_blank" rel="noopener">${s.directions} ${arr}</a>
      <a class="btn btn--outline-light" href="${waLink()}" target="_blank" rel="noopener">${ICON.wa}WhatsApp</a>
    </div>
  </div>
</section>`;
}

export function collection(lang, preview, catId = null) {
  const path = catId ? paths.category(lang, catId) : paths.collection(lang);
  const L = linker(path, preview), s = t[lang], c = s.collection;
  const list = live.filter((i) => !catId || i.cat === catId).sort(newest);
  const cat = catId ? byId[catId] : null;
  const chips = [`<li><a class="chip" href="${L.page(paths.collection(lang))}"${!catId ? ' aria-current="page"' : ""}>${c.all} <span>${live.length}</span></a></li>`,
    ...categories.map((x) => `<li><a class="chip" href="${L.page(paths.category(lang, x.id))}"${catId === x.id ? ' aria-current="page"' : ""}>${x[lang]} <span>${countIn(x.id)}</span></a></li>`)].join("");
  const body = `
${pageHead(cat ? s.nav.collection : null, cat ? cat[lang] : c.h1, c.intro)}
<section class="catalog" aria-label="${cat ? cat[lang] : s.nav.collection}" data-catalog data-page-size="24">
  <nav class="catalog__chips" aria-label="${s.nav.collection}"><ul>${chips}</ul></nav>
  ${list.length ? `<div class="catalog__tools">
    <label class="search"><span class="visually-hidden">${c.searchLabel}</span>${ICON.search}<input type="search" id="catalog-search" placeholder="${c.search}" autocomplete="off" data-search></label>
    <label class="sort"><span>${c.sort}</span><select id="catalog-sort" data-sort><option value="new">${c.sortNew}</option><option value="name">${c.sortName}</option></select></label>
    <p class="catalog__count" aria-live="polite" data-count data-one="${esc(c.count(1))}" data-many="${esc(c.count(2).replace("2", "{n}"))}">${c.count(list.length)}</p>
  </div>
  <div class="catalog__grid" data-grid>${list.map((it) => card(lang, L, it)).join("")}</div>
  <div class="catalog__empty" data-empty hidden>
    <p class="catalog__empty-title">${c.emptyTitle}</p><p>${c.emptyText}</p>
    <div class="catalog__empty-actions"><button class="btn btn--dark" type="button" data-reset>${c.emptyReset}</button><a class="btn btn--ghost" href="${waLink(c.waAsk)}" target="_blank" rel="noopener">${ICON.wa}WhatsApp</a></div>
  </div>
  <p class="catalog__more"><button class="btn btn--ghost" type="button" data-more hidden>${c.more}</button></p>`
  : `<div class="catalog__empty"><p class="catalog__empty-title">${c.emptyTitle}</p><p>${c.catEmpty}</p>
    <div class="catalog__empty-actions"><a class="btn btn--dark" href="${L.page(paths.collection(lang))}">${c.emptyReset}</a><a class="btn btn--ghost" href="${waLink(c.waAsk)}" target="_blank" rel="noopener">${ICON.wa}WhatsApp</a></div></div>`}
  <p class="catalog__ship">${s.shipping}</p>
</section>`;
  const alt = catId ? { it: paths.category("it", catId), en: paths.category("en", catId) } : { it: paths.collection("it"), en: paths.collection("en") };
  const ld = { "@context": "https://schema.org", "@type": "CollectionPage", name: cat ? cat[lang] : s.nav.collection, url: abs(path),
    hasPart: list.map((it) => ({ "@type": "Product", name: it.name[lang], sku: it.ref, url: abs(paths.item(lang, it.slug)) })) };
  return layout({ lang, path, alt, title: cat ? c.catTitle(cat[lang]) : c.title, desc: cat ? c.catDesc(cat[lang]) : c.desc, body, L, nav: "collection",
    image: cat ? categoryCover[catId] : "lalique-collezione-mat", jsonld: [ld], bodyClass: "page-collection" });
}

export function item(lang, preview, it) {
  const path = paths.item(lang, it.slug), L = linker(path, preview), s = t[lang], x = s.item;
  const cat = byId[it.cat], sold = it.status === "sold";
  const link = abs(path);
  const gallery = it.photos.slice(it.photos.length > 1 ? 1 : 0);   // gallery: real photos; the matted card image only when it is the only one
  const galAlt = (i) => (it.galleryAlt && it.galleryAlt[i + 1] && it.galleryAlt[i + 1][lang]) || it.alt[lang];
  const spec = [
    ["author", it.specs.author], ["dimensions", it.specs.dimensions],
    ["material", it.specs.material && it.specs.material[lang]], ["era", it.specs.era && it.specs.era[lang]],
    ["condition", it.specs.condition && it.specs.condition[lang]],
  ].filter(([, v]) => v);   // unknown details are simply not shown
  const related = live.filter((o) => o.cat === it.cat && o.slug !== it.slug).sort(newest).slice(0, 4);
  const body = `
<article class="item" aria-labelledby="item-title">
  <nav class="crumbs" aria-label="Breadcrumb"><ol>
    <li><a href="${L.page(paths.collection(lang))}">${x.back}</a></li>
    <li><a href="${L.page(paths.category(lang, it.cat))}">${cat[lang]}</a></li>
    <li aria-current="page">${s.ref} ${it.ref}</li>
  </ol></nav>
  <div class="item__grid">
    <div class="gallery" data-gallery>
      <button class="gallery__main" type="button" data-open aria-label="${x.zoom}">
        <img src="${L.photo(gallery[0])}" alt="${esc(galAlt(0))}" data-main decoding="async">
        <span class="gallery__zoom" aria-hidden="true">${ICON.search}</span>
      </button>
      ${gallery.length > 1 ? `<ul class="gallery__thumbs">${gallery.map((p, i) => `<li><button type="button" data-thumb="${i}" data-src="${L.photo(p)}" data-alt="${esc(galAlt(i))}"${i === 0 ? ' aria-current="true"' : ""} aria-label="${x.photo(i + 1, gallery.length)}"><img src="${L.photo(p)}" alt="" loading="lazy" decoding="async"></button></li>`).join("")}</ul>` : ""}
      <p class="gallery__hint">${x.zoomHint}</p>
      <dialog class="lightbox" data-lightbox aria-label="${esc(it.name[lang])}">
        <button class="lightbox__close" type="button" data-close aria-label="${s.close}">${ICON.close}</button>
        ${gallery.length > 1 ? `<button class="lightbox__nav lightbox__nav--prev" type="button" data-prev aria-label="${x.prev}">${ICON.prev}</button><button class="lightbox__nav lightbox__nav--next" type="button" data-next aria-label="${x.next}">${ICON.next}</button>` : ""}
        <div class="lightbox__stage" data-stage><img alt="" data-big></div>
      </dialog>
    </div>
    <div class="item__info">
      <p class="item__cat"><a href="${L.page(paths.category(lang, it.cat))}">${cat[lang]}</a></p>
      <h1 class="item__title" id="item-title" data-intro>${esc(it.name[lang])}</h1>
      <p class="item__meta" data-intro><span class="badge ${sold ? "badge--sold" : "badge--ok"}">${sold ? s.sold : s.available}</span><span class="item__ref">${s.ref} ${it.ref}</span></p>
      <p class="item__desc" data-intro>${esc(it.desc[lang])}</p>
      ${spec.length ? `<dl class="item__specs" data-intro>${spec.map(([k, v]) => `<div><dt>${x[k]}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl>` : ""}
      <div class="item__buy" data-intro>
        ${sold ? `<p class="item__sold">${x.soldNote}</p>
        <a class="btn btn--dark btn--wide magnetic" href="${waLink(x.waSold(it.name[lang], it.ref, link))}" target="_blank" rel="noopener">${ICON.wa}${x.askSimilar}</a>`
        : `<p class="item__price">${s.price}</p>
        <a class="btn btn--dark btn--wide magnetic" href="${waLink(x.waMsg(it.name[lang], it.ref, link))}" target="_blank" rel="noopener">${ICON.wa}${x.ask}</a>`}
        <p class="item__note">${x.visit}</p>
        <p class="item__note">${s.shipping}</p>
      </div>
    </div>
  </div>
</article>
${related.length ? `<section class="related" aria-labelledby="related-title">
  <h2 class="related__title" id="related-title">${x.related}</h2>
  <div class="catalog__grid">${related.map((o) => card(lang, L, o)).join("")}</div>
</section>` : ""}`;
  const ld = { "@context": "https://schema.org", "@type": "Product", name: it.name[lang], sku: it.ref, description: it.desc[lang], category: cat[lang],
    image: it.photos.map((p) => (/^https?:/.test(p) ? p : `${SITE}/photos/${p}.jpg`)), url: link, brand: it.cat === "lalique" ? { "@type": "Brand", name: "Lalique" } : undefined };
  const crumbs = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
    { "@type": "ListItem", position: 1, name: x.back, item: abs(paths.collection(lang)) },
    { "@type": "ListItem", position: 2, name: cat[lang], item: abs(paths.category(lang, it.cat)) },
    { "@type": "ListItem", position: 3, name: it.name[lang], item: link }] };
  return layout({ lang, path, alt: { it: paths.item("it", it.slug), en: paths.item("en", it.slug) },
    title: `${it.name[lang]} · ${s.ref} ${it.ref} · Antiquariato Angelo`, desc: `${it.desc[lang]} ${s.price}.`.slice(0, 300),
    body, L, nav: "collection", image: it.photos[0], jsonld: [ld, crumbs], bodyClass: "page-item" });
}

export function story(lang, preview) {
  const path = paths.story(lang), L = linker(path, preview), s = t[lang], x = s.story;
  const years = new Date().getFullYear() - 1970;
  const body = `
${pageHead(x.kicker, x.h1, null)}
<section class="story">
  <div class="story__lead" data-reveal>
    <p class="story__years"><span class="story__num">${years}</span><span>${x.years}</span></p>
    ${x.p.map((p, i) => `<p${i === 0 ? ' class="story__first"' : ""}>${p}</p>`).join("")}
  </div>
  <figure class="story__photo story__photo--tall" data-reveal><div class="story__clip"><img src="${L.photo("negozio-interno-arco")}" alt="${esc(s.home.signCaption)}" width="1200" height="1600" loading="lazy" decoding="async" data-parallax></div><figcaption>${x.caps[0]}</figcaption></figure>
  <figure class="story__photo story__photo--sign" data-reveal><div class="story__clip story__clip--dark"><img src="${L.photo("insegna-oro", "webp")}" alt="${esc(s.home.signAlt)}" width="1800" height="914" loading="lazy" decoding="async"></div><figcaption>${x.caps[2]}</figcaption></figure>
  <figure class="story__photo story__photo--window" data-reveal><div class="story__clip"><img src="${L.photo("vetrina-insegna")}" alt="${esc(x.altWindow)}" width="1740" height="1090" loading="lazy" decoding="async"></div></figure>
</section>
${visitBlock(lang, L, s.home.visitTitle, s.home.visitText)}`;
  return layout({ lang, path, alt: { it: paths.story("it"), en: paths.story("en") }, title: x.title, desc: x.desc, body, L, nav: "story", image: "negozio-interno-arco", bodyClass: "page-story" });
}

export function sell(lang, preview) {
  const path = paths.sell(lang), L = linker(path, preview), s = t[lang], x = s.sell;
  const body = `
${pageHead(x.kicker, x.h1, x.intro)}
<section class="sell">
  <ol class="sell__steps">${x.steps.map(([h, p], i) => `<li class="sell__step" data-reveal><span class="sell__num" aria-hidden="true">${i + 1}</span><h2>${h}</h2><p>${p}</p></li>`).join("")}</ol>
  <div class="sell__panel" data-reveal>
    <div>
      <p class="sell__panel-title">${x.tipsTitle}</p>
      <ul class="sell__tips">${x.tips.map((tp) => `<li>${tp}</li>`).join("")}</ul>
    </div>
    <div class="sell__cta">
      <a class="btn btn--light btn--wide magnetic" href="${waLink(x.waMsg)}" target="_blank" rel="noopener">${ICON.wa}${x.cta}</a>
      <p>${s.call}: <a href="${shop.phoneHref}">${shop.phone}</a></p>
    </div>
  </div>
  <p class="sell__note">${x.note}</p>
</section>`;
  return layout({ lang, path, alt: { it: paths.sell("it"), en: paths.sell("en") }, title: x.title, desc: x.desc, body, L, nav: "sell", image: "negozio-interno-arco", bodyClass: "page-sell" });
}

export function contact(lang, preview) {
  const path = paths.contact(lang), L = linker(path, preview), s = t[lang], x = s.contact;
  const body = `
${pageHead(x.kicker, x.h1, x.intro)}
<section class="contact">
  <div class="contact__cards">
    <div class="contact__card" data-reveal>
      <p class="contact__label">${ICON.pin}${x.address}</p>
      <p class="contact__big">${shop.street}<br>${shop.city}</p>
      <a class="btn btn--dark magnetic" href="${shop.maps}" target="_blank" rel="noopener">${s.directions} ${arr}</a>
    </div>
    <div class="contact__card" data-reveal>
      <p class="contact__label">${x.hours}</p>
      <table class="hours"><tbody>${s.hoursRows.map(([d, h]) => `<tr><th scope="row">${d}</th><td>${h}</td></tr>`).join("")}</tbody></table>
    </div>
    <div class="contact__card" data-reveal>
      <p class="contact__label">${ICON.phone}${x.phone}</p>
      <p class="contact__big"><a href="${shop.phoneHref}">${shop.phone}</a></p>
      <a class="btn btn--ghost" href="${waLink()}" target="_blank" rel="noopener">${ICON.wa}WhatsApp</a>
    </div>
    <div class="contact__card" data-reveal>
      <p class="contact__label">${x.social}</p>
      <ul class="contact__social">
        <li><a href="${shop.instagram}" target="_blank" rel="noopener">${ICON.ig}<span>Instagram<small>@antiquariato_astrologo</small></span></a></li>
        <li><a href="${shop.tiktok}" target="_blank" rel="noopener">${ICON.tt}<span>TikTok<small>@antiquariato_astr</small></span></a></li>
      </ul>
    </div>
  </div>
  <figure class="contact__photo" data-reveal><img src="${L.photo("vetrina-insegna")}" alt="${esc(s.story.altWindow)}" width="1740" height="1090" loading="lazy" decoding="async"></figure>
  <p class="catalog__ship">${s.shipping}</p>
</section>`;
  const ld = { "@context": "https://schema.org", "@type": "ContactPage", name: x.title, url: abs(path) };
  return layout({ lang, path, alt: { it: paths.contact("it"), en: paths.contact("en") }, title: x.title, desc: x.desc, body, L, nav: "contact", image: "vetrina-insegna", jsonld: [ld], bodyClass: "page-contact" });
}

// language choice at the site root ("/")
export function welcome(preview) {
  const L = linker("", preview);
  const card = (l, name, sub, go) => `<a class="lang-card lang-card--${l}" href="${L.page(paths.home(l))}" hreflang="${l}" lang="${l}">
      <span class="lang-card__code">${l.toUpperCase()}</span>
      <span class="lang-card__name">${name}</span>
      <span class="lang-card__sub">${sub}</span>
      <span class="lang-card__go">${go} <span class="arr" aria-hidden="true">→</span></span>
    </a>`;
  return `<!doctype html>
<html lang="it">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Antiquariato Angelo · Roma dal 1970</title>
<meta name="description" content="Antiquariato Angelo, Roma dal 1970. Scegli la lingua · Choose your language.">
<link rel="canonical" href="${SITE}/">
<link rel="alternate" hreflang="it" href="${abs(paths.home("it"))}">
<link rel="alternate" hreflang="en" href="${abs(paths.home("en"))}">
<link rel="alternate" hreflang="x-default" href="${SITE}/">
<meta name="theme-color" content="#F3F1EC">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300..600;1,300..600&family=Jost:wght@300..500&display=swap">
<link rel="stylesheet" href="${L.asset("assets/styles.css")}">
</head>
<body class="page-welcome">
<main class="welcome">
  <p class="welcome__kicker">Roma · dal 1970</p>
  <h1 class="welcome__title">Antiquariato <em>Angelo</em></h1>
  <p class="welcome__ask"><span lang="it">Scegli la lingua</span> · <span lang="en">Choose your language</span></p>
  <nav class="welcome__langs" aria-label="Lingua · Language">
    ${card("it", "Italiano", "Versione principale", "Entra")}
    ${card("en", "English", "English version", "Enter")}
  </nav>
  <p class="welcome__foot">Via dei Banchi Nuovi, 29 · Roma</p>
</main>
</body>
</html>`;
}

// one bilingual 404 at the site root
export function notFound(preview) {
  const L = linker("", preview);
  const it = t.it.notFound, en = t.en.notFound;
  const body = `<section class="nf">
  <p class="nf__code display" aria-hidden="true">404</p>
  <h1 class="nf__title">${it.title} <span lang="en">/ ${en.title}</span></h1>
  <p>${it.text}<br><span lang="en">${en.text}</span></p>
  <div class="nf__actions">
    <a class="btn btn--dark" href="${L.page(paths.home("it"))}">${it.home}</a>
    <a class="btn btn--ghost" href="${L.page(paths.collection("it"))}">${it.coll}</a>
    <a class="btn btn--ghost" href="${L.page(paths.home("en"))}" lang="en">${en.home}</a>
  </div>
</section>`;
  return layout({ lang: "it", path: "404.html", alt: { it: paths.home("it"), en: paths.home("en") }, title: `${it.title} · Antiquariato Angelo`, desc: it.text, body, L, nav: null, noindex: true, bodyClass: "page-404" });
}

export function sitemap() {
  const urls = [];
  const pair = (fn) => urls.push(LANGS.map((l) => fn(l)));
  pair(paths.home); pair(paths.collection); categories.forEach((c) => pair((l) => paths.category(l, c.id)));
  live.forEach((it) => pair((l) => paths.item(l, it.slug))); pair(paths.story); pair(paths.sell); pair(paths.contact);
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.flatMap((p) => p.map((u) => `  <url><loc>${abs(u)}</loc>${p.map((v, i) => `<xhtml:link rel="alternate" hreflang="${LANGS[i]}" href="${abs(v)}"/>`).join("")}<xhtml:link rel="alternate" hreflang="x-default" href="${abs(p[0])}"/></url>`)).join("\n")}
</urlset>`;
}
