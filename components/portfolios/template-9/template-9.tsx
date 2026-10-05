import { PortfolioTemplateProps } from "../shared/types";
import {
  textValue,
  cleanUrl,
  getBookCallLink,
  addProfileContactLinks,
} from "../shared/utils";
import {
  normalizeLinks,
  normalizeProjects,
  normalizeStack,
} from "../shared/normalize";
import { PortfolioNavbar } from "../shared/components/portfolio-navbar";
import Hero from "./components/hero";
import Links from "./components/links";
import Experience from "./components/experience";
import Projects from "./components/projects";
import Blogs from "./components/blogs";
import Stack from "./components/stack";
import BookACall from "./components/bookacall";
import ContactInfo from "./components/contactinfo";
import { useRouter } from "next/navigation";

export function Template9({
  user,
  profile,
  section = "home",
  basePath = "",
}: PortfolioTemplateProps) {
  const name = textValue(profile?.name) || textValue(user?.name);
  const avatar = cleanUrl(profile?.avatar) || cleanUrl(user?.image);
  const links = normalizeLinks(profile?.links);
  const contactLinks = addProfileContactLinks(links, profile);
  const projects = normalizeProjects(profile?.projects);
  const stack = normalizeStack(profile?.skills);
  const bookCallLink = getBookCallLink(profile);
  const hasQuickActions = links.length > 0 || Boolean(bookCallLink);
  const router = useRouter();

  return (
    /* Warm parchment — ink-on-paper editorial feel */
    <main
      className="min-h-screen antialiased"
      style={{ background: "#F4F0E9", color: "#1C1814", fontFamily: "system-ui, -apple-system, sans-serif" }}
    >
      <div className="max-w-[580px] mx-auto px-7 py-14 sm:py-20">

        {/* Nav — small, top, right-aligned */}
        <PortfolioNavbar
          currentSection={section}
          basePath={basePath}
          className="mb-16 flex items-center justify-end gap-6 text-[11px] tracking-widest uppercase"
          activeItemClassName="text-[#1C1814]"
          inactiveItemClassName="text-[#A0907E] hover:text-[#1C1814] transition-colors"
        />

        {section === "home" && (
          <>
            <Hero profile={profile} avatar={avatar} name={name} />

            {hasQuickActions && (
              <Links profile={profile} links={links} bookCallLink={bookCallLink} />
            )}

            <Experience profile={profile} showAll={false} basePath={basePath} />
            <Projects projects={projects} showAll={false} basePath={basePath} />
            <Blogs profile={profile} showAll={false} basePath={basePath} />

            {stack.length > 0 && <Stack stack={stack} />}

            {bookCallLink && (
              <BookACall name={name} avatar={avatar} bookCallLink={bookCallLink} />
            )}

            {contactLinks.length > 0 && (
              <ContactInfo profile={profile} contactLinks={contactLinks} />
            )}

            <div className="mt-16 pt-5" style={{ borderTop: "1px solid #D8D0C5" }}>
              <p className="text-[10px] tracking-widest uppercase" style={{ color: "#B5A898" }}>
                built with{" "}
                <span
                  onClick={() => router.push("/")}
                  className="cursor-pointer hover:text-[#1C1814] transition-colors"
                  style={{ color: "#8C7B6A" }}
                >
                  lazyfolio
                </span>
              </p>
            </div>
          </>
        )}

        {section === "experience" && (
          <Experience profile={profile} showAll basePath={basePath} />
        )}
        {section === "projects" && (
          <Projects projects={projects} showAll basePath={basePath} />
        )}
        {section === "blogs" && (
          <Blogs profile={profile} showAll basePath={basePath} />
        )}
      </div>
    </main>
  );
}
