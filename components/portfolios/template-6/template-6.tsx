import { PortfolioTemplateProps } from "../shared/types";
import {
  cleanUrl,
  getBookCallLink,
  textValue,
} from "../shared/utils";
import Hero from "./components/hero";
import Links from "./components/links";
import Projects from "./components/projects";
import Blogs from "./components/blogs";
import Stacks from "./components/stacks";
import Experience from "./components/experience";
import BookACall from "./components/bookacall";
import { PortfolioNavbar } from "../shared/components/portfolio-navbar";
import { getMainSiteUrl } from "@/lib/utils/public-url";

export function Template6({
  user,
  profile,
  section = "home",
  basePath = "",
}: PortfolioTemplateProps) {
  const name         = textValue(profile?.name)   || textValue(user?.name);
  const avatar       = cleanUrl(profile?.avatar);
  const bookCallLink = getBookCallLink(profile);

  return (
    <>
      <main
        className="min-h-screen bg-[#FDF6EC] text-[#1A3D2B]"
        style={{ fontFamily: "'DM Sans', system-ui, sans-serif", containerType: "inline-size" }}
      >
        <div className="max-w-175 mx-auto px-5.5 pt-10 pb-20">
          <PortfolioNavbar
            currentSection={section}
            basePath={basePath}
            className="mb-10 sm:mb-12 flex items-center gap-7 sm:gap-9 text-xs sm:text-[13px]"
            activeItemClassName="font-bold text-[#1A3D2B] border-b border-[#1A3D2B] pb-0.5"
            inactiveItemClassName="text-[#7A9585] hover:text-[#1A3D2B]"
          />

          {section === "home" && (
            <>
              <Hero profile={profile} avatar={avatar} name={name}/>
              <Links profile={profile} bookCallLink={bookCallLink}/>
              <Experience profile={profile} showAll={false} basePath={basePath} />
              <Projects profile={profile} showAll={false} basePath={basePath} />
              <Blogs profile={profile} showAll={false} basePath={basePath} />
              <Stacks profile={profile}/>
              <BookACall avatar={avatar} name={name} bookCallLink={bookCallLink}/>
              <footer className="mt-14 pt-6 border-t-[1.5px] border-[#D5E5DA] flex items-center justify-between gap-3 max-[580px]:flex-col max-[580px]:items-start">
                <p className="text-[11px] font-semibold tracking-widest text-[#7A9585] m-0">
                  Built with <a href={getMainSiteUrl()} className="text-green-800 hover:underline cursor-pointer">Lazyfolio</a>
                </p>
              </footer>
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
      </main>
    </>
  );
}