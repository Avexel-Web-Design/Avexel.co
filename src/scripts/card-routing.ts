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
 * Between those two beats the cards take turns moving through free space, so
 * no card ever passes through another one. */
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
  const total = moves.reduce((sum, move) => sum + Math.max(move.length, 1), 0);
  const window = open - settle - .02;
  let elapsed = 0;
  for (const move of moves) {
    const begin = settle + .01 + (elapsed / total) * window;
    const span = (Math.max(move.length, 1) / total) * window;
    const track = tracks[move.index];
    const size = starts[move.index];
    // Hold the folded size until this card's turn comes round; otherwise the
    // interpolation would start drifting as soon as the previous card moved.
    if (begin > settle + 1e-6) track.push({ ...size, offset: begin, easing: 'linear' });
    const hold = track.length - 1;
    let travelled = 0;
    for (let index = 1; index < move.path.length; index++) {
      travelled += distance(move.path[index - 1], move.path[index]);
      track.push({
        ...at(move.path[index], size.width, size.height),
        offset: begin + (travelled / Math.max(move.length, .001)) * span,
        easing: 'linear',
      });
    }
    // A single straight move is eased across its whole length. A detour is
    // linear between waypoints and only eases as it settles into the slot.
    if (move.path.length === 2) track[hold].easing = easing;
    else track[Math.max(hold, track.length - 2)].easing = easing;
    elapsed += Math.max(move.length, 1);
  }
  tracks.forEach((track, index) => {
    const goal = goals[index];
    const last = track[track.length - 1];
    if (last.offset < open - 1e-6) track.push({ ...goal, offset: open, easing });
    else track[track.length - 1].easing = easing;
    track.push({ ...after[index], offset: 1, easing });
  });
  return tracks;
}
