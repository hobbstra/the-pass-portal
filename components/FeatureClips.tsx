"use client";

import { useEffect, useRef, useState } from "react";

function ClipFrame({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="relative rounded-lg border p-4 w-full max-w-[280px] overflow-hidden"
      style={{ borderColor: "var(--border)", background: "var(--bg-elevated)" }}
      aria-hidden="true"
    >
      {children}
    </div>
  );
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

export function ScheduleClip() {
  const days = ["M", "T", "W", "T", "F", "S", "S"];
  const shifts = [1, 1, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 1, 0];
  return (
    <ClipFrame>
      <div className="grid grid-cols-7 gap-1 mb-2">
        {days.map((d, i) => (
          <span key={i} className="text-[10px] text-center font-sans-ui" style={{ color: "var(--ink-muted)" }}>
            {d}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {shifts.map((on, i) => (
          <div
            key={i}
            className={on ? "clip-shift h-6 rounded-sm" : "h-6 rounded-sm"}
            style={{
              background: on ? (i % 2 === 0 ? "var(--accent-pink)" : "var(--accent-cyan)") : "transparent",
              opacity: on ? 0.5 : 0,
              border: on ? "none" : `1px dashed var(--border)`,
              ["--clip-base-opacity" as string]: 0.5,
              animationDelay: on ? `${(i % 5) * 220}ms` : undefined,
            }}
          />
        ))}
      </div>
    </ClipFrame>
  );
}

export function InventoryClip() {
  const rows = [
    { label: "Flour", pct: 82 },
    { label: "Rye flour", pct: 34 },
    { label: "Sea salt", pct: 91 },
  ];
  return (
    <ClipFrame>
      <div className="space-y-3">
        {rows.map((r, i) => (
          <div key={r.label}>
            <div className="flex justify-between items-baseline gap-3 text-[11px] font-sans-ui mb-1" style={{ color: "var(--ink-muted)" }}>
              <span className="flex-1 min-w-0 truncate">{r.label}</span>
              <span className="shrink-0">{r.pct}%</span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--border)" }}>
              <div
                className="clip-bar-fill h-full rounded-full"
                style={{
                  width: `${r.pct}%`,
                  backgroundImage: "var(--accent-gradient)",
                  ["--clip-target-width" as string]: `${r.pct}%`,
                  animationDelay: `${i * 200}ms, ${1200 + i * 200}ms`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </ClipFrame>
  );
}

const RECIPE_ROWS = [
  { name: "Country White", status: "In proof", color: "var(--accent-cyan)" },
  { name: "Seeded Rye", status: "Behind", color: "var(--accent-pink)" },
];

const BAGUETTE_STAGES: { status: string; color: string }[] = [
  { status: "Queued", color: "var(--ink-muted)" },
  { status: "In proof", color: "var(--accent-cyan)" },
  { status: "Done", color: "var(--accent-pink)" },
];

const CONFETTI_DOTS = [
  { x: -18, y: -14, rot: -30, color: "var(--accent-pink)" },
  { x: -6, y: -22, rot: 10, color: "var(--accent-cyan)" },
  { x: 10, y: -20, rot: 50, color: "var(--accent-pink)" },
  { x: 20, y: -8, rot: -60, color: "var(--accent-cyan)" },
  { x: -22, y: 2, rot: 80, color: "var(--accent-cyan)" },
  { x: 22, y: 6, rot: -15, color: "var(--accent-pink)" },
];

export function RecipeClip() {
  const reduced = usePrefersReducedMotion();
  const [stage, setStage] = useState(reduced ? 2 : 0);
  const [burst, setBurst] = useState(0);

  useEffect(() => {
    if (reduced) {
      setStage(2);
      return;
    }
    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];

    const cycle = () => {
      setStage(0);
      timers.push(
        setTimeout(() => {
          if (cancelled) return;
          setStage(1);
          timers.push(
            setTimeout(() => {
              if (cancelled) return;
              setStage(2);
              setBurst((b) => b + 1);
              timers.push(setTimeout(cycle, 3200));
            }, 1700)
          );
        }, 1500)
      );
    };
    cycle();

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [reduced]);

  const baguette = BAGUETTE_STAGES[stage];

  return (
    <ClipFrame>
      <div className="space-y-2.5">
        {RECIPE_ROWS.map((r, i) => (
          <div key={r.name} className="flex items-center justify-between">
            <span className="text-[11px] font-sans-ui" style={{ color: "var(--ink)" }}>
              {r.name}
            </span>
            <span
              className="clip-badge text-[9px] font-sans-ui font-bold px-2 py-0.5 rounded-full uppercase tracking-wide"
              style={{ color: r.color, background: "rgba(255,255,255,0.06)", animationDelay: `${i * 260}ms` }}
            >
              {r.status}
            </span>
          </div>
        ))}
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
          {stage === 2 && !reduced && (
            <span key={burst} className="pointer-events-none absolute right-2 top-1/2">
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

export function FinanceClip() {
  const reduced = usePrefersReducedMotion();
  const bars = [30, 55, 40, 70, 50, 85, 65];
  const target = 4820;
  const [revenue, setRevenue] = useState(reduced ? target : 0);
  const [cycle, setCycle] = useState(0);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    if (reduced) {
      setRevenue(target);
      return;
    }
    let cancelled = false;

    const runCycle = () => {
      const start = performance.now();
      const duration = 1400;
      const tick = (now: number) => {
        if (cancelled) return;
        const p = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - p, 3);
        setRevenue(Math.round(eased * target));
        if (p < 1) {
          frameRef.current = requestAnimationFrame(tick);
        } else {
          setTimeout(() => {
            if (cancelled) return;
            setRevenue(0);
            setCycle((c) => c + 1);
          }, 2600);
        }
      };
      frameRef.current = requestAnimationFrame(tick);
    };

    runCycle();
    return () => {
      cancelled = true;
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced, cycle]);

  return (
    <ClipFrame>
      <div className="text-[11px] font-sans-ui mb-1" style={{ color: "var(--ink-muted)" }}>
        Weekly revenue
      </div>
      <div className="text-xl font-bold mb-3 tabular-nums" style={{ color: "var(--ink)" }}>
        ${revenue.toLocaleString()}
      </div>
      <div className="flex items-end gap-1.5 h-10">
        {bars.map((h, i) => (
          <div key={`${cycle}-${i}`} className="flex-1 rounded-sm overflow-hidden flex items-end h-full">
            <div
              className={reduced ? "w-full rounded-sm" : "clip-bar-rise w-full rounded-sm"}
              style={{
                height: reduced ? `${h}%` : undefined,
                backgroundImage: "var(--accent-gradient)",
                opacity: 0.35 + (h / 100) * 0.5,
                ["--clip-target-height" as string]: `${h}%`,
                animationDelay: reduced ? undefined : `${300 + i * 90}ms`,
              }}
            />
          </div>
        ))}
      </div>
    </ClipFrame>
  );
}
