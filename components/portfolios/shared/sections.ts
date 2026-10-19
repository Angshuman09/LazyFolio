
import { normalizeBlogs, normalizeExperiences, normalizeProjects } from "./normalize";
import type { PortfolioSection, ProfileData } from "./types";

// Minimum number of available sections (including Home) required for the
// portfolio navbar to be rendered. Below this, the navbar is hidden entirely.
export const MIN_NAVBAR_SECTIONS = 3;

// Returns the portfolio sections that actually have content, in display
// order. "home" is always available. The other sections are included only
// when their normalized data is non-empty, so empty arrays, null, undefined
// and blank entries are all treated as "no content".
export function getAvailableSections(
  profile?: ProfileData | null,
): PortfolioSection[] {
  const sections: PortfolioSection[] = ["home"];

  if (normalizeExperiences(profile?.experiences).length > 0) {
    sections.push("experience");
  }

  if (normalizeBlogs(profile?.blogs, profile?.username).length > 0) {
    sections.push("blogs");
  }

  if (normalizeProjects(profile?.projects).length > 0) {
    sections.push("projects");
  }

  return sections;
}
