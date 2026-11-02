import { gsap } from 'gsap';
import { layoutAnnotations } from './annotations';
import { arrangeContent, morphContent } from './content-layout';
import './service-select';

const story = document.querySelector<HTMLElement>('.scroll-story');
const scene = document.querySelector<HTMLElement>('.scene');
const realSite = document.querySelector<HTMLElement>('.real-site');
const canvas = document.querySelector<HTMLCanvasElement>('.eraser-canvas');
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
const panels = [...document.querySelectorAll<HTMLElement>('[data-panel]')];
const viewButtons = [...document.querySelectorAll<HTMLButtonElement>('[data-view]')];
const projectButtons = [...document.querySelectorAll<HTMLButtonElement>('[data-select-project]')];
const projects = [...document.querySelectorAll<HTMLElement>('[data-project]')];
const storageKey = 'avexel-autoplay-v1';
const eraseState = { progress: 0 };
let timeline: gsap.core.Timeline | undefined;
let fastPlayback: gsap.core.Tween | undefined;
let replayWipe: gsap.core.Tween | undefined;
let replaying = false;
let playbackMode = 'playing';
let width = 0;
let height = 0;
let ready = false;
let lastSaved = 0;
let selectedView = 'home';
let selectedProject = 0;
let selectedService = 'design';
let pausedForVisibility = false;

if (realSite) realSite.inert = true;

// The CSS compatibility pass can retain only the WebKit-prefixed declaration.
// Set the standard property too so current Chromium gets the same glass effect.
const reducedTransparency = window.matchMedia('(prefers-reduced-transparency: reduce)');
function updateGlass() {
  realSite?.querySelectorAll<HTMLElement>('.glass-surface').forEach(element => {
    element.style.backdropFilter = reducedTransparency.matches ? 'none' : 'blur(24px)';
  });
}
updateGlass();
reducedTransparency.addEventListener('change', updateGlass);

function showView(view: string, focus = false) {
  if (!panels.some(panel => panel.dataset.panel === view)) return;
  const next = panels.find(panel => panel.dataset.panel === view)!;
  selectedView = view;
  arrangeContent(view, focus, () => {
    if (focus) {
      const heading = next.querySelector<HTMLElement>('h2');
      heading?.setAttribute('tabindex', '-1');
      heading?.focus({ preventScroll: true });
    }
    if (view === 'work') projects.forEach((_, index) => warmProject(index));
    savePosition();
  });
}

function navigateView(view: string) {
  if (view === selectedView) return;
  showView(view, true);
  history.pushState({ view }, '', view === 'home' ? location.pathname : `#${view}`);
  savePosition();
}

function showProject(index: number) {
  if (selectedProject === index) return;
  selectedProject = index;
  morphContent(() => {
    projects.forEach((project, i) => { project.hidden = i !== index; });
    projectButtons.forEach((button, i) => button.setAttribute('aria-pressed', String(i === index)));
  }, ready, undefined, .36);
}

const warmedImages = new WeakSet<HTMLImageElement>();
function warmProject(index: number) {
  projects[index]?.querySelectorAll<HTMLImageElement>('img').forEach(image => {
    if (warmedImages.has(image)) return;
    warmedImages.add(image);
    image.loading = 'eager';
    // Fetch and decode on intent, before a transition needs the image texture.
    void image.decode().catch(() => { warmedImages.delete(image); });
  });
}

realSite?.querySelectorAll<HTMLButtonElement>('[data-view="work"]').forEach(button => {
  const warm = () => projects.forEach((_, index) => warmProject(index));
  button.addEventListener('pointerenter', warm);
  button.addEventListener('focus', warm);
});

