const themeButton = document.querySelector<HTMLButtonElement>('.theme-toggle');
const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');
function currentTheme() { return document.documentElement.dataset.theme ?? (systemTheme.matches ? 'dark' : 'light'); }
function updateThemeLabel() { themeButton?.setAttribute('aria-label', `Switch to ${currentTheme() === 'dark' ? 'light' : 'dark'} theme`); }
updateThemeLabel();
systemTheme.addEventListener('change', updateThemeLabel);
themeButton?.addEventListener('click', () => {
  const next = currentTheme() === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = next;
  try { localStorage.setItem('avexel-theme', next); } catch { /* Theme still works when storage is unavailable. */ }
  updateThemeLabel();
});

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
document.addEventListener('click', event => {
  if (event.target instanceof Node && !mobileNav?.contains(event.target) && !menuButton?.contains(event.target)) setMenu(false);
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menuButton?.getAttribute('aria-expanded') === 'true') { setMenu(false); menuButton.focus(); }
});
window.matchMedia('(min-width: 768px)').addEventListener('change', event => { if (event.matches) setMenu(false); });

const form = document.querySelector<HTMLFormElement>('[data-contact-form]');
const estimateField = document.querySelector<HTMLElement>('#estimate-summary-field');
const estimateInput = document.querySelector<HTMLTextAreaElement>('#estimate-summary');
try {
  const estimate = sessionStorage.getItem('avexel-estimate');
  if (estimate && estimateInput && estimateField) { estimateInput.value = estimate; estimateField.hidden = false; }
} catch { /* The contact form does not require storage. */ }
document.querySelector('#clear-estimate')?.addEventListener('click', () => {
  if (estimateInput) estimateInput.value = '';
  if (estimateField) estimateField.hidden = true;
  try { sessionStorage.removeItem('avexel-estimate'); } catch { /* Storage is optional. */ }
});
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
    status.textContent = 'Thank you. Your message is with our team. We’ll be in touch by email.';
    form.reset();
    if (estimateField) estimateField.hidden = true;
    try { sessionStorage.removeItem('avexel-estimate'); } catch { /* Storage is optional. */ }
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
