import type { PortfolioTemplateProps } from "../shared/types";
import {
  textValue,
  cleanUrl,
  getBookCallLink,
} from "../shared/utils";
import {
  normalizeLinks,
} from "../shared/normalize";
import Hero from "./components/hero";
import Links from "./components/links";
import Experience from "./components/experience";
import Projects from "./components/projects";
import Blogs from "./components/blogs";
import Stack from "./components/stack";
import BookACall from "./components/bookACall";
import ContactLinks from "./components/contact-links";
import { PortfolioNavbar } from "../shared/components/portfolio-navbar";
import { useRouter } from "next/navigation";

export function Template2({
  user,
  profile,
  section = "home",
  basePath = "",
}: PortfolioTemplateProps) {
  const name = textValue(profile?.name) || textValue(user?.name);
  const quote = textValue(profile?.quote);
  const avatar = cleanUrl(profile?.avatar);
  const banner = cleanUrl(profile?.banner);
  const links = normalizeLinks(profile?.links);
  const bookCallLink = getBookCallLink(profile);
  const router = useRouter();

  return (
      <main className="min-h-screen bg-[#fbfbfb] text-stone-700 antialiased">
        <div className="max-w-160 mx-auto px-6 py-12 sm:py-16">
          <PortfolioNavbar
            currentSection={section}
            basePath={basePath}
            className="mb-10 sm:mb-12 flex items-center justify-center gap-7 sm:gap-9 text-xs sm:text-[13px]"
            itemClassName="transition-all duration-150 lowercase cursor-pointer"
            activeItemClassName="font-semibold text-stone-900 border-b border-stone-800 pb-0.5"
            inactiveItemClassName="text-stone-400 hover:text-stone-700"
          />

          {section === "experience" && (
            <Experience profile={profile} showAll={true} basePath={basePath} />
          )}

          {section === "projects" && (
            <Projects profile={profile} showAll={true} basePath={basePath} />
          )}

          {section === "blogs" && (
            <Blogs profile={profile} showAll={true} basePath={basePath} />
          )}

          {section === "home" && (
            <>
              {quote && (
                <div className="mb-12 border-l-2 border-stone-300 pl-4">
                  <p className="text-xs text-stone-500 italic leading-relaxed">
                    {quote}
                  </p>
                </div>
              )}

              <Hero avatar={avatar} banner={banner} profile={profile} name={name} />

              <Links links={links} profile={profile} bookCallLink={bookCallLink} />

              <Experience profile={profile} basePath={basePath} />

              <Projects profile={profile} basePath={basePath} />

              <Blogs profile={profile} basePath={basePath} />

              <Stack profile={profile} />

              <BookACall bookCallLink={bookCallLink} avatar={avatar} name={name} />

              <ContactLinks profile={profile} links={links} />
            </>
          )}

          <div className="mt-14 pt-6 border-t border-stone-200 flex items-center justify-between">
            <p className="text-[11px] text-stone-300">
              built with{" "}
              <span className="text-stone-500 font-medium cursor-pointer" onClick={()=> router.push('/')}>lazyfolio</span>
            </p>
          </div>
        </div>
      </main>
  );
}
