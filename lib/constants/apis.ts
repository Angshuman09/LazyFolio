import { LinkType } from "@/db/enums";

export type BlogInput = {
    id?: string;
    title?: string;
    description?: string;
    blogLink?: string;
    enddate?: string;
    content?: string | null;
    isPublished?: boolean;
    isenable?: boolean;
    slug?: string | null;
  };


export type LinkInput = {
    id?: string;
    url: string;
    label: string;
    type?: LinkType;
    isenable?: boolean;
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
  experiences: true,
  projects: true,
  blogs: true,
  links: true,
};