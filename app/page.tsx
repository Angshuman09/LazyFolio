"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { MoonIcon, SunIcon } from "@/components/assets/svgs";
import { UserButton, useUser } from "@clerk/nextjs";
import { Cross, CrossIcon, Github, Menu, X } from "lucide-react";
import Link from "next/link";
import { useThemeStore } from "@/lib/theme-store";
import { Button } from "@/components/ui/button";
const NAV_LEFT = ["Features", "Templates", "Blog"];

export default function LazyfolioLanding() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();
  const { user } = useUser();
  const [stars, setStars] = useState<number | null>(null);
  const theme = useThemeStore((state) => state.theme);
  const setTheme = useThemeStore((state) => state.setTheme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);
  const dark = theme === "dark";

  useEffect(() => {
    if (typeof document === "undefined") return;
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "dark" : "light");
  }, [setTheme]);

  useEffect(() => {
    fetch("https://api.github.com/repos/Angshuman09/lazyfolio")
      .then((res) => res.json())
      .then((data) => {
        if (typeof data.stargazers_count === "number") {
          setStars(data.stargazers_count);
          console.log(data.stargazers_count);
        }
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <div className="min-h-screen bg-(--lf-bg) text-(--lf-ink) overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@400;500;600;700&display=swap');

        *, *::before, *::after { font-family: 'Inter', sans-serif; box-sizing: border-box; }
        .font-serif-display { font-family: 'Instrument Serif', Georgia, serif !important; }

        .hover-lift { transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1); }
        .hover-lift:hover { transform: translateY(-4px); }

        .card-shadow { box-shadow: 0 2px 16px rgba(0,0,0,0.07); }
        .card-shadow-lg { box-shadow: 0 8px 40px rgba(0,0,0,0.10); }
        .dark .card-shadow { box-shadow: 0 2px 16px rgba(0,0,0,0.35); }
        .dark .card-shadow-lg { box-shadow: 0 8px 40px rgba(0,0,0,0.45); }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.7s ease both; }
        .fade-up-1 { animation-delay: 0.1s; }
        .fade-up-2 { animation-delay: 0.2s; }
        .fade-up-3 { animation-delay: 0.3s; }

        /* Theme toggle button */
        .theme-toggle {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 2.25rem;
          height: 2.25rem;
          border-radius: 9999px;
          border: none;
          background: transparent;
          color: var(--lf-muted);
          cursor: pointer;
          transition: color 0.2s, background-color 0.2s, transform 0.2s;
        }
        .theme-toggle:hover {
          color: var(--lf-ink);
          background: var(--lf-surface);
          transform: scale(1.1);
        }
        .theme-toggle:active {
          transform: scale(0.95);
        }

        /* Arrow rotation on button hover */
        .btn-arrow {
          transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1);
        }
        button:hover .btn-arrow,
        a:hover .btn-arrow {
          transform: rotate(45deg);
        }
      `}</style>

      <nav
        className={`sticky top-0 z-50 bg-(--lf-bg) px-6 md:px-12 py-4 transition-shadow duration-300 ${
          scrolled ? "shadow-[0_1px_0_var(--lf-nav-shadow)]" : ""
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <ul className="hidden md:flex gap-7 text-[0.82rem] text-(--lf-muted) font-medium">
            {NAV_LEFT.map((l, i) => (
              <li key={`${l}-${i}`}>
                <a href="#" className="hover:text-(--lf-ink) transition-colors">
                  {l}
                </a>
              </li>
            ))}
          </ul>

          <span className="font-serif-display text-[1.35rem] font-normal tracking-tight absolute left-1/2 -translate-x-1/2">
            Lazyfolio
          </span>

          <div className="hidden md:flex items-center gap-6">
            <Link
              href="https://github.com/Angshuman09/lazyfolio"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-full border border-(--lf-border) bg-(--lf-surface) px-3 py-1.5 text-[0.8rem] font-medium text-(--lf-ink) transition-colors hover:bg-(--lf-border) ml-2"
            >
              <Github className="h-3.5 w-3.5" />
              <span>{stars !== null ? stars.toLocaleString() : "0"}</span>
            </Link>

            <button
              className="theme-toggle"
              onClick={toggleTheme}
              aria-label="Toggle dark mode"
            >
              {dark ? <SunIcon /> : <MoonIcon />}
            </button>
            {user ? (
              <>
              <Button onClick={()=>router.push('/dashboard')} className="rounded-full">Dashboard</Button>
              <UserButton />
              </>
            ) : (
              <button
                onClick={() => router.push("/sign-in")}
                className="bg-(--lf-ink) text-(--lf-bg) text-[0.82rem] font-semibold px-5 py-2.5 rounded-full hover:opacity-85 transition-opacity flex items-center gap-2"
              >
                Get started
                <span className="btn-arrow w-5 h-5 bg-(--lf-bg) text-(--lf-ink) rounded-full inline-flex items-center justify-center text-[10px] font-bold leading-none">
                  ↗
                </span>
              </button>
            )}
          </div>

          <div className="md:hidden flex items-center gap-2 ml-auto">
            <button
              className="theme-toggle"
              onClick={toggleTheme}
              aria-label="Toggle dark mode"
            >
              {dark ? <SunIcon /> : <MoonIcon />}
            </button>
            <button
              className="flex flex-col gap-1.25 p-1"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X className=""/> : <Menu className=""/>}
            </button>
          </div>
        </div>

        <div
          className={`md:hidden absolute top-full left-0 right-0 bg-(--lf-bg) border-b border-(--lf-border-alpha) flex flex-col gap-4 px-6 overflow-hidden transition-all duration-300 ${menuOpen ? "py-5 max-h-80 opacity-100" : "max-h-0 py-0 opacity-0"}`}
        >
          <Link
            href="https://github.com/Angshuman09/lazyfolio"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 rounded-full border border-(--lf-border) bg-(--lf-surface) px-4 py-2.5 text-[0.82rem] font-medium text-(--lf-ink) transition-colors hover:bg-(--lf-border)"
          >
            <Github className="h-4 w-4" />
            <span>{stars !== null ? stars.toLocaleString() : "0"} stars</span>
          </Link>
          <button
            onClick={() => router.push("/sign-in")}
            className="text-sm font-semibold bg-(--lf-ink) text-(--lf-bg) px-5 py-3 rounded-full mt-1 hover:opacity-85 transition-opacity flex items-center justify-center gap-2"
          >
            Get started
          </button>
        </div>
      </nav>

      <section className="max-w-3xl mx-auto px-6 pt-24 pb-28 text-center">
        <p className="fade-up fade-up-1 text-(--lf-muted) text-[0.85rem] tracking-wide mb-6">
          Level Up Your Journey
        </p>
        <h1 className="fade-up fade-up-2 font-serif-display text-[clamp(3.2rem,7vw,5rem)] font-normal leading-[1.08] tracking-tight mb-7 text-(--lf-ink)">
          <span className="font-serif-display font-normal">
            Build your portfolio{" "}
          </span>
          <br />
          <strong className="font-serif-display font-bold">in a minute</strong>
        </h1>
        <p className="fade-up fade-up-3 text-[1.05rem] text-(--lf-muted) leading-relaxed max-w-md mx-auto mb-10">
          No deployment. No setup. Just create and share.
        </p>
        <button
          onClick={() => router.push("/sign-in")}
          className="fade-up fade-up-3 inline-flex items-center gap-2 bg-(--lf-ink) text-(--lf-bg) text-[0.95rem] font-semibold px-5 py-4 rounded-full border-2 border-(--lf-ink) hover:bg-(--lf-bg) hover:text-(--lf-ink) transition-all duration-300 card-shadow-lg"
        >
          Get started for Free
          <span className="btn-arrow w-6 h-6 bg-(--lf-bg) text-(--lf-ink) rounded-full inline-flex items-center justify-center text-xs font-bold leading-none">
            ↗
          </span>
        </button>
      </section>

      <div className="max-w-5xl mx-auto px-6">
        <div className="h-px bg-(--lf-border)" />
      </div>

      <section
        id="features"
        className="max-w-3xl mx-auto px-6 pt-20 pb-12 text-center"
      >
        <h2 className="font-serif-display text-[clamp(2rem,4.5vw,3rem)] font-bold leading-tight tracking-tight mb-4">
          Everything Your Team Needs to
          <br />
          Work Smarter
        </h2>
        <p className="text-[0.88rem] text-(--lf-muted) leading-relaxed max-w-sm mx-auto">
          From task tracking to real-time chat, our features are built to keep
          your team connected, organised, and moving forward — together.
        </p>
      </section>

      <section className="max-w-5xl mx-auto px-4 md:px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            className="hover-lift relative rounded-[24px] overflow-hidden card-shadow-lg"
            style={{ minHeight: "360px" }}
          >
            <Image
              src="/team_chat_feature.png"
              alt="Built-In Team Chat"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-7 text-white">
              <h3 className="font-serif-display text-[1.3rem] font-bold mb-1">
                Built-In Team Chat
              </h3>
              <p className="text-[0.78rem] text-white/70 leading-relaxed max-w-55">
                Communicate instantly within any project. Keep conversations and
                work in one place.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div
              className="hover-lift bg-(--lf-surface) rounded-[24px] p-7 flex flex-col justify-center card-shadow"
              style={{ minHeight: "168px" }}
            >
              <h3 className="text-[1.1rem] font-bold text-(--lf-ink) mb-2">
                Task Assignment
              </h3>
              <p className="text-[0.8rem] text-(--lf-muted) leading-relaxed">
                Easily create, assign, and track tasks to keep everyone aligned
                and accountable.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 flex-1">
              <div
                className="hover-lift rounded-[24px] p-6 flex flex-col justify-end card-shadow"
                style={{ background: "var(--lf-tan)", minHeight: "188px" }}
              >
                <h3 className="text-[0.95rem] font-bold text-(--lf-ink) mb-1.5">
                  Real-Time Scheduling
                </h3>
                <p className="text-[0.72rem] text-(--lf-tan-text) leading-relaxed">
                  Plan meetings, set deadlines, and sync calendars so your team
                  stays on the same page.
                </p>
              </div>

              <div
                className="hover-lift relative rounded-[24px] overflow-hidden card-shadow-lg"
                style={{ minHeight: "188px" }}
              >
                <Image
                  src="/progress_tracking_feature.png"
                  alt="Progress Tracking"
                  fill
                  className="object-cover object-top"
                />
                <div className="absolute inset-0 bg-linear-to-t from-[#4A6741]/90 via-[#4A6741]/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                  <h3 className="text-[0.95rem] font-bold mb-1">
                    Progress Tracking
                  </h3>
                  <p className="text-[0.68rem] text-white/75 leading-relaxed">
                    Visualise team performance with dashboards that highlight
                    what's done and what's next.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-6 pb-16 text-center">
        <h2 className="font-serif-display text-[clamp(2rem,4.5vw,3rem)] font-bold leading-tight tracking-tight mb-4">
          Proven Results, Real Impact
        </h2>
        <p className="text-[0.88rem] text-(--lf-muted) leading-relaxed max-w-sm mx-auto mb-12">
          See how teams around the world are working faster, communicating
          better, and getting more done with our all-in-one management platform.
        </p>

        <div
          className="relative rounded-[24px] overflow-hidden card-shadow-lg"
          style={{ height: "220px" }}
        >
          <Image
            src="/social_proof_thumbnails.png"
            alt="Team results and impact"
            fill
            className="object-cover"
          />
          <div className="absolute inset-y-0 left-0 w-16 bg-linear-to-r from-(--lf-bg) to-transparent" />
          <div className="absolute inset-y-0 right-0 w-16 bg-linear-to-l from-(--lf-bg) to-transparent" />
        </div>
      </section>

      <section className="max-w-190 mx-auto px-4 md:px-6 mb-28">
        <div className="bg-(--lf-ink) text-(--lf-bg) rounded-[32px] px-8 py-20 text-center card-shadow-lg">
          <h2 className="font-serif-display text-[clamp(2rem,5vw,3.2rem)] font-bold leading-tight mb-5">
            Your Portfolio,
            <br />
            <span className="text-[#a3a3a3]">Finally Done Right.</span>
          </h2>
          <p className="text-[0.95rem] font-medium opacity-60 leading-relaxed mb-10 max-w-sm mx-auto">
            Set up in under 5 minutes. No design skills needed. Just pick your
            profession and go.
          </p>
          <a
            href="#"
            className="inline-flex items-center gap-2 bg-(--lf-bg) text-(--lf-ink) text-[0.9rem] font-semibold px-8 py-4 rounded-full hover:opacity-85 transition-opacity"
          >
            Start for free
            <span className="btn-arrow w-6 h-6 bg-(--lf-ink) text-(--lf-bg) rounded-full inline-flex items-center justify-center text-xs font-bold leading-none">
              ↗
            </span>
          </a>
        </div>
      </section>

      <footer className="border-t border-(--lf-border-alpha) px-6 md:px-12 py-8 flex flex-col md:flex-row items-center justify-between gap-5 text-[0.82rem] font-medium text-(--lf-sub)">
        <span className="font-serif-display text-lg font-normal text-(--lf-ink)">
          Lazyfolio
        </span>
        <span>© 2025 Lazyfolio. Built for creators.</span>
        <div className="flex gap-8">
          {["Privacy", "Terms", "Contact"].map((l) => (
            <a
              key={l}
              href="#"
              className="hover:text-(--lf-ink) transition-colors"
            >
              {l}
            </a>
          ))}
        </div>
      </footer>
    </div>
  );
}
