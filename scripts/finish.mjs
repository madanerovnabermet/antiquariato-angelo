// Netlify extras written into the site folder after each build.
import { writeFileSync } from "node:fs";
writeFileSync("site/_headers", `/photos/*
  Cache-Control: public, max-age=2592000
/assets/*
  Cache-Control: public, max-age=86400
/studio/*
  X-Robots-Tag: noindex
`);
writeFileSync("site/_redirects", `/it  /it/  301
/en  /en/  301
/studio/*  /studio/index.html  200
`);
console.log("headers and redirects written");
