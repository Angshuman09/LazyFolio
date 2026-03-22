"use client";

import { useState, useEffect, type PointerEvent, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { MoonIcon, SunIcon } from "@/components/assets/svgs";
import { UserButton, useUser } from "@clerk/nextjs";
import { Github, Menu, X } from "lucide-react";
import Link from "next/link";
import { useThemeStore } from "@/lib/theme-store";
import { Button } from "@/components/ui/button";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
} from "framer-motion";


const NAV_LEFT = [
  { label: "Features", href: "#features" },
  { label: "Templates", href: "#" },
  { label: "Blog", href: "#" },
];

const FEATURES = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/>
        <rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/>
      </svg>
    ),
    tag: "Design",
    title: "Beautiful Templates",
    desc: "Modern, developer-focused designs that make your work shine — no design skills required.",
    span: "md:col-span-7",
    accent: false,
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    ),
    tag: "Insights",
    title: "Built-in Analytics",
    desc: "Track visitors, clicks, and engagement — all in one dashboard.",
    span: "md:col-span-5",
    accent: false,
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
        <polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/>
      </svg>
    ),
    tag: "Deploy",
    title: "One-Click Publish",
    desc: "Go live instantly with a shareable link. No deployment pipeline needed.",
    span: "md:col-span-5",
    accent: true,
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <line x1="2" y1="12" x2="22" y2="12"/>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
      </svg>
    ),
    tag: "Custom",
    title: "Fast Custom Domain",
    desc: "Connect your own domain in minutes — no DNS headaches, no waiting.",
    span: "md:col-span-7",
    accent: false,
  },
];

function GlowCard({
  className,
  children,
  glowColor = "rgba(255,255,255,0.22)",
}: {
  className: string;
  children: ReactNode;
  glowColor?: string;
}) {
  const mx = useMotionValue(110);
  const my = useMotionValue(110);
  const glowOpacity = useMotionValue(0);

  const sx = useSpring(mx, { stiffness: 420, damping: 42, mass: 0.35 });
  const sy = useSpring(my, { stiffness: 420, damping: 42, mass: 0.35 });
  const so = useSpring(glowOpacity, { stiffness: 260, damping: 30, mass: 0.4 });

  const glowBackground = useMotionTemplate`radial-gradient(260px circle at ${sx}px ${sy}px, ${glowColor}, rgba(255,255,255,0.04) 32%, transparent 72%)`;

  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mx.set(e.clientX - rect.left);
    my.set(e.clientY - rect.top);
    glowOpacity.set(1);
  };

  return (
    <motion.div
      className={`relative isolate overflow-hidden ${className}`}
      onPointerMove={handlePointerMove}
      onPointerEnter={handlePointerMove}
      onPointerLeave={() => glowOpacity.set(0)}
      whileHover={{ scale: 1.015 }}
      transition={{ type: "spring", stiffness: 280, damping: 24, mass: 0.8 }}
    >
      <motion.div
        className="pointer-events-none absolute inset-0 z-0 rounded-[inherit]"
        style={{
          opacity: so,
          backgroundImage: glowBackground,
          filter: "blur(16px)",
        }}
      />
      <div className="relative z-10 h-full">{children}</div>
    </motion.div>
  );
}

