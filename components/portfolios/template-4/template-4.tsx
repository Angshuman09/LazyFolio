import { PortfolioNavbar } from "../shared/components/portfolio-navbar";
import type { PortfolioTemplateProps } from "../shared/types";
import { textValue } from "../shared/utils";
import Blogs from "./components/blogs";
import Experience from "./components/experience";
import Footer from "./components/footer";
import Hero from "./components/hero";
import Projects from "./components/projects";
import Stack from "./components/stack";

/**
 * A small, calm personal portfolio built around a content-first, text-only
 * project list. Project previews were intentionally removed because the
 * profile model has no project imagery to fill them with.
 */
export function Template4({
  user,
  profile,
  section = "home",
  basePath = "",
}: PortfolioTemplateProps) {
  const name = textValue(profile?.name) || textValue(user?.name) || "Your name";
  const tagline = textValue(profile?.tagline) || textValue(profile?.headline);

  return (
    <main
      className="min-h-screen bg-white text-[#19191b] antialiased selection:bg-[#dedeff] selection:text-[#111114]"
      style={{
        fontFamily:
          "var(--font-sans), Inter, ui-sans-serif, system-ui, sans-serif",
      }}
    >
      <div className="mx-auto w-full max-w-[576px] px-5 pb-[72px] pt-[82px] max-[620px]:px-[18px] max-[620px]:pb-[52px] max-[620px]:pt-10">
        <header className="flex items-start justify-between gap-[22px] max-[430px]:flex-col max-[430px]:gap-3">
          <div>
            <h1 className="m-0 text-[18px] font-medium leading-[1.25] tracking-[-0.025em]">
              {name}
            </h1>
            {tagline && (
              <p className="mt-1 text-[16px] leading-[1.35] text-[#777780]">
                {tagline}
              </p>
            )}
          </div>
          <PortfolioNavbar
            currentSection={section}
            basePath={basePath}
            className="flex flex-[0_0_auto] flex-wrap justify-end gap-3.5 pt-[3px] max-[620px]:gap-2.5 max-[430px]:justify-start"
            itemClassName="text-[13px] leading-[1.3] transition-colors duration-150 max-[620px]:text-[12px]"
            activeItemClassName="text-[#171719]"
            inactiveItemClassName="text-[#83838c] hover:text-[#171719]"
          />
        </header>

        {section === "home" ? (
          <>
            <Hero profile={profile} />
            <Projects profile={profile} showAll={false} basePath={basePath} />
            <Experience profile={profile} showAll={false} basePath={basePath} />
            <Blogs profile={profile} showAll={false} basePath={basePath} />
            <Stack profile={profile} />
          </>
        ) : (
          <>
            {section === "projects" && (
              <Projects profile={profile} showAll basePath={basePath} />
            )}
            {section === "experience" && (
              <Experience profile={profile} showAll basePath={basePath} />
            )}
            {section === "blogs" && (
              <Blogs profile={profile} showAll basePath={basePath} />
            )}
          </>
        )}

        <Footer profile={profile} />
      </div>
    </main>
  );
}