viewButtons.forEach(button => button.addEventListener('click', () => {
  const view = button.dataset.view ?? 'home';
  navigateView(view);
}));
projectButtons.forEach((button, i) => {
  button.addEventListener('pointerenter', () => warmProject(i));
  button.addEventListener('focus', () => warmProject(i));
  button.addEventListener('click', () => { showProject(i); savePosition(); });
  button.addEventListener('keydown', event => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? projects.length - 1
      : (i + (event.key === 'ArrowRight' ? 1 : -1) + projects.length) % projects.length;
    showProject(next); projectButtons[next].focus({ preventScroll: true }); savePosition();
  });
});
document.querySelectorAll<HTMLAnchorElement>('.work-image').forEach(link => link.addEventListener('click', event => {
  if (selectedView === 'work' || event.ctrlKey || event.metaKey) return;
  event.preventDefault();
  navigateView('work');
}));

const serviceTabs = [...document.querySelectorAll<HTMLButtonElement>('[data-service-tab]')];
function showService(id: string, animate = false, focus = false) {
  if (!serviceTabs.some(tab => tab.dataset.serviceTab === id)) return;
  if (selectedService === id) return;
  selectedService = id;
  const update = () => {
    serviceTabs.forEach(tab => { const active = tab.dataset.serviceTab === id; tab.setAttribute('aria-selected', String(active)); tab.tabIndex = active ? 0 : -1; });
    realSite?.querySelectorAll<HTMLElement>('[data-service-panel]').forEach(panel => { panel.hidden = panel.dataset.servicePanel !== id; });
    if (focus) serviceTabs.find(tab => tab.dataset.serviceTab === id)?.focus({ preventScroll: true });
  };
  if (animate && selectedView === 'services') morphContent(update, true, undefined, .36);
  else update();
}
serviceTabs.forEach((tab, index) => {
  tab.addEventListener('click', () => {
    showService(tab.dataset.serviceTab ?? 'design', true);
    if (selectedView !== 'services') navigateView('services');
    savePosition();
  });
  tab.addEventListener('keydown', event => {
    const direction = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
    if (!direction && event.key !== 'Home' && event.key !== 'End') return;
    event.preventDefault();
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? serviceTabs.length - 1 : (index + direction + serviceTabs.length) % serviceTabs.length;
    showService(serviceTabs[next].dataset.serviceTab ?? 'design', true, true); savePosition();
  });
});

realSite?.querySelectorAll<HTMLElement>('.content-tile').forEach(card => card.addEventListener('click', event => {
  if (card.dataset.expanded === 'true' || event.button || event.ctrlKey || event.metaKey) return;
  const target = event.target;
  if (target instanceof Element && target.closest('button,a,input,select,textarea,summary')) return;
  navigateView(card.dataset.panel ?? 'home');
}));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !event.defaultPrevented && scene?.dataset.phase === 'complete' && selectedView !== 'home') {
    event.preventDefault(); navigateView('home');
  }
});

// Parallel diagonal passes erase the actual scene from its upper-left corner.
function drawErase(progress: number) {
  const context = canvas?.getContext('2d');
  if (!context || !width || !height) return;
  context.clearRect(0, 0, width, height);
  if (progress <= 0) return;
  if (progress >= 1) { context.fillStyle = '#fff'; context.fillRect(0, 0, width, height); return; }
  const points: { x: number; y: number }[] = [];
  const band = Math.max(90, Math.min(width, height) * .19);
  for (let sum = -band; sum <= width + height + band * 2; sum += band * .72) {
    const a = { x: Math.max(-band, sum - height - band), y: Math.min(height + band, sum + band) };
    const b = { x: Math.min(width + band, sum + band), y: Math.max(-band, sum - width - band) };
    if (points.length % 4 === 0) points.push(a, b);
    else points.push(b, a);
  }
  const lengths = points.slice(1).map((point, i) => Math.hypot(point.x - points[i].x, point.y - points[i].y));
  let remaining = lengths.reduce((sum, length) => sum + length, 0) * progress;
  context.beginPath();
  context.moveTo(points[0].x, points[0].y);
  for (let i = 0; i < lengths.length; i++) {
    const ratio = Math.min(1, remaining / lengths[i]);
    context.lineTo(points[i].x + (points[i + 1].x - points[i].x) * ratio, points[i].y + (points[i + 1].y - points[i].y) * ratio);
    remaining -= lengths[i];
    if (remaining <= 0) break;
  }
  context.strokeStyle = '#fff';
  context.lineWidth = band * 1.55;
  context.lineCap = 'round';
  context.lineJoin = 'round';
  context.stroke();
}

