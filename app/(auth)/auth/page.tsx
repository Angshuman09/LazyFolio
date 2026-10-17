"use client";

import { GoogleAuth } from "@/components/auth/google-auth";
import { GithubAuth } from "@/components/auth/github-auth";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Moon, Sun } from "lucide-react";
import { useThemeStore } from "@/lib/utils/theme-store";
import { authClient } from "@/lib/auth/auth-client";

export default function Auth() {
  const router = useRouter();
  const [disable, setDisable] = useState(false);
  const { data: session, isPending } = authClient.useSession();
  const theme = useThemeStore((s) => s.theme);
  const toggleTheme = useThemeStore((s) => s.toggleTheme);
  const setTheme = useThemeStore((s) => s.setTheme);
  const isDark = theme === "dark";

  useEffect(() => {
    if (typeof document === "undefined") return;
    setTheme(
      document.documentElement.classList.contains("dark") ? "dark" : "light"
    );
  }, [setTheme]);

  // Already signed in? Skip the auth screen and go straight to the dashboard.
  useEffect(() => {
    if (session && !isPending) {
      router.replace("/dashboard");
    }
  }, [session, isPending, router]);

  return (
    <div className="min-h-dvh w-full bg-(--lf-bg) text-(--lf-ink) flex flex-col px-5 py-5 sm:px-8 sm:py-8 transition-colors duration-300">
      {/* Top Header */}
      <header className="w-full max-w-6xl mx-auto flex items-center justify-between">
        <Link
          href="/"
          className="font-serif-display text-xl sm:text-2xl font-medium tracking-tight text-(--lf-ink) hover:opacity-75 transition-opacity"
        >
          Lazyfolio
        </Link>

        <div className="flex items-center gap-2">
          <button
            className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-(--lf-border) bg-(--lf-surface) text-(--lf-muted) cursor-pointer hover:text-(--lf-ink) hover:border-(--lf-muted) transition-all"
            onClick={toggleTheme}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDark ? <Sun size={14} /> : <Moon size={14} />}
          </button>

          <Button
            variant="ghost"
            onClick={() => router.push("/")}
            aria-label="Back to home"
            className="text-(--lf-muted) hover:text-(--lf-ink) hover:bg-(--lf-surface) text-xs font-normal h-9 w-9 sm:w-auto p-0 sm:px-3 rounded-full cursor-pointer transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5 sm:mr-1.5" />
            <span className="hidden sm:inline">Back to home</span>
          </Button>
        </div>
      </header>

      {/* Main: no card, just a quiet centered column */}
      <main className="flex-1 flex flex-col items-center justify-center pb-10 sm:pb-14">
        <div className="w-full max-w-[340px] flex flex-col items-center">
          {/* Logo */}
          <Link
            href="/"
            className="group inline-flex mb-8"
            title="Lazyfolio Home"
          >
            <div className="w-12 h-12 rounded-[14px] bg-[#1c1c1e] flex items-center justify-center border border-black/5 dark:border-white/10 group-hover:scale-105 transition-transform duration-200">
              <Image
                src="/lflogo.png"
                alt="Lazyfolio Logo"
                width={28}
                height={28}
                className="object-contain"
                priority
              />
            </div>
          </Link>

          {/* Heading */}
          <h1 className="font-serif-display text-[2.1rem] sm:text-[2.4rem] font-normal tracking-tight text-(--lf-ink) leading-[1.1] text-center text-balance">
            Make the internet <br />
            know{" "}
            <span className="italic text-(--lf-accent-text)">you exist.</span>
          </h1>
          <p className="mt-3 mb-9 text-[0.85rem] text-(--lf-muted) font-light leading-relaxed text-center">
            Sign in to build and manage your portfolio.
          </p>

          {/* Auth Actions */}
          <div className="w-full flex flex-col gap-3">
            <GoogleAuth disable={disable} setDisable={setDisable} />
            <GithubAuth disable={disable} setDisable={setDisable} />
          </div>
        </div>
      </main>

      {/* Terms & Privacy, kept out of the way at the bottom */}
      <footer className="w-full max-w-[340px] mx-auto pb-[max(0.25rem,env(safe-area-inset-bottom))]">
        <p className="text-[0.72rem] text-center text-(--lf-muted) leading-relaxed">
          By continuing, you agree to our{" "}
          <Link
            href="/terms"
            className="text-(--lf-ink) underline underline-offset-2 hover:opacity-80 transition-opacity"
          >
            Terms
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="text-(--lf-ink) underline underline-offset-2 hover:opacity-80 transition-opacity"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </footer>
    </div>
  );
}