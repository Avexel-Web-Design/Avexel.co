import { gsap } from 'gsap';

const workspace = document.querySelector<HTMLElement>('.content-workspace');
const host = workspace?.closest<HTMLElement>('.real-site');
const pieces = [...document.querySelectorAll<HTMLElement>('[data-layout-piece]')];
const reduce = matchMedia('(prefers-reduced-motion: reduce)');

interface Visual {
  key: string;
  owner: string;
  rect: DOMRect;
  font: number;
  lineHeight: number;
  tracking: number;
  opacity: number;
  surface: boolean;
  image: boolean;
  node: HTMLElement;
}
interface Layer extends Visual { element: HTMLElement; }
interface Motion {
  root: HTMLElement;
  layers: Layer[];
  panes: Map<string, HTMLElement>;
  timeline?: gsap.core.Timeline;
}
let motion: Motion | undefined;
let generation = 0;
const paintProperties = `display position box-sizing width height min-width min-height max-width max-height
  margin padding border-top border-right border-bottom border-left border-radius outline outline-offset
  box-shadow background overflow overflow-x overflow-y overflow-wrap visibility opacity color
  font-family font-size font-style font-weight font-stretch font-variant font-feature-settings
  font-variation-settings font-kerning font-optical-sizing line-height letter-spacing word-spacing
  white-space text-wrap text-align text-transform text-decoration text-shadow text-indent text-overflow
  flex flex-direction flex-wrap order gap align-items align-self align-content justify-content justify-items justify-self
  grid-template-columns grid-template-rows grid-auto-flow grid-column grid-row inset z-index
  transform transform-origin object-fit object-position aspect-ratio image-rendering vertical-align
  fill fill-rule fill-opacity stroke stroke-width stroke-linecap stroke-linejoin stroke-opacity
  clip-path filter backdrop-filter -webkit-backdrop-filter appearance -webkit-appearance resize list-style`.split(/\s+/);

/** Freeze the rendered styles, line breaks, image source, and form values.
 * These inert visual copies exist only during motion; the original nodes keep state.
 */
function duplicate(source: HTMLElement, deep = true) {
  const clone = source.cloneNode(deep);
  if (!(clone instanceof HTMLElement)) throw new Error('A content snapshot must have an HTML root.');
  return clone;
}

function freeze(source: HTMLElement, shallow: boolean, rect: DOMRect, style: CSSStyleDeclaration): HTMLElement {
  const clone = duplicate(source, !shallow);
  const originals = [source, ...(!shallow ? source.querySelectorAll('*') : [])];
  const copies = [clone, ...clone.querySelectorAll('*')];
  originals.forEach((original, index) => {
    const copy = copies[index];
    if (!(copy instanceof HTMLElement || copy instanceof SVGElement)) return;
    const paint = original === source ? style : getComputedStyle(original);
    copy.setAttribute('style', paintProperties.map(property => `${property}:${paint.getPropertyValue(property)};`).join(''));
    copy.style.transition = 'none'; copy.style.animation = 'none';
    copy.removeAttribute('id');
    if (original instanceof HTMLImageElement && copy instanceof HTMLImageElement) {
      copy.removeAttribute('srcset'); copy.removeAttribute('sizes');
      copy.loading = 'eager'; copy.decoding = 'sync';
      copy.src = original.currentSrc || original.src;
    }
    if (original instanceof HTMLInputElement && copy instanceof HTMLInputElement) { copy.value = original.value; copy.checked = original.checked; }
    if (original instanceof HTMLTextAreaElement && copy instanceof HTMLTextAreaElement) copy.value = original.value;
    if (original instanceof HTMLSelectElement && copy instanceof HTMLSelectElement) copy.selectedIndex = original.selectedIndex;
  });
  const width = parseFloat(style.width) || rect.width;
  const height = parseFloat(style.height) || rect.height;
  const [ox, oy] = style.transformOrigin.split(' ').map(Number.parseFloat);
  const matrix = new DOMMatrix(style.transform === 'none' ? undefined : style.transform);
  const corners = [[0, 0], [width, 0], [0, height], [width, height]].map(([x, y]) => matrix.transformPoint(new DOMPoint(x - ox, y - oy)));
  const left = Math.min(...corners.map(point => point.x + ox));
  const top = Math.min(...corners.map(point => point.y + oy));
  Object.assign(clone.style, { position: 'absolute', inset: 'auto', left: `${-left}px`, top: `${-top}px`, margin: '0px', width: `${width}px`, height: `${height}px`, minWidth: '0px', minHeight: '0px', maxWidth: 'none', maxHeight: 'none', opacity: '1' });
  const frame = document.createElement('div');
  Object.assign(frame.style, { width: `${rect.width}px`, height: `${rect.height}px`, fontSize: style.fontSize });
  frame.append(clone);
  return frame;
}