function savePosition(force = true) {
  if (!ready || !force && performance.now() - lastSaved < 200) return;
  lastSaved = performance.now();
  const workspace = document.querySelector<HTMLElement>('.content-workspace');
  const sheet = panels.find(panel => panel.dataset.panel === selectedView)?.querySelector<HTMLElement>('.tile-inner');
  try { sessionStorage.setItem(storageKey, JSON.stringify({ time: timeline?.time() ?? 18.3, view: selectedView, project: selectedProject, service: selectedService, reading: { workspace: workspace?.scrollTop ?? 0, sheet: sheet?.scrollTop ?? 0 } })); } catch { /* Storage can be unavailable in private browsing. */ }
}

function updateScene() {
  if (!scene || !realSite || replaying) return;
  const time = reduce.matches ? 18.3 : timeline?.time() ?? 0;
  const complete = time >= 18.29;
  const phase = complete ? 'complete' : time < 1.8 ? 'default' : time < 3.8 ? 'first-line' : time < 6 ? 'second-line' : time < 8.7 ? 'statement' : time < 14.5 ? 'annotations' : time < 16.85 ? 'erase' : 'reveal';
  scene.dataset.phase = phase;
  scene.dataset.playback = complete ? 'complete' : playbackMode;
  scene.dataset.time = time.toFixed(3);
  realSite.inert = !complete;
  const demo = document.querySelector<HTMLElement>('.demo-page');
  const controls = document.querySelector<HTMLElement>('.story-controls');
  if (demo) demo.inert = time >= 14.25;
  if (controls) controls.inert = time >= 14.25;
  savePosition(false);
}

function mergedPosition(selector: string, index: number) {
  const elements = ['.keep-work', '.keep-is', '.keep-not', '.keep-slop'].map(item => document.querySelector<HTMLElement>(item)!);
  const widths = elements.map(element => element.offsetWidth);
  const space = (parseFloat(getComputedStyle(elements[0]).fontSize) || 50) * .23;
  const total = widths.reduce((sum, item) => sum + item, 0) + space * 2;
  const before = widths.slice(0, index).reduce((sum, item) => sum + item, 0) + (index > 0 ? space : 0) + (index > 2 ? space : 0);
  const element = document.querySelector<HTMLElement>(selector)!;
  return (width - total) / 2 + before - element.getBoundingClientRect().left + Number(gsap.getProperty(element, 'x'));
}

function mergeY(selector: string) {
  const element = document.querySelector<HTMLElement>(selector)!;
  const rect = element.getBoundingClientRect();
  return height / 2 - (rect.top + rect.height / 2) + Number(gsap.getProperty(element, 'y'));
}

