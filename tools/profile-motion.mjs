import { chromium } from 'playwright';

// Real-time motion probe, not the paused/seeked continuity test. Headless frame
// cadence is machine-dependent; compare the same viewport/DPR on the same host.
const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: Number(process.env.CHECK_DPR ?? 2) });
  await page.goto(`${process.env.CHECK_URL ?? 'http://localhost:4333'}/#home`);
  await page.locator('.scroll-story[data-ready=true]').waitFor();
  if (process.env.PROFILE_CSS) await page.addStyleTag({ content: process.env.PROFILE_CSS });
  const client = await page.context().newCDPSession(page);
  await client.send('Performance.enable');
  const before = (await client.send('Performance.getMetrics')).metrics;
  await page.evaluate(() => {
    window.motionFrames = [];
    let previous;
    const tick = now => {
      if (previous !== undefined) window.motionFrames.push(now - previous);
      previous = now;
      window.motionFrame = requestAnimationFrame(tick);
    };
    window.motionFrame = requestAnimationFrame(tick);
  });
  for (const view of ['services', 'studio', 'work', 'contact', 'home']) {
    await page.locator(view === 'home' ? '.identity-wordmark' : `[data-panel="${view}"] .tile-heading h2 button`).dispatchEvent('click');
    await page.waitForFunction(() => document.querySelector('.content-workspace').dataset.transitioning === 'false');
  }
  const after = (await client.send('Performance.getMetrics')).metrics;
  const frames = await page.evaluate(() => {
    cancelAnimationFrame(window.motionFrame);
    const frames = window.motionFrames.sort((a, b) => a - b);
    return { count: frames.length, medianMs: frames[Math.floor(frames.length / 2)], over50ms: frames.filter(time => time > 50).length, maximumMs: frames.at(-1) };
  });
  console.log(JSON.stringify({ frames, mainThread: Object.fromEntries(after.filter(metric => ['LayoutDuration', 'RecalcStyleDuration', 'TaskDuration', 'LayoutCount'].includes(metric.name)).map(metric => [metric.name, metric.value - before.find(item => item.name === metric.name).value])) }, null, 2));
} finally { await browser.close(); }
