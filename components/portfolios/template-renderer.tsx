"use client";

import { Template1 } from "@/components/portfolios/template-1/template1";
import { Template2 } from "@/components/portfolios/template2";
import { Template3 } from "./template3";
import { Template4 } from "./template4";
import { Template5 } from "./template5";
import { Template6 } from "./template6";
import { Template7 } from "./template7";
import { Template8 } from "./template8";

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
        return <Template2 user={user ?? {}} profile={profile ?? {}} />;
      case "2":
        return <Template1 user={user ?? {}} profile={profile ?? {}} />;
      case "3":
        return <Template3 user={user ?? {}} profile={profile ?? {}} />;
      case "4":
        return <Template4 user={user ?? {}} profile={profile ?? {}} />;
      case "5":
        return <Template5 user={user ?? {}} profile={profile ?? {}} />;
      case "6":
        return <Template6 user={user ?? {}} profile={profile ?? {}} />;
      case "7":
        return <Template7 user={user ?? {}} profile={profile ?? {}} />;
      case "8":
        return <Template8 user={user ?? {}} profile={profile ?? {}} />;
      default:
        return <Template1 user={user ?? {}} profile={profile ?? {}} />;
    }
  };

  return <div className="w-full h-screen">{renderTemplate()}</div>;
}
