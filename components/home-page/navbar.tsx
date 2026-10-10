"use client";

import { Menu, Moon, Star, Sun, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useThemeStore } from "@/lib/utils/theme-store";
import { authClient } from "@/lib/auth/auth-client";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "./user-avatar";
import { signOut } from "@/lib/auth/auth-client";
import ProfileMenuOpen from "./profile-menu-open";
import { GithubIcon } from "@animateicons/react/lucide";
import { useIconHover } from "@animateicons/react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const NAV_LEFT = [
  { label: "Features", href: "/#features" },
  { label: "Templates", href: "/templates" },
  { label: "Pricing", href: "/pricing" },
  { label: "FAQ", href: "/#faq" },
];

const Navbar = () => {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [stars, setStars] = useState<number | null>(null);
  const toggleTheme = useThemeStore((s) => s.toggleTheme);
  const theme = useThemeStore((s) => s.theme);
  const setTheme = useThemeStore((s) => s.setTheme);
  const isDark = theme === "dark";
  // Drives the icon from the whole link, instead of the icon's own hover.
  const { ref: githubIconRef, triggerProps: githubTriggerProps } =
    useIconHover();

  useEffect(() => {
    if (typeof document === "undefined") return;
    setTheme(
      document.documentElement.classList.contains("dark") ? "dark" : "light",
    );
  }, [setTheme]);

  useEffect(() => {
    fetch("https://api.github.com/repos/Angshuman09/lazyfolio")
      .then((r) => r.json())
      .then(
        (d) =>
          typeof d.stargazers_count === "number" &&
          setStars(d.stargazers_count),
      )
      .catch((err) => console.error(err));
  }, []);

  return (
    <nav
      className={
        "sticky top-0 z-50 bg-(--lf-bg)/80 backdrop-blur-xl px-6 md:px-12 transition-all duration-300"}
    >
      <div className="max-w-7xl mx-auto grid grid-cols-[1fr_auto_1fr] items-center py-3.5">
        {/* Left — primary nav (desktop only) */}
        <ul className="hidden md:flex items-center gap-1 text-[0.8rem] text-(--lf-muted) font-medium tracking-wide">
          {NAV_LEFT.map((item) => (
            <li key={item.label}>
              <Link
                href={item.href}
                className="lf-focus rounded-full px-3 py-1.5 hover:text-(--lf-ink) hover:bg-(--lf-surface) transition-colors duration-150"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
        {/* Mobile spacer keeps the logo centered in the grid */}
        <span className="md:hidden" />

        {/* Center — wordmark (true center via grid, no absolute) */}
        <span
          onClick={() => router.push("/")}
          className="lf-focus rounded-sm font-serif-display cursor-pointer text-[1.3rem] font-medium tracking-tight select-none hover:opacity-75 transition-opacity duration-150"
        >
          Lazyfolio
        </span>

        {/* Right — actions */}
        <div className="hidden md:flex items-center justify-end gap-3">
          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="https://github.com/Angshuman09/lazyfolio"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="lf-focus group flex items-center gap-2 rounded-full border border-(--lf-border) bg-(--lf-surface) pl-3.5 pr-4 py-2 text-[0.78rem] font-medium text-(--lf-muted) hover:text-(--lf-ink) hover:border-(--lf-muted) transition-colors duration-150"
                  {...githubTriggerProps}
                >
                  <GithubIcon
                    ref={githubIconRef}
                    className="h-3.5 w-3.5 group-hover:fill-(--lf-accent-text) group-hover:text-(--lf-accent-text)"
                  />
                  <span className="">
                    {stars !== null ? stars.toLocaleString() : "—"}
                  </span>
                </Link>
              </TooltipTrigger>
              <TooltipContent
                side="bottom"
                align="end"
                className="text-[0.72rem] font-medium"
              >
                {stars !== null
                  ? `${stars.toLocaleString()} stars on GitHub`
                  : "Star us on GitHub"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <button
            className="lf-focus inline-flex items-center justify-center w-9 h-9 rounded-full border border-(--lf-border) bg-(--lf-surface) text-(--lf-muted) cursor-pointer hover:text-(--lf-ink) hover:border-(--lf-muted) transition-all duration-150"
            onClick={toggleTheme}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDark ? <Sun size={14} /> : <Moon size={14} />}
          </button>

          <span className="h-4 w-px bg-(--lf-border)" aria-hidden="true" />

          {isPending ? (
            <div className="h-9 w-24 bg-stone-200 dark:bg-zinc-800 animate-pulse rounded-full" />
          ) : session?.user ? (
            <>
              <Button
                onClick={() => router.push("/dashboard")}
                className="lf-focus bg-(--lf-ink) text-(--lf-surface) rounded-full h-9 px-5 hover:cursor-pointer text-[0.8rem] font-semibold hover:opacity-80 transition-opacity flex items-center gap-1.5"
              >
                Dashboard
              </Button>
              <TooltipProvider delayDuration={200}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      className="lf-focus rounded-full cursor-pointer transition-transform active:scale-95"
                      onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                      aria-label="Account menu"
                    >
                      <UserAvatar user={session.user} />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" align="end" className="text-[0.72rem] font-medium">
                    {session.user.name || "Account"}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {profileMenuOpen && (
                <ProfileMenuOpen
                  session={session}
                  setProfileMenuOpen={setProfileMenuOpen}
                  signOut={signOut}
                  router={router}
                />
              )}
            </>
          ) : (
            <button
              onClick={() => router.push("/auth")}
              className="lf-focus group bg-(--lf-ink) rounded-full text-(--lf-surface) text-[0.8rem] font-semibold pl-4 pr-1.5 py-1.5 hover:opacity-85 transition-opacity flex items-center gap-2"
            >
              Get started
              <span
            aria-hidden="true"
            className="btn-arrow w-5 h-5 bg-(--lf-bg) text-(--lf-ink) rounded-full inline-flex items-center justify-center text-[10px] font-bold leading-none"
          >
            ↗
          </span>
            </button>
          )}
        </div>

        {/* Mobile controls */}
        <div className="md:hidden flex items-center justify-end gap-2">
          <button
            className="lf-focus inline-flex items-center justify-center w-9 h-9 rounded-lg border border-(--lf-border) bg-(--lf-surface) text-(--lf-muted) cursor-pointer hover:text-(--lf-ink) hover:border-(--lf-muted) transition-all duration-150"
            onClick={toggleTheme}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDark ? <Sun size={14} /> : <Moon size={14} />}
          </button>
          <button
            className="lf-focus p-1.5 rounded-lg text-(--lf-muted) hover:text-(--lf-ink) transition-colors duration-150"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={[
          "md:hidden absolute top-full left-0 right-0 bg-(--lf-bg)/95 backdrop-blur-xl border-b border-(--lf-border) shadow-[0_20px_40px_-20px_rgba(0,0,0,0.25)] flex flex-col gap-1 px-6 overflow-hidden transition-all duration-300 ease-out",
          menuOpen ? "py-4 max-h-80 opacity-100" : "max-h-0 py-0 opacity-0 pointer-events-none",
        ].join(" ")}
      >
        {NAV_LEFT.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="lf-focus rounded-lg px-3 py-2.5 text-[0.85rem] font-medium text-(--lf-muted) hover:text-(--lf-ink) hover:bg-(--lf-surface) transition-colors"
            onClick={() => setMenuOpen(false)}
          >
            {item.label}
          </Link>
        ))}
        <Link
          href="https://github.com/Angshuman09/lazyfolio"
          target="_blank"
          rel="noopener noreferrer"
          className="lf-focus mt-1 flex items-center justify-center gap-2 rounded-full border border-(--lf-border) bg-(--lf-surface) px-4 py-2.5 text-[0.8rem] font-medium text-(--lf-ink)"
        >
          <Star className="h-4 w-4" />
          <span className="tabular-nums">
            {stars !== null ? `${stars.toLocaleString()} stars` : "Star on GitHub"}
          </span>
        </Link>
        {isPending ? (
          <div className="mt-1 h-11 w-full bg-stone-200 dark:bg-zinc-800 animate-pulse rounded-full" />
        ) : session?.user ? (
          <button
            onClick={() => {
              setMenuOpen(false);
              router.push("/dashboard");
            }}
            className="lf-focus mt-1 text-sm font-semibold bg-(--lf-ink) text-(--lf-surface) px-3 py-3 rounded-full hover:opacity-85 transition-opacity"
          >
            Dashboard
          </button>
        ) : (
          <button
            onClick={() => {
              setMenuOpen(false);
              router.push("/auth");
            }}
            className="lf-focus mt-1 text-sm font-semibold bg-(--lf-ink) text-(--lf-surface) px-3 py-3 rounded-full hover:opacity-85 transition-opacity"
          >
            Get started
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
