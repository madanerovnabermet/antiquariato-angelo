# Antiquariato Angelo

Sito IT/EN di Antiquariato Angelo (antiquariatoangelo.com) con pannello di gestione.

- **Sito:** pagine statiche generate da `build.mjs` (testi in `src/i18n.mjs`, impaginazione in `src/render.mjs`, stile e animazioni in `assets/`).
- **Pannello:** Sanity Studio su `https://antiquariatoangelo.com/studio` (configurazione in `sanity.config.js`, campi in `studio/schemas/`).
- **Catalogo:** a ogni pubblicazione Netlify legge i pezzi pubblicati da Sanity (`scripts/fetch-content.mjs`) e rigenera il sito. Se Sanity non risponde, resta il catalogo incorporato in `src/data.mjs`: il sito non si rompe mai.
- **Prima importazione:** se Sanity è vuoto e su Netlify esiste la variabile segreta `SANITY_WRITE_TOKEN`, i 19 pezzi e le foto vengono caricati automaticamente (`scripts/seed.mjs`). Dopo la prima importazione la variabile va cancellata.
- **Sicurezza:** nel codice non ci sono password né chiavi. Può modificare il catalogo solo chi è membro del progetto Sanity; lo controlla il server di Sanity.

Comando di build (Netlify): `npm run build` · cartella pubblicata: `site` · Node 22.
