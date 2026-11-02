import { inflateSync } from 'node:zlib';

// Decode the non-interlaced 8-bit RGB/RGBA PNGs returned by Playwright.
export function pngPixels(buffer) {
  const width = buffer.readUInt32BE(16), height = buffer.readUInt32BE(20);
  const channels = buffer[25] === 6 ? 4 : 3;
  if (buffer[24] !== 8 || ![2, 6].includes(buffer[25]) || buffer[28] !== 0) throw new Error('Unsupported screenshot PNG format');
  const chunks = [];
  for (let offset = 8; offset < buffer.length;) {
    const length = buffer.readUInt32BE(offset);
    if (buffer.toString('ascii', offset + 4, offset + 8) === 'IDAT') chunks.push(buffer.subarray(offset + 8, offset + 8 + length));
    offset += length + 12;
  }
  const raw = inflateSync(Buffer.concat(chunks)), stride = width * channels;
  const data = Buffer.alloc(width * height * channels);
  for (let y = 0; y < height; y++) {
    const filter = raw[y * (stride + 1)];
    for (let x = 0; x < stride; x++) {
      const index = y * stride + x;
      const left = x >= channels ? data[index - channels] : 0;
      const up = y ? data[index - stride] : 0;
      const diagonal = y && x >= channels ? data[index - stride - channels] : 0;
      let prediction = 0;
      if (filter === 1) prediction = left;
      if (filter === 2) prediction = up;
      if (filter === 3) prediction = Math.floor((left + up) / 2);
      if (filter === 4) {
        const p = left + up - diagonal;
        const a = Math.abs(p - left), b = Math.abs(p - up), c = Math.abs(p - diagonal);
        prediction = a <= b && a <= c ? left : b <= c ? up : diagonal;
      }
      data[index] = (raw[y * (stride + 1) + x + 1] + prediction) & 255;
    }
  }
  return { data, width, height, channels };
}

export function regionDifference(a, b, rect) {
  let difference = 0, count = 0;
  for (let y = Math.max(0, Math.ceil(rect.y)); y < Math.min(a.height, Math.floor(rect.y + rect.height)); y++) {
    for (let x = Math.max(0, Math.ceil(rect.x)); x < Math.min(a.width, Math.floor(rect.x + rect.width)); x++) {
      for (let channel = 0; channel < 3; channel++) {
        difference += Math.abs(a.data[(y * a.width + x) * a.channels + channel] - b.data[(y * b.width + x) * b.channels + channel]);
        count++;
      }
    }
  }
  return count ? difference / count : 0;
}