function visuals(): Visual[] {
  if (!workspace) return [];
  const result: Visual[] = [];
  const add = (key: string, selector: string, surface = false, shallow = false) => {
    const source = workspace.querySelector<HTMLElement>(selector);
    if (!source) return;
    const rect = source.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const style = getComputedStyle(source);
    const font = parseFloat(style.fontSize) || 16;
    result.push({ key, owner: source.closest<HTMLElement>('[data-panel]')!.dataset.panel!, rect, font, lineHeight: parseFloat(style.lineHeight) || font * 1.2, tracking: parseFloat(style.letterSpacing) || 0, opacity: Number(style.opacity), surface, image: key === 'project-image' || key === 'brand-mark' || key === 'team-mark' || key.endsWith('-arrow') || key.endsWith('-close'), node: freeze(source, shallow, rect, style) });
  };
  add('wordmark', '.identity-wordmark > span');
  add('brand-mark', '.identity-wordmark > img');
  add('brand-control', '.identity-wordmark', true, true);
  add('discipline', '.identity-description p:first-child');
  add('introduction', '.identity-description p:last-child');
  for (const view of ['services', 'studio', 'work', 'contact']) {
    const card = `[data-panel="${view}"]`;
    add(`${view}-glass`, `${card} .tile-material`, true);
    add(`${view}-label`, `${card} .tile-label`);
    add(`${view}-control`, `${card} .tile-heading h2 button`, true, true);
    add(`${view}-arrow`, `${card} .tile-heading h2 .icon`);
    add(`${view}-close`, `${card} .tile-close`);
  }
  add('service-rule', '.service-tabs', true, true);
  for (const id of ['design', 'development', 'maintenance']) {
    add(`service-${id}`, `[data-service-tab="${id}"] .service-label`);
    add(`service-${id}-control`, `[data-service-tab="${id}"]`, true, true);
    add(`service-${id}-rule`, `[data-service-tab="${id}"] .service-active-rule`, true);
  }
  add('service-copy', '[data-service-panel]:not([hidden])');
  [1, 2, 3].forEach(index => add(`question-${index}`, `.service-questions details:nth-child(${index})`));
  add('service-action', '.sheet-action');
  add('team-mark', '.studio-preview > img');
  add('studio-introduction', '.studio-introduction');
  add('studio-copy', '.studio-tile [data-tile-detail]');
  add('project-controls', '.work-tile [data-tile-detail]');
  add('project-image', '[data-project]:not([hidden]) .work-image');
  add('project-title', '[data-project]:not([hidden]) .work-description h3');
  add('project-description', '[data-project]:not([hidden]) .work-description p');
  add('email', '.contact-methods a:first-child');
  add('phone', '.contact-methods a:last-child');
  add('contact-copy', '.contact-tile [data-tile-detail]');
  return result;
}

function clip(rect: DOMRect, origin: DOMRect, radius = 20) {
  return `inset(${rect.top - origin.top}px ${origin.right - rect.right}px ${origin.bottom - rect.bottom}px ${rect.left - origin.left}px round ${radius}px)`;
}

function currentVisuals(): Visual[] {
  if (!motion) return visuals();
  return motion.layers.flatMap(layer => {
    const opacity = Number(getComputedStyle(layer.element).opacity);
    if (opacity < .001) return [];
    return [{ ...layer, rect: layer.element.getBoundingClientRect(), font: parseFloat(layer.node.style.fontSize) * Number(gsap.getProperty(layer.element, 'scaleY')), opacity, node: duplicate(layer.node) }];
  });
}

/** A frozen start frame and end frame share one geometry timeline.
 * No live layout/style change can leak into the painted first frame.
 */
