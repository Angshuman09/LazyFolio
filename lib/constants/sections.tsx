import type { Prisma } from "@/db/client";
import { PlanConfig } from "../types/payment";
import { PLAN_PRICES } from "./plans";

  export const publicProfileSelect = {
    id: true,
    avatar: true,
    banner: true,
    name: true,
    email: true,
    quote: true,
    userId: true,
    username: true,
    bio: true,
    skills: true,
    themeId: true,
    resume: true,
    tagline: true,
    bookAcall: true,
    createdAt: true,
    updatedAt: true,
    user: true,
    experiences: { where: { isenable: true } },
    projects: { where: { isenable: true } },
    blogs: {
      where: {
        isEnabled: true,
        OR: [
          { type: "INTERNAL", isPublished: true },
          { type: "EXTERNAL" },
        ],
      },
      select: {
        id: true,
        type: true,
        title: true,
        description: true,
        blogLink: true,
        slug: true,
        isEnabled: true,
        isPublished: true,
        createdAt: true,
      },
    },
    links: { where: { isenable: true } },
  } satisfies Prisma.ProfileSelect;

export const faqs = [
  {
    question: "What is Lazyfolio?",
    answer:
    "Lazyfolio is built for developers, designers, writers, and indie hackers who need a clean, professional personal site without spending hours fiddling with layouts or CSS.",
  },
  {
    question: "Do I need to code my portfolio?",
    answer:
      "No. You get a sleek, pre-designed layout out of the box so you can focus on adding your projects, writing, and experience rather than building a site from scratch.",
  },
  {
    question: "Why use Lazyfolio if you are a developer?",
    answer:
    "Because your time is better spent building real software, not tweaking CSS margins on a personal site for the fourth time this year."
  },
  {
    question: "Can I change templates later?",
    answer:
      "Yes. Your content stays separate from the template, so you can switch styles as your portfolio evolves.",
  },
  {
    question: "Can I publish articles on my portfolio?",
    answer:
      "Yes. Writing articles is completely free: unlimited articles, rich markdown and SEO included.",
  },
  {
    question: "What does supporting Lazyfolio unlock?",
    answer:
      "Supporting unlocks image uploads inside your articles. Writing, publishing and all other features stay free for everyone forever.",
  },
];


export const plans: PlanConfig[] = [
  {
    id: "monthly",
    name: "Monthly",
    tagline: "Chip in each month",
    price: PLAN_PRICES.monthly,
    cadence: "/ month",
    subtext: "Cancel anytime — no hard feelings",
    features: [
      "Unlimited image uploads in articles",
      "Support ongoing development",
      "Keep Lazyfolio free for everyone",
    ],
    cta: "Support Monthly",
  },
  {
    id: "yearly",
    name: "Yearly",
    tagline: "A year of good vibes",
    price: PLAN_PRICES.yearly,
    cadence: "/ year",
    subtext: "~$3.25/mo — saves you $21 a year",
    badge: "Best value",
    features: [
      "Unlimited image uploads in articles",
      "Support ongoing development",
      "Keep Lazyfolio free for everyone",
      "Save 35% vs monthly",
    ],
    cta: "Support Yearly",
    popular: true,
  },
  {
    id: "lifetime",
    name: "Lifetime",
    tagline: "Once and done",
    price: PLAN_PRICES.lifetime,
    cadence: "one-time",
    subtext: "Pay once, use forever — no renewals",
    badge: "Forever",
    features: [
      "Unlimited image uploads forever",
      "Biggest thank-you to the project",
      "Keep Lazyfolio free for everyone",
      "All future features included",
    ],
    cta: "Support Forever",
  },
];

export const navColumns = [
  {
    heading: "The Good",
    links: [
      { label: "Home", href: "/" },
      { label: "Features", href: "/#features" },
      { label: "Templates", href: "/templates" },
      { label: "FAQ", href: "/#faq" },
    ],
  },
  {
    heading: "The Boring",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
    ],
  },
  {
    heading: "The Cool",
    links: [
      { label: "X / Twitter", href: "https://x.com/angshuhere" },
      { label: "GitHub", href: "https://github.com/Angshuman09/lazyfolio" },
    ],
  },
];