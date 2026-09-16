"use client";

import React from "react";
import { LogOut, ExternalLink, LayoutDashboard, User } from "lucide-react";
import Link from "next/link";
import { getPortfolioUrl } from "@/lib/utils/public-url";

interface ProfileMenuProps {
  session: any;
  setProfileMenuOpen: (open: boolean) => void;
  signOut: any;
  router: any;
  username?: string | null;
}

const ProfileMenuOpen = ({
  session,
  setProfileMenuOpen,
  signOut,
  router,
  username,
}: ProfileMenuProps) => {
  if (!session?.user) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40"
        onClick={() => setProfileMenuOpen(false)}
      />

      {/* Popover Card */}
      <div className="absolute right-4 sm:right-6 top-14 w-64 rounded-xl border border-(--lf-border) bg-(--lf-surface) p-1.5 shadow-xl z-50 animate-in fade-in-0 zoom-in-95 duration-150 backdrop-blur-md">
        {/* User Info Header */}
        <div className="px-3 py-2.5 border-b border-(--lf-border) mb-1">
          <div className="flex items-center gap-2.5">
            {session.user.image ? (
              <img
                src={session.user.image}
                alt={session.user.name || "User"}
                className="w-8 h-8 rounded-full object-cover border border-(--lf-border)"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-(--lf-accent-soft) text-(--lf-ink) flex items-center justify-center font-medium text-xs">
                {session.user.name?.[0] || <User size={14} />}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="text-[0.82rem] font-medium text-(--lf-ink) truncate leading-tight">
                {session.user.name || "User"}
              </p>
              <p className="text-[0.72rem] text-(--lf-muted) truncate font-mono mt-0.5">
                {session.user.email}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="py-1 space-y-0.5">
          <Link
            href="/dashboard"
            onClick={() => setProfileMenuOpen(false)}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[0.78rem] text-(--lf-ink) hover:bg-(--lf-accent-soft) transition-colors"
          >
            <LayoutDashboard size={14} className="text-(--lf-muted)" />
            <span>Dashboard</span>
          </Link>

          {username && (
            <a
              href={getPortfolioUrl(username)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setProfileMenuOpen(false)}
              className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[0.78rem] text-(--lf-ink) hover:bg-(--lf-accent-soft) transition-colors"
            >
              <div className="flex items-center gap-2">
                <ExternalLink size={14} className="text-(--lf-muted)" />
                <span>View live portfolio</span>
              </div>
              <span className="text-[0.68rem] text-(--lf-dimmed) font-mono">↗</span>
            </a>
          )}
        </div>

        <div className="h-px bg-(--lf-border) my-1" />

        {/* Logout Action */}
        <button
          onClick={() => {
            setProfileMenuOpen(false);
            signOut({
              fetchOptions: { onSuccess: () => router.push("/") },
            });
          }}
          className="w-full flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-[0.78rem] font-medium text-red-600 dark:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer text-left"
        >
          <LogOut size={14} />
          <span>Log out</span>
        </button>
      </div>
    </>
  );
};

export default ProfileMenuOpen;
