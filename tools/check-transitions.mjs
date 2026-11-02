import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { pngPixels, regionDifference } from './png-pixels.mjs';

const base = process.env.CHECK_URL ?? 'http://localhost:4321';
const views = ['home', 'services', 'studio', 'work', 'contact'];
const sources = {
  wordmark: '.identity-wordmark > span', 'brand-mark': '.identity-wordmark > img',
  'brand-control': '.identity-wordmark',
  discipline: '.identity-description p:first-child', introduction: '.identity-description p:last-child',
  'service-copy': '[data-service-panel]:not([hidden])', 'service-action': '.sheet-action',
  'questions-border': '.service-questions',
  'service-rule': '.service-tabs', 'team-mark': '.studio-preview > img',
  'studio-introduction': '.studio-introduction', 'studio-copy': '.studio-tile [data-tile-detail]',
  'project-controls': '.work-tile [data-tile-detail]',
  'project-image': '[data-project]:not([hidden]) .work-image',
  'project-title': '[data-project]:not([hidden]) .work-description h3',
  'project-description': '[data-project]:not([hidden]) .work-description p',
  email: '.contact-methods a:first-child', phone: '.contact-methods a:last-child',
  'contact-copy': '.contact-tile [data-tile-detail]',
};
for (const view of views.slice(1)) {
  sources[`${view}-glass`] = `[data-panel="${view}"] .tile-material`;
  sources[`${view}-label`] = `[data-panel="${view}"] .tile-label`;
  sources[`${view}-control`] = `[data-panel="${view}"] .tile-heading h2 button`;
  sources[`${view}-arrow`] = `[data-panel="${view}"] .tile-heading h2 .icon`;
  sources[`${view}-close`] = `[data-panel="${view}"] .tile-close`;
}
for (const service of ['design', 'development', 'maintenance']) {
  sources[`service-${service}`] = `[data-service-tab="${service}"] .service-label`;
  sources[`service-${service}-control`] = `[data-service-tab="${service}"]`;
  sources[`service-${service}-rule`] = `[data-service-tab="${service}"] .service-active-rule`;
}
for (let index = 1; index <= 3; index++) sources[`question-${index}`] = `.service-questions details:nth-child(${index})`;

