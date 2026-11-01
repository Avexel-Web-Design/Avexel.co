import { gsap } from 'gsap';
import { layoutAnnotations } from './annotations';
import { setStackView, warmStack } from './stack';

const story = document.querySelector<HTMLElement>('.scroll-story');
const scene = document.querySelector<HTMLElement>('.scene');
const realSite = document.querySelector<HTMLElement>('.real-site');
const canvas = document.querySelector<HTMLCanvasElement>('.eraser-canvas');
const chapter = document.querySelector<HTMLElement>('.story-chapter');
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
const panels = [...document.querySelectorAll<HTMLElement>('[data-panel]')];
const viewButtons = [...document.querySelectorAll<HTMLButtonElement>('[data-view]')];
const projectButtons = [...document.querySelectorAll<HTMLButtonElement>('[data-select-project]')];
const projects = [...document.querySelectorAll<HTMLElement>('[data-project]')];
const storageKey = 'avexel-autoplay-v1';
const eraseState = { progress: 0 };
let timeline: gsap.core.Timeline | undefined;
let fastPlayback: gsap.core.Tween | undefined;
let playbackMode = 'playing';
let width = 0;
let height = 0;
let ready = false;
let lastSaved = 0;
let selectedView = 'home';
let selectedProject = 0;
let selectedService = 'design';
let pausedForVisibility = false;
let viewTransition = 0;

if (realSite) realSite.inert = true;

// The CSS compatibility pass can retain only the WebKit-prefixed declaration.
// Set the standard property too so current Chromium gets the same glass effect.
const reducedTransparency = window.matchMedia('(prefers-reduced-transparency: reduce)');
function updateGlass() {
  realSite?.querySelectorAll<HTMLElement>('.glass-surface,.studio-header').forEach(element => {
    element.style.backdropFilter = reducedTransparency.matches ? 'none' : 'blur(24px)';
  });
}
updateGlass();
reducedTransparency.addEventListener('change', updateGlass);

function showView(view: string, focus = false) {
  if (!panels.some(panel => panel.dataset.panel === view)) return;
  const next = panels.find(panel => panel.dataset.panel === view)!;
  const previous = panels.find(panel => !panel.hidden);
  const workspace = document.querySelector<HTMLElement>('.stack-workspace');
  const generation = ++viewTransition;
  gsap.killTweensOf(panels);
  selectedView = view;
  if (workspace) workspace.dataset.transitioning = focus && !reduce.matches && previous !== next ? 'true' : 'false';
  viewButtons.filter(button => button.closest('nav')).forEach(button => button.setAttribute('aria-pressed', String(button.dataset.view === view)));
  setStackView(view, !focus || reduce.matches);
  const focusHeading = () => {
    if (generation !== viewTransition) return;
    if (workspace) workspace.dataset.transitioning = 'false';
    if (!focus) return;
    const heading = next.querySelector<HTMLElement>('h2');
    heading?.setAttribute('tabindex', '-1');
    heading?.focus({ preventScroll: true });
  };
  const enter = () => {
    if (generation !== viewTransition) return;
    panels.forEach(panel => { panel.hidden = panel !== next; panel.inert = false; });
    if (workspace && focus && previous !== next) workspace.scrollTop = 0;
    if (focus && !reduce.matches && previous !== next) gsap.fromTo(next, { opacity: 0, x: -70, y: 22, scale: .96, transformOrigin: '0% 50%' }, { opacity: 1, x: 0, y: 0, scale: 1, duration: .72, ease: 'power3.out', clearProps: 'transform,opacity,transformOrigin', onComplete: focusHeading });
    else { gsap.set(next, { clearProps: 'transform,opacity' }); focusHeading(); }
  };
  if (focus && !reduce.matches && previous && previous !== next) {
    previous.inert = true;
    gsap.to(previous, { opacity: 0, x: -24, duration: .2, ease: 'power2.in', onComplete: enter });
  } else {
    enter();
  }
}

function showProject(index: number) {
  selectedProject = index;
  projects.forEach((project, i) => { project.hidden = i !== index; });
  projectButtons.forEach((button, i) => button.setAttribute('aria-pressed', String(i === index)));
  const project = projects[index];
  if (ready && project && !reduce.matches) gsap.fromTo(project, { opacity: .3, y: 8 }, { opacity: 1, y: 0, duration: .3, ease: 'power2.out', clearProps: 'transform,opacity' });
}

viewButtons.forEach(button => button.addEventListener('click', () => {
  const view = button.dataset.view ?? 'home';
  showView(view, true);
  history.replaceState(null, '', view === 'home' ? location.pathname : `#${view}`);
  savePosition();
}));
projectButtons.forEach((button, i) => button.addEventListener('click', () => { showProject(i); savePosition(); }));