function buildTimeline() {
  if (!scene || !realSite || !canvas) return;
  replayWipe?.progress(1).kill();
  const previousTime = timeline?.time() ?? 0;
  const resume = !timeline || Boolean((!timeline.paused() || fastPlayback?.isActive()) && previousTime < timeline.duration());
  fastPlayback?.kill();
  fastPlayback = undefined;
  timeline?.revert();
  timeline = undefined;
  width = scene.clientWidth;
  height = scene.clientHeight;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  canvas.getContext('2d')?.scale(dpr, dpr);
  layoutAnnotations(scene);
  arrangeContent(selectedView);
  if (reduce.matches) { gsap.set(realSite, { '--reveal-edge': `${height + 72}px` }); updateScene(); return; }
  eraseState.progress = 0;
  drawErase(0);
  gsap.set('.statement', { opacity: 0, y: height * .65 });
  gsap.set('.annotation', { opacity: 0 });
  gsap.set(realSite, { '--reveal-edge': '0px' });
  playbackMode = 'playing';
  timeline = gsap.timeline({ paused: true, defaults: { ease: 'none' }, onUpdate: updateScene, onComplete: () => { updateScene(); savePosition(); } });
  timeline
    .addLabel('first-line', 1.8)
    .to('.line-one', { opacity: 1, y: 0, duration: .85, ease: 'power2.out' }, 'first-line')
    .to('.demo-page', { opacity: .3, duration: .7 }, 'first-line')
    .addLabel('second-line', 3.8)
    .to('.line-two', { opacity: 1, y: 0, duration: .85, ease: 'power2.out' }, 'second-line')
    .addLabel('merge', 6)
    .to('.discard-one,.discard-two', { opacity: 0, duration: .3 }, 'merge')
    .to('.keep-work', { x: () => mergedPosition('.keep-work', 0), y: () => mergeY('.keep-work'), duration: .75, ease: 'power2.inOut' }, 6.3)
    .to('.keep-is', { x: () => mergedPosition('.keep-is', 1), y: () => mergeY('.keep-is'), duration: .75, ease: 'power2.inOut' }, 6.3)
    .to('.keep-not', { x: () => mergedPosition('.keep-not', 2), y: () => mergeY('.keep-not'), duration: .75, ease: 'power2.inOut' }, 6.3)
    .to('.keep-slop', { x: () => mergedPosition('.keep-slop', 3), y: () => mergeY('.keep-slop'), duration: .75, ease: 'power2.inOut' }, 6.3)
    .addLabel('annotations', 8.7)
    .to('.intervention', { opacity: 0, y: -30, duration: .45 }, 'annotations')
    .to('.demo-page', { opacity: 1, duration: .45 }, 'annotations')
    .to('.annotation', { opacity: 1, duration: .25, stagger: .1 }, 9.1)
    .to('.story-controls', { opacity: 0, duration: .2 }, 14.25)
    .addLabel('erase', 14.5)
    .to(eraseState, { progress: 1, duration: 2.2, onUpdate: () => drawErase(eraseState.progress) }, 'erase')
    .addLabel('reveal', 16.85)
    .to(realSite, { '--reveal-edge': `${height + 72}px`, duration: 1.3 }, 'reveal')
    .to({}, { duration: .15 });
  timeline.seek(Math.min(previousTime, timeline.duration()), false);
  updateScene();
  if (ready && resume && !document.hidden) timeline.play();
}

function goToEnd(animate = false) {
  if (!timeline || reduce.matches) { updateScene(); showView('home', true); return; }
  fastPlayback?.kill();
  if (animate) {
    playbackMode = 'fast-forward';
    fastPlayback = timeline.tweenTo(timeline.duration(), { duration: Math.max(.45, (1 - timeline.progress()) * 1.8), ease: 'none', onComplete: () => { fastPlayback = undefined; updateScene(); showView('home', true); savePosition(); } });
  } else {
    timeline.pause(timeline.duration(), false);
    updateScene();
    showView('home', true);
  }
}

document.querySelectorAll('[data-skip]').forEach(button => button.addEventListener('click', () => goToEnd(true)));
document.querySelectorAll('[data-replay]').forEach(button => button.addEventListener('click', event => {
  event.preventDefault();
  if (!timeline || !realSite || !scene || reduce.matches || replaying) return;
  fastPlayback?.kill();
  history.replaceState(null, '', location.pathname);
  // Reset the intro underneath the still-visible studio, then wipe upwards.
  timeline.pause(0, false);
  replaying = true;
  realSite.inert = true;
  scene.dataset.phase = 'replay-wipe';
  scene.dataset.playback = 'wiping';
  document.querySelectorAll<HTMLElement>('.demo-page,.story-controls').forEach(element => { element.inert = true; });
  replayWipe = gsap.fromTo(realSite, { '--reveal-edge': `${height + 72}px` }, { '--reveal-edge': '0px', duration: .85, ease: 'power2.inOut', onComplete: () => {
    replayWipe = undefined;
    replaying = false;
    playbackMode = 'playing';
    showView('home');
    timeline?.play(0);
    updateScene();
    document.querySelector<HTMLButtonElement>('[data-skip]')?.focus({ preventScroll: true });
    savePosition();
  } });
}));

