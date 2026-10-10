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
    <div className="min-h-screen w-full bg-(--lf-bg) text-(--lf-ink) flex flex-col justify-between p-5 sm:p-8 transition-colors duration-300">
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
            className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-(--lf-border) bg-(--lf-surface) text-(--lf-muted) cursor-pointer hover:text-(--lf-ink) hover:border-(--lf-muted) transition-all"
            onClick={toggleTheme}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDark ? <Sun size={13} /> : <Moon size={13} />}
          </button>

          <Button
            variant="ghost"
            onClick={() => router.push("/")}
            className="text-(--lf-muted) hover:text-(--lf-ink) hover:bg-(--lf-surface) text-xs font-normal px-3 py-1.5 rounded-full cursor-pointer transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5 mr-1.5" />
            Back to home
          </Button>
        </div>
      </header>

      {/* Main Centered Auth Card */}
      <main className="flex-1 flex items-center justify-center py-10 px-2 sm:px-4">
        <div className="w-full max-w-[420px]">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <Link
              href="/"
              className="group inline-flex items-center justify-center cursor-pointer"
              title="Lazyfolio Home"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#1c1c1e] flex items-center justify-center border border-black/5 dark:border-white/10 shadow-xs group-hover:scale-105 transition-transform duration-200">
                <Image
                  src="/lflogo.png"
                  alt="Lazyfolio Logo"
                  width={34}
                  height={34}
                  className="object-contain"
                  priority
                />
              </div>
            </Link>
          </div>

          {/* Heading */}
          <div className="text-center mb-8">
            <h1 className="font-serif-display text-[2rem] sm:text-[2.25rem] font-normal tracking-tight text-(--lf-ink) leading-[1.15]">
              Make the internet <br />
              know <span className="italic text-(--lf-accent-text)">you exist.</span>
            </h1>
            <p className="mt-2.5 text-xs sm:text-[0.82rem] text-(--lf-muted) font-light leading-relaxed">
              Sign in to build and manage your portfolio.
            </p>
          </div>

          {/* Auth Actions */}
          <div className="flex flex-col gap-4.5">
            <GoogleAuth disable={disable} setDisable={setDisable} />
            <GithubAuth disable={disable} setDisable={setDisable} />
          </div>

          {/* Terms & Privacy */}
          <p className="mt-6 text-[0.72rem] text-center text-(--lf-muted) leading-relaxed">
            By clicking &quot;Continue with Google&quot;, you acknowledge that you have read and agreed to Lazyfolio&apos;s{" "}
            <Link
              href="/terms"
              className="text-(--lf-ink) underline underline-offset-2 hover:opacity-80 transition-opacity"
            >
              Terms &amp; Conditions
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
        </div>
      </main>
    </div>
  );
}