import { existsSync, readFileSync } from "node:fs";
import { shop, t } from "./i18n.mjs";
// Catalogue data. In the next stage this moves into the CMS (Sanity) and the
// admin edits it there; the site build reads the same fields.
// Only facts that are visible in the photos or given by the shop are stated.
// `priceInternal` is NEVER rendered: the site shows "Prezzo su richiesta".

export const categories = [
  { id: "dipinti",       it: "Dipinti",        en: "Paintings",     slug: { it: "dipinti",       en: "paintings" } },
  { id: "lalique",       it: "Lalique",        en: "Lalique",       slug: { it: "lalique",       en: "lalique" } },
  { id: "argenti",       it: "Argenti",        en: "Silver",        slug: { it: "argenti",       en: "silver" } },
  { id: "mobili",        it: "Mobili",         en: "Furniture",     slug: { it: "mobili",        en: "furniture" } },
  { id: "specchi",       it: "Specchi",        en: "Mirrors",       slug: { it: "specchi",       en: "mirrors" } },
  { id: "sculture",      it: "Sculture",       en: "Sculptures",    slug: { it: "sculture",      en: "sculptures" } },
  { id: "borse-vintage", it: "Borse vintage",  en: "Vintage bags",  slug: { it: "borse-vintage", en: "vintage-bags" } },
  { id: "altri-oggetti", it: "Altri oggetti",  en: "Other objects", slug: { it: "altri-oggetti", en: "other-objects" } },
];

