import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Observer } from 'gsap/Observer';

gsap.registerPlugin(ScrollTrigger, Observer);
history.scrollRestoration = 'manual';

const story = document.querySelector<HTMLElement>('.scroll-story');
const scene = document.querySelector<HTMLElement>('.scene');
const realSite = document.querySelector<HTMLElement>('.real-site');
if (realSite) realSite.inert = true;
const canvas = document.querySelector<HTMLCanvasElement>('.eraser-canvas');
const chapter = document.querySelector<HTMLElement>('.story-chapter');
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
const panels = [...document.querySelectorAll<HTMLElement>('[data-panel]')];
const viewButtons = [...document.querySelectorAll<HTMLButtonElement>('[data-view]')];
const projectButtons = [...document.querySelectorAll<HTMLButtonElement>('[data-select-project]')];
const projects = [...document.querySelectorAll<HTMLElement>('[data-project]')];
let timeline: gsap.core.Timeline | undefined;
let width = 0;
let height = 0;
let restored = false;
let isRevealed = false;
const eraseState = { progress: 0 };
const storageKey = 'avexel-scene-v1';
let selectedView = 'work';
let selectedProject = 0;
let scrollTarget = 0;
let dampingActive = false;

function stopDamping() {
  dampingActive = false;
  scrollTarget = window.scrollY;
}

function dampScroll(delta: number) {
  if (!story || !scene || reduce.matches || !restored) return;
  const current = window.scrollY;
  if (!dampingActive || Math.sign(delta) !== Math.sign(scrollTarget - current)) scrollTarget = current;
  const max = story.offsetHeight - scene.clientHeight;
  // Limit both speed and queued distance: a fling cannot queue the whole film.
  scrollTarget = gsap.utils.clamp(0, max, gsap.utils.clamp(current - height * .7, current + height * .7, scrollTarget + gsap.utils.clamp(-height * .35, height * .35, delta * .55)));
  dampingActive = true;
}

gsap.ticker.add((_time, deltaMs) => {
  if (!dampingActive || reduce.matches) return;
  const current = window.scrollY;
  const distance = scrollTarget - current;
  if (Math.abs(distance) < 1) { window.scrollTo(0, scrollTarget); stopDamping(); return; }
  const dt = Math.min(deltaMs / 1000, .05);
  const step = gsap.utils.clamp(-height * .8 * dt, height * .8 * dt, distance * (1 - Math.exp(-dt * 7)));
  // Keep subpixel remainders in the destination; browsers round actual scroll positions.
  window.scrollTo(0, current + Math.sign(step) * Math.max(1, Math.abs(step)));
});

if (scene) Observer.create({
  target: scene, type: 'wheel,touch', preventDefault: true, allowClicks: true,
  ignoreCheck: event => reduce.matches || Boolean(event && 'ctrlKey' in event && event.ctrlKey) || Boolean(event?.target instanceof Element && event.target.closest('.studio-view, .contact-view, input, textarea, select')),
  onChangeY: self => dampScroll(self.event.type.startsWith('touch') ? -self.deltaY : self.deltaY),
});

document.addEventListener('keydown', event => {
  if (reduce.matches || event.ctrlKey || event.metaKey || event.altKey || event.target instanceof HTMLElement && event.target.closest('input,textarea,select,button,[contenteditable="true"],.studio-view,.contact-view')) return;
  const delta = new Map([['ArrowDown', 110], ['ArrowUp', -110], ['PageDown', height * .65], ['PageUp', -height * .65], [' ', height * (event.shiftKey ? -.65 : .65)]]).get(event.key);
  if (delta === undefined) return;
  event.preventDefault();
  dampScroll(delta);
});

function positionAnnotations() {
  if (!scene) return;
  const origin = scene.getBoundingClientRect();
  document.querySelectorAll<HTMLElement>('[data-note]').forEach(note => {
    const target = document.querySelector<HTMLElement>(note.dataset.target ?? '');
    const connector = document.querySelector<SVGGElement>(`[data-connector="${note.dataset.note}"]`);
    if (!target || !connector) return;
    const label = note.getBoundingClientRect();
    const rect = target.getBoundingClientRect();
    if (!label.width || !rect.width || !rect.height) { connector.style.display = 'none'; return; }
    connector.style.display = '';
    const labelX = label.left + label.width / 2;
    const labelY = label.top + label.height / 2;
    const endX = gsap.utils.clamp(rect.left + 2, rect.right - 2, labelX);
    const endY = note.dataset.note === 'brand' ? rect.bottom - 6 : gsap.utils.clamp(rect.top + 2, rect.bottom - 2, labelY);
    const startX = gsap.utils.clamp(label.left, label.right, endX);
    const startY = gsap.utils.clamp(label.top, label.bottom, endY);
    connector.querySelector('path')?.setAttribute('d', `M ${startX - origin.left} ${startY - origin.top} L ${endX - origin.left} ${endY - origin.top}`);
    const dot = connector.querySelector('circle');
    dot?.setAttribute('cx', String(endX - origin.left));
    dot?.setAttribute('cy', String(endY - origin.top));
  });
}

