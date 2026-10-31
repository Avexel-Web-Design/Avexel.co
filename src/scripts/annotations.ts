interface Box { left: number; top: number; right: number; bottom: number; }
interface Point { x: number; y: number; }

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

function segmentHitsBox(a: Point, b: Point, box: Box) {
  let near = 0;
  let far = 1;
  for (const [start, delta, low, high] of [[a.x, b.x - a.x, box.left - 3, box.right + 3], [a.y, b.y - a.y, box.top - 3, box.bottom + 3]]) {
    if (Math.abs(delta) < .01) { if (start < low || start > high) return false; }
    else {
      const first = (low - start) / delta;
      const last = (high - start) / delta;
      near = Math.max(near, Math.min(first, last));
      far = Math.min(far, Math.max(first, last));
      if (near > far) return false;
    }
  }
  return true;
}

function findClearRoute(start: Point, end: Point, obstacles: Box[], bounds: Box): Point[] | undefined {
  const axis = (values: number[], min: number, max: number) => [...new Set(values.filter(value => value >= min && value <= max))].sort((a, b) => a - b);
  const xs = axis([start.x, end.x, bounds.left, bounds.right, ...obstacles.flatMap(box => [box.left - 7, box.right + 7])], bounds.left, bounds.right);
  const ys = axis([start.y, end.y, bounds.top, bounds.bottom, ...obstacles.flatMap(box => [box.top - 7, box.bottom + 7])], bounds.top, bounds.bottom);
  const columns = xs.length;
  const startId = ys.indexOf(start.y) * columns + xs.indexOf(start.x);
  const endId = ys.indexOf(end.y) * columns + xs.indexOf(end.x);
  if (startId < 0 || endId < 0) return;
  const pointAt = (id: number) => ({ x: xs[id % columns], y: ys[Math.floor(id / columns)] });
  const costs = new Float64Array(xs.length * ys.length).fill(Infinity);
  const parents = new Int32Array(costs.length).fill(-1);
  const visited = new Uint8Array(costs.length);
  const queue: { id: number; score: number }[] = [];
  const push = (entry: { id: number; score: number }) => {
    queue.push(entry);
    let index = queue.length - 1;
    while (index > 0) {
      const parent = Math.floor((index - 1) / 2);
      if (queue[parent].score <= entry.score) break;
      queue[index] = queue[parent];
      index = parent;
    }
    queue[index] = entry;
  };
  const pop = () => {
    const first = queue[0];
    const last = queue.pop();
    if (queue.length && last) {
      let index = 0;
      while (index * 2 + 1 < queue.length) {
        let child = index * 2 + 1;
        if (child + 1 < queue.length && queue[child + 1].score < queue[child].score) child++;
        if (queue[child].score >= last.score) break;
        queue[index] = queue[child];
        index = child;
      }
      queue[index] = last;
    }
    return first;
  };
  costs[startId] = 0;
  push({ id: startId, score: 0 });
  while (queue.length) {
    const { id } = pop();
    if (visited[id]) continue;
    if (id === endId) {
      const route = [end];
      let cursor = id;
      while (parents[cursor] !== -1) { cursor = parents[cursor]; route.push(pointAt(cursor)); }
      route.reverse();
      return route.filter((point, i) => i === 0 || i === route.length - 1 || !(route[i - 1].x === point.x && route[i + 1].x === point.x || route[i - 1].y === point.y && route[i + 1].y === point.y));
    }
    visited[id] = 1;
    const point = pointAt(id);
    const neighbors = [id - columns, id + columns];
    if (id % columns > 0) neighbors.push(id - 1);
    if (id % columns < columns - 1) neighbors.push(id + 1);
    for (const next of neighbors) {
      if (next < 0 || next >= costs.length || visited[next]) continue;
      const destination = pointAt(next);
      if (obstacles.some(box => segmentHitsBox(point, destination, box))) continue;
      const cost = costs[id] + Math.abs(point.x - destination.x) + Math.abs(point.y - destination.y);
      if (cost >= costs[next]) continue;
      costs[next] = cost;
      parents[next] = id;
      push({ id: next, score: cost + Math.abs(destination.x - end.x) + Math.abs(destination.y - end.y) });
    }
  }
}

