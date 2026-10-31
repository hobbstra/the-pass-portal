// A tenant's brand colour, made safe for the dark page. Null or malformed falls back to the portal accent.
const lum = (hex: string) => {
  const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
const PAGE = lum("#0d0716");

export function brandOf(hex: string | null | undefined) {
  if (!hex || !/^#[0-9a-f]{6}$/i.test(hex)) {
    return { fill: "var(--accent-gradient)", ink: "var(--bg)", ring: "none", accent: "var(--accent-cyan)" };
  }
  const L = lum(hex);
  const vsPage = (L + 0.05) / (PAGE + 0.05);
  return {
    fill: hex,
    ink: L > 0.4 ? "#0d0716" : "#fff", // white per the brief, unless the brand is light enough that white would not read
    ring: vsPage < 3 ? "0 0 0 1px rgba(242,233,255,0.5)" : "none", // dark brand on the dark page: a deliberate light edge
    accent: vsPage >= 4.5 ? hex : "var(--accent-cyan)",
  };
}

export const brandVars = (hex: string | null | undefined) => {
  const b = brandOf(hex);
  return { "--brand-fill": b.fill, "--brand-ink": b.ink, "--brand-ring": b.ring, "--brand-accent": b.accent } as React.CSSProperties;
};