// status: "draft" (not published) | "available" | "sold"
// added: used for "newest first"; later items in this list were added later
const localItems = [
  {
    ref: "AA-0001", slug: "ritratto-donna-con-rosa", cat: "dipinti", status: "available", added: "2026-10-09",
    photos: ["ritratto-donna-rosa-mat", "dipinto-ritratto-con-rosa-hq"],
    name: { it: "Ritratto di donna con rosa", en: "Portrait of a woman with a rose" },
    desc: { it: "Ritratto di donna con velo scuro e una rosa rossa sul petto, in cornice dorata.",
            en: "Portrait of a woman with a dark veil and a red rose at her breast, in a gilded frame." },
    alt: { it: "Dipinto: ritratto di donna con velo scuro e una rosa rossa, in cornice dorata",
           en: "Painting: portrait of a woman with a dark veil and a red rose, in a gilded frame" },
    specs: {},
  },
  {
    ref: "AA-0002", slug: "musicista-con-turbante", cat: "dipinti", status: "available", added: "2026-10-09",
    photos: ["dipinto-musicista-turbante-mat", "dipinto-musicista-turbante-mat", "dipinto-musicista-turbante-solo"],
    name: { it: "Musicista con turbante", en: "Musician in a turban" },
    desc: { it: "Musicista con turbante giallo e veste bianca che suona uno strumento a corde, in cornice dorata decorata.",
            en: "A musician in a yellow turban and white robe playing a string instrument, in an ornate gilded frame." },
    alt: { it: "Dipinto: musicista con turbante giallo che suona uno strumento a corde, in cornice dorata decorata",
           en: "Painting: musician in a yellow turban playing a string instrument, in an ornate gilded frame" },
    specs: {},
  },
  {
    ref: "AA-0003", slug: "borsa-da-viaggio-louis-vuitton", cat: "borse-vintage", status: "available", added: "2026-10-09",
    photos: ["borsa-da-viaggio-monogram-mat"],
    name: { it: "Borsa da viaggio Louis Vuitton", en: "Louis Vuitton travel bag" },
    desc: { it: "Borsa da viaggio in tela Monogram con manici, cinghie e finiture in cuoio chiaro.",
            en: "Monogram canvas travel bag with light leather handles, straps and trim." },
    alt: { it: "Borsa da viaggio in tela Monogram con manici e cinghie in cuoio chiaro",
           en: "Monogram canvas travel bag with light leather handles and straps" },
    specs: {},
  },
  {
    ref: "AA-0004", slug: "miniatura-ritratto-di-donna", cat: "dipinti", status: "available", added: "2026-10-09",
    photos: ["miniatura-dama-1790-1820-mat", "miniatura-dama-1790-1820-mat", "miniatura-dama-1790-1820-solo"],
    name: { it: "Miniatura ovale, ritratto di donna", en: "Oval miniature, portrait of a woman" },
    desc: { it: "Ritratto ovale di donna su fondo di tessuto rosso, in cornice dorata. Il cartellino del negozio indica il periodo 1790–1820.",
            en: "Oval portrait of a woman on a red fabric mount, in a gilded frame. The shop's label gives the period as 1790–1820." },
    alt: { it: "Miniatura ovale: ritratto di donna su fondo di tessuto rosso, in cornice dorata",
           en: "Oval miniature: portrait of a woman on a red fabric mount, in a gilded frame" },
    specs: { era: { it: "1790–1820 (dal cartellino)", en: "1790–1820 (per the label)" } },
  },
  {
    ref: "AA-0005", slug: "miniatura-ritratto-di-uomo", cat: "dipinti", status: "available", added: "2026-10-09",
    photos: ["miniatura-gentiluomo-mat", "miniatura-gentiluomo-mat", "miniatura-gentiluomo-solo"],
    name: { it: "Miniatura ovale, ritratto di uomo", en: "Oval miniature, portrait of a man" },
    desc: { it: "Ritratto ovale di uomo con capelli bianchi e giacca scura, in cornice dorata decorata a foglie.",
            en: "Oval portrait of a white-haired man in a dark coat, in a gilded leaf-pattern frame." },
    alt: { it: "Miniatura ovale: ritratto di uomo con capelli bianchi e giacca scura, in cornice dorata",
           en: "Oval miniature: portrait of a white-haired man in a dark coat, in a gilded frame" },
    specs: {},
  },
  {
    ref: "AA-0006", slug: "set-da-portata-in-astuccio", cat: "argenti", status: "available", added: "2026-10-10",
    photos: ["set-portata-astuccio-cut", "set-portata-astuccio-cut", "set-portata-astuccio-1"],
    name: { it: "Set da portata in astuccio", en: "Serving set in a case" },
    desc: { it: "Forchetta, coltello e paletta da portata con manici decorati a volute, nel loro astuccio foderato.",
            en: "Serving fork, knife and server with scroll-decorated handles, in their lined case." },
    alt: { it: "Forchetta, coltello e paletta da portata con manici a volute in un astuccio arancione foderato di giallo",
           en: "Serving fork, knife and server with scrolled handles in an orange case lined in yellow" },
    specs: {},
  },
  {
    ref: "AA-0007", slug: "set-bicchiere-e-posate-in-astuccio", cat: "argenti", status: "available", added: "2026-10-10",
    photos: ["set-bambino-astuccio-blu-cut", "set-bambino-astuccio-blu-cut", "set-bambino-astuccio-blu-1"],
    name: { it: "Set con bicchiere, portatovagliolo e posate", en: "Cup, napkin ring and cutlery set" },
    desc: { it: "Bicchiere, portatovagliolo, forchetta, cucchiaio e coltello in astuccio blu. Sul coperchio interno la dicitura «Argento 800/1000».",
            en: "Cup, napkin ring, fork, spoon and knife in a blue case. The inside of the lid reads «Argento 800/1000»." },
    alt: { it: "Bicchiere, portatovagliolo e posate in un astuccio blu foderato di raso bianco",
           en: "Cup, napkin ring and cutlery in a blue case lined with white satin" },
    specs: { material: { it: "Argento 800/1000 (dicitura sull'astuccio)", en: "800/1000 silver (as marked on the case)" } },
  },
  {
    ref: "AA-0008", slug: "set-di-posate-in-astuccio", cat: "argenti", status: "available", added: "2026-10-10",
    photos: ["set-posate-astuccio-rosso-cut", "set-posate-astuccio-rosso-cut", "set-posate-astuccio-rosso-1"],
    name: { it: "Set di posate in astuccio", en: "Cutlery set in a case" },
    desc: { it: "Forchetta, cucchiaio e coltello con manici decorati, in astuccio rosso foderato color pesca.",
            en: "Fork, spoon and knife with decorated handles, in a red case lined in peach." },
    alt: { it: "Forchetta, cucchiaio e coltello in un astuccio rosso foderato color pesca",
           en: "Fork, spoon and knife in a red case lined in peach" },
    specs: {},
  },
  {
    ref: "AA-0009", slug: "ritratto-di-giovane-con-penna", cat: "dipinti", status: "available", added: "2026-10-10",
    photos: ["ritratto-giovane-penna-mat", "ritratto-giovane-penna-mat", "ritratto-giovane-penna-1"],
    name: { it: "Ritratto di giovane con penna", en: "Portrait of a young man with a quill" },
    desc: { it: "Dipinto su tela, senza cornice: un giovane con colletto bianco e abito rosso, con una penna d'oca in mano.",
            en: "Painting on canvas, unframed: a young man with a white collar and red coat, holding a quill." },
    alt: { it: "Dipinto su tela: giovane con colletto bianco e abito rosso che tiene una penna d'oca",
           en: "Painting on canvas: young man with a white collar and red coat holding a quill" },
    specs: {},
  },
  {
    ref: "AA-0010", slug: "lalique-flacone-da-profumo", cat: "lalique", status: "available", added: "2026-10-10",
    photos: ["lalique-flacone-cut", "lalique-flacone-cut", "lalique-flacone-cut2", "lalique-flacone-1"], priceInternal: "200 € (da confermare)",
    name: { it: "Flacone da profumo Lalique", en: "Lalique perfume bottle" },
    desc: { it: "Flacone con decoro a raggi avvolti a spirale, con parti satinate e parti trasparenti.",
            en: "Bottle with a spiralling ray pattern, part frosted and part clear." },
    alt: { it: "Flacone da profumo Lalique con decoro a raggi a spirale", en: "Lalique perfume bottle with a spiralling ray pattern" },
    specs: {},
  },
  {
    ref: "AA-0011", slug: "lalique-gallo", cat: "lalique", status: "available", added: "2026-10-10",
    photos: ["lalique-gallo-cut", "lalique-gallo-cut", "lalique-gallo-1"],
    name: { it: "Gallo Lalique", en: "Lalique rooster" },
    desc: { it: "Gallo con alta coda a ventaglio, satinato e trasparente, su base rotonda.",
            en: "A rooster with a tall fanned tail, frosted and clear, on a round base." },
    alt: { it: "Scultura Lalique a forma di gallo con alta coda a ventaglio", en: "Lalique rooster figure with a tall fanned tail" },
    specs: {},
  },
  {
    ref: "AA-0012", slug: "lalique-coppetta-con-delfino", cat: "lalique", status: "available", added: "2026-10-10",
    photos: ["lalique-delfino-cut", "lalique-delfino-cut", "lalique-delfino-1"],
    name: { it: "Coppetta con delfino Lalique", en: "Lalique dish with dolphin" },
    desc: { it: "Piccola coppa rotonda trasparente con al centro un delfino satinato.",
            en: "Small round clear dish with a frosted dolphin at its centre." },
    alt: { it: "Coppetta Lalique trasparente con un delfino satinato al centro", en: "Clear Lalique dish with a frosted dolphin at the centre" },
    specs: {},
  },
  {
    ref: "AA-0013", slug: "lalique-coppetta-con-veliero", cat: "lalique", status: "available", added: "2026-10-10",
    photos: ["lalique-veliero-cut", "lalique-veliero-cut", "lalique-veliero-1"],
    name: { it: "Coppetta con veliero Lalique", en: "Lalique dish with sailing ship" },
    desc: { it: "Coppa rotonda trasparente con al centro un veliero in rilievo.",
            en: "Round clear dish with a sailing ship in relief at its centre." },
    alt: { it: "Coppetta Lalique trasparente con un veliero in rilievo", en: "Clear Lalique dish with a sailing ship in relief" },
    specs: {},
  },
  {
    ref: "AA-0014", slug: "lalique-vaso-con-uccellini", cat: "lalique", status: "available", added: "2026-10-10",
    photos: ["lalique-vaso-cut", "lalique-vaso-cut", "lalique-vaso-1", "lalique-vaso-2"],
    name: { it: "Vaso Lalique con uccellini", en: "Lalique vase with birds" },
    desc: { it: "Vaso svasato trasparente decorato in rilievo con uccellini satinati tra le foglie.",
            en: "Flared clear vase decorated in relief with frosted birds among leaves." },
    alt: { it: "Vaso Lalique trasparente con uccellini satinati in rilievo", en: "Clear Lalique vase with frosted birds in relief" },
    specs: {},
  },
  {
    ref: "AA-0015", slug: "lalique-accendino-da-tavolo", cat: "lalique", status: "available", added: "2026-10-10",
    photos: ["lalique-accendino-cut", "lalique-accendino-cut", "lalique-accendino-1"],
    name: { it: "Accendino da tavolo Lalique", en: "Lalique table lighter" },
    desc: { it: "Base a calice satinata con decoro in rilievo e meccanismo in metallo sulla sommità.",
            en: "Frosted goblet-shaped base with relief decoration and a metal mechanism on top." },
    alt: { it: "Accendino da tavolo Lalique con base a calice satinata", en: "Lalique table lighter with a frosted goblet base" },
    specs: {},
  },
  {
    ref: "AA-0016", slug: "lente-argento-e-corniola-enea-stefani", cat: "argenti", status: "available", added: "2026-10-10",
    photos: ["lente-argento-corniola-cut", "lente-argento-corniola-cut", "lente-argento-corniola-1"], priceInternal: "2000 € (da confermare)",
    name: { it: "Lente d'ingrandimento in argento e corniola, Enea Stefani", en: "Silver and carnelian magnifying glass, Enea Stefani" },
    desc: { it: "Cornice traforata a volute con mascheroni e sfere di corniola; manico decorato su fondo rosso.",
            en: "Pierced scrolling frame with grotesque masks and carnelian spheres; decorated handle on a red ground." },
    alt: { it: "Lente d'ingrandimento con cornice in argento a volute, mascheroni e sfere di corniola",
           en: "Magnifying glass with a scrolling silver frame, masks and carnelian spheres" },
    specs: {
      author: "Enea Stefani",
      dimensions: "28 × 18 cm",
      material: { it: "Argento e corniola", en: "Silver and carnelian" },
      era: { it: "XX secolo", en: "20th century" },
    },
  },
  {
    ref: "AA-0017", slug: "orologio-da-tavolo-meuzon", cat: "altri-oggetti", status: "available", added: "2026-10-10",
    photos: ["orologio-meuzon-cut", "orologio-meuzon-cut", "orologio-meuzon-1"],
    name: { it: "Orologio da tavolo «Meuzon & Comp.»", en: "Table clock, «Meuzon & Comp.» dial" },
    desc: { it: "Cassa dorata decorata a rilievo, con frontone, maniglia e piedini a zampa. Quadrante bianco con numeri arabi e la scritta «Meuzon & Comp.».",
            en: "Gilt case decorated in relief, with a pediment, carrying handle and paw feet. White dial with Arabic numerals inscribed «Meuzon & Comp.»." },
    alt: { it: "Orologio da tavolo con cassa dorata decorata e quadrante bianco firmato Meuzon & Comp.",
           en: "Table clock with a decorated gilt case and white dial inscribed Meuzon & Comp." },
    specs: {},
  },
  {
    ref: "AA-0018", slug: "vaso-a-cratere-con-paesaggio", cat: "altri-oggetti", status: "available", added: "2026-10-10",
    photos: ["vaso-cratere-paesaggio-cut", "vaso-cratere-paesaggio-cut", "vaso-cratere-paesaggio-1"],
    name: { it: "Vaso a cratere dipinto con paesaggio", en: "Crater vase painted with a landscape" },
    desc: { it: "Vaso a cratere con due anse e ampie dorature, dipinto con un paesaggio con alberi, una torre e due figure; base quadrata.",
            en: "Two-handled crater vase with broad gilding, painted with a landscape of trees, a tower and two figures; square base." },
    alt: { it: "Vaso a cratere dorato dipinto con un paesaggio con alberi e una torre",
           en: "Gilded crater vase painted with a landscape of trees and a tower" },
    specs: {},
  },
  {
    ref: "AA-0019", slug: "pecore-john-w-morris", cat: "dipinti", status: "available", added: "2026-10-10",
    photos: ["morris-pecore-mat", "morris-pecore-mat", "morris-pecore-2", "morris-pecore-3"], priceInternal: "1500 €",
    name: { it: "Pecore sotto un cielo tempestoso, John W. Morris", en: "Sheep under a stormy sky, John W. Morris" },
    desc: { it: "Tre pecore tra l'erba sotto un cielo tempestoso, con un campanile all'orizzonte. Firmato in basso a destra; sul retro un'etichetta riporta «John W. Morris». Cornice dorata decorata a foglie.",
            en: "Three sheep in rough grass under a stormy sky, with a church tower on the horizon. Signed lower right; a label on the back reads «John W. Morris». Gilded leaf-carved frame." },
    alt: { it: "Dipinto di tre pecore sotto un cielo tempestoso, in cornice dorata decorata",
           en: "Painting of three sheep under a stormy sky, in an ornate gilded frame" },
    galleryAlt: {
      2: { it: "Dettaglio della firma in basso a destra", en: "Detail of the signature, lower right" },
      3: { it: "Retro del dipinto con l'etichetta «John W. Morris»", en: "Back of the painting with the «John W. Morris» label" },
    },
    specs: { author: "John W. Morris (c. 1865–1924)" },
  },
];

