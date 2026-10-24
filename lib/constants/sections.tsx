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
    id: "lifetime",
    name: "One time",
    price: PLAN_PRICES.lifetime,
    cadence: "once",
    subtext: "A one time thank you",
    cta: `Chip in ${PLAN_PRICES.lifetime}`,
  },
  {
    id: "yearly",
    name: "Yearly",
    price: PLAN_PRICES.yearly,
    cadence: "per year",
    subtext: "A yearly thank you",
    cta: `Chip in ${PLAN_PRICES.yearly}`,
  },
  {
    id: "monthly",
    name: "Monthly",
    price: PLAN_PRICES.monthly,
    cadence: "per month",
    subtext: "A small monthly thank you",
    cta: `Chip in ${PLAN_PRICES.monthly}`,
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