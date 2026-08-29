"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { RefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import useScrollProgress from "./useScrollProgress";

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

// --- Camera choreography ---------------------------------------------------
// The 0-1 scroll range divided into five beats: the hero, then one per
// FeatureRow in app/page.tsx page order. Each row gets a subtle alternating
// camera bank (roll) and lateral drift as its scroll range becomes active.
const BEATS = [
  { start: 0.0, end: 0.18, bank: 0, xOffset: 0 }, // hero
  { start: 0.18, end: 0.38, bank: 0.06, xOffset: 1.6 }, // Scheduling & timesheets
  { start: 0.38, end: 0.58, bank: -0.06, xOffset: -1.6 }, // Inventory & ordering
  { start: 0.58, end: 0.78, bank: 0.06, xOffset: 1.6 }, // Recipes & production
  { start: 0.78, end: 1.0, bank: -0.06, xOffset: -1.6 }, // Wholesale & finances
];

const CAMERA_START = new THREE.Vector3(0, 2.5, 8);
const DOLLY_DISTANCE = 190; // camera ends at z = 8 - 190 = -182

// --- Scene pieces ----------------------------------------------------------

function GridFloor() {
  const token = useMemo(() => readToken("--grid-line"), []);

  // GridHelper gives us the synthwave grid as real 3D line geometry — the 3D
  // equivalent of the old CSS repeating-linear-gradient floor. 600x600 world
  // units with 150 divisions = 4-unit cells; scene fog fades it toward the
  // horizon for depth.
  const grid = useMemo(() => {
    const helper = new THREE.GridHelper(600, 100, token.color, token.color);
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

const ORB_COUNT = 16;

// One InstancedMesh (a single draw call) rather than 24 separate <mesh>
// elements: every orb shares the same sphere geometry and additive material
// and varies only by transform + per-instance color — exactly the case
// instancing exists for. At 24 objects individual meshes would also work,
// but instancing keeps the draw-call count flat if the orb count grows.
function GlowOrbs() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const pink = useMemo(() => readToken("--accent-pink"), []);
  const cyan = useMemo(() => readToken("--accent-cyan"), []);

  // Geometry/material built imperatively so <instancedMesh args> gets real
  // (non-undefined) constructor arguments, which keeps TypeScript happy.
  const geometry = useMemo(() => new THREE.SphereGeometry(1, 16, 16), []);
  const material = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        transparent: true,
        opacity: 0.35,
        blending: THREE.AdditiveBlending, // glows against the dark bg like the old CSS blobs
        depthWrite: false,
        toneMapped: false,
      }),
    []
  );

  useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, [geometry, material]);

  // Scatter orbs down the corridor the camera flies through (z from ~+10 to
  // ~-230), alternating pink/cyan sides, with randomized jitter in position
  // and scale so they read as drifting lights, not a rigid array. Positions
  // are computed once per mount; this component is client-only (ssr:false)
  // so Math.random causes no hydration mismatch.
  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const matrix = new THREE.Matrix4();
    const color = new THREE.Color();
    for (let i = 0; i < ORB_COUNT; i++) {
      const t = i / ORB_COUNT;
      const side = i % 2 === 0 ? 1 : -1;
      const scale = 0.5 + Math.random() * 1.1;
      matrix.makeScale(scale, scale, scale);
      matrix.setPosition(
        side * (4 + Math.random() * 10), // off the center line, either side
        1 + Math.random() * 6, // floating above the grid floor
        10 - t * 240 + (Math.random() - 0.5) * 16 // spread along the flight path
      );
      mesh.setMatrixAt(i, matrix);
      color.set(i % 2 === 0 ? pink.color : cyan.color);
      mesh.setColorAt(i, color);
    }
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [pink, cyan]);

  return (
    <instancedMesh
      ref={meshRef}
      args={[geometry, material, ORB_COUNT]}
      // Instances span far beyond the default bounding sphere; skip culling
      // so orbs never pop out at the viewport edge.
      frustumCulled={false}
    />
  );
}

function CameraRig({
  progressRef,
  frozen,
}: {
  progressRef: RefObject<number>;
  frozen: boolean;
}) {
  useFrame((state, delta) => {
    // prefers-reduced-motion: treat progress as permanently 0 — the camera
    // damps to (and stays at) its start position, but the scene still renders.
    const progress = frozen ? 0 : progressRef.current;
    const beat =
      BEATS.find((b) => progress >= b.start && progress < b.end) ??
      BEATS[BEATS.length - 1]; // progress === 1 falls past every `end` check
    const targetZ = CAMERA_START.z - progress * DOLLY_DISTANCE;
    const targetX = CAMERA_START.x + beat.xOffset;
    const targetRoll = beat.bank;

    // Frame-rate-independent exponential damping (THREE.MathUtils.damp), so
    // the motion reads as smoothed flight rather than a snap, and behaves
    // identically at 60Hz and 120Hz. The dolly uses a higher lambda than the
    // bank/drift so forward motion tracks the scrollbar tightly while the
    // per-row tilt eases in lazily.
    const cam = state.camera;
    cam.position.z = THREE.MathUtils.damp(cam.position.z, targetZ, 6, delta);
    cam.position.x = THREE.MathUtils.damp(cam.position.x, targetX, 3, delta);
    cam.position.y = THREE.MathUtils.damp(
      cam.position.y,
      CAMERA_START.y,
      3,
      delta
    );
    cam.rotation.z = THREE.MathUtils.damp(cam.rotation.z, targetRoll, 3, delta);
  });
  return null;
}

function usePrefersReducedMotion(): boolean {
  // Lazy initializer (not an effect) reads the media query on first render —
  // this component is only ever mounted client-side (ScrollJourneyLazy uses
  // `ssr: false`), so `window` is always available here. Avoids the
  // react-hooks/set-state-in-effect lint rule that flags calling setState
  // synchronously inside a useEffect body.
  const [reduced, setReduced] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

// --- Canvas ----------------------------------------------------------------

export default function ScrollJourneyCanvas() {
  const progressRef = useScrollProgress();
  const reducedMotion = usePrefersReducedMotion();
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
        dpr={[1, 1]} // capped device-pixel-ratio — perf guard from the design spec
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        camera={{ position: [0, 2.5, 8], fov: 60, near: 0.1, far: 400 }}
      >
        {/* Fog in the page background color fades the grid into the distance */}
        <fog attach="fog" args={[bg.color, 10, 160]} />
        <GridFloor />
        <GlowOrbs />
        <CameraRig progressRef={progressRef} frozen={reducedMotion} />
      </Canvas>
    </div>
  );
}
