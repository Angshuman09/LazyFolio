
import type { PortfolioTemplateProps } from "../shared/types";
import {
  textValue,
  cleanUrl,
  getBookCallLink,
} from "../shared/utils";
import { Footer } from "./components/utils";
import Hero from "./components/hero";
import Links from "./components/links";
import Experience from "./components/experience";
import Projects from "./components/projects";
import Blogs from "./components/blogs";
import Stack from "./components/stack";
import BookACall from "./components/bookacall";
import { PortfolioNavbar } from "../shared/components/portfolio-navbar";

export function Template3({
  user,
  profile,
  section = "home",
  basePath = "",
}: PortfolioTemplateProps) {
  
  const name = textValue(profile?.name) || textValue(user?.name);
  const quote = textValue(profile?.quote);
  const avatar = cleanUrl(profile?.avatar);
  const banner = cleanUrl(profile?.banner);
  const bookCallLink = getBookCallLink(profile);

  return (
      <main className="relative min-h-screen bg-white text-slate-700 antialiased selection:bg-slate-100 selection:text-slate-900">
        <div className="max-w-170 mx-auto px-6 py-10 sm:py-15">
          <PortfolioNavbar
            currentSection={section}
            basePath={basePath}
            className="mb-10 sm:mb-12 flex items-center gap-7 sm:gap-9 text-xs sm:text-[13px]"
            activeItemClassName="font-semibold text-slate-900 border-b border-slate-700 pb-0.5"
            inactiveItemClassName="text-slate-400 hover:text-slate-700"
          />

          {section === "home" && (
            <>
              <Hero profile={profile} avatar={avatar} banner={banner} name={name}/>
              <Links profile={profile} bookCallLink={bookCallLink}/>
              <Experience profile={profile} showAll={false} basePath={basePath} />
              <Projects profile={profile} showAll={false} basePath={basePath} />
              <Blogs profile={profile} showAll={false} basePath={basePath} />
              <Stack profile={profile}/>
              <BookACall bookCallLink={bookCallLink} name={name} avatar={avatar}/>
              {quote && (
                <div className="mt-16 flex flex-col items-start gap-3">
                  <p className="text-[14px] md:whitespace-nowrap text-slate-400 italic leading-relaxed max-w-sm border-l-2 border-slate-100 pl-4">
                    {quote}
                  </p>
                </div>
              )}
            </>
          )}

          {section === "experience" && (
            <Experience profile={profile} showAll basePath={basePath} />
          )}

          {section === "projects" && (
            <Projects profile={profile} showAll basePath={basePath} />
          )}

          {section === "blogs" && (
            <Blogs profile={profile} showAll basePath={basePath} />
          )}
        </div>
        <Footer />
      </main>
  );
}