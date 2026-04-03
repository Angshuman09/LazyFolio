"use client";

import { GoogleAuth } from "@/components/auth/google-auth";
import { GithubAuth } from "@/components/auth/github-auth";
import {
  Zap,
  Moon,
  Search,
  Palette,
  Activity,
  Smartphone,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";

const features = [
  { icon: Zap, label: "Rapid Setup" },
  { icon: Palette, label: "Custom Themes" },
  { icon: Activity, label: "Analytics" },
  { icon: Smartphone, label: "Responsive" },
];

export default function Auth() {
  const router = useRouter();
  const [disable, setDisable] = useState(false);

  return (
    <div className="flex flex-col md:flex-row min-h-screen w-full bg-(--lf-bg) text-(--lf-ink)">
      {/* Left Panel — Branding */}
      <div className="relative flex flex-col justify-between px-8 py-10 md:w-1/2 md:min-h-screen md:px-16 md:py-20 min-h-[300px] border-b md:border-b-0 md:border-r border-(--lf-border-alpha) bg-(--lf-surface)">
        {/* Subtle decorative grid background for the left panel */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.03] dark:opacity-10">
          <svg width="100%" height="100%">
            <defs>
              <pattern
                id="auth-grid"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 40 0 L 0 0 0 40"
                  fill="none"
                  stroke="var(--lf-ink)"
                  strokeWidth="1"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#auth-grid)" />
          </svg>
        </div>

        {/* Logo */}
        <div className="relative z-10 flex items-center mb-8 md:mb-0">
          <h1 className="font-serif-display text-4xl md:text-5xl tracking-tight text-(--lf-ink)">
            Lazy<span className="font-bold text-(--lf-glow)">folio</span>
          </h1>
        </div>

        {/* Tagline */}
        <div className="hidden md:block relative z-10 my-8">
          <p className="font-serif-display text-5xl md:text-6xl font-normal leading-[1.1] tracking-tight text-(--lf-ink)">
            Build your portfolio
            <br />
            in <span className="font-bold">minutes.</span>
          </p>
          <p className="mt-6 text-(--lf-muted) text-lg font-sans-body leading-relaxed max-w-sm">
            No deployment. No setup. Just create and share. Show off your work
            effortlessly.
          </p>
        </div>

        {/* Features grid — desktop */}
        <div className="hidden md:block relative z-10">
          <div className="grid grid-cols-2 gap-3">
            {features.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-3 px-4 py-3 rounded-2xl border border-(--lf-border-alpha) bg-(--lf-bg) backdrop-blur-sm shadow-sm"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-(--lf-accent-soft) text-(--lf-ink) shrink-0">
                  <Icon className="h-4 w-4" strokeWidth={2} />
                </div>
                <span className="text-(--lf-ink) text-sm font-semibold font-sans-body">
                  {label}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-8 flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 shrink-0"></span>
            <p className="text-xs font-medium text-(--lf-muted) font-sans-body">
              Online in seconds.
            </p>
          </div>
        </div>

        {/* Features — mobile compact pills */}
        <div className="flex flex-wrap gap-2 md:hidden mt-6 relative z-10">
          {features.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-2 rounded-full border border-(--lf-border-alpha) bg-(--lf-bg) px-3 py-1.5 shadow-sm"
            >
              <Icon
                className="h-3.5 w-3.5 text-(--lf-ink) shrink-0"
                strokeWidth={2}
              />
              <span className="text-(--lf-ink) text-xs font-semibold">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel — Auth */}
      <div className="flex flex-col justify-center flex-1 px-8 py-12 md:px-16 md:py-20 relative bg-(--lf-bg)">
        <div className="w-full max-w-sm mx-auto relative z-10">
          <div className="mb-8 text-center md:text-left">
            <h2 className="font-serif-display text-4xl font-normal tracking-tight text-(--lf-ink) sm:text-5xl">
              Welcome back
            </h2>
            <p className="mt-3 text-base text-(--lf-muted) font-sans-body">
              Sign in to manage your portfolio and settings.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <GoogleAuth disable={disable} setDisable={setDisable} />
            <GithubAuth disable={disable} setDisable={setDisable} />

            <div className="mt-6 flex items-center justify-center">
              <Button
                variant="ghost"
                onClick={() => router.push("/")}
                className="text-(--lf-muted) hover:text-(--lf-ink) hover:bg-(--lf-surface) text-sm font-medium transition-colors font-sans-body rounded-2xl px-6"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to home
              </Button>
            </div>
          </div>

          <div className="mt-12 flex justify-center md:hidden">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-(--lf-surface) border border-(--lf-border-alpha)">
              <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0"></span>
              <p className="text-xs font-medium text-(--lf-muted) font-sans-body">
                Online in seconds.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
