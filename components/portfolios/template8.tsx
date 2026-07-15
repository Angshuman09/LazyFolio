"use client";

import {
  ThemedPortfolioTemplate,
} from "./template-rest/template-themed";
import { TemplateThemeConfig, ThemedPortfolioProps } from "./shared/types";

const config: TemplateThemeConfig = {
  key: "template8",
  pageClass:
    "min-h-screen bg-[#11100e] text-[#eee7da] antialiased selection:bg-[#c9a227]/25 selection:text-[#fff7df]",
  pageStyle: {
    background:
      "linear-gradient(180deg, #11100e 0%, #191714 50%, #0f0e0c 100%)",
    fontFamily: "var(--font-sans), 'DM Sans', system-ui, sans-serif",
  },
  containerClass: "mx-auto max-w-[780px] px-5 py-12 sm:px-8 sm:py-18",
  quoteClass:
    "mb-10 max-w-xl border-l border-[#c9a227]/55 pl-4 font-serif-display text-[17px] italic leading-7 text-[#c8bda7]",
  heroClass: "mb-8",
  heroMediaClass: "relative mb-9",
  bannerClass:
    "relative h-32 overflow-hidden rounded-xl border border-[#3b352c] bg-[#171512] sm:h-55",
  bannerOverlayClass:
    "absolute inset-0",
  avatarWithBannerClass:
    "absolute left-4 -bottom-8 w-20 h-20 rounded-lg object-cover ring-1 ring-[#11100e] border border-[#3b352c] bg-[#171512]",
  avatarSoloClass:
    "w-20 h-20 rounded-lg object-cover border-1 border-[#3b352c] bg-[#171512]",
  nameClass:
    "font-serif-display text-[44px] font-normal leading-[0.98] text-[#fff7df] pt-5 sm:text-[58px]",
  taglineClass:
    "mt-5 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#c9a227]",
  bioClass:
    "mt-6 max-w-xl text-[15px] leading-8 text-[#b8ad99]",
  quickLinksClass: "mb-2 flex flex-wrap items-center gap-2",
  quickLinkClass:
    "inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#3b352c] bg-[#171512] text-[#c8bda7] transition hover:border-[#c9a227]/50 hover:text-[#fff7df]",
  quickCtaClass:
    "ml-auto inline-flex h-9 items-center gap-2 rounded-lg border border-[#c9a227]/50 bg-[#c9a227] px-4 text-[12px] font-bold text-[#11100e] transition hover:bg-[#e5c76b]",
  dividerClass: "my-12 h-px w-full bg-[#3b352c]",
  sectionHeadingClass: "mb-6 flex items-center gap-3",
  // sectionIconClass:
  //   "inline-flex h-7 w-7 items-center justify-center rounded-lg border border-[#c9a227]/35 bg-[#c9a227]/10 text-[#d8bd62]",
  sectionTitleClass:
    "text-[11px] font-bold uppercase tracking-[0.22em] text-[#c8bda7]",
  experienceListClass: "space-y-3",
  experienceItemClass:
    "rounded-lg border border-[#3b352c] bg-[#171512] p-5 transition hover:border-[#c9a227]/35",
  companyClass:
    "font-serif-display text-[24px] leading-none text-[#fff7df]",
  roleClass: "mt-2 text-[12px] font-semibold text-[#d8bd62]",
  periodClass: "text-[11px] font-medium uppercase tracking-[0.14em] text-[#857967]",
  bulletClass: "flex gap-3 text-[13px] leading-6 text-[#b8ad99]",
  bulletMarkerClass:
    "mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#c9a227]",
  projectListClass: "grid gap-3",
  projectItemClass:
    "group flex items-start gap-4 rounded-lg border border-[#3b352c] bg-[#171512] p-4 transition hover:-translate-y-0.5 hover:border-[#c9a227]/40",
  projectInitialClass:
    "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#3b352c] bg-[#11100e]",
  projectInitialTextClass:
    "font-serif-display text-[21px] uppercase leading-none text-[#d8bd62]",
  projectNameClass: "text-[14px] font-bold text-[#fff7df]",
  projectDescriptionClass: "mt-2 text-[12px] leading-6 text-[#b8ad99]",
  projectTagClass:
    "rounded-md border border-[#3b352c] bg-[#11100e] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#c8bda7]",
  projectActionClass:
    "inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[#3b352c] text-[#c8bda7] transition hover:border-[#c9a227]/50 hover:text-[#fff7df]",
  statusClass: {
    Live: "rounded-md border border-[#16a34a]/25 bg-[#16a34a]/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#86efac]",
    WIP: "rounded-md border border-[#c9a227]/35 bg-[#c9a227]/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#d8bd62]",
    "Open Source":
      "rounded-md border border-[#38bdf8]/25 bg-[#38bdf8]/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#bae6fd]",
  },
  fallbackStatusClass:
    "rounded-md border border-[#3b352c] bg-[#11100e] px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#c8bda7]",
  showMoreClass:
    "mt-4 inline-flex items-center gap-1 text-[12px] font-bold text-[#d8bd62] transition hover:text-[#fff7df]",
  blogListClass: "divide-y divide-[#3b352c] rounded-lg border border-[#3b352c] bg-[#171512]",
  blogItemClass:
    "group flex items-center justify-between gap-4 p-4 text-[#b8ad99] transition hover:bg-[#1f1c18]",
  blogTitleClass:
    "font-serif-display text-[21px] leading-snug text-[#fff7df]",
  blogDescriptionClass:
    "mt-1 text-[12px] leading-5 text-[#9d927f] line-clamp-2",
  blogMetaClass:
    "text-[10px] font-semibold uppercase tracking-[0.12em] text-[#857967]",
  stackShellClass:
    "relative overflow-hidden rounded-lg border border-[#3b352c] bg-[#171512] py-3",
  stackFadeLeftClass:
    "pointer-events-none absolute inset-y-0 left-0 z-10 w-14 bg-gradient-to-r from-[#171512] to-transparent",
  stackFadeRightClass:
    "pointer-events-none absolute inset-y-0 right-0 z-10 w-14 bg-gradient-to-l from-[#171512] to-transparent",
  stackTrackClass: "template8-ticker-track flex w-max gap-2",
  stackItemClass:
    "shrink-0 rounded-md border border-[#3b352c] bg-[#11100e] px-3 py-1.5",
  stackTextClass:
    "text-[11px] font-semibold uppercase tracking-[0.08em] text-[#c8bda7]",
  footerCtaClass:
    "group flex items-center gap-4 rounded-lg border border-[#c9a227]/35 bg-[#c9a227] p-4 text-[#11100e] transition hover:bg-[#e5c76b]",
  footerAvatarClass:
    "flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-[#11100e]/20 object-cover text-[#11100e]",
  footerCtaTitleClass: "block text-[13px] font-black",
  footerCtaTextClass: "mt-0.5 block text-[12px] font-semibold leading-5 text-[#11100e]/70",
  contactListClass: "grid gap-2 sm:grid-cols-2",
  contactItemClass:
    "group flex items-center gap-3 rounded-lg border border-[#3b352c] bg-[#171512] px-3 py-2.5 text-[#c8bda7] transition hover:border-[#c9a227]/45 hover:text-[#fff7df]",
  contactIconClass: "text-[#d8bd62]",
  contactTextClass: "text-[13px] font-semibold",
  footerClass:
    "mt-12 flex flex-col gap-2 border-t cursor-pointer flex items-center justify-center border-[#3b352c] pt-6 sm:flex-row sm:items-center",
  footerTextClass:
    "text-[11px] font-semibold hover:outline-[#857967] flex items-center justify-center tracking-[0.12em] text-[#857967]",
  footerBrandClass:
    "text-[11px] font-semibold hover:outline-[#857967] flex items-center justify-center tracking-[0.12em] text-[#d8bd62]",
  iconSize: 14,
  iconStrokeWidth: 1.8,
};

export function Template8(props: ThemedPortfolioProps) {
  return <ThemedPortfolioTemplate {...props} config={config} />;
}
