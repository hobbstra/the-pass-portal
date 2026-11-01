// A tenant's brand colour, lifted or deepened into a fill that works on the dark page:
// white text >= 4.5:1 AND the fill itself >= 3:1 against the page, so no ring is needed.
// Works for any colour: it moves HSL lightness only, keeping hue and saturation.
const lin = (v: number) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
const lumRgb = ([r, g, b]: number[]) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
const PAGE = lumRgb([13 / 255, 7 / 255, 22 / 255]);
// white-on-fill >= 4.5 means lum <= 0.1833; fill-vs-page >= 3 means lum >= 3*(PAGE+.05)-.05
const MAX = 1.05 / 4.5 - 0.05;
const MIN = 3 * (PAGE + 0.05) - 0.05;

function toHsl([r, g, b]: number[]) {
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2, d = mx - mn;
  if (!d) return [0, 0, l];
  const s = d / (1 - Math.abs(2 * l - 1));
  const h = mx === r ? ((g - b) / d + (g < b ? 6 : 0)) : mx === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return [h * 60, s, l];
}
function fromHsl(h: number, s: number, l: number) {
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  return [0, 8, 4].map((n) => l - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1)));
}

const INK_DARK = "#1A0F0F";
const rgbOf = (hex: string) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
const hexOf = (c: number[]) => "#" + c.map((v) => Math.round(v * 255).toString(16).padStart(2, "0")).join("");
const contrast = (a: number, b: number) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
const LUM_WHITE = 1, LUM_DARK = lumRgb(rgbOf(INK_DARK));

// Move HSL lightness (hue and saturation kept) until luminance hits `target`.
function shiftTo(hex: string, target: number) {
  const rgb = rgbOf(hex);
  const [h, s, l0] = toHsl(rgb);
  const up = lumRgb(rgb) < target; // luminance rises with HSL lightness
  let lo = up ? l0 : 0, hi = up ? 1 : l0;
  for (let i = 0; i < 30; i++) {
    const mid = (lo + hi) / 2;
    if (lumRgb(fromHsl(h, s, mid)) > target) hi = mid; else lo = mid;
  }
  return hexOf(fromHsl(h, s, (lo + hi) / 2));
}

// Fill for buttons, selected cells and radios. The ORIGINAL colour wins if white text, or
// near-black text, reads on it (4.5:1) and the fill itself is >= 3:1 on the page. Only then is
// lightness shifted. Works for any colour; nothing is special-cased.
// Ruling (feedback 2026-09-21): orange/amber fill only when it IS the tenant's brand. Do not "fix" an amber tenant here.
export function fillFor(hex: string) {
  const L = lumRgb(rgbOf(hex));
  if (contrast(L, PAGE) >= 3) {
    if (contrast(L, LUM_WHITE) >= 4.5) return { fill: hex, ink: "#fff" };
    if (contrast(L, LUM_DARK) >= 4.5) return { fill: hex, ink: INK_DARK };
  }
  return { fill: shiftTo(hex, (MIN + MAX) / 2), ink: "#fff" };
}

// For tinted TEXT on the page (>= 4.5:1). Never reuse the fill for text.
export function textTint(hex: string) {
  const L = lumRgb(rgbOf(hex));
  return contrast(L, PAGE) >= 4.5 ? hex : shiftTo(hex, 4.5 * (PAGE + 0.05) - 0.05 + 0.01);
}

const LAVENDER = "#cdbff0"; // neutral eyebrow colour, so the brand fill is the only accent
const check = (stroke: string) => `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='none' stroke='${encodeURIComponent(stroke)}' stroke-width='2.5'%3E%3Cpath d='M5 10.5l3.5 3.5L15 7'/%3E%3C/svg%3E")`;

export function brandOf(hex: string | null | undefined) {
  if (!hex || !/^#[0-9a-f]{6}$/i.test(hex)) {
    return { fill: "var(--accent-gradient)", ink: "var(--bg)", ring: "none", accent: LAVENDER, text: "var(--accent-cyan)" };
  }
  return { ...fillFor(hex), ring: "none", accent: LAVENDER, text: textTint(hex) };
}

export const brandVars = (hex: string | null | undefined) => {
  const b = brandOf(hex);
  return { "--brand-fill": b.fill, "--brand-ink": b.ink, "--brand-ring": b.ring, "--brand-accent": b.accent, "--brand-check": check(b.ink === "var(--bg)" ? "#0d0716" : b.ink) } as React.CSSProperties;
};
