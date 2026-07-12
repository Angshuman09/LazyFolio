export type DateLike = string | Date | null | undefined;

export type ProfileLink = {
  id?: string;
  type?: string | null;
  label?: string | null;
  name?: string | null;
  url?: string | null;
  href?: string | null;
};

export type ProfileExperience = {
  id?: string;
  companyName?: string | null;
  company?: string | null;
  role?: string | null;
  startdate?: DateLike;
  enddate?: DateLike;
  description?: string | null;
};

export type ProfileProject = {
  id?: string;
  title?: string | null;
  name?: string | null;
  description?: string | null;
  githubLink?: string | null;
  projectLink?: string | null;
  github?: string | null;
  demo?: string | null;
  live?: boolean | null;
  techstack?: string[] | null;
  tags?: string[] | null;
  enddate?: DateLike;
  status?: string | null;
};

export type ProfileBlog = {
  id?: string;
  title?: string | null;
  description?: string | null;
  blogLink?: string | null;
  url?: string | null;
  enddate?: DateLike;
  readTime?: string | null;
};

export type ProfileData = {
  id?: string | null,
  name?: string | null;
  avatar?: string | null;
  banner?: string | null;
  quote?: string | null;
  tagline?: string | null;
  bio?: string | null;
  email?: string | null;
  resume?: string | null;
  bookAcall?: string | null;
  links?: ProfileLink[] | null;
  experiences?: ProfileExperience[] | null;
  projects?: ProfileProject[] | null;
  skills?: string[] | null;
  blogs?: ProfileBlog[] | null;
};

export type UserData = {
  name?: string | null;
  image?: string | null;
};

export type NormalizedLink = {
  id: string;
  label: string;
  href: string;
};

export type PortfolioExperience = {
  id: string;
  company?: string;
  companyUrl?: string;
  role?: string;
  period?: string;
  bullets: string[];
};

export type PortfolioProject = {
  id: string;
  name?: string;
  description?: string;
  tags: string[];
  github?: string;
  demo?: string;
  status?: string;
};

export type PortfolioBlog = {
  id: string;
  title?: string;
  description?: string;
  readTime?: string;
  url?: string;
};

export type StackItem = {
  name: string;
};

export type KnownLinkMetadata = {
  type?: string;
  label: string;
  domains: readonly string[];
  labels: readonly string[];
};