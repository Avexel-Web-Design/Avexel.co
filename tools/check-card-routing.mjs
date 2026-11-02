import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import ts from 'typescript';

// Test the production planner without a browser or a second implementation.
const source = await readFile(new URL('../src/scripts/card-routing.ts', import.meta.url), 'utf8');
const { outputText } = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 } });
const { planCards, pathsOverlap } = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`);
const box = (x, y, width, height) => ({ x, y, width, height });
assert.equal(pathsOverlap(box(0, 0, 10, 10), box(30, 0, 10, 10), box(30, 0, 10, 10), box(0, 0, 10, 10)), true, 'Detect collisions between endpoints');
assert.equal(pathsOverlap(box(0, 0, 10, 10), box(30, 0, 10, 10), box(0, 20, 10, 10), box(30, 20, 10, 10)), false);

function verify(before, after) {
  const tracks = planCards(before, after);
  if (!tracks) {
    before.forEach((box, i) => before.forEach((other, j) => {
      if (i < j) assert.equal(pathsOverlap(box, after[i], other, after[j]), false);
    }));
    return;
  }
  tracks.forEach((track, i) => {
    assert.deepEqual(track[0], { ...before[i], offset: 0 });
    assert.deepEqual(track.at(-1), { ...after[i], offset: 1 });
    track.forEach((stop, j) => { if (j) assert.ok(stop.offset >= track[j - 1].offset); });
  });
  const times = [...new Set(tracks.flatMap(track => track.map(stop => stop.offset)))].sort((a, b) => a - b);
  const position = (track, time) => {
    let index = 0;
    while (index < track.length - 2 && track[index + 1].offset <= time) index++;
    const start = track[index], end = track[index + 1];
    const progress = end.offset === start.offset ? 1 : (time - start.offset) / (end.offset - start.offset);
    return Object.fromEntries(['x', 'y', 'width', 'height'].map(key => [key, start[key] + (end[key] - start[key]) * progress]));
  };
  for (let t = 1; t < times.length; t++) {
    for (let i = 0; i < tracks.length; i++) for (let j = i + 1; j < tracks.length; j++) {
      assert.equal(pathsOverlap(position(tracks[i], times[t - 1]), position(tracks[i], times[t]), position(tracks[j], times[t - 1]), position(tracks[j], times[t])), false, `Swept collision on segment ${t}, cards ${i}/${j}`);
    }
  }
}

const desktop = [box(0, 0, 400, 280), box(416, 0, 400, 280), box(0, 296, 400, 280), box(416, 296, 400, 280)];
const mobile = [box(0, 0, 350, 500), box(0, 512, 350, 70), box(0, 594, 350, 70), box(0, 676, 350, 70)];
const overview = [box(0, 0, 350, 190), box(0, 202, 170, 140), box(182, 202, 168, 140), box(0, 354, 350, 64)];
const permutations = values => values.length ? values.flatMap((value, i) => permutations(values.filter((_, j) => j !== i)).map(rest => [value, ...rest])) : [[]];
let count = 0;
for (const layout of [desktop, mobile, overview]) for (const target of [desktop, mobile, overview]) for (const permutation of permutations([0, 1, 2, 3])) {
  verify(layout, permutation.map(i => target[i])); count++;
}
console.log(`Passed ${count} layout permutations: continuous swept collision checks, exact endpoints and monotonic keyframes.`);
