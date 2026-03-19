"use client";

import { useEffect, useState } from "react";
import { SignIn } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useThemeStore } from "@/lib/theme-store";

export default function Page() {
  const theme = useThemeStore((state) => state.theme);
  const isDark = theme === "dark";

  return (
    <div className="min-h-screen bg-(--lf-bg) flex items-center justify-center px-4 relative overflow-hidden transition-colors duration-300">
      {/* Subtle background blobs */}
      <div className="absolute top-[-80px] left-[-80px] w-[340px] h-[340px] rounded-full bg-(--lf-border) blur-[100px] opacity-40 pointer-events-none transition-colors duration-300" />
      <div className="absolute bottom-[-60px] right-[-60px] w-[300px] h-[300px] rounded-full bg-(--lf-surface) blur-[100px] opacity-50 pointer-events-none transition-colors duration-300" />

      <div className="relative z-10 w-full flex flex-col items-center gap-6">
        {/* Logo above the form */}
        <div className="text-center mb-2">
          <p className="font-display text-3xl font-bold font-serif-display tracking-tight text-(--lf-ink) transition-colors duration-300">
            Lazyfolio
          </p>
          <p className="text-sm text-(--lf-muted) mt-1 transition-colors duration-300">
            Create your profession portfolio
          </p>
        </div>

        {/* Clerk SignIn with delayed mount to prevent ignoring appearance update */}
        <div className="min-h-[400px] flex items-center justify-center">
          {isDark !== null && (
            <SignIn/>
          )}
        </div>
      </div>
    </div>
  );
}
