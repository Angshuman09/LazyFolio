"use client";

import { useCallback, useState, useEffect, useRef } from "react";
import {
  Sun,
  Moon,
  ExternalLink,
  Copy,
  Check,
  ChevronRight,
  Layers,
  BarChart3,
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
  Heart,
} from "lucide-react";
import { signOut, authClient } from "@/lib/auth/auth-client";
import { useGetUserProfile } from "@/hooks/profile";
import { useGetSubscription } from "@/hooks/subscription";
import { useRouter } from "next/navigation";
import { PortfolioSection } from "@/components/portfolios/shared/types";
import { UserAvatar } from "@/components/home-page/user-avatar";
import ProfileMenuOpen from "@/components/home-page/profile-menu-open";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import toast from "react-hot-toast";
import { TEMPLATES, NAV, Tab } from "@/components/resources/extras";
import { useSaveStore, DashboardSection } from "@/lib/utils/save-store";
import { useSaveShortcut } from "@/hooks/use-save-shortcut";
import {
  useUnsavedWarning,
  useTabSwitchGuard,
} from "@/hooks/use-unsaved-warning";
import { getPortfolioUrl } from "@/lib/utils/public-url";
import { SupportMeModal } from "@/components/dashboard/support-me-modal";
import { useDashboardSubmits } from "@/hooks/use-dashboard-submits";
import { TemplatePickerModal } from "@/components/dashboard/template-picker-modal";
import { UnsavedChangesModal } from "@/components/dashboard/unsaved-changes-modal";
import GlobalSaveButton from "@/components/dashboard/global-save-button";
import {
  DashboardShellProvider,
  type DashboardShellValue,
} from "@/components/dashboard/shell-context";

function getPreviewSectionForTab(tab: Tab): PortfolioSection {
  if (tab === "experience") return "experience";
  if (tab === "projects") return "projects";
  if (tab === "blogs" || tab === "articles") return "blogs";
  return "home";
}

/**
 * Dashboard shell: header, sidebar, modals and every piece of state they share
 * with the editor column. Because this is the segment layout, Next.js renders it
 * outside the loading.tsx boundary - so on navigation the chrome paints first
 * and only the content column waits behind a Suspense fallback.
 */
