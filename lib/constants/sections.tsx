import { Cookie, Database, Eye, HelpCircle, Server, ShieldCheck, Trash2, Lock, AlertTriangle, Copyright, FileText, Globe, Scale, ShieldAlert, UserCheck } from "lucide-react";
import type { Prisma } from "@/db/client";
import { PlanConfig } from "../types/payment";

export const SECTIONS = [
    { id: "overview", label: "Overview & Philosophy", icon: ShieldCheck },
    { id: "data-collection", label: "Data We Collect", icon: Database },
    { id: "data-usage", label: "How We Use Data", icon: Eye },
    { id: "third-parties", label: "Third-Party Services", icon: Server },
    { id: "cookies", label: "Cookies & Storage", icon: Cookie },
    { id: "data-security", label: "Security & Retention", icon: Lock },
    { id: "user-rights", label: "Your Rights & Deletion", icon: Trash2 },
    { id: "contact", label: "Contact & Questions", icon: HelpCircle },
  ];
  

export const SECTIONSTerms = [
    { id: "acceptance", label: "Agreement to Terms", icon: FileText },
    { id: "user-accounts", label: "Accounts & Usernames", icon: UserCheck },
    { id: "user-content", label: "Content & Ownership", icon: Copyright },
    { id: "acceptable-use", label: "Acceptable Use Policy", icon: ShieldAlert },
    { id: "public-nature", label: "Public Portfolio Visibility", icon: Globe },
    { id: "disclaimers", label: "Disclaimers & Warranty", icon: AlertTriangle },
    { id: "liability", label: "Limitation of Liability", icon: Scale },
    { id: "contact", label: "Modifications & Contact", icon: HelpCircle },
  ];

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

export const features = [
    {
      title: "Full-Featured Tiptap Editor",
      desc: "Rich typography, image uploads, inline code formatting, and full draft autosaving.",
    },
    {
      title: "Custom Portfolio URLs",
      desc: "Articles live directly on your personal portfolio under your custom domain or username.",
    },
    {
      title: "Automatic SEO & Social Graph",
      desc: "Pre-rendered OpenGraph previews and search-engine optimized metadata on every post.",
    },
    {
      title: "Template Synced",
      desc: "Your articles dynamically mirror your portfolio's selected theme style and dark mode.",
    },
    {
      title: "Reader Engagement Insights",
      desc: "Track views, click-throughs, and reader retention directly from your dashboard.",
    },
];

export const faqs = [
  {
    question: "What is Lazyfolio?",
    answer:
      "Lazyfolio is a portfolio builder for developers, designers, writers, and indie makers who want a polished personal site without spending hours tweaking layout.",
  },
  {
    question: "Can I publish articles on my portfolio?",
    answer:
      "Yes. Writing articles is completely free — unlimited articles, rich markdown, custom slugs, and SEO included. No account required to start.",
  },
  {
    question: "What does supporting Lazyfolio unlock?",
    answer:
      "Supporting unlocks image uploads inside your articles. Writing, publishing, and all other features stay free for everyone forever.",
  },
  {
    question: "Do I need to code my portfolio?",
    answer:
      "No. You can choose a template, add your profile, projects, links, experience, and articles from the dashboard.",
  },
  {
    question: "Can I change templates later?",
    answer:
      "Yes. Your content stays separate from the template, so you can switch styles as your portfolio evolves.",
  },
];


export const plans: PlanConfig[] = [
  {
    id: "monthly",
    name: "Monthly",
    tagline: "Chip in each month",
    price: "$5",
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
    price: "$39",
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
    price: "$169",
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