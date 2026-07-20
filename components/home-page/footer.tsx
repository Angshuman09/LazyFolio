"use client";

import Link from "next/link";

const Footer = () => {
  const navColumns = [
    {
      heading: "The Good",
      links: [
        { label: "Home", href: "/" },
        { label: "Features", href: "#features" },
        { label: "Templates", href: "/templates" },
      ],
    },
    {
      heading: "The Boring",
      links: [
        { label: "Privacy Policy", href: "/" },
        { label: "Terms of Service", href: "/" },
      ],
    },
    {
      heading: "The Cool",
      links: [
        { label: "X / Twitter", href: "https://x.com/angshuhere" },
        { label: "GitHub", href: "https://github.com/Angshuman09/lazyfolio" },
      ],
    },
  ];

  return (
    <footer
      aria-label="Site footer"
      className="w-full relative overflow-hidden bg-(--lf-surface) text-(--lf-ink)"
    >
      <div className="px-6 md:px-12">
        <div className="section-divider" />
      </div>

      <div className="px-8 md:px-16 pt-14 pb-0">
        <div className="flex flex-col md:flex-row gap-12 md:gap-0 max-w-7xl mx-auto">

          <div className="md:w-72 shrink-0 md:pr-16 flex flex-col gap-3">
            <span className="font-serif-display text-[1.4rem] font-normal tracking-tight text-(--lf-ink)">
              Lazy<span className="text-(--lf-muted)">folio</span>
            </span>
            <Link
              href="https://github.com/Angshuman09/lazyfolio"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-flex items-center gap-1.5 text-[0.75rem] text-(--lf-muted) hover:text-(--lf-ink) transition-colors duration-150 underline underline-offset-4 decoration-(--lf-border) w-fit"
            >
              ★ Star on GitHub
            </Link>
          </div>

          <div className="flex flex-1 gap-12 md:gap-16 lg:gap-24">
            {navColumns.map((col) => (
              <div key={col.heading} className="flex-1">
                <p className="text-[0.7rem] font-semibold uppercase tracking-widest mb-5 text-(--lf-sub)">
                  {col.heading}
                </p>
                <ul className="flex flex-col gap-3">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-[0.83rem] text-(--lf-muted) hover:text-(--lf-ink) transition-colors duration-150"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-10 pb-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-[0.72rem] text-(--lf-sub)">
            © {new Date().getFullYear()} Lazyfolio. Open-source &amp; free.
          </p>
          <p className="text-[0.72rem] text-(--lf-sub)">
            Built with ♥ by{" "}
            <Link
              href="https://github.com/Angshuman09"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-(--lf-ink) transition-colors underline underline-offset-2 decoration-(--lf-border)"
            >
              Angshuman
            </Link>
          </p>
        </div>
      </div>

      <div
        aria-hidden="true"
        className="mt-2 select-none pointer-events-none leading-none text-(--lf-border)"
        style={{
          fontSize: "clamp(80px, 18vw, 220px)",
          fontWeight: 800,
          lineHeight: 0.85,
          paddingLeft: "0.03em",
          fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
          overflow: "hidden",
          maxHeight: "0.70em",
        }}
      >
        Lazyfolio
      </div>

      <div style={{ height: "2rem" }} />
    </footer>
  );
};

export default Footer;