export default function DashboardShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [tab, setTab] = useState<Tab>("profile");
  const [dark, setDark] = useState<boolean | null>(null);
  const [templateOpen, setTemplateOpen] = useState(false);
  const [activeTemplate, setActiveTemplate] = useState("1");
  const [copied, setCopied] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isPreviewCollapsed, setIsPreviewCollapsed] = useState(false);
  const username = "angshuman09";
  const [profileMenuOpen, setProfileMenuOpen] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState(false);
  const [previewSection, setPreviewSection] = useState<PortfolioSection>("home");
  const changeTab = useCallback((nextTab: Tab) => {
    setTab(nextTab);
    setPreviewSection(getPreviewSectionForTab(nextTab));
  }, []);

  const toggleSidebar = useCallback(() => {
    setIsSidebarCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("lf-sidebar-collapsed", String(next));
      } catch { }
      return next;
    });
  }, []);

  const togglePreview = useCallback(() => {
    setIsPreviewCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("lf-preview-collapsed", String(next));
      } catch { }
      return next;
    });
  }, []);

  const { data: session, isPending } = authClient.useSession();
  const { data: profile, isLoading } = useGetUserProfile(session?.user?.id);
  const {
    data: subData,
    isLoading: isSubLoading,
    refetch: refetchSub,
  } = useGetSubscription(!!session?.user?.id);
  const router = useRouter();
  const isSaveDisabled = isSaving || isLoading || isPending;


  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const urlTab = params.get("tab") as Tab | null;
      if (urlTab && NAV.some((n) => n.id === urlTab)) {
        queueMicrotask(() => changeTab(urlTab));
      }
      if (params.get("checkout") === "success") {
        toast.success("Payment completed! Updating your subscription...", { id: "checkout-success" });
        fetch("/api/subscription?checkout=success").then(() => refetchSub());
        const newUrl = window.location.pathname + (urlTab ? `?tab=${urlTab}` : "");
        window.history.replaceState({}, "", newUrl);
      }
    }
  }, [changeTab, refetchSub]);

  useEffect(() => {
    if (!session && !isPending) {
      router.push("/auth");
    }
  }, [session, isPending, router]);

  useEffect(() => {
    const savedTheme = localStorage.getItem("lf-theme");
    const shouldUseDark =
      savedTheme === "dark" ||
      document.documentElement.classList.contains("dark");

    const frameId = window.requestAnimationFrame(() => {
      setDark(shouldUseDark);
    });

    return () => window.cancelAnimationFrame(frameId);
  }, []);

  useEffect(() => {
    try {
      const savedSidebar = localStorage.getItem("lf-sidebar-collapsed");
      if (savedSidebar === "true") setIsSidebarCollapsed(true);
      const savedPreview = localStorage.getItem("lf-preview-collapsed");
      if (savedPreview === "true") setIsPreviewCollapsed(true);
    } catch { }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "b") {
        e.preventDefault();
        toggleSidebar();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleSidebar]);

  // Chrome persists scroll offsets of nested scroll containers per-URL and
  // restores them on every load. If the sidebar nav was ever scrolled (e.g. on
  // a short window), "Profile" — the first item — stays clipped behind the top
  // edge forever. Pin it to the top on mount.
  useEffect(() => {
    sidebarScrollRef.current?.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (dark === null) return;

    const root = document.documentElement;
    if (dark) {
      root.classList.add("dark");
      localStorage.setItem("lf-theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("lf-theme", "light");
    }
  }, [dark]);

  const copyLink = () => {
    navigator.clipboard?.writeText(getPortfolioUrl(profile?.username || username)).then(() => {
      toast.success("Profile link copied to clipboard!");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {
      toast.error("Failed to copy link. Please try manually copying: " + getPortfolioUrl(profile?.username || username));
    });
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const sidebarScrollRef = useRef<HTMLDivElement>(null);
  const {
    applyTemplate,
    onProfileSubmit,
    onLinksSubmit,
    onExperienceSubmit,
    onSubmitProjects,
    onSubmitSkills,
    onSubmitBlogs,
  } = useDashboardSubmits({
    profile,
    session,
    refetchSub,
    setIsSaving,
    onTemplateApplied: () => setTemplateOpen(false),
  });

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [supportMeOpen, setSupportMeOpen] = useState(false);

  useUnsavedWarning();
  useSaveShortcut(tab);
  const {
    showConfirmation,
    confirmDiscard,
    cancelSwitch,
    requestTabSwitch,
    dirtyLabel,
  } = useTabSwitchGuard(tab, (newTab) => changeTab(newTab as Tab), profile?.id);

  const dirtyItems = useSaveStore((s) => s.dirtyItems);
  const errors = useSaveStore((s) => s.errors);

  const shell: DashboardShellValue = {
    session,
    isSessionPending: isPending,
    profile,
    isProfileLoading: isLoading,
    subData,
    isSubLoading,
    tab,
    changeTab,
    previewSection,
    setPreviewSection,
    isPreviewCollapsed,
    togglePreview,
    setSupportMeOpen,
    username,
    submits: {
      onProfileSubmit,
      onLinksSubmit,
      onExperienceSubmit,
      onSubmitProjects,
      onSubmitSkills,
      onSubmitBlogs,
    },
  };

  return (
    <DashboardShellProvider value={shell}>
      <div className="h-screen flex flex-col bg-(--lf-bg) text-(--lf-ink) font-sans-body transition-colors duration-200">
        <header className="sticky top-0 z-40 h-13 flex items-center justify-between px-4 md:px-6 bg-(--lf-bg)/88 backdrop-blur-lg border-b border-(--lf-border-alpha) transition-colors duration-200">
          <div className="flex items-center gap-2">
            <button
              className="md:hidden inline-flex items-center justify-center w-8 h-8 rounded-lg border border-(--lf-border) bg-(--lf-surface) text-(--lf-muted) cursor-pointer hover:text-(--lf-ink) transition-all duration-150"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Toggle sidebar"
            >
              <BarChart3 size={14} />
            </button>

            {/* Desktop Sidebar Toggle */}
            <TooltipProvider delayDuration={200}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    className="hidden md:inline-flex items-center justify-center w-8 h-8 rounded-lg border border-(--lf-border) bg-(--lf-surface) text-(--lf-muted) cursor-pointer hover:text-(--lf-ink) hover:border-(--lf-muted) transition-all duration-150"
                    onClick={toggleSidebar}
                    aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                  >
                    {isSidebarCollapsed ? <PanelLeftOpen size={14} /> : <PanelLeftClose size={14} />}
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom" align="start" className="text-[0.72rem] font-medium">
                  {isSidebarCollapsed ? "Expand sidebar (⌘B)" : "Collapse sidebar (⌘B)"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <span
              onClick={() => router.push("/")}
              className="font-serif-display text-[1.15rem] font-normal tracking-tight text-(--lf-ink) select-none cursor-pointer"
            >
              Lazyfolio
            </span>
            <div className="hidden sm:flex items-center gap-1.25 text-[0.75rem] text-(--lf-muted) ml-1">
              <ChevronRight size={11} className="opacity-35" />
              <span className="text-(--lf-ink) font-medium">
                {NAV.find((n) => n.id === tab)?.label}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 md:gap-2">
            <button
              disabled={!profile?.username}
              className="hidden disabled:cursor-not-allowed disabled:opacity-50 sm:inline-flex items-center gap-1.75 px-4.5 h-8.5 rounded-full border border-(--lf-border) bg-(--lf-surface) text-(--lf-muted) text-[0.78rem] font-medium cursor-pointer hover:text-(--lf-ink) hover:border-(--lf-muted) transition-all duration-150 font-sans-body"
              onClick={() => {
                setActiveTemplate(profile?.themeId || "1");
                setTemplateOpen(true);
              }}
            >
              <Layers size={13} />
              Templates
              <span className="font-mono text-[0.65rem] text-(--lf-muted) opacity-75 px-1.5 py-px rounded-full bg-(--lf-border-alpha)">
                {TEMPLATES.find((t) => t.id === (profile?.themeId || activeTemplate))?.label}
              </span>
            </button>

            <button
              className="sm:hidden inline-flex items-center justify-center w-8 h-8 rounded-full border border-(--lf-border) bg-(--lf-surface) text-(--lf-muted) cursor-pointer hover:text-(--lf-ink) transition-all duration-150"
              onClick={() => {
                setActiveTemplate(profile?.themeId || "1");
                setTemplateOpen(true);
              }}
              aria-label="Templates"
            >
              <Layers size={13} />
            </button>

            <button
              className="inline-flex items-center justify-center w-8.5 h-8.5 rounded-full border border-(--lf-border) bg-(--lf-surface) text-(--lf-muted) cursor-pointer hover:text-(--lf-ink) hover:border-(--lf-muted) transition-all duration-150"
              onClick={() => setDark((current) => !current)}
              aria-label="Toggle theme"
            >
              {dark ? <Sun size={14} /> : <Moon size={14} />}
            </button>

            {/* Toggle Live Preview Panel (Desktop) */}
            {tab !== "insights" && (
              <TooltipProvider delayDuration={200}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={togglePreview}
                      className={`hidden lg:inline-flex items-center gap-1.5 px-3 h-8.5 rounded-full border transition-all duration-150 text-[0.75rem] font-medium cursor-pointer ${isPreviewCollapsed
                        ? "border-(--lf-border) bg-(--lf-surface) text-(--lf-muted) hover:text-(--lf-ink) hover:border-(--lf-muted)"
                        : "border-(--lf-border) bg-(--lf-surface) text-(--lf-ink) hover:border-(--lf-muted)"
                        }`}
                      aria-label={isPreviewCollapsed ? "Expand live preview" : "Minimize live preview"}
                    >
                      {isPreviewCollapsed ? <PanelRightOpen size={13} /> : <PanelRightClose size={13} />}
                      <span>{isPreviewCollapsed ? "Show Preview" : "Hide Preview"}</span>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="text-[0.72rem] font-medium">
                    {isPreviewCollapsed ? "Expand preview panel" : "Minimize preview panel"}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}

            <button
              disabled={!profile?.username}
              onClick={() => window.open(getPortfolioUrl(profile?.username || username), "_blank")}
              className="hidden disabled:cursor-not-allowed disabled:opacity-55 sm:inline-flex items-center gap-1.5 px-3 h-8.5 rounded-full bg-transparent border border-(--lf-border) text-(--lf-muted) text-[0.75rem] font-medium cursor-pointer hover:text-(--lf-ink) hover:border-(--lf-muted) transition-all duration-150 font-sans-body whitespace-nowrap"
              title="Open portfolio in new tab"
            >
              <ExternalLink size={12} />
              <span className="hidden xl:inline">Live site</span>
            </button>

            <GlobalSaveButton disabled={!profile?.username && tab !== "profile"} />

            {!isPending && (
              <TooltipProvider delayDuration={200}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => setProfileMenuOpen((prev) => !prev)}
                      className="rounded-full cursor-pointer transition-transform active:scale-95 focus:outline-none"
                      aria-label="Account menu"
                    >
                      <UserAvatar user={session?.user} />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" align="end" className="text-[0.72rem] font-medium">
                    {session?.user?.name || "Account"}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}

            {profileMenuOpen && (
              <ProfileMenuOpen
                session={session}
                setProfileMenuOpen={setProfileMenuOpen}
                signOut={signOut}
                router={router}
                username={profile?.username || username}
              />
            )}
          </div>
        </header>

        {sidebarOpen && (
          <div
            className="md:hidden fixed inset-0 z-30 bg-black/30 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <div className="flex flex-1 overflow-hidden min-h-0">
          <aside
            className={`
              ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
              ${isSidebarCollapsed
                ? "md:w-0 md:p-0 md:border-r-0 md:opacity-0 md:pointer-events-none md:overflow-hidden"
                : "md:translate-x-0 md:w-50 md:p-[16px_10px_20px] md:opacity-100 md:pointer-events-auto"
              }
              fixed md:static z-40 md:z-auto shrink-0 border-r border-(--lf-border-alpha) flex flex-col gap-0.5 top-13 md:top-0 h-[calc(100vh-52px)] bg-(--lf-bg) transition-all duration-200
            `}
          >

            <div
              ref={sidebarScrollRef}
              className="lf-sidebar-scroll flex-1 overflow-y-auto pr-1 flex flex-col gap-0.5"
            >
              {NAV.map((n) => {
                const isDisabled = !profile?.username && n.id !== "profile";
                const isDirty = n.id !== "insights" && dirtyItems.has(n.id as DashboardSection);
                const hasError = n.id !== "insights" && errors.has(n.id as DashboardSection);

                return (
                  <button
                    key={n.id}
                    disabled={isDisabled}
                    className={`relative flex items-center pl-4 gap-2.25 px-3 py-2 rounded-lg text-[0.82rem] font-medium cursor-pointer w-full text-left transition-all duration-150 font-sans-body tracking-tight
                      ${tab === n.id
                        ? "text-(--lf-ink) bg-(--lf-accent-soft) font-semibold border-l-2 border-(--lf-accent-text)"
                        : "text-(--lf-muted) bg-transparent hover:text-(--lf-ink) hover:bg-(--lf-accent-soft) border-l-2 border-transparent"
                      }
                      ${isDisabled
                        ? "opacity-50 cursor-not-allowed hover:bg-transparent hover:text-(--lf-muted)"
                        : ""
                      }
                    `}
                    onClick={() => {
                      if (isDisabled) return;
                      requestTabSwitch(n.id);
                      setSidebarOpen(false);
                    }}
                  >
                    <span className="flex-1">{n.label}</span>
                    {isDirty && (
                      <span
                        className={`w-1.5 h-1.5 rounded-full shrink-0 ${hasError ? "bg-(--lf-accent-text)" : "bg-(--lf-accent-text) animate-pulse"
                          }`}
                        title={hasError ? "Save error" : "Unsaved changes"}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="h-px bg-(--lf-border-alpha) my-2.5 mx-1 shrink-0" />

            {/* Support Me button */}
            <button
              type="button"
              onClick={() => setSupportMeOpen(true)}
              className="group shrink-0 mx-1 flex items-center justify-center gap-2 w-[calc(100%-8px)] h-9 rounded-lg border border-(--lf-border) bg-(--lf-surface) text-(--lf-ink) text-[0.78rem] font-medium cursor-pointer hover:border-(--lf-muted) hover:bg-(--lf-bg) active:scale-[0.99] transition-all duration-200 font-sans-body"
              aria-label="Support Lazyfolio"
            >
              <Heart
                size={13}
                fill="currentColor"
                className="text-(--lf-accent-text) transition-transform duration-200 group-hover:scale-110"
              />
              Support me
            </button>

            <div className="h-px bg-(--lf-border-alpha) my-2.5 mx-1 shrink-0" />

            <div className="mt-auto shrink-0 border border-(--lf-border) rounded-[10px] p-3.5 bg-(--lf-surface)">
              <div className="text-[0.65rem] text-(--lf-muted) tracking-widest mb-1.5">
                Your portfolio link
              </div>
              <div className="text-[0.75rem] text-(--lf-ink) mb-2.5 break-all">
                {profile?.username ? getPortfolioUrl(profile.username) : "your-username.lazyfolio.me"}
              </div>
              <button
                className="inline-flex disabled:cursor-not-allowed disabled:opacity-50 items-center gap-1.5 px-3 h-7.5 rounded-full bg-transparent border border-(--lf-border) text-(--lf-muted) text-[0.75rem] font-medium cursor-pointer hover:text-(--lf-ink) hover:border-(--lf-muted) transition-all duration-150 font-sans-body whitespace-nowrap w-full justify-center"
                onClick={copyLink}
                disabled={!profile?.username}
              >
                {copied ? <Check size={11} /> : <Copy size={11} />}
                {copied ? "Copied!" : "Copy link"}
              </button>
            </div>
          </aside>
          {children}
        </div>

        {templateOpen && (
          <TemplatePickerModal
            activeTemplate={activeTemplate}
            onSelect={setActiveTemplate}
            onClose={() => setTemplateOpen(false)}
            onApply={() => applyTemplate(activeTemplate)}
            isDisabled={isSaveDisabled}
            isSaving={isSaving}
          />
        )}

        {showConfirmation && (
          <UnsavedChangesModal
            dirtyLabel={dirtyLabel}
            onCancel={cancelSwitch}
            onConfirm={confirmDiscard}
          />
        )}

        {supportMeOpen && (
          <SupportMeModal onClose={() => setSupportMeOpen(false)} />
        )}
      </div>
    </DashboardShellProvider>
  );
}
