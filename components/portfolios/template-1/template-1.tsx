
import Hero from "./components/hero";
import Links from "./components/links";
import Experience from "./components/experience";
import Projects from "./components/projects";
import Blogs from "./components/blogs";
import Stack from "./components/stack";
import BookACall from "./components/bookacall";
import ContactInfo from "./components/contactinfo";
import { PortfolioTemplateProps } from "../shared/types";
import { addProfileContactLinks, cleanUrl, getBookCallLink, textValue } from "../shared/utils";
import { normalizeBlogs, normalizeExperiences, normalizeLinks, normalizeProjects, normalizeStack } from "../shared/normalize";
import { PortfolioNavbar } from "../shared/components/portfolio-navbar";
import { useRouter } from "next/navigation";

export function Template1({
  user,
  profile,
  section = "home",
  basePath = "",
}: PortfolioTemplateProps) {
  const name = textValue(profile?.name) || textValue(user?.name);
  const quote = textValue(profile?.quote);
  const links = normalizeLinks(profile?.links);
  const contactLinks = addProfileContactLinks(links, profile);
  const experiences = normalizeExperiences(profile?.experiences);
  const projects = normalizeProjects(profile?.projects);
  const blogs = normalizeBlogs(profile?.blogs, profile?.username);
  const stack = normalizeStack(profile?.skills);
  const bookCallLink = getBookCallLink(profile);
  const avatar = cleanUrl(profile?.avatar);
  const hasQuickActions = links.length > 0 || Boolean(bookCallLink);
  const router = useRouter();

  return (
    <>
      <main className="min-h-screen bg-[#0e0e0e] text-zinc-300 antialiased">
        <div className="max-w-160 mx-auto px-5 py-16 sm:py-20">
          <PortfolioNavbar
            currentSection={section}
            basePath={basePath}
            className="mb-10 sm:mb-12 flex items-center gap-7 sm:gap-9 text-xs sm:text-[13px]"
            activeItemClassName="font-semibold text-zinc-100 border-b border-zinc-500 pb-0.5"
            inactiveItemClassName="text-zinc-600 hover:text-zinc-300"
          />

          {section === "home" && (
            <>
              {quote && (
                <div className="mb-12 border-l-2 border-zinc-700 pl-4">
                  <p className="text-xs text-zinc-500 italic leading-relaxed">
                    {quote}
                  </p>
                </div>
              )}

              <Hero profile={profile} user={user} avatar={avatar} name={name}/>

              {hasQuickActions && (
              <Links profile={profile} links={links} bookCallLink={bookCallLink}/>
              )}

              <Experience experiences={experiences} showAll={false} basePath={basePath} />
              <Projects projects={projects} showAll={false} basePath={basePath} />
              <Blogs blogs={blogs} showAll={false} basePath={basePath} />

              {stack.length > 0 && (
                <Stack stack={stack}/>
              )}

              {bookCallLink && (
                <BookACall name={name} avatar={avatar} bookCallLink={bookCallLink}/>
              )}

              {contactLinks.length > 0 && (
                <ContactInfo profile={profile} contactLinks={contactLinks}/>
              )}

              <div className="mt-14 pt-6 border-t border-zinc-800/60 flex items-center justify-between">
                <p className="text-[11px] text-zinc-800">
                  built with <span onClick={()=> router.push('/')} className="text-zinc-600 cursor-pointer">lazyfolio</span>
                </p>
              </div>
            </>
          )}

          {section === "experience" && (
            <Experience experiences={experiences} showAll basePath={basePath} />
          )}

          {section === "projects" && (
            <Projects projects={projects} showAll basePath={basePath} />
          )}

          {section === "blogs" && (
            <Blogs blogs={blogs} showAll basePath={basePath} />
          )}
        </div>
      </main>
    </>
  );
}