export function morphContent(change: () => void, animate = true, complete?: () => void, duration = .78) {
  if (!workspace || !host) { change(); complete?.(); return; }
  const token = ++generation;
  if (!animate || reduce.matches || document.hidden) {
    motion?.timeline?.kill(); motion?.root.remove(); motion = undefined;
    delete workspace.dataset.morphHidden;
    change(); workspace.dataset.transitioning = 'false'; complete?.(); return;
  }
  const origin = host.getBoundingClientRect();
  const before = currentVisuals();
  const oldClips = new Map(pieces.map(piece => {
    const owner = piece.dataset.panel!;
    return [owner, motion?.panes.get(owner)?.style.clipPath || clip(owner === 'home' ? workspace.getBoundingClientRect() : piece.getBoundingClientRect(), origin, owner === 'home' ? 0 : 20)];
  }));
  motion?.timeline?.kill();
  const oldRoot = motion?.root;
  const root = document.createElement('div');
  root.className = 'content-morph'; root.setAttribute('aria-hidden', 'true'); root.inert = true;
  root.style.clipPath = clip(workspace.getBoundingClientRect(), origin, 0);
  const next: Motion = { root, layers: [], panes: new Map() };
  const pane = (owner: string) => {
    if (!next.panes.has(owner)) {
      const element = document.createElement('div'); element.className = 'morph-pane';
      element.style.clipPath = oldClips.get(owner)!; root.append(element); next.panes.set(owner, element);
    }
    return next.panes.get(owner)!;
  };
  const mount = (visual: Visual, rect = visual.rect, opacity = visual.opacity) => {
    const element = document.createElement('div');
    element.className = 'morph-visual'; element.dataset.morphKey = visual.key;
    const width = parseFloat(visual.node.style.width) || rect.width;
    const height = parseFloat(visual.node.style.height) || rect.height;
    Object.assign(visual.node.style, { position: 'absolute', inset: 'auto', left: '0px', top: '0px', margin: '0px', boxSizing: 'border-box', width: `${width}px`, height: `${height}px`, minWidth: '0px', minHeight: '0px', maxWidth: 'none', maxHeight: 'none', opacity: '1', transform: 'none', zIndex: 'auto' });
    element.style.width = `${width}px`; element.style.height = `${height}px`;
    element.style.zIndex = visual.surface ? '0' : '1';
    element.append(visual.node); pane(visual.owner).append(element);
    gsap.set(element, { x: rect.left - origin.left, y: rect.top - origin.top, scaleX: rect.width / width, scaleY: rect.height / height, opacity });
    const layer = { ...visual, element }; next.layers.push(layer); return layer;
  };
  before.forEach(visual => mount(visual));
  host.append(root); oldRoot?.remove(); motion = next;
  workspace.dataset.morphHidden = 'true'; workspace.dataset.transitioning = 'true';
  change();
  const finish = () => {
    if (token !== generation) return;
    root.remove(); motion = undefined;
    delete workspace.dataset.morphHidden;
    workspace.dataset.transitioning = 'false'; complete?.();
  };
  const start = () => {
    if (token !== generation) return;
    // Read destination styles without painting the live destination prematurely.
    delete workspace.dataset.morphHidden;
    const after = visuals();
    workspace.dataset.morphHidden = 'true';
    const destinations = new Map(after.map(visual => [visual.key, visual]));
    const timeline = gsap.timeline({ defaults: { duration, ease: 'power3.inOut' }, onComplete: finish });
    next.timeline = timeline;
    pieces.forEach(piece => {
      const owner = piece.dataset.panel!;
      timeline.to(pane(owner), { clipPath: clip(owner === 'home' ? workspace.getBoundingClientRect() : piece.getBoundingClientRect(), origin, owner === 'home' ? 0 : 20) }, 0);
    });
    const outgoing = [...next.layers];
    outgoing.forEach(layer => {
      const target = destinations.get(layer.key);
      const width = parseFloat(layer.element.style.width);
      const height = parseFloat(layer.element.style.height);
      if (target) {
        const ratio = layer.image ? Math.min(target.rect.width / layer.rect.width, target.rect.height / layer.rect.height) : target.font / layer.font;
        const serviceLabel = /^service-(design|development|maintenance)$/.test(layer.key);
        const shrinking = target.font < layer.font;
        const sizeStart = serviceLabel && !shrinking ? duration * .35 : 0;
        const sizeDuration = serviceLabel ? duration * (shrinking ? .45 : .65) : duration;
        // Horizontal travel stays locked to the card, even while labels stagger vertically.
        timeline.to(layer.element, { x: target.rect.left - origin.left }, 0);
        timeline.to(layer.element, { y: target.rect.top - origin.top, duration: serviceLabel ? duration * (shrinking ? .85 : .65) : duration }, serviceLabel && shrinking ? duration * .15 : 0);
        timeline.to(layer.element, {
          scaleX: layer.surface ? target.rect.width / width : Number(gsap.getProperty(layer.element, 'scaleX')) * ratio,
          scaleY: layer.surface ? target.rect.height / height : Number(gsap.getProperty(layer.element, 'scaleY')) * ratio,
          duration: sizeDuration }, sizeStart);
        if (!layer.surface && !layer.image) {
          const text = layer.node.firstElementChild;
          const scale = Number(gsap.getProperty(layer.element, 'scaleY')) * ratio;
          if (text) timeline.to(text, { lineHeight: `${target.lineHeight / scale}px`, letterSpacing: `${target.tracking / scale}px`, duration: sizeDuration }, sizeStart);
        }
      } else timeline.to(layer.element, { y: Number(gsap.getProperty(layer.element, 'y')) - 10 }, 0);
      timeline.to(layer.element, { opacity: 0, duration: duration * (target ? .25 : .4), ease: 'power1.inOut' }, target ? duration * .7 : 0);
    });
    after.filter(visual => visual.opacity > 0).forEach(visual => {
      const previous = before.filter(item => item.key === visual.key).sort((a, b) => b.opacity - a.opacity)[0];
      const layer = mount(visual, previous?.rect ?? visual.rect, 0);
      if (previous && !visual.surface) {
        const scale = visual.image ? Math.min(previous.rect.width / visual.rect.width, previous.rect.height / visual.rect.height) : previous.font / visual.font;
        gsap.set(layer.element, { scaleX: scale, scaleY: scale });
      } else if (!previous) gsap.set(layer.element, { y: visual.rect.top - origin.top + 12 });
      timeline.to(layer.element, { x: visual.rect.left - origin.left, y: visual.rect.top - origin.top, scaleX: 1, scaleY: 1 }, 0);
      timeline.to(layer.element, { opacity: visual.opacity, duration: duration * .25, ease: 'power1.inOut' }, duration * .7);
    });
  };
  // Hold the old frame until newly selected screenshots are decoded, never flash an empty image.
  const images = [...workspace.querySelectorAll<HTMLImageElement>('img')].filter(image => image.getBoundingClientRect().width && !image.complete);
  if (images.length) {
    void Promise.all(images.map(decode)).then(start);
  } else start();
}

async function decode(image: HTMLImageElement) {
  image.loading = 'eager';
  try { await image.decode(); } catch { /* A failed image must not leave navigation waiting. */ }
}

export function arrangeContent(view: string, animate = false, complete?: () => void) {
  if (!workspace) return;
  const changed = workspace.dataset.contentView !== view;
  morphContent(() => {
    workspace.dataset.contentView = view;
    if (changed) workspace.scrollTop = 0;
    pieces.forEach(piece => {
      const active = piece.dataset.panel === view;
      piece.dataset.expanded = String(active);
      if (changed) { const inner = piece.querySelector<HTMLElement>('.tile-inner'); if (inner) inner.scrollTop = 0; }
      piece.querySelectorAll<HTMLElement>('[data-tile-detail]').forEach(detail => { detail.hidden = !active; });
      const heading = piece.querySelector<HTMLButtonElement>('.tile-heading h2 button');
      if (heading) heading.disabled = active;
      const close = piece.querySelector<HTMLButtonElement>('.tile-close');
      if (close) { close.disabled = !active; close.setAttribute('aria-hidden', String(!active)); }
      piece.querySelectorAll<HTMLAnchorElement>('.work-image').forEach(link => {
        const project = link.closest('article')?.querySelector('h3')?.textContent ?? 'project';
        link.setAttribute('aria-label', active ? `Visit ${project}` : `Expand Work: ${project}`);
      });
    });
  }, animate && changed, complete);
}
