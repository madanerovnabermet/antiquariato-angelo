// Builds the whole site into ./site (production: clean URLs) or ./preview
// (PREVIEW=1: relative links to index.html files, for the private preview).
// Run: node build.mjs        or        PREVIEW=1 node build.mjs
import { writeFileSync, mkdirSync, cpSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { welcome, home, collection, item, story, sell, contact, notFound, sitemap, live, paths, SITE } from "./src/render.mjs";
import { categories } from "./src/data.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const preview = process.env.PREVIEW === "embed" ? "embed" : !!process.env.PREVIEW;
const out = join(here, preview === "embed" ? "preview-embed" : preview ? "preview" : "site");
rmSync(out, { recursive: true, force: true });
const write = (p, html) => { const f = join(out, p.endsWith(".html") || p.endsWith(".xml") || p.endsWith(".txt") ? p : p + "index.html"); mkdirSync(dirname(f), { recursive: true }); writeFileSync(f, html); };

let n = 0;
for (const l of ["it", "en"]) {
  write(paths.home(l), home(l, preview)); n++;
  write(paths.collection(l), collection(l, preview)); n++;
  for (const c of categories) { write(paths.category(l, c.id), collection(l, preview, c.id)); n++; }
  for (const it of live) { write(paths.item(l, it.slug), item(l, preview, it)); n++; }
  write(paths.story(l), story(l, preview)); n++;
  write(paths.sell(l), sell(l, preview)); n++;
  write(paths.contact(l), contact(l, preview)); n++;
}
write("404.html", notFound(preview)); n++;
write("index.html", welcome(preview)); n++;
write("sitemap.xml", sitemap());
write("robots.txt", `User-agent: *\nAllow: /\nSitemap: ${SITE}/sitemap.xml\n`);
cpSync(join(here, "assets"), join(out, "assets"), { recursive: true });
cpSync(join(here, "photos"), join(out, "photos"), { recursive: true });
// catalogue export, ready to import into the CMS at the next stage

console.log(`${preview ? "preview" : "site"}: ${n} pages, ${live.length} pieces`);
