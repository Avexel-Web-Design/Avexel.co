import { gsap } from 'gsap';

const workspace = document.querySelector<HTMLElement>('.content-workspace');
const pieces = [...document.querySelectorAll<HTMLElement>('[data-layout-piece]')];
const content = [...document.querySelectorAll<HTMLElement>('.identity-tile h2,.identity-description p,.tile-heading h2,.service-tabs button,.studio-introduction,.studio-preview > img,.supporting-projects,.contact-methods a')];
const reduce = matchMedia('(prefers-reduced-motion: reduce)');
let transition: gsap.core.Timeline | undefined;
let generation = 0;

function measure(element: HTMLElement) {
  return { rect: element.getBoundingClientRect(), font: parseFloat(getComputedStyle(element).fontSize) || 16 };
}

/** Content travels independently of its glass, so type is never stretched. */
export function arrangeContent(view: string, animate = false, complete?: () => void) {
  if (!workspace) return;
  const token = ++generation;
  transition?.progress(1).kill();
  gsap.killTweensOf('[data-tile-detail]');
  gsap.set('[data-tile-detail]', { clearProps: 'opacity,transform' });
  const before = new Map([...pieces, ...content].map(element => [element, measure(element)]));
  const changed = workspace.dataset.contentView !== view;
  workspace.dataset.contentView = view;
  workspace.dataset.transitioning = animate && changed && !reduce.matches ? 'true' : 'false';
  pieces.forEach(piece => {
    const active = piece.dataset.panel === view;
    piece.dataset.expanded = String(active);
    piece.querySelectorAll<HTMLElement>('[data-tile-detail]').forEach(detail => { detail.hidden = !active; });
    const headingButton = piece.querySelector<HTMLButtonElement>('.tile-heading h2 button');
    if (headingButton) headingButton.disabled = active;
    piece.querySelectorAll<HTMLAnchorElement>('.work-image').forEach(link => {
      const project = link.closest('article')?.querySelector('h3')?.textContent ?? 'project';
      link.setAttribute('aria-label', active ? `Visit ${project}` : `Expand Work: ${project}`);
    });
  });
  const done = () => {
    if (token !== generation) return;
    workspace.dataset.transitioning = 'false';
    complete?.();
  };
  if (!animate || !changed || reduce.matches) { done(); return; }
  workspace.scrollTop = 0;
  const after = new Map([...pieces, ...content].map(element => [element, measure(element)]));
  transition = gsap.timeline({ defaults: { duration: .78, ease: 'power3.inOut' }, onComplete: done });
  pieces.forEach(piece => {
    const first = before.get(piece)!.rect;
    const last = after.get(piece)!.rect;
    const dx = first.left - last.left;
    const dy = first.top - last.top;
    transition!.fromTo(piece, { x: dx, y: dy }, { x: 0, y: 0, clearProps: 'transform' }, 0);
    const material = piece.querySelector<HTMLElement>('.tile-material');
    if (material) transition!.fromTo(material, { scaleX: first.width / last.width, scaleY: first.height / last.height, transformOrigin: '0 0' }, { scaleX: 1, scaleY: 1, clearProps: 'transform,transformOrigin' }, 0);
    content.filter(element => element.closest('[data-layout-piece]') === piece).forEach(element => {
      const old = before.get(element)!;
      const next = after.get(element)!;
      if (!old.rect.width || !next.rect.width) return;
      const scale = element.matches('.supporting-projects')
        ? Math.min(old.rect.width / next.rect.width, old.rect.height / next.rect.height)
        : old.font / next.font;
      transition!.fromTo(element, {
        x: old.rect.left - next.rect.left - dx,
        y: old.rect.top - next.rect.top - dy,
        scale, transformOrigin: '0 0',
      }, { x: 0, y: 0, scale: 1, clearProps: 'transform,transformOrigin' }, 0);
    });
  });
  const details = workspace.querySelectorAll<HTMLElement>('[data-tile-detail]:not([hidden])');
  gsap.fromTo(details, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: .32, delay: .43, clearProps: 'opacity,transform' });
}
