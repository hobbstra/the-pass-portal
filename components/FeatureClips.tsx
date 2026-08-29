"use client";

import { useEffect, useRef, useState } from "react";

function ClipFrame({
  children,
  frameRef,
}: {
  children: React.ReactNode;
  frameRef?: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <div
      ref={frameRef}
      className="relative rounded-lg border p-4 w-full max-w-[280px] overflow-hidden"
      style={{ borderColor: "var(--border)", background: "var(--bg-elevated)" }}
      aria-hidden="true"
    >
      {children}
    </div>
  );
}

// Each clip's loop is driven by its own mount-time useEffect, but the
// component actually mounts as soon as the page loads (the pinned sections
// just haven't scrolled into view yet) — so without this, users who scroll
// down land mid-cycle or on the settled end-state instead of seeing a fresh
// run start. This gates the loop on real viewport visibility so scrolling a
// clip into view always restarts its cycle from the beginning.
function useInView<T extends HTMLElement>(threshold = 0.35) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold });
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);
  return [ref, inView] as const;
}

function usePrefersReducedMotion() {
  // Must start `false` to match the server-rendered markup (SSR has no
  // matchMedia) — reading the real preference happens in the effect below,
  // which only runs after hydration. A synchronous lazy-init read here
  // would mismatch the server's render whenever the user's OS preference
  // is actually "reduce", breaking hydration.
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

const SHIFT_SLOTS = [1, 1, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 1, 0];
const SHIFT_DAYS = ["M", "T", "W", "T", "F", "S", "S"];
// Ordinal position of each on-slot within the fill sequence (-1 for off-slots).
const SHIFT_ORDER: number[] = (() => {
  let n = 0;
  return SHIFT_SLOTS.map((on) => (on ? n++ : -1));
})();
const TOTAL_SHIFTS = SHIFT_SLOTS.filter(Boolean).length;

export function ScheduleClip() {
  const reduced = usePrefersReducedMotion();
  const [frameRef, inView] = useInView<HTMLDivElement>();
  const [filled, setFilled] = useState(0);
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    if (reduced) {
      setFilled(TOTAL_SHIFTS);
      return;
    }
    if (!inView) return;
    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];

    const FILL_STEP_MS = 200;
    const HOLD_MS = 2400;

    const run = () => {
      setFilled(0);
      for (let step = 1; step <= TOTAL_SHIFTS; step++) {
        timers.push(
          setTimeout(() => {
            if (!cancelled) setFilled(step);
          }, step * FILL_STEP_MS)
        );
      }
      timers.push(
        setTimeout(() => {
          if (cancelled) return;
          setCycle((c) => c + 1);
          run();
        }, TOTAL_SHIFTS * FILL_STEP_MS + HOLD_MS)
      );
    };
    run();

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [reduced, inView]);

  const allFilled = filled >= TOTAL_SHIFTS;

  return (
    <ClipFrame frameRef={frameRef}>
      <div className="grid grid-cols-7 gap-1 mb-2">
        {SHIFT_DAYS.map((d, i) => (
          <span key={i} className="text-[10px] text-center font-sans-ui" style={{ color: "var(--ink-muted)" }}>
            {d}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {SHIFT_SLOTS.map((on, i) => {
          const revealed = on ? SHIFT_ORDER[i] < filled : false;
          return (
            <div
              key={`${cycle}-${i}-${revealed ? 1 : 0}`}
              className={revealed ? "clip-pop h-6 rounded-sm" : "h-6 rounded-sm"}
              style={{
                background: revealed ? (i % 2 === 0 ? "var(--accent-pink)" : "var(--accent-cyan)") : "transparent",
                opacity: revealed ? 0.75 : 1,
                border: revealed ? "none" : `1px dashed var(--border)`,
              }}
            />
          );
        })}
      </div>
      <div className="mt-3 flex items-center justify-between text-[10px] font-sans-ui" style={{ color: "var(--ink-muted)" }}>
        <span>
          {filled}/{TOTAL_SHIFTS} shifts filled
        </span>
        {allFilled && (
          <span
            key={cycle}
            className="clip-badge text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide"
            style={{ color: "var(--accent-cyan)", background: "rgba(255,255,255,0.06)" }}
          >
            All filled
          </span>
        )}
      </div>
    </ClipFrame>
  );
}

const INVENTORY_STATIC_ROWS = [
  { label: "Flour", pct: 82 },
  { label: "Sea salt", pct: 91 },
];

// 0: low stock, 1: order placed, 2: restocked above par
const RYE_STAGES = [
  { pct: 34, badge: "Low stock", badgeColor: "var(--accent-pink)" },
  { pct: 34, badge: "Order placed", badgeColor: "var(--accent-cyan)" },
  { pct: 88, badge: null, badgeColor: "var(--accent-cyan)" },
];

export function InventoryClip() {
  const reduced = usePrefersReducedMotion();
  const [frameRef, inView] = useInView<HTMLDivElement>();
  const [stage, setStage] = useState(reduced ? 2 : 0);
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    if (reduced) {
      setStage(2);
      return;
    }
    if (!inView) return;
    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];

    const STAGE_MS = 1100;
    const HOLD_MS = 2200;

    const run = () => {
      setStage(0);
      timers.push(
        setTimeout(() => {
          if (cancelled) return;
          setStage(1);
          timers.push(
            setTimeout(() => {
              if (cancelled) return;
              setStage(2);
              timers.push(
                setTimeout(() => {
                  if (cancelled) return;
                  setCycle((c) => c + 1);
                  run();
                }, HOLD_MS)
              );
            }, STAGE_MS)
          );
        }, STAGE_MS)
      );
    };
    run();

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [reduced, inView]);

  const rye = RYE_STAGES[stage];
  const allAbovePar = stage === 2;

  return (
    <ClipFrame frameRef={frameRef}>
      <div className="space-y-3">
        <InventoryRow label="Flour" pct={INVENTORY_STATIC_ROWS[0].pct} animKey="static-0" />
        <InventoryRow
          label="Rye flour"
          pct={rye.pct}
          animKey={`rye-${cycle}-${stage}`}
          badge={rye.badge}
          badgeColor={rye.badgeColor}
        />
        <InventoryRow label="Sea salt" pct={INVENTORY_STATIC_ROWS[1].pct} animKey="static-1" />
      </div>
      <div className="mt-3 flex items-center justify-between text-[10px] font-sans-ui" style={{ color: "var(--ink-muted)" }}>
        <span>Par-level check</span>
        {allAbovePar && (
          <span
            key={cycle}
            className="clip-badge text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide"
            style={{ color: "var(--accent-cyan)", background: "rgba(255,255,255,0.06)" }}
          >
            All above par
          </span>
        )}
      </div>
    </ClipFrame>
  );
}

function InventoryRow({
  label,
  pct,
  animKey,
  badge,
  badgeColor,
}: {
  label: string;
  pct: number;
  animKey: string;
  badge?: string | null;
  badgeColor?: string;
}) {
  return (
    <div>
      <div className="flex justify-between items-baseline gap-3 text-[11px] font-sans-ui mb-1" style={{ color: "var(--ink-muted)" }}>
        <span className="flex-1 min-w-0 truncate">{label}</span>
        {badge ? (
          <span className="shrink-0 font-bold uppercase tracking-wide text-[9px]" style={{ color: badgeColor }}>
            {badge}
          </span>
        ) : (
          <span className="shrink-0">{pct}%</span>
        )}
      </div>
      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--border)" }}>
        <div
          key={animKey}
          className="clip-bar-fill h-full rounded-full"
          style={{
            width: `${pct}%`,
            backgroundImage: "var(--accent-gradient)",
            ["--clip-target-width" as string]: `${pct}%`,
          }}
        />
      </div>
    </div>
  );
}

const PROOF_TIMER_SECONDS = 3;
const PROOF_HOLD_MS = 1400;

function formatTimer(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

const CONFETTI_DOTS = [
  { x: -18, y: -14, rot: -30, color: "var(--accent-pink)" },
  { x: -6, y: -22, rot: 10, color: "var(--accent-cyan)" },
  { x: 10, y: -20, rot: 50, color: "var(--accent-pink)" },
  { x: 20, y: -8, rot: -60, color: "var(--accent-cyan)" },
  { x: -22, y: 2, rot: 80, color: "var(--accent-cyan)" },
  { x: 22, y: 6, rot: -15, color: "var(--accent-pink)" },
];

// A single timer drives all three rows so they land their "done" beat
// together, instead of three independently-timed loops drifting apart.
export function RecipeClip() {
  const reduced = usePrefersReducedMotion();
  const [frameRef, inView] = useInView<HTMLDivElement>();
  const [secondsLeft, setSecondsLeft] = useState(reduced ? 0 : PROOF_TIMER_SECONDS);
  const [ringing, setRinging] = useState(reduced);
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    if (reduced) {
      setSecondsLeft(0);
      setRinging(true);
      return;
    }
    if (!inView) return;
    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];

    const run = () => {
      setRinging(false);
      setSecondsLeft(PROOF_TIMER_SECONDS);
      const tick = (n: number) => {
        timers.push(
          setTimeout(() => {
            if (cancelled) return;
            setSecondsLeft(n);
            if (n > 0) {
              tick(n - 1);
            } else {
              setRinging(true);
              timers.push(
                setTimeout(() => {
                  if (cancelled) return;
                  setCycle((c) => c + 1);
                  run();
                }, PROOF_HOLD_MS)
              );
            }
          }, 1000)
        );
      };
      tick(PROOF_TIMER_SECONDS - 1);
    };
    run();

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [reduced, inView]);

  const baguetteStage = ringing ? 2 : secondsLeft >= 2 ? 0 : 1;
  const baguette = [
    { status: "Queued", color: "var(--ink-muted)" },
    { status: "In proof", color: "var(--accent-cyan)" },
    { status: "Done", color: "var(--accent-pink)" },
  ][baguetteStage];
  const seededRyeStatus = ringing ? "On track" : "Behind";
  const seededRyeColor = ringing ? "var(--accent-cyan)" : "var(--accent-pink)";

  return (
    <ClipFrame frameRef={frameRef}>
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-sans-ui" style={{ color: "var(--ink)" }}>
            Country White
          </span>
          <span
            className={ringing && !reduced ? "clip-badge text-[9px] font-sans-ui font-bold px-2 py-0.5 rounded-full uppercase tracking-wide tabular-nums" : "text-[9px] font-sans-ui font-bold px-2 py-0.5 rounded-full uppercase tracking-wide tabular-nums"}
            style={{
              color: ringing ? "var(--accent-pink)" : "var(--accent-cyan)",
              background: "rgba(255,255,255,0.06)",
            }}
          >
            {ringing ? "Proof done" : formatTimer(secondsLeft)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-sans-ui" style={{ color: "var(--ink)" }}>
            Seeded Rye
          </span>
          <span
            key={`${cycle}-${seededRyeStatus}`}
            className="clip-badge text-[9px] font-sans-ui font-bold px-2 py-0.5 rounded-full uppercase tracking-wide transition-colors duration-500"
            style={{ color: seededRyeColor, background: "rgba(255,255,255,0.06)" }}
          >
            {seededRyeStatus}
          </span>
        </div>
        <div className="relative flex items-center justify-between">
          <span className="text-[11px] font-sans-ui" style={{ color: "var(--ink)" }}>
            Baguette
          </span>
          <span
            className="text-[9px] font-sans-ui font-bold px-2 py-0.5 rounded-full uppercase tracking-wide transition-colors duration-500"
            style={{ color: baguette.color, background: "rgba(255,255,255,0.06)" }}
          >
            {baguette.status}
          </span>
          {ringing && !reduced && (
            <span key={cycle} className="pointer-events-none absolute right-2 top-1/2">
              {CONFETTI_DOTS.map((c, i) => (
                <span
                  key={i}
                  className="clip-confetti absolute h-1.5 w-1.5 rounded-sm"
                  style={{
                    background: c.color,
                    ["--confetti-x" as string]: `${c.x}px`,
                    ["--confetti-y" as string]: `${c.y}px`,
                    ["--confetti-rot" as string]: `${c.rot}deg`,
                    animationDelay: `${i * 25}ms`,
                  }}
                />
              ))}
            </span>
          )}
        </div>
      </div>
    </ClipFrame>
  );
}

