import { LinkType } from "@/db/enums";

export type BlogInput = {
    id?: string;
    type?: "INTERNAL" | "EXTERNAL";
    title?: string;
    description?: string;
    blogLink?: string;
    content?: string | null;
    isPublished?: boolean;
    isEnabled?: boolean;
    isenable?: boolean;
    slug?: string | null;
    order?: number;
  };


export type LinkInput = {
    id?: string;
    url: string;
    label: string;
    type?: LinkType;
    isenable?: boolean;
    order?: number;
}

export const profileSelect = {
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
  experiences: { orderBy: [{ order: "asc" as const }, { createdAt: "asc" as const }] },
  projects: { orderBy: [{ order: "asc" as const }, { createdAt: "asc" as const }] },
  blogs: { orderBy: [{ order: "asc" as const }, { createdAt: "asc" as const }] },
  links: { orderBy: [{ order: "asc" as const }, { createdAt: "asc" as const }] },
};
