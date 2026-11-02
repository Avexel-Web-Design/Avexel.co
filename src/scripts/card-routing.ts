export interface CardBox { x: number; y: number; width: number; height: number; }
interface Point { x: number; y: number; }
export interface CardStop extends CardBox { offset: number; }
const gap = 8;
const center = (box: CardBox): Point => ({ x: box.x + box.width / 2, y: box.y + box.height / 2 });
const distance = (a: Point, b: Point) => Math.hypot(a.x - b.x, a.y - b.y);
const at = (point: Point, width: number, height: number): CardBox => ({ x: point.x - width / 2, y: point.y - height / 2, width, height });

// Intersect the four linear inequalities for two moving rectangles. Unlike
// frame sampling, this also detects collisions between rendered frames.
export function pathsOverlap(a: CardBox, b: CardBox, c: CardBox, d: CardBox, clearance = 0): boolean {
  let low = 0, high = 1;
  for (const [start, end] of [
    [a.x + a.width + clearance - c.x, b.x + b.width + clearance - d.x],
    [c.x + c.width + clearance - a.x, d.x + d.width + clearance - b.x],
    [a.y + a.height + clearance - c.y, b.y + b.height + clearance - d.y],
    [c.y + c.height + clearance - a.y, d.y + d.height + clearance - b.y],
  ]) {
    if (start <= 0 && end <= 0) return false;
    if (start > 0 && end > 0) continue;
    const crossing = -start / (end - start);
    if (end > start) low = Math.max(low, crossing);
    else high = Math.min(high, crossing);
  }
  return low < high;
}

function route(start: Point, end: Point, obstacles: CardBox[], width: number, height: number, area: CardBox): Point[] | undefined {
  const clear = (a: Point, b: Point) => obstacles.every(box => !pathsOverlap(at(a, width, height), at(b, width, height), box, box, gap));
  if (clear(start, end)) return [start, end];
  // Visibility graph around the Minkowski-expanded stationary cards. The extra
  // pixel keeps floating-point and compositor rounding away from touching edges.
  const corners = obstacles.flatMap(box => {
    const left = box.x - width / 2 - gap - 1, right = box.x + box.width + width / 2 + gap + 1;
    const top = box.y - height / 2 - gap - 1, bottom = box.y + box.height + height / 2 + gap + 1;
    return [{ x: left, y: top }, { x: right, y: top }, { x: left, y: bottom }, { x: right, y: bottom }];
  }).filter(point => point.x - width / 2 >= area.x && point.x + width / 2 <= area.x + area.width
    && point.y - height / 2 >= area.y && point.y + height / 2 <= area.y + area.height);
  const nodes = [start, end, ...corners];
  const costs = nodes.map(() => Infinity), previous = nodes.map(() => -1), visited = new Set<number>();
  costs[0] = 0;
  while (visited.size < nodes.length) {
    let current = -1;
    nodes.forEach((_, index) => { if (!visited.has(index) && (current < 0 || costs[index] < costs[current])) current = index; });
    if (current < 0 || !Number.isFinite(costs[current])) return undefined;
    if (current === 1) {
      const result = [];
      for (let index = 1; index >= 0; index = previous[index]) result.unshift(nodes[index]);
      return result;
    }
    visited.add(current);
    nodes.forEach((point, index) => {
      const cost = costs[current] + distance(nodes[current], point);
      if (!visited.has(index) && cost < costs[index] && clear(nodes[current], point)) { costs[index] = cost; previous[index] = current; }
    });
  }
}

/** All cards contract inside their original footprints, travel one at a time
 * through unoccupied waypoints, then expand inside disjoint final footprints.
 * Parking avoids deadlocks when two cards exchange the same destination. */
export function planCards(before: CardBox[], after: CardBox[], forbidden: CardBox[] = []): CardStop[][] | undefined {
  if (before.every((box, i) => before.every((other, j) => i >= j || !pathsOverlap(box, after[i], other, after[j], 2)))) return undefined;
  const left = Math.min(...before.concat(after).map(box => box.x));
  const top = Math.min(...before.concat(after).map(box => box.y));
  const right = Math.max(...before.concat(after).map(box => box.x + box.width));
  const bottom = Math.max(...before.concat(after).map(box => box.y + box.height));
  for (const scale of [2, 1.5, 1, .65, .35, .15]) {
    const width = Math.min(128 * scale, ...before.concat(after).map(box => box.width));
    const height = Math.min(56 * scale, ...before.concat(after).map(box => box.height));
    const starts = before.map(box => at(center(box), width, height));
    const goals = after.map(box => at(center(box), width, height));
    // A scrolled mobile card can already occupy the viewport's header area.
    // Don't reserve that area until it's actually free of travel endpoints.
    const obstacles = forbidden.filter(box => starts.concat(goals).every(other => !pathsOverlap(box, box, other, other, gap)));
    const parking: CardBox[] = [];
    for (let y = top + height / 2 + gap; y < bottom - height / 2 && parking.length < before.length; y += height + gap * 2) {
      for (let x = left + width / 2 + gap; x < right - width / 2 && parking.length < before.length; x += width + gap * 2) {
        const box = at({ x, y }, width, height);
        if (starts.concat(goals, parking, obstacles).every(other => !pathsOverlap(box, box, other, other, gap * 2))) parking.push(box);
      }
    }
    type Move = { index: number; path: Point[]; length: number };
    const moveTo = (index: number, current: CardBox[], destination: CardBox): Move | undefined => {
      const path = route(center(current[index]), center(destination), current.filter((_, i) => i !== index).concat(obstacles), width, height, { x: left, y: top, width: right - left, height: bottom - top });
      return path ? { index, path, length: path.slice(1).reduce((sum, point, i) => sum + distance(path[i], point), 0) } : undefined;
    };
    const direct = (current: CardBox[], remaining: number[]): Move[] | undefined => {
      if (!remaining.length) return [];
      for (const index of remaining) {
        const move = moveTo(index, current, goals[index]);
        if (!move) continue;
        const next = [...current]; next[index] = goals[index];
        const rest = direct(next, remaining.filter(i => i !== index));
        if (rest) return [move, ...rest];
      }
    };
    const current = [...starts];
    const moves: Move[] = direct(current, current.map((_, i) => i)) ?? [];
    let failed = false;
    for (const destinations of moves.length ? [] : [parking, goals]) {
      if (parking.length !== before.length) { failed = true; break; }
      for (let index = 0; index < current.length; index++) {
        const move = moveTo(index, current, destinations[index]);
        if (!move) { failed = true; break; }
        moves.push(move);
        current[index] = destinations[index];
      }
      if (failed) break;
    }
    if (failed) continue;
    const total = moves.reduce((sum, move) => sum + move.length, 0);
    const tracks = before.map((box, i) => [{ ...box, offset: 0 }, { ...starts[i], offset: .22 }]);
    let elapsed = 0;
    const offset = () => Math.min(.78, .22 + elapsed / total * .56);
    for (const move of moves) {
      const track = tracks[move.index];
      track.push({ ...at(move.path[0], width, height), offset: offset() });
      for (let index = 1; index < move.path.length; index++) {
        elapsed += distance(move.path[index - 1], move.path[index]);
        track.push({ ...at(move.path[index], width, height), offset: offset() });
      }
    }
    tracks.forEach((track, i) => track.push({ ...goals[i], offset: .78 }, { ...after[i], offset: 1 }));
    return tracks;
  }
  throw new Error('No collision-free card route found');
}
