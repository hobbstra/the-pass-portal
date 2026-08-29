"use client";

import useParallax from "./useParallax";

export default function ParallaxWrapper({
  factor = 0.06,
  className,
  children,
}: {
  factor?: number;
  className?: string;
  children: React.ReactNode;
}) {
  const ref = useParallax<HTMLDivElement>(factor);
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
