# Pehchaan — website (React)

Vite + React 18 + React Router, with 3D scenes built in Three.js via React Three Fiber.
Copy comes from "Pehchaan — Website Copy & FAQ".

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
```

## Before launch

1. **Fill placeholders.** Every `[bracketed]` item in `src/data.js` shows with a yellow dashed
   outline on the site. Replace them all, then set `HIGHLIGHT_PLACEHOLDERS = false` in `src/config.js`.
2. **Contact form.** Set `CONTACT_FORM_ENDPOINT` in `src/config.js` to a form service URL
   (Formspree, Basin, Web3Forms…) and send a test enquiry. Until then the form opens the
   visitor's email app with the message pre-filled.
3. **Client logos.** Only brands with `confirmed: true` in `clients` are shown. Get written permission first.
4. **Legal.** `/privacy` and `/terms` are placeholders. Write them for Pehchaan.
5. **Hosting.** It's a single-page app: configure your host to serve `index.html` for all routes
   (Netlify `_redirects`, Vercel rewrites, etc.).

## Launch switches (`src/config.js`)

| Flag | Turn on when |
|---|---|
| `SHOW_TESTIMONIALS` | 2+ real client testimonials are in `testimonials` |
| `SHOW_ENGAGEMENTS` | Pricing figures are locked (adds the Engagements page, nav and footer links, Home section) |
| `SHOW_JOURNAL` | You have 3 of your own posts (Journal page not built yet) |

## Where things live

- `src/data.js` — all copy, SEO titles/descriptions, FAQ, plans, roles
- `src/pages/` — Home, Services, Work, About, Engagements, Careers, Contact, FAQ, Legal
- `src/components/` — sections and shared pieces
- `src/three/` — 3D scenes (lazy-loaded, paused off screen)
- `src/styles.css` — all styling
