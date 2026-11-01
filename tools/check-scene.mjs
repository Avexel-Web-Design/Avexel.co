import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const base = process.env.CHECK_URL ?? 'http://localhost:4321';
const errors = [];
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  page.on('pageerror', error => errors.push(error.message));
  const ready = () => page.locator('.scroll-story[data-ready="true"]').waitFor();
  const phase = name => page.locator(`.scene[data-phase="${name}"]`).waitFor({ timeout: 25000 });
  const time = () => page.locator('.scene').evaluate(element => Number(element.dataset.time));
  const click = async locator => { await locator.click(); await page.waitForTimeout(350); };

  const verifyCallouts = async () => {
    assert.equal(await page.locator('.annotation-connectors,[data-connector],[data-note="title"]').count(), 0);
    const problems = await page.evaluate(() => {
      const notes = [...document.querySelectorAll('[data-note]')].filter(note => note.getBoundingClientRect().width);
      const content = [...document.querySelectorAll('[data-annotation-obstacle]')].flatMap(element => {
        if (!element.getBoundingClientRect().width) return [];
        if (element.matches('button,.story-controls')) return [element.getBoundingClientRect()];
        const boxes = [];
        const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
        let node;
        while ((node = walker.nextNode())) {
          if (!node.textContent.trim()) continue;
          const range = document.createRange(); range.selectNodeContents(node);
          boxes.push(...range.getClientRects());
        }
        return boxes;
      });
      const hits = (a, b) => a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
      return notes.flatMap((note, i) => {
        const rect = note.getBoundingClientRect();
        const triangle = getComputedStyle(note, '::after');
        return [
          ...content.filter(box => hits(rect, box)).map(() => `${note.dataset.note} covers content`),
          ...notes.slice(i + 1).filter(other => hits(rect, other.getBoundingClientRect())).map(other => `${note.dataset.note} overlaps ${other.dataset.note}`),
          ...(rect.left < 0 || rect.top < 0 || rect.right > innerWidth || rect.bottom > innerHeight ? [`${note.dataset.note} clips the viewport`] : []),
          ...(!['top', 'bottom', 'left', 'right'].includes(note.dataset.pointer) || triangle.clipPath === 'none' ? [`${note.dataset.note} has no triangle`] : []),
        ];
      });
    });
    assert.deepEqual(problems, [], `Callouts must remain clear at ${JSON.stringify(page.viewportSize())}`);
    const alignment = await page.evaluate(() => {
      const header = document.querySelector('.demo-nav').getBoundingClientRect();
      const links = document.querySelector('.demo-nav > div').getBoundingClientRect();
      const footer = document.querySelector('.demo-bottom').getBoundingClientRect();
      const note = document.querySelector('[data-note="bottom"]').getBoundingClientRect();
      return { centered: !links.width || Math.abs((links.top + links.bottom) / 2 - (header.top + header.bottom) / 2) < 2, footerNote: note.top >= footer.top };
    });
    assert.ok(alignment.centered, 'Fake navigation links should be vertically centered');
    assert.ok(alignment.footerNote, 'Uppercase callout should remain in the footer');
    if (page.viewportSize().width >= 1024) {
      const nudges = await page.evaluate(() => {
        const box = selector => document.querySelector(selector).getBoundingClientRect();
        const brand = box('[data-note="brand"]');
        const dot = box('.demo-brand > span');
        const label = box('[data-note="label"]');
        const labelElement = document.querySelector('[data-note="label"]');
        const labelOffset = parseFloat(getComputedStyle(labelElement).getPropertyValue('--pointer-offset'));
        const eyebrow = box('.demo-eyebrow');
        const art = box('[data-note="art"]');
        const plus = box('.plus-one');
        const labelAligned = ['left', 'right'].includes(labelElement.dataset.pointer)
          ? Math.abs(label.top + labelOffset - (eyebrow.top + eyebrow.bottom) / 2) < 3
          : eyebrow.top - label.bottom >= 8 && eyebrow.top - label.bottom <= 15;
        return { brandBaseline: Math.abs((brand.top + brand.bottom) / 2 - (dot.bottom - 9)), labelAligned, plusGap: art.left - plus.right };
      });
      assert.ok(nudges.brandBaseline < 10 && nudges.labelAligned && nudges.plusGap >= 8 && nudges.plusGap <= 15, `The requested callout nudges should align with their subjects: ${JSON.stringify(nudges)}`);
    }
  };

  await page.goto(base);
  await ready();
  assert.equal(await page.locator('html').evaluate(element => getComputedStyle(element).scrollbarWidth), 'none');
  assert.equal(await page.locator('.eraser-head').count(), 0);
  await page.mouse.move(700, 400);
  await page.mouse.wheel(0, 12000);
  await page.waitForTimeout(250);
  assert.ok(await time() < 1, 'Scroll input must not drive the autoplay timeline');
  assert.equal(await page.evaluate(() => scrollY), 0);
  assert.ok(await page.evaluate(() => document.documentElement.scrollHeight <= innerHeight + 1), 'The scene should not create a long scroll track');
  await page.screenshot({ path: '/tmp/opencode/scene-opening.png' });

  await phase('first-line');
  await page.waitForTimeout(950);
  assert.equal(await page.locator('.line-one').evaluate(element => getComputedStyle(element).opacity), '1');
  assert.equal(await page.locator('.line-two').evaluate(element => getComputedStyle(element).opacity), '0');
  await phase('second-line');
  await page.waitForTimeout(950);
  const spacing = await page.evaluate(() => {
    const rect = selector => document.querySelector(selector).getBoundingClientRect();
    return [rect('.line-one .discard-one').left - rect('.keep-work').right, rect('.keep-slop').left - rect('.keep-is').right, rect('.keep-is').left - rect('.discard-two').right];
  });
  assert.ok(spacing.every(gap => gap > 6));
  await page.screenshot({ path: '/tmp/opencode/scene-messages.png' });
  await phase('statement');
  await page.waitForTimeout(1200);
  const words = await page.locator('.keep-work,.keep-is,.keep-not,.keep-slop').evaluateAll(elements => elements.map(element => ({ text: element.textContent, ...element.getBoundingClientRect().toJSON() })));
  const byText = Object.fromEntries(words.map(word => [word.text, word]));
  assert.ok(byText['Our work'].x < byText.is.x && byText.is.x < byText['n’t'].x && byText['n’t'].x < byText['AI slop.'].x);
  assert.ok(Math.max(...words.map(word => word.y)) - Math.min(...words.map(word => word.y)) < 2);
  await page.screenshot({ path: '/tmp/opencode/scene-merged.png' });
  const beforeReload = await time();
  await page.reload(); await ready();
  assert.ok(await time() >= beforeReload - .1 && await time() < beforeReload + 1, 'Refresh should resume the actual playback position');

  await phase('annotations');
  await page.waitForFunction(() => [...document.querySelectorAll('.annotation')].every(note => getComputedStyle(note).opacity === '1'));
  await verifyCallouts();
  await page.screenshot({ path: '/tmp/opencode/scene-annotations.png' });
  const annotationTime = await time();
  await page.waitForTimeout(1200);
  assert.equal(await page.locator('.scene').getAttribute('data-phase'), 'annotations', 'Annotations need a deliberate reading pause');
  assert.ok(await time() > annotationTime + 1, 'Playback should continue without any input');
  await phase('erase'); await page.waitForTimeout(800);
  await page.screenshot({ path: '/tmp/opencode/scene-erase.png' });
  await phase('reveal'); await page.waitForTimeout(500);
  const mask = await page.locator('.real-site').evaluate(element => ({ mask: getComputedStyle(element).maskImage, edge: parseFloat(getComputedStyle(element).getPropertyValue('--reveal-edge')), height: element.clientHeight }));
  assert.ok(mask.mask.includes('linear-gradient') && mask.edge > 0 && mask.edge < mask.height + 72, 'The reveal must have a moving feathered edge');
  await page.screenshot({ path: '/tmp/opencode/scene-reveal.png' });
  await phase('complete');
  assert.equal(await page.locator('.real-site').evaluate(element => element.inert), false);
  await page.screenshot({ path: '/tmp/opencode/scene-final-desktop.png' });

  await click(page.locator('.real-footer [data-replay]'));
  assert.equal(await page.locator('.scene').getAttribute('data-playback'), 'rewinding');
  const reverseTime = await time(); await page.waitForTimeout(300);
  assert.ok(await time() < reverseTime, 'Replay should rewind visibly');
  await phase('default');
  await click(page.locator('.story-controls [data-skip]'));
  assert.equal(await page.locator('.scene').getAttribute('data-playback'), 'fast-forward');
  await phase('complete');
  for (let i = 0; i < 4; i++) { await click(page.locator(`[data-select-project="${i}"]`)); assert.ok(await page.locator(`[data-project="${i}"]`).isVisible()); }
  await click(page.getByRole('button', { name: 'Studio', exact: true }));
  assert.ok(await page.getByText('Ryan Latimer').isVisible());
  await click(page.getByRole('button', { name: 'Start a project', exact: true }));
  await page.locator('#contact-name').fill('Browser verification');
  await page.locator('#contact-email').fill('test@example.com');
  await page.locator('#contact-message').fill('Verifying the contact form without sending a real inquiry.');
  await page.route('https://formspree.io/**', route => route.fulfill({ status: 500, body: '{}' }));
  await page.getByRole('button', { name: 'Send message' }).click();
  await page.getByText('Your message couldn’t be sent.', { exact: false }).waitFor();
  assert.ok((await page.locator('#contact-message').inputValue()).length > 0);
  await page.unroute('https://formspree.io/**');
  await page.route('https://formspree.io/**', route => route.fulfill({ status: 200, body: '{}' }));
  await page.getByRole('button', { name: 'Send message' }).click();
  await page.getByText('Message sent. We’ll reply by email.').waitFor();
  await page.reload(); await ready(); await phase('complete');
  assert.ok(await page.locator('[data-panel="contact"]').isVisible(), 'Refresh should retain the active view');

  // Seed a real saved reading pause in the new document, after pagehide saves the old one.
  await page.addInitScript(() => sessionStorage.setItem('avexel-autoplay-v1', JSON.stringify({ time: 11, view: 'work', project: 0 })));
  for (const [width, height] of [[320, 844], [375, 844], [390, 844], [768, 900], [1024, 900], [1440, 900], [1440, 700], [2000, 1213]]) {
    await page.setViewportSize({ width, height });
    await page.reload(); await ready(); await phase('annotations');
    await verifyCallouts();
    if (width === 390) await page.screenshot({ path: '/tmp/opencode/scene-annotations-mobile.png' });
    await click(page.locator('.story-controls [data-skip]')); await phase('complete');
    const layout = await page.evaluate(() => ({ width: document.documentElement.scrollWidth, footer: document.querySelector('.real-footer').getBoundingClientRect().top, selector: document.querySelector('.project-selector').getBoundingClientRect().bottom }));
    assert.ok(layout.width <= width && layout.selector <= layout.footer + 1, `Layout should fit ${width}×${height}`);
    if (width === 390) await page.screenshot({ path: '/tmp/opencode/scene-final-mobile.png' });
  }
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(base); await ready(); await phase('complete');
  assert.equal(await page.locator('.real-site').evaluate(element => element.inert), false);
  await page.goto(`${base}/communications/`);
  assert.ok(await page.locator('.site-header').isVisible());
  assert.deepEqual(errors, []);
  console.log('Passed: automatic timed sequence and reading pauses, scroll independence, refresh restoration, feathered reveal, fast skip/replay, callout layout and centered navigation at 320–2000px, project/view switching, contact success/error, reduced motion, and client guide.');
} finally { await browser.close(); }
