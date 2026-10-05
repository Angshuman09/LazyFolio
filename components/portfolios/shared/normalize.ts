
import type {
  NormalizedLink,
  PortfolioBlog,
  PortfolioEducation,
  PortfolioExperience,
  PortfolioProject,
  ProfileBlog,
  ProfileEducation,
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
  username?: string | null,
): PortfolioBlog[] {
  const usernamePrefix = username ? `/${username}/blogs/` : "";
  return (blogs || [])
    .map((blog, index) => {
      const title = textValue(blog.title);
      const description = textValue(blog.description);
      let url = cleanUrl(blog.blogLink || blog.url);
      if (usernamePrefix && url.startsWith(usernamePrefix)) {
        url = url.replace(usernamePrefix, "/blogs/");
      }

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

export function normalizeEducation(
  education?: ProfileEducation[] | null,
  experiences?: ProfileExperience[] | null,
): PortfolioEducation[] {
  if (education && education.length > 0) {
    return education
      .map((edu, index) => {
        const institution = textValue(edu.institution);
        const degree = textValue(edu.degree || edu.field);
        if (!institution && !degree) return null;
        return {
          id: edu.id || `edu-${index}`,
          institution: institution || undefined,
          degree: degree || undefined,
          field: textValue(edu.field) || undefined,
          period: edu.year || formatDateRange(edu.startdate, edu.enddate),
          description: textValue(edu.description) || undefined,
        };
      })
      .filter(Boolean) as PortfolioEducation[];
  }

  // Fallback: detect education from experiences if user entered degrees as experiences
  const eduKeywords = [
    "university",
    "college",
    "school",
    "institute",
    "academy",
    "polytechnic",
    "bootcamp",
    "brainstation",
  ];
  return (experiences || [])
    .filter((exp) => {
      const company = (exp.companyName || exp.company || "").toLowerCase();
      const role = (exp.role || "").toLowerCase();
      return (
        eduKeywords.some((k) => company.includes(k)) ||
        role.includes("degree") ||
        role.includes("student") ||
        role.includes("bachelor") ||
        role.includes("master") ||
        role.includes("phd") ||
        role.includes("b.sc") ||
        role.includes("cert.")
      );
    })
    .map((exp, index) => ({
      id: exp.id || `edu-fallback-${index}`,
      institution: textValue(exp.companyName || exp.company) || undefined,
      degree: textValue(exp.role) || undefined,
      period: formatDateRange(exp.startdate, exp.enddate),
      description: textValue(exp.description) || undefined,
    }));
}

