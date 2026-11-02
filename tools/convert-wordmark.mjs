import { readFile, writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';

// Onshape's sketch export uses closed LINE contours. Join their exact CAD
// endpoints rather than tracing/rasterizing the user's letterforms.
const source = process.argv[2] ?? 'assets/brand/avexel-wordmark.dxf';
const lines = (await readFile(source, 'utf8')).trimEnd().split(/\r?\n/);
const entities = [];
let active = false;
for (let index = 0; index < lines.length; index += 2) {
  const code = Number(lines[index]), value = lines[index + 1].trim();
  if (code === 2 && value === 'ENTITIES') { active = true; continue; }
  if (!active) continue;
  if (code === 0) {
    if (value === 'ENDSEC') break;
    assert.equal(value, 'LINE', `Unsupported DXF entity: ${value}`);
    entities.push(new Map());
  } else entities.at(-1).set(code, value);
}
assert.ok(entities.length, 'The sketch must contain geometry');
const key = point => point.map(value => Math.round(value * 1e7)).join(',');
const segments = entities.map(entity => [[Number(entity.get(10)), Number(entity.get(20))], [Number(entity.get(11)), Number(entity.get(21))]]);
const remaining = new Set(segments);
const contours = [];
while (remaining.size) {
  const first = remaining.values().next().value;
  remaining.delete(first);
  const contour = [...first];
  while (key(contour.at(-1)) !== key(contour[0])) {
    const end = key(contour.at(-1));
    const matches = [...remaining].filter(segment => segment.some(point => key(point) === end));
    assert.equal(matches.length, 1, 'Letter contours must be closed and unambiguous');
    const next = matches[0]; remaining.delete(next);
    contour.push(key(next[0]) === end ? next[1] : next[0]);
  }
  contours.push(contour.slice(0, -1));
}
const points = contours.flat();
const minX = Math.min(...points.map(point => point[0])), maxX = Math.max(...points.map(point => point[0]));
const minY = Math.min(...points.map(point => point[1])), maxY = Math.max(...points.map(point => point[1]));
const scale = 1000 / (maxY - minY);
const number = value => Number(value.toFixed(5));
const path = contour => contour.map(([x, y], index) => `${index ? 'L' : 'M'}${number((x - minX) * scale)} ${number((maxY - y) * scale)}`).join('') + 'Z';
const inside = ([x, y], polygon) => {
  let hit = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i], [xj, yj] = polygon[j];
    if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) hit = !hit;
  }
  return hit;
};
const holes = contours.filter(contour => contours.filter(other => other !== contour && inside(contour[0], other)).length % 2);
const width = number((maxX - minX) * scale);
// Counters stay open so the letterform's own glow shows through them; they are
// not opaque gaps like the logo. The rendered drop-shadow lights the inside.
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} 1000" width="${width}" height="1000" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="${contours.map(path).join('')}"/></svg>\n`;
await writeFile('src/assets/avexel-wordmark.svg', svg);
console.log(`Converted ${segments.length} CAD edges into ${contours.length} closed contours (${holes.length} counters); aspect ratio ${width / 1000}`);
