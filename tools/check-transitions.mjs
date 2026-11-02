import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { pngPixels, regionDifference } from './png-pixels.mjs';

const base = process.env.CHECK_URL ?? 'http://localhost:4321';
const views = ['home', 'services', 'studio', 'work', 'contact'];
const browser = await chromium.launch();
try {
  const density = Number(process.env.CHECK_DPR ?? 1);
  const page = await browser.newPage({ deviceScaleFactor: density });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.addInitScript(() => sessionStorage.removeItem('avexel-autoplay-v1'));
  let run = 0;
  const setup = async view => {
    const url = `${base}/?motion-check=${++run}#${view}`;
    if (run === 1) await page.goto(url);
    else { await page.evaluate(url => history.replaceState(null, '', url), url); await page.reload(); }
    await page.locator('.scroll-story[data-ready=true]').waitFor();
    await page.evaluate(async () => {
      await Promise.all([...document.images].map(async image => {
        image.loading = 'eager';
        try { await image.decode(); } catch { /* The main suite checks broken images. */ }
      }));
    });
  };
  const navigate = view => page.locator(view === 'home' ? '.identity-wordmark' : `[data-panel="${view}"] .tile-heading h2 button`).dispatchEvent('click');
  const running = () => page.waitForFunction(() => document.documentElement.dataset.motionPhase === 'running');
  const seek = time => page.evaluate(time => {
    document.getAnimations().filter(animation => animation.effect?.pseudoElement?.startsWith('::view-transition')).forEach(animation => {
      animation.pause(); animation.currentTime = time;
    });
  }, time);
  const finish = async () => {
    await page.evaluate(() => document.getAnimations().filter(animation => animation.effect?.pseudoElement?.startsWith('::view-transition')).forEach(animation => animation.finish()));
    await page.waitForFunction(() => document.querySelector('.content-workspace').dataset.transitioning === 'false');
  };
  const groups = () => page.evaluate(() => {
    const nested = CSS.supports('view-transition-group', 'contain');
    const parent = nested ? new DOMMatrix(getComputedStyle(document.documentElement, '::view-transition-group(avx-workspace)').transform) : new DOMMatrix();
    return Object.fromEntries([...document.querySelectorAll('.content-workspace [style*="view-transition-name"]')].flatMap(element => {
      const name = element.style.viewTransitionName;
      const style = getComputedStyle(document.documentElement, `::view-transition-group(${name})`);
      if (!style.width || style.width === 'auto') return [];
      const transform = new DOMMatrix(style.transform === 'none' ? undefined : style.transform);
      return [[name, { x: transform.m41 + parent.m41, y: transform.m42 + parent.m42, width: parseFloat(style.width), height: parseFloat(style.height), radius: parseFloat(style.borderTopLeftRadius) }]];
    }));
  });
  for (const [width, height] of [[1440, 900], [1440, 700], [390, 844]]) {
    await page.setViewportSize({ width, height });
    for (const from of views) for (const to of views.filter(view => view !== from)) {
      console.log(`Checking ${width}px ${from} → ${to}`);
      await setup(from);
      const before = await page.evaluate(() => Object.fromEntries([...document.querySelectorAll('.content-workspace [style*="view-transition-name"]')].flatMap(element => {
        const rect = element.getBoundingClientRect();
        if (!rect.width || Number(getComputedStyle(element).opacity) === 0) return [];
        return [[element.style.viewTransitionName, { ...rect.toJSON(), radius: parseFloat(getComputedStyle(element).borderTopLeftRadius) }]];
      })));
      await navigate(to); await running(); await seek(0);
      const first = await groups();
      for (const [name, rect] of Object.entries(before)) {
        // Old-only groups do not need a geometry animation, but remain present
        // in the browser's old snapshot until their exit fade completes.
        if (!first[name]) continue;
        // Compositor surfaces use physical-pixel bounds (including outward
        // rounding); painted continuity is checked separately below.
        for (const field of ['x', 'y', 'width', 'height']) assert.ok(Math.abs(first[name][field] - rect[field]) <= 1.01, `${width}px ${from} → ${to}: ${name}.${field} jumps at the start`);
      }
      assert.equal(await page.locator('.content-morph,.morph-pane,.morph-visual').count(), 0, 'No script-owned text/card copies may be mounted');
      assert.equal(await page.locator('.content-workspace').evaluate(element => getComputedStyle(element).opacity), '1', 'The live website must never be hidden for a handoff');
      await seek(390);
      const middle = await groups();
      for (const view of views.slice(1)) {
        const key = `avx-${view}-glass`;
        const startRadius = before[key].radius;
        const endRadius = view === to ? 24 : 20;
        assert.ok(Math.abs(middle[key].radius - (startRadius + endRadius) / 2) < .15, `${width}px ${from} → ${to}: ${view} radius must interpolate, not stretch or snap`);
      }
      if (middle['avx-project-image']) {
        const preview = await page.evaluate(() => {
          const group = getComputedStyle(document.documentElement, '::view-transition-group(avx-project-image)');
          const image = getComputedStyle(document.documentElement, '::view-transition-new(avx-project-image)');
          return { overflow: group.overflow, fit: image.objectFit };
        });
        assert.equal(preview.overflow, 'clip');
        assert.equal(preview.fit, 'cover');
      }
      if (from === 'home' && to === 'services' && width === 1440) await page.screenshot({ path: '/tmp/opencode/native-audit-middle.png', scale: 'css' });
      await seek(779.9);
      const ink = await page.locator('.content-workspace .identity-wordmark > span,.content-workspace .tile-label,.content-workspace .service-label,.content-workspace .studio-introduction,.content-workspace .service-content h3,.content-workspace .service-content p,.content-workspace .studio-people h3,.content-workspace .studio-people p,.content-workspace .contact-methods a,.content-workspace .inquiry-form label,.content-workspace .work-description h3,.content-workspace .work-description p').evaluateAll(elements => elements.filter(element => element.getBoundingClientRect().width).map(element => ({ text: element.textContent, ...element.getBoundingClientRect().toJSON() })));
      const renderedDestination = pngPixels(await page.screenshot({ scale: 'css' }));
      await finish();
      const retired = [pngPixels(await page.screenshot({ scale: 'css' }))];
      for (let frame = 0; frame < 2; frame++) {
        await page.evaluate(() => new Promise(requestAnimationFrame));
        retired.push(pngPixels(await page.screenshot({ scale: 'css' })));
      }
      for (const rect of ink) for (const image of retired) {
        const difference = regionDifference(renderedDestination, image, rect);
        assert.ok(difference < .3, `${width}px ${from} → ${to}: rendered text changes after retirement (${rect.text}: ${difference.toFixed(3)})`);
      }
      assert.equal(await page.locator('.content-workspace').getAttribute('data-content-view'), to);
      assert.equal(await page.locator('.content-workspace').getAttribute('aria-busy'), null);
    }
    await setup('home');
    await navigate('services'); await running(); await seek(260);
    await navigate('work'); await navigate('studio');
    await page.evaluate(() => document.getAnimations().filter(animation => animation.effect?.pseudoElement?.startsWith('::view-transition')).forEach(animation => animation.finish()));
    await page.waitForFunction(() => document.querySelector('.content-workspace').dataset.contentView === 'studio' && document.documentElement.dataset.motionPhase === 'running');
    await finish();
    assert.equal(await page.locator('.content-workspace').getAttribute('data-content-view'), 'studio', 'Rapid navigation should settle on the newest request without forcing an intermediate jump');
    console.log(`Passed all 20 native transitions, physical corner interpolation, image coverage, rendered handoffs and queued navigation at ${width}×${height}, DPR ${density}`);
  }
  const fallback = await browser.newPage();
  await fallback.addInitScript(() => { document.startViewTransition = undefined; });
  await fallback.goto(`${base}/#home`);
  await fallback.locator('.scroll-story[data-ready=true]').waitFor();
  await fallback.locator('[data-panel="services"] .tile-heading h2 button').click();
  await fallback.waitForFunction(() => document.querySelector('.content-workspace').dataset.transitioning === 'false');
  assert.equal(await fallback.locator('.content-workspace').getAttribute('data-content-view'), 'services');
  assert.equal(await fallback.locator('.content-workspace').evaluate(element => getComputedStyle(element).opacity), '1');
  await fallback.close();
  assert.deepEqual(errors, []);
} finally { await browser.close(); }
