# Avexel Website

## Introduction

Avexel’s website is built with Astro, TypeScript, and native CSS. Pages are rendered to static HTML; the only browser JavaScript handles navigation, theme selection, the estimate builder, and contact submission.

## Development

Use Node.js 24 LTS (or Node >=22.23.4) and npm >=9.6.5.

```sh
npm ci
npm run dev
```

Open `http://localhost:4321`. The server listens on all interfaces for remote testing.

If your system Node is older, run commands with a temporary current runtime:

```sh
npx --package=node@24 -c 'npm run dev'
```

## Testing from another computer

With the development server running, start LocalTunnel in another terminal:

```sh
npm run tunnel
```

Open the printed `https://….loca.lt` URL on your laptop or phone. If LocalTunnel asks for a tunnel password, retrieve the development server’s public IP with `curl https://loca.lt/mytunnelpassword`. The tunnel remains available while both processes are running. Only LocalTunnel’s hostnames are allowlisted in the development server.

For production-build testing, run `npm run build` and `npm run preview -- --port 4321`, then start the same tunnel. Astro preview serves the built site without development tooling.

## Checks and deployment

```sh
npm run type-check
npm run lint
npm run build
```

For browser regression checks, start the local preview on port 4321, then run:

```sh
npx playwright install chromium
npm run test:browser
```

The checks cover both themes at six screen widths, navigation, estimate calculations and handoff, intercepted contact-form success/failure, reduced motion, and rendering without JavaScript. `CHECK_URL` overrides the test server; `CHROMIUM_PATH` selects an existing browser executable.

`dist/` is generated and excluded from version control. Cloudflare Workers serves this directory using `wrangler.jsonc`; the existing deployment workflow builds it before deployment. `npm run deploy` explicitly builds and deploys.

## Editing the site

- `src/pages/index.astro`: homepage content and project links.
- `src/styles/site.css`: responsive layouts, light/dark tokens, and glass surfaces.
- `src/layouts/SiteLayout.astro`: shared metadata, navigation, and footer.
- `src/data/pricing.ts`: published feature prices and the existing page-count calculation.
- `src/pages/quote.astro`: estimate builder; selected estimates are carried into the contact form using session storage.
- `src/scripts/site.ts`: menu, theme toggle, and contact form behavior.
- `src/pages/communications.astro`: current public client guide. `public/COMMUNICATIONS-GUIDE.md` is the historical internal document.

The contact form uses the existing Formspree endpoint (`xvgkwonw`). It supports native HTML submission if JavaScript is unavailable and enhanced inline success/error feedback otherwise. Integration tests should intercept requests rather than sending test inquiries to the live inbox.

Light/dark mode follows the device by default, with a stored manual override. Motion and transparency preferences are respected.

## Image sources

The project preview images in `public/images/work-*.webp` are captures of the actual linked client websites, taken during the redesign. The shoreline photograph is a locally optimized [Unsplash image](https://images.unsplash.com/photo-1473116763249-2faaef81ccda); it is atmospheric imagery, not a photograph of the Avexel team or a documented Harbor Springs location.

## Legal

© 2024 Avexel. All rights reserved.  
For licensing information, see [LICENSE](LICENSE)

## Contact

- **Business Inquiries**: contact@avexel.co
- **Website**: [avexel.co](https://www.avexel.co)
