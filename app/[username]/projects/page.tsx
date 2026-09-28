import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { ArrowLeft, ExternalLink, Github, FolderGit2 } from "lucide-react";
import { cacheLife, cacheTag } from "next/cache";
import { getPortfolioUrl } from "@/lib/utils/public-url";
import { shouldOpenInNewTab } from "@/components/portfolios/shared/utils";
import type { Metadata } from "next";

async function getProjectsProfile(username: string) {
  "use cache";
  cacheLife("hours");
  cacheTag("profile", `profile-${username}`);

  return prisma.profile.findUnique({
    where: { username },
    select: {
      id: true,
      name: true,
      avatar: true,
      username: true,
      projects: {
        where: { isenable: true },
        orderBy: [{ order: "asc" }, { createdAt: "desc" }],
      },
    },
  });
}

interface PageProps {
  params: Promise<{ username: string }> | { username: string };
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;
  const username = params?.username;
  if (!username) return {};

  const profile = await getProjectsProfile(username);
  const name = profile?.name || username;

  return {
    title: `Projects — ${name}`,
    description: `All projects and proof of work built by ${name} on Lazyfolio.`,
  };
}

export default async function PublicProjectsPage(props: PageProps) {
  const params = await props.params;
  const username = params?.username;

  if (!username) {
    notFound();
  }

  const profile = await getProjectsProfile(username);

  if (!profile) {
    notFound();
  }

  const portfolioHomeUrl = getPortfolioUrl(profile.username);
  const projects = profile.projects || [];

  return (
    <div className="min-h-screen bg-(--lf-bg) text-(--lf-ink) font-sans transition-colors duration-200 noise-overlay relative">
      <nav className="sticky top-0 z-40 w-full bg-(--lf-bg)/80 backdrop-blur-md border-b border-(--lf-border-alpha) px-6 py-4 flex items-center justify-between">
        <Link
          href={portfolioHomeUrl}
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-(--lf-muted) hover:text-(--lf-ink) transition-colors"
        >
          <ArrowLeft size={14} />
          Back to Profile
        </Link>

        <Link
          href={portfolioHomeUrl}
          className="flex items-center gap-2.5 hover:opacity-85 transition-opacity"
        >
          {profile.avatar ? (
            <div className="relative w-6 h-6 rounded-full overflow-hidden border border-(--lf-border)">
              <Image
                src={profile.avatar}
                alt={profile.name || "Author"}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="w-6 h-6 rounded-full bg-(--lf-border) flex items-center justify-center text-[10px] font-bold">
              {profile.name?.[0] || "U"}
            </div>
          )}
          <span className="text-xs font-medium text-(--lf-ink)">{profile.name}</span>
        </Link>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-12 sm:py-16 relative z-10">
        <header className="mb-10">
          <div className="flex items-center gap-2 text-xs font-mono text-(--lf-muted) uppercase tracking-widest mb-2">
            <FolderGit2 size={13} />
            <span>Showcase</span>
          </div>
          <h1 className="font-serif-display text-3xl sm:text-4xl font-medium tracking-tight text-(--lf-ink) mb-2">
            All Projects &amp; Proof of Work
          </h1>
          <p className="text-sm text-(--lf-muted)">
            {projects.length} {projects.length === 1 ? "project" : "projects"} built by {profile.name || username}
          </p>
        </header>

        {projects.length === 0 ? (
          <div className="py-16 text-center border border-dashed border-(--lf-border) rounded-2xl p-8">
            <p className="text-sm text-(--lf-muted) italic">No projects added yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.map((project) => {
              const formattedDate = project.enddate
                ? new Date(project.enddate).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                  })
                : null;

              return (
                <article
                  key={project.id}
                  className="rounded-xl border border-(--lf-border) bg-(--lf-surface) p-5 flex flex-col justify-between hover:border-(--lf-ink)/30 transition-all duration-150"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-2.5">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-(--lf-border-alpha) flex items-center justify-center shrink-0 text-xs font-bold text-(--lf-ink) uppercase select-none">
                          {project.title?.[0] || "P"}
                        </div>
                        <div className="min-w-0">
                          <h2 className="text-base font-medium text-(--lf-ink) truncate">
                            {project.title || "Untitled Project"}
                          </h2>
                          {formattedDate && (
                            <span className="text-[11px] font-mono text-(--lf-muted)">
                              {formattedDate}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {project.githubLink && (
                          <Link
                            href={project.githubLink}
                            target={shouldOpenInNewTab(project.githubLink) ? "_blank" : undefined}
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-md hover:bg-(--lf-border-alpha) text-(--lf-muted) hover:text-(--lf-ink) transition-colors"
                            aria-label={`${project.title || "Project"} source code`}
                          >
                            <Github size={15} />
                          </Link>
                        )}
                        {project.projectLink && (
                          <Link
                            href={project.projectLink}
                            target={shouldOpenInNewTab(project.projectLink) ? "_blank" : undefined}
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-md hover:bg-(--lf-border-alpha) text-(--lf-muted) hover:text-(--lf-ink) transition-colors"
                            aria-label={`${project.title || "Project"} live demo`}
                          >
                            <ExternalLink size={15} />
                          </Link>
                        )}
                      </div>
                    </div>

                    {project.description && (
                      <p className="text-xs text-(--lf-muted) leading-relaxed mb-4">
                        {project.description}
                      </p>
                    )}
                  </div>

                  {project.techstack && project.techstack.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-3 border-t border-(--lf-border)">
                      {project.techstack.map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] px-2 py-0.5 rounded-md bg-(--lf-border-alpha) text-(--lf-muted) font-mono"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}

        <footer className="mt-16 pt-8 border-t border-(--lf-border-alpha) flex items-center justify-between text-xs text-(--lf-muted)">
          <Link
            href={portfolioHomeUrl}
            className="hover:text-(--lf-ink) transition-colors flex items-center gap-1"
          >
            <ArrowLeft size={12} /> Back to portfolio
          </Link>
          <p>
            built with{" "}
            <Link href="/" className="text-(--lf-ink) hover:underline font-medium">
              lazyfolio
            </Link>
          </p>
        </footer>
      </main>
    </div>
  );
}
