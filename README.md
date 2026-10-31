# Avexel Website

## Introduction

Avexel’s website is built with Astro, TypeScript, and native CSS. Pages are rendered to static HTML; browser JavaScript handles navigation and contact submission.

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

The checks cover the dark-only appearance under both device preferences at six screen widths, navigation, project links, removal of the quote route, intercepted contact-form success/failure, reduced motion, and rendering without JavaScript. `CHECK_URL` overrides the test server; `CHROMIUM_PATH` selects an existing browser executable.

`dist/` is generated and excluded from version control. Cloudflare Workers serves this directory using `wrangler.jsonc`; the existing deployment workflow builds it before deployment. `npm run deploy` explicitly builds and deploys.

## Editing the site

- `src/pages/index.astro`: homepage content and project links.
- `src/styles/site.css`: responsive layouts, dark palette, purple headline glow, and glass surfaces.
- `src/layouts/SiteLayout.astro`: shared metadata, navigation, and footer.
- `src/scripts/site.ts`: menu, active-section navigation, and contact form behavior. The glass navigation pill tracks sections with IntersectionObserver; ResizeObserver keeps its highlight aligned after resizing or font loading.
- `src/pages/communications.astro`: current public client guide. `public/COMMUNICATIONS-GUIDE.md` is the historical internal document.

The contact form uses the existing Formspree endpoint (`xvgkwonw`). It supports native HTML submission if JavaScript is unavailable and enhanced inline success/error feedback otherwise. Integration tests should intercept requests rather than sending test inquiries to the live inbox.

The site uses dark mode regardless of device preference, with a flat black background. Purple headline and link text share a glow treatment; purple buttons, the logo, and glass edges use matching localized glows. Motion and transparency preferences are respected.

## Image sources

The project preview images in `public/images/work-*.webp` are captures of the actual linked projects. Atlas is captured with its dark appearance explicitly selected. Detroit Rising is captured after its delayed building animations finish. Responsive WebP sizes are served according to the display width. The hero uses Atlas; there is no stock background photography.

## Legal

© 2024 Avexel. All rights reserved.  
For licensing information, see [LICENSE](LICENSE)

## Contact

- **Business Inquiries**: contact@avexel.co
- **Website**: [avexel.co](https://www.avexel.co)
