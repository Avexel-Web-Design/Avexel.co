export interface CardBox { x: number; y: number; width: number; height: number; }
interface Point { x: number; y: number; }
export interface CardStop extends CardBox { offset: number; easing: string; }
export interface ShufflePlan { tracks: CardStop[][]; settle: number; open: number; }

const gap = 8;
const easing = 'cubic-bezier(.65,0,.35,1)';
const center = (box: CardBox): Point => ({ x: box.x + box.width / 2, y: box.y + box.height / 2 });
const distance = (a: Point, b: Point) => Math.hypot(a.x - b.x, a.y - b.y);
const at = (point: Point, width: number, height: number): CardBox => ({ x: point.x - width / 2, y: point.y - height / 2, width, height });
const areaOf = (box: { width: number; height: number }) => box.width * box.height;
const stageOf = (boxes: CardBox[]) => boxes.reduce((best, box, index) => areaOf(box) > areaOf(boxes[best]) ? index : best, 0);
const union = (boxes: CardBox[]): CardBox => {
  const left = Math.min(...boxes.map(box => box.x)), top = Math.min(...boxes.map(box => box.y));
  const right = Math.max(...boxes.map(box => box.x + box.width)), bottom = Math.max(...boxes.map(box => box.y + box.height));
  return { x: left, y: top, width: right - left, height: bottom - top };
};

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

interface Move { index: number; path: Point[]; length: number; }
const pathLength = (path: Point[]) => path.slice(1).reduce((sum, point, index) => sum + distance(path[index], point), 0);
const corners = (box: CardBox, width: number, height: number): CardBox[] => [
  { x: box.x, y: box.y, width, height },
  { x: box.x + box.width - width, y: box.y, width, height },
  { x: box.x, y: box.y + box.height - height, width, height },
  { x: box.x + box.width - width, y: box.y + box.height - height, width, height },
];
const nearest = (options: CardBox[], from: CardBox) => options
  .map(option => ({ option, cost: distance(center(option), center(from)) }))
  .sort((a, b) => a.cost - b.cost).map(entry => entry.option);

function sequence(starts: CardBox[], goals: CardBox[], travel: { width: number; height: number }[], area: CardBox): Move[] | undefined {
  const solve = (current: CardBox[], remaining: number[]): Move[] | undefined => {
    if (!remaining.length) return [];
    const options = remaining.flatMap(index => {
      const path = route(center(current[index]), center(goals[index]), current.filter((_, other) => other !== index), travel[index].width, travel[index].height, area);
      return path ? [{ index, path, length: pathLength(path) }] : [];
    }).sort((a, b) => a.length - b.length);
    for (const move of options) {
      const next = current.map((box, index) => index === move.index ? goals[index] : box);
      const rest = solve(next, remaining.filter(index => index !== move.index));
      if (rest) return [move, ...rest];
    }
    return undefined;
  };
  return solve(starts.map(box => box), starts.map((_, index) => index));
}

/** Cards keep their real card size for the whole journey. Only the card that is
 * leaving its open state folds down to card size, inside its own old footprint,
 * at the corner nearest where it is going. The card that is opening waits
 * inside a corner of its new frame and grows once the others have cleared it.
 * Between those two beats a joint planner moves the cards together through
 * free space. It checks swept rectangles, not just their waypoint positions. */
export function planShuffle(before: CardBox[], after: CardBox[], workspace: CardBox, lane?: number): ShufflePlan | undefined {
  const leaving = stageOf(before);
  const entering = stageOf(after);
  // Never grow during the shuffle: a card only ever gets smaller on the way, so
  // it cannot grow into a neighbour that has not moved yet. A passing lane caps
  // the travel width so two cards can pass side by side on a narrow screen.
  const travel = before.map((box, index) => ({
    width: Math.min(box.width, after[index].width, lane ?? Number.POSITIVE_INFINITY),
    height: Math.min(box.height, after[index].height),
  }));
  const area = union([workspace, ...before, ...after]);
  const startOptions = before.map((box, index) => {
    const size = travel[index];
    if (size.width >= box.width - .5 && size.height >= box.height - .5) return [box];
    return nearest(corners(box, size.width, size.height), after[index]);
  });
  const goalOptions = after.map((box, index) => {
    const size = travel[index];
    if (index !== entering) return [{ x: box.x, y: box.y, width: size.width, height: size.height }];
    return nearest(corners(box, size.width, size.height), before[index]);
  });

  let best: { moves: Move[]; starts: CardBox[]; goals: CardBox[]; cost: number } | undefined;
  const search = (starts: CardBox[], goals: CardBox[]) => {
    const moves = sequence(starts, goals, travel, area);
    if (!moves) return;
    const cost = moves.reduce((sum, move) => sum + move.length, 0);
    if (!best || cost < best.cost) best = { moves, starts, goals, cost };
  };
  // Only the corners that actually change the geometry are worth searching:
  // the frame being vacated and any card that folds down by a real amount. The
  // rest multiply the search without changing the answer.
  const startVars = startOptions.map((list, index) =>
    list.length > 1 && (index === leaving || areaOf(travel[index]) / areaOf(before[index]) < .75) ? list : [list[0]]);
  const goalVars = goalOptions.map((list, index) => index === entering ? list : [list[0]]);
  // Try the nearest folding corner first, but keep looking: the first choice can
  // wall off the corridor the other cards need.
  let attempts = 0;
  const walk = (index: number, starts: CardBox[], goals: CardBox[]) => {
    if (best || attempts > 256) return;
    if (index === startVars.length) { attempts++; search(starts, goals); return; }
    for (const start of startVars[index]) for (const goal of goalVars[index]) {
      const nextStarts = [...starts]; nextStarts[index] = start;
      const nextGoals = [...goals]; nextGoals[index] = goal;
      walk(index + 1, nextStarts, nextGoals);
      if (best) return;
    }
  };
  walk(0, [], []);
  if (!best) return undefined;
  const settle = .24, open = .76;
  const moves = best.moves.filter(move => move.length > .5);
  return { tracks: build(best.starts, best.goals, moves, before, after, settle, open, easing), settle, open };
}

