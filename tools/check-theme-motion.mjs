import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { pngPixels, regionDifference } from './png-pixels.mjs';

const base = process.env.CHECK_URL ?? 'http://localhost:4321';
const browser = await chromium.launch();
try {
  for (const [width, height, density] of [[1440,900,1],[390,844,2]]) {
    const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: density });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    const seek = time => page.evaluate(time => {
      const animation = document.getAnimations().find(a => a.effect?.pseudoElement === '::view-transition-new(root)');
      animation.pause();
      animation.effect.updateTiming({ easing: 'linear' });
      animation.currentTime = time;
    }, time);
    for (const view of ['home','work']) {
      await page.goto(`${base}/?radial-check=${view}#${view}`);
      await page.locator('.scroll-story[data-ready=true]').waitFor();
      await page.waitForFunction(() => document.querySelector('.content-workspace').dataset.transitioning !== 'true');
      for (const direction of ['dark','light']) {
        const image = page.locator('[data-project="0"] .work-image img');
        await image.evaluate(image => image.decode());
        const atlas = await image.boundingBox();
        const toggle = page.locator('[data-theme-toggle]');
        const button = await toggle.boundingBox();
        const before = pngPixels(await page.screenshot({ scale: 'css', path: '/tmp/opencode/radial-check-before.png' }));
        await toggle.dispatchEvent('click');
        await page.waitForFunction(() => document.documentElement.dataset.themeMotion === 'running');
        await seek(0);
        const zero = pngPixels(await page.screenshot({ scale: 'css', path: '/tmp/opencode/radial-check-zero.png' }));
        const startDifference = regionDifference(before, zero, atlas);
        assert.ok(startDifference < 1, `${width}px ${view} → ${direction}: Atlas must not switch before the circular reveal reaches it (${startDifference.toFixed(3)})`);
        const names = await page.evaluate(() => [...new Set(document.getAnimations().flatMap(animation => animation.effect?.pseudoElement ? [animation.effect.pseudoElement] : []))]);
        assert.deepEqual(names, ['::view-transition-new(root)'], 'Only the whole-page radial layer should animate; no independent image or text fades');
        await seek(325);
        const circle = await page.evaluate(() => getComputedStyle(document.documentElement, '::view-transition-new(root)').clipPath);
        const numbers = [...circle.matchAll(/([\d.]+)px/g)].map(match => Number(match[1]));
        assert.equal(numbers.length, 3);
        const [radius, x, y] = numbers;
        assert.ok(Math.abs(x - button.x - button.width / 2) < 1 && Math.abs(y - button.y - button.height / 2) < 1, 'Circle must start at the actual toggle center');
        const midpoint = pngPixels(await page.screenshot({ scale: 'css' }));
        await seek(650);
        const destination = pngPixels(await page.screenshot({ scale: 'css' }));
        await page.evaluate(() => document.getAnimations().filter(a => a.effect?.pseudoElement === '::view-transition-new(root)').forEach(a => a.finish()));
        await page.waitForFunction(() => !document.documentElement.classList.contains('theme-changing'));
        assert.equal(await page.locator('html').getAttribute('data-theme'), direction);
        const retired = pngPixels(await page.screenshot({ scale: 'css' }));
        assert.ok(regionDifference(destination, retired, atlas) < 1, 'Atlas must not swap again when the theme transition retires');
        if (view === 'work' && width === 1440) {
          const distance = (a, b, px, py) => {
            const ai = (py * a.width + px) * a.channels, bi = (py * b.width + px) * b.channels;
            return [0,1,2].reduce((sum, channel) => sum + Math.abs(a.data[ai + channel] - b.data[bi + channel]), 0);
          };
          let oldPixels = 0, newPixels = 0;
          for (let py = Math.ceil(atlas.y + 16); py < atlas.y + atlas.height - 16; py += 20) {
            for (let px = Math.ceil(atlas.x + 16); px < atlas.x + atlas.width - 16; px += 20) {
              if (distance(before, destination, px, py) < 150) continue;
              const offset = Math.hypot(px - x, py - y) - radius;
              if (offset < -12) {
                assert.ok(distance(midpoint, destination, px, py) < 10, 'Atlas pixels inside the circle must show the new screenshot');
                newPixels++;
              } else if (offset > 12) {
                assert.ok(distance(midpoint, before, px, py) < 10, 'Atlas pixels outside the circle must keep the old screenshot');
                oldPixels++;
              }
            }
          }
          assert.ok(oldPixels > 10 && newPixels > 10, 'A single Atlas frame must visibly contain both themes during the reveal');
        }
      }
    }
    assert.deepEqual(errors, []);
    await page.close();
  }
  const fallback = await browser.newPage();
  await fallback.addInitScript(() => { document.startViewTransition = undefined; });
  await fallback.goto(`${base}/#work`);
  await fallback.locator('.scroll-story[data-ready=true]').waitFor();
  await fallback.getByRole('button', { name: 'Switch to dark mode' }).click();
  assert.equal(await fallback.locator('html').getAttribute('data-theme'), 'dark', 'Browsers without View Transitions still switch themes');
  console.log('Passed: toggle-centered radial reveal in both directions, desktop/mobile, DPR 1/2, partial Atlas reveal, clean retirement, and compatibility fallback.');
} finally {
  await browser.close();
}
