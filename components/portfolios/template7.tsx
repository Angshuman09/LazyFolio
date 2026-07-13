"use client";

import {
  BookText,
  BriefcaseBusiness,
  CalendarDays,
  Grid2X2,
  MessageSquareShare,
  Wrench,
} from "lucide-react";

import {
  ThemedPortfolioTemplate,
  type TemplateThemeConfig,
  type ThemedPortfolioProps,
} from "./template-themed";

const config: TemplateThemeConfig = {
  key: "template7",
  pageClass:
    "min-h-screen bg-[#fff7ed] text-[#241513] antialiased selection:bg-[#ef4444]/15 selection:text-[#991b1b]",
  pageStyle: {
    fontFamily: "'DM Sans', var(--font-sans), system-ui, sans-serif",
  },
  containerClass: "mx-auto max-w-[780px] px-5 py-10 sm:px-8 sm:py-14",
  quoteClass:
    "mb-8 rotate-[-0.4deg] rounded-lg border-2 border-[#241513] bg-[#fef08a] px-4 py-3 text-[13px] font-bold leading-6 text-[#241513] shadow-[4px_4px_0_#241513]",
  heroClass:
    "mb-8 rounded-lg border-2 border-[#241513] bg-[#ffffff] p-4 shadow-[6px_6px_0_#241513] sm:p-6",
  heroMediaClass: "relative mb-8",
  bannerClass:
    "relative h-40 overflow-hidden rounded-md border-2 border-[#241513] bg-[#fecaca] sm:h-56",
  bannerOverlayClass:
    "absolute inset-0 bg-[linear-gradient(135deg,rgba(254,202,202,0.08),rgba(14,165,233,0.14))]",
  avatarWithBannerClass:
    "absolute -bottom-6 left-5 h-[82px] w-[82px] rotate-[1deg] rounded-lg border-2 border-[#241513] bg-white object-cover shadow-[4px_4px_0_#241513]",
  avatarSoloClass:
    "mb-5 h-[82px] w-[82px] rotate-[1deg] rounded-lg border-2 border-[#241513] bg-white object-cover shadow-[4px_4px_0_#241513]",
  nameClass:
    "max-w-3xl text-[38px] font-black leading-[0.96] text-[#241513] sm:text-[62px]",
  taglineClass:
    "mt-4 inline-flex rounded-md border-2 border-[#241513] bg-[#bae6fd] px-3 py-1 text-[11px] font-black uppercase tracking-[0.16em] text-[#241513]",
  bioClass:
    "mt-5 max-w-2xl text-[15px] font-semibold leading-7 text-[#5c2d25]",
  quickLinksClass: "mb-2 flex flex-wrap items-center gap-2",
  quickLinkClass:
    "inline-flex h-9 w-9 items-center justify-center rounded-md border-2 border-[#241513] bg-white text-[#241513] shadow-[3px_3px_0_#241513] transition hover:-translate-y-0.5 hover:bg-[#bae6fd]",
  quickCtaClass:
    "ml-auto inline-flex h-9 items-center gap-2 rounded-md border-2 border-[#241513] bg-[#ef4444] px-4 text-[12px] font-black text-white shadow-[3px_3px_0_#241513] transition hover:-translate-y-0.5",
  dividerClass: "my-11 h-[2px] w-full bg-[#241513]",
  sectionHeadingClass: "mb-5 flex items-center gap-3",
  sectionTitleClass:
    "text-[12px] font-black uppercase tracking-[0.18em] text-[#241513]",
  experienceListClass: "grid gap-3",
  experienceItemClass:
    "rounded-lg border-2 border-[#241513] bg-white p-5 shadow-[4px_4px_0_#241513]",
  companyClass: "text-[17px] font-black text-[#241513]",
  roleClass: "mt-1 text-[12px] font-black uppercase tracking-[0.1em] text-[#ef4444]",
  periodClass:
    "rounded-md border-2 border-[#241513] bg-[#fff7ed] px-2 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-[#241513]",
  bulletClass: "flex gap-3 text-[13px] font-semibold leading-6 text-[#5c2d25]",
  bulletMarkerClass:
    "mt-2 h-2 w-2 shrink-0 rounded-sm border border-[#241513] bg-[#ef4444]",
  projectListClass: "grid gap-3 sm:grid-cols-2",
  projectItemClass:
    "group flex items-start gap-4 rounded-lg border-2 border-[#241513] bg-white p-4 shadow-[4px_4px_0_#241513] transition hover:-translate-y-0.5 hover:bg-[#fffbeb]",
  projectInitialClass:
    "flex h-10 w-10 shrink-0 items-center justify-center rounded-md border-2 border-[#241513] bg-[#fef08a]",
  projectInitialTextClass: "text-[14px] font-black uppercase text-[#241513]",
  projectNameClass: "text-[14px] font-black text-[#241513]",
  projectDescriptionClass:
    "mt-2 text-[12px] font-semibold leading-6 text-[#5c2d25]",
  projectTagClass:
    "rounded-md border border-[#241513] bg-[#bae6fd] px-2 py-1 text-[10px] font-black uppercase tracking-[0.06em] text-[#241513]",
  projectActionClass:
    "inline-flex h-8 w-8 items-center justify-center rounded-md border-2 border-[#241513] bg-white text-[#241513] transition hover:bg-[#fef08a]",
  statusClass: {
    Live: "rounded-md border-2 border-[#241513] bg-[#bbf7d0] px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.12em] text-[#241513]",
    WIP: "rounded-md border-2 border-[#241513] bg-[#fef08a] px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.12em] text-[#241513]",
    "Open Source":
      "rounded-md border-2 border-[#241513] bg-[#bae6fd] px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.12em] text-[#241513]",
  },
  fallbackStatusClass:
    "rounded-md border-2 border-[#241513] bg-white px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.12em] text-[#241513]",
  showMoreClass:
    "mt-5 inline-flex items-center gap-1 rounded-md border-2 border-[#241513] bg-[#fef08a] px-3 py-2 text-[12px] font-black text-[#241513] shadow-[3px_3px_0_#241513] transition hover:-translate-y-0.5",
  blogListClass: "grid gap-3",
  blogItemClass:
    "group flex items-center justify-between gap-4 rounded-lg border-2 border-[#241513] bg-white p-4 text-[#241513] shadow-[4px_4px_0_#241513] transition hover:-translate-y-0.5 hover:bg-[#bae6fd]",
  blogTitleClass: "text-[14px] font-black text-[#241513]",
  blogDescriptionClass:
    "mt-1 text-[12px] font-semibold leading-5 text-[#5c2d25] line-clamp-2",
  blogMetaClass:
    "text-[10px] font-black uppercase tracking-[0.12em] text-[#ef4444]",
  stackShellClass:
    "relative overflow-hidden rounded-lg border-2 border-[#241513] bg-white py-3 shadow-[4px_4px_0_#241513]",
  stackFadeLeftClass:
    "pointer-events-none absolute inset-y-0 left-0 z-10 w-14 bg-gradient-to-r from-white to-transparent",
  stackFadeRightClass:
    "pointer-events-none absolute inset-y-0 right-0 z-10 w-14 bg-gradient-to-l from-white to-transparent",
  stackTrackClass: "template7-ticker-track flex w-max gap-2",
  stackItemClass:
    "shrink-0 rounded-md border-2 border-[#241513] bg-[#bbf7d0] px-3 py-1.5",
  stackTextClass:
    "text-[11px] font-black uppercase tracking-[0.08em] text-[#241513]",
  footerCtaClass:
    "group flex items-center gap-4 rounded-lg border-2 border-[#241513] bg-[#ef4444] p-4 text-white shadow-[5px_5px_0_#241513] transition hover:-translate-y-0.5",
  footerAvatarClass:
    "flex h-11 w-11 shrink-0 items-center justify-center rounded-md border-2 border-[#241513] object-cover text-white",
  footerCtaTitleClass: "block text-[13px] font-black",
  footerCtaTextClass: "mt-0.5 block text-[12px] font-bold leading-5 text-white/80",
  contactListClass: "grid gap-2 sm:grid-cols-2",
  contactItemClass:
    "group flex items-center gap-3 rounded-md border-2 border-[#241513] bg-white px-3 py-2.5 text-[#241513] shadow-[3px_3px_0_#241513] transition hover:-translate-y-0.5 hover:bg-[#fef08a]",
  contactIconClass: "text-[#ef4444]",
  contactTextClass: "text-[12px] font-black",
  footerClass:
    "mt-12 flex flex-col gap-2 border-t-2 border-[#241513] pt-6 sm:flex-row sm:items-center sm:justify-between",
  footerTextClass:
    "text-[10px] font-black tracking-[0.12em] text-[#5c2d25]",
  footerBrandClass:
    "text-[10px] font-black tracking-[0.12em] text-[#ef4444]",
  iconSize: 14,
  iconStrokeWidth: 2.2,
};

export function Template7(props: ThemedPortfolioProps) {
  return <ThemedPortfolioTemplate {...props} config={config} />;
}
