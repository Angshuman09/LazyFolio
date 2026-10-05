import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PortfolioProject } from "../../shared/types";
import { shouldOpenInNewTab } from "../../shared/utils";
import { Divider, SectionHeading } from "./utils";
import { usePortfolioSection } from "../../shared/context/portfolio-section-context";

const Projects = ({
  projects,
  showAll = false,
  basePath = "",
}: {
  projects: PortfolioProject[];
  showAll?: boolean;
  basePath?: string;
}) => {
  const sectionCtx = usePortfolioSection();
  const visible = showAll ? projects : projects.slice(0, 5);
  const projectsHref = `${basePath}/projects`;

  if (!showAll && projects.length === 0) return null;

  return (
    <>
      <Divider />
      <section>
        <SectionHeading>Projects</SectionHeading>
        {projects.length === 0 ? (
          <p className="text-[13px] italic" style={{ color: "#9A8C7C" }}>
            No projects listed yet.
          </p>
        ) : (
          <div className="space-y-8">
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
                        className="text-[15.5px] font-medium transition-colors inline-flex items-center gap-1.5"
                        style={{ color: "#1C1814" }}
                      >
                        <span className="group-hover:text-[#184E42] transition-colors">
                          {project.name}
                        </span>
                        <ArrowUpRight
                          size={12}
                          className="opacity-0 -translate-x-1 translate-y-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-200"
                          style={{ color: "#184E42" }}
                        />
                      </Link>
                    ) : (
                      <span className="text-[15.5px] font-medium" style={{ color: "#1C1814" }}>
                        {project.name}
                      </span>
                    )}

                    {project.date && (
                      <span
                        className="text-[11px] font-mono shrink-0"
                        style={{ color: "#9E9080" }}
                      >
                        {project.date}
                      </span>
                    )}
                  </div>

                  {project.description && (
                    <p
                      className="text-[13.5px] leading-relaxed mt-1.5 max-w-lg"
                      style={{ color: "#615447" }}
                    >
                      {project.description}
                    </p>
                  )}

                  {project.tags.length > 0 && (
                    <div
                      className="mt-2 text-[11px] font-mono flex flex-wrap gap-x-2 gap-y-1"
                      style={{ color: "#9E9080" }}
                    >
                      {project.tags.map((tag, idx) => (
                        <span key={tag}>
                          {tag}
                          {idx < project.tags.length - 1 && <span className="opacity-40 ml-2">·</span>}
                        </span>
                      ))}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}

        {!showAll && projects.length > 5 && (
          <Link
            href={projectsHref}
            onClick={(e) => {
              if (sectionCtx?.onSectionChange) {
                e.preventDefault();
                sectionCtx.onSectionChange("projects");
              }
            }}
            className="inline-flex items-center gap-1.5 mt-8 text-[11px] font-mono transition-colors cursor-pointer hover:underline"
            style={{ color: "#184E42" }}
          >
            <span>All projects ({projects.length})</span>
            <ArrowUpRight size={11} />
          </Link>
        )}
      </section>
    </>
  );
};

export default Projects;