function build(starts: CardBox[], goals: CardBox[], moves: Move[], before: CardBox[], after: CardBox[], settle: number, open: number, easing: string): CardStop[][] {
  const tracks: CardStop[][] = before.map((box, index) => [
    { ...box, offset: 0, easing },
    { ...starts[index], offset: settle, easing: 'linear' },
  ]);
  const frames = together(starts, goals, moves);
  frames.forEach((boxes, frame) => boxes.forEach((box, index) => {
    // All cards use the same clock and interpolation within each joint step.
    // Independent easing could make two safe swept paths collide in between.
    tracks[index].push({ ...box, offset: settle + .01 + frame / Math.max(1, frames.length - 1) * (open - settle - .02), easing: 'linear' });
  }));
  tracks.forEach((track, index) => {
    const goal = goals[index];
    const last = track[track.length - 1];
    if (last.offset < open - 1e-6) track.push({ ...goal, offset: open, easing });
    else track[track.length - 1].easing = easing;
    track.push({ ...after[index], offset: 1, easing });
  });
  return tracks;
}

/** Search the joint progress of the four paths. Advancing multiple cards costs
 * the same as advancing one, so the shortest choreography favours concurrent
 * movement instead of reserving the whole workspace for one card at a time. */
function together(starts: CardBox[], goals: CardBox[], moves: Move[]): CardBox[][] {
  const paths = starts.map((box, index) => {
    const move = moves.find(move => move.index === index);
    if (!move) return [box];
    const points = [box];
    for (let leg = 1; leg < move.path.length; leg++) {
      const first = move.path[leg - 1], last = move.path[leg];
      const steps = Math.max(1, Math.ceil(distance(first, last) / Math.max(move.length / 12, 1)));
      for (let step = 1; step <= steps; step++) points.push(at({
        x: first.x + (last.x - first.x) * step / steps,
        y: first.y + (last.y - first.y) * step / steps,
      }, box.width, box.height));
    }
    points[points.length - 1] = goals[index];
    return points;
  });
  interface State { progress: number[]; frames: number; previous?: State; }
  const target = paths.map(path => path.length - 1);
  const key = (progress: number[]) => progress.join(',');
  const remaining = (state: State) => Math.max(...target.map((end, index) => end - state.progress[index]));
  const score = (state: State) => state.frames + remaining(state);
  const priority = (a: State, b: State) => score(b) - score(a) || remaining(b) - remaining(a);
  const first: State = { progress: starts.map(() => 0), frames: 0 };
  const queue = [first], visited = new Map([[key(first.progress), 0]]);
  const masks = Array.from({ length: (1 << starts.length) - 1 }, (_, index) => index + 1)
    .sort((a, b) => b.toString(2).replaceAll('0', '').length - a.toString(2).replaceAll('0', '').length);
  while (queue.length) {
    const current = queue.pop()!;
    if (current.frames > visited.get(key(current.progress))!) continue;
    if (!remaining(current)) {
      const frames: CardBox[][] = [];
      for (let state: State | undefined = current; state; state = state.previous) frames.unshift(state.progress.map((step, index) => paths[index][step]));
      // Relax the joint path like an elastic band. This spreads each movement
      // across the shared travel window instead of leaving cards parked until
      // their next discrete search step. Every adjustment is checked on both
      // adjoining swept segments, so rounded paths cannot cut through a card.
      for (let pass = 0; pass < 100; pass++) {
        for (let frame = 1; frame < frames.length - 1; frame++) {
          for (let index = 0; index < starts.length; index++) {
            const previous = frames[frame - 1][index], next = frames[frame + 1][index];
            const original = frames[frame][index];
            const candidate = { ...original, x: (previous.x + next.x) / 2, y: (previous.y + next.y) / 2 };
            if (frames[frame].every((box, other) => other === index || (
              !pathsOverlap(previous, candidate, frames[frame - 1][other], box, 2)
              && !pathsOverlap(candidate, next, box, frames[frame + 1][other], 2)
            ))) frames[frame][index] = candidate;
          }
        }
      }
      return frames;
    }
    for (const mask of masks) {
      const progress = current.progress.map((step, index) => step + ((mask & (1 << index)) && step < target[index] ? 1 : 0));
      const nextKey = key(progress), frames = current.frames + 1;
      if ((visited.get(nextKey) ?? Infinity) <= frames) continue;
      const before = current.progress.map((step, index) => paths[index][step]);
      const after = progress.map((step, index) => paths[index][step]);
      let clear = true;
      for (let a = 0; a < starts.length && clear; a++) for (let b = a + 1; b < starts.length; b++) {
        if (pathsOverlap(before[a], after[a], before[b], after[b], 2)) { clear = false; break; }
      }
      if (!clear) continue;
      visited.set(nextKey, frames);
      const state = { progress, frames, previous: current };
      let low = 0, high = queue.length;
      while (low < high) {
        const middle = (low + high) >>> 1;
        if (priority(queue[middle], state) < 0) low = middle + 1;
        else high = middle;
      }
      queue.splice(low, 0, state);
    }
  }
  // The original visibility routes are feasible in sequence by construction.
  // Reaching this branch indicates a planner invariant has been broken.
  throw new Error('No joint card choreography found');
}
