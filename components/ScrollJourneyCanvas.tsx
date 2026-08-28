"use client";

import { useEffect, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";

// --- Design tokens ---------------------------------------------------------
// Read from the CSS custom properties in app/globals.css at mount, so the 3D
// scene reuses the exact colors of the 2D design system. Fallbacks mirror the
// current values in globals.css in case a token is missing or unparsable.

type Token = { color: string; opacity: number };

const FALLBACKS: Record<string, Token> = {
  "--grid-line": { color: "rgb(255, 60, 180)", opacity: 0.25 },
  "--accent-pink": { color: "#ff3cb4", opacity: 1 },
  "--accent-cyan": { color: "#5ad8ff", opacity: 1 },
  "--bg": { color: "#0d0716", opacity: 1 },
};

function readToken(name: string): Token {
  const fallback = FALLBACKS[name];
  if (typeof window === "undefined") return fallback;
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
  if (raw.startsWith("#")) {
    // Some browsers normalize computed rgba() values to 8-digit hex
    // (#rrggbbaa) instead of echoing back rgba(); THREE.Color only accepts
    // 3/6-digit hex, so split the alpha byte out into opacity.
    if (raw.length === 9) {
      return {
        color: raw.slice(0, 7),
        opacity: parseInt(raw.slice(7, 9), 16) / 255,
      };
    }
    return { color: raw, opacity: 1 };
  }
  const m = raw.match(
    /^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+)\s*)?\)$/
  );
  if (!m) return fallback;
  return {
    color: `rgb(${m[1]}, ${m[2]}, ${m[3]})`,
    opacity: m[4] !== undefined ? parseFloat(m[4]) : 1,
  };
}

// --- Scene pieces ----------------------------------------------------------

function GridFloor() {
  const token = useMemo(() => readToken("--grid-line"), []);

  // GridHelper gives us the synthwave grid as real 3D line geometry — the 3D
  // equivalent of the old CSS repeating-linear-gradient floor. 600x600 world
  // units with 150 divisions = 4-unit cells; scene fog fades it toward the
  // horizon for depth.
  const grid = useMemo(() => {
    const helper = new THREE.GridHelper(600, 150, token.color, token.color);
    const material = helper.material as THREE.LineBasicMaterial;
    material.transparent = true;
    material.opacity = token.opacity; // --grid-line's own low alpha (0.25)
    material.depthWrite = false;
    return helper;
  }, [token]);

  useEffect(() => {
    return () => {
      grid.geometry.dispose();
      (grid.material as THREE.Material).dispose();
    };
  }, [grid]);

  // Centered at z=-250 so it spans z=[-550, 50]: the camera journey (z=8 down
  // to z=-182, wired in a later task) always has floor beneath it.
  return <primitive object={grid} position={[0, 0, -250]} />;
}

// --- Canvas ----------------------------------------------------------------

export default function ScrollJourneyCanvas() {
  const bg = useMemo(() => readToken("--bg"), []);

  return (
    // Fixed full-viewport layer behind all page content. z-index -1 paints it
    // above the body's background but below all normal-flow content;
    // pointer-events-none means it can never swallow clicks, scroll, or text
    // selection.
    <div
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: -1 }}
      aria-hidden="true"
    >
      <Canvas
        dpr={[1, 1.5]} // capped device-pixel-ratio — perf guard from the design spec
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        camera={{ position: [0, 2.5, 8], fov: 60, near: 0.1, far: 400 }}
      >
        {/* Fog in the page background color fades the grid into the distance */}
        <fog attach="fog" args={[bg.color, 10, 160]} />
        <GridFloor />
      </Canvas>
    </div>
  );
}
