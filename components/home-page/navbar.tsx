"use client";

import { Github, Menu, Moon, Sun, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useThemeStore } from "@/lib/theme-store";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "./user-avatar";
import { signOut } from "@/lib/auth-client";
import ProfileMenuOpen from "./profile-menu-open";

const NAV_LEFT = [
  { label: "Features", href: "#features" },
  { label: "Templates", href: "#" },
];

const Navbar = () => {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [stars, setStars] = useState<number | null>(null);
  const toggleTheme = useThemeStore((s) => s.toggleTheme);
  // console.log(toggleTheme)
  const theme = useThemeStore((s) => s.theme);
  const setTheme = useThemeStore((s) => s.setTheme);
  const dark = theme === "light";

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
      className={[
        "sticky top-0 z-50 bg-(--lf-surface)/90 backdrop-blur-md px-6 md:px-12 py-3.5 transition-all duration-300",
        scrolled ? "border-b border-(--lf-border-alpha)" : "",
      ].join(" ")}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left nav links */}
        <ul className="hidden md:flex gap-8 text-[0.8rem] text-(--lf-muted) font-medium tracking-wide">
          {NAV_LEFT.map((item) => (
            <li key={item.label}>
              <a
                href={item.href}
                className="hover:text-(--lf-ink) transition-colors duration-150"
              >
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
            className="flex items-center gap-1.5 rounded-xl border border-(--lf-border) bg-(--lf-surface) px-3 py-2 text-[0.78rem] font-medium text-(--lf-ink) hover:bg-(--lf-border) transition-colors duration-150"
          >
            <Github className="h-3.5 w-3.5" />
            <span>{stars !== null ? stars.toLocaleString() : "0"}</span>
          </Link>

          <button
            className="inline-flex items-center justify-center w-8.5 h-8.5 rounded-lg border border-(--lf-border) bg-(--lf-surface) text-(--lf-muted) cursor-pointer hover:text-(--lf-ink) hover:border-(--lf-muted) transition-all duration-150"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {dark ? <Sun size={14} /> : <Moon size={14} />}
          </button>

          {session?.user ? (
            <>
              <Button
                onClick={() => router.push("/dashboard")}
                className="bg-(--lf-ink) text-(--lf-surface) hover:cursor-pointer hover:bg-(--lf-surface) hover:text-(--lf-ink) border-2 border-(--lf-ink) text-[0.8rem] font-semibold px-5 py-2 rounded-xl hover:opacity-80 transition-opacity flex items-center gap-1.5"
              >
                Dashboard
              </Button>
              <button className="cursor-pointer" onClick={() => setProfileMenuOpen(!profileMenuOpen)}>
                <UserAvatar user={session.user} />
              </button>

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
              className="bg-(--lf-ink) text-(--lf-surface) text-[0.8rem] hover:bg-(--lf-surface) hover:text-(--lf-ink) border-2 border-(--lf-ink) font-semibold px-4 py-2 rounded-xl hover:opacity-80 transition-opacity flex items-center gap-1.5"
            >
              Get started
              <span className="btn-arrow w-4 h-4 bg-(--lf-surface) text-(--lf-ink) rounded-full inline-flex items-center justify-center text-[9px] font-bold leading-none">
                ↗
              </span>
            </button>
          )}
        </div>

        {/* Mobile controls */}
        <div className="md:hidden flex items-center gap-2 ml-auto">
          <button
            className="inline-flex items-center justify-center w-8.5 h-8.5 rounded-lg border border-(--lf-border) bg-(--lf-surface) text-(--lf-muted) cursor-pointer hover:text-(--lf-ink) hover:border-(--lf-muted) transition-all duration-150"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {dark ? <Sun size={14} /> : <Moon size={14} />}
          </button>
          <button
            className="p-1 text-(--lf-muted)"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={[
          "md:hidden absolute top-full left-0 right-0 bg-(--lf-surface) border-b border-(--lf-border-alpha) flex flex-col gap-3 px-6 overflow-hidden transition-all duration-300",
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
          onClick={() => router.push("/auth")}
          className="text-sm font-semibold bg-(--lf-ink) text-(--lf-surface) hover:bg-(--lf-surface) border-2 border-(--lf-ink) hover:text-(--lf-ink) px-3 py-3 rounded-xl hover:opacity-80 transition-opacity"
        >
          Get started
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
