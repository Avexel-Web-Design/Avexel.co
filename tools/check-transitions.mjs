import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { pngPixels, regionDifference } from './png-pixels.mjs';

const base = process.env.CHECK_URL ?? 'http://localhost:4321';
const views = ['home', 'services', 'studio', 'work', 'contact'];
const browser = await chromium.launch();
try {
  const density = Number(process.env.CHECK_DPR ?? 1);
  const page = await browser.newPage({ deviceScaleFactor: density });
  await page.addInitScript(theme => localStorage.setItem('avexel-theme', theme), process.env.CHECK_THEME ?? 'dark');
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
      const contact = nested && element.closest('.contact-tile') && name !== 'avx-contact-glass'
        ? new DOMMatrix(getComputedStyle(document.documentElement, '::view-transition-group(avx-contact-glass)').transform) : new DOMMatrix();
      return [[name, { x: transform.m41 + parent.m41 + contact.m41, y: transform.m42 + parent.m42 + contact.m42, width: parseFloat(style.width), height: parseFloat(style.height), radius: parseFloat(style.borderTopLeftRadius) }]];
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
      if (width >= 768 && ['home', 'studio'].includes(from) && ['home', 'studio'].includes(to)) {
        assert.ok(await page.locator('.contact-tile').evaluate(card => !CSS.supports('view-transition-group', 'contain') ||
          (card.style.viewTransitionName === 'avx-contact-glass' && getComputedStyle(card).viewTransitionGroup === 'contain')),
        'Contact must own the nested transition group so its text travels with the surface');
        for (const time of [0, 78, 195, 312, 390, 468, 585, 702, 779.9]) {
          await seek(time);
          const frame = await groups();
          const card = frame['avx-contact-glass'];
          for (const name of ['avx-contact-label', 'avx-contact-arrow', 'avx-email']) {
            const text = frame[name];
            assert.ok(text.x >= card.x && text.y >= card.y && text.x + text.width <= card.x + card.width && text.y + text.height <= card.y + card.height,
              `${width}px ${from} → ${to}: ${name} escapes Contact at ${time}ms`);
          }
        }
      }
      await seek(390);
      const middle = await groups();
      if (width >= 768) {
        for (const name of ['avx-studio-introduction', 'avx-studio-location']) {
          const blend = await page.evaluate(name => {
            const root = document.documentElement;
            return ['old', 'new'].map(phase => {
              const style = getComputedStyle(root, `::view-transition-${phase}(${name})`);
              return { opacity: Number(style.opacity), delay: style.animationDelay, duration: style.animationDuration };
            });
          }, name);
          if (name === 'avx-studio-location') {
            const destination = await page.locator('.studio-introduction .locale').boundingBox();
            const start = before[name];
            const ratio = destination.width / destination.height;
            for (const rect of [start, first[name], middle[name]]) {
              assert.ok(Math.abs(rect.width / rect.height - ratio) < .16, 'Location text must scale proportionally from its original size, not stretch a full-width row');
            }
            assert.equal(blend[0].opacity, 0, 'Location must not crossfade two captures');
            assert.equal(blend[1].opacity, 1, 'Location must stay fully visible while moving');
            for (const time of [0, 195, 585, 779.9]) {
              await seek(time);
              const opacity = await page.evaluate(() => Number(getComputedStyle(document.documentElement, '::view-transition-new(avx-studio-location)').opacity));
              assert.equal(opacity, 1, `Location must not fade at ${time}ms`);
            }
            await seek(390);
            continue;
          }
          for (const layer of blend) {
            assert.equal(layer.delay, '0s', 'Studio subtitle must not wait for a late snapshot swap');
            assert.equal(layer.duration, '0.78s', 'Subtitle color and glow must blend for the entire card movement');
            assert.ok(Math.abs(layer.opacity - .5) < .02, 'Subtitle snapshots must blend evenly at the motion midpoint');
          }
          assert.ok(Math.abs(blend[0].opacity + blend[1].opacity - 1) < .01, 'Subtitle must not dim or brighten during the handoff');
        }
      }
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
    await setup('services');
    for (const service of ['development', 'maintenance', 'design']) {
      const start = await page.locator('[data-service-tab][aria-selected="true"] .service-active-rule').boundingBox();
      await page.locator(`[data-service-tab="${service}"]`).dispatchEvent('click');
      await running(); await seek(0);
      const end = await page.locator('[data-service-tab][aria-selected="true"] .service-active-rule').boundingBox();
      const first = (await groups())['avx-service-indicator'];
      assert.ok(first && Math.abs(first.x - start.x) <= 1.01, 'The shared tab underline must start at the previous selection');
      await seek(180);
      const middle = (await groups())['avx-service-indicator'];
      assert.ok(Math.abs(middle.x - (start.x + end.x) / 2) <= 1.01, 'The tab underline must slide continuously through the midpoint');
      assert.ok(Math.abs(middle.width - (start.width + end.width) / 2) <= 1.01, 'The tab underline must resize continuously with its label');
      await finish();
      assert.equal(await page.locator(`[data-service-tab="${service}"]`).getAttribute('aria-selected'), 'true');
    }
    // A project shot keeps its full frame for the whole move, so opening and
    // closing Work resizes one picture instead of cross-fading two crops.
    for (const [from, to] of [['home', 'work'], ['work', 'home']]) {
      await setup(from);
      const preview = await page.locator('[data-project]:not([hidden]) .work-image').boundingBox();
      const before = pngPixels(await page.screenshot({ scale: 'css', clip: preview }));
      await navigate(to); await running(); await seek(0);
      const held = await page.evaluate(() => {
        const layer = name => getComputedStyle(document.documentElement, `::view-transition-${name}(avx-project-image)`);
        return { old: layer('old').visibility, fresh: layer('new').visibility, fit: layer('new').objectFit };
      });
      const opening = from === 'home';
      assert.equal(held.old, opening ? 'hidden' : 'visible', `${width}px ${from} → ${to}: hold one project image frame`);
      assert.equal(held.fresh, opening ? 'visible' : 'hidden', `${width}px ${from} → ${to}: hold one project image frame`);
      assert.equal(held.fit, 'cover');
      const start = pngPixels(await page.screenshot({ scale: 'css', clip: preview }));
      const difference = regionDifference(before, start, { x: 0, y: 0, ...preview });
      assert.ok(difference < 6, `${width}px ${from} → ${to}: the project image must begin on its resting frame (${difference.toFixed(2)})`);
      await seek(390);
      const middle = await page.evaluate(() => {
        const style = getComputedStyle(document.documentElement, '::view-transition-group(avx-project-image)');
        return { width: parseFloat(style.width), height: parseFloat(style.height), overflow: style.overflow };
      });
      assert.equal(middle.overflow, 'clip');
      assert.ok(Math.max(Math.abs(middle.width - preview.width), Math.abs(middle.height - preview.height)) > 1, `${width}px ${from} → ${to}: the project image should resize with the card, not swap`);
      await finish();
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
