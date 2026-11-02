import { gsap } from 'gsap';

const workspace = document.querySelector<HTMLElement>('.content-workspace');
const pieces = [...document.querySelectorAll<HTMLElement>('[data-layout-piece]')];
const reduce = matchMedia('(prefers-reduced-motion: reduce)');
const root = document.documentElement;
const replay = document.querySelector<HTMLButtonElement>('[data-replay]');
const registered = new Set<HTMLElement>();
const glassNames = ['services', 'studio', 'work', 'contact'];
const easing = 'cubic-bezier(.65,0,.35,1)';
const canAnimateCorners = (() => {
  if (!document.startViewTransition) return false;
  try {
    const probe = root.animate([], { duration: 0, pseudoElement: '::before' });
    const supported = probe.effect instanceof KeyframeEffect && probe.effect.pseudoElement === '::before';
    probe.cancel(); return supported;
  } catch { return false; }
})();
if (!canAnimateCorners) root.classList.add('studio-fixed-corners');

interface PendingMotion { changes: (() => void)[]; complete?: () => void; duration: number; }
interface ActiveMotion { native?: ViewTransition; fade?: gsap.core.Timeline; rounds: Animation[]; }
let active: ActiveMotion | undefined;
let pending: PendingMotion | undefined;
let generation = 0;

/** Only names are attached to the original DOM. No cloned text, hidden workspace,
 * or script-owned replacement frame is ever painted over the finished website.
 */
function nameContent() {
  const next = new Map<HTMLElement, string>();
  const name = (key: string, selector: string) => {
    const element = workspace?.querySelector<HTMLElement>(selector);
    if (!element || !element.getBoundingClientRect().width) return;
    next.set(element, `avx-${key}`);
  };
  name('wordmark', '.identity-wordmark > span');
  name('brand-mark', '.identity-wordmark > img');
  name('brand-control', '.identity-wordmark');
  name('discipline', '.identity-description p:first-child');
  name('introduction', '.identity-description p:last-child');
  for (const view of glassNames) {
    const card = `[data-panel="${view}"]`;
    name(`${view}-glass`, `${card} .tile-material`);
    name(`${view}-label`, `${card} .tile-label`);
    name(`${view}-control`, `${card} .tile-heading h2 button`);
    name(`${view}-arrow`, `${card} .tile-heading h2 .icon`);
    name(`${view}-close`, `${card} .tile-close`);
  }
  name('service-rule', '.service-tabs');
  for (const id of ['design', 'development', 'maintenance']) {
    name(`service-${id}`, `[data-service-tab="${id}"] .service-label`);
    name(`service-${id}-control`, `[data-service-tab="${id}"]`);
    name(`service-${id}-rule`, `[data-service-tab="${id}"] .service-active-rule`);
  }
  name('service-copy', '[data-service-panel]:not([hidden])');
  name('questions-border', '.service-questions');
  [1, 2, 3].forEach(index => name(`question-${index}`, `.service-questions details:nth-child(${index})`));
  name('service-action', '.sheet-action');
  name('team-mark', '.studio-preview > img');
  name('studio-introduction', '.studio-introduction');
  name('studio-copy', '.studio-tile [data-tile-detail]');
  name('project-controls', '.work-tile [data-tile-detail]');
  name('project-image', '[data-project]:not([hidden]) .work-image');
  name('project-title', '[data-project]:not([hidden]) .work-description h3');
  name('project-description', '[data-project]:not([hidden]) .work-description p');
  name('email', '.contact-methods a:first-child');
  name('phone', '.contact-methods a:last-child');
  name('contact-copy', '.contact-tile [data-tile-detail]');
  registered.forEach(element => {
    if (!next.has(element)) { element.style.removeProperty('view-transition-name'); element.style.removeProperty('will-change'); }
  });
  next.forEach((name, element) => {
    if (element.style.viewTransitionName !== name) element.style.viewTransitionName = name;
    // Keep the same original paint surfaces alive at rest and in motion. Do not
    // tear down and recreate every text layer at the beginning/end of a movement.
    if (element.style.willChange !== 'transform') element.style.willChange = 'transform';
  });
  registered.clear(); next.forEach((_, element) => registered.add(element));
}

function cleanup() {
  active?.rounds.forEach(animation => animation.cancel());
  root.classList.remove('studio-motion');
  delete root.dataset.motionPhase;
  workspace?.style.removeProperty('opacity');
  if (replay) replay.disabled = false;
  if (workspace) { workspace.dataset.transitioning = 'false'; workspace.removeAttribute('aria-busy'); }
  active = undefined;
}

