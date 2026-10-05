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
import ContactLinks from "./components/contact-links";
import { useRouter } from "next/navigation";

export function Template10({
  user,
  profile,
  section = "home",
  basePath = "",
}: PortfolioTemplateProps) {
  const name = textValue(profile?.name) || textValue(user?.name);
  const avatar = cleanUrl(profile?.avatar) || cleanUrl(user?.image);
  const banner = cleanUrl(profile?.banner);
  const links = normalizeLinks(profile?.links);
  const contactLinks = addProfileContactLinks(links, profile);
  const projects = normalizeProjects(profile?.projects);
  const stack = normalizeStack(profile?.skills);
  const bookCallLink = getBookCallLink(profile);
  const router = useRouter();

  return (
    /* Warm off-white — indigo accent system */
    <main
      className="min-h-screen antialiased"
      style={{
        background: "#FFFCF9",
        color: "#0F0F0F",
        fontFamily: "'DM Sans', system-ui, -apple-system, sans-serif",
      }}
    >
      <div className="max-w-160 mx-auto px-6 py-12 sm:py-16">

        <PortfolioNavbar
          currentSection={section}
          basePath={basePath}
          className="mb-12 flex items-center gap-5 text-[12px] font-mono"
          activeItemClassName="font-semibold text-fuchsia-500"
          inactiveItemClassName="text-[#9CA3AF] hover:text-[#374151] transition-colors"
        />

        {section === "home" && (
          <>
            <Hero avatar={avatar} banner={banner} profile={profile} name={name} />
            <Links links={links} profile={profile} bookCallLink={bookCallLink} />
            <Experience profile={profile} showAll={false} basePath={basePath} />
            <Projects profile={profile} showAll={false} basePath={basePath} />
            <Blogs profile={profile} showAll={false} basePath={basePath} />
            {stack.length > 0 && <Stack stack={stack} />}
            {bookCallLink && (
              <BookACall bookCallLink={bookCallLink} avatar={avatar} name={name} />
            )}
            {contactLinks.length > 0 && (
              <ContactLinks links={contactLinks} profile={profile} />
            )}

            <div className="mt-14 pt-5" style={{ borderTop: "1px solid #F0ECE8" }}>
              <p className="text-[11px]" style={{ color: "#C4B8AC" }}>
                built with{" "}
                <span
                  onClick={() => router.push("/")}
                  className="cursor-pointer hover:text-[#1D4ED8] transition-colors"
                  style={{ color: "#9CA3AF" }}
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
          <Projects profile={profile} showAll basePath={basePath} />
        )}
        {section === "blogs" && (
          <Blogs profile={profile} showAll basePath={basePath} />
        )}
      </div>
    </main>
  );
}
