"use client";

import {
  Binary,
  BookMarked,
  Braces,
  Briefcase,
  CalendarClock,
  Radio,
} from "lucide-react";

import {
  ThemedPortfolioTemplate,
  type TemplateThemeConfig,
  type ThemedPortfolioProps,
} from "./template-themed";

const config: TemplateThemeConfig = {
  key: "template5",
  pageClass:
    "min-h-screen bg-[#07110d] text-[#d7ffe8] antialiased selection:bg-[#2ddf7f]/20 selection:text-[#eafff2]",
  pageStyle: {
    fontFamily: "'JetBrains Mono', ui-monospace, SFMono-Regular, monospace",
  },
  containerClass: "mx-auto max-w-[900px] px-5 py-10 sm:px-8 sm:py-14",
  quoteClass:
    "mb-8 rounded-lg border border-[#1f4d36] bg-[#0a1a13] px-4 py-3 text-[12px] leading-6 text-[#86efac]",
  heroClass:
    "mb-8 rounded-lg border border-[#1f4d36] bg-[#0a1a13] p-4 shadow-[0_0_0_1px_rgba(45,223,127,0.04)] sm:p-6",
  heroMediaClass: "relative mb-8",
  bannerClass:
    "relative h-36 overflow-hidden rounded-md border border-[#1f4d36] bg-[#050b08] sm:h-48",
  bannerOverlayClass:
    "absolute inset-0 bg-[linear-gradient(180deg,rgba(7,17,13,0.15),rgba(7,17,13,0.55))]",
  avatarWithBannerClass:
    "absolute -bottom-7 left-4 h-[76px] w-[76px] rounded-md border border-[#2ddf7f]/40 bg-[#07110d] object-cover ring-4 ring-[#0a1a13]",
  avatarSoloClass:
    "mb-5 h-[76px] w-[76px] rounded-md border border-[#2ddf7f]/40 bg-[#07110d] object-cover",
  nameClass:
    "text-[30px] font-semibold leading-tight text-[#eafff2] sm:text-[46px]",
  taglineClass:
    "mt-3 text-[12px] font-medium uppercase tracking-[0.18em] text-[#2ddf7f]",
  bioClass:
    "mt-5 max-w-2xl text-[13px] leading-7 text-[#9fd9b8]",
  quickLinksClass: "mb-2 flex flex-wrap items-center gap-2",
  quickLinkClass:
    "inline-flex h-9 w-9 items-center justify-center rounded-md border border-[#1f4d36] bg-[#0a1a13] text-[#86efac] transition hover:border-[#2ddf7f] hover:bg-[#0e2419] hover:text-[#eafff2]",
  quickCtaClass:
    "ml-auto inline-flex h-9 items-center gap-2 rounded-md border border-[#2ddf7f]/60 bg-[#2ddf7f]/10 px-4 text-[12px] font-semibold text-[#d7ffe8] transition hover:bg-[#2ddf7f]/20",
  dividerClass: "my-10 h-px w-full bg-[#1f4d36]",
  sectionHeadingClass: "mb-5 flex items-center gap-3",
  sectionTitleClass:
    "text-[12px] font-semibold uppercase tracking-[0.22em] text-[#86efac]",
  experienceListClass: "space-y-3",
  experienceItemClass:
    "rounded-lg border border-[#1f4d36] bg-[#0a1a13] p-4 transition hover:border-[#2ddf7f]/50",
  companyClass: "text-[14px] font-semibold text-[#eafff2]",
  roleClass: "mt-1 text-[12px] text-[#2ddf7f]",
  periodClass: "text-[11px] text-[#5aa77a]",
  bulletClass: "flex gap-3 text-[12px] leading-6 text-[#9fd9b8]",
  bulletMarkerClass:
    "mt-2 h-1.5 w-1.5 shrink-0 rounded-sm bg-[#2ddf7f]",
  projectListClass: "grid gap-3",
  projectItemClass:
    "group flex items-start gap-4 rounded-lg border border-[#1f4d36] bg-[#0a1a13] p-4 transition hover:border-[#2ddf7f]/60 hover:bg-[#0d2118]",
  projectInitialClass:
    "flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-[#1f4d36] bg-[#07110d]",
  projectInitialTextClass: "text-[13px] font-bold uppercase text-[#2ddf7f]",
  projectNameClass: "text-[14px] font-semibold text-[#eafff2]",
  projectDescriptionClass: "mt-2 text-[12px] leading-6 text-[#9fd9b8]",
  projectTagClass:
    "rounded border border-[#1f4d36] bg-[#07110d] px-2 py-1 text-[10px] font-medium text-[#86efac]",
  projectActionClass:
    "inline-flex h-8 w-8 items-center justify-center rounded-md border border-[#1f4d36] text-[#86efac] transition hover:border-[#2ddf7f] hover:text-[#eafff2]",
  statusClass: {
    Live: "rounded border border-[#2ddf7f]/40 bg-[#2ddf7f]/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#86efac]",
    WIP: "rounded border border-[#facc15]/35 bg-[#facc15]/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#fde68a]",
    "Open Source":
      "rounded border border-[#38bdf8]/35 bg-[#38bdf8]/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#bae6fd]",
  },
  fallbackStatusClass:
    "rounded border border-[#1f4d36] bg-[#07110d] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#86efac]",
  showMoreClass:
    "mt-4 inline-flex items-center gap-1 text-[12px] font-semibold text-[#2ddf7f] transition hover:text-[#eafff2]",
  blogListClass: "grid gap-2",
  blogItemClass:
    "group flex items-center justify-between gap-4 rounded-lg border border-[#1f4d36] bg-[#0a1a13] p-4 text-[#9fd9b8] transition hover:border-[#2ddf7f]/50",
  blogTitleClass: "text-[13px] font-semibold text-[#eafff2]",
  blogDescriptionClass: "mt-1 text-[12px] leading-5 text-[#75b891] line-clamp-2",
  blogMetaClass: "text-[10px] uppercase tracking-[0.12em] text-[#5aa77a]",
  stackShellClass:
    "relative overflow-hidden rounded-lg border border-[#1f4d36] bg-[#0a1a13] py-3",
  stackFadeLeftClass:
    "pointer-events-none absolute inset-y-0 left-0 z-10 w-14 bg-gradient-to-r from-[#0a1a13] to-transparent",
  stackFadeRightClass:
    "pointer-events-none absolute inset-y-0 right-0 z-10 w-14 bg-gradient-to-l from-[#0a1a13] to-transparent",
  stackTrackClass: "template5-ticker-track flex w-max gap-2",
  stackItemClass:
    "shrink-0 rounded-md border border-[#1f4d36] bg-[#07110d] px-3 py-1.5",
  stackTextClass: "text-[11px] font-medium text-[#86efac]",
  footerCtaClass:
    "group flex items-center gap-4 rounded-lg border border-[#2ddf7f]/45 bg-[#2ddf7f]/10 p-4 text-[#eafff2] transition hover:bg-[#2ddf7f]/15",
  footerAvatarClass:
    "flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-[#2ddf7f]/40 object-cover text-[#2ddf7f]",
  footerCtaTitleClass: "block text-[13px] font-semibold text-[#eafff2]",
  footerCtaTextClass: "mt-0.5 block text-[12px] leading-5 text-[#86efac]",
  contactListClass: "grid gap-2 sm:grid-cols-2",
  contactItemClass:
    "group flex items-center gap-3 rounded-md border border-[#1f4d36] bg-[#0a1a13] px-3 py-2.5 text-[#9fd9b8] transition hover:border-[#2ddf7f]/55 hover:text-[#eafff2]",
  contactIconClass: "text-[#2ddf7f]",
  contactTextClass: "text-[12px] font-medium",
  footerClass:
    "mt-12 flex flex-col gap-2 border-t border-[#1f4d36] pt-6 sm:flex-row sm:items-center sm:justify-between",
  footerTextClass: "text-[10px] uppercase tracking-[0.14em] text-[#5aa77a]",
  footerBrandClass: "text-[10px] uppercase tracking-[0.14em] text-[#86efac]",
  iconSize: 14,
  iconStrokeWidth: 1.9
};

export function Template5(props: ThemedPortfolioProps) {
  return <ThemedPortfolioTemplate {...props} config={config} />;
}
