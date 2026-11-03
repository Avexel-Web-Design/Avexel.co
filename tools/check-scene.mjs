import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { pngPixels } from './png-pixels.mjs';

const browser = await chromium.launch({ headless: true });
// Keep the existing dark-design regression coverage; check-theme exercises the
// new light default independently, including persistence and both palettes.
const base = process.env.CHECK_URL ?? 'http://localhost:4321';
const errors = [];
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.addInitScript(() => localStorage.setItem('avexel-theme', 'dark'));
  page.on('pageerror', error => errors.push(error.message));
  await page.addInitScript(() => {
    window.exposedUnreadyScene = false;
    const inspect = () => {
      const scene = document.querySelector('.scene');
      if (document.querySelector('.scroll-story')?.dataset.ready === 'true') return;
      if (scene && getComputedStyle(scene).visibility !== 'hidden') window.exposedUnreadyScene = true;
      requestAnimationFrame(inspect);
    };
    requestAnimationFrame(inspect);
  });
  const ready = () => page.locator('.scroll-story[data-ready="true"]').waitFor();
  const phase = name => page.locator(`.scene[data-phase="${name}"]`).waitFor({ timeout: 25000 });
  const time = () => page.locator('.scene').evaluate(element => Number(element.dataset.time));
  const control = (view, target = page) => target.locator(view === 'home' ? '.identity-wordmark' : `[data-panel="${view}"] .tile-heading h2 button`);
  const click = async locator => { if (!await locator.isDisabled()) await locator.click(); await page.waitForFunction(() => document.querySelector('.content-workspace')?.dataset.transitioning !== 'true'); await page.waitForTimeout(150); };

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
  assert.equal(await page.locator('.story-chapter,.story-track,.studio-header,.studio-nav').count(), 0, 'Remove the intro progress strip and redundant studio navigation');
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
  assert.equal(await page.locator('[data-stack-object],.stack-render').count(), 0, 'The 3D logo must be completely removed');
  await page.screenshot({ path: '/tmp/opencode/scene-final-desktop.png' });

  await click(page.locator('.studio-footer [data-replay]'));
  assert.equal(await page.locator('.scene').getAttribute('data-playback'), 'wiping');
  const wipeEdge = await page.locator('.real-site').evaluate(element => parseFloat(getComputedStyle(element).getPropertyValue('--reveal-edge')));
  await page.waitForTimeout(300);
  assert.ok(await page.locator('.real-site').evaluate(element => parseFloat(getComputedStyle(element).getPropertyValue('--reveal-edge'))) < wipeEdge, 'Replay should wipe upwards');
  assert.equal(await time(), 0, 'Replay must reset the hidden intro rather than reverse its animations');
  assert.equal(await page.locator('.demo-page').evaluate(element => getComputedStyle(element).opacity), '1');
  assert.equal(await page.locator('.line-one').evaluate(element => getComputedStyle(element).opacity), '0');
  await phase('default');
  await click(page.locator('.demo-nav [data-skip]'));
  assert.equal(await page.locator('.scene').getAttribute('data-playback'), 'fast-forward');
  await phase('complete');
  assert.ok(await page.locator('[data-panel="home"]').isVisible());
  assert.equal(await page.locator('[data-goal],[data-feature],[data-brief-summary]').count(), 0, 'The rejected brief builder must be removed');
  const theme = await page.evaluate(() => ({ background: getComputedStyle(document.querySelector('.studio-shell')).backgroundColor, blur: getComputedStyle(document.querySelector('.tile-material')).backdropFilter, glow: getComputedStyle(document.querySelector('.identity-tile h2')).textShadow }));
  assert.equal(theme.background, 'rgb(0, 0, 0)');
  assert.ok(theme.blur.includes('blur') && theme.glow !== 'none', 'Use real glass blur and purple text glow');
  const homeBounds = await page.locator('[data-panel="services"]').boundingBox();
  await page.evaluate(() => { window.originalContentNodes = [...document.querySelectorAll('[data-layout-piece]')]; });
  await control('services').click();
  await page.waitForTimeout(150);
  assert.equal(await page.locator('.content-workspace').getAttribute('data-transitioning'), 'true', 'Content must visibly travel between compositions');
  assert.equal(await page.locator('html').getAttribute('data-motion-engine'), 'native', 'Section motion should use browser-managed snapshots, not cloned content');
  await page.screenshot({ path: '/tmp/opencode/content-in-motion.png' });
  await page.waitForFunction(() => document.querySelector('.content-workspace').dataset.transitioning === 'false');
  assert.equal(await page.locator('.content-workspace').getAttribute('data-content-view'), 'services');
  assert.notDeepEqual(await page.locator('[data-panel="services"]').boundingBox(), homeBounds, 'Navigation must physically rearrange the content');
  assert.ok(await page.evaluate(() => [...document.querySelectorAll('[data-layout-piece]')].every((node, index) => node === window.originalContentNodes[index])), 'Navigation must reuse the actual content nodes');
  assert.equal(await page.locator('[data-layout-piece]:visible').count(), 5, 'All content remains part of the composition');
  assert.equal(await page.locator('.services-tile details').count(), 0, 'Service terms should not be hidden behind accordions');
  assert.ok(await page.getByText('You own the code and content.', { exact: false }).isVisible());
  await click(page.getByRole('tab', { name: 'Development', exact: true }));
  assert.ok(await page.locator('[data-service-panel="development"]').isVisible());
  await page.getByRole('tab', { name: 'Development', exact: true }).focus();
  await page.keyboard.press('ArrowRight');
  await page.waitForFunction(() => document.querySelector('.content-workspace').dataset.transitioning === 'false');
  assert.equal(await page.getByRole('tab', { name: 'Maintenance', exact: true }).getAttribute('aria-selected'), 'true');
  assert.ok(await page.getByRole('tab', { name: 'Maintenance', exact: true }).evaluate(element => element === document.activeElement), 'Animated keyboard tabs must retain focus');
  await page.reload(); await ready(); await phase('complete');
  assert.equal(await page.evaluate(() => window.exposedUnreadyScene), false, 'No pre-restoration slop frame may be painted on reload');
  assert.ok(await page.locator('[data-service-panel="maintenance"]').isVisible(), 'Refresh should preserve the selected service');
  assert.equal(await page.locator('.content-workspace').getAttribute('data-content-view'), 'services');
  assert.equal(await page.locator('.services-tile [data-view="contact"]').count(), 0, 'Services should not contain a Contact button');
  await click(control('contact'));
  await click(control('home'));
  assert.equal(await page.locator('.work-description').first().isVisible(), false, 'Collapsed Work should show only the showcase, not a repeated project title');
  assert.equal(await page.locator('.studio-preview img').count(), 0, 'The collapsed Studio composition should be typographic, not a small robotics logo beside body copy');
  await click(page.getByRole('tab', { name: 'Development', exact: true }));
  assert.equal(await page.locator('.content-workspace').getAttribute('data-content-view'), 'services', 'Overview service labels should expand into the same live service tabs');
  assert.equal(await page.getByRole('tab', { name: 'Development', exact: true }).getAttribute('aria-selected'), 'true');
  await click(control('home'));
  await click(page.locator('[data-project]:not([hidden]) .work-image'));
  assert.equal(await page.locator('.content-workspace').getAttribute('data-content-view'), 'work', 'The small screenshot should expand Work before offering the external site link');
  for (const view of ['studio', 'contact', 'services', 'work']) await control(view).dispatchEvent('click');
  await page.waitForFunction(() => document.querySelector('.content-workspace').dataset.transitioning === 'false');
  assert.equal(await page.locator('[data-panel="work"]').getAttribute('data-expanded'), 'true', 'Rapid navigation must settle on the last requested view');
  await click(control('work'));
  for (let i = 0; i < 4; i++) { await click(page.locator(`[data-select-project="${i}"]`)); assert.ok(await page.locator(`[data-project="${i}"]`).isVisible()); }
  await page.locator('[data-select-project="3"]').focus();
  await page.keyboard.press('Home');
  await page.waitForFunction(() => document.querySelector('.content-workspace').dataset.transitioning === 'false');
  assert.equal(await page.locator('[data-select-project="0"]').getAttribute('aria-pressed'), 'true', 'The text project selector supports keyboard navigation');
  assert.equal(await page.locator('.work-choices img').count(), 0, 'Project selection should be text-only');
  await click(control('studio'));
  assert.ok(await page.getByText('Ryan Latimer').isVisible());
  await click(control('contact'));
  await page.locator('#contact-name').fill('Browser verification');
  await page.locator('#contact-email').fill('test@example.com');
  await page.locator('#contact-service').click();
  await page.getByRole('option', { name: 'Web application', exact: true }).click();
  assert.equal(await page.locator('[name="service"]').inputValue(), 'Web application');
  await page.locator('#contact-service').click();
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('#contact-service').getAttribute('aria-expanded'), 'false');
  assert.equal(await page.locator('.content-workspace').getAttribute('data-content-view'), 'contact', 'Escape closes the custom menu before closing Contact');
  await page.keyboard.press('Enter');
  await page.keyboard.press('End');
  assert.equal(await page.locator('#contact-service').getAttribute('aria-activedescendant'), 'inquiry-option-4');
  await page.keyboard.press('Home');
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter');
  assert.equal(await page.locator('[name="service"]').inputValue(), 'Web application', 'The custom selector commits keyboard choices to FormData');
  await page.locator('#contact-message').fill('Verifying the contact form without sending a real inquiry.');
  await page.route('https://formspree.io/**', route => route.fulfill({ status: 500, body: '{}' }));
  await page.getByRole('button', { name: 'Send message' }).click();
  await page.getByText('Your message couldn’t be sent.', { exact: false }).waitFor();
  assert.ok((await page.locator('#contact-message').inputValue()).length > 0);
  await click(control('home'));
  await click(control('contact'));
  assert.equal(await page.locator('#contact-message').inputValue(), 'Verifying the contact form without sending a real inquiry.');
  await page.unroute('https://formspree.io/**');
  let submission = '';
  await page.route('https://formspree.io/**', route => { submission = route.request().postData() ?? ''; return route.fulfill({ status: 200, body: '{}' }); });
  await page.getByRole('button', { name: 'Send message' }).click();
  await page.getByText('Message sent. We’ll reply by email.').waitFor();
  assert.ok(submission.includes('Web application') && submission.includes('test@example.com'), 'The inquiry must include the selected service and contact information');
  await page.reload(); await ready(); await phase('complete');
  assert.ok(await page.locator('[data-panel="contact"]').isVisible(), 'Refresh should retain the active view');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(350);
  await page.locator('.content-workspace').evaluate(element => { element.scrollTop = 120; });
  assert.equal(await page.locator('.content-workspace').evaluate(element => element.scrollTop), 0, 'Expanded mobile sections must not scroll');
  await page.reload(); await ready(); await phase('complete');
  assert.equal(await page.locator('.content-workspace').evaluate(element => element.scrollTop), 0, 'Refresh must keep the section fitted to the viewport');

  await page.locator('#contact-message').fill('Keep this draft while moving between views.');
  await page.keyboard.press('Escape');
  await page.waitForFunction(() => document.querySelector('.content-workspace').dataset.transitioning === 'false');
  assert.equal(await page.locator('.content-workspace').getAttribute('data-content-view'), 'home', 'Escape should close the expanded topic');
  await page.goBack();
  await page.waitForFunction(() => document.querySelector('.content-workspace').dataset.contentView === 'contact' && document.querySelector('.content-workspace').dataset.transitioning === 'false');
  assert.equal(await page.locator('#contact-message').inputValue(), 'Keep this draft while moving between views.', 'Browser Back must not recreate the form');
  assert.equal(await page.locator('.scene').getAttribute('data-phase'), 'complete', 'Browser navigation must not replay the introduction');
  await page.goForward();
  await page.waitForFunction(() => document.querySelector('.content-workspace').dataset.contentView === 'home' && document.querySelector('.content-workspace').dataset.transitioning === 'false');
  await click(page.locator('.studio-preview p'));
  assert.equal(await page.locator('.content-workspace').getAttribute('data-content-view'), 'studio', 'The whole inactive card should open, not only its small label');
  const closeTarget = await page.locator('.studio-tile .tile-close').boundingBox();
  assert.ok(closeTarget.width >= 44 && closeTarget.height >= 44, 'Close controls need a comfortable touch target');
  await click(page.locator('.studio-tile .tile-close'));

  // Seed a real saved reading pause in the new document, after pagehide saves the old one.
  await page.addInitScript(() => sessionStorage.setItem('avexel-autoplay-v1', JSON.stringify({ time: 11, view: 'home', project: 0 })));
  for (const [width, height] of [[320, 568], [320, 667], [320, 844], [375, 667], [375, 844], [390, 844], [768, 900], [1024, 600], [1024, 900], [1440, 600], [1440, 900], [1440, 700], [2000, 1213]]) {
    console.log(`Checking every content composition at ${width}×${height}`);
    await page.setViewportSize({ width, height });
    await page.reload(); await ready(); await phase('annotations');
    // Extra short-screen cases exercise the real site only; intro coverage is
    // unchanged in this content-focused pass.
    if (height >= 667 && (width >= 375 || height >= 844)) await verifyCallouts();
    if (width === 390) await page.screenshot({ path: '/tmp/opencode/scene-annotations-mobile.png' });
    await click(page.locator('.demo-nav [data-skip]')); await phase('complete');
    const layout = await page.evaluate(() => ({ width: document.documentElement.scrollWidth, footer: document.querySelector('.studio-footer').getBoundingClientRect().top, panel: document.querySelector('.content-workspace').getBoundingClientRect().bottom, brokenImages: [...document.images].filter(image => image.complete && !image.naturalWidth).map(image => image.src) }));
    assert.ok(layout.width <= width && layout.panel <= layout.footer + 1, `Layout should fit ${width}×${height}`);
    assert.deepEqual(layout.brokenImages, []);
    assert.ok(await page.locator('.content-workspace').evaluate(element => element.scrollHeight <= element.clientHeight + 1), `The overview should fit without scrolling at ${width}×${height}`);
    assert.equal(await page.locator('.studio-shell').innerText().then(text => /\b0[1-4]\b/.test(text)), false, 'The real site should not contain decorative numbered lists');
    if (width === 390) await page.screenshot({ path: '/tmp/opencode/scene-final-mobile.png' });
    for (const view of ['services', 'studio', 'work', 'contact']) {
      await click(control(view));
      await page.waitForTimeout(250);
      const fits = await page.locator(`[data-panel="${view}"] .tile-inner`).evaluate(element => {
        const rect = element.getBoundingClientRect();
        return rect.left >= -1 && rect.right <= innerWidth + 1 && element.scrollWidth <= element.clientWidth + 1 && element.scrollHeight <= element.clientHeight + 1;
      });
      assert.ok(fits, `${view} content must fit at ${width}×${height}`);
      assert.ok(await page.locator('.content-workspace').evaluate(element => element.scrollHeight <= element.clientHeight + 1), 'The entire composition must fit without scrolling');
      if (view === 'services') {
        for (const service of ['design', 'development', 'maintenance']) {
          await click(page.locator(`[data-service-tab="${service}"]`));
          assert.ok(await page.locator('.services-tile .tile-inner').evaluate(element => element.scrollHeight <= element.clientHeight + 1), `${service} content must fit without scrolling at ${width}×${height}`);
        }
      }
      if (view === 'studio' && width >= 768) {
        const intro = await page.locator('.studio-introduction').evaluate(element => {
          const first = element.querySelector('strong');
          const second = element.querySelector('.locale');
          const a = first.getBoundingClientRect(), b = second.getBoundingClientRect();
          return { sameLine: Math.abs(a.top - b.top) < 1 && b.left >= a.right,
            sameStyle: ['fontSize', 'fontWeight', 'color', 'textShadow'].every(key => getComputedStyle(first)[key] === getComputedStyle(second)[key]),
            names: [first.style.viewTransitionName, second.style.viewTransitionName] };
        });
        assert.ok(intro.sameLine && intro.sameStyle, 'Focused Studio intro must be one line in the quieter subtitle style');
        assert.equal(new Set(intro.names).size, 2, 'Studio phrases must move as independently named layers');
      }
      if (view === 'contact') {
        const insets = await page.locator('.inquiry-submit').evaluate(element => {
          const button = element.getBoundingClientRect();
          const card = element.closest('.contact-tile').getBoundingClientRect();
          return { left: button.left - card.left, right: card.right - button.right, bottom: card.bottom - button.bottom };
        });
        assert.ok(Math.abs(insets.bottom - insets.left) < 1 && Math.abs(insets.bottom - insets.right) < 1, 'Send message must have matching bottom and side spacing');
        if (width >= 768) assert.ok(await page.locator('.studio-preview').isVisible(), 'The collapsed Studio summary must remain visible beside Contact');
        const borders = await page.locator('.inquiry-submit').evaluate(element => {
          const style = getComputedStyle(element);
          return ['Top', 'Right', 'Bottom', 'Left'].map(side => `${style[`border${side}Width`]} ${style[`border${side}Style`]} ${style[`border${side}Color`]}`);
        });
        assert.equal(new Set(borders).size, 1, 'Send message must have the same border on every edge');
        await page.locator('#contact-service').click();
        const menu = await page.locator('[role="listbox"]').boundingBox();
        const card = await page.locator('.contact-tile').boundingBox();
        assert.ok(menu.y >= card.y && menu.y + menu.height <= card.y + card.height, 'The custom dropdown must fit inside Contact without clipping');
        await page.keyboard.press('Escape');
      }
      const filledPreview = await page.locator('[data-project]:not([hidden]) .work-image img').evaluate(image => {
        const frame = image.parentElement.getBoundingClientRect();
        const rect = image.getBoundingClientRect();
        if (!rect.width || !rect.height) return true;
        return getComputedStyle(image).objectFit === 'cover' && Math.abs(rect.width - frame.width) <= 2.1 && Math.abs(rect.height - frame.height) <= 2.1;
      });
      assert.ok(filledPreview, `Visible Work previews must fill their window in ${view} at ${width}×${height}`);
      const clippedSummaries = await page.locator('.content-tile:not([data-expanded=true]) .tile-inner').evaluateAll(elements => elements.filter(element => element.scrollHeight > element.clientHeight + 1 || element.scrollWidth > element.clientWidth + 1).map(element => element.closest('[data-panel]').dataset.panel));
      assert.deepEqual(clippedSummaries, [], `Collapsed content must have room at ${width}×${height} in ${view}`);
      if (view === 'work') {
        const preview = await page.locator('[data-project]:not([hidden]) .work-image').boundingBox();
        assert.ok(Math.abs(preview.width / preview.height - 1.44) < .02, 'Expanded screenshots must keep their complete, readable aspect ratio');
        assert.equal(await page.locator('[data-project]:not([hidden]) .work-image img').evaluate(image => getComputedStyle(image).objectFit), 'cover', 'Project screenshots must fill their frame, not sit inside letterboxing');
      }
      assert.equal(await page.locator('.identity-description').isVisible(), false, 'Both home descriptions disappear in expanded views');
      const overlaps = await page.locator('[data-layout-piece]').evaluateAll(elements => elements.flatMap((element, index) => {
        const a = element.getBoundingClientRect();
        return elements.slice(index + 1).filter(other => { const b = other.getBoundingClientRect(); return a.left < b.right - 1 && a.right > b.left + 1 && a.top < b.bottom - 1 && a.bottom > b.top + 1; }).map(other => `${element.dataset.panel}/${other.dataset.panel}`);
      }));
      assert.deepEqual(overlaps, [], 'Settled content pieces must not overlap');
      assert.equal(await page.locator('[data-tile-detail]:not([hidden])').count(), 1);
      if (width === 390 || width === 1440 && height === 900) await page.screenshot({ path: `/tmp/opencode/content-${view}-${width}.png` });
      await click(page.locator(`[data-panel="${view}"] .tile-close`));
      assert.equal(await page.locator('.content-workspace').getAttribute('data-content-view'), 'home', 'Closing a topic should restore the overview composition');
    }
  }
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(base); await ready(); await phase('complete');
  assert.equal(await page.locator('.real-site').evaluate(element => element.inert), false);
  for (const colorScheme of ['light', 'dark']) {
    await page.emulateMedia({ colorScheme });
    assert.equal(await page.locator('.studio-shell').evaluate(element => getComputedStyle(element).backgroundColor), 'rgb(0, 0, 0)');
  }
  await page.goto(`${base}/communications/`);
  assert.ok(await page.locator('.site-header').isVisible());
  const fallback = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  await fallback.addInitScript(() => {
    HTMLCanvasElement.prototype.transferControlToOffscreen = undefined;
    const nativeContext = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function(type, ...args) {
      if (type === 'webgl' || type === 'webgl2' || type === 'experimental-webgl') return null;
      return nativeContext.call(this, type, ...args);
    };
  });
  await fallback.goto(`${base}/#home`);
  await fallback.locator('.scene[data-phase="complete"]').waitFor();
  await control('services', fallback).click();
  assert.ok(await fallback.locator('[data-panel="services"]').isVisible(), 'The complete website must still work without WebGL');
  await control('contact', fallback).click();
  assert.ok(await fallback.locator('#contact-name').isVisible());
  await fallback.close();
  const bootPage = await browser.newPage();
  await bootPage.goto(`${base}/#services`);
  await bootPage.locator('.scroll-story[data-ready=true]').waitFor();
  let releaseScripts;
  const scriptsHeld = new Promise(resolve => { releaseScripts = resolve; });
  await bootPage.route('**/_astro/*.js', async route => { await scriptsHeld; await route.continue(); });
  await bootPage.reload({ waitUntil: 'commit' });
  await bootPage.locator('.scene').waitFor({ state: 'attached' });
  assert.equal(await bootPage.locator('.scene').evaluate(element => getComputedStyle(element).visibility), 'hidden', 'The synchronous head guard must hide the default scene even while JavaScript is delayed');
  releaseScripts();
  await bootPage.locator('.scroll-story[data-ready=true]').waitFor();
  assert.equal(await bootPage.locator('.scene').getAttribute('data-phase'), 'complete');
  assert.equal(await bootPage.locator('.content-workspace').getAttribute('data-content-view'), 'services');
  await bootPage.close();
  for (const view of ['home', 'studio', 'work', 'contact']) {
    const hoverPage = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await hoverPage.addInitScript(() => localStorage.setItem('avexel-theme', 'dark'));
    await hoverPage.goto(`${base}/#${view}`);
    await hoverPage.locator('.scroll-story[data-ready=true]').waitFor();
    const arrows = hoverPage.locator('.studio-shell .icon[data-icon="arrowUpRight"]');
    for (const arrow of await arrows.all()) {
      if (!await arrow.isVisible()) continue;
      const target = arrow.locator('xpath=ancestor::*[self::a or self::button][1]');
      if (!await target.count() || await target.isDisabled()) continue;
      await hoverPage.mouse.move(0, 0);
      await target.hover();
      const rotation = await arrow.evaluate(async element => {
        await new Promise(requestAnimationFrame);
        const motion = element.getAnimations().find(animation => animation instanceof CSSTransition && animation.transitionProperty === 'transform');
        if (!motion) return null;
        motion.pause(); motion.currentTime = Number(motion.effect.getTiming().duration) / 2;
        const angle = () => { const matrix = new DOMMatrix(getComputedStyle(element).transform); return Math.atan2(matrix.b, matrix.a) * 180 / Math.PI; };
        const middle = angle(); motion.finish();
        return { middle, end: angle() };
      });
      assert.ok(rotation && rotation.middle > 0 && rotation.middle < 45, `${view}: diagonal arrows must rotate through intermediate angles, not teleport`);
      assert.ok(Math.abs(rotation.end - 45) < .01, `${view}: hovered arrow should point right`);
      await hoverPage.mouse.move(0, 0);
      await arrow.evaluate(async element => {
        await new Promise(requestAnimationFrame);
        element.getAnimations().forEach(animation => animation.finish());
      });
    }
    if (view === 'contact') {
      const submit = hoverPage.locator('.inquiry-submit');
      await hoverPage.mouse.move(0, 0);
      const restingShadow = await submit.evaluate(element => getComputedStyle(element).boxShadow);
      assert.ok(restingShadow.includes('inset'), 'The submit button keeps its uniform inner edge');
      const bounds = await submit.boundingBox();
      await hoverPage.mouse.move(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2);
      await hoverPage.waitForTimeout(350);
      const hoverShadow = await submit.evaluate(element => getComputedStyle(element).boxShadow);
      assert.notEqual(restingShadow, hoverShadow, 'The submit button glow should strengthen on hover');
      assert.ok(hoverShadow.includes('20px') && hoverShadow.includes('48px'), 'Hover should add a soft outer glow');
      await hoverPage.mouse.move(0, 0);
    }
    if (view === 'home') {
      const logo = hoverPage.locator('.identity-wordmark > img');
      await logo.evaluate(image => image.decode());
      const bounds = await logo.boundingBox();
      const image = pngPixels(await hoverPage.screenshot());
      const logoPixel = (x, y) => {
        const offset = (Math.floor(bounds.y + y / 500 * bounds.height) * image.width + Math.floor(bounds.x + x / 500 * bounds.width)) * image.channels;
        return [...image.data.subarray(offset, offset + 3)];
      };
      for (const [x, y] of [[250, 95], [250, 205], [250, 395]]) assert.deepEqual(logoPixel(x, y), [0, 0, 0], 'The logo’s interior gaps must remain black, even with the exterior glow');
      assert.ok(logoPixel(25, 250).some(channel => channel > 0), 'The logo should still glow outside its silhouette');
      const materials = await hoverPage.locator('.tile-material').evaluateAll(elements => elements.map(element => getComputedStyle(element).backgroundColor));
      assert.equal(new Set(materials).size, 1, 'Every card, including Contact, must use the same glass background');
      assert.equal(await hoverPage.locator('.identity-wordmark > span').evaluate(element => getComputedStyle(element).color), 'rgb(197, 138, 255)', 'The main brand purple must be #C58AFF');
      const wordmark = hoverPage.locator('.identity-wordmark > span > svg');
      assert.ok(await wordmark.isVisible(), 'The wordmark must use the actual CAD letterforms, not a substituted font');
      assert.equal(await wordmark.getAttribute('viewBox'), '0 0 4435.20393 1000', 'Preserve the exported sketch proportions');
      const mark = pngPixels(await wordmark.screenshot());
      const counterOffset = (Math.round(.5 * (mark.height - 1)) * mark.width + Math.round(.1031 * (mark.width - 1))) * mark.channels;
      const counter = [...mark.data.subarray(counterOffset, counterOffset + 3)];
      assert.ok(counter[2] > 60 && counter[2] > counter[0], 'The A counter must hold glow, not read as a black gap like the logo');
      for (const selector of ['.identity-wordmark > span', '.service-label']) {
        assert.equal(await hoverPage.locator(selector).first().evaluate(element => getComputedStyle(element).backgroundImage), 'none', 'Brand typography should glow without gradients');
      }
    }
    await hoverPage.close();
  }
  assert.deepEqual(errors, []);
  console.log('Passed: viewport-fitted sections at 320–2000px, visible service terms, student-led studio copy, text project selector, custom contact selector, full-aspect previews, native transitions, Replay, refresh restoration, contact success/error, reduced motion, and client guide.');
} finally { await browser.close(); }
