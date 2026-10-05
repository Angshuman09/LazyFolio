import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { normalizeProjects } from "../../shared/normalize";
import { ProfileData } from "../../shared/types";
import { shouldOpenInNewTab } from "../../shared/utils";
import { Divider, SectionHeading } from "./utils";
import { usePortfolioSection } from "../../shared/context/portfolio-section-context";

const Projects = ({
  profile,
  showAll = false,
  basePath = "",
}: {
  profile: ProfileData;
  showAll?: boolean;
  basePath?: string;
}) => {
  const sectionCtx = usePortfolioSection();
  const projects = normalizeProjects(profile?.projects);
  const visible = showAll ? projects : projects.slice(0, 4);
  const projectsHref = `${basePath}/projects`;

  if (!showAll && projects.length === 0) return null;

  const seeAll = !showAll && projects.length > 4 && (
    <Link
      href={projectsHref}
      onClick={(e) => {
        if (sectionCtx?.onSectionChange) {
          e.preventDefault();
          sectionCtx.onSectionChange("projects");
        }
      }}
      className="text-[12px] cursor-pointer transition-colors hover:text-[#1e3a8a]"
      style={{ color: "#1D4ED8" }}
    >
      See all →
    </Link>
  );

  return (
    <>
      <Divider />
      <section>
        <SectionHeading action={seeAll}>Projects</SectionHeading>
        {projects.length === 0 ? (
          <p className="text-[13px]" style={{ color: "#9CA3AF" }}>
            No projects listed yet.
          </p>
        ) : (
          /* Flat list — NOT cards, like the Lakshay Bhushan reference */
          <div className="space-y-6">
            {visible.map((project) => {
              const link = project.demo || project.github;
              return (
                <article key={project.id} className="group">
                  <div className="flex items-baseline justify-between gap-4">
                    {link ? (
                      <Link
                        href={link}
                        target={shouldOpenInNewTab(link) ? "_blank" : undefined}
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[14.5px] font-semibold transition-colors hover:text-[#1D4ED8]"
                        style={{ color: "#0F0F0F" }}
                      >
                        {project.name}
                        <ArrowUpRight
                          size={12}
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-fuchsia-500"
                        />
                      </Link>
                    ) : (
                      <span
                        className="text-[14.5px] font-semibold"
                        style={{ color: "#0F0F0F" }}
                      >
                        {project.name}
                      </span>
                    )}
                  </div>

                  {project.description && (
                    <p
                      className="text-[13px] leading-relaxed mt-1 font-mono"
                      style={{ color: "#6B7280" }}
                    >
                      {project.description}
                    </p>
                  )}

                  {project.tags.length > 0 && (
                    <div
                      className="flex flex-wrap gap-x-3 gap-y-1 mt-2 text-[11px] font-mono"
                      style={{ color: "#9CA3AF" }}
                    >
                      {project.tags.map((tag) => (
                        <span key={tag}>{tag}</span>
                      ))}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
};

export default Projects;
