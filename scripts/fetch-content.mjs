// Before every build: read the published catalogue from Sanity into content/live.json.
// If Sanity is empty and SANITY_WRITE_TOKEN is set, import the existing catalogue first.
// If Sanity cannot be reached, the build keeps the built-in catalogue, so the site never breaks.
import { writeFileSync, mkdirSync, rmSync } from "node:fs";
import { query } from "./sanity.mjs";
import { seed } from "./seed.mjs";

const GROQ = `{
  "items": *[_type == "item" && status in ["available","sold"] && defined(slug.current) && defined(mainPhoto.asset)] | order(added desc, _createdAt desc) {
    ref, status, newArrival, category, name, desc, alt, "slug": slug.current, added,
    author, dimensions, material, era, condition,
    "main": mainPhoto.asset->url, "gallery": gallery[].asset->url, _createdAt
  },
  "settings": *[_id == "settings"][0]
}`;

mkdirSync("content", { recursive: true });
try {
  let data = await query(GROQ);
  const token = process.env.SANITY_WRITE_TOKEN;
  if (!data.items.length && token) {
    console.log("Sanity is empty: importing the existing catalogue…");
    await seed(token);
    data = await query(GROQ, {}, token);
  }
  if (!data.items.length) {
    console.log("No published items in Sanity yet: using the built-in catalogue.");
    rmSync("content/live.json", { force: true });
  } else {
    writeFileSync("content/live.json", JSON.stringify(data, null, 2));
    console.log(`Loaded ${data.items.length} items from Sanity.`);
  }
} catch (e) {
  console.warn("Could not read Sanity, using the built-in catalogue:", e.message);
  rmSync("content/live.json", { force: true });
}
