"use client";

import type { ReactNode } from "react";
import { PanelRightClose, PanelRightOpen } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useDashboardShell } from "@/components/dashboard/shell-context";

/**
 * The two content columns of the dashboard shell (editor column + live preview
 * column). They live in a shared component so the page and the route-level
 * loading state render byte-identical chrome - the shell must look the same
 * before and after the page chunk mounts, otherwise navigation flashes between
 * two different loading layouts.
 */

export function DashboardMain({ children }: { children: ReactNode }) {
  const { tab, isPreviewCollapsed } = useDashboardShell();

  return (
    <main
      className={`flex-1 overflow-y-auto h-full transition-all duration-200 ${tab === "insights"
        ? "py-4 md:py-5 px-4 sm:px-5 md:px-8"
        : "py-6 md:py-8 px-4 sm:px-6 md:px-10"
        }`}
    >
      <div
        className={`min-h-full ${tab === "insights" || isPreviewCollapsed
          ? "max-w-4xl mx-auto w-full"
          : "max-w-full md:max-w-215"
          }`}
      >
        {children}
      </div>
    </main>
  );
}

export function DashboardPreviewPanel({ children }: { children: ReactNode }) {
  const { tab, isPreviewCollapsed, togglePreview } = useDashboardShell();

  return (
    <>
      <div
        className={`
          ${tab === "insights" || isPreviewCollapsed ? "hidden" : "hidden lg:flex"}
          flex-1 relative border-l border-(--lf-border-alpha) overflow-hidden h-full transition-all duration-200
        `}
      >
        {/* Collapse Preview Button inside preview panel */}
        <div className="absolute top-3 right-3 z-30">
          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={togglePreview}
                  className="inline-flex items-center justify-center w-7 h-7 rounded-lg border border-(--lf-border) bg-(--lf-bg)/80 backdrop-blur-md text-(--lf-muted) hover:text-(--lf-ink) hover:border-(--lf-muted) shadow-2xs transition-all cursor-pointer"
                  aria-label="Minimize preview"
                >
                  <PanelRightClose size={13} />
                </button>
              </TooltipTrigger>
              <TooltipContent side="left" className="text-[0.72rem] font-medium">
                Minimize preview
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="w-full h-full overflow-y-auto overflow-x-hidden">
          {children}
        </div>
      </div>

      {/* Floating reopen button if preview is collapsed */}
      {isPreviewCollapsed && tab !== "insights" && (
        <button
          type="button"
          onClick={togglePreview}
          className="hidden lg:flex fixed bottom-6 right-6 z-30 items-center gap-1.5 px-3.5 py-2 rounded-full border border-(--lf-border) bg-(--lf-bg)/90 backdrop-blur-md text-(--lf-ink) shadow-md text-[0.76rem] font-semibold hover:border-(--lf-muted) hover:bg-(--lf-surface) transition-all cursor-pointer"
          aria-label="Show preview"
        >
          <PanelRightOpen size={13} />
          <span>Show Preview</span>
        </button>
      )}
    </>
  );
}
