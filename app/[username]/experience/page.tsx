import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { ArrowLeft, Briefcase, Calendar } from "lucide-react";
import { cacheLife, cacheTag } from "next/cache";
import { getPortfolioUrl } from "@/lib/utils/public-url";
import { formatDateRange, splitDescription } from "@/components/portfolios/shared/utils";
import type { Metadata } from "next";

async function getExperienceProfile(username: string) {
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
      experiences: {
        where: { isenable: true },
        orderBy: [{ startdate: "desc" }, { createdAt: "desc" }],
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

  const profile = await getExperienceProfile(username);
  const name = profile?.name || username;

  return {
    title: `Experience — ${name}`,
    description: `Professional work history and career background of ${name} on Lazyfolio.`,
  };
}

export default async function PublicExperiencePage(props: PageProps) {
  const params = await props.params;
  const username = params?.username;

  if (!username) {
    notFound();
  }

  const profile = await getExperienceProfile(username);

  if (!profile) {
    notFound();
  }

  const portfolioHomeUrl = getPortfolioUrl(profile.username);
  const experiences = profile.experiences || [];

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

      <main className="max-w-2xl mx-auto px-6 py-12 sm:py-16 relative z-10">
        <header className="mb-10">
          <div className="flex items-center gap-2 text-xs font-mono text-(--lf-muted) uppercase tracking-widest mb-2">
            <Briefcase size={13} />
            <span>Career</span>
          </div>
          <h1 className="font-serif-display text-3xl sm:text-4xl font-medium tracking-tight text-(--lf-ink) mb-2">
            Work Experience
          </h1>
          <p className="text-sm text-(--lf-muted)">
            {experiences.length} {experiences.length === 1 ? "position" : "positions"} held by {profile.name || username}
          </p>
        </header>

        {experiences.length === 0 ? (
          <div className="py-16 text-center border border-dashed border-(--lf-border) rounded-2xl p-8">
            <p className="text-sm text-(--lf-muted) italic">No work experience listed yet.</p>
          </div>
        ) : (
          <div className="space-y-10 border-l border-(--lf-border) ml-3 pl-6 sm:pl-8">
            {experiences.map((exp) => {
              const period = formatDateRange(exp.startdate, exp.enddate);
              const bullets = splitDescription(exp.description);

              return (
                <div key={exp.id} className="relative group">
                  {/* Timeline Dot */}
                  <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-3 h-3 rounded-full bg-(--lf-bg) border-2 border-(--lf-ink)" />

                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 mb-1.5">
                    <h2 className="text-base font-semibold text-(--lf-ink)">
                      {exp.companyName || "Organization"}
                    </h2>
                    {period && (
                      <span className="text-xs font-mono text-(--lf-muted) flex items-center gap-1 shrink-0">
                        <Calendar size={11} />
                        {period}
                      </span>
                    )}
                  </div>

                  {exp.role && (
                    <p className="text-xs font-medium text-(--lf-muted) mb-3">
                      {exp.role}
                    </p>
                  )}

                  {bullets.length > 0 && (
                    <ul className="space-y-2 mt-2">
                      {bullets.map((bullet, i) => (
                        <li
                          key={i}
                          className="flex gap-2.5 text-xs text-(--lf-muted) leading-relaxed"
                        >
                          <span className="text-(--lf-ink) shrink-0 select-none">•</span>
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
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