const serviceTabs = [...document.querySelectorAll<HTMLButtonElement>('[data-service-tab]')];
function showService(id: string, animate = false) {
  if (!serviceTabs.some(tab => tab.dataset.serviceTab === id)) return;
  selectedService = id;
  serviceTabs.forEach(tab => { const active = tab.dataset.serviceTab === id; tab.setAttribute('aria-selected', String(active)); tab.tabIndex = active ? 0 : -1; });
  document.querySelectorAll<HTMLElement>('[data-service-panel]').forEach(panel => {
    panel.hidden = panel.dataset.servicePanel !== id;
    if (!panel.hidden && animate && !reduce.matches) gsap.fromTo(panel, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: .25, clearProps: 'opacity,transform' });
  });
}
serviceTabs.forEach((tab, index) => {
  tab.addEventListener('click', () => { showService(tab.dataset.serviceTab ?? 'design', true); savePosition(); });
  tab.addEventListener('keydown', event => {
    const direction = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
    if (!direction && event.key !== 'Home' && event.key !== 'End') return;
    event.preventDefault();
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? serviceTabs.length - 1 : (index + direction + serviceTabs.length) % serviceTabs.length;
    showService(serviceTabs[next].dataset.serviceTab ?? 'design', true); serviceTabs[next].focus(); savePosition();
  });
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
  const workspace = document.querySelector<HTMLElement>('.stack-workspace');
  const sheet = panels.find(panel => panel.dataset.panel === selectedView)?.querySelector<HTMLElement>('.stack-sheet');
  try { sessionStorage.setItem(storageKey, JSON.stringify({ time: timeline?.time() ?? 18.3, view: selectedView, project: selectedProject, service: selectedService, reading: { workspace: workspace?.scrollTop ?? 0, sheet: sheet?.scrollTop ?? 0 } })); } catch { /* Storage can be unavailable in private browsing. */ }
}

function updateScene() {
  if (!scene || !realSite) return;
  const time = reduce.matches ? 18.3 : timeline?.time() ?? 0;
  const complete = time >= 18.29;
  if (time >= 8.7) warmStack();
  const phase = complete ? 'complete' : time < 1.8 ? 'default' : time < 3.8 ? 'first-line' : time < 6 ? 'second-line' : time < 8.7 ? 'statement' : time < 14.5 ? 'annotations' : time < 16.85 ? 'erase' : 'reveal';
  scene.dataset.phase = phase;
  scene.dataset.playback = complete ? 'complete' : playbackMode;
  scene.dataset.time = time.toFixed(3);
  realSite.inert = !complete;
  const demo = document.querySelector<HTMLElement>('.demo-page');
  const controls = document.querySelector<HTMLElement>('.story-controls');
  if (demo) demo.inert = time >= 14.25;
  if (controls) controls.inert = time >= 14.25;
  if (chapter) chapter.textContent = time < 1.8 ? 'THE DEFAULT' : time < 8.7 ? 'THE REALIZATION' : time < 14.5 ? 'THE TEARDOWN' : time < 16.85 ? 'A CLEAN SLATE' : 'A POINT OF VIEW';
  gsap.set('.story-track span', { scaleX: time / 18.3 });
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
  setStackView(selectedView, true);
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
  if (!timeline || reduce.matches) return;
  fastPlayback?.kill();
  history.replaceState(null, '', location.pathname);
  playbackMode = 'rewinding';
  fastPlayback = timeline.tweenTo(0, { duration: Math.max(.45, timeline.progress() * 1.8), ease: 'none', onComplete: () => {
    fastPlayback = undefined;
    playbackMode = 'playing';
    showView('home');
    timeline?.play(0);
    document.querySelector<HTMLButtonElement>('[data-skip]')?.focus({ preventScroll: true });
    savePosition();
  } });
}));

const pageLoaded = new Promise<void>(resolve => {
  if (document.readyState === 'complete') resolve();
  else window.addEventListener('load', () => resolve(), { once: true });
});
void Promise.all([document.fonts.ready, pageLoaded]).then(() => {
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
    const workspace = document.querySelector<HTMLElement>('.stack-workspace');
    const sheet = panels.find(panel => panel.dataset.panel === selectedView)?.querySelector<HTMLElement>('.stack-sheet');
    if (workspace && Number.isFinite(saved.reading?.workspace)) workspace.scrollTop = saved.reading?.workspace ?? 0;
    if (sheet && Number.isFinite(saved.reading?.sheet)) sheet.scrollTop = saved.reading?.sheet ?? 0;
    if (Number.isFinite(saved.time)) timeline?.seek(gsap.utils.clamp(0, timeline.duration(), saved.time ?? 0), false);
  } else if (hashView) { goToEnd(); showView(hashView); }
  ready = true;
  if (story) story.dataset.ready = 'true';
  updateScene();
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
    pausedForVisibility = Boolean(fastPlayback?.isActive() || timeline?.isActive());
    (fastPlayback ?? timeline)?.pause();
    savePosition();
  } else if (pausedForVisibility) { pausedForVisibility = false; (fastPlayback ?? timeline)?.resume(); }
});
window.addEventListener('pagehide', () => savePosition());
document.querySelectorAll<HTMLElement>('.stack-workspace,.stack-sheet').forEach(element => element.addEventListener('scroll', () => savePosition(false), { passive: true }));
window.addEventListener('hashchange', () => {
  const view = location.hash.slice(1);
  if (['home', 'services', 'work', 'studio', 'contact'].includes(view)) { goToEnd(); showView(view); }
});
