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

export function tint(hex: string) {
  const rgb = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  const L = lumRgb(rgb);
  if (L >= MIN && L <= MAX) return hex;
  const [h, s, l0] = toHsl(rgb);
  const target = (MIN + MAX) / 2;
  let lo = L > MAX ? 0 : l0, hi = L > MAX ? l0 : 1; // luminance rises with HSL lightness
  for (let i = 0; i < 30; i++) {
    const mid = (lo + hi) / 2;
    if (lumRgb(fromHsl(h, s, mid)) > target) hi = mid; else lo = mid;
  }
  return "#" + fromHsl(h, s, (lo + hi) / 2).map((v) => Math.round(v * 255).toString(16).padStart(2, "0")).join("");
}

const LAVENDER = "#cdbff0"; // neutral eyebrow colour, so the brand tint is the only accent

export function brandOf(hex: string | null | undefined) {
  if (!hex || !/^#[0-9a-f]{6}$/i.test(hex)) {
    return { fill: "var(--accent-gradient)", ink: "var(--bg)", ring: "none", accent: LAVENDER, tint: "var(--accent-cyan)" };
  }
  const fill = tint(hex);
  return { fill, ink: "#fff", ring: "none", accent: LAVENDER, tint: fill };
}

export const brandVars = (hex: string | null | undefined) => {
  const b = brandOf(hex);
  return { "--brand-fill": b.fill, "--brand-ink": b.ink, "--brand-ring": b.ring, "--brand-accent": b.accent } as React.CSSProperties;
};
