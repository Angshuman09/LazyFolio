"use client";

import {
  BriefcaseBusiness,
  CalendarDays,
  LibraryBig,
  PenLine,
  Send,
  Sparkles,
} from "lucide-react";

import {
  ThemedPortfolioTemplate,
  type TemplateThemeConfig,
  type ThemedPortfolioProps,
} from "./template-themed";

const config: TemplateThemeConfig = {
  key: "template4",
  pageClass:
    "min-h-screen text-[#25302b] antialiased selection:bg-[#7f1d1d]/10 selection:text-[#7f1d1d]",
  pageStyle: {
    background:
      "linear-gradient(180deg, #f7f2e8 0%, #f0f7f3 42%, #f9faf7 100%)",
    fontFamily: "'Lora', Georgia, serif",
  },
  containerClass: "mx-auto max-w-[850px] px-5 py-12 sm:px-8 sm:py-16",
  quoteClass:
    "mb-10 max-w-xl border-l-2 border-[#7f1d1d]/35 pl-4 text-[13px] italic leading-7 text-[#6d5f54]",
  heroClass: "mb-9 flex flex-col gap-6",
  heroMediaClass: "relative w-full",
  bannerClass:
    "relative h-36 w-full overflow-hidden rounded-xl border border-[#d8cdbf] bg-[#fffaf2] shadow-sm sm:h-58",
  bannerOverlayClass: "absolute inset-0 bg-[#1f2933]/10",
  avatarWithBannerClass:
    "absolute -bottom-7 left-5 h-[104px] w-[104px] rounded-full border border-[#d8cdbf] bg-[#fffaf2] object-cover shadow-md ring-1 ring-[#f7f2e8]",
  avatarSoloClass:
    "h-[94px] w-[94px] rounded-lg border border-[#d8cdbf] bg-[#fffaf2] object-cover shadow-md",
  nameClass:
    "font-serif-display mt-4 text-[42px] font-normal leading-[0.95] text-[#1d2421] sm:text-[64px]",
  taglineClass:
    "mt-4 max-w-md font-sans text-[12px] font-semibold uppercase tracking-[0.18em] text-[#7f1d1d]",
  bioClass: "mt-5 max-w-3xl text-[15px] leading-8 text-[#52645b] sm:text-[16px]",
  quickLinksClass: "mb-2 flex flex-wrap items-center gap-2",
  quickLinkClass:
    "inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#d8cdbf] bg-[#fffdf8] text-[#52645b] shadow-sm transition hover:-translate-y-0.5 hover:border-[#7f1d1d]/40 hover:text-[#7f1d1d]",
  quickCtaClass:
    "ml-auto inline-flex h-9 items-center gap-2 rounded-lg bg-[#25302b] px-4 font-sans text-[12px] font-semibold text-[#fffaf2] transition hover:bg-[#7f1d1d]",
  dividerClass: "my-12 h-px w-full bg-[#d8cdbf]",
  sectionHeadingClass: "mb-6 flex items-center gap-3",
  // sectionIconClass:
  //   "inline-flex h-7 w-7 items-center justify-center rounded-lg bg-[#7f1d1d]/10 text-[#7f1d1d]",
  sectionTitleClass:
    "font-sans text-[11px] font-bold uppercase tracking-[0.2em] text-[#52645b]",
  experienceListClass: "space-y-4",
  experienceItemClass:
    "rounded-lg border border-[#d8cdbf] bg-[#fffdf8]/90 p-5 shadow-sm",
  companyClass: "font-serif-display text-[22px] leading-none text-[#1d2421]",
  roleClass: "mt-2 font-sans text-[12px] font-medium text-[#7f1d1d]",
  periodClass:
    "font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-[#9b8d80]",
  bulletClass: "flex gap-3 font-sans text-[13px] leading-6 text-[#52645b]",
  bulletMarkerClass: "mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#7f1d1d]/60",
  projectListClass: "grid gap-3",
  projectItemClass:
    "group flex items-start gap-4 rounded-lg border border-[#d8cdbf] bg-[#fffdf8] p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-[#7f1d1d]/30",
  projectInitialClass:
    "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#f0f7f3] text-[#7f1d1d]",
  projectInitialTextClass:
    "font-serif-display text-[22px] uppercase leading-none",
  projectNameClass: "font-sans text-[14px] font-bold text-[#1d2421]",
  projectDescriptionClass:
    "mt-2 font-sans text-[13px] leading-6 text-[#63736b]",
  projectTagClass:
    "rounded-md bg-[#edf4ef] px-2 py-1 font-sans text-[10px] font-semibold uppercase tracking-[0.08em] text-[#52645b]",
  projectActionClass:
    "inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[#d8cdbf] text-[#7c8a82] transition hover:border-[#7f1d1d]/40 hover:text-[#7f1d1d]",
  statusClass: {
    Live: "rounded-md border border-[#16745b]/20 bg-[#16745b]/10 px-2 py-0.5 font-sans text-[10px] font-bold uppercase tracking-[0.12em] text-[#16745b]",
    WIP: "rounded-md border border-[#a16207]/25 bg-[#a16207]/10 px-2 py-0.5 font-sans text-[10px] font-bold uppercase tracking-[0.12em] text-[#a16207]",
    "Open Source":
      "rounded-md border border-[#7f1d1d]/20 bg-[#7f1d1d]/10 px-2 py-0.5 font-sans text-[10px] font-bold uppercase tracking-[0.12em] text-[#7f1d1d]",
  },
  fallbackStatusClass:
    "rounded-md border border-[#d8cdbf] bg-[#f7f2e8] px-2 py-0.5 font-sans text-[10px] font-bold uppercase tracking-[0.12em] text-[#6d5f54]",
  showMoreClass:
    "mt-4 inline-flex items-center gap-1 font-sans text-[12px] font-bold text-[#7f1d1d] transition hover:text-[#25302b]",
  blogListClass:
    "divide-y divide-[#d8cdbf] rounded-lg border border-[#d8cdbf] bg-[#fffdf8]",
  blogItemClass:
    "group flex items-center justify-between gap-4 p-4 text-[#52645b] transition hover:bg-[#f0f7f3]",
  blogTitleClass: "font-serif-display text-[20px] leading-snug text-[#25302b]",
  blogDescriptionClass:
    "mt-1 font-sans text-[12px] leading-5 text-[#748177] line-clamp-2",
  blogMetaClass:
    "font-sans text-[10px] font-bold uppercase tracking-[0.14em] text-[#9b8d80]",
  stackShellClass:
    "relative overflow-hidden rounded-lg border border-[#d8cdbf] bg-[#fffdf8] py-3",
  stackFadeLeftClass:
    "pointer-events-none absolute inset-y-0 left-0 z-10 w-14 bg-gradient-to-r from-[#fffdf8] to-transparent",
  stackFadeRightClass:
    "pointer-events-none absolute inset-y-0 right-0 z-10 w-14 bg-gradient-to-l from-[#fffdf8] to-transparent",
  stackTrackClass: "template4-ticker-track flex w-max gap-2",
  stackItemClass:
    "shrink-0 rounded-md border border-[#d8cdbf] bg-[#f0f7f3] px-3 py-1.5",
  stackTextClass:
    "font-sans text-[11px] font-semibold uppercase tracking-[0.1em] text-[#52645b]",
  footerCtaClass:
    "group flex items-center gap-4 rounded-lg border border-[#d8cdbf] bg-[#25302b] p-4 text-[#fffdf8] shadow-sm transition hover:bg-[#7f1d1d]",
  footerAvatarClass:
    "flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-white/20 object-cover text-[#fffdf8]",
  footerCtaTitleClass: "block font-sans text-[13px] font-bold",
  footerCtaTextClass:
    "mt-0.5 block font-sans text-[12px] leading-5 text-white/70",
  contactListClass: "grid gap-2 sm:grid-cols-2",
  contactItemClass:
    "group flex items-center gap-3 rounded-lg border border-[#d8cdbf] bg-[#fffdf8] px-3 py-2.5 text-[#52645b] transition hover:border-[#7f1d1d]/35 hover:text-[#7f1d1d]",
  contactIconClass: "text-[#7f1d1d]",
  contactTextClass: "font-sans text-[13px] font-semibold",
  footerClass:
    "mt-12 flex flex-col gap-2 border-t border-[#d8cdbf] pt-6 sm:flex-row sm:items-center sm:justify-between",
  footerTextClass:
    "font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-[#9b8d80]",
  footerBrandClass:
    "font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-[#52645b]",
  iconSize: 14,
  iconStrokeWidth: 1.7,
  // sectionIcons: {
  //   experience: BriefcaseBusiness,
  //   projects: LibraryBig,
  //   writing: PenLine,
  //   stack: Sparkles,
  //   contact: Send,
  //   call: CalendarDays,
  // },
};

export function Template4(props: ThemedPortfolioProps) {
  return <ThemedPortfolioTemplate {...props} config={config} />;
}
