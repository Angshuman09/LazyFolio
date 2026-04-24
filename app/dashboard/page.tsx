"use client";

import { useState, useEffect, useRef } from "react";
import {
  Sun,
  Moon,
  ExternalLink,
  Copy,
  Check,
  ChevronRight,
  Layers,
  BarChart3,
} from "lucide-react";
import { signOut, authClient } from "@/lib/auth-client";
import { useGetUserProfile, useUpdateUserProfile } from "@/hooks/profile";

import { useRouter } from "next/navigation";
import { TemplateRenderer } from "@/components/portfolios/template-renderer";
import { UserAvatar } from "@/components/home-page/user-avatar";
import ProfileMenuOpen from "@/components/home-page/profile-menu-open";
import ProfileForm from "@/components/dashboard/profile-form";
import LinksForm, { detectType } from "@/components/dashboard/links-form";
import ExperienceForm from "@/components/dashboard/experience-form";
import ProjectsForm from "@/components/dashboard/projects-form";
import SkillsForm from "@/components/dashboard/skills-form";
import BlogsForm from "@/components/dashboard/blogs-form";
import toast from "react-hot-toast";
import { useCreateLinks } from "@/hooks/links";
import { TEMPLATES, NAV, Tab } from "@/components/resources/dummy-values";
import { LinksSchema } from "@/schemas/links";
import { useCreateExperience } from "@/hooks/experience";
import { ProfileSchema } from "@/schemas/profile";
import { ExperienceSchema } from "@/schemas/experience";
import { useCreateSkills } from "@/hooks/skills";
import { SkillsSchema } from "@/schemas/skills";
import { useCreateBlogs } from "@/hooks/blogs";
import { BlogsSchema } from "@/schemas/blogs";
import { ProjectsSchema } from "@/schemas/projects";
import { useCreateProjects } from "@/hooks/projects";

function getErrorMessage(error: unknown, fallbackMessage: string) {
  return error instanceof Error ? error.message : fallbackMessage;
}

