// One-time import of the existing catalogue into Sanity.
// Runs only when SANITY_WRITE_TOKEN is set (a secret in Netlify, never in the code).
// Safe to run again: documents use fixed ids and createIfNotExists.
import { readFileSync, existsSync } from "node:fs";
import { mutate, uploadImage } from "./sanity.mjs";
import { localItems } from "../src/data.mjs";
import { shop, t } from "../src/i18n.mjs";

export async function seed(token) {
  const assetCache = {};
  const asset = async (name) => {
    if (assetCache[name]) return assetCache[name];
    const f = `photos/${name}.jpg`;
    if (!existsSync(f)) return null;
    return (assetCache[name] = await uploadImage(readFileSync(f), name + ".jpg", token));
  };
  const img = (id) => ({ _type: "image", asset: { _type: "reference", _ref: id } });
  let n = 0;
  for (const [i, it] of localItems.entries()) {
    const names = [...new Set(it.photos)];
    const ids = (await Promise.all(names.map(asset))).filter(Boolean);
    if (!ids.length) continue;
    const s = it.specs || {};
    const doc = {
      _id: "item-" + it.ref, _type: "item",
      status: it.status === "sold" ? "sold" : "available",
      newArrival: ["pecore-john-w-morris", "lente-argento-e-corniola-enea-stefani", "lalique-gallo", "orologio-da-tavolo-meuzon"].includes(it.slug),
      ref: it.ref, category: it.cat, name: it.name, desc: it.desc, alt: it.alt,
      slug: { _type: "slug", current: it.slug },
      added: it.added,
      mainPhoto: img(ids[0]),
      gallery: ids.slice(1).map((id, k) => ({ ...img(id), _key: "g" + k })),
      author: s.author, dimensions: s.dimensions, material: s.material, era: s.era, condition: s.condition,
      priceInternal: it.priceInternal,
    };
    Object.keys(doc).forEach((k) => doc[k] === undefined && delete doc[k]);
    await mutate([{ createIfNotExists: doc }], token);
    n++;
    console.log(`  imported ${it.ref} ${it.slug} (${ids.length} photos)`);
  }
  await mutate([{ createIfNotExists: {
    _id: "settings", _type: "settings", phone: shop.phone, whatsapp: shop.wa, instagram: shop.instagram, tiktok: shop.tiktok,
    street: shop.street, city: shop.city, hoursIt: t.it.hoursShort, hoursEn: t.en.hoursShort, closedIt: t.it.closedShort, closedEn: t.en.closedShort,
  } }], token);
  console.log(`  imported ${n} items and the settings`);
}
