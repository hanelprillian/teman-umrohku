import { mkdir, writeFile } from "node:fs/promises";
import { deflateSync } from "node:zlib";

const crcTable = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});

const crc32 = (buffer) => {
  let c = 0xffffffff;
  for (const byte of buffer) c = crcTable[(c ^ byte) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
};

const chunk = (type, data) => {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([length, body, crc]);
};

const hex = (value) => [1, 3, 5].map((i) => parseInt(value.slice(i, i + 2), 16));

// Coordinates are in a 512-unit design space (see scripts/icon.svg).
const shapes = [
  { x: 166, y: 166, w: 180, h: 190, color: hex("#14110f") },
  { x: 166, y: 206, w: 180, h: 26, color: hex("#d9a441") },
  { x: 226, y: 276, w: 34, h: 62, color: hex("#c79a45") },
];
const background = hex("#0f6b5e");
const ring = hex("#5e9e93");

const pixelColor = (u, v) => {
  for (let i = shapes.length - 1; i >= 0; i--) {
    const s = shapes[i];
    if (u >= s.x && u < s.x + s.w && v >= s.y && v < s.y + s.h) return s.color;
  }
  const distance = Math.hypot(u - 256, v - 256);
  if (Math.abs(distance - 178) < 5) {
    const angle = Math.atan2(v - 256, u - 256);
    if (Math.abs(Math.sin(angle * 18)) < 0.35) return ring;
  }
  return background;
};

const render = (size) => {
  const samples = 3;
  const rows = [];
  for (let y = 0; y < size; y++) {
    const row = Buffer.alloc(1 + size * 3);
    for (let x = 0; x < size; x++) {
      const sum = [0, 0, 0];
      for (let sy = 0; sy < samples; sy++) {
        for (let sx = 0; sx < samples; sx++) {
          const u = ((x + (sx + 0.5) / samples) / size) * 512;
          const v = ((y + (sy + 0.5) / samples) / size) * 512;
          const color = pixelColor(u, v);
          for (let c = 0; c < 3; c++) sum[c] += color[c];
        }
      }
      for (let c = 0; c < 3; c++) {
        row[1 + x * 3 + c] = Math.round(sum[c] / (samples * samples));
      }
    }
    rows.push(row);
  }

  const header = Buffer.alloc(13);
  header.writeUInt32BE(size, 0);
  header.writeUInt32BE(size, 4);
  header[8] = 8;
  header[9] = 2;

  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", header),
    chunk("IDAT", deflateSync(Buffer.concat(rows))),
    chunk("IEND", Buffer.alloc(0)),
  ]);
};

await mkdir("public/icons", { recursive: true });
await writeFile("public/icons/icon-512.png", render(512));
await writeFile("public/icons/icon-192.png", render(192));
await writeFile("public/icons/apple-touch-icon.png", render(180));
console.log("icons generated");
