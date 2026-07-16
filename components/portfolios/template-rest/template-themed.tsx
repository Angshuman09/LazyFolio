import { useRouter } from "next/navigation";

import type { TemplateThemeConfig, ThemedPortfolioProps } from "../shared/types";
import {
  textValue,
  cleanUrl,
  getBookCallLink,
} from "../shared/utils";
import Hero from "./components/hero";
import Links from "./components/links";
import Experience from "./components/experience";
import Projects from "./components/projects";
import Blogs from "./components/blogs";
import Stack from "./components/stack";
import BookACall from "./components/bookacall";

export function ThemedPortfolioTemplate({
  user,
  profile,
  config,
}: ThemedPortfolioProps & { config: TemplateThemeConfig }) {
  const name = textValue(profile?.name) || textValue(user?.name);
  const quote = textValue(profile?.quote);
  const avatar = cleanUrl(profile?.avatar) || cleanUrl(user?.image);
  const bookCallLink = getBookCallLink(profile);
  const iconStrokeWidth = config.iconStrokeWidth ?? 1.8;

  const router = useRouter();

  return (
    <>
      <style>{`
        @keyframes ${config.key}-ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .${config.key}-ticker-track {
          animation: ${config.key}-ticker 34s linear infinite;
        }
        @container (max-width: 920px) {
          .${config.key}-portfolio .lf-themed-hero {
            grid-template-columns: minmax(0, 1fr) !important;
            align-items: stretch !important;
          }
          .${config.key}-portfolio .lf-themed-project-list,
          .${config.key}-portfolio .lf-themed-contact-list {
            grid-template-columns: minmax(0, 1fr) !important;
          }
          .${config.key}-portfolio .lf-themed-name {
            font-size: 42px !important;
          }
          .${config.key}-portfolio .lf-themed-banner {
            height: 13rem !important;
          }
        }
        @container (max-width: 560px) {
          .${config.key}-portfolio .lf-themed-name {
            font-size: 34px !important;
          }
          .${config.key}-portfolio .lf-themed-banner {
            height: 11rem !important;
          }
          .${config.key}-portfolio .lf-themed-experience-meta,
          .${config.key}-portfolio .lf-themed-footer {
            flex-direction: column !important;
            align-items: flex-start !important;
          }
        }
      `}</style>
      <main
        className={`${config.key}-portfolio ${config.pageClass}`}
        style={{ ...config.pageStyle, containerType: "inline-size" }}
      >
        <div className={config.containerClass}>
          {quote && <p className={config.quoteClass}>{quote}</p>}
          <Hero profile={profile} avatar={avatar} config={config} name={name}/>
          <Links profile={profile} config={config} bookCallLink={bookCallLink} iconStrokeWidth={iconStrokeWidth}/>
          <Experience profile={profile} config={config}/>
          <Projects profile={profile} config={config} iconStrokeWidth={iconStrokeWidth}/>
          <Blogs profile={profile} config={config} iconStrokeWidth={iconStrokeWidth}/>
          <Stack profile={profile} config={config}/>
          <BookACall bookCallLink={bookCallLink} config={config} avatar={avatar} name={name} iconStrokeWidth={iconStrokeWidth} />
          <footer
            className={`lf-themed-footer flex justify-center items-center ${config.footerClass}`}
          >
            <p
              onClick={() => router.push("/")}
              className={config.footerBrandClass}
            >
              Built with lazyfolio
            </p>
          </footer>
        </div>
      </main>
    </>
  );
}
