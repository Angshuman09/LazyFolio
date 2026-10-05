"use client";

import { useState, useEffect } from "react";
import { Template1 } from "@/components/portfolios/template-1/template-1";
import { Template2 } from "@/components/portfolios/template-2/template-2";
import { Template3 } from "./template-3/template-3";
import { Template4 } from "./template-4";
import { Template5 } from "./template-5";
import { Template6 } from "./template-6/template6";
import { Template7 } from "./template-7";
import { Template8 } from "./template-8";
import { Template9 } from "./template-9/template-9";
import { Template10 } from "./template-10/template-10";
import { Template11 } from "./template-11/template-11";

import { PortfolioSection } from "./shared/types";
import { PortfolioSectionProvider } from "./shared/context/portfolio-section-context";

type Template1Props = Parameters<typeof Template1>[0];
type TemplateUser = Template1Props["user"];
type TemplateProfile = Template1Props["profile"] & {
  themeId?: string | null;
};

export type TemplateRendererProps = {
  slug?: { username?: string };
  user?: TemplateUser | null;
  profile?: TemplateProfile | null;
  section?: PortfolioSection;
  basePath?: string;
  isInteractive?: boolean;
  onSectionChange?: (section: PortfolioSection) => void;
};

export function TemplateRenderer({
  user,
  profile,
  section: controlledSection,
  basePath = "",
  isInteractive = false,
  onSectionChange,
}: TemplateRendererProps) {
  const [internalSection, setInternalSection] = useState<PortfolioSection>(controlledSection || "home");

  useEffect(() => {
    if (controlledSection) {
      setInternalSection(controlledSection);
    }
  }, [controlledSection]);

  const activeSection = controlledSection ?? internalSection;

  const handleSectionChange = (newSection: PortfolioSection) => {
    setInternalSection(newSection);
    onSectionChange?.(newSection);
  };

  const renderTemplate = () => {
    const themeId = profile?.themeId || "1";
    const templateProps = {
      user: user ?? {},
      profile: profile ?? {},
      section: activeSection,
      basePath,
      onSectionChange: isInteractive ? handleSectionChange : undefined,
    };

    switch (themeId) {
      case "1":
        return <Template2 {...templateProps} />;
      case "2":
        return <Template1 {...templateProps} />;
      case "3":
        return <Template3 {...templateProps} />;
      case "4":
        return <Template4 {...templateProps} />;
      case "5":
        return <Template5 {...templateProps} />;
      case "6":
        return <Template6 {...templateProps} />;
      case "7":
        return <Template7 {...templateProps} />;
      case "8":
        return <Template8 {...templateProps} />;
      case "9":
        return <Template9 {...templateProps} />;
      case "10":
        return <Template10 {...templateProps} />;
      case "11":
        return <Template11 {...templateProps} />;
      default:
        return <Template1 {...templateProps} />;
    }
  };

  return (
    <PortfolioSectionProvider
      currentSection={activeSection}
      onSectionChange={isInteractive ? handleSectionChange : undefined}
      basePath={basePath}
      isInteractive={isInteractive}
    >
      <div className="w-full h-screen">{renderTemplate()}</div>
    </PortfolioSectionProvider>
  );
}
