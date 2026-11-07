import Link from "next/link";
import { getMainSiteUrl } from "@/lib/utils/public-url";
import { PortfolioNavbar } from "../shared/components/portfolio-navbar";
import type { PortfolioTemplateProps } from "../shared/types";
import { cleanUrl, textValue } from "../shared/utils";
import About from "./components/about";
import Blogs from "./components/blogs";
import Connect from "./components/connect";
import Experience from "./components/experience";
import Hero from "./components/hero";
import Projects from "./components/projects";
import Stack from "./components/stack";
import { initialsOf } from "./components/utils";

export function Template8({
  user,
  profile,
  section = "home",
  basePath = "",
}: PortfolioTemplateProps) {
  const name = textValue(profile?.name) || textValue(user?.name) || "Your name";
  const tagline = textValue(profile?.tagline) || textValue(profile?.headline);
  const avatar = cleanUrl(profile?.avatar) || cleanUrl(user?.image);
  const isHome = section === "home";

  return (
    <main className="min-h-screen bg-white text-[#111216] antialiased selection:bg-[#dce7ff] selection:text-[#111216]">
      <header className="h-[66px] border-b border-[#e6e7e9] max-[620px]:h-auto max-[620px]:min-h-[58px]">
        <div className="mx-auto flex h-full w-full max-w-[768px] items-center justify-between gap-[18px] border-x border-[#ececef] px-[18px] max-[800px]:w-[calc(100%_-_36px)] max-[800px]:px-3.5 max-[620px]:min-h-[58px] max-[620px]:items-start max-[620px]:py-3">
          <span
            className="font-sans-body inline-flex min-w-[38px] text-[21px] font-semibold leading-none tracking-[-0.09em] text-[#10212a]"
            aria-label={name + " initials"}
          >
            {initialsOf(name)}
          </span>

          <PortfolioNavbar
            currentSection={section}
            basePath={basePath}
            className="flex flex-wrap justify-end gap-5 max-[620px]:gap-[11px]"
            itemClassName="text-[14px] leading-[1.3] capitalize transition-colors duration-150 max-[620px]:text-[12px]"
            activeItemClassName="text-[#15161a]"
            inactiveItemClassName="text-[#8a8c94] hover:text-[#15161a]"
          />
        </div>
      </header>

      <div className="mx-auto w-full max-w-[768px] border-x border-[#ececef] max-[800px]:w-[calc(100%_-_36px)]">
        <Hero
          profile={profile}
          name={name}
          tagline={tagline}
          avatar={avatar}
        />

        {isHome ? (
          <>
            <About profile={profile} />
            <Connect profile={profile} />
            <Experience profile={profile} showAll={false} basePath={basePath} />
            <Projects profile={profile} showAll={false} basePath={basePath} />
            <Blogs profile={profile} showAll={false} basePath={basePath} />
            <Stack profile={profile} />
          </>
        ) : (
          <>
            {section === "experience" && (
              <Experience profile={profile} showAll basePath={basePath} />
            )}
            {section === "projects" && (
              <Projects profile={profile} showAll basePath={basePath} />
            )}
            {section === "blogs" && (
              <Blogs profile={profile} showAll basePath={basePath} />
            )}
          </>
        )}

        <footer className="font-mono px-[27px] pb-[30px] pt-5 text-[10px] leading-[1.5] text-[#9a9ca4] max-[620px]:px-[18px] max-[620px]:pb-7">
          <Link
            href={getMainSiteUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors duration-150 hover:text-[#4e6fae]"
          >
            Built with Lazyfolio
          </Link>
        </footer>
      </div>
    </main>
  );
}
