"use client";

import dynamic from "next/dynamic";

// next/dynamic with `ssr: false` is only allowed inside Client Components in
// the App Router, so this tiny wrapper exists to keep app/page.tsx a Server
// Component while the WebGL canvas stays strictly client-only (it needs a
// WebGL context and window.scrollY — SSR would fail).
const ScrollJourneyCanvas = dynamic(() => import("./ScrollJourneyCanvas"), {
  ssr: false,
});

export default function ScrollJourneyLazy() {
  return <ScrollJourneyCanvas />;
}