const localFeatured = ["pecore-john-w-morris", "lente-argento-e-corniola-enea-stefani", "lalique-gallo", "orologio-da-tavolo-meuzon"];
const closeUpSlug = "ritratto-donna-con-rosa";

const localCover = {
  dipinti: "morris-pecore-mat", lalique: "lalique-gallo-cut", argenti: "lente-argento-corniola-cut",
  "borse-vintage": "borsa-da-viaggio-monogram-mat", "altri-oggetti": "orologio-meuzon-cut",
};


// ---------------------------------------------------------------------------
// Live catalogue from the admin panel (written by scripts/fetch-content.mjs).
// Without it, the built-in catalogue above is used.
const LIVE = new URL("../content/live.json", import.meta.url);
const live = existsSync(LIVE) ? JSON.parse(readFileSync(LIVE, "utf8")) : null;

const cdn = (url, q) => url + (url.includes("?") ? "&" : "?") + q;
const card = (url) => cdn(url, "w=1280&h=1600&fit=fill&bg=EFEBE4&auto=format&q=80");   // whole piece on the beige mat
const big = (url) => cdn(url, "w=1600&auto=format&q=82");
const both = (o) => (o && (o.it || o.en) ? { it: o.it || o.en, en: o.en || o.it } : undefined);

function fromLive(d) {
  return {
    ref: d.ref, slug: d.slug, cat: d.category, status: d.status === "sold" ? "sold" : "available",
    added: (d.added || (d._createdAt || "").slice(0, 10) || "2026-01-01"),
    newArrival: !!d.newArrival,
    photos: [card(d.main), big(d.main), ...(d.gallery || []).filter(Boolean).map(big)],
    name: both(d.name), desc: both(d.desc) || { it: "", en: "" },
    alt: both(d.alt) || both(d.name),
    specs: { author: d.author, dimensions: d.dimensions, material: both(d.material), era: both(d.era), condition: both(d.condition) },
  };
}

