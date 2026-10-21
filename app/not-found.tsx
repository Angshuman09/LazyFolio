import Link from "next/link";
import { Query } from "@lucasmarkes/hairline/react";
import Navbar from "@/components/home-page/navbar";
import Footer from "@/components/home-page/footer";
import { getMainSiteUrl } from "@/lib/utils/public-url";

export default function NotFound() {
  return (
    <div className="font-sans-body min-h-screen bg-(--lf-bg) text-(--lf-ink)">
      <Navbar />

      <section className="home-hero max-w-5xl mx-auto px-5 sm:px-8 text-center">
        <p className="mb-5 font-mono text-[0.72rem] tracking-[0.3em] text-(--lf-accent-text) uppercase">
          404
        </p>

        <p className="mx-auto max-w-xl font-serif-display text-[1rem] leading-[1.7] text-balance text-(--lf-muted)">
          The link is broken or the page moved, nothing lives at this address.
        </p>

        <figure className="lf-hairline mx-auto mt-9 w-full max-w-md rounded-[1.5rem]">
          <Query play className="w-full" />
        </figure>

        <div className="mt-9">
          <Link
            href={getMainSiteUrl()}
            className="group inline-flex h-11 items-center gap-2 rounded-full bg-(--lf-ink) pr-1.5 pl-5 text-[0.8125rem] font-semibold text-(--lf-bg) transition-opacity hover:opacity-85 lf-focus"
          >
            back to home
            <span
              aria-hidden
              className="btn-arrow inline-flex size-6 items-center justify-center rounded-full bg-(--lf-bg) text-[11px] leading-none font-bold text-(--lf-ink)"
            >
              ↗
            </span>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
