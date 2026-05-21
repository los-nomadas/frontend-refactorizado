/**
 * Generates all favicon assets from public/favicon.svg using sharp.
 * Run once: node scripts/generate-favicons.mjs
 *
 * Output:
 *   public/favicon.ico          (16x16 + 32x32 multi-size)
 *   public/favicon-16x16.png
 *   public/favicon-32x32.png
 *   public/favicon-96x96.png
 *   public/apple-touch-icon.png (180x180, required by iOS)
 *   public/android-chrome-192x192.png
 *   public/android-chrome-512x512.png
 */

import sharp from 'sharp';
import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dir = dirname(fileURLToPath(import.meta.url));
const publicDir = resolve(__dir, '../public');
const svgPath = resolve(publicDir, 'favicon.svg');
const svgBuffer = readFileSync(svgPath);

const sizes = [
  { name: 'favicon-16x16.png',          size: 16  },
  { name: 'favicon-32x32.png',          size: 32  },
  { name: 'favicon-96x96.png',          size: 96  },
  { name: 'apple-touch-icon.png',       size: 180 },
  { name: 'android-chrome-192x192.png', size: 192 },
  { name: 'android-chrome-512x512.png', size: 512 },
];

console.log('Generating favicon assets...\n');

for (const { name, size } of sizes) {
  const outPath = resolve(publicDir, name);
  await sharp(svgBuffer)
    .resize(size, size)
    .png()
    .toFile(outPath);
  console.log(`  ✓ ${name} (${size}x${size})`);
}

// Build favicon.ico from 16x16 and 32x32 PNGs
// ICO format: 6-byte header + N directory entries (16 bytes each) + image data
const png16 = await sharp(svgBuffer).resize(16, 16).png().toBuffer();
const png32 = await sharp(svgBuffer).resize(32, 32).png().toBuffer();

const icoBuffer = buildIco([png16, png32]);
writeFileSync(resolve(publicDir, 'favicon.ico'), icoBuffer);
console.log('  ✓ favicon.ico  (16x16 + 32x32)');

console.log('\nDone. All assets in public/');

// Minimal ICO builder — embeds PNG images directly (modern ICO format)
function buildIco(pngBuffers) {
  const count = pngBuffers.length;
  const headerSize = 6;
  const dirEntrySize = 16;
  const dirSize = headerSize + count * dirEntrySize;

  const sizes = pngBuffers.map((buf) => {
    const img = sharp(buf);
    return buf.length;
  });

  // Calculate offsets
  let offset = dirSize;
  const offsets = pngBuffers.map((buf) => {
    const o = offset;
    offset += buf.length;
    return o;
  });

  const totalSize = offset;
  const ico = Buffer.alloc(totalSize);

  // ICO header
  ico.writeUInt16LE(0, 0);      // reserved
  ico.writeUInt16LE(1, 2);      // type: 1 = ICO
  ico.writeUInt16LE(count, 4);  // image count

  // Directory entries
  for (let i = 0; i < count; i++) {
    const base = headerSize + i * dirEntrySize;
    const dim = i === 0 ? 16 : 32;
    ico.writeUInt8(dim === 256 ? 0 : dim, base);      // width
    ico.writeUInt8(dim === 256 ? 0 : dim, base + 1);  // height
    ico.writeUInt8(0, base + 2);   // color count (0 = >8bpp)
    ico.writeUInt8(0, base + 3);   // reserved
    ico.writeUInt16LE(1, base + 4); // color planes
    ico.writeUInt16LE(32, base + 6); // bits per pixel
    ico.writeUInt32LE(pngBuffers[i].length, base + 8);  // size
    ico.writeUInt32LE(offsets[i], base + 12);            // offset
  }

  // Image data
  for (let i = 0; i < count; i++) {
    pngBuffers[i].copy(ico, offsets[i]);
  }

  return ico;
}