function routeConnector(start: Point, end: Point, obstacles: Box[], bounds: Box): Point[] {
  const candidates = [
    [start, end],
    [start, { x: start.x, y: end.y }, end],
    [start, { x: end.x, y: start.y }, end],
  ];
  // Rails beside the occupied rectangles let leaders go around, not through, labels.
  const railsX = [bounds.left + 8, bounds.right - 8, ...obstacles.flatMap(box => [box.left - 8, box.right + 8])];
  const railsY = [bounds.top + 8, bounds.bottom - 8, ...obstacles.flatMap(box => [box.top - 8, box.bottom + 8])];
  railsX.filter(x => x >= bounds.left && x <= bounds.right).forEach(x => candidates.push([start, { x, y: start.y }, { x, y: end.y }, end]));
  railsY.filter(y => y >= bounds.top && y <= bounds.bottom).forEach(y => candidates.push([start, { x: start.x, y }, { x: end.x, y }, end]));
  let best = candidates[0];
  let bestScore = Infinity;
  for (const candidate of candidates) {
    let score = (candidate.length - 2) * 12;
    for (let i = 1; i < candidate.length; i++) {
      const a = candidate[i - 1];
      const b = candidate[i];
      score += Math.hypot(b.x - a.x, b.y - a.y);
      score += obstacles.filter(box => segmentHitsBox(a, b, box)).length * 100000;
    }
    if (score < bestScore) { best = candidate; bestScore = score; }
  }
  return bestScore >= 100000 ? findClearRoute(start, end, obstacles, bounds) ?? best : best;
}

