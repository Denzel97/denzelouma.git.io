# Denzel Ouma Opondo — Portfolio

The source for the current-generation personal portfolio, formerly staged under `portfolio-v2/` in the 2020 legacy repository.

**Live site:** https://denzel-ouma-opondo.vercel.app/

## Project structure

- `index.html`, `styles.css`, `script.js` — the portfolio website and project case studies.
- `infinity-ribbon.js`, `infinity-ribbon.css` — interactive bronze infinity sculpture with WebGL and fallback.
- `fikra-connect.js` — Fikra Connect, a free contact launcher for Gmail, WhatsApp and LinkedIn.
- `fikra-connect-showcase.css`, `fikra-connect-showcase.js` — interactive Fikra Connect product showcase.
- `motion.css`, `motion.js` — restrained motion and entrance transitions.
- `api/` — public website screenshot proxies used by the project gallery.

## Local development

The site can be served with any static local web server. For example:

```bash
python -m http.server 3000
```

Browse http://localhost:3000. For serverless screenshot endpoints, use `vercel dev` with an appropriately linked Vercel project.

## Production

The existing production deployment is at `denzel-ouma-opondo.vercel.app` (Vercel project `denzel-ouma-opondo`). **Git-based deployment has not yet been configured.** When the standalone GitHub repository is created, copy these root-level files to it and connect that repository to the existing Vercel project for deployment on pushes to `main`. Do not connect the 2020 legacy portfolio repository.

## Content and third-party assets

The portfolio refers to public images and a résumé via hosted URLs. Some interactive visuals rely on Three.js loaded through a CDN. Verify these external dependencies and the screenshot proxy behavior before publishing major changes.

## Ownership

Portfolio of Denzel Ouma Opondo, built in association with FikraWorks Technologies. Project descriptions are public-facing and intentionally omit client-private commercial figures.
