import { PortfolioTemplateProps } from "../shared/types";
import {
  textValue,
  cleanUrl,
  getBookCallLink,
} from "../shared/utils";
import {
  normalizeLinks,
  normalizeProjects,
  normalizeStack,
} from "../shared/normalize";
import { PortfolioNavbar } from "../shared/components/portfolio-navbar";
import Hero from "./components/hero";
import Experience from "./components/experience";
import Projects from "./components/projects";
import Blogs from "./components/blogs";
import Stack from "./components/stack";
import { getMainSiteUrl } from "@/lib/utils/public-url";

export function Template11({
  user,
  profile,
  section = "home",
  basePath = "",
}: PortfolioTemplateProps) {
  const name = textValue(profile?.name) || textValue(user?.name);
  const avatar = cleanUrl(profile?.avatar) || cleanUrl(user?.image);
  const links = normalizeLinks(profile?.links);
  const stack = normalizeStack(profile?.skills);
  const bookCallLink = getBookCallLink(profile);

  return (
    /* Light blue-gray page — white document card inside */
    <main
      className="min-h-screen antialiased py-8 sm:py-14 print:py-0 print:bg-white"
      style={{ background: "#E8EDF4" }}
    >
      {/* Nav — outside the card, top of page, hidden when printing */}
      <div
        className="max-w-[780px] mx-auto px-6 mb-5 print:hidden"
      >
        <PortfolioNavbar
          currentSection={section}
          basePath={basePath}
          className="flex items-center justify-center gap-7 text-[11px] font-mono"
          activeItemClassName="text-[#1A1A1A] border-b border-[#1A1A1A] pb-px"
          inactiveItemClassName="text-[#94A3B8] hover:text-[#475569] transition-colors"
        />
      </div>

      {/* White document card */}
      <div
        className="max-w-[780px] mx-auto print:max-w-none print:mx-0 print:shadow-none"
        style={{
          background: "#FFFFFF",
          borderRadius: "4px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.08), 0 8px 32px rgba(0,0,0,0.06)",
        }}
      >
        <div className="px-10 sm:px-14 py-12 print:px-10 print:py-10">

          {section === "home" && (
            <>
              <Hero
                profile={profile}
                avatar={avatar}
                name={name}
                links={links}
                bookCallLink={bookCallLink}
              />

              {/* Thin rule after header */}
              <div className="my-7" style={{ borderTop: "1px solid #E2E8F0" }} />

              {/* Two-column body */}
              <div className="flex flex-col sm:flex-row gap-8 sm:gap-12">

                {/* RIGHT content — full section layout */}
                <div className="flex-1 min-w-0">
                  <Experience profile={profile} showAll={false} basePath={basePath} />
                  <Projects profile={profile} showAll={false} basePath={basePath} />
                  <Blogs profile={profile} showAll={false} basePath={basePath} />
                  {stack.length > 0 && <Stack stack={stack} />}
                </div>
              </div>

              <div
                className="mt-10 pt-5 print:hidden"
                style={{ borderTop: "1px solid #F1F5F9" }}
              >
                <p className="text-[10.5px] font-mono" style={{ color: "#CBD5E1" }}>
                  built with{" "}
                  <a
                    href={getMainSiteUrl()}
                    className="cursor-pointer hover:text-[#475569] transition-colors"
                    style={{ color: "#94A3B8" }}
                  >
                    lazyfolio
                  </a>
                  <span className="ml-3">·</span>
                  <button
                    onClick={() => window.print()}
                    className="ml-3 hover:text-[#475569] transition-colors cursor-pointer"
                    style={{ color: "#94A3B8" }}
                  >
                    print / save as PDF
                  </button>
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
      </div>
    </main>
  );
}
