import type { PortfolioTemplateProps } from "../shared/types";
import { textValue, cleanUrl } from "../shared/utils";
import { Footer } from "./components/utils";
import Hero from "./components/hero";
import Links from "./components/links";
import Experience from "./components/experience";
import Projects from "./components/projects";
import Blogs from "./components/blogs";
import Stack from "./components/stack";
import { PortfolioNavbar } from "../shared/components/portfolio-navbar";

export function Template3({
  user,
  profile,
  section = "home",
  basePath = "",
}: PortfolioTemplateProps) {
  const name = textValue(profile?.name) || textValue(user?.name);
  const quote = textValue(profile?.quote);
  const avatar = cleanUrl(profile?.avatar) || cleanUrl(user?.image);

  return (
    <main className="relative min-h-screen bg-[#0a0a0a] text-neutral-400 antialiased selection:bg-neutral-800 selection:text-neutral-100 font-sans">
      <div className="mx-auto px-6 py-12 md:px-12 md:py-20" style={{ maxWidth: 740 }}>
        <PortfolioNavbar
          currentSection={section}
          basePath={basePath}
          className="mb-12 sm:mb-16 flex items-center gap-7 sm:gap-9 text-xs sm:text-[13px]"
          activeItemClassName="font-medium text-neutral-100 border-b border-neutral-400 pb-0.5"
          inactiveItemClassName="text-neutral-500 hover:text-neutral-300 transition-colors"
        />

        {section === "home" && (
          <>
            <Hero
              profile={profile}
              user={user}
              avatar={avatar}
              name={name}
            />
            <Projects profile={profile} showAll={false} basePath={basePath} />
            <Experience profile={profile} showAll={false} basePath={basePath} />
            <Blogs profile={profile} showAll={false} basePath={basePath} />
            <Stack profile={profile} />
            {quote && (
              <div className="mt-16 flex flex-col items-start gap-3">
                <p className="text-[14px] text-neutral-400 italic leading-relaxed max-w-lg border-l-2 border-neutral-800 pl-4">
                  &ldquo;{quote}&rdquo;
                </p>
              </div>
            )}
            <Links profile={profile} />
          </>
        )}

        {section === "experience" && (
          <div>
            <Experience profile={profile} showAll basePath={basePath} />
          </div>
        )}

        {section === "projects" && (
          <div>
            <Projects profile={profile} showAll basePath={basePath} />
          </div>
        )}

        {section === "blogs" && (
          <div>
            <Blogs profile={profile} showAll basePath={basePath} />
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}
