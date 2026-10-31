import assert from 'node:assert/strict';
import { chromium } from 'playwright';

// Run against a local preview. Formspree requests are intercepted, never sent.
const base = process.env.CHECK_URL ?? 'http://localhost:4321';
const launchOptions = { headless: true };
if (process.env.CHROMIUM_PATH) launchOptions.executablePath = process.env.CHROMIUM_PATH;
const browser = await chromium.launch(launchOptions);

try {
  const context = await browser.newContext({ colorScheme: 'dark' });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));

  for (const theme of ['dark', 'light']) {
    await page.emulateMedia({ colorScheme: theme });
    for (const width of [320, 375, 390, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      for (const route of ['/', '/communications/']) {
        const response = await page.goto(new URL(route, base).href);
        assert.equal(response.status(), 200);
        const layout = await page.evaluate(async () => {
          await document.fonts.ready;
          await Promise.all([...document.images].map(async image => {
            image.loading = 'eager';
            try { await image.decode(); } catch { /* Report below. */ }
          }));
          return {
            width: document.documentElement.scrollWidth,
            brokenImages: [...document.images].filter(image => !image.naturalWidth).map(image => image.src),
          };
        });
        assert.ok(layout.width <= width, `${theme} ${route} overflows at ${width}px`);
        assert.deepEqual(layout.brokenImages, [], `Broken images at ${route}`);
      }
    }
  }
  console.log('Responsive layouts and images passed in both themes, 320–1440px.');

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(base);
  const menu = page.getByRole('button', { name: 'Open menu' });
  await menu.click();
  assert.ok(await page.locator('#mobile-nav').isVisible());
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('#mobile-nav').isVisible(), false);
  await page.locator('.theme-toggle').click();
  const chosenTheme = await page.locator('html').getAttribute('data-theme');
  await page.reload();
  assert.equal(await page.locator('html').getAttribute('data-theme'), chosenTheme);

  assert.equal(await page.locator('.hero-project').getAttribute('href'), 'https://atlas.frc7790.com');
  assert.equal(await page.locator('.projects-grid .project').count(), 4);
  assert.equal(await page.locator('.project h3 a[href="https://afterimage.avexel.workers.dev"]').count(), 1);
  assert.equal(await page.locator('a[href*="/quote"], .tags, .wordmark-dot, .glass-sheet, .hero-note').count(), 0);
  assert.equal(await page.locator('.wordmark').first().innerText(), 'avexel');
  const removedRoute = await page.request.get(new URL('/quote/', base).href);
  assert.equal(removedRoute.status(), 404);

  await page.fill('#contact-name', 'Browser test');
  await page.fill('#contact-email', 'test@example.com');
  await page.fill('#contact-message', 'Intercepted test message.');
  const endpoint = 'https://formspree.io/f/xvgkwonw';
  await page.route(endpoint, route => route.fulfill({ status: 500, body: '{}' }));
  await page.locator('button[type=submit]').click();
  await page.waitForFunction(() => document.querySelector('.form-status')?.textContent?.includes('couldn’t'));
  assert.equal(await page.locator('#contact-message').inputValue(), 'Intercepted test message.');
  await page.unroute(endpoint);
  let submitted = '';
  await page.route(endpoint, route => {
    submitted = route.request().postData() ?? '';
    return route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' });
  });
  await page.locator('button[type=submit]').click();
  await page.waitForFunction(() => document.querySelector('.form-status')?.textContent?.includes('Message sent'));
  assert.match(submitted, /Intercepted test message/);
  assert.equal(await page.locator('#contact-message').inputValue(), '');

  await page.emulateMedia({ reducedMotion: 'reduce' });
  assert.equal(await page.locator('.hero-copy').evaluate(element => getComputedStyle(element).animationName), 'none');
  const staticContext = await browser.newContext({ javaScriptEnabled: false });
  const staticPage = await staticContext.newPage();
  await staticPage.goto(base);
  assert.ok(await staticPage.locator('h1').isVisible());
  assert.ok(await staticPage.locator('.no-js-nav').isVisible());
  assert.equal(await staticPage.locator('form').getAttribute('action'), endpoint);
  assert.deepEqual(errors, []);
  console.log('Menu, themes, project links, quote removal, contact recovery, reduced motion, and no-JS checks passed.');
} finally {
  await browser.close();
}
