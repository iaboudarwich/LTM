"use client";

import * as React from "react";
import Link from "next/link";
import { AlertTriangle, RotateCw } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="container-ltm py-16 text-center md:py-20">
      <span
        className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-ltm-red/10 text-ltm-red"
        aria-hidden="true"
      >
        <AlertTriangle className="h-7 w-7" />
      </span>
      <h1 className="mt-4 text-3xl font-bold text-ltm-black md:text-4xl">
        Something went wrong
      </h1>
      <p className="mx-auto mt-3 max-w-prose text-base leading-relaxed text-ltm-slate">
        We hit an unexpected problem loading this page. Please try again, or
        return to the homepage.
      </p>
      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Button size="lg" onClick={reset}>
          <RotateCw className="h-4 w-4" aria-hidden="true" />
          Try again
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/">Back to home</Link>
        </Button>
      </div>
    </section>
  );
}