export function layoutAnnotations(scene: HTMLElement) {
  const origin = scene.getBoundingClientRect();
  const bounds = { left: origin.left + 14, top: origin.top + 14, right: origin.right - 14, bottom: origin.bottom - 14 };
  const protectedElements = [...scene.querySelectorAll<HTMLElement>('.demo-brand,.demo-nav > div span,.demo-nav > .demo-cta,.demo-eyebrow,.demo-copy h1,.demo-description,.demo-copy > .demo-cta,.demo-art figcaption,.art-caption,.art-plus,.demo-bottom > span,.story-controls')];
  const content = protectedElements.flatMap(element => {
    element.dataset.annotationObstacle = '';
    if (!element.getBoundingClientRect().width) return [];
    return element.matches('button,.story-controls') ? [element.getBoundingClientRect()] : textBoxes(element);
  });
  const dividers = [...scene.querySelectorAll<HTMLElement>('.demo-nav,.demo-bottom')].map(element => {
    const rect = element.getBoundingClientRect();
    const y = element.matches('.demo-nav') ? rect.bottom : rect.top;
    return { left: rect.left, right: rect.right, top: y - 2, bottom: y + 2 };
  });
  const occupied: Box[] = [];
  const placed: { note: HTMLElement; connector: SVGGElement; target: DOMRect; box: Box }[] = [];

  for (const note of scene.querySelectorAll<HTMLElement>('[data-note]')) {
    for (const property of ['left', 'top', 'right', 'bottom', 'width']) note.style.removeProperty(property);
    const target = scene.querySelector<HTMLElement>(note.dataset.target ?? '');
    const connector = scene.querySelector<SVGGElement>(`[data-connector="${note.dataset.note}"]`);
    if (!target || !connector) continue;
    const preferred = note.getBoundingClientRect();
    const rect = target.getBoundingClientRect();
    if (!preferred.width || !rect.width || !rect.height) { connector.style.display = 'none'; continue; }
    connector.style.display = '';
    const width = Math.min(preferred.width, bounds.right - bounds.left);
    const height = preferred.height;
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const candidates = [
      boxAt(preferred.left, preferred.top, width, height),
      boxAt(centerX - width / 2, rect.top - height - 26, width, height),
      boxAt(centerX - width / 2, rect.bottom + 26, width, height),
      boxAt(rect.right + 26, centerY - height / 2, width, height),
      boxAt(rect.left - width - 26, centerY - height / 2, width, height),
    ];
    // Scan the actual free space as well, so short/mobile viewports do not rely
    // on desktop percentages or allow one label to cover another.
    for (let y = bounds.top; y + height <= bounds.bottom; y += 14) {
      for (let x = bounds.left; x + width <= bounds.right; x += 14) candidates.push(boxAt(x, y, width, height));
    }
    let best = candidates[0];
    let bestScore = Infinity;
    for (const [index, rawCandidate] of candidates.entries()) {
      const candidate = origin.width < 600 && index >= 5
        ? boxAt(rawCandidate.left < origin.left + origin.width / 2 - width / 2 ? bounds.left : bounds.right - width, rawCandidate.top, width, height)
        : rawCandidate;
      if (candidate.left < bounds.left || candidate.right > bounds.right || candidate.top < bounds.top || candidate.bottom > bounds.bottom) continue;
      const collisions = [...content, ...dividers].filter(box => overlaps(candidate, box, 9)).length + occupied.filter(box => overlaps(candidate, box, 12)).length * 5;
      const distance = Math.hypot(candidate.left + width / 2 - centerX, candidate.top + height / 2 - centerY);
      const displacement = Math.hypot(candidate.left - preferred.left, candidate.top - preferred.top);
      const score = collisions * 1000000 + distance + displacement * .35;
      if (score < bestScore) { best = candidate; bestScore = score; }
    }
    note.style.left = `${best.left - origin.left}px`;
    note.style.top = `${best.top - origin.top}px`;
    note.style.right = 'auto';
    note.style.bottom = 'auto';
    note.style.width = `${width}px`;
    occupied.push(best);
    placed.push({ note, connector, target: rect, box: best });
  }

  for (const item of placed) {
    const { box, target, connector, note } = item;
    const center = { x: (box.left + box.right) / 2, y: (box.top + box.bottom) / 2 };
    const gap = 10;
    // End dots are outside the target, with a visible gap from its lettering.
    const endpoints = [
      { x: clamp(target.left + 3, target.right - 3, center.x), y: target.top - gap },
      { x: clamp(target.left + 3, target.right - 3, center.x), y: target.bottom + gap },
      { x: target.left - gap, y: clamp(target.top + 3, target.bottom - 3, center.y) },
      { x: target.right + gap, y: clamp(target.top + 3, target.bottom - 3, center.y) },
    ];
    const insideLabel = { left: box.left + 5, top: box.top + 5, right: box.right - 5, bottom: box.bottom - 5 };
    const obstacles = [...content, insideLabel, ...occupied.filter(other => other !== box)];
    const possibleEnds = note.dataset.note === 'brand' ? [{ x: target.right + gap, y: target.bottom - 8 }] : endpoints.sort((a, b) => Math.hypot(a.x - center.x, a.y - center.y) - Math.hypot(b.x - center.x, b.y - center.y));
    let end = possibleEnds[0];
    let route: Point[] = [];
    let bestScore = Infinity;
    for (const candidate of possibleEnds) {
      if (obstacles.some(obstacle => segmentHitsBox(candidate, candidate, obstacle))) continue;
      const start = { x: clamp(box.left, box.right, candidate.x), y: clamp(box.top, box.bottom, candidate.y) };
      const path = routeConnector(start, candidate, obstacles, { left: origin.left + 5, top: origin.top + 5, right: origin.right - 5, bottom: origin.bottom - 5 });
      let score = 0;
      for (let i = 1; i < path.length; i++) {
        score += Math.hypot(path[i].x - path[i - 1].x, path[i].y - path[i - 1].y);
        score += obstacles.filter(obstacle => segmentHitsBox(path[i - 1], path[i], obstacle)).length * 100000;
      }
      if (score < bestScore) { bestScore = score; end = candidate; route = path; }
      if (score < 100000) break;
    }
    connector.querySelector('path')?.setAttribute('d', route.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x - origin.left} ${point.y - origin.top}`).join(' '));
    connector.querySelector('circle')?.setAttribute('cx', String(end.x - origin.left));
    connector.querySelector('circle')?.setAttribute('cy', String(end.y - origin.top));
  }
  scene.dataset.annotationSize = `${scene.clientWidth}x${scene.clientHeight}`;
}
