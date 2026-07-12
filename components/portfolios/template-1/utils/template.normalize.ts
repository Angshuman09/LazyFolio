import { NormalizedLink, PortfolioBlog, PortfolioExperience, PortfolioProject, ProfileBlog, ProfileExperience, ProfileLink, ProfileProject, StackItem } from "../types/template.types";
import { cleanUrl, domainToLabel, findKnownLink, formatDate, formatDateRange, getDomain, splitDescription, textValue } from "./template.utils";

export function normalizeExperiences(
    experiences?: ProfileExperience[] | null,
  ): PortfolioExperience[] {
    const normalized = (experiences || [])
      .map((experience, index) => {
        const company = textValue(experience.companyName || experience.company);
        const role = textValue(experience.role);
        const bullets = splitDescription(experience.description);
  
        if (!company && !role && bullets.length === 0) {
          return null;
        }
  
        return {
          id: experience.id || `${company || role}-${index}`,
          company: company || undefined,
          role: role || undefined,
          period: formatDateRange(experience.startdate, experience.enddate),
          bullets,
        };
      })
      .filter(Boolean) as PortfolioExperience[];
  
    return normalized;
  }
  
export function normalizeProjects(projects?: ProfileProject[] | null): PortfolioProject[] {
    const normalized = (projects || [])
      .map((project, index) => {
        const name = textValue(project.title || project.name);
        const description = textValue(project.description);
        const github = cleanUrl(project.githubLink || project.github);
        const demo = cleanUrl(project.projectLink || project.demo);
        const tags = (project.techstack || project.tags || [])
          .map(textValue)
          .filter(Boolean);
  
        if (!name && !description && !github && !demo && tags.length === 0) {
          return null;
        }
  
        const status =
          textValue(project.status) ||
          (project.live || demo ? "Live" : github ? "Open Source" : "");
  
        return {
          id: project.id || `${name || "project"}-${index}`,
          name: name || undefined,
          description: description || undefined,
          tags,
          github,
          demo,
          status: status || undefined,
        };
      })
      .filter(Boolean) as PortfolioProject[];
  
    return normalized;
  }
  
export function normalizeBlogs(blogs?: ProfileBlog[] | null): PortfolioBlog[] {
    const normalized = (blogs || [])
      .map((blog, index) => {
        const title = textValue(blog.title);
        const description = textValue(blog.description);
        const url = cleanUrl(blog.blogLink || blog.url);
  
        if (!title && !description && !url) {
          return null;
        }
  
        return {
          id: blog.id || `${title || "blog"}-${index}`,
          title: title || undefined,
          description: description || undefined,
          readTime: textValue(blog.readTime) || formatDate(blog.enddate) || undefined,
          url,
        };
      })
      .filter(Boolean) as PortfolioBlog[];
  
    return normalized;
  }
  
export function normalizeStack(skills?: string[] | null): StackItem[] {
    const normalized = (skills || [])
      .map(textValue)
      .filter(Boolean)
      .map((skill) => ({
        name: skill,
      }));
  
    return normalized;
  }

  export function normalizeLink(link: ProfileLink, index: number): NormalizedLink | null {
    const href = cleanUrl(link.url || link.href);
  
    if (!href) {
      return null;
    }
  
    const explicitLabel = textValue(link.label || link.name);
    const known = findKnownLink(link.type || undefined, explicitLabel, href);
    const domain = getDomain(href);
    const isEmail = href.startsWith("mailto:");
    const label =
      explicitLabel ||
      known?.label ||
      (isEmail ? "Email" : domain ? domainToLabel(domain) : "Link");
  
    return {
      id: link.id || `${label}-${index}`,
      label,
      href,
    };
  }
  
  export function normalizeLinks(links?: ProfileLink[] | null) {
    return (links || [])
      .map((link, index) => normalizeLink(link, index))
      .filter(Boolean) as NormalizedLink[];
  }