"use client";

import { useEffect, useMemo, useRef } from "react";
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

const ORB_COUNT = 24;

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
        <GlowOrbs />
      </Canvas>
    </div>
  );
}
