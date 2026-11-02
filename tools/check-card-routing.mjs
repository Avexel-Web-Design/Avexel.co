import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import ts from 'typescript';

// Test the production planner without a browser or a second implementation.
const source = await readFile(new URL('../src/scripts/card-routing.ts', import.meta.url), 'utf8');
const { outputText } = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 } });
const { planShuffle, pathsOverlap } = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`);
const box = (x, y, width, height) => ({ x, y, width, height });
assert.equal(pathsOverlap(box(0, 0, 10, 10), box(30, 0, 10, 10), box(30, 0, 10, 10), box(0, 0, 10, 10)), true, 'Detect collisions between endpoints');
assert.equal(pathsOverlap(box(0, 0, 10, 10), box(30, 0, 10, 10), box(0, 20, 10, 10), box(30, 20, 10, 10)), false);

const sample = (track, time) => {
  if (time <= track[0].offset) return track[0];
  for (let index = 0; index < track.length - 1; index++) {
    const start = track[index], end = track[index + 1];
    if (time <= end.offset + 1e-9) {
      const progress = end.offset === start.offset ? 1 : (time - start.offset) / (end.offset - start.offset);
      return Object.fromEntries(['x', 'y', 'width', 'height'].map(key => [key, start[key] + (end[key] - start[key]) * progress]));
    }
  }
  return track.at(-1);
};

function verify(before, after, workspace, lane) {
  const plan = planShuffle(before, after, workspace, lane);
  assert.ok(plan, 'The planner finds a route');
  plan.tracks.forEach((track, index) => {
    const first = track[0], last = track.at(-1);
    assert.deepEqual(Object.fromEntries(['x', 'y', 'width', 'height'].map(key => [key, first[key]])), before[index], 'Track starts exactly on the old card');
    assert.deepEqual(Object.fromEntries(['x', 'y', 'width', 'height'].map(key => [key, last[key]])), after[index], 'Track ends exactly on the new card');
    track.forEach((stop, position) => {
      assert.ok(stop.offset >= 0 && stop.offset <= 1, 'Offsets stay inside the transition');
      assert.ok(stop.easing?.length, 'Every stop carries an easing');
      assert.ok(stop.width >= Math.min(before[index].width, after[index].width, lane ?? Infinity) - .001, 'Cards never shrink below their passing-lane width');
      assert.ok(stop.height >= Math.min(before[index].height, after[index].height) - .001, 'Cards never shrink below their normal card height');
      if (position) assert.ok(stop.offset >= track[position - 1].offset - 1e-9, 'Keyframes never run backwards');
    });
  });
  let concurrent = 0;
  const travel = plan.tracks[0].filter(stop => stop.offset > plan.settle && stop.offset < plan.open);
  for (let step = 1; step < travel.length; step++) {
    const first = travel[step - 1].offset, last = travel[step].offset;
    const before = plan.tracks.map(track => sample(track, first));
    const after = plan.tracks.map(track => sample(track, last));
    concurrent = Math.max(concurrent, before.filter((box, index) => Math.hypot(box.x - after[index].x, box.y - after[index].y) > .01).length);
    for (let a = 0; a < before.length; a++) for (let b = a + 1; b < before.length; b++) {
      assert.equal(pathsOverlap(before[a], after[a], before[b], after[b]), false, 'Joint paths stay clear between keyframes too');
    }
  }
  assert.ok(concurrent >= 2, 'Cards must travel together, not one at a time');
  // Also cover the folding and unfolding phases with a dense frame sweep.
  for (let step = 0; step <= 600; step++) {
    const time = step / 600;
    const boxes = plan.tracks.map(track => sample(track, time));
    for (let a = 0; a < boxes.length; a++) for (let b = a + 1; b < boxes.length; b++) {
      const first = boxes[a], second = boxes[b];
      const overlapX = Math.min(first.x + first.width, second.x + second.width) - Math.max(first.x, second.x);
      const overlapY = Math.min(first.y + first.height, second.y + second.height) - Math.max(first.y, second.y);
      assert.ok(overlapX <= 0 || overlapY <= 0, `Cards ${a}/${b} overlap at ${time.toFixed(3)}`);
    }
  }
}

// The five real view layouts at 1440x900, relative to the workspace. These
// include the same-side swaps that have no direct path: Services<->Work and
// Studio<->Contact.
const layouts = {
  home: [box(0, 402, 877.875, 410), box(893.875, 12, 430.9375, 232), box(893.875, 260, 430.9375, 410), box(893.875, 686, 430.9375, 126)],
  services: [box(0, 84, 877.875, 728), box(893.875, 84, 430.9375, 281.59375), box(893.875, 381.59375, 430.9375, 281.59375), box(893.875, 679.1875, 430.9375, 132.8125)],
  studio: [box(0, 84, 430.9375, 281.59375), box(446.9375, 84, 877.875, 728), box(0, 381.59375, 430.9375, 281.59375), box(0, 679.1875, 430.9375, 132.8125)],
  work: [box(1005.609375, 84, 319.203125, 281.59375), box(1005.609375, 381.59375, 319.203125, 281.59375), box(0, 84, 989.609375, 728), box(1005.609375, 679.1875, 319.203125, 132.8125)],
  contact: [box(0, 84, 430.9375, 281.59375), box(0, 679.1875, 430.9375, 132.8125), box(0, 381.59375, 430.9375, 281.59375), box(446.9375, 84, 877.875, 728)],
};
const workspace = box(0, 0, 1324.8125, 836);
const views = Object.keys(layouts);
let count = 0;
for (const from of views) for (const to of views) {
  if (from !== to) { verify(layouts[from], layouts[to], workspace); count++; }
}
const mobileLayouts = {
  home: [box(0, 237.0625, 350, 243.859375), box(0, 490.921875, 170, 212.078125), box(180, 490.921875, 170, 212.078125), box(0, 713, 350, 64)],
  services: [box(0, 69.71875, 350, 531.6875), box(0, 613.40625, 350, 62.1875), box(0, 687.59375, 350, 62.1875), box(0, 761.78125, 350, 62.1875)],
  studio: [box(0, 879.78125, 350, 62.1875), box(0, 69.71875, 350, 798.0625), box(0, 953.96875, 350, 62.1875), box(0, 1028.15625, 350, 62.1875)],
  work: [box(0, 658.90625, 350, 62.1875), box(0, 733.09375, 350, 62.1875), box(0, 69.71875, 350, 577.1875), box(0, 807.28125, 350, 62.1875)],
  contact: [box(0, 780.015625, 350, 62.1875), box(0, 854.203125, 350, 62.1875), box(0, 928.390625, 350, 62.1875), box(0, 69.71875, 350, 698.296875)],
};
for (const from of views) for (const to of views) {
  if (from !== to) { verify(mobileLayouts[from], mobileLayouts[to], box(0, 0, 350, 792), 169); count++; }
}
console.log(`Passed ${count} real view transitions: exact endpoints, monotonic eased keyframes and collision-free card-size shuffles.`);