void document.fonts.ready.then(() => {
  buildTimeline();
  const hashViews = new Map([['#contact', 'contact'], ['#studio', 'studio'], ['#about', 'studio'], ['#services', 'services'], ['#work', 'work'], ['#brief', 'home'], ['#home', 'home']]);
  const hashView = hashViews.get(location.hash);
  let saved: { time?: number; view?: string; project?: number; service?: string; reading?: { workspace?: number; sheet?: number } } | undefined;
  try { saved = JSON.parse(sessionStorage.getItem(storageKey) ?? 'null'); } catch { /* Start at the beginning if storage is unavailable. */ }
  const navigation = performance.getEntriesByType('navigation')[0];
  const restore = navigation instanceof PerformanceNavigationTiming && (navigation.type === 'reload' || navigation.type === 'back_forward');
  if (restore && saved) {
    if (saved.view) showView(saved.view === 'brief' ? 'home' : saved.view);
    if (Number.isInteger(saved.project) && saved.project! >= 0 && saved.project! < projects.length) showProject(saved.project!);
    if (saved.service) showService(saved.service);
    const workspace = document.querySelector<HTMLElement>('.content-workspace');
    const sheet = panels.find(panel => panel.dataset.panel === selectedView)?.querySelector<HTMLElement>('.tile-inner');
    if (workspace && Number.isFinite(saved.reading?.workspace)) workspace.scrollTop = saved.reading?.workspace ?? 0;
    if (sheet && Number.isFinite(saved.reading?.sheet)) sheet.scrollTop = saved.reading?.sheet ?? 0;
    if (Number.isFinite(saved.time)) timeline?.seek(gsap.utils.clamp(0, timeline.duration(), saved.time ?? 0), false);
  } else if (hashView) { goToEnd(); showView(hashView); }
  ready = true;
  if (story) story.dataset.ready = 'true';
  updateScene();
  // The head boot guard stays in place until the saved frame and layout exist.
  document.documentElement.removeAttribute('data-scene-boot');
  if (timeline && timeline.time() < timeline.duration()) {
    if (document.hidden) pausedForVisibility = true;
    else timeline.play();
  }
  savePosition();
});

let resizeTimer: number;
let previousWidth = window.innerWidth;
window.addEventListener('resize', () => {
  if (window.innerWidth === previousWidth && window.matchMedia('(max-width: 767px)').matches) return;
  previousWidth = window.innerWidth;
  clearTimeout(resizeTimer);
  resizeTimer = window.setTimeout(buildTimeline, 150);
});
reduce.addEventListener('change', () => { buildTimeline(); showView(selectedView); });
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    pausedForVisibility = Boolean(replayWipe?.isActive() || fastPlayback?.isActive() || timeline?.isActive());
    (replayWipe ?? fastPlayback ?? timeline)?.pause();
    savePosition();
  } else if (pausedForVisibility) { pausedForVisibility = false; (replayWipe ?? fastPlayback ?? timeline)?.resume(); }
});
window.addEventListener('pagehide', () => savePosition());
document.querySelectorAll<HTMLElement>('.content-workspace,.tile-inner').forEach(element => element.addEventListener('scroll', () => savePosition(false), { passive: true }));
function restoreHistoryView() {
  const hash = location.hash.slice(1);
  const view = hash === 'about' ? 'studio' : hash === 'brief' ? 'home' : hash || 'home';
  if (!['home', 'services', 'work', 'studio', 'contact'].includes(view) || view === selectedView) return;
  if (scene?.dataset.phase !== 'complete') goToEnd();
  showView(view, true);
}
window.addEventListener('popstate', restoreHistoryView);
window.addEventListener('hashchange', restoreHistoryView);
