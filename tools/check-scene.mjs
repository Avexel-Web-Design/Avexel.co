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
  await scrollTo(.35);
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
  for (const width of [320, 375, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: width < 768 ? 844 : 900 });
    await page.waitForTimeout(250);
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
  console.log('Scene checks passed: word choreography, scroll restoration, project switching, view restoration, contact success/error, 320–1440px layouts, reduced motion, and client guide.');
} finally { await browser.close(); }
