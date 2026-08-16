import { Cookie, Database, Eye, HelpCircle, Server, ShieldCheck, Trash2, Lock, AlertTriangle, Copyright, FileText, Globe, Scale, ShieldAlert, UserCheck } from "lucide-react";
import type { Prisma } from "@/db/client";

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
    },
    links: { where: { isenable: true } },
  } satisfies Prisma.ProfileSelect;
