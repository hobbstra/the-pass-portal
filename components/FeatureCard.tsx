"use client";

import { useRef } from "react";

export default function FeatureCard({
  title,
  body,
  gridLines,
  index = 0,
}: {
  title: string;
  body: string;
  gridLines?: boolean;
  index?: number;
}) {
  const tiltRef = useRef<HTMLDivElement>(null);

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const el = tiltRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const rx = ((e.clientY - r.top) / r.height - 0.5) * -8;
    const ry = ((e.clientX - r.left) / r.width - 0.5) * 8;
    el.style.setProperty("--rx", `${rx}deg`);
    el.style.setProperty("--ry", `${ry}deg`);
  }

  function onPointerLeave() {
    tiltRef.current?.style.setProperty("--rx", "0deg");
    tiltRef.current?.style.setProperty("--ry", "0deg");
  }

  return (
    <div className="fade-in" style={{ animationDelay: `${160 + index * 90}ms` }}>
      <div
        ref={tiltRef}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        className="tilt-card rounded-xl p-px"
        style={{
          backgroundImage:
            "linear-gradient(135deg, rgba(255,60,180,0.4), rgba(90,216,255,0.4))",
          transform:
            "perspective(800px) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg))",
          boxShadow:
            "0 0 36px -14px var(--glow-pink), 0 10px 28px -8px rgba(0,0,0,0.6)",
        }}
      >
        <div
          className="relative overflow-hidden rounded-[11px] p-6 h-full"
          style={{ background: "var(--bg-elevated)" }}
        >
          {gridLines && (
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2"
              style={{
                backgroundImage: `repeating-linear-gradient(to right, var(--grid-line) 0 1px, transparent 1px 48px), repeating-linear-gradient(to bottom, var(--grid-line) 0 1px, transparent 1px 48px)`,
                maskImage: "linear-gradient(to top, black, transparent)",
                WebkitMaskImage: "linear-gradient(to top, black, transparent)",
              }}
              aria-hidden="true"
            />
          )}
          <h3 className="relative text-lg font-bold mb-2" style={{ color: "var(--ink)" }}>
            {title}
          </h3>
          <p
            className="relative text-sm leading-relaxed font-sans-ui"
            style={{ color: "var(--ink-muted)" }}
          >
            {body}
          </p>
        </div>
      </div>
    </div>
  );
}
