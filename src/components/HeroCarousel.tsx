"use client";

import * as React from "react";
import Image from "next/image";

import { heroPhotos } from "@/data/photos";
import { cn } from "@/lib/utils";

const INTERVAL_MS = 6000;
const SWIPE_THRESHOLD_PX = 40;
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(onChange: () => void) {
  const mq = window.matchMedia(REDUCED_MOTION_QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

const getReducedMotion = () => window.matchMedia(REDUCED_MOTION_QUERY).matches;
// Prerendered HTML assumes motion is allowed; the client corrects on hydrate.
const getReducedMotionServer = () => false;

export function HeroCarousel() {
  const [index, setIndex] = React.useState(0);
  const reduceMotion = React.useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotion,
    getReducedMotionServer,
  );
  const touchStartX = React.useRef<number | null>(null);

  React.useEffect(() => {
    if (reduceMotion) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % heroPhotos.length);
    }, INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [reduceMotion]);

  const goTo = (i: number) => {
    const next = ((i % heroPhotos.length) + heroPhotos.length) % heroPhotos.length;
    setIndex(next);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(dx) < SWIPE_THRESHOLD_PX) return;
    goTo(dx < 0 ? index + 1 : index - 1);
  };

  return (
    <div
      className="absolute inset-0 h-full w-full overflow-hidden touch-pan-y"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {heroPhotos.map((photo, i) => {
        // Mount only a small window — the active slide plus its immediate
        // neighbours (next, and previous so the outgoing image can fade out).
        // This keeps the crossfade smooth while never downloading every hero
        // image up front on a slow connection.
        const total = heroPhotos.length;
        const isActive = i === index;
        const isNext = i === (index + 1) % total;
        const isPrev = i === (index - 1 + total) % total;
        if (!isActive && !isNext && !isPrev) return null;
        return (
          <div
            key={photo.id}
            aria-hidden={!isActive}
            className={cn(
              "absolute inset-0 transition-opacity duration-1000 ease-in-out",
              isActive ? "opacity-100" : "opacity-0"
            )}
          >
            <Image
              src={photo.url}
              alt={photo.alt}
              fill
              priority={i === 0}
              loading={i === 0 ? "eager" : "lazy"}
              sizes="100vw"
              className="object-cover"
            />
          </div>
        );
      })}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ltm-black/85 via-ltm-black/40 to-transparent"
      />

      {/* Slide dots — hidden on portrait phones because the h-11 tap-targets
          vertically overlap the hero's Call CTA on narrow widths, which looks
          messy and creates competing tap zones. Touch swipe still works on
          mobile, and auto-rotation continues to vary the image. Dots return
          from `sm` up (landscape phones, tablets, desktop) where there is
          room for them below the CTAs. */}
      <div className="absolute bottom-6 left-1/2 z-20 hidden -translate-x-1/2 gap-3 sm:flex">
        {heroPhotos.map((photo, i) => (
          <button
            key={photo.id}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1} of ${heroPhotos.length}`}
            aria-current={i === index}
            className={cn(
              "flex h-11 w-11 items-center justify-center focus-visible:outline-none",
              "focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-ltm-black"
            )}
          >
            <span
              className={cn(
                "block h-2 rounded-full transition-all duration-300",
                i === index ? "w-8 bg-white" : "w-2 bg-white/50"
              )}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
