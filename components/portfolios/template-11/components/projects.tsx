import Link from "next/link";
import { normalizeProjects } from "../../shared/normalize";
import { ProfileData } from "../../shared/types";
import { shouldOpenInNewTab } from "../../shared/utils";
import { SectionLabel, MobileSectionLabel, SectionGap } from "./utils";
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

  const MONO: React.CSSProperties = {
    fontFamily: "'Courier New', Courier, monospace",
  };
  const BODY: React.CSSProperties = {
    fontFamily: "system-ui, -apple-system, sans-serif",
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-0 sm:gap-8">
        <SectionLabel>Projects</SectionLabel>
        <div className="flex-1 min-w-0">
          <MobileSectionLabel>Projects</MobileSectionLabel>
          {projects.length === 0 ? (
            <p className="text-[12px] italic" style={{ color: "#94A3B8", ...BODY }}>
              No projects listed yet.
            </p>
          ) : (
            <div className="space-y-5">
              {visible.map((project) => (
                <div key={project.id}>
                  <div className="flex items-baseline justify-between gap-3">
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <span className="font-bold text-[13.5px]" style={{ color: "#1A1A1A", ...BODY }}>
                        {project.name}
                      </span>
                      {project.tags.length > 0 && (
                        <span className="text-[11.5px]" style={{ color: "#64748B", ...MONO }}>
                          {project.tags.map((t) => `[${t}]`).join(" ")}
                        </span>
                      )}
                    </div>
                    {project.date && (
                      <span className="text-[11px] shrink-0" style={{ color: "#94A3B8", ...MONO }}>
                        {project.date}
                      </span>
                    )}
                  </div>

                  {project.description && (
                    <p
                      className="text-[12.5px] leading-relaxed mt-0.5"
                      style={{ color: "#374151", ...BODY }}
                    >
                      {project.description}
                    </p>
                  )}

                  <div className="flex items-center gap-4 mt-1 text-[11px]" style={MONO}>
                    {project.demo && (
                      <Link
                        href={project.demo}
                        target={shouldOpenInNewTab(project.demo) ? "_blank" : undefined}
                        rel="noopener noreferrer"
                        className="hover:text-[#1A1A1A] transition-colors"
                        style={{ color: "#64748B" }}
                      >
                        {project.demo.replace(/^https?:\/\//, "")} →
                      </Link>
                    )}
                    {project.github && (
                      <Link
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-[#1A1A1A] transition-colors"
                        style={{ color: "#94A3B8" }}
                      >
                        source code
                      </Link>
                    )}
                  </div>
                </div>
              ))}

              {!showAll && projects.length > 4 && (
                <Link
                  href={projectsHref}
                  onClick={(e) => {
                    if (sectionCtx?.onSectionChange) {
                      e.preventDefault();
                      sectionCtx.onSectionChange("projects");
                    }
                  }}
                  className="text-[11px] cursor-pointer hover:text-[#1A1A1A] transition-colors"
                  style={{ color: "#94A3B8", ...MONO }}
                >
                  + {projects.length - 4} more projects
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
      <SectionGap />
    </>
  );
};

export default Projects;
