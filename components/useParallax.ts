"use client";

import { useEffect, useRef } from "react";

/**
 * Attaches a subtle scroll-depth parallax to the returned ref's element: as
 * the element passes through the viewport, it lags slightly behind the raw
 * scroll (translateY proportional to distance from viewport center), giving
 * foreground content a sense of weight relative to the fixed 3D background
 * behind it. Settles back to its natural position once scrolling stops.
 *
 * Respects prefers-reduced-motion (including live toggles) — disabled
 * entirely when set, leaving the element at its normal scroll position.
 */
export default function useParallax<T extends HTMLElement>(factor = 0.1) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    let rafId: number | null = null;
    let enabled = !mq.matches;

    const update = () => {
      rafId = null;
      if (!enabled) return;
      const rect = el.getBoundingClientRect();
      const elementCenter = rect.top + rect.height / 2;
      const viewportCenter = window.innerHeight / 2;
      const offset = (viewportCenter - elementCenter) * factor;
      el.style.transform = `translateY(${offset}px)`;
    };

    const schedule = () => {
      if (rafId === null) rafId = requestAnimationFrame(update);
    };

    const onMotionChange = () => {
      enabled = !mq.matches;
      if (!enabled) el.style.transform = "";
      else schedule();
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    mq.addEventListener("change", onMotionChange);
    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      mq.removeEventListener("change", onMotionChange);
    };
  }, [factor]);

  return ref;
}
