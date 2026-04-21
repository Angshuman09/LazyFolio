"use client";

import { Template1 } from "@/components/portfolios/template1";
import { Template2 } from "@/components/portfolios/template2";
import { Template3 } from "@/components/portfolios/template3";

export function TemplateRenderer({ slug, user, profile }: { slug?: any; user?: any; profile?: any }) {
  const renderTemplate = () => {
    const themeId = profile?.themeId || "1";
    switch (themeId) {
      case "1":
        return <Template1 slug={slug} user={user} profile={profile} />;
      case "2":
        return <Template2 user={user} profile={profile} />;
      case "3":
        return <Template3 user={user} profile={profile} />;
      default:
        return <Template1 slug={slug} user={user} profile={profile} />;
    }
  };

  return <div className="w-full h-screen">{renderTemplate()}</div>;
}
