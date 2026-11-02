// A select-only combobox: focus stays on the trigger while the active option
// is announced through aria-activedescendant. The hidden input is submitted
// normally with the rest of the form.
document.querySelectorAll<HTMLElement>('[data-service-select]').forEach(field => {
  const trigger = field.querySelector<HTMLButtonElement>('[role="combobox"]')!;
  const menu = field.querySelector<HTMLElement>('[role="listbox"]')!;
  const value = field.querySelector<HTMLElement>('#contact-service-value')!;
  const input = field.querySelector<HTMLInputElement>('input')!;
  const options = [...menu.querySelectorAll<HTMLButtonElement>('[role="option"]')];
  let selected = 0, active = 0, search = '', lastKey = 0;

  const highlight = (index: number) => {
    active = (index + options.length) % options.length;
    options.forEach((option, index) => { option.dataset.active = String(index === active); });
    trigger.setAttribute('aria-activedescendant', options[active].id);
  };
  const close = () => {
    menu.hidden = true;
    trigger.setAttribute('aria-expanded', 'false');
    trigger.removeAttribute('aria-activedescendant');
    search = '';
  };
  const open = () => {
    menu.hidden = false;
    trigger.setAttribute('aria-expanded', 'true');
    delete menu.dataset.side;
    const bottom = field.closest('.tile-inner')!.getBoundingClientRect().bottom;
    if (menu.getBoundingClientRect().bottom > bottom - 12) menu.dataset.side = 'above';
    highlight(selected);
  };
  const choose = (index: number) => {
    selected = index;
    input.value = options[index].dataset.serviceOption!;
    value.textContent = input.value;
    options.forEach((option, index) => option.setAttribute('aria-selected', String(index === selected)));
    input.dispatchEvent(new Event('change', { bubbles: true }));
    close();
  };
  trigger.addEventListener('click', () => { if (menu.hidden) open(); else close(); });
  trigger.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !menu.hidden) {
      event.preventDefault(); event.stopPropagation(); close(); return;
    }
    if (event.key === 'Tab') { close(); return; }
    if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
      event.preventDefault();
      const wasClosed = menu.hidden;
      if (wasClosed) open();
      if (event.key === 'Home') highlight(0);
      else if (event.key === 'End') highlight(options.length - 1);
      else if (!wasClosed) highlight(active + (event.key === 'ArrowDown' ? 1 : -1));
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (menu.hidden) open(); else choose(active);
    } else if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
      event.preventDefault();
      if (menu.hidden) open();
      const now = performance.now();
      search = now - lastKey > 700 ? event.key : search + event.key;
      lastKey = now;
      const index = options.findIndex(option => option.dataset.serviceOption!.toLowerCase().startsWith(search.toLowerCase()));
      if (index >= 0) highlight(index);
    }
  });
  options.forEach((option, index) => {
    option.addEventListener('pointerdown', event => event.preventDefault());
    option.addEventListener('pointermove', () => highlight(index));
    option.addEventListener('click', () => { choose(index); trigger.focus({ preventScroll: true }); });
  });
  trigger.addEventListener('blur', close);
  document.addEventListener('pointerdown', event => {
    if (event.target instanceof Node && !field.contains(event.target)) close();
  });
  field.closest('form')?.addEventListener('reset', () => choose(0));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !menu.hidden) { event.preventDefault(); close(); }
  });
});
