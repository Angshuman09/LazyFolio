"use client";

import { useEffect } from "react";
import type { CSSProperties } from "react";
import Link from "next/link";
import { Stack } from "@lucasmarkes/hairline/react";

const figureTheme = {
  "--hairline-plate": "var(--lf-bg)",
  "--hairline-hi": "var(--lf-accent-text)",
  "--hairline-edge": "color-mix(in srgb, var(--lf-ink) 45%, var(--lf-bg))",
  "--hairline-mid": "color-mix(in srgb, var(--lf-ink) 24%, var(--lf-bg))",
  "--hairline-lo": "color-mix(in srgb, var(--lf-ink) 10%, var(--lf-bg))",
} as CSSProperties;

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="bg-(--lf-bg) min-h-screen w-full flex items-center justify-center px-5 sm:px-8">
      <section className="max-w-xl mx-auto text-center flex flex-col items-center">
        {/* A call stack with one frame lifted out: the page that threw */}
        <Stack
          play
          intensity={0.6}
          label="A call stack with one frame lifted out"
          style={{ width: 240, ...figureTheme }}
        />

        <h1 className="font-serif-display font-normal text-(--lf-ink) text-4xl sm:text-5xl leading-[1.1] mt-8 mb-5">
          <span className="block">Something broke</span>
          <span className="block italic text-(--lf-accent-text)">
            on our end.
          </span>
        </h1>

        <p className="mx-auto max-w-md font-serif-display text-[0.98rem] sm:text-[1.05rem] leading-[1.7] text-balance text-(--lf-muted)">
          The server hit an error while loading this page. Try again, or head
          back home if it keeps happening.
        </p>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={reset}
            className="group h-12 inline-flex items-center gap-2.5 rounded-full bg-(--lf-ink) text-(--lf-bg) text-[0.8125rem] font-semibold pl-6 pr-2.5 hover:opacity-85 cursor-pointer whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--lf-accent)"
          >
            Try again
            <span
              aria-hidden="true"
              className="w-7 h-7 bg-(--lf-bg) text-(--lf-ink) rounded-full inline-flex items-center justify-center text-[12px] font-bold leading-none"
            >
              ↻
            </span>
          </button>

          <Link
            href="/"
            className="h-12 inline-flex items-center rounded-full border border-(--lf-border) bg-(--lf-surface) text-(--lf-ink) text-[0.8125rem] font-semibold px-6 hover:border-(--lf-accent) whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--lf-accent)"
          >
            Go home
          </Link>
        </div>

        {error.digest && (
          <p className="mt-8 font-mono text-[0.72rem] text-(--lf-dimmed)">
            Error ID: {error.digest}
          </p>
        )}
      </section>
    </main>
  );
}