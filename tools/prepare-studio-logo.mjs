import sharp from 'sharp';

// Preserve the original artwork and transparent exterior. Make only enclosed
// transparent gaps opaque black, so an exterior drop-shadow cannot light them.
const { data, info } = await sharp('public/Logo-nobg-sm.png').ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const { width, height } = info;
const exterior = new Uint8Array(width * height);
const queue = [];
const visit = index => {
  if (exterior[index] || data[index * 4 + 3] > 8) return;
  exterior[index] = 1; queue.push(index);
};
for (let x = 0; x < width; x++) { visit(x); visit((height - 1) * width + x); }
for (let y = 0; y < height; y++) { visit(y * width); visit(y * width + width - 1); }
for (let cursor = 0; cursor < queue.length; cursor++) {
  const index = queue[cursor], x = index % width, y = Math.floor(index / width);
  if (x) visit(index - 1);
  if (x < width - 1) visit(index + 1);
  if (y) visit(index - width);
  if (y < height - 1) visit(index + width);
}
for (let index = 0; index < exterior.length; index++) {
  if (exterior[index]) continue;
  const offset = index * 4, alpha = data[offset + 3] / 255;
  for (let channel = 0; channel < 3; channel++) data[offset + channel] = Math.round(data[offset + channel] * alpha);
  data[offset + 3] = 255;
}
await sharp(data, { raw: { width, height, channels: 4 } }).png().toFile('public/Logo-studio.png');