// Ascending so the chart reads as a clear growth trend, revealed one bar at
// a time rather than all at once.
const FINANCE_BARS = [22, 34, 46, 58, 70, 82, 95];
const FINANCE_BAR_STEP_MS = 380;

export function FinanceClip() {
  const reduced = usePrefersReducedMotion();
  const [frameRef, inView] = useInView<HTMLDivElement>();
  const target = 4820;
  const [revenue, setRevenue] = useState(reduced ? target : 0);
  const [barsShown, setBarsShown] = useState(reduced ? FINANCE_BARS.length : 0);
  const [hit, setHit] = useState(reduced);
  const [cycle, setCycle] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (reduced) {
      setRevenue(target);
      setBarsShown(FINANCE_BARS.length);
      setHit(true);
      return;
    }
    if (!inView) return;
    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const revealDuration = FINANCE_BARS.length * FINANCE_BAR_STEP_MS;

    const runCycle = () => {
      setHit(false);
      setBarsShown(0);
      for (let step = 1; step <= FINANCE_BARS.length; step++) {
        timers.push(
          setTimeout(() => {
            if (!cancelled) setBarsShown(step);
          }, step * FINANCE_BAR_STEP_MS)
        );
      }

      const start = performance.now();
      const tick = (now: number) => {
        if (cancelled) return;
        const p = Math.min(1, (now - start) / revealDuration);
        const eased = 1 - Math.pow(1 - p, 3);
        setRevenue(Math.round(eased * target));
        if (p < 1) {
          rafRef.current = requestAnimationFrame(tick);
        } else {
          setHit(true);
          timers.push(
            setTimeout(() => {
              if (cancelled) return;
              setRevenue(0);
              setCycle((c) => c + 1);
              runCycle();
            }, 1400)
          );
        }
      };
      rafRef.current = requestAnimationFrame(tick);
    };

    runCycle();
    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [reduced, inView]);

  return (
    <ClipFrame frameRef={frameRef}>
      <div className="flex items-center justify-between mb-1">
        <span className="text-[11px] font-sans-ui" style={{ color: "var(--ink-muted)" }}>
          Weekly revenue
        </span>
        {hit && (
          <span
            key={cycle}
            className="clip-badge text-[9px] font-sans-ui font-bold px-2 py-0.5 rounded-full uppercase tracking-wide"
            style={{ color: "var(--accent-cyan)", background: "rgba(255,255,255,0.06)" }}
          >
            Target hit
          </span>
        )}
      </div>
      <div className="text-xl font-bold mb-3 tabular-nums" style={{ color: "var(--ink)" }}>
        ${revenue.toLocaleString()}
      </div>
      <div className="flex items-end gap-1.5 h-10">
        {FINANCE_BARS.map((h, i) => {
          const shown = reduced || i < barsShown;
          return (
            <div key={i} className="flex-1 rounded-sm overflow-hidden flex items-end h-full">
              {shown && (
                <div
                  key={`${cycle}-${i}`}
                  className={reduced ? "w-full rounded-sm" : "clip-bar-rise w-full rounded-sm"}
                  style={{
                    height: reduced ? `${h}%` : undefined,
                    backgroundImage: "var(--accent-gradient)",
                    opacity: 0.35 + (h / 100) * 0.5,
                    ["--clip-target-height" as string]: `${h}%`,
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </ClipFrame>
  );
}