function showView(view: string, focus = false) {
  if (!panels.some(panel => panel.dataset.panel === view)) return;
  selectedView = view;
  panels.forEach(panel => { panel.hidden = panel.dataset.panel !== view; });
  viewButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.view === view)));
  if (focus) {
    const panel = panels.find(item => item.dataset.panel === view);
    if (panel && !reduce.matches) gsap.fromTo(panel, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: .3, ease: 'power2.out', clearProps: 'transform,opacity' });
    panel?.setAttribute('tabindex', '-1');
    panel?.focus({ preventScroll: true });
  }
}

function showProject(index: number) {
  selectedProject = index;
  projects.forEach((project, i) => { project.hidden = i !== index; });
  projectButtons.forEach((button, i) => button.setAttribute('aria-pressed', String(i === index)));
  const project = projects[index];
  if (restored && project && !reduce.matches) gsap.fromTo(project, { opacity: .3, y: 8 }, { opacity: 1, y: 0, duration: .3, ease: 'power2.out', clearProps: 'transform,opacity' });
}

viewButtons.forEach(button => button.addEventListener('click', () => {
  const view = button.dataset.view ?? 'work';
  showView(view, true);
  history.replaceState(null, '', view === 'work' ? location.pathname : `#${view}`);
  savePosition();
}));
projectButtons.forEach((button, i) => button.addEventListener('click', () => { showProject(i); savePosition(); }));

// The canvas draws the swept area of a zig-zag eraser, not a crossfade.
// Parallel diagonal passes cover the screen, starting at the upper-left corner.
function erasePoints() {
  const points: { x: number; y: number }[] = [];
  const reach = Math.max(width, height) * 1.6;
  const band = Math.max(90, Math.min(width, height) * .19);
  for (let sum = -band; sum <= width + height + band * 2; sum += band * .72) {
    const a = { x: Math.max(-band, sum - height - band), y: Math.min(height + band, sum + band) };
    const b = { x: Math.min(width + band, sum + band), y: Math.max(-band, sum - width - band) };
    if (Math.abs(a.x - b.x) > reach * 2) continue;
    if (points.length % 4 === 0) points.push(a, b);
    else points.push(b, a);
  }
  return { points, band };
}

function drawErase(progress: number) {
  const context = canvas?.getContext('2d');
  if (!context || !width || !height) return;
  context.clearRect(0, 0, width, height);
  if (progress <= 0) return;
  if (progress >= 1) { context.fillStyle = '#fff'; context.fillRect(0, 0, width, height); return; }
  const { points, band } = erasePoints();
  const lengths = points.slice(1).map((point, i) => Math.hypot(point.x - points[i].x, point.y - points[i].y));
  let remaining = lengths.reduce((sum, length) => sum + length, 0) * progress;
  context.beginPath();
  context.moveTo(points[0].x, points[0].y);
  let tip = points[0];
  for (let i = 0; i < lengths.length; i++) {
    const ratio = Math.min(1, remaining / lengths[i]);
    tip = { x: points[i].x + (points[i + 1].x - points[i].x) * ratio, y: points[i].y + (points[i + 1].y - points[i].y) * ratio };
    context.lineTo(tip.x, tip.y);
    remaining -= lengths[i];
    if (remaining <= 0) break;
  }
  context.strokeStyle = '#fff';
  context.lineWidth = band * 1.55;
  context.lineCap = 'round';
  context.lineJoin = 'round';
  context.stroke();
}

function setRevealed(value: boolean) {
  if (isRevealed === value && realSite?.inert === !value) return;
  isRevealed = value;
  if (realSite) realSite.inert = !value;
  const demo = document.querySelector<HTMLElement>('.demo-page');
  if (demo) demo.inert = value;
}

