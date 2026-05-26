"use client";

import {
  Atom,
  BookOpenCheck,
  BriefcaseBusiness,
  CalendarPlus,
  PanelsTopLeft,
  SendHorizontal,
} from "lucide-react";

import {
  ThemedPortfolioTemplate,
  type TemplateThemeConfig,
  type ThemedPortfolioProps,
} from "./template-themed";

const config: TemplateThemeConfig = {
  key: "template6",
  pageClass:
    "min-h-screen text-[#102a43] antialiased selection:bg-[#0f766e]/15 selection:text-[#0f766e]",
  pageStyle: {
    background:
      "linear-gradient(135deg, #effaf8 0%, #f8fbff 46%, #eef4ff 100%)",
    fontFamily: "var(--font-sans), 'DM Sans', system-ui, sans-serif",
  },
  containerClass: "mx-auto max-w-[960px] px-5 py-10 sm:px-8 sm:py-16",
  quoteClass:
    "mb-8 rounded-lg border border-white/80 bg-white/55 px-4 py-3 text-[13px] leading-6 text-[#486581] shadow-sm backdrop-blur",
  heroClass:
    "mb-8 grid gap-6 rounded-lg border border-white/80 bg-white/60 p-4 shadow-[0_18px_60px_rgba(15,118,110,0.12)] backdrop-blur-xl sm:grid-cols-[0.9fr_1.1fr] sm:items-end sm:p-6",
  heroMediaClass: "relative",
  bannerClass:
    "relative h-48 overflow-hidden rounded-lg border border-white/80 bg-white/70 sm:h-64",
  bannerOverlayClass:
    "absolute inset-0 bg-[linear-gradient(180deg,rgba(15,118,110,0.02),rgba(16,42,67,0.18))]",
  avatarWithBannerClass:
    "absolute -bottom-6 left-5 h-[84px] w-[84px] rounded-lg border border-white/90 bg-white object-cover shadow-lg ring-4 ring-[#effaf8]",
  avatarSoloClass:
    "h-[84px] w-[84px] rounded-lg border border-white/90 bg-white object-cover shadow-lg",
  nameClass:
    "text-[36px] font-bold leading-[1.02] text-[#102a43] sm:text-[56px]",
  taglineClass:
    "mt-4 text-[12px] font-bold uppercase tracking-[0.18em] text-[#0f766e]",
  bioClass: "mt-5 max-w-xl text-[14px] leading-7 text-[#486581] sm:text-[15px]",
  quickLinksClass: "mb-2 flex flex-wrap items-center gap-2",
  quickLinkClass:
    "inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/80 bg-white/65 text-[#486581] shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:bg-white hover:text-[#0f766e]",
  quickCtaClass:
    "ml-auto inline-flex h-9 items-center gap-2 rounded-lg bg-[#0f766e] px-4 text-[12px] font-bold text-white shadow-sm transition hover:bg-[#115e59]",
  dividerClass: "my-11 h-px w-full bg-white/80",
  sectionHeadingClass: "mb-5 flex items-center gap-3",
  sectionIconClass:
    "inline-flex h-7 w-7 items-center justify-center rounded-lg bg-[#0f766e]/10 text-[#0f766e]",
  sectionTitleClass:
    "text-[11px] font-bold uppercase tracking-[0.2em] text-[#486581]",
  experienceListClass: "grid gap-3",
  experienceItemClass:
    "rounded-lg border border-white/80 bg-white/62 p-5 shadow-sm backdrop-blur transition hover:bg-white/80",
  companyClass: "text-[15px] font-bold text-[#102a43]",
  roleClass: "mt-1 text-[12px] font-semibold text-[#0f766e]",
  periodClass: "text-[11px] font-semibold text-[#829ab1]",
  bulletClass: "flex gap-3 text-[13px] leading-6 text-[#486581]",
  bulletMarkerClass:
    "mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#38bdf8]",
  projectListClass: "grid gap-3 sm:grid-cols-2",
  projectItemClass:
    "group flex items-start gap-4 rounded-lg border border-white/80 bg-white/62 p-4 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/85",
  projectInitialClass:
    "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#e0f2fe] text-[#0369a1]",
  projectInitialTextClass: "text-[13px] font-black uppercase",
  projectNameClass: "text-[14px] font-bold text-[#102a43]",
  projectDescriptionClass: "mt-2 text-[12px] leading-6 text-[#486581]",
  projectTagClass:
    "rounded-md bg-[#ecfeff] px-2 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-[#0f766e]",
  projectActionClass:
    "inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white bg-white/70 text-[#486581] transition hover:text-[#0f766e]",
  statusClass: {
    Live: "rounded-md border border-[#0f766e]/15 bg-[#0f766e]/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#0f766e]",
    WIP: "rounded-md border border-[#f59e0b]/20 bg-[#f59e0b]/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#b45309]",
    "Open Source":
      "rounded-md border border-[#0284c7]/20 bg-[#0284c7]/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#0369a1]",
  },
  fallbackStatusClass:
    "rounded-md border border-white bg-white/70 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#486581]",
  showMoreClass:
    "mt-4 inline-flex items-center gap-1 text-[12px] font-bold text-[#0f766e] transition hover:text-[#102a43]",
  blogListClass: "grid gap-2",
  blogItemClass:
    "group flex items-center justify-between gap-4 rounded-lg border border-white/80 bg-white/62 p-4 text-[#486581] shadow-sm backdrop-blur transition hover:bg-white/85",
  blogTitleClass: "text-[14px] font-bold text-[#102a43]",
  blogDescriptionClass: "mt-1 text-[12px] leading-5 text-[#627d98] line-clamp-2",
  blogMetaClass: "text-[10px] font-bold uppercase tracking-[0.12em] text-[#829ab1]",
  stackShellClass:
    "relative overflow-hidden rounded-lg border border-white/80 bg-white/62 py-3 shadow-sm backdrop-blur",
  stackFadeLeftClass:
    "pointer-events-none absolute inset-y-0 left-0 z-10 w-14 bg-gradient-to-r from-white/90 to-transparent",
  stackFadeRightClass:
    "pointer-events-none absolute inset-y-0 right-0 z-10 w-14 bg-gradient-to-l from-white/90 to-transparent",
  stackTrackClass: "template6-ticker-track flex w-max gap-2",
  stackItemClass:
    "shrink-0 rounded-md border border-white/90 bg-white/72 px-3 py-1.5",
  stackTextClass: "text-[11px] font-bold text-[#486581]",
  footerCtaClass:
    "group flex items-center gap-4 rounded-lg border border-white/80 bg-[#102a43] p-4 text-white shadow-lg transition hover:bg-[#0f766e]",
  footerAvatarClass:
    "flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-white/25 object-cover text-white",
  footerCtaTitleClass: "block text-[13px] font-bold",
  footerCtaTextClass: "mt-0.5 block text-[12px] leading-5 text-white/72",
  contactListClass: "grid gap-2 sm:grid-cols-3",
  contactItemClass:
    "group flex items-center gap-3 rounded-lg border border-white/80 bg-white/62 px-3 py-2.5 text-[#486581] shadow-sm backdrop-blur transition hover:bg-white hover:text-[#0f766e]",
  contactIconClass: "text-[#0f766e]",
  contactTextClass: "text-[12px] font-bold",
  footerClass:
    "mt-12 flex flex-col gap-2 border-t border-white/80 pt-6 sm:flex-row sm:items-center sm:justify-between",
  footerTextClass: "text-[11px] font-bold uppercase tracking-[0.12em] text-[#829ab1]",
  footerBrandClass: "text-[11px] font-bold uppercase tracking-[0.12em] text-[#0f766e]",
  iconSize: 14,
  iconStrokeWidth: 1.9,
  sectionIcons: {
    experience: BriefcaseBusiness,
    projects: PanelsTopLeft,
    writing: BookOpenCheck,
    stack: Atom,
    contact: SendHorizontal,
    call: CalendarPlus,
  },
};

export function Template6(props: ThemedPortfolioProps) {
  return <ThemedPortfolioTemplate {...props} config={config} />;
}