const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.clock.install();
  await page.clock.pauseAt(new Date());
  let run = 0;
  const setup = async view => {
    await page.goto(`${base}/?motion-check=${++run}#${view}`);
    await page.locator('.scroll-story[data-ready=true]').waitFor();
    await page.evaluate(async () => {
      await Promise.all([...document.images].map(async image => {
        image.loading = 'eager';
        try { await image.decode(); } catch { /* The main regression suite checks broken images. */ }
      }));
    });
  };
  const navigate = view => page.locator(view === 'home' ? '.identity-wordmark' : `[data-panel="${view}"] .tile-heading h2 button`).dispatchEvent('click');
  const capture = () => page.evaluate(selectors => Object.entries(selectors).flatMap(([key, selector]) => {
    const element = document.querySelector(`.content-workspace ${selector}`);
    if (!element) return [];
    const rect = element.getBoundingClientRect();
    const style = getComputedStyle(element);
    if (!rect.width || !rect.height || Number(style.opacity) < .001) return [];
    return [{ key, rect: rect.toJSON(), opacity: Number(style.opacity), font: style.fontSize, tracking: style.letterSpacing, color: style.color }];
  }), sources);
  const layers = () => page.locator('.morph-visual').evaluateAll(elements => elements.flatMap(element => {
    const opacity = Number(getComputedStyle(element).opacity);
    if (opacity < .001) return [];
    const source = element.firstElementChild.firstElementChild;
    const style = getComputedStyle(source);
    return [{ key: element.dataset.morphKey, rect: element.getBoundingClientRect().toJSON(), opacity, font: style.fontSize, tracking: style.letterSpacing, color: style.color }];
  }));
  const continuous = (before, after, label, compareType = true) => {
    assert.equal(after.length, before.length, `${label}: every outgoing visual survives the first frame`);
    before.forEach((old, index) => {
      const next = after[index];
      assert.equal(next.key, old.key, `${label}: paint order remains stable`);
      for (const field of ['x', 'y', 'width', 'height']) assert.ok(Math.abs(old.rect[field] - next.rect[field]) < .15, `${label}: ${old.key}.${field} snapped ${old.rect[field]} → ${next.rect[field]}`);
      assert.ok(Math.abs(old.opacity - next.opacity) < .001, `${label}: ${old.key} changed opacity at the start`);
      if (compareType) for (const field of ['font', 'tracking', 'color']) assert.equal(next[field], old[field], `${label}: ${old.key} changed ${field} before moving`);
    });
  };
  for (const [width, height] of [[1440, 900], [390, 844]]) {
    await page.setViewportSize({ width, height });
    for (const from of views) for (const to of views.filter(view => view !== from)) {
      await setup(from);
      const before = await capture();
      await navigate(to);
      // Rendering is paused at t=0, not merely sampled 100ms after the bug happened.
      const painted = await layers();
      assert.equal(painted.length, before.length, `${width}px ${from} → ${to}: no destination-only element may appear in the start frame (${painted.filter(item => !before.some(old => old.key === item.key)).map(item => item.key)})`);
      const ordered = before.map(old => painted.find(layer => layer.key === old.key));
      assert.ok(ordered.every(Boolean));
      continuous(before, ordered, `${width}px ${from} → ${to}`);
      await page.clock.runFor(390);
      const textWrapping = await page.locator('.morph-visual').evaluateAll(elements => elements.flatMap(element => {
        const source = element.firstElementChild.firstElementChild;
        if (!source.matches('.service-label,.tile-label,.identity-wordmark > span') && element.dataset.morphKey !== 'wordmark') return [];
        const range = document.createRange(); range.selectNodeContents(source);
        return range.getClientRects().length > 1 ? [element.dataset.morphKey] : [];
      }));
      assert.deepEqual(textWrapping, [], 'Moving single-line labels must not reflow during motion');
      await page.clock.runFor(370);
      const target = await capture();
      const handoff = await layers();
      const lastFrame = target.map(item => handoff.find(layer => layer.key === item.key));
      assert.ok(lastFrame.every(Boolean));
      continuous(target, lastFrame, `${width}px ${from} → ${to} end handoff`);
      await page.clock.runFor(40);
      assert.equal(await page.locator('.content-morph').count(), 1, 'Sample the raster handoff before the motion layer is retired');
      const ink = await page.locator('.content-workspace .identity-wordmark > span,.content-workspace .tile-label,.content-workspace .service-label,.content-workspace .studio-introduction,.content-workspace .service-content h3,.content-workspace .service-content p,.content-workspace .studio-people h3,.content-workspace .studio-people p,.content-workspace .contact-methods a,.content-workspace .inquiry-form label,.content-workspace .work-description h3,.content-workspace .work-description p').evaluateAll(elements => elements.filter(element => element.getBoundingClientRect().width).map(element => ({ text: element.textContent, ...element.getBoundingClientRect().toJSON() })));
      const beforePaintSwap = pngPixels(await page.screenshot());
      const swapFrames = [beforePaintSwap];
      for (let frame = 0; frame < 3; frame++) {
        await page.clock.runFor(16);
        swapFrames.push(pngPixels(await page.screenshot()));
      }
      await page.clock.runFor(142);
      const afterPaintSwap = pngPixels(await page.screenshot());
      for (const region of ink) {
        for (const frame of swapFrames) {
          const difference = regionDifference(frame, afterPaintSwap, region);
          assert.ok(difference < .3, `${width}px ${from} → ${to}: rasterized content flashed at handoff (${region.text}: ${difference.toFixed(3)})`);
        }
      }
      assert.equal(await page.locator('.content-morph').count(), 0);
      assert.equal(await page.locator('.content-workspace').getAttribute('data-transitioning'), 'false');
      assert.equal(await page.locator('.content-workspace').getAttribute('data-content-view'), to);
    }
    for (const interruptionTime of [290, 650, 800]) {
      await setup('home');
      await navigate('services');
      await page.clock.runFor(interruptionTime);
      const interrupted = await layers();
      await navigate('work');
      continuous(interrupted, await layers(), `${width}px interrupted at ${interruptionTime}ms`, false);
      await page.clock.runFor(1000);
      assert.equal(await page.locator('.content-workspace').getAttribute('data-content-view'), 'work');
      assert.equal(await page.locator('.content-morph').count(), 0);
    }
    for (const [view, selector] of [['services', '[data-service-tab="development"]'], ['services', '.service-questions details:nth-child(2) summary'], ['work', '[data-select-project="1"]']]) {
      await setup(view);
      const before = await capture();
      await page.locator(`.content-workspace ${selector}`).dispatchEvent('click');
      const painted = await layers();
      continuous(before, before.map(item => painted.find(layer => layer.key === item.key)), `${width}px ${selector}`);
      await page.clock.runFor(650);
      assert.equal(await page.locator('.content-morph').count(), 0);
    }
    await setup('home');
    const button = await page.locator('[data-panel="services"] .tile-heading h2 button').boundingBox();
    await page.mouse.move(button.x + button.width / 2, button.y + button.height / 2);
    const unpressed = await capture();
    await page.mouse.down();
    continuous(unpressed, await capture(), 'Pointer-down must not introduce a one-pixel geometry jump');
    await page.mouse.up();
    const pressedPaint = await layers();
    continuous(unpressed, unpressed.map(item => pressedPaint.find(layer => layer.key === item.key)), 'Real pointer transition start');
    await page.clock.runFor(1000);
    if (width < 768) {
      await setup('contact');
      await page.locator('.content-workspace').evaluate(element => { element.scrollTop = 120; });
      const scrolled = await capture();
      await navigate('home');
      const painted = await layers();
      continuous(scrolled, scrolled.map(item => painted.find(layer => layer.key === item.key)), 'Scrolled mobile exit');
      await page.clock.runFor(1000);
      assert.equal(await page.locator('.content-morph').count(), 0);
    }
    console.log(`Passed all 20 directed section transitions and interrupted motion at ${width}×${height}`);
  }
  assert.deepEqual(errors, []);
} finally { await browser.close(); }