function savePosition() {
  if (!restored) return;
  try { sessionStorage.setItem(storageKey, JSON.stringify({ progress: timeline?.scrollTrigger?.progress ?? 1, view: selectedView, project: selectedProject, y: window.scrollY })); } catch { /* Storage can be unavailable in private browsing. */ }
}

function buildTimeline() {
  if (!story || !scene || !realSite || !canvas) return;
  const oldProgress = timeline?.scrollTrigger?.progress ?? 0;
  stopDamping();
  timeline?.scrollTrigger?.kill();
  timeline?.revert();
  width = scene.clientWidth;
  height = scene.clientHeight;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  canvas.getContext('2d')?.scale(dpr, dpr);
  positionAnnotations();
  if (reduce.matches) {
    gsap.set(realSite, { clipPath: 'none' });
    setRevealed(true);
    return;
  }
  eraseState.progress = 0;
  drawErase(0);
  gsap.set('.statement', { opacity: 0, y: height * .65 });
  gsap.set('.annotations .annotation', { opacity: 0 });
  gsap.set('.annotation-connectors g', { opacity: 0 });
  gsap.set(realSite, { clipPath: 'inset(0 0 100% 0)' });
  timeline = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: {
    trigger: story, start: 'top top', end: 'bottom bottom', scrub: true,
    onUpdate: trigger => {
      setRevealed(trigger.progress >= .985);
      const demo = document.querySelector<HTMLElement>('.demo-page');
      const controls = document.querySelector<HTMLElement>('.story-controls');
      if (demo) demo.inert = trigger.progress > .6;
      if (controls) controls.inert = trigger.progress > .62;
      if (chapter) chapter.textContent = trigger.progress < .12 ? 'THE DEFAULT' : trigger.progress < .46 ? 'THE REALIZATION' : trigger.progress < .65 ? 'THE TEARDOWN' : trigger.progress < .87 ? 'A CLEAN SLATE' : 'A POINT OF VIEW';
      gsap.set('.story-track span', { scaleX: trigger.progress });
      savePosition();
    },
  } });
  timeline.to({}, { duration: .6 })
    .to('.line-one', { opacity: 1, y: 0, duration: .8, ease: 'power2.out' }, .6)
    .to('.demo-page', { opacity: .3, duration: .7 }, .6)
    .to('.line-two', { opacity: 1, y: 0, duration: .8, ease: 'power2.out' }, 1.5)
    .to('.discard-one,.discard-two', { opacity: 0, duration: .4 }, 2.7)
    .to('.keep-work', { x: () => mergedPosition('.keep-work', 0), y: () => mergeY('.keep-work'), duration: .75, ease: 'power2.inOut' }, 3)
    .to('.keep-is', { x: () => mergedPosition('.keep-is', 1), y: () => mergeY('.keep-is'), duration: .75, ease: 'power2.inOut' }, 3)
    .to('.keep-not', { x: () => mergedPosition('.keep-not', 2), y: () => mergeY('.keep-not'), duration: .75, ease: 'power2.inOut' }, 3)
    .to('.keep-slop', { x: () => mergedPosition('.keep-slop', 3), y: () => mergeY('.keep-slop'), duration: .75, ease: 'power2.inOut' }, 3)
    .to('.intervention', { opacity: 0, y: -30, duration: .5 }, 4.5)
    .to('.demo-page', { opacity: 1, duration: .5 }, 4.5)
    .to(eraseState, { progress: 1, duration: 2.4, onUpdate: () => drawErase(eraseState.progress) }, 6.8)
    .to('.story-controls', { opacity: 0, duration: .2 }, 6.5)
    .to(realSite, { clipPath: 'inset(0 0 0% 0)', duration: 1.25 }, 9.5)
    .to({}, { duration: .2 });
  document.querySelectorAll<HTMLElement>('[data-note]').forEach((note, index) => {
    const connector = document.querySelector(`[data-connector="${note.dataset.note}"]`);
    timeline?.to(connector ? [note, connector] : note, { opacity: 1, duration: .25 }, 4.9 + index * .09);
  });
  timeline.scrollTrigger?.refresh();
  if (restored && oldProgress > 0) window.scrollTo(0, oldProgress * (story.offsetHeight - height));
}

