// Batch pointer updates to one paint per frame. Touch and keyboard users keep
// the same solid button and focus outline without a stuck hover effect.
document.querySelectorAll<HTMLButtonElement>('.inquiry-submit').forEach(button => {
  let frame = 0, x = 0, y = 0;
  const move = (event: PointerEvent) => {
    if (event.pointerType === 'touch' || button.disabled) return;
    const bounds = button.getBoundingClientRect();
    x = event.clientX - bounds.left;
    y = event.clientY - bounds.top;
    if (frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      button.style.setProperty('--spotlight-x', `${x}px`);
      button.style.setProperty('--spotlight-y', `${y}px`);
      button.dataset.spotlight = 'true';
    });
  };
  const clear = () => {
    cancelAnimationFrame(frame); frame = 0;
    delete button.dataset.spotlight;
  };
  button.addEventListener('pointerenter', move);
  button.addEventListener('pointermove', move);
  button.addEventListener('pointerleave', clear);
  button.addEventListener('pointercancel', clear);
});
