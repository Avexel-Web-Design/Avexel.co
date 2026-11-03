interface Box { left: number; top: number; right: number; bottom: number; }

const clamp = (min: number, max: number, value: number) => Math.max(min, Math.min(max, value));
const overlaps = (a: Box, b: Box, gap = 0) => a.left < b.right + gap && a.right > b.left - gap && a.top < b.bottom + gap && a.bottom > b.top - gap;
const boxAt = (x: number, y: number, width: number, height: number): Box => ({ left: x, top: y, right: x + width, bottom: y + height });

function textBoxes(element: HTMLElement): Box[] {
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
  const boxes: Box[] = [];
  let node = walker.nextNode();
  while (node) {
    if (node.textContent?.trim()) {
      const range = document.createRange();
      range.selectNodeContents(node);
      boxes.push(...Array.from(range.getClientRects()).filter(rect => rect.width > 0 && rect.height > 0));
    }
    node = walker.nextNode();
  }
  return boxes;
}

export function layoutAnnotations(scene: HTMLElement) {
  const origin = scene.getBoundingClientRect();
  const bounds = { left: origin.left + 14, top: origin.top + 14, right: origin.right - 14, bottom: origin.bottom - 14 };
  const footer = scene.querySelector<HTMLElement>('.demo-bottom')?.getBoundingClientRect();
  const header = scene.querySelector<HTMLElement>('.demo-nav')?.getBoundingClientRect();
  const protectedElements = [...scene.querySelectorAll<HTMLElement>('.demo-brand,.demo-nav > div span,.demo-nav > .demo-cta,.demo-eyebrow,.demo-copy h1,.demo-description,.demo-copy > .demo-cta,.demo-art figcaption,.art-caption,.art-plus,.demo-bottom > span')];
  const content = protectedElements.flatMap(element => {
    element.dataset.annotationObstacle = '';
    if (!element.getBoundingClientRect().width) return [];
    return element.matches('button') ? [element.getBoundingClientRect()] : textBoxes(element);
  });
  const dividers = [...scene.querySelectorAll<HTMLElement>('.demo-nav,.demo-bottom')].map(element => {
    const rect = element.getBoundingClientRect();
    const y = element.matches('.demo-nav') ? rect.bottom : rect.top;
    return { left: rect.left, right: rect.right, top: y - 2, bottom: y + 2 };
  });
  const occupied: Box[] = [];

  const priority = (note: HTMLElement) => note.dataset.note === 'nav' ? 0 : note.dataset.note === 'navcta' ? 1 : note.dataset.note === 'bottom' ? 2 : 3;
  const notes = [...scene.querySelectorAll<HTMLElement>('[data-note]')].sort((a, b) => priority(a) - priority(b));
  for (const note of notes) {
    for (const property of ['left', 'top', 'right', 'bottom', 'width']) note.style.removeProperty(property);
    const target = scene.querySelector<HTMLElement>(note.dataset.target ?? '');
    if (!target) continue;
    const preferred = note.getBoundingClientRect();
    const rect = target.getBoundingClientRect();
    if (!preferred.width || !rect.width || !rect.height) continue;
    const width = Math.min(preferred.width, bounds.right - bounds.left);
    const height = preferred.height;
    const centerX = rect.left + rect.width / 2;
    const centerY = note.dataset.note === 'brand' ? rect.bottom - 9 : rect.top + rect.height / 2;
    const gap = note.dataset.note === 'label' || note.dataset.note === 'art' ? 10 : 14;
    const candidates = [
      boxAt(preferred.left, preferred.top, width, height),
      boxAt(centerX - width / 2, rect.top - height - gap, width, height),
      boxAt(centerX - width / 2, rect.bottom + gap, width, height),
      boxAt(rect.right + gap, centerY - height / 2, width, height),
      boxAt(rect.left - width - gap, centerY - height / 2, width, height),
    ];
    if (note.dataset.note === 'bottom' && footer) {
      candidates.unshift(boxAt(rect.right + 14, footer.top + 12, width, height), boxAt(rect.left, footer.top + 12, width, height));
    }
    // Use real free space, not fixed percentage positions, on narrow viewports.
    for (let y = bounds.top; y + height <= bounds.bottom; y += 10) {
      for (let x = bounds.left; x + width <= bounds.right; x += 10) candidates.push(boxAt(x, y, width, height));
    }
    let best = candidates[0];
    let bestScore = Infinity;
    for (const [index, rawCandidate] of candidates.entries()) {
      const candidate = origin.width < 600 && index >= 5
        ? boxAt(rawCandidate.left < origin.left + origin.width / 2 - width / 2 ? bounds.left : bounds.right - width, rawCandidate.top, width, height)
        : rawCandidate;
      if (candidate.left < bounds.left || candidate.right > bounds.right || candidate.top < bounds.top || candidate.bottom > bounds.bottom) continue;
      if (note.dataset.note === 'bottom' && footer && candidate.top < footer.top + 10) continue;
      if (note.dataset.note === 'nav' && header && candidate.top < header.bottom + 12) continue;
      // The label callout must sit on its subject: judge it by exact overlap,
      // not the usual halo. The regression suite still forbids any coverage.
      const contentGap = note.dataset.note === 'label' ? 0 : 10;
      const collisions = [...content, ...dividers].filter(box => overlaps(candidate, box, contentGap)).length + occupied.filter(box => overlaps(candidate, box, 14)).length * 5;
      // On crowded screens, preserve readable content before the preferred spacing.
      const covered = [...content, ...dividers].filter(box => overlaps(candidate, box)).length + occupied.filter(box => overlaps(candidate, box)).length * 5;
      const distance = Math.hypot(Math.max(rect.left - candidate.right, 0, candidate.left - rect.right), Math.max(rect.top - candidate.bottom, 0, candidate.top - rect.bottom));
      const displacement = Math.hypot(candidate.left - preferred.left, candidate.top - preferred.top);
      const baselineAlignment = note.dataset.note === 'label' && (candidate.left >= rect.right || candidate.right <= rect.left)
        ? Math.abs((candidate.top + candidate.bottom) / 2 - centerY) * 2 : 0;
      // A stacked label callout needs room for its short attached triangle.
      // Nudge it toward the same tested spacing band the side alignment uses.
      const labelGap = note.dataset.note === 'label' && (candidate.bottom <= rect.top || candidate.top >= rect.bottom)
        ? Math.abs((candidate.bottom <= rect.top ? rect.top - candidate.bottom : candidate.top - rect.bottom) - 11.5) * 10 : 0;
      const score = covered * 1000000000 + collisions * 1000000 + distance * 3 + displacement * .2 + baselineAlignment + labelGap;
      if (score < bestScore) { best = candidate; bestScore = score; }
    }
    note.style.left = `${best.left - origin.left}px`;
    note.style.top = `${best.top - origin.top}px`;
    note.style.right = 'auto';
    note.style.bottom = 'auto';
    note.style.width = `${width}px`;
    occupied.push(best);

    // Each callout has a short, attached triangle facing its subject.
    const labelX = (best.left + best.right) / 2;
    const labelY = (best.top + best.bottom) / 2;
    const dx = (centerX - labelX) / width;
    const dy = (centerY - labelY) / height;
    const side = Math.abs(dx) > Math.abs(dy) ? dx > 0 ? 'right' : 'left' : dy > 0 ? 'bottom' : 'top';
    note.dataset.pointer = side;
    const offset = side === 'top' || side === 'bottom'
      ? clamp(12, width - 12, centerX - best.left)
      : clamp(12, height - 12, centerY - best.top);
    note.style.setProperty('--pointer-offset', `${offset}px`);
  }
  scene.dataset.annotationSize = `${scene.clientWidth}x${scene.clientHeight}`;
}
