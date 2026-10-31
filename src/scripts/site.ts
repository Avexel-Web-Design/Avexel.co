const menuButton = document.querySelector<HTMLButtonElement>('.menu-toggle');
const mobileNav = document.querySelector<HTMLElement>('#mobile-nav');
function setMenu(open: boolean) {
  if (!mobileNav || !menuButton) return;
  mobileNav.hidden = !open;
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
}
menuButton?.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
mobileNav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
mobileNav?.addEventListener('focusout', event => {
  if (event.relatedTarget instanceof Node && !mobileNav.contains(event.relatedTarget) && !menuButton?.contains(event.relatedTarget)) setMenu(false);
});
document.addEventListener('click', event => {
  if (event.target instanceof Node && !mobileNav?.contains(event.target) && !menuButton?.contains(event.target)) setMenu(false);
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menuButton?.getAttribute('aria-expanded') === 'true') { setMenu(false); menuButton.focus(); }
});
window.matchMedia('(min-width: 1024px)').addEventListener('change', event => { if (event.matches) setMenu(false); });

const desktopNav = document.querySelector<HTMLElement>('.desktop-nav');
const sectionLinks = [...document.querySelectorAll<HTMLAnchorElement>('a[data-section]')];
const sections = [...(desktopNav?.querySelectorAll<HTMLAnchorElement>('a[data-section]') ?? [])]
  .map(link => document.getElementById(link.dataset.section ?? ''))
  .filter((section): section is HTMLElement => section !== null);

function positionIndicator() {
  const active = desktopNav?.querySelector<HTMLAnchorElement>('a[aria-current="location"]');
  if (!desktopNav || !active || desktopNav.offsetWidth === 0) return;
  desktopNav.style.setProperty('--indicator-x', `${active.offsetLeft}px`);
  desktopNav.style.setProperty('--indicator-width', `${active.offsetWidth}px`);
  desktopNav.dataset.indicatorReady = '';
}

function setActiveSection(id: string) {
  for (const link of sectionLinks) {
    if (link.dataset.section === id) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  }
  positionIndicator();
}

let sectionObserver: IntersectionObserver | undefined;
function observeSections() {
  if (sections.length === 0) return;
  sectionObserver?.disconnect();
  const readingLine = Math.round(window.innerHeight * .18);
  const current = sections.filter(section => section.getBoundingClientRect().top <= readingLine).at(-1);
  setActiveSection((current ?? sections[0]).id);
  sectionObserver = new IntersectionObserver(entries => {
    const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
    const section = visible.at(-1);
    if (section) setActiveSection(section.target.id);
  }, { rootMargin: `-${readingLine}px 0px -${Math.round(window.innerHeight * .78)}px 0px`, threshold: 0 });
  sections.forEach(section => sectionObserver?.observe(section));
}

if (desktopNav) {
  new ResizeObserver(positionIndicator).observe(desktopNav);
  void document.fonts.ready.then(positionIndicator);
}
observeSections();
window.addEventListener('resize', observeSections);

const form = document.querySelector<HTMLFormElement>('[data-contact-form]');
form?.addEventListener('submit', async event => {
  event.preventDefault();
  const submit = form.querySelector<HTMLButtonElement>('button[type=submit]');
  const status = form.querySelector<HTMLElement>('.form-status');
  if (!submit || !status || submit.disabled) return;
  const label = submit.innerHTML;
  submit.disabled = true;
  submit.textContent = 'Sending…';
  status.textContent = '';
  status.classList.remove('error');
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 20000);
  try {
    const response = await fetch(form.action, { method:'POST', body:new FormData(form), headers:{Accept:'application/json'}, signal:controller.signal });
    if (!response.ok) throw new Error('Submission failed');
    status.textContent = 'Message sent. We’ll reply by email.';
    form.reset();
  } catch {
    status.classList.add('error');
    status.textContent = 'Your message couldn’t be sent. Please try again or email contact@avexel.co. Your message is still here.';
  } finally {
    window.clearTimeout(timeout);
    submit.disabled = false;
    submit.innerHTML = label;
    status.focus();
  }
});
