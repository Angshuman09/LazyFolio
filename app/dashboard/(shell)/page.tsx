"use client";

import { useRef } from "react";
import { Loader2 } from "lucide-react";
import { SubscriptionBadge } from "@/components/dashboard/articles/subscription-badge";
import { TemplateRenderer } from "@/components/portfolios/template-renderer";
import ProfileForm from "@/components/dashboard/profile-form";
import LinksForm from "@/components/dashboard/links/links-form";
import ExperienceForm from "@/components/dashboard/experiences/experience-form";
import ProjectsForm from "@/components/dashboard/projects/projects-form";
import SkillsForm from "@/components/dashboard/skills/skills-form";
import BlogsForm from "@/components/dashboard/blogs/blogs-form";
import {
  DashboardSkeleton,
  TemplateRendererSkeleton,
} from "@/components/dashboard/dashboard-skeleton";
import { parseSkill } from "@/lib/utils/skills";
import InsightsPage from "@/components/dashboard/insights/insight";
import { useDashboardShell } from "@/components/dashboard/shell-context";
import {
  DashboardMain,
  DashboardPreviewPanel,
} from "@/components/dashboard/dashboard-content-shell";

export default function DashboardPage() {
  const {
    session,
    profile,
    isProfileLoading,
    isSessionPending,
    tab,
    changeTab,
    previewSection,
    setPreviewSection,
    username,
    setSupportMeOpen,
    subData,
    isSubLoading,
    submits,
  } = useDashboardShell();

  const formRef = useRef<HTMLFormElement>(null);
  const {
    onProfileSubmit,
    onLinksSubmit,
    onExperienceSubmit,
    onSubmitProjects,
    onSubmitSkills,
    onSubmitBlogs,
  } = submits;

  const previewProfile = profile
    ? {
      ...profile,
      links: (profile.links || []).filter((link: { isenable?: boolean | null }) => link.isenable ?? true),
      experiences: (profile.experiences || []).filter(
        (experience: { isenable?: boolean | null }) => experience.isenable ?? true,
      ),
      projects: (profile.projects || []).filter(
        (project: { isenable?: boolean | null }) => project.isenable ?? true,
      ),
      blogs: (profile.blogs || []).filter((blog: { isEnabled?: boolean | null; isenable?: boolean | null }) => blog.isEnabled ?? blog.isenable ?? true),
      skills: ((profile.skills || []) as string[])
        .map(parseSkill)
        .filter((s) => s.isenable && s.value)
        .map((s) => s.value),
    }
    : profile;

  const loading = isProfileLoading || isSessionPending;

  return (
    <>
      <DashboardMain>
        {loading ? (
          <DashboardSkeleton />
        ) : !profile?.username && tab !== "profile" ? (
          <div className="flex flex-col items-center justify-center min-h-[calc(100vh-140px)] text-center max-w-sm mx-auto">
            <div className="text-[1.2rem] font-serif-display text-(--lf-ink) mb-2">Username Required</div>
            <div className="text-[0.85rem] text-(--lf-muted)">Please set your username in the profile tab before adding other information.</div>
            <button onClick={() => changeTab("profile")} className="mt-5 px-4 py-2 bg-(--lf-ink) text-(--lf-bg) rounded-xl text-[0.8rem] font-semibold cursor-pointer">Go to Profile</button>
          </div>
        ) : (
          <>
            {tab === "profile" && (
              <ProfileForm
                profile={profile}
                formRef={formRef}
                session={session}
                onSubmit={onProfileSubmit}
              />
            )}

            {tab === "links" && (
              <LinksForm
                profile={profile}
                formRef={formRef}
                onSubmit={onLinksSubmit}
              />
            )}
            {tab === "experience" && (
              <ExperienceForm
                profile={profile}
                formRef={formRef}
                onSubmit={onExperienceSubmit}
              />
            )}
            {tab === "projects" && (
              <ProjectsForm
                profile={profile}
                formRef={formRef}
                onSubmit={onSubmitProjects}
              />
            )}
            {tab === "skills" && (
              <SkillsForm
                profile={profile}
                formRef={formRef}
                onSubmit={onSubmitSkills}
              />
            )}
            {tab === "blogs" && (
              <BlogsForm
                profile={profile}
                formRef={formRef}
                mode="EXTERNAL"
                onSubmit={(data) => onSubmitBlogs(data, "EXTERNAL")}
              />
            )}
            {tab === "articles" && (
              isSubLoading ? (
                <div className="flex flex-col items-center justify-center py-20 text-(--lf-muted)">
                  <Loader2 size={24} className="animate-spin mb-3 text-(--lf-ink)" />
                  <p className="text-[0.82rem]">Loading...</p>
                </div>
              ) : (
                <>
                  {subData?.isActive ? (
                    <SubscriptionBadge
                      subscription={subData.subscription}
                      planLabel={subData.planLabel}
                    />
                  ) : null}
                  <BlogsForm
                    profile={profile}
                    formRef={formRef}
                    mode="INTERNAL"
                    onSubmit={(data) => onSubmitBlogs(data, "INTERNAL")}
                    isSubscribed={subData?.isActive}
                    onSupportMe={() => setSupportMeOpen(true)}
                  />
                </>
              )
            )}
            {
              tab == "insights" && (
                <InsightsPage profile={profile} />
              )
            }
          </>
        )}
      </DashboardMain>

      <DashboardPreviewPanel>
        {loading ? (
          <TemplateRendererSkeleton />
        ) : (
          <TemplateRenderer
            slug={{ username: previewProfile?.username || username }}
            user={session?.user}
            profile={previewProfile}
            section={previewSection}
            onSectionChange={setPreviewSection}
            isInteractive={true}
          />
        )}
      </DashboardPreviewPanel>
    </>
  );
}
