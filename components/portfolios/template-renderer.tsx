"use client";

import { Template1 } from "@/components/portfolios/template1";
import { Template2 } from "@/components/portfolios/template2";
import { Template3 } from "./template3";

type Template1Props = Parameters<typeof Template1>[0];
type TemplateUser = Template1Props["user"];
type TemplateProfile = Template1Props["profile"] & {
  themeId?: string | null;
};

type TemplateRendererProps = {
  slug?: { username?: string };
  user?: TemplateUser | null;
  profile?: TemplateProfile | null;
};

export function TemplateRenderer({ user, profile }: TemplateRendererProps) {
  const renderTemplate = () => {
    const themeId = profile?.themeId || "1";
    switch (themeId) {
      case "1":
        return <Template1 user={user ?? {}} profile={profile ?? {}} />;
      case "2":
        return <Template2 user={user ?? {}} profile={profile ?? {}} />;
      case "3":
        return <Template3 user={user ?? {}} profile={profile ?? {}} />;
      default:
        return <Template1 user={user ?? {}} profile={profile ?? {}} />;
    }
  };

  return <div className="w-full h-screen">{renderTemplate()}</div>;
}
