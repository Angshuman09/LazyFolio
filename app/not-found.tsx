import type { CSSProperties } from "react";
import Link from "next/link";
import { Loupe } from "@lucasmarkes/hairline/react";
import { getMainSiteUrl } from "@/lib/utils/public-url";

const figureTheme = {
  "--hairline-plate": "var(--lf-bg)",
  "--hairline-hi": "var(--lf-accent-text)",
  "--hairline-edge": "color-mix(in srgb, var(--lf-ink) 45%, var(--lf-bg))",
  "--hairline-mid": "color-mix(in srgb, var(--lf-ink) 24%, var(--lf-bg))",
  "--hairline-lo": "color-mix(in srgb, var(--lf-ink) 10%, var(--lf-bg))",
} as CSSProperties;

export default function NotFound() {
  return (
    <main className="font-sans-body min-h-screen bg-(--lf-bg) text-(--lf-ink) flex items-center justify-center px-5 sm:px-8">
      <section className="max-w-xl mx-auto text-center flex flex-col items-center">
        <Loupe
          play
          intensity={0.6}
          label="A magnifying loupe over a blank ruled sheet"
          style={{ width: 240, ...figureTheme }}
        />

        <p className="mt-8 mb-4 font-mono text-[0.72rem] tracking-[0.3em] text-(--lf-accent-text) uppercase">
          404
        </p>

        <h1 className="font-serif-display font-normal text-(--lf-ink) text-4xl sm:text-5xl leading-[1.1] mb-5">
          <span className="block">Nothing lives</span>
          <span className="block italic text-(--lf-accent-text)">
            at this address.
          </span>
        </h1>

        <p className="mx-auto max-w-md font-serif-display text-[0.98rem] sm:text-[1.05rem] leading-[1.7] text-balance text-(--lf-muted)">
          The link is broken or the page moved. Check the address, or head back
          home and start from there.
        </p>

        <div className="mt-9">
          <Link
            href={getMainSiteUrl()}
            className="group inline-flex h-12 items-center gap-2.5 rounded-full bg-(--lf-ink) pr-2.5 pl-6 text-[0.8125rem] font-semibold text-(--lf-bg) transition-opacity hover:opacity-85 lf-focus"
          >
            Back to home
            <span
              aria-hidden
              className="btn-arrow inline-flex size-7 items-center justify-center rounded-full bg-(--lf-bg) text-[12px] leading-none font-bold text-(--lf-ink)"
            >
              ↗
            </span>
          </Link>
        </div>
      </section>
    </main>
  );
}