export function morphContent(change: () => void, animate = true, complete?: () => void, duration = .78) {
  if (!workspace) { change(); complete?.(); return; }
  if (active && animate && !reduce.matches && !document.hidden) {
    // Finish the current movement, then combine rapid requests into one next
    // movement. Never force a partly visible frame to jump to its endpoint.
    if (pending) { pending.changes.push(change); pending.complete = complete; pending.duration = duration; }
    else pending = { changes: [change], complete, duration };
    return;
  }
  const token = ++generation;
  if (!animate || reduce.matches || document.hidden) {
    active?.native?.skipTransition(); active?.fade?.kill(); pending = undefined;
    cleanup(); change(); nameContent(); complete?.(); return;
  }
  workspace.dataset.transitioning = 'true'; workspace.setAttribute('aria-busy', 'true');
  if (replay) replay.disabled = true;
  const done = () => {
    if (token !== generation) return;
    cleanup();
    const next = pending; pending = undefined;
    if (next) morphContent(() => next.changes.forEach(update => update()), true, next.complete, next.duration);
    else complete?.();
  };
  if (!document.startViewTransition) {
    root.dataset.motionEngine = 'fade';
    const fade = gsap.timeline({ onComplete: done });
    active = { fade, rounds: [] };
    fade.to(workspace, { opacity: 0, duration: .1 }).add(change)
      .to(workspace, { opacity: 1, duration: .18 });
    return;
  }
  root.dataset.motionEngine = 'native';
  root.dataset.motionPhase = 'capturing';
  root.classList.add('studio-motion');
  root.style.setProperty('--motion-duration', `${duration}s`);
  root.style.setProperty('--motion-fade-time', `${duration * .25}s`);
  root.style.setProperty('--motion-fade-delay', `${duration * .65}s`);
  root.style.setProperty('--motion-enter-delay', `${duration * .6}s`);
  const bounds = workspace.getBoundingClientRect();
  const clipped = getComputedStyle(workspace).overflowY !== 'visible';
  root.style.setProperty('--motion-clip', `inset(${clipped ? bounds.top : 0}px ${clipped ? innerWidth - bounds.right : 0}px ${innerHeight - bounds.bottom}px ${clipped ? bounds.left : 0}px)`);
  nameContent();
  const radii = new Map(glassNames.map(view => [view, getComputedStyle(workspace.querySelector(`[data-panel="${view}"] .tile-material`)!).borderTopLeftRadius]));
  const motion: ActiveMotion = { rounds: [] };
  active = motion;
  const transition = document.startViewTransition(async () => {
    if (token !== generation) return;
    change();
    const images = [...workspace.querySelectorAll<HTMLImageElement>('img')].filter(image => image.getBoundingClientRect().width && !image.complete);
    await Promise.all(images.map(async image => {
      image.loading = 'eager';
      try { await image.decode(); } catch { /* A failed image must not block navigation. */ }
    }));
    if (token !== generation) return;
    nameContent();
  });
  motion.native = transition;
  void transition.ready.then(() => {
    if (token !== generation) return;
    root.dataset.motionPhase = 'running';
    if (!canAnimateCorners) return;
    for (const view of glassNames) {
      const material = workspace.querySelector(`[data-panel="${view}"] .tile-material`)!;
      motion.rounds.push(root.animate({ borderRadius: [radii.get(view)!, getComputedStyle(material).borderTopLeftRadius] }, {
        duration: duration * 1000, easing, fill: 'both', pseudoElement: `::view-transition-group(avx-${view}-glass)`,
      }));
    }
  }, () => { /* The browser may skip a capture when the tab becomes hidden. */ });
  void transition.finished.then(done, done);
}

export function arrangeContent(view: string, animate = false, complete?: () => void) {
  if (!workspace) return;
  if (!active && workspace.dataset.contentView === view && pieces.every(piece => piece.dataset.expanded === String(piece.dataset.panel === view))) { complete?.(); return; }
  morphContent(() => {
    const changed = workspace.dataset.contentView !== view;
    workspace.dataset.contentView = view;
    if (changed) workspace.scrollTop = 0;
    pieces.forEach(piece => {
      const expanded = piece.dataset.panel === view;
      piece.dataset.expanded = String(expanded);
      if (changed) { const inner = piece.querySelector<HTMLElement>('.tile-inner'); if (inner) inner.scrollTop = 0; }
      piece.querySelectorAll<HTMLElement>('[data-tile-detail]').forEach(detail => { detail.hidden = !expanded; });
      const heading = piece.querySelector<HTMLButtonElement>('.tile-heading h2 button');
      if (heading) heading.disabled = expanded;
      const close = piece.querySelector<HTMLButtonElement>('.tile-close');
      if (close) { close.disabled = !expanded; close.setAttribute('aria-hidden', String(!expanded)); }
      piece.querySelectorAll<HTMLAnchorElement>('.work-image').forEach(link => {
        const project = link.closest('article')?.querySelector('h3')?.textContent ?? 'project';
        link.setAttribute('aria-label', expanded ? `Visit ${project}` : `Expand Work: ${project}`);
      });
    });
  }, animate, complete);
}
