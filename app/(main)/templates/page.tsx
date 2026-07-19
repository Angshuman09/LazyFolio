import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { PERKS, TEMPLATES } from "@/components/resources/extras";

export default function TemplatesPage() {
  return (
    <div className="min-h-screen bg-(--lf-bg) text-(--lf-ink) font-sans-body">
      <section className="max-w-4xl mx-auto px-5 sm:px-8 pt-20 pb-16 text-center">
        <p className="inline-flex items-center gap-2 text-[0.72rem] font-mono tracking-widest text-(--lf-muted) uppercase mb-6 border border-(--lf-border) rounded-full px-4 py-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-(--lf-ink) opacity-50 inline-block" />
          8 Templates · Free Forever
        </p>
        <h1 className="font-serif-display text-[2.6rem] sm:text-[3.5rem] font-normal leading-[1.1] tracking-tight text-(--lf-ink) mb-5">
          Find your{" "}
          <em className="not-italic text-(--lf-tan-text)">perfect</em> style.
        </h1>
        <p className="text-[0.95rem] sm:text-[1.05rem] text-(--lf-muted) leading-relaxed max-w-xl mx-auto mb-10">
          Every template is crafted to present your work beautifully. Pick one,
          fill in your story, and go live in minutes.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/auth"
            className="inline-flex items-center gap-2 bg-(--lf-ink) text-(--lf-bg) text-[0.85rem] font-semibold px-5 py-2.5 rounded-[8px] hover:opacity-85 transition-opacity duration-150"
          >
            Get started
            <ArrowRight size={14} />
          </Link>
          <Link
            href="/#features"
            className="inline-flex items-center gap-2 border border-(--lf-border) text-(--lf-muted) text-[0.85rem] font-medium px-5 py-2.5 rounded-[8px] hover:text-(--lf-ink) hover:border-(--lf-muted) transition-colors duration-150"
          >
            See features
          </Link>
        </div>

        <ul className="mt-10 flex flex-col sm:flex-row flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {PERKS.map((perk) => (
            <li
              key={perk}
              className="flex items-center gap-1.5 text-[0.75rem] text-(--lf-muted)"
            >
              <Check size={11} strokeWidth={2.5} className="shrink-0 opacity-60" />
              {perk}
            </li>
          ))}
        </ul>
      </section>

      <div className="max-w-5xl mx-auto px-5 sm:px-8">
        <div className="h-px bg-(--lf-border)" />
      </div>

      <section className="max-w-5xl mx-auto px-5 sm:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {TEMPLATES.map((t, i) => (
            <article
              key={t.id}
              className="group relative flex flex-col rounded-2xl border border-(--lf-border) bg-(--lf-surface) overflow-hidden hover:border-(--lf-muted) hover:shadow-xl transition-all duration-300"
            >
              {/* Image */}
              <div className="relative w-full aspect-4/3 overflow-hidden bg-(--lf-border-alpha)">
                <Image
                  src={t.image}
                  alt={`${t.label} template preview`}
                  fill
                  sizes="(max-width: 640px) 92vw, 45vw"
                  priority={i < 2}
                  className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent" />
                
                <div className="absolute top-3 left-3 w-7 h-7 rounded-full bg-(--lf-bg)/85 backdrop-blur-sm border border-(--lf-border-alpha) flex items-center justify-center">
                  <span className="text-[0.65rem] font-mono font-semibold text-(--lf-muted)">
                    0{t.id}
                  </span>
                </div>


              </div>

              {/* Body */}
              <div className="p-4 flex flex-col flex-1">
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <h2 className="font-semibold text-[0.95rem] text-(--lf-ink) leading-tight">
                    {t.label}
                  </h2>
                  <span className="shrink-0 text-[0.68rem] font-mono text-(--lf-muted) border border-(--lf-border) rounded-full px-2 py-0.5 leading-none mt-0.5">
                    {t.preview}
                  </span>
                </div>

                <p className="text-[0.78rem] text-(--lf-muted) leading-relaxed flex-1 mb-3">
                  {t.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5">
                  {t.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[0.65rem] font-medium font-mono text-(--lf-muted) bg-(--lf-accent-soft) border border-(--lf-border-alpha) rounded-full px-2 py-0.5"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-5 sm:px-8 pb-20">
        <div className="rounded-2xl border border-(--lf-border) bg-(--lf-surface) px-8 py-12 text-center">
          <p className="font-mono text-[0.68rem] tracking-widest text-(--lf-muted) uppercase mb-3">
            Ready to go live?
          </p>
          <h2 className="font-serif-display text-[1.9rem] sm:text-[2.4rem] font-normal tracking-tight text-(--lf-ink) leading-snug mb-3">
            Your portfolio deserves a home.
          </h2>
          <p className="text-[0.88rem] text-(--lf-muted) max-w-sm mx-auto mb-7 leading-relaxed">
            Claim your unique link, choose a template, and share your work with
            the world in under 5 minutes.
          </p>
          <Link
            href="/auth"
            className="inline-flex items-center gap-2 bg-(--lf-ink) text-(--lf-bg) text-[0.85rem] font-semibold px-6 py-3.5 rounded-[8px] hover:opacity-85 transition-opacity duration-150"
          >
            Claim your link
            <span className="btn-arrow w-5 h-5 rounded-full bg-(--lf-bg) text-(--lf-ink) inline-flex items-center justify-center text-[9px] font-bold leading-none">
              ↗
            </span>
          </Link>
        </div>
      </section>
    </div>
  );
}