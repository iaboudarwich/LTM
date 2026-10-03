import * as React from "react";

import { cn } from "@/lib/utils";

type FadeInProps = {
  children: React.ReactNode;
  className?: string;
  // Stagger delay in seconds.
  delay?: number;
};

// Subtle reveal for static content sections only. Pure CSS (see .fade-in in
// globals.css): no JavaScript, GPU-only (opacity + translateY), scroll-linked
// where the browser supports it, and fully disabled under
// prefers-reduced-motion so it never costs anything on cheap phones.
export function FadeIn({ children, className, delay = 0 }: FadeInProps) {
  return (
    <div
      className={cn("fade-in", className)}
      style={
        delay
          ? ({ "--fade-delay": `${delay}s` } as React.CSSProperties)
          : undefined
      }
    >
      {children}
    </div>
  );
}
