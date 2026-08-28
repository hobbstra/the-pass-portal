"use client";

import { useEffect, useRef } from "react";
import type { RefObject } from "react";

/**
 * Tracks page scroll progress as a 0-1 value in a ref (not React state), so
 * the 3D canvas can read it every frame inside useFrame without triggering a
 * React re-render per scroll event.
 *
 * The listener is rAF-throttled: scroll/resize events only schedule a frame;
 * the value is recomputed at most once per animation frame.
 */
export default function useScrollProgress(): RefObject<number> {
  const progressRef = useRef(0);

  useEffect(() => {
    let rafId: number | null = null;

    const update = () => {
      rafId = null;
      const scrollable =
        document.documentElement.scrollHeight - window.innerHeight;
      progressRef.current =
        scrollable > 0
          ? Math.min(1, Math.max(0, window.scrollY / scrollable))
          : 0;
    };

    const schedule = () => {
      if (rafId === null) rafId = requestAnimationFrame(update);
    };

    update(); // initialize — the page may load pre-scrolled (e.g. refresh mid-page)
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return progressRef;
}
