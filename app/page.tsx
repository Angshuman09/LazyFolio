"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const NAV_LEFT = ["Services", "Features", "Blog", "Services"];
const NAV_RIGHT = ["About", "Pricing", "Contact"];

const MINI_FEATURES = [
  {
    title: "Real-Time Collaboration",
    desc: "Keep your entire team in sync with messaging, file sharing, and live updates.",
  },
  {
    title: "Task & Project Tracking",
    desc: "Manage tasks, set milestones, and keep business related to your team's goals.",
  },
  {
    title: "Performance Insights",
    desc: "Make smarter decisions with analytics that show productivity trends, bottlenecks, and team workload balance.",
  },
];

export default function LazyfolioLanding() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <div className="min-h-screen bg-[#F5F0E8] text-[#1a1a1a] overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@400;500;600;700&display=swap');

        *, *::before, *::after { font-family: 'Inter', sans-serif; box-sizing: border-box; }
        .font-serif-display { font-family: 'Instrument Serif', Georgia, serif !important; }

        .hover-lift { transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1); }
        .hover-lift:hover { transform: translateY(-4px); }

        .card-shadow { box-shadow: 0 2px 16px rgba(0,0,0,0.07); }
        .card-shadow-lg { box-shadow: 0 8px 40px rgba(0,0,0,0.10); }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.7s ease both; }
        .fade-up-1 { animation-delay: 0.1s; }
        .fade-up-2 { animation-delay: 0.2s; }
        .fade-up-3 { animation-delay: 0.3s; }
      `}</style>

      <nav
        className={`sticky top-0 z-50 bg-[#F5F0E8] px-6 md:px-12 py-4 transition-shadow duration-300 ${
          scrolled ? "shadow-[0_1px_0_rgba(0,0,0,0.08)]" : ""
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <ul className="hidden md:flex gap-7 text-[0.82rem] text-[#7a7068] font-medium">
            {NAV_LEFT.map((l, i) => (
              <li key={`${l}-${i}`}>
                <a href="#" className="hover:text-[#1a1a1a] transition-colors">
                  {l}
                </a>
              </li>
            ))}
          </ul>

          <span className="font-serif-display text-[1.35rem] font-normal tracking-tight absolute left-1/2 -translate-x-1/2">
            Lazyfolio
          </span>

          <div className="hidden md:flex items-center gap-6">
            {NAV_RIGHT.map((l) => (
              <a
                key={l}
                href="#"
                className="text-[0.82rem] text-[#7a7068] font-medium hover:text-[#1a1a1a] transition-colors"
              >
                {l}
              </a>
            ))}
            <button className="bg-[#1a1a1a] text-[#F5F0E8] text-[0.82rem] font-semibold px-5 py-2.5 rounded-full hover:opacity-85 transition-opacity flex items-center gap-2">
              Get started
              <span className="w-5 h-5 bg-[#F5F0E8] text-[#1a1a1a] rounded-full inline-flex items-center justify-center text-[10px] font-bold leading-none">
                ↗
              </span>
            </button>
          </div>

          <button
            className="md:hidden flex flex-col gap-[5px] p-1 ml-auto"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span
              className={`block w-5 h-0.5 bg-[#1a1a1a] rounded transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-[7px]" : ""}`}
            />
            <span
              className={`block w-5 h-0.5 bg-[#1a1a1a] rounded transition-opacity ${menuOpen ? "opacity-0" : ""}`}
            />
            <span
              className={`block w-5 h-0.5 bg-[#1a1a1a] rounded transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-[7px]" : ""}`}
            />
          </button>
        </div>

        <div
          className={`md:hidden absolute top-full left-0 right-0 bg-[#F5F0E8] border-b border-black/[0.07] flex flex-col gap-4 px-6 overflow-hidden transition-all duration-300 ${menuOpen ? "py-5 max-h-80 opacity-100" : "max-h-0 py-0 opacity-0"}`}
        >
          {[
            ...NAV_LEFT.filter((v, i, a) => a.indexOf(v) === i),
            ...NAV_RIGHT,
          ].map((l) => (
            <a
              key={l}
              href="#"
              className="text-sm font-medium text-[#7a7068]"
              onClick={() => setMenuOpen(false)}
            >
              {l}
            </a>
          ))}
          <button className="text-sm font-semibold bg-[#1a1a1a] text-[#F5F0E8] px-5 py-3 rounded-full mt-1">
            Get started
          </button>
        </div>
      </nav>

      <section className="max-w-3xl mx-auto px-6 pt-16 pb-6 text-center">
        <p className="fade-up fade-up-1 text-[#7a7068] text-[0.85rem] mb-5">
          Streamline Your Team,
        </p>
        <h1 className="fade-up fade-up-2 font-serif-display text-[clamp(2.8rem,6vw,4.2rem)] font-normal leading-[1.1] tracking-tight mb-5 text-[#1a1a1a]">
          <span className="font-normal">Streamline Your Team,</span>
          <br />
          <strong className="font-bold">Supercharge Your Workflow</strong>
        </h1>
        <p className="fade-up fade-up-3 text-[0.95rem] text-[#7a7068] leading-relaxed max-w-sm mx-auto mb-8">
          All-in-one platform to plan, collaborate,
          <br />
          and deliver — faster and smarter.
        </p>
        <a
          href="#"
          className="fade-up fade-up-3 inline-flex items-center gap-2 bg-[#1a1a1a] text-[#F5F0E8] text-[0.9rem] font-semibold px-7 py-3.5 rounded-full hover:opacity-85 transition-opacity card-shadow-lg"
        >
          Get started for Free
          <span className="w-6 h-6 bg-[#F5F0E8] text-[#1a1a1a] rounded-full inline-flex items-center justify-center text-xs font-bold leading-none">
            →
          </span>
        </a>
      </section>

      <section className="max-w-5xl mx-auto px-4 pb-10 pt-6 overflow-hidden">
        <div
          className="relative rounded-[28px] overflow-hidden card-shadow-lg"
          style={{ height: "260px" }}
        >
          <Image
            src="/hero_photo_strip.png"
            alt="Diverse team of professionals"
            fill
            className="object-cover object-top"
            priority
          />
          <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-[#F5F0E8] to-transparent" />
          <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-[#F5F0E8] to-transparent" />
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        {MINI_FEATURES.map((f) => (
          <div key={f.title} className="text-center md:text-left">
            <h3 className="text-[0.9rem] font-semibold text-[#1a1a1a] mb-1.5">
              {f.title}
            </h3>
            <p className="text-[0.78rem] text-[#8a8078] leading-relaxed">
              {f.desc}
            </p>
          </div>
        ))}
      </section>

      <div className="max-w-5xl mx-auto px-6">
        <div className="h-px bg-[#E0D8CC]" />
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
        <p className="text-[0.88rem] text-[#7a7068] leading-relaxed max-w-sm mx-auto">
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
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-7 text-white">
              <h3 className="font-serif-display text-[1.3rem] font-bold mb-1">
                Built-In Team Chat
              </h3>
              <p className="text-[0.78rem] text-white/70 leading-relaxed max-w-[220px]">
                Communicate instantly within any project. Keep conversations and
                work in one place.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div
              className="hover-lift bg-[#EDEBE4] rounded-[24px] p-7 flex flex-col justify-center card-shadow"
              style={{ minHeight: "168px" }}
            >
              <h3 className="text-[1.1rem] font-bold text-[#1a1a1a] mb-2">
                Task Assignment
              </h3>
              <p className="text-[0.8rem] text-[#7a7068] leading-relaxed">
                Easily create, assign, and track tasks to keep everyone aligned
                and accountable.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 flex-1">
              <div
                className="hover-lift rounded-[24px] p-6 flex flex-col justify-end card-shadow"
                style={{ background: "#C0BAA8", minHeight: "188px" }}
              >
                <h3 className="text-[0.95rem] font-bold text-[#1a1a1a] mb-1.5">
                  Real-Time Scheduling
                </h3>
                <p className="text-[0.72rem] text-[#4a4640] leading-relaxed">
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
                <div className="absolute inset-0 bg-gradient-to-t from-[#4A6741]/90 via-[#4A6741]/30 to-transparent" />
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
        <p className="text-[0.88rem] text-[#7a7068] leading-relaxed max-w-sm mx-auto mb-12">
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
          <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[#F5F0E8] to-transparent" />
          <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[#F5F0E8] to-transparent" />
        </div>
      </section>

      <section className="max-w-[760px] mx-auto px-4 md:px-6 mb-28">
        <div className="bg-[#1a1a1a] text-[#F5F0E8] rounded-[32px] px-8 py-20 text-center card-shadow-lg">
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
            className="inline-flex items-center gap-2 bg-[#F5F0E8] text-[#1a1a1a] text-[0.9rem] font-semibold px-8 py-4 rounded-full hover:opacity-90 transition-opacity"
          >
            Start for free
            <span className="w-6 h-6 bg-[#1a1a1a] text-[#F5F0E8] rounded-full inline-flex items-center justify-center text-xs font-bold leading-none">
              →
            </span>
          </a>
        </div>
      </section>

      <footer className="border-t border-black/[0.07] px-6 md:px-12 py-8 flex flex-col md:flex-row items-center justify-between gap-5 text-[0.82rem] font-medium text-[#9a9088]">
        <span className="font-serif-display text-lg font-normal text-[#1a1a1a]">
          Lazyfolio
        </span>
        <span>© 2025 Lazyfolio. Built for creators.</span>
        <div className="flex gap-8">
          {["Privacy", "Terms", "Contact"].map((l) => (
            <a
              key={l}
              href="#"
              className="hover:text-[#1a1a1a] transition-colors"
            >
              {l}
            </a>
          ))}
        </div>
      </footer>
    </div>
  );
}
