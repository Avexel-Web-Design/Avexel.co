import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const base = process.env.CHECK_URL ?? 'http://localhost:4321';
const browser = await chromium.launch();
try {
  const context = await browser.newContext({ colorScheme: 'dark', reducedMotion: 'reduce' });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  const checkAtlas = async light => {
    await page.waitForFunction(light => [...document.querySelectorAll('picture:has([data-theme-light-image]) img')].every(image => image.currentSrc.includes('work-atlas-light') === light), light);
    await page.locator('picture:has([data-theme-light-image]) img').evaluateAll(images => Promise.all(images.map(image => image.decode())));
  };
  for (const [width, height] of [[320,568],[375,667],[390,844],[768,900],[1024,600],[1440,600],[1440,900],[2000,1213]]) {
    await page.setViewportSize({ width, height });
    for (const view of ['home','services','studio','work','contact']) {
      await page.goto(`${base}/?theme-check#${view}`);
      await page.locator('.scroll-story[data-ready=true]').waitFor();
      assert.equal(await page.locator('.real-site').evaluate(e => getComputedStyle(e).maskImage), 'none', 'Finished reveal must have no mask during viewport changes');
      if (view !== 'contact') {
        const balance = await page.locator('.contact-tile .tile-inner').evaluate(e => {
          const frame = e.getBoundingClientRect();
          const content = [...e.children].map(c => c.getBoundingClientRect()).filter(r => r.width && r.height);
          return { top: Math.min(...content.map(r => r.top)) - frame.top, bottom: frame.bottom - Math.max(...content.map(r => r.bottom)) };
        });
        assert.ok(Math.abs(balance.top - balance.bottom) < 1, `Collapsed Contact must have equal vertical space at ${width}×${height} in ${view}`);
      }
      assert.equal(await page.locator('html').getAttribute('data-theme'), 'light', 'Light must be default even with a dark OS preference');
      await checkAtlas(true);
      const toggle = page.getByRole('button', { name: 'Switch to dark mode' });
      const box = await toggle.boundingBox();
      assert.ok(box.width >= 44 && box.height >= 44 && box.x > width / 2, 'Theme control must be an accessible touch target on the right');
      if (view === 'home') {
        const services = await page.locator('.services-tile').boundingBox();
        assert.ok(box.y + box.height <= services.y && box.x + box.width <= services.x + services.width, 'Home switch sits above Services, at the right of the left column');
      } else assert.ok(box.y < 90, 'Open sections move the theme switch into the top-right header');
      const light = await page.locator('.studio-shell').evaluate(element => {
        const visible = [...element.querySelectorAll('*')].filter(e => e.getBoundingClientRect().width);
        return { background: getComputedStyle(element).backgroundColor,
          glowing: visible.filter(e => { const s = getComputedStyle(e); return s.textShadow !== 'none' || s.boxShadow !== 'none' || s.filter.includes('drop-shadow'); }).map(e => e.className),
          overflow: [...element.querySelectorAll('.tile-inner')].filter(e => e.scrollHeight > e.clientHeight + 1 || e.scrollWidth > e.clientWidth + 1).map(e => e.parentElement.dataset.panel) };
      });
      assert.equal(light.background, 'rgb(255, 255, 255)');
      assert.deepEqual(light.glowing, [], 'Light mode has no glow, including text, cards and icons');
      assert.deepEqual(light.overflow, [], `Light mode must fit at ${width}×${height} in ${view}`);
      if (view === 'contact') {
        const submit = page.locator('.inquiry-submit');
        await submit.hover();
        assert.equal(await submit.evaluate(e => getComputedStyle(e).boxShadow), 'none', 'Light hover has no glow');
        assert.equal(await submit.evaluate(e => getComputedStyle(e).color), 'rgb(255, 255, 255)', 'Black submit needs white text');
      }
      await toggle.click();
      assert.equal(await page.locator('html').getAttribute('data-theme'), 'dark');
      await checkAtlas(false);
      assert.equal(await page.locator('.studio-shell').evaluate(e => getComputedStyle(e).backgroundColor), 'rgb(0, 0, 0)');
      await page.reload();
      await page.locator('.scroll-story[data-ready=true]').waitFor();
      await page.getByRole('button', { name: 'Switch to light mode' }).click();
      assert.equal(await page.locator('html').getAttribute('data-theme'), 'light');
    }
  }
  // Resize repeatedly without waiting for the debounced intro layout rebuild.
  for (const height of [600,640,680,720,760,800,840,900]) {
    await page.setViewportSize({ width: 1440, height });
    assert.equal(await page.locator('.real-site').evaluate(e => getComputedStyle(e).maskImage), 'none', 'Dragging the viewport taller must not uncover the old reveal fade');
  }
  await page.goto(`${base}/communications/`);
  assert.equal(await page.locator('html').getAttribute('data-theme'), 'light');
  await page.getByRole('button', { name: 'Switch to dark mode' }).click();
  await page.goto(`${base}/#studio`);
  assert.equal(await page.locator('html').getAttribute('data-theme'), 'dark', 'Preference persists between pages');
  assert.deepEqual(errors, []);
  await context.close();
  const blocked = await browser.newPage({ reducedMotion: 'reduce' });
  await blocked.addInitScript(() => Object.defineProperty(window, 'localStorage', { get() { throw new Error('Storage blocked'); } }));
  await blocked.goto(`${base}/#contact`);
  await blocked.locator('.scroll-story[data-ready=true]').waitFor();
  await blocked.getByRole('button', { name: 'Switch to dark mode' }).click();
  assert.equal(await blocked.locator('html').getAttribute('data-theme'), 'dark', 'Toggle works without storage');
  console.log('Passed: light default, no glow, both themes, viewport fit, top-right control, persistence, secondary pages, and blocked storage.');
} finally {
  await browser.close();
}
