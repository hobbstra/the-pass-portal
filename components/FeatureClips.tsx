function ClipFrame({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="rounded-lg border p-4 w-full max-w-[280px]"
      style={{ borderColor: "var(--border)", background: "var(--bg-elevated)" }}
      aria-hidden="true"
    >
      {children}
    </div>
  );
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

export function RecipeClip() {
  const rows = [
    { name: "Country White", status: "In proof", color: "var(--accent-cyan)" },
    { name: "Seeded Rye", status: "Behind", color: "var(--accent-pink)" },
    { name: "Baguette", status: "Queued", color: "var(--ink-muted)" },
  ];
  return (
    <ClipFrame>
      <div className="space-y-2.5">
        {rows.map((r, i) => (
          <div key={r.name} className="flex items-center justify-between">
            <span className="text-[11px] font-sans-ui" style={{ color: "var(--ink)" }}>
              {r.name}
            </span>
            <span
              className="clip-badge text-[9px] font-sans-ui font-bold px-2 py-0.5 rounded-full uppercase tracking-wide"
              style={{
                color: r.color,
                background: "rgba(255,255,255,0.06)",
                animationDelay: `${i * 260}ms`,
              }}
            >
              {r.status}
            </span>
          </div>
        ))}
      </div>
    </ClipFrame>
  );
}

export function FinanceClip() {
  const bars = [30, 55, 40, 70, 50, 85, 65];
  return (
    <ClipFrame>
      <div className="text-[11px] font-sans-ui mb-1" style={{ color: "var(--ink-muted)" }}>
        Weekly revenue
      </div>
      <div className="text-xl font-bold mb-3" style={{ color: "var(--ink)" }}>
        $4,820
      </div>
      <div className="flex items-end gap-1.5 h-10">
        {bars.map((h, i) => (
          <div
            key={i}
            className="clip-fin-bar flex-1 rounded-sm"
            style={{
              height: `${h}%`,
              backgroundImage: "var(--accent-gradient)",
              opacity: 0.35 + (h / 100) * 0.5,
              animationDelay: `${i * 140}ms`,
            }}
          />
        ))}
      </div>
    </ClipFrame>
  );
}