// Measure the original glyph positions to bring the actual words together.
// Spaces are explicit so the final phrase reads “Our work isn’t AI slop.”
function mergedPosition(selector: string, index: number) {
  const selectors = ['.keep-work', '.keep-is', '.keep-not', '.keep-slop'];
  const elements = selectors.map(item => document.querySelector<HTMLElement>(item)!);
  const widths = elements.map(element => element.offsetWidth);
  const space = (parseFloat(getComputedStyle(elements[0]).fontSize) || 50) * .23;
  const total = widths.reduce((sum, item) => sum + item, 0) + space * 2;
  const before = widths.slice(0, index).reduce((sum, item) => sum + item, 0) + (index > 0 ? space : 0) + (index > 2 ? space : 0);
  const element = document.querySelector<HTMLElement>(selector)!;
  const rect = element.getBoundingClientRect();
  return (width - total) / 2 + before - rect.left + Number(gsap.getProperty(element, 'x'));
}

function mergeY(selector: string) {
  const element = document.querySelector<HTMLElement>(selector)!;
  const rect = element.getBoundingClientRect();
  return height / 2 - (rect.top + rect.height / 2) + Number(gsap.getProperty(element, 'y'));
}

function goToEnd() {
  if (!story) return;
  stopDamping();
  window.scrollTo({ top: story.offsetHeight - (scene?.clientHeight ?? window.innerHeight), behavior: 'instant' });
  setRevealed(true);
  showView('work', true);
}

document.querySelectorAll('[data-skip]').forEach(button => button.addEventListener('click', goToEnd));
document.querySelectorAll('[data-replay]').forEach(button => button.addEventListener('click', event => {
  event.preventDefault();
  if (reduce.matches) return;
  stopDamping();
  history.replaceState(null, '', location.pathname);
  window.scrollTo({ top: 0, behavior: 'instant' });
  setRevealed(false);
  document.querySelector<HTMLButtonElement>('[data-skip]')?.focus({ preventScroll: true });
}));

const pageLoaded = new Promise<void>(resolve => {
  if (document.readyState === 'complete') resolve();
  else window.addEventListener('load', () => resolve(), { once: true });
});

void Promise.all([document.fonts.ready, pageLoaded]).then(() => {
  buildTimeline();
  const hashViews = new Map([['#contact', 'contact'], ['#studio', 'studio'], ['#about', 'studio'], ['#services', 'studio'], ['#work', 'work']]);
  const hashView = hashViews.get(location.hash);
  let saved: { progress?: number; view?: string; project?: number } | undefined;
  try { saved = JSON.parse(sessionStorage.getItem(storageKey) ?? 'null'); } catch { /* Start at the beginning when storage is unavailable. */ }
  const navigation = performance.getEntriesByType('navigation')[0];
  const shouldRestore = navigation instanceof PerformanceNavigationTiming && (navigation.type === 'reload' || navigation.type === 'back_forward');
  if (shouldRestore && saved) {
    if (saved.view) showView(saved.view);
    if (Number.isInteger(saved.project) && saved.project! >= 0 && saved.project! < projects.length) showProject(saved.project!);
    if (!reduce.matches && story) window.scrollTo(0, (saved.progress ?? 0) * (story.offsetHeight - (scene?.clientHeight ?? window.innerHeight)));
  } else if (hashView) { goToEnd(); showView(hashView); }
  requestAnimationFrame(() => {
    // ScrollTrigger's load refresh completes before the persisted position is applied.
    if (shouldRestore && saved && !reduce.matches && story) window.scrollTo(0, (saved.progress ?? 0) * (story.offsetHeight - (scene?.clientHeight ?? window.innerHeight)));
    ScrollTrigger.update();
    restored = true;
    if (story) story.dataset.ready = 'true';
    savePosition();
  });
});

let resizeTimer: number;
let previousWidth = window.innerWidth;
window.addEventListener('resize', () => {
  // Ignore mobile browser chrome height changes; svh keeps the scene stable.
  if (window.innerWidth === previousWidth && window.matchMedia('(max-width: 767px)').matches) return;
  previousWidth = window.innerWidth;
  clearTimeout(resizeTimer);
  resizeTimer = window.setTimeout(buildTimeline, 150);
});
reduce.addEventListener('change', buildTimeline);
window.addEventListener('pagehide', savePosition);
window.addEventListener('hashchange', () => {
  const view = location.hash.slice(1);
  if (['work', 'studio', 'contact'].includes(view)) { goToEnd(); showView(view); }
});
