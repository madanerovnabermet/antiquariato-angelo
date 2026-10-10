// Small helpers for Sanity's HTTP API (no extra packages needed).
export const PROJECT = "9mmua44p", DATASET = "production", API = "v2025-02-19";
const host = (cdn) => `https://${PROJECT}.${cdn ? "apicdn" : "api"}.sanity.io/${API}`;

export async function query(groq, params = {}, token) {
  const u = new URL(`${host(!token)}/data/query/${DATASET}`);
  u.searchParams.set("query", groq);
  u.searchParams.set("perspective", "published");
  for (const [k, v] of Object.entries(params)) u.searchParams.set("$" + k, JSON.stringify(v));
  const r = await fetch(u, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
  if (!r.ok) throw new Error(`Sanity query ${r.status}: ${await r.text()}`);
  return (await r.json()).result;
}

export async function mutate(mutations, token) {
  const r = await fetch(`${host(false)}/data/mutate/${DATASET}?returnIds=true`, {
    method: "POST", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ mutations }),
  });
  if (!r.ok) throw new Error(`Sanity mutate ${r.status}: ${await r.text()}`);
  return r.json();
}

export async function uploadImage(buf, filename, token) {
  const type = filename.endsWith(".webp") ? "image/webp" : filename.endsWith(".png") ? "image/png" : "image/jpeg";
  const r = await fetch(`${host(false)}/assets/images/${DATASET}?filename=${encodeURIComponent(filename)}`, {
    method: "POST", headers: { Authorization: `Bearer ${token}`, "Content-Type": type }, body: buf,
  });
  if (!r.ok) throw new Error(`Sanity upload ${r.status}: ${await r.text()}`);
  return (await r.json()).document._id;
}
