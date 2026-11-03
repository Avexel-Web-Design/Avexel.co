const root = document.documentElement;
const toggles = document.querySelectorAll<HTMLButtonElement>('[data-theme-toggle]');
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
toggles.forEach(toggle => toggle.addEventListener('click', () => {
  root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
  try { localStorage.setItem('avexel-theme', root.dataset.theme); } catch { /* Still works when storage is blocked. */ }
  syncThemeControls();
}));
window.addEventListener('storage', event => {
  if (event.key !== 'avexel-theme') return;
  root.dataset.theme = event.newValue === 'dark' ? 'dark' : 'light';
  syncThemeControls();
});
syncThemeControls();