export default function LazyfolioLanding() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();
  const { user } = useUser();
  const [stars, setStars] = useState<number | null>(null);
  const theme = useThemeStore((s) => s.theme);
  const setTheme = useThemeStore((s) => s.setTheme);
  const toggleTheme = useThemeStore((s) => s.toggleTheme);
  const dark = theme === "dark";

  useEffect(() => {
    if (typeof document === "undefined") return;
    setTheme(document.documentElement.classList.contains("dark") ? "dark" : "light");
  }, [setTheme]);

  useEffect(() => {
    fetch("https://api.github.com/repos/Angshuman09/lazyfolio")
      .then((r) => r.json())
      .then((d) => typeof d.stargazers_count === "number" && setStars(d.stargazers_count))
      .catch(console.error);
  }, []);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
   <div className="font-sans-body min-h-screen bg-(--lf-bg) text-(--lf-ink)">

      {/* ── Navbar ─────────────────────────────────────────────────────────── */}
      <nav
        className={[
          "sticky top-0 z-50 bg-(--lf-bg)/90 backdrop-blur-md px-6 md:px-12 py-3.5 transition-all duration-300",
          scrolled ? "border-b border-(--lf-border-alpha)" : "",
        ].join(" ")}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">

          {/* Left nav links */}
          <ul className="hidden md:flex gap-8 text-[0.8rem] text-(--lf-muted) font-medium tracking-wide">
            {NAV_LEFT.map((item) => (
              <li key={item.label}>
                <a href={item.href} className="hover:text-(--lf-ink) transition-colors duration-150">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Centered wordmark */}
          <span className="font-serif-display text-[1.3rem] font-normal tracking-tight absolute left-1/2 -translate-x-1/2 select-none">
            Lazyfolio
          </span>

          {/* Right actions */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="https://github.com/Angshuman09/lazyfolio"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-full border border-(--lf-border) bg-(--lf-surface) px-3 py-1.5 text-[0.78rem] font-medium text-(--lf-ink) hover:bg-(--lf-border) transition-colors duration-150"
            >
              <Github className="h-3.5 w-3.5" />
              <span>{stars !== null ? stars.toLocaleString() : "0"}</span>
            </Link>

            <button
              onClick={toggleTheme}
              aria-label="Toggle dark mode"
              className="inline-flex items-center justify-center w-9 h-9 rounded-full text-(--lf-muted) hover:text-(--lf-ink) hover:bg-(--lf-surface) transition-all duration-150"
            >
              {dark ? <SunIcon /> : <MoonIcon />}
            </button>

            {user ? (
              <>
                <Button onClick={() => router.push("/dashboard")} className="rounded-full text-sm px-5">
                  Dashboard
                </Button>
                <UserButton />
              </>
            ) : (
              <button
                onClick={() => router.push("/sign-in")}
                className="bg-(--lf-ink) text-(--lf-bg) text-[0.8rem] font-semibold px-5 py-2 rounded-full hover:opacity-80 transition-opacity flex items-center gap-1.5"
              >
                Get started
                <span className="btn-arrow w-4 h-4 bg-(--lf-bg) text-(--lf-ink) rounded-full inline-flex items-center justify-center text-[9px] font-bold leading-none">
                  ↗
                </span>
              </button>
            )}
          </div>

          {/* Mobile controls */}
          <div className="md:hidden flex items-center gap-2 ml-auto">
            <button
              onClick={toggleTheme}
              aria-label="Toggle dark mode"
              className="inline-flex items-center justify-center w-9 h-9 rounded-full text-(--lf-muted) hover:text-(--lf-ink) hover:bg-(--lf-surface) transition-all"
            >
              {dark ? <SunIcon /> : <MoonIcon />}
            </button>
            <button className="p-1 text-(--lf-muted)" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={[
            "md:hidden absolute top-full left-0 right-0 bg-(--lf-bg) border-b border-(--lf-border-alpha) flex flex-col gap-3 px-6 overflow-hidden transition-all duration-300",
            menuOpen ? "py-5 max-h-72 opacity-100" : "max-h-0 py-0 opacity-0",
          ].join(" ")}
        >
          {NAV_LEFT.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-[0.85rem] font-medium text-(--lf-muted) hover:text-(--lf-ink) transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </a>
          ))}
          <Link
            href="https://github.com/Angshuman09/lazyfolio"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-full border border-(--lf-border) bg-(--lf-surface) px-4 py-2.5 text-[0.8rem] font-medium text-(--lf-ink)"
          >
            <Github className="h-4 w-4" />
            <span>{stars !== null ? stars.toLocaleString() : "0"} stars</span>
          </Link>
          <button
            onClick={() => router.push("/sign-in")}
            className="text-sm font-semibold bg-(--lf-ink) text-(--lf-bg) px-5 py-3 rounded-full hover:opacity-80 transition-opacity"
          >
            Get started
          </button>
        </div>
      </nav>

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      {/*
        Add .hero-gradient to globals.css (see top of file).
        It gives a soft radial vignette from the top — works in light + dark.
      */}
      <section className="hero-gradient max-w-3xl mx-auto px-6 pt-28 pb-32 text-center">
        <p className="fade-up fade-up-1 text-(--lf-muted) text-[0.78rem] uppercase tracking-[0.14em] font-semibold mb-5">
          Level Up Your Journey
        </p>
        <h1 className="fade-up fade-up-2 font-serif-display text-[clamp(3rem,7vw,4.8rem)] font-normal leading-[1.07] tracking-tight mb-6 text-(--lf-ink)">
          Build your portfolio{" "}
          <br />
          <strong className="font-serif-display font-bold">in minutes</strong>
        </h1>
        <p className="fade-up fade-up-3 text-[1rem] text-(--lf-muted) leading-relaxed max-w-sm mx-auto mb-10">
          No deployment. No setup. Just create and share.
        </p>
        <button
          onClick={() => router.push("/sign-in")}
          className="fade-up fade-up-3 inline-flex items-center gap-2 bg-(--lf-ink) text-(--lf-bg) text-[0.9rem] font-semibold px-6 py-3.5 rounded-full border-2 border-(--lf-ink) hover:bg-(--lf-bg) hover:text-(--lf-ink) transition-all duration-300"
        >
          Get started for Free
          <span className="btn-arrow w-5 h-5 bg-(--lf-bg) text-(--lf-ink) rounded-full inline-flex items-center justify-center text-[10px] font-bold leading-none">
            ↗
          </span>
        </button>
      </section>

      {/* ── How to use ─────────────────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 md:px-6 pb-24">
        <h2 className="font-serif-display text-[clamp(1.8rem,4vw,2.8rem)] font-bold leading-tight tracking-tight mb-3 text-center text-(--lf-ink)">
          How to use?
        </h2>
        <p className="text-center text-(--lf-muted) text-sm">
          Video will be uploaded after the project is done :)
        </p>
      </section>

      {/* ── Features ───────────────────────────────────────────────────────── */}
      <section
        id="features"
        className="max-w-5xl mx-auto px-4 md:px-6 pb-28 scroll-mt-24"
      >
        <h2 className="font-serif-display text-[clamp(1.8rem,4vw,2.8rem)] font-bold leading-tight tracking-tight mb-10 text-center text-(--lf-ink)">
          Simple, Clear, Useful for
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 max-w-4xl mx-auto">
          {FEATURES.map((f) => (
            <GlowCard
              key={f.title}
              className={[
                f.span,
                "rounded-2xl border min-h-[200px] p-6 flex flex-col justify-between",
                f.accent
                  ? "border-(--lf-border-alpha) bg-(--lf-tan)"
                  : "border-(--lf-border-alpha) bg-(--lf-surface)",
              ].join(" ")}
              glowColor="rgba(255,255,255,0.16)"
            >
              {/* Top row: icon + tag */}
              <div className="flex items-start justify-between">
                <span className={f.accent ? "text-(--lf-tan-text) opacity-50" : "text-(--lf-muted) opacity-60"}>
                  {f.icon}
                </span>
                <span
                  className={[
                    "text-[0.62rem] font-semibold uppercase tracking-widest rounded-full px-2.5 py-1 border",
                    f.accent
                      ? "text-(--lf-tan-text) border-current opacity-60"
                      : "text-(--lf-muted) border-(--lf-border-alpha)",
                  ].join(" ")}
                >
                  {f.tag}
                </span>
              </div>

              {/* Bottom row: title + desc */}
              <div className="mt-8">
                <h3
                  className={[
                    "font-semibold text-[1.05rem] leading-snug mb-1.5",
                    f.title === "Beautiful Templates"
                      ? "font-serif-display text-[1.4rem] font-bold"
                      : "",
                    "text-(--lf-ink)",
                  ].join(" ")}
                >
                  {f.title}
                </h3>
                <p
                  className={[
                    "text-[0.76rem] leading-relaxed max-w-xs",
                    f.accent ? "text-(--lf-tan-text)" : "text-(--lf-muted)",
                  ].join(" ")}
                >
                  {f.desc}
                </p>
              </div>
            </GlowCard>
          ))}
        </div>
      </section>

      {/* ── Footer CTA ─────────────────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 md:px-6 mb-28">
        <div className="bg-(--lf-ink) text-(--lf-bg) rounded-3xl px-8 py-20 text-center">
          <h2 className="font-serif-display text-[clamp(2rem,5vw,3rem)] font-bold leading-tight mb-4">
            Your Portfolio,
            <br />
            <span className="opacity-40">Finally Done Right.</span>
          </h2>
          <p className="text-[0.9rem] font-medium opacity-50 leading-relaxed mb-10 max-w-sm mx-auto">
            Set up in under 5 minutes. No design skills needed. Just pick your
            profession and go.
          </p>
          <a
            href="#"
            className="inline-flex items-center gap-2 bg-(--lf-bg) text-(--lf-ink) text-[0.88rem] font-semibold px-7 py-3.5 rounded-full hover:opacity-80 transition-opacity"
          >
            Start for free
            <span className="btn-arrow w-5 h-5 bg-(--lf-ink) text-(--lf-bg) rounded-full inline-flex items-center justify-center text-[10px] font-bold leading-none">
              ↗
            </span>
          </a>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <footer className="border-t border-(--lf-border-alpha) px-6 md:px-12 py-7 flex flex-col md:flex-row items-center justify-between gap-4 text-[0.78rem] font-medium text-(--lf-sub)">
        <span className="font-serif-display text-lg font-normal text-(--lf-ink)">
          Lazyfolio
        </span>
        <span>© 2025 Lazyfolio. Built for creators.</span>
        <div className="flex gap-7">
          {["Privacy", "Terms", "Contact"].map((l) => (
            <a key={l} href="#" className="hover:text-(--lf-ink) transition-colors duration-150">
              {l}
            </a>
          ))}
        </div>
      </footer>

    </div>
  );
}