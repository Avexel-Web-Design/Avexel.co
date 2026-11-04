import assert from 'node:assert/strict';
import { chromium, webkit } from 'playwright';
import { pngPixels, regionDifference } from './png-pixels.mjs';

const base = process.env.CHECK_URL ?? 'http://localhost:4321';
const engine = process.env.CHECK_BROWSER === 'webkit' ? webkit : chromium;
const browser = await engine.launch(process.env.CHECK_WEBKIT_EXECUTABLE ? { executablePath: process.env.CHECK_WEBKIT_EXECUTABLE } : {});
const targets = {
  services: '.services-intro',
  studio: '.studio-tile [data-tile-detail]',
  work: '[data-project]:not([hidden]) .work-description p',
  contact: '.contact-tile [data-tile-detail]',
};
let run = 0;
try {
  for (const theme of ['light', 'dark']) {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, deviceScaleFactor: 2 });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.addInitScript(theme => localStorage.setItem('avexel-theme', theme), theme);
    for (const from of ['home', ...Object.keys(targets)]) for (const to of Object.keys(targets).filter(view => view !== from)) {
      await page.goto(`${base}/?mobile-entry=${++run}#${from}`);
      await page.locator('.scroll-story[data-ready=true]').waitFor();
      await page.locator(`[data-panel="${to}"] h2 button`).dispatchEvent('click');
      await page.waitForFunction(() => document.documentElement.dataset.motionPhase === 'running');
      await page.evaluate(() => document.getAnimations().filter(a => a.effect?.pseudoElement?.startsWith('::view-transition')).forEach(a => { a.pause(); a.currentTime = 390; }));
      const copy = page.locator(targets[to]);
      assert.equal(await copy.evaluate(e => getComputedStyle(e).opacity), '0', `${from} → ${to}: live copy must also be hidden, not just its snapshot`);
      const frame = pngPixels(await page.screenshot({ scale: 'css' }));
      // Compare actual painted pixels with the same live copy removed. This
      // catches WebKit's destination-DOM leak that pseudo opacity checks miss.
      await copy.evaluate(e => { e.style.visibility = 'hidden'; });
      const withoutCopy = pngPixels(await page.screenshot({ scale: 'css' }));
      await copy.evaluate(e => { e.style.removeProperty('visibility'); });
      assert.ok(regionDifference(frame, withoutCopy, { x: 0, y: 0, width: 390, height: 844 }) < .1, `${from} → ${to}: live copy must not leak through transparent snapshots`);
      const samples = await page.evaluate(selector => new Promise(resolve => {
        const samples = [];
        const element = document.querySelector(selector);
        const sample = () => {
          samples.push(Number(getComputedStyle(element).opacity));
          if (document.querySelector('.content-workspace').dataset.transitioning === 'false') resolve(samples);
          else requestAnimationFrame(sample);
        };
        sample();
        document.getAnimations().filter(a => a.effect?.pseudoElement?.startsWith('::view-transition')).forEach(a => a.finish());
      }), targets[to]);
      assert.equal(samples[0], 0);
      assert.ok(samples.some(opacity => opacity > 0 && opacity < 1), `${from} → ${to}: copy must pass through partial opacity after arrival (${samples.join(', ')})`);
      assert.equal(samples.at(-1), 1);
      assert.equal(await copy.evaluate(e => e.style.opacity), '', 'Retirement restores the original DOM styles');
      console.log(`${engine.name()} ${theme}: ${from} → ${to} hidden during movement, faded after arrival`);
    }
    assert.deepEqual(errors, []);
    await page.close();
  }
} finally {
  await browser.close();
}
