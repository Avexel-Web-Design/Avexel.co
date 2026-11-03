const root = document.documentElement;
const toggles = document.querySelectorAll<HTMLButtonElement>('[data-theme-toggle]');
const reduce = matchMedia('(prefers-reduced-motion: reduce)');
let changing = false;
function syncThemeControls() {
  const dark = root.dataset.theme === 'dark';
  document.querySelectorAll<HTMLSourceElement>('[data-theme-light-image]').forEach(source => {
    source.media = dark ? 'not all' : 'all';
  });
  toggles.forEach(toggle => {
    const label = `Switch to ${dark ? 'light' : 'dark'} mode`;
    toggle.setAttribute('aria-label', label);
    toggle.title = label;
  });
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark ? '#000000' : '#ffffff');
}
function applyTheme(theme: string) {
  root.dataset.theme = theme;
  try { localStorage.setItem('avexel-theme', root.dataset.theme); } catch { /* Still works when storage is blocked. */ }
  syncThemeControls();
}

async function prepareImages(dark: boolean) {
  // Decode the destination pictures before capturing either theme. The radial
  // edge must reveal the new Atlas pixels, not a picture that swaps afterward.
  await Promise.all([...document.querySelectorAll<HTMLSourceElement>('[data-theme-light-image]')].map(async source => {
    const original = source.parentElement?.querySelector('img');
    if (!original || !original.getBoundingClientRect().width) return;
    const image = new Image();
    image.sizes = dark ? original.sizes : source.sizes;
    image.srcset = dark ? original.srcset : source.srcset;
    image.src = dark ? original.src : source.srcset.split(',')[0].trim().split(/\s+/)[0];
    try { await image.decode(); } catch { /* A failed image must not block switching themes. */ }
  }));
}

async function waitForCards() {
  const workspace = document.querySelector<HTMLElement>('.content-workspace');
  if (workspace?.dataset.transitioning !== 'true') return;
  await new Promise<void>(resolve => {
    const observer = new MutationObserver(() => {
      if (workspace.dataset.transitioning === 'true') return;
      observer.disconnect(); resolve();
    });
    observer.observe(workspace, { attributes: true, attributeFilter: ['data-transitioning'] });
  });
}

async function changeTheme(toggle: HTMLButtonElement) {
  if (changing) return;
  const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
  if (reduce.matches || !document.startViewTransition) { applyTheme(next); return; }
  changing = true;
  const restoreFocus = document.activeElement === toggle;
  toggles.forEach(button => { button.disabled = true; });
  let transition: ViewTransition | undefined;
  let animation: Animation | undefined;
  try {
    await waitForCards();
    await prepareImages(next === 'dark');
    await waitForCards();
    const bounds = toggle.getBoundingClientRect();
    const x = bounds.left + bounds.width / 2, y = bounds.top + bounds.height / 2;
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    // Temporarily capture the complete page, not its independently named card
    // layers. The Atlas image and all text are cut by the same circular edge.
    root.classList.add('theme-changing');
    transition = document.startViewTransition(async () => {
      applyTheme(next);
      await Promise.all([...document.querySelectorAll<HTMLSourceElement>('[data-theme-light-image]')].map(async source => {
        const image = source.parentElement?.querySelector('img');
        if (image?.getBoundingClientRect().width) {
          try { await image.decode(); } catch { /* Keep the rest of the theme usable. */ }
        }
      }));
    });
    await transition.ready;
    root.dataset.themeMotion = 'running';
    animation = root.animate({ clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] }, {
      duration: 650, easing: 'cubic-bezier(.4,0,.2,1)', fill: 'both', pseudoElement: '::view-transition-new(root)',
    });
    await animation.finished;
    await transition.finished;
  } catch {
    transition?.skipTransition();
    await transition?.updateCallbackDone.catch(() => {});
    applyTheme(next);
  } finally {
    animation?.cancel();
    root.classList.remove('theme-changing');
    delete root.dataset.themeMotion;
    toggles.forEach(button => { button.disabled = false; });
    if (restoreFocus) toggle.focus({ preventScroll: true });
    changing = false;
    root.dispatchEvent(new Event('theme-motion-end'));
  }
}
toggles.forEach(toggle => toggle.addEventListener('click', () => { void changeTheme(toggle); }));
window.addEventListener('storage', event => {
  if (event.key !== 'avexel-theme') return;
  root.dataset.theme = event.newValue === 'dark' ? 'dark' : 'light';
  syncThemeControls();
});
syncThemeControls();