export const items = live ? live.items.filter((d) => d.name && d.name.it).map(fromLive) : localItems;
export const featured = live
  ? (() => { const f = items.filter((i) => i.newArrival).map((i) => i.slug); return (f.length ? f : items.map((i) => i.slug)).slice(0, 4); })()
  : localFeatured;
export const categoryCover = live
  ? Object.fromEntries(categories.map((c) => [c.id, (items.find((i) => i.cat === c.id && i.status !== "sold") || items.find((i) => i.cat === c.id) || {}).photos?.[0]]).filter(([, v]) => v))
  : localCover;

// contacts and opening hours from the panel
if (live && live.settings) {
  const st = live.settings;
  if (st.phone) { shop.phone = st.phone; shop.phoneHref = "tel:+" + st.phone.replace(/\D/g, ""); }
  if (st.whatsapp) shop.wa = st.whatsapp;
  if (st.instagram) shop.instagram = st.instagram;
  if (st.tiktok) shop.tiktok = st.tiktok;
  if (st.street) shop.street = st.street;
  if (st.city) shop.city = st.city;
  if (st.street || st.city) shop.maps = "https://www.google.com/maps/dir/?api=1&destination=" + encodeURIComponent(`${shop.street}, ${shop.city}`);
  const row = (h) => { const m = /^(.*?)\s+(\d.*)$/.exec(h || ""); return m ? [m[1], m[2]] : [h, ""]; };
  const rowC = (h) => { const m = /^(.*)\s+(\S+)$/.exec(h || ""); return m ? [m[1], m[2]] : [h, ""]; };
  for (const [l, H, C] of [["it", st.hoursIt, st.closedIt], ["en", st.hoursEn, st.closedEn]]) {
    if (H) t[l].hoursShort = H;
    if (C) t[l].closedShort = C;
    if (H || C) t[l].hoursRows = [row(t[l].hoursShort), rowC(t[l].closedShort)];
  }
}

export { localItems };
// the painting used in the "up close" scene on the home page (its detail crops are fixed)
export const closeUpItem = items.find((i) => i.slug === closeUpSlug) || localItems.find((i) => i.slug === closeUpSlug);
