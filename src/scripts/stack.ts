import { gsap } from 'gsap';
import type { StackModel } from './stack-model';

const workspace = document.querySelector<HTMLElement>('.stack-workspace');
const object = document.querySelector<HTMLElement>('[data-stack-object]');
const renderHost = document.querySelector<HTMLElement>('[data-stack-render]');
const reduce = matchMedia('(prefers-reduced-motion: reduce)');
let currentView = 'home';
let model: StackModel | undefined;
let loading: Promise<void> | undefined;

export function warmStack() {
  if (loading || !renderHost) return;
  loading = import('./stack-model').then(async ({ createStackModel }) => {
    model = await createStackModel(renderHost, currentView);
    if (model) { model.setView(currentView, true); object?.setAttribute('data-rendered', 'true'); }
    else object?.setAttribute('data-fallback', 'true');
  }).catch(() => { object?.setAttribute('data-fallback', 'true'); });
}

export function setStackView(view: string, immediate = false) {
  currentView = view;
  if (!object || !workspace) return;
  workspace.dataset.stackView = view;
  const mobile = matchMedia('(max-width: 767px)').matches;
  const home = view === 'home';
  gsap.to(object, {
    xPercent: home || mobile ? 0 : view === 'work' ? -94 : -82,
    yPercent: home || !mobile ? 0 : -25,
    scale: home ? 1 : mobile ? .43 : view === 'work' ? .64 : .8,
    opacity: home || !mobile ? 1 : .85,
    duration: immediate || reduce.matches ? 0 : .95,
    ease: 'power3.inOut', overwrite: true,
  });
  model?.setView(view, immediate);
}