export default function DashboardPage() {
  const [tab, setTab] = useState<Tab>("profile");
  const formRef = useRef<HTMLFormElement>(null);
  const [dark, setDark] = useState<boolean | null>(null);
  const [templateOpen, setTemplateOpen] = useState(false);
  const [activeTemplate, setActiveTemplate] = useState("minimal");
  const [copied, setCopied] = useState(false);
  const username = "angshuman09";
  const [profileMenuOpen, setProfileMenuOpen] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState(false);

  const { data: session, isPending } = authClient.useSession();
  const { data: profile, isLoading } = useGetUserProfile(session?.user?.id);
  const router = useRouter();
  const isSaveDisabled = isSaving || isLoading || isPending;

  useEffect(() => {
    const savedTheme = localStorage.getItem("lf-theme");
    const shouldUseDark =
      savedTheme === "dark" ||
      document.documentElement.classList.contains("dark");

    const frameId = window.requestAnimationFrame(() => {
      setDark(shouldUseDark);
    });

    return () => window.cancelAnimationFrame(frameId);
  }, []);

  useEffect(() => {
    if (dark === null) return;

    const root = document.documentElement;
    if (dark) {
      root.classList.add("dark");
      localStorage.setItem("lf-theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("lf-theme", "light");
    }
  }, [dark]);

  const copyLink = () => {
    navigator.clipboard?.writeText(`lazyfolio.com/${username}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Image upload failed");
    }

    const data: { url: string } = await response.json();
    return data.url;
  };
  const updateProfile = useUpdateUserProfile();

  const onProfileSubmit = async (data: ProfileSchema) => {
    setIsSaving(true);
    const avatarFile =
      data.avatar instanceof FileList ? data.avatar[0] : data.avatar;

    const bannerFile =
      data.banner instanceof FileList ? data.banner[0] : data.banner;
    const [avatarUrl, bannerUrl] = await Promise.all([
      avatarFile instanceof File ? uploadImage(avatarFile) : undefined,
      bannerFile instanceof File ? uploadImage(bannerFile) : undefined,
    ]);

    console.log("Avatar URL:", avatarUrl);
    console.log("Banner URL:", bannerUrl);

    updateProfile.mutate(
      {
        userId: session?.user?.id || undefined,
        name: data.name,
        username: data.username,
        tagline: data.tagline,
        location: data.location,
        quote: data?.quote,
        email: data.email,
        bio: data.bio,
        avatar: avatarUrl,
        banner: bannerUrl,
      },
      {
        onSuccess: () => {
          toast.success("Profile updated successfully!");
          setIsSaving(false);
        },
        onError: (error) => {
          toast.error(
            getErrorMessage(
              error,
              "Failed to update profile. Please try again.",
            ),
          );
          setIsSaving(false);
        },
      },
    );
  };

  const updateLinks = useCreateLinks();

  const onLinksSubmit = (data: LinksSchema) => {
    setIsSaving(true);

    if (!profile?.id) {
      toast.error("Profile not loaded.");
      setIsSaving(false);
      return;
    }

    const formattedLinks = (data.links || [])
      .map((link) => ({
        label: link.label?.trim() || "",
        url: link.url?.trim() || "",
        type: detectType(link.url || ""),
      }))
      .filter((link) => link.label || link.url);

    updateLinks.mutate(
      {
        profileId: profile.id,
        links: formattedLinks,
      },
      {
        onSuccess: () => {
          toast.success("Links updated successfully!");
          setIsSaving(false);
        },
        onError: (error) => {
          toast.error(
            getErrorMessage(error, "Failed to update links. Please try again."),
          );
          setIsSaving(false);
        },
      },
    );
  };

  const createExperience = useCreateExperience();

  const onExperienceSubmit = (data: ExperienceSchema) => {
    setIsSaving(true);

    if (!profile?.id) {
      toast.error("Profile not loaded.");
      setIsSaving(false);
      return;
    }

    const formattedExperience = (data.experiences || [])
      .map((experience) => ({
        role: experience.role?.trim() || "",
        companyName: experience.companyName?.trim() || "",
        startdate: experience.startdate?.trim() || "",
        enddate: experience.enddate?.trim() || "",
        description: experience.description?.trim() || "",
      }))
      .filter((experience) =>
        Object.values(experience).some((value) => value.length > 0),
      );

    createExperience.mutate(
      {
        profileId: profile.id,
        experiences: formattedExperience,
      },
      {
        onSuccess: () => {
          toast.success("Experience updated successfully!");
          setIsSaving(false);
        },
        onError: (error) => {
          toast.error(
            getErrorMessage(
              error,
              "Failed to update experience. Please try again.",
            ),
          );
          setIsSaving(false);
        },
      },
    );
  };

  const createProjects = useCreateProjects();

  const onSubmitProjects = (data: ProjectsSchema) => {
    setIsSaving(true);

    if (!profile?.id) {
      toast.error("Profile not loaded.");
      setIsSaving(false);
      return;
    }

    const formattedProjects = (data.projects || [])
      .map((project) => ({
        title: project.title?.trim() || "",
        description: project.description?.trim() || "",
        projectLink: project.projectLink?.trim() || "",
        githubLink: project.githubLink?.trim() || "",
        techstack:
          project.techstack
            ?.split(",")
            .map((item) => item.trim())
            .filter(Boolean) || [],
        enddate: project.enddate?.trim() || "",
      }))
      .filter(
        (project) =>
          project.title ||
          project.description ||
          project.projectLink ||
          project.githubLink ||
          project.techstack.length > 0 ||
          project.enddate,
      );

    createProjects.mutate(
      {
        profileId: profile.id,
        projects: formattedProjects,
      },
      {
        onSuccess: () => {
          toast.success("Projects updated successfully!");
          setIsSaving(false);
        },
        onError: (error) => {
          toast.error(
            getErrorMessage(
              error,
              "Failed to update projects. Please try again.",
            ),
          );
          setIsSaving(false);
        },
      },
    );
  };

  const createSkills = useCreateSkills();

  const onSubmitSkills = (data: SkillsSchema) => {
    setIsSaving(true);

    if (!profile?.id) {
      toast.error("Profile not loaded.");
      setIsSaving(false);
      return;
    }

    const formattedSkills = (data.skills || [])
      .map((skill) => ({
        value: skill.value?.trim() || "",
      }))
      .filter((skill) => skill.value);

    createSkills.mutate(
      {
        userId: profile.id,
        skills: formattedSkills,
      },
      {
        onSuccess: () => {
          toast.success("Skills updated successfully!");
          setIsSaving(false);
        },
        onError: (error) => {
          toast.error(
            getErrorMessage(
              error,
              "Failed to update skills. Please try again.",
            ),
          );
          setIsSaving(false);
        },
      },
    );
  };

  const createBlogs = useCreateBlogs();

  const onSubmitBlogs = (data: BlogsSchema) => {
    setIsSaving(true);

    if (!profile?.id) {
      toast.error("Profile not loaded.");
      setIsSaving(false);
      return;
    }

    const formattedBlogs = (data.blogs || [])
      .map((blog) => ({
        title: blog.title?.trim() || "",
        description: blog.description?.trim() || "",
        blogLink: blog.blogLink?.trim() || "",
        enddate: blog.enddate?.trim() || "",
      }))
      .filter((blog) => Object.values(blog).some((value) => value.length > 0));

    createBlogs.mutate(
      {
        profileId: profile.id,
        blogs: formattedBlogs,
      },
      {
        onSuccess: () => {
          toast.success("Blogs updated successfully!");
          setIsSaving(false);
        },
        onError: (error) => {
          toast.error(
            getErrorMessage(error, "Failed to update blogs. Please try again."),
          );
          setIsSaving(false);
        },
      },
    );
  };

  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-screen flex flex-col bg-(--lf-bg) text-(--lf-ink) font-sans-body transition-colors duration-200">
      <header className="sticky top-0 z-40 h-13 flex items-center justify-between px-4 md:px-6 bg-(--lf-bg)/88 backdrop-blur-lg border-b border-(--lf-border-alpha) transition-colors duration-200">
        <div className="flex items-center gap-2">
          <button
            className="md:hidden inline-flex items-center justify-center w-8 h-8 rounded-lg border border-(--lf-border) bg-(--lf-surface) text-(--lf-muted) cursor-pointer hover:text-(--lf-ink) transition-all duration-150"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle sidebar"
          >
            <BarChart3 size={14} />
          </button>
          <span
            onClick={() => router.push("/")}
            className="font-serif-display text-[1.15rem] font-normal tracking-tight text-(--lf-ink) select-none cursor-pointer"
          >
            Lazyfolio
          </span>
          <div className="hidden sm:flex items-center gap-1.25 text-[0.75rem] text-(--lf-muted) ml-1">
            <ChevronRight size={11} className="opacity-35" />
            <span className="text-(--lf-ink) font-medium">
              {NAV.find((n) => n.id === tab)?.label}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 md:gap-2">
          <button
            className="hidden sm:inline-flex items-center gap-1.75 px-3.5 h-8.5 rounded-lg border border-(--lf-border) bg-(--lf-surface) text-(--lf-muted) text-[0.78rem] font-medium cursor-pointer hover:text-(--lf-ink) hover:border-(--lf-muted) transition-all duration-150 font-sans-body"
            onClick={() => setTemplateOpen(true)}
          >
            <Layers size={13} />
            Templates
            <span className="font-mono text-[0.65rem] text-(--lf-muted) opacity-75 px-1.5 py-px rounded bg-(--lf-border-alpha)">
              {TEMPLATES.find((t) => t.id === activeTemplate)?.label}
            </span>
          </button>

          <button
            className="sm:hidden inline-flex items-center justify-center w-8 h-8 rounded-lg border border-(--lf-border) bg-(--lf-surface) text-(--lf-muted) cursor-pointer hover:text-(--lf-ink) transition-all duration-150"
            onClick={() => setTemplateOpen(true)}
            aria-label="Templates"
          >
            <Layers size={13} />
          </button>

          <button
            className="inline-flex items-center justify-center w-8.5 h-8.5 rounded-lg border border-(--lf-border) bg-(--lf-surface) text-(--lf-muted) cursor-pointer hover:text-(--lf-ink) hover:border-(--lf-muted) transition-all duration-150"
            onClick={() => setDark((current) => !current)}
            aria-label="Toggle theme"
          >
            {dark ? <Sun size={14} /> : <Moon size={14} />}
          </button>

          <button className="hidden sm:inline-flex items-center gap-1.5 px-3 h-7.5 rounded-lg bg-transparent border border-(--lf-border) text-(--lf-muted) text-[0.75rem] font-medium cursor-pointer hover:text-(--lf-ink) hover:border-(--lf-muted) transition-all duration-150 font-sans-body whitespace-nowrap">
            <ExternalLink size={12} />
            Preview
          </button>

          <button
            type="submit"
            form="dashboard-form"
            disabled={isSaveDisabled}
            className="inline-flex items-center gap-1.5 px-3 md:px-4.5 h-8.5 rounded-xl bg-(--lf-ink) text-(--lf-bg) text-[0.78rem] font-semibold border-none transition-opacity duration-150 font-sans-body whitespace-nowrap disabled:opacity-55 disabled:cursor-not-allowed cursor-pointer hover:opacity-82"
          >
            {isSaving ? (
              <>
                <svg
                  className="animate-spin"
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                >
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                </svg>
                <span className="hidden sm:inline">Saving…</span>
                <span className="sm:hidden">Saving</span>
              </>
            ) : (
              <>
                <span className="hidden sm:inline">Save changes</span>
                <span className="sm:hidden">Save</span>
              </>
            )}
          </button>

          {!isPending && (
            <button onClick={() => setProfileMenuOpen(true)}>
              <UserAvatar user={session?.user} />
            </button>
          )}

          {profileMenuOpen && (
            <ProfileMenuOpen
              session={session}
              setProfileMenuOpen={setProfileMenuOpen}
              signOut={signOut}
              router={router}
            />
          )}
        </div>
      </header>

      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 z-30 bg-black/30 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex flex-1 overflow-hidden min-h-0">
        <aside
          className={`${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 fixed md:static z-40 md:z-auto w-52 md:w-50 shrink-0 border-r border-(--lf-border-alpha) p-[16px_10px_20px] flex flex-col gap-0.5 top-13 md:top-0 h-[calc(100vh-52px)] bg-(--lf-bg) transition-transform duration-200`}
        >
          <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-0.5">
            {NAV.map((n) => (
              <button
                key={n.id}
                className={`flex items-center gap-[9px] px-3 py-2 rounded-lg text-[0.82rem] font-medium text-(--lf-muted) cursor-pointer bg-transparent w-full text-left hover:text-(--lf-ink) hover:bg-(--lf-accent-soft) transition-all duration-150 font-sans-body tracking-tight ${
                  tab === n.id
                    ? "text-(--lf-ink) bg-(--lf-accent-soft) font-semibold"
                    : ""
                }`}
                onClick={() => {
                  setTab(n.id);
                  setSidebarOpen(false);
                }}
              >
                <span className={tab === n.id ? "opacity-100" : "opacity-65"}>
                  {n.icon}
                </span>
                {n.label}
              </button>
            ))}
          </div>

          <div className="h-px bg-(--lf-border-alpha) my-2.5 mx-1 shrink-0" />

          <div className="mt-auto shrink-0 border border-(--lf-border) rounded-[10px] p-3.5 bg-(--lf-surface)">
            <div className="text-[0.65rem] text-(--lf-muted) font-mono uppercase tracking-widest mb-1.5">
              Your portfolio
            </div>
            <div className="text-[0.75rem] text-(--lf-ink) font-mono mb-2.5 break-all">
              lazyfolio/{username}
            </div>
            <button
              className="inline-flex items-center gap-1.5 px-3 h-[30px] rounded-lg bg-transparent border border-(--lf-border) text-(--lf-muted) text-[0.75rem] font-medium cursor-pointer hover:text-(--lf-ink) hover:border-(--lf-muted) transition-all duration-150 font-sans-body whitespace-nowrap w-full justify-center"
              onClick={copyLink}
            >
              {copied ? <Check size={11} /> : <Copy size={11} />}
              {copied ? "Copied!" : "Copy link"}
            </button>
          </div>
        </aside>

        <main className="flex-1 py-6 md:py-8 px-4 sm:px-6 md:px-10 overflow-y-auto h-full max-w-full md:max-w-215">
          {tab === "profile" && (
            <ProfileForm
              profile={profile}
              formRef={formRef}
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
              onSubmit={onSubmitBlogs}
            />
          )}
        </main>

        <div className="hidden lg:flex flex-1 border-l border-(--lf-border-alpha) overflow-hidden h-full">
          <div className="w-full h-full overflow-y-auto overflow-x-hidden">
            <TemplateRenderer
              slug={{ username: profile?.username || username }}
              user={session?.user}
              profile={profile}
            />
          </div>
        </div>
      </div>

      {templateOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-sm transition-opacity duration-200"
          onClick={() => setTemplateOpen(false)}
        >
          <div
            className="bg-(--lf-bg) border border-(--lf-border) rounded-2xl w-full max-w-[95vw] sm:max-w-105 shadow-2xl overflow-hidden p-4 sm:p-6 animate-in fade-in zoom-in duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="font-serif-display text-[1.25rem] font-medium text-(--lf-ink) mb-1.5 leading-tight">
              Choose a template
            </h2>
            <p className="text-[0.82rem] text-(--lf-muted) mb-6 leading-relaxed">
              Pick how your public portfolio page looks. You can change this
              anytime.
            </p>

            <div className="flex flex-col gap-2.5">
              {TEMPLATES.map((t) => (
                <div
                  key={t.id}
                  className={`flex items-center gap-4 p-4 rounded-xl border transition-all duration-150 cursor-pointer ${activeTemplate === t.id ? "border-(--lf-ink) bg-(--lf-accent-soft)" : "border-(--lf-border) bg-(--lf-surface) hover:border-(--lf-muted)"}`}
                  onClick={() => setActiveTemplate(t.id)}
                >
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${activeTemplate === t.id ? "bg-(--lf-ink) text-(--lf-bg)" : "bg-(--lf-border) text-(--lf-muted)"}`}
                  >
                    {activeTemplate === t.id ? (
                      <Check size={16} />
                    ) : (
                      <span className="text-[1.1rem]">{t.emoji}</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="text-[0.88rem] font-semibold text-(--lf-ink)">
                      {t.label}
                    </div>
                    <div className="text-[0.74rem] text-(--lf-muted) mt-0.5">
                      {t.preview}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-end gap-2.5 mt-7">
              <button
                className="inline-flex items-center gap-1.5 px-4 h-9 rounded-lg bg-transparent border border-(--lf-border) text-(--lf-muted) text-[0.8rem] font-medium cursor-pointer hover:text-(--lf-ink) hover:border-(--lf-muted) transition-all duration-150 font-sans whitespace-nowrap"
                onClick={() => setTemplateOpen(false)}
              >
                Cancel
              </button>
              <button
                className="inline-flex items-center gap-2 px-5 h-9 rounded-[20px] bg-(--lf-ink) text-(--lf-bg) text-[0.82rem] font-bold border-none cursor-pointer hover:opacity-82 transition-opacity duration-150 font-sans whitespace-nowrap"
                onClick={() => setTemplateOpen(false)}
              >
                <Check size={12} strokeWidth={3} />
                Apply template
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
