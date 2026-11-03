import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const base = process.env.CHECK_URL ?? 'http://localhost:4321';
const browser = await chromium.launch({ headless: true });

try {
  {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.route('**/fonts/*.woff2', async route => {
      await new Promise(resolve => setTimeout(resolve, 10000));
      await route.continue().catch(() => {});
    });
    const started = Date.now();
    await page.goto(`${base}/`, { waitUntil: 'domcontentloaded' });
    await page.locator('.scroll-story[data-ready="true"]').waitFor({ timeout: 5000 });
    const boot = await page.evaluate(() => document.documentElement.getAttribute('data-scene-boot'));
    assert.equal(boot, null, 'The scene should boot before a stalled font request finishes');
    assert.ok(Date.now() - started < 5000, `The scene took ${Date.now() - started}ms to boot with a stalled font`);
    await page.close();
    console.log('stalled font: passed');
  }

  {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.route('**/_astro/index*.js', route => route.abort());
    await page.goto(`${base}/`, { waitUntil: 'domcontentloaded' });
    await page.locator('.scene').waitFor({ state: 'visible', timeout: 9000 });
    await page.close();
    console.log('failed scene script: passed');
  }
} finally {
  await browser.close();
}
