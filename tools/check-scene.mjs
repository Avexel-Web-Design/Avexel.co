import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const base = process.env.CHECK_URL ?? 'http://localhost:4321';
const errors = [];
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(base);
  await page.locator('.scroll-story[data-ready="true"]').waitFor();
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(300);
  const scrollTo = async progress => {
    await page.evaluate(value => window.scrollTo(0, value * (document.querySelector('.scroll-story').offsetHeight - document.querySelector('.scene').clientHeight)), progress);
    await page.waitForTimeout(140);
  };
  const clickVisible = async locator => {
    await locator.click();
    await page.waitForTimeout(350);
  };
  await page.screenshot({ path: '/tmp/opencode/scene-opening.png' });
  assert.equal(await page.locator('html').evaluate(element => getComputedStyle(element).scrollbarWidth), 'none');
  assert.equal(await page.locator('.eraser-head').count(), 0);
  const verifyFastPlayback = async (button, destination) => {
    const start = await page.evaluate(() => scrollY);
    await button.click();
    assert.equal(await page.locator('.scene').getAttribute('data-animating'), 'true');
    const samples = await page.evaluate(() => new Promise(resolve => {
      const positions = [];
      const tick = () => {
        positions.push(scrollY);
        if (document.querySelector('.scene').dataset.animating === 'true') requestAnimationFrame(tick);
        else resolve(positions);
      };
      tick();
    }));
    await page.locator(`.scene[data-step="${destination}"][data-animating="false"]`).waitFor();
    const end = await page.evaluate(() => scrollY);
    assert.ok(samples.length > 10, 'Fast playback should visibly animate rather than teleport');
    for (const fraction of [.2, .5, .8]) assert.ok(samples.some(y => Math.abs(y - (start + (end - start) * fraction)) < Math.abs(end - start) * .07), 'Fast playback must traverse the entire sequence');
  };
  await verifyFastPlayback(page.locator('.story-controls [data-skip]'), 5);
  await verifyFastPlayback(page.locator('.real-footer [data-replay]'), 0);
  await page.mouse.move(700, 400);
  await page.mouse.wheel(0, 12000);
  await page.waitForTimeout(100);
  const earlyScroll = await page.evaluate(() => scrollY);
  assert.ok(earlyScroll > 0 && earlyScroll < 250, 'A fling should start a transition, not jump through the story');
  await page.mouse.wheel(0, 12000);
  await page.locator('.scene[data-step="1"][data-animating="false"]').waitFor();
  await page.waitForTimeout(350);
  const firstStop = await page.evaluate(() => scrollY);
  const expectedFirst = await page.evaluate(() => 1.45 / 10.95 * (document.querySelector('.scroll-story').offsetHeight - document.querySelector('.scene').clientHeight));
  assert.ok(Math.abs(firstStop - expectedFirst) < 2, 'A fling and its momentum must finish exactly one animation');
  assert.equal(await page.locator('.line-one').evaluate(element => getComputedStyle(element).opacity), '1');
  assert.equal(await page.locator('.line-two').evaluate(element => getComputedStyle(element).opacity), '0');
  await page.mouse.wheel(0, 100);
  await page.waitForTimeout(100);
  await page.reload();
  await page.locator('.scroll-story[data-ready="true"]').waitFor();
  assert.equal(await page.locator('.scene').getAttribute('data-step'), '2', 'Refreshing mid-transition should restore its complete destination');
  assert.equal(await page.locator('.line-two').evaluate(element => getComputedStyle(element).opacity), '1');
  const gestureStep = async (step, delta) => {
    await page.mouse.move(700, 400);
    await page.mouse.wheel(0, delta);
    await page.locator(`.scene[data-step="${step}"][data-animating="false"]`).waitFor();
    await page.waitForTimeout(250);
    const position = await page.evaluate(() => scrollY);
    await page.waitForTimeout(150);
    assert.equal(await page.evaluate(() => scrollY), position, 'An animation must stay at its completed state without more input');
  };
  for (const step of [3, 4]) await gestureStep(step, 9000);
  await page.mouse.wheel(0, 9000);
  await page.waitForTimeout(1900);
  assert.equal(await page.locator('.scene').getAttribute('data-animating'), 'true', 'Erasure must continue directly into the reveal without another gesture');
  await page.locator('.scene[data-step="5"][data-animating="false"]').waitFor();
  assert.equal(await page.locator('.real-site').evaluate(element => element.inert), false);
  for (const step of [4, 3, 2, 1, 0]) await gestureStep(step, -9000);
  await page.locator('.demo-nav [data-skip]').focus();
  await page.keyboard.press('PageDown');
  await page.locator('.scene[data-step="1"][data-animating="false"]').waitFor();
  await page.keyboard.press('ArrowUp');
  await page.locator('.scene[data-step="0"][data-animating="false"]').waitFor();
  await scrollTo(.23);
  const spacing = await page.evaluate(() => {
    const rect = selector => document.querySelector(selector).getBoundingClientRect();
    return [rect('.line-one .discard-one').left - rect('.keep-work').right, rect('.keep-slop').left - rect('.keep-is').right, rect('.keep-is').left - rect('.discard-two').right];
  });
  assert.ok(spacing.every(gap => gap > 6), 'Each word boundary must have explicit visible space');
  await page.screenshot({ path: '/tmp/opencode/scene-messages.png' });
  await scrollTo(4.1 / 10.95);
  const words = await page.locator('.keep-work,.keep-is,.keep-not,.keep-slop').evaluateAll(elements => elements.map(element => {
    const rect = element.getBoundingClientRect();
    return { text: element.textContent, x: rect.x, y: rect.y, width: rect.width };
  }));
  const byText = Object.fromEntries(words.map(word => [word.text, word]));
  assert.ok(byText['Our work'].x < byText.is.x && byText.is.x < byText['n’t'].x && byText['n’t'].x < byText['AI slop.'].x, 'Merged words should read in the correct order');
  assert.ok(Math.max(...words.map(word => word.y)) - Math.min(...words.map(word => word.y)) < 2, 'Merged words should share a baseline');
  await page.screenshot({ path: '/tmp/opencode/scene-merged.png' });
  const position = await page.evaluate(() => window.scrollY);
  await page.reload();
  await page.locator('.scroll-story[data-ready="true"]').waitFor();
  await page.waitForTimeout(450);
  assert.ok(Math.abs(await page.evaluate(() => window.scrollY) - position) < 3, 'Reload should restore the narrative position');
  await scrollTo(.57);
  const verifyCallouts = async () => {
    assert.equal(await page.locator('.annotation-connectors,[data-connector],[data-note="title"]').count(), 0);
    const pointers = await page.locator('[data-note]').evaluateAll(notes => notes.flatMap(note => {
      const rect = note.getBoundingClientRect();
      if (!rect.width) return [];
      const triangle = getComputedStyle(note, '::after');
      const target = document.querySelector(note.dataset.target).getBoundingClientRect();
      const offset = parseFloat(getComputedStyle(note).getPropertyValue('--pointer-offset'));
      const side = note.dataset.pointer;
      const tip = side === 'top' ? { x: rect.left + offset, y: rect.top - 10 } : side === 'bottom' ? { x: rect.left + offset, y: rect.bottom + 10 } : side === 'left' ? { x: rect.left - 10, y: rect.top + offset } : { x: rect.right + 10, y: rect.top + offset };
      const center = { x: (rect.left + rect.right) / 2, y: (rect.top + rect.bottom) / 2 };
      const targetCenter = { x: (target.left + target.right) / 2, y: (target.top + target.bottom) / 2 };
      return [{ id: note.dataset.note, triangle: triangle.clipPath !== 'none' && triangle.width === '10px', facesTarget: Math.hypot(tip.x - targetCenter.x, tip.y - targetCenter.y) < Math.hypot(center.x - targetCenter.x, center.y - targetCenter.y), tipInViewport: tip.x >= 0 && tip.x <= innerWidth && tip.y >= 0 && tip.y <= innerHeight }];
    }));
    assert.ok(pointers.length >= 7, 'The remaining specific critiques should be present');
    assert.ok(pointers.every(pointer => pointer.triangle && pointer.facesTarget && pointer.tipInViewport), `Each attached triangle must point toward its subject: ${JSON.stringify(pointers)}`);
    const positions = await page.evaluate(() => ({
      footerNote: document.querySelector('[data-note="bottom"]').getBoundingClientRect().top,
      footer: document.querySelector('.demo-bottom').getBoundingClientRect().top,
      menuNote: document.querySelector('[data-note="nav"]').getBoundingClientRect().bottom,
      header: document.querySelector('.demo-nav').getBoundingClientRect().bottom,
    }));
    assert.ok(positions.footerNote >= positions.footer, 'Uppercase filler note should sit in the footer');
    assert.ok(positions.menuNote <= positions.header, 'Menu critique should sit up in the header');
    const overlaps = await page.evaluate(() => {
      const notes = [...document.querySelectorAll('[data-note]')].filter(note => note.getBoundingClientRect().width);
      const content = [...document.querySelectorAll('[data-annotation-obstacle]')].flatMap(element => {
        if (!element.getBoundingClientRect().width) return [];
        if (element.matches('button,.story-controls')) return [element.getBoundingClientRect()];
        const boxes = [];
        const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
        let node;
        while ((node = walker.nextNode())) {
          if (!node.textContent.trim()) continue;
          const range = document.createRange();
          range.selectNodeContents(node);
          boxes.push(...range.getClientRects());
        }
        return boxes;
      });
      const hits = (a, b) => a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
      return notes.flatMap((note, i) => {
        const rect = note.getBoundingClientRect();
        return [
          ...content.filter(box => hits(rect, box)).map(() => `${note.dataset.note} covers content`),
          ...notes.slice(i + 1).filter(other => hits(rect, other.getBoundingClientRect())).map(other => `${note.dataset.note} overlaps ${other.dataset.note}`),
          ...(rect.left < 0 || rect.top < 0 || rect.right > innerWidth || rect.bottom > innerHeight ? [`${note.dataset.note} clips the viewport`] : []),
        ];
      });
    });
    assert.deepEqual(overlaps, [], `Annotation labels must avoid occupied space at ${JSON.stringify(page.viewportSize())}`);
  };
  await verifyCallouts();
  await page.screenshot({ path: '/tmp/opencode/scene-annotations.png' });
  await scrollTo(.76);
  await page.screenshot({ path: '/tmp/opencode/scene-erase.png' });
  await scrollTo(1);
  assert.equal(await page.locator('.real-site').evaluate(element => element.inert), false);
  await page.screenshot({ path: '/tmp/opencode/scene-final-desktop.png' });
  for (let i = 0; i < 4; i++) {
    await clickVisible(page.locator(`[data-select-project="${i}"]`));
    assert.ok(await page.locator(`[data-project="${i}"]`).isVisible());
  }
  await clickVisible(page.getByRole('button', { name: 'Studio', exact: true }));
  assert.ok(await page.getByText('Ryan Latimer').isVisible());
  await clickVisible(page.getByRole('button', { name: 'Start a project', exact: true }));
  await page.locator('#contact-name').fill('Browser verification');
  await page.locator('#contact-email').fill('test@example.com');
  await page.locator('#contact-message').fill('Testing the contact form without submitting a real inquiry.');
  await page.route('https://formspree.io/**', route => route.fulfill({ status: 500, body: '{}' }));
  await page.getByRole('button', { name: 'Send message' }).click();
  await page.getByText('Your message couldn’t be sent.', { exact: false }).waitFor();
  assert.ok((await page.locator('#contact-message').inputValue()).length > 0);
  await page.unroute('https://formspree.io/**');
  await page.route('https://formspree.io/**', route => route.fulfill({ status: 200, body: '{}' }));
  await page.getByRole('button', { name: 'Send message' }).click();
  await page.getByText('Message sent. We’ll reply by email.').waitFor();
  await page.reload();
  await page.locator('.scroll-story[data-ready="true"]').waitFor();
  await page.waitForTimeout(350);
  assert.ok(await page.locator('[data-panel="contact"]').isVisible(), 'Reload should restore the active view');
  for (const [width, height] of [[320, 844], [375, 844], [390, 844], [768, 900], [1024, 900], [1440, 900], [1440, 700], [2000, 1213]]) {
    await page.setViewportSize({ width, height });
    await page.waitForFunction(() => document.querySelector('.scene').dataset.annotationSize === `${innerWidth}x${innerHeight}`);
    await scrollTo(1);
    await clickVisible(page.locator('[data-view="work"]'));
    const layout = await page.evaluate(() => {
      const footer = document.querySelector('.real-footer').getBoundingClientRect();
      const selector = document.querySelector('.project-selector').getBoundingClientRect();
      return { width: document.documentElement.scrollWidth, footer: footer.top, selector: selector.bottom };
    });
    assert.ok(layout.width <= width, `Horizontal overflow at ${width}`);
    assert.ok(layout.selector <= layout.footer + 1, `Project controls overlap footer at ${width}`);
    if (width === 390) await page.screenshot({ path: '/tmp/opencode/scene-final-mobile.png' });
    await scrollTo(.57);
    await verifyCallouts();
    if (width === 390) await page.screenshot({ path: '/tmp/opencode/scene-annotations-mobile.png' });
    await scrollTo(1);
  }
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(base);
  await page.locator('.scroll-story[data-ready="true"]').waitFor();
  await page.waitForTimeout(250);
  assert.equal(await page.locator('.real-site').evaluate(element => element.inert), false);
  assert.ok(await page.locator('[data-view="work"]').isVisible());
  assert.ok(await page.evaluate(() => document.documentElement.scrollHeight <= window.innerHeight + 1), 'Reduced motion bypasses scroll narrative');
  await page.goto(`${base}/communications/`);
  assert.ok(await page.locator('.site-header').isVisible());
  assert.deepEqual(errors, []);
  console.log('Scene checks passed: combined erase/reveal step, fast skip/replay, reversible gesture and keyboard steps, refresh restoration, attached triangle callouts, header/footer placement, collision-free labels, project switching, contact success/error, 320–2000px layouts, reduced motion, and client guide.');
} finally { await browser.close(); }
