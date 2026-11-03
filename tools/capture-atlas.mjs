import assert from 'node:assert/strict';
import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import sharp from 'sharp';

// Capture both themes from one loaded page so viewport, fonts, data, and crop match.
const browser = await chromium.launch();
try {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
    deviceScaleFactor: 1,
    colorScheme: 'light',
    reducedMotion: 'reduce',
  });
  await page.goto('https://atlas.frc7790.com/');
  await page.getByPlaceholder('Team or event').waitFor();
  await page.getByRole('link', { name: /HighTide/ }).waitFor();
  await page.getByRole('heading', { name: /Up next|Happening now/ }).waitFor();
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all([...document.images].map(image => image.decode()));
  });

  const captures = [];
  let reference;
  for (const theme of ['light', 'dark']) {
    await page.emulateMedia({ colorScheme: theme });
    await page.waitForFunction(theme => document.documentElement.dataset.theme === theme, theme);
    const screenshot = await page.screenshot({ animations: 'disabled' });
    const layout = await page.locator('body').evaluate(body => [...body.querySelectorAll('*')]
      .filter(element => element.getBoundingClientRect().width && element.getBoundingClientRect().height)
      .map(element => ({
        tag: element.tagName,
        text: element.children.length ? null : element.textContent,
        bounds: element.getBoundingClientRect().toJSON(),
      })));
    if (reference) assert.deepEqual(layout, reference, 'Atlas theme captures must have identical content and layout');
    else reference = layout;

    for (const width of [1440, 800, 400]) {
      const suffix = width === 1440 ? '' : `-${width}`;
      const filename = `work-atlas${theme === 'light' ? '-light' : ''}${suffix}.webp`;
      const image = await sharp(screenshot).resize({ width }).webp({ quality: 85 }).toBuffer();
      captures.push({ filename, image });
    }
  }
  // Validate the pair before replacing any of the published assets.
  for (const { filename, image } of captures) {
    await writeFile(fileURLToPath(new URL(`../public/images/${filename}`, import.meta.url)), image);
  }
  console.log('Captured six Atlas images with identical content and layout in light and dark mode.');
} finally {
  await browser.close();
}
