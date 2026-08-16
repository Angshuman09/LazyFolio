
import type {
  NormalizedLink,
  PortfolioBlog,
  PortfolioExperience,
  PortfolioProject,
  ProfileBlog,
  ProfileExperience,
  ProfileLink,
  ProfileProject,
  StackItem,
} from "./types";

import {
  cleanUrl,
  domainToLabel,
  findKnownLink,
  formatDate,
  formatDateRange,
  getDomain,
  splitDescription,
  textValue,
} from "./utils";

export function normalizeLink(
  link: ProfileLink,
  index: number,
): NormalizedLink | null {
  const href = cleanUrl(link.url || link.href);
  if (!href) return null;

  const explicitLabel = textValue(link.label || link.name);
  const known = findKnownLink(link.type || undefined, explicitLabel, href);
  const domain = getDomain(href);
  const isEmail = href.startsWith("mailto:");
  const label =
    explicitLabel ||
    known?.label ||
    (isEmail ? "Email" : domain ? domainToLabel(domain) : "Link");

  return { id: link.id || `${label}-${index}`, label, href };
}

export function normalizeLinks(
  links?: ProfileLink[] | null,
): NormalizedLink[] {
  return (links || [])
    .map((link, index) => normalizeLink(link, index))
    .filter(Boolean) as NormalizedLink[];
}

export function normalizeExperiences(
  experiences?: ProfileExperience[] | null,
): PortfolioExperience[] {
  return (experiences || [])
    .map((experience, index) => {
      const company = textValue(
        experience.companyName || experience.company,
      );
      const role = textValue(experience.role);
      const bullets = splitDescription(experience.description);

      if (!company && !role && bullets.length === 0) return null;

      return {
        id: experience.id || `${company || role}-${index}`,
        company: company || undefined,
        role: role || undefined,
        period: formatDateRange(experience.startdate, experience.enddate),
        bullets,
      };
    })
    .filter(Boolean) as PortfolioExperience[];
}

export function normalizeProjects(
  projects?: ProfileProject[] | null,
): PortfolioProject[] {
  return (projects || [])
    .map((project, index) => {
      const name = textValue(project.title || project.name);
      const description = textValue(project.description);
      const github = cleanUrl(project.githubLink || project.github);
      const demo = cleanUrl(project.projectLink || project.demo);
      const tags = (project.techstack || project.tags || [])
        .map(textValue)
        .filter(Boolean);
      const date = formatDate(project.enddate);

      if (!name && !description && !github && !demo && tags.length === 0 && !date) {
        return null;
      }

      return {
        id: project.id || `${name || "project"}-${index}`,
        name: name || undefined,
        description: description || undefined,
        tags,
        github,
        demo,
        date: date || undefined,
        enddate: date || undefined,
      };
    })
    .filter(Boolean) as PortfolioProject[];
}

export function normalizeBlogs(
  blogs?: ProfileBlog[] | null,
): PortfolioBlog[] {
  return (blogs || [])
    .map((blog, index) => {
      const title = textValue(blog.title);
      const description = textValue(blog.description);
      const url = cleanUrl(blog.blogLink || blog.url);

      if (!title && !description && !url) return null;

      return {
        id: blog.id || `${title || "blog"}-${index}`,
        title: title || undefined,
        description: description || undefined,
        readTime:
          textValue(blog.readTime) || formatDate(blog.createdAt) || undefined,
        url,
      };
    })
    .filter(Boolean) as PortfolioBlog[];
}

export function normalizeStack(skills?: string[] | null): StackItem[] {
  return (skills || [])
    .map(textValue)
    .filter(Boolean)
    .map((skill) => ({ name: skill }));
}
