import { BlogInput, LinkInput } from "@/lib/constants/apis";
import { SingleExperience } from "@/lib/schemas/experience";

export function isNonEmpty(value?: string | null): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export function isValidHttpUrl(value: string): boolean {
  try {
    const url = new URL(value.trim());
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

type ValidationResult =
  | { ok: true }
  | { ok: false; error: string };

export function validateExternalBlog(blog: BlogInput): ValidationResult {
  if (!isNonEmpty(blog.title)) {
    return { ok: false, error: "Each blog link must have a title." };
  }

  if (!isNonEmpty(blog.blogLink)) {
    return { ok: false, error: "Each blog link must have a URL." };
  }

  if (!isValidHttpUrl(blog.blogLink)) {
    return { ok: false, error: "Each blog link must have a valid URL." };
  }

  return { ok: true };
}

export function validateInternalBlog(blog: BlogInput): ValidationResult {
  if (!isNonEmpty(blog.title)) {
    return { ok: false, error: "Each article must have a title." };
  }

  return { ok: true };
}

export function isBlankExternalBlog(blog: BlogInput): boolean {
  return (
    !isNonEmpty(blog.title) &&
    !isNonEmpty(blog.description) &&
    !isNonEmpty(blog.blogLink)
  );
}

export function isBlankInternalBlog(blog: BlogInput): boolean {
  return (
    !isNonEmpty(blog.title) &&
    !isNonEmpty(blog.description) &&
    !isNonEmpty(blog.content)
  );
}

export function validateLink(link: LinkInput): ValidationResult {
  if (!isNonEmpty(link.label)) {
    return { ok: false, error: "Each link must have a label." };
  }

  if (!isNonEmpty(link.url)) {
    return { ok: false, error: "Each link must have a URL." };
  }

  if (!isValidHttpUrl(link.url)) {
    return { ok: false, error: "Each link must have a valid URL." };
  }

  return { ok: true };
}

export function isBlankLink(link: LinkInput): boolean {
  return !isNonEmpty(link.label) && !isNonEmpty(link.url);
}

type ProjectLike = {
  title?: string | null;
  description?: string | null;
  githubLink?: string | null;
  projectLink?: string | null;
  techstack?: string | string[] | null;
  enddate?: string | null;
};

export function validateProject(project: ProjectLike): ValidationResult {
  if (!isNonEmpty(project.title)) {
    return { ok: false, error: "Each project must have a title." };
  }

  if (isNonEmpty(project.githubLink) && !isValidHttpUrl(project.githubLink)) {
    return { ok: false, error: "Project GitHub links must be valid URLs." };
  }

  if (isNonEmpty(project.projectLink) && !isValidHttpUrl(project.projectLink)) {
    return { ok: false, error: "Project live links must be valid URLs." };
  }

  return { ok: true };
}

export function isBlankProject(project: ProjectLike): boolean {
  const techstack = Array.isArray(project.techstack)
    ? project.techstack.join("")
    : project.techstack?.trim() || "";

  return (
    !isNonEmpty(project.title) &&
    !isNonEmpty(project.description) &&
    !isNonEmpty(project.githubLink) &&
    !isNonEmpty(project.projectLink) &&
    !techstack &&
    !isNonEmpty(project.enddate)
  );
}

export function validateExperience(experience: SingleExperience): ValidationResult {
  if (!isNonEmpty(experience.role)) {
    return { ok: false, error: "Each experience must have a role." };
  }

  if (!isNonEmpty(experience.companyName)) {
    return { ok: false, error: "Each experience must have a company name." };
  }

  if (
    isNonEmpty(experience.description) &&
    experience.description.trim().length < 10
  ) {
    return {
      ok: false,
      error: "Experience descriptions must be at least 10 characters.",
    };
  }

  return { ok: true };
}

export function isBlankExperience(experience: SingleExperience): boolean {
  return (
    !isNonEmpty(experience.role) &&
    !isNonEmpty(experience.companyName) &&
    !isNonEmpty(experience.description) &&
    !isNonEmpty(experience.startdate) &&
    !isNonEmpty(experience.enddate)
  );
}
