import * as fontkit from "fontkit";
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const mediaDir = path.join(root, ".next/static/media");
const outDir = path.join(root, "public/brand");
fs.mkdirSync(outDir, { recursive: true });

const INK = "#2F2633";
const PAPER = "#F4EFE7";
const WORDMARK = "Inner Awareness";
const NEEDED = [...new Set(WORDMARK.replace(/\s/g, "").split(""))];

// --- 1. select a Cormorant Garamond weight-600 subset that covers our letters ---
function weight600Files() {
  const cssPath = fs
    .readdirSync(path.join(root, ".next/static/chunks"))
    .find((f) => /cormorant_garamond.*single\.css$/.test(f));
  const css = fs.readFileSync(path.join(root, ".next/static/chunks", cssPath), "utf8");
  const faces = css.split("@font-face");
  const files = [];
  for (const face of faces) {
    if (!/font-weight:\s*600/.test(face)) continue;
    const m = face.match(/media\/([^"')]+\.woff2)/);
    if (m) files.push(m[1]);
  }
  return files;
}

function pickFont() {
  const preferred = weight600Files();
  for (const f of preferred) {
    try {
      const font = fontkit.openSync(path.join(mediaDir, f));
      const covers = NEEDED.every((ch) => {
        const g = font.glyphForCodePoint(ch.codePointAt(0));
        return g && g.id !== 0;
      });
      if (covers) return { f, font, weight: 600 };
    } catch {
      /* skip */
    }
  }
  throw new Error("No covering Cormorant 600 subset found");
}

const { f: fontFile, font, weight } = pickFont();
console.log(`Using ${fontFile} (weight ${weight})`);

// --- 2. outline the wordmark to a tight <g> of glyph paths ---
const FONT_PX = 120;
const scale = FONT_PX / font.unitsPerEm;
const run = font.layout(WORDMARK);
const bbox = run.bbox; // font units, y-up

let penX = 0;
const glyphPaths = run.glyphs
  .map((g, i) => {
    const d = g.path.toSVG();
    const el = d ? `<path transform="translate(${penX} 0)" d="${d}"/>` : "";
    penX += run.positions[i].xAdvance;
    return el;
  })
  .join("");

const wmW = (bbox.maxX - bbox.minX) * scale;
const wmH = (bbox.maxY - bbox.minY) * scale;
// place tight box top-left at (0,0); font is y-up so flip
const wordmarkGroup = `<g transform="translate(${(-bbox.minX * scale).toFixed(3)} ${(bbox.maxY * scale).toFixed(3)}) scale(${scale.toFixed(5)} ${(-scale).toFixed(5)})">${glyphPaths}</g>`;

// --- 3. the crescent reflection mark (vector, y-down 100-box) ---
// Outer ring of awareness + an inner inward-turning crescent, the crescent
// built from a mask (a filled circle minus an offset circle) so the geometry
// is exact rather than hand-derived arc flags.
let markSeq = 0;
function mark(color) {
  const id = `crescent-${markSeq++}`;
  return `
    <defs>
      <mask id="${id}" maskUnits="userSpaceOnUse" x="0" y="0" width="100" height="100">
        <rect x="0" y="0" width="100" height="100" fill="black"/>
        <circle cx="50" cy="50" r="30" fill="white"/>
        <circle cx="66" cy="50" r="27" fill="black"/>
      </mask>
    </defs>
    <circle cx="50" cy="50" r="40" fill="none" stroke="${color}" stroke-width="3" opacity="0.4"/>
    <rect x="0" y="0" width="100" height="100" fill="${color}" mask="url(#${id})"/>`;
}

// --- 4. compose the horizontal lockup ---
const MARK = 92; // rendered mark height
const GAP = 34;
const PAD = 56;
const contentH = Math.max(MARK, wmH);
const W = Math.round(PAD * 2 + MARK + GAP + wmW);
const H = Math.round(PAD * 2 + contentH);

const markY = PAD + (contentH - MARK) / 2;
const wmY = PAD + (contentH - wmH) / 2;
const wmX = PAD + MARK + GAP;

function lockup({ bg, fg }) {
  const bgRect = bg
    ? `<rect x="0" y="0" width="${W}" height="${H}" rx="28" fill="${bg}"/>`
    : "";
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" fill="none">
  ${bgRect}
  <g transform="translate(${PAD} ${markY.toFixed(2)}) scale(${(MARK / 100).toFixed(5)})">${mark(fg)}</g>
  <g transform="translate(${wmX.toFixed(2)} ${wmY.toFixed(2)})" fill="${fg}">${wordmarkGroup}</g>
</svg>`;
}

// --- symbol only (the crescent mark on a padded square) ---
function symbol({ bg, fg }) {
  const S = 512;
  const inset = 96; // padding so the 100-box mark sits centered with breathing room
  const box = S - inset * 2;
  const bgEl = bg ? `<rect x="0" y="0" width="${S}" height="${S}" rx="${S * 0.22}" fill="${bg}"/>` : "";
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${S}" height="${S}" viewBox="0 0 ${S} ${S}" fill="none">
  ${bgEl}
  <g transform="translate(${inset} ${inset}) scale(${(box / 100).toFixed(5)})">${mark(fg)}</g>
</svg>`;
}

const variants = [
  // full lockup: mark + "Inner Awareness"
  { name: "inner-awareness-logo", svg: lockup({ bg: null, fg: INK }), w: W }, // transparent, ink
  { name: "inner-awareness-logo-paper", svg: lockup({ bg: PAPER, fg: INK }), w: W }, // ink on Moon Paper
  { name: "inner-awareness-logo-reversed", svg: lockup({ bg: INK, fg: PAPER }), w: W }, // Moon Paper on Plum Ink
  // symbol only: the crescent reflection mark
  { name: "inner-awareness-symbol", svg: symbol({ bg: null, fg: INK }), w: 512 }, // transparent, ink
  { name: "inner-awareness-symbol-paper", svg: symbol({ bg: PAPER, fg: INK }), w: 512 }, // ink on Moon Paper
  { name: "inner-awareness-symbol-reversed", svg: symbol({ bg: INK, fg: PAPER }), w: 512 }, // paper on ink
];

for (const v of variants) {
  fs.writeFileSync(path.join(outDir, `${v.name}.svg`), v.svg);
  // rasterize @3x for a crisp PNG; text is outlined so no font dependency
  await sharp(Buffer.from(v.svg), { density: 288 })
    .resize({ width: v.w * 3 })
    .png()
    .toFile(path.join(outDir, `${v.name}.png`));
  console.log(`wrote ${v.name}.svg + .png`);
}

console.log("done");
