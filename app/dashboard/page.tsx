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
import Image from "next/image";
import { TemplateRenderer } from "@/components/portfolios/template-renderer";
import { UserAvatar } from "@/components/home-page/user-avatar";
import ProfileMenuOpen from "@/components/home-page/profile-menu-open";
import ProfileForm from "@/components/dashboard/profile-form";
import LinksForm from "@/components/dashboard/links-form";
import { detectType } from "@/lib/utils/links";
import ExperienceForm from "@/components/dashboard/experience-form";
import ProjectsForm from "@/components/dashboard/projects-form";
import SkillsForm from "@/components/dashboard/skills-form";
import BlogsForm from "@/components/dashboard/blogs-form";
import {
  DashboardSkeleton,
  TemplateRendererSkeleton,
} from "@/components/dashboard/dashboard-skeleton";
import toast from "react-hot-toast";
import { useCreateLinks } from "@/hooks/links";
import { TEMPLATES, NAV, Tab } from "@/components/resources/dummy-values";
import { LinksSchema } from "@/lib/schemas/links";
import { useCreateExperience } from "@/hooks/experience";
import { ProfileSchema } from "@/lib/schemas/profile";
import { ExperienceSchema } from "@/lib/schemas/experience";
import { useCreateSkills } from "@/hooks/skills";
import { SkillsSchema } from "@/lib/schemas/skills";
import { useCreateBlogs } from "@/hooks/blogs";
import { BlogsSchema } from "@/lib/schemas/blogs";
import { ProjectsSchema } from "@/lib/schemas/projects";
import { useCreateProjects } from "@/hooks/projects";
import { clearDashboardDraft } from "@/lib/cache/dashboard-drafts";

function getErrorMessage(error: unknown, fallbackMessage: string) {
  return error instanceof Error ? error.message : fallbackMessage;
}

export default function DashboardPage() {
  const [tab, setTab] = useState<Tab>("profile");
  const formRef = useRef<HTMLFormElement>(null);
  const [dark, setDark] = useState<boolean | null>(null);
  const [templateOpen, setTemplateOpen] = useState(false);
  const [activeTemplate, setActiveTemplate] = useState("1");
  const [copied, setCopied] = useState(false);
  const username = "angshuman09";
  const [profileMenuOpen, setProfileMenuOpen] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState(false);

  const { data: session, isPending } = authClient.useSession();
  const { data: profile, isLoading } = useGetUserProfile(session?.user?.id);
  const router = useRouter();
  const isSaveDisabled = isSaving || isLoading || isPending;

  useEffect(() => {
    if (!session && !isPending) {
      router.push("/auth");
  }
  }, [session, isPending, router]);

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
    navigator.clipboard?.writeText(`${process.env.NEXT_PUBLIC_SITE_URL as string}/${profile?.username || username}`).then(() => {
      toast.success("Profile link copied to clipboard!");
    }).catch(() => {
      toast.error("Failed to copy link. Please try manually copying: " + `/${profile?.username || username}`);
    });
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const updateProfile = useUpdateUserProfile();

  const applyTemplate = (templateId = activeTemplate) => {
    if (!session?.user?.id || !profile?.username) {
      toast.error("Create your profile before choosing a template.");
      return;
    }

    setIsSaving(true);
    updateProfile.mutate(
      {
        userId: session.user.id,
        name: profile.name || session.user.name || "",
        username: profile.username,
        tagline: profile.tagline || "",
        quote: profile.quote || "",
        email: profile.email || "",
        bio: profile.bio || "",
        avatar: profile.avatar,
        banner: profile.banner,
        bookAcall: profile.bookAcall || "",
        themeId: templateId,
      },
      {
        onSuccess: () => {
          toast.success("Template applied successfully!");
          setIsSaving(false);
          setTemplateOpen(false);
        },
        onError: (error) => {
          toast.error(
            getErrorMessage(
              error,
              "Failed to apply template. Please try again.",
            ),
          );
          setIsSaving(false);
        },
      },
    );
  };

  const onProfileSubmit = async (data: ProfileSchema) => {
    if (!session?.user?.id) {
      toast.error("You need to be signed in to update your profile.");
      return;
    }

    setIsSaving(true);
    updateProfile.mutate(
      {
        userId: session.user.id,
        name: data.name,
        username: data.username,
        tagline: data.tagline,
        quote: data?.quote,
        email: data.email,
        bio: data.bio,
        bookAcall: data.bookAcall,
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

  const onLinksSubmit = async (data: LinksSchema) => {
    if (!profile?.id) {
      toast.error("Profile not loaded.");
      return;
    }

    setIsSaving(true);
    const formattedLinks = (data.links || [])
      .map((link) => ({
        id: link.id,
        label: link.label?.trim() || "",
        url: link.url?.trim() || "",
        type: detectType(link.url || ""),
      }))
      .filter((link) => link.label || link.url);

    try {
      await updateLinks.mutateAsync({
        profileId: profile.id,
        links: formattedLinks,
      });
      clearDashboardDraft("links", profile.id);
      toast.success("Links updated successfully!");
    } catch (error) {
      toast.error(
        getErrorMessage(error, "Failed to update links. Please try again."),
      );
    } finally {
      setIsSaving(false);
    }
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

  const onSubmitBlogs = async (data: BlogsSchema) => {
    if (!profile?.id) {
      toast.error("Profile not loaded.");
      return;
    }

    setIsSaving(true);
    const formattedBlogs = (data.blogs || [])
      .map((blog) => ({
        title: blog.title?.trim() || "",
        description: blog.description?.trim() || "",
        blogLink: blog.blogLink?.trim() || "",
        enddate: blog.enddate?.trim() || "",
      }))
      .filter((blog) => Object.values(blog).some((value) => value.length > 0));

    try {
      await createBlogs.mutateAsync({
        profileId: profile.id,
        blogs: formattedBlogs,
      });
      clearDashboardDraft("blogs", profile.id);
      toast.success("Blogs updated successfully!");
    } catch (error) {
      toast.error(
        getErrorMessage(error, "Failed to update blogs. Please try again."),
      );
    } finally {
      setIsSaving(false);
    }
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
          disabled={!profile?.username}
            className="hidden disabled:cursor-not-allowed disabled:opacity-50 sm:inline-flex items-center gap-1.75 px-3.5 h-8.5 rounded-lg border border-(--lf-border) bg-(--lf-surface) text-(--lf-muted) text-[0.78rem] font-medium cursor-pointer hover:text-(--lf-ink) hover:border-(--lf-muted) transition-all duration-150 font-sans-body"
            onClick={() => {
              setActiveTemplate(profile?.themeId || "1");
              setTemplateOpen(true);
            }}
          >
            <Layers size={13} />
            Templates
            <span className="font-mono text-[0.65rem] text-(--lf-muted) opacity-75 px-1.5 py-px rounded bg-(--lf-border-alpha)">
              {TEMPLATES.find((t) => t.id === (profile?.themeId || activeTemplate))?.label}
            </span>
          </button>

          <button
            className="sm:hidden inline-flex items-center justify-center w-8 h-8 rounded-lg border border-(--lf-border) bg-(--lf-surface) text-(--lf-muted) cursor-pointer hover:text-(--lf-ink) transition-all duration-150"
            onClick={() => {
              setActiveTemplate(profile?.themeId || "1");
              setTemplateOpen(true);
            }}
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

          <button 
          disabled={!profile?.username}
    
          onClick={()=> window.open(`/${profile?.username || username}`, "_blank")}
          className="hidden disabled:cursor-not-allowed disabled:opacity-55 sm:inline-flex items-center gap-1.5 px-3 h-7.5 rounded-lg bg-transparent border border-(--lf-border) text-(--lf-muted) text-[0.75rem] font-medium cursor-pointer hover:text-(--lf-ink) hover:border-(--lf-muted) transition-all duration-150 font-sans-body whitespace-nowrap">
            <ExternalLink size={12} />
            Preview
          </button>

          <button
            type="submit"
            form="dashboard-form"
            disabled={isSaveDisabled || (!profile?.username && tab !== "profile")}
            className="inline-flex items-center gap-1.5 px-4 md:px-3.5 h-7.5 rounded-md bg-(--lf-ink) text-(--lf-bg) text-[0.78rem] font-semibold border-none transition-opacity duration-150 font-sans-body whitespace-nowrap disabled:opacity-55 disabled:cursor-not-allowed cursor-pointer hover:opacity-82"
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
            {NAV.map((n) => {
              const isDisabled = !profile?.username && n.id !== "profile";
              return (
              <button
                key={n.id}
                disabled={isDisabled}
                className={`flex items-center pl-4 gap-2.25 px-3 py-2 rounded-lg text-[0.82rem] font-medium text-(--lf-muted) cursor-pointer bg-transparent w-full text-left hover:text-(--lf-ink) hover:bg-(--lf-accent-soft) transition-all duration-150 font-sans-body tracking-tight ${
                  tab === n.id
                    ? "text-(--lf-ink) bg-(--lf-accent-soft) font-semibold"
                    : ""
                } ${isDisabled ? "opacity-50 cursor-not-allowed hover:bg-transparent hover:text-(--lf-muted)" : ""}`}
                onClick={() => {
                  if (isDisabled) return;
                  setTab(n.id);
                  setSidebarOpen(false);
                }}
              >
                {n.label}
              </button>
            )})}
          </div>

          <div className="h-px bg-(--lf-border-alpha) my-2.5 mx-1 shrink-0" />

          <div className="mt-auto shrink-0 border border-(--lf-border) rounded-[10px] p-3.5 bg-(--lf-surface)">
            <div className="text-[0.65rem] text-(--lf-muted) font-mono tracking-widest mb-1.5">
              Your portfolio link
            </div>
            <div className="text-[0.75rem] text-(--lf-ink) font-mono mb-2.5 break-all">
              lazyfolio/{profile?.username || "your-username"}
            </div>
            <button
              className="inline-flex disabled:cursor-not-allowed disabled:opacity-50 items-center gap-1.5 px-3 h-7.5 rounded-lg bg-transparent border border-(--lf-border) text-(--lf-muted) text-[0.75rem] font-medium cursor-pointer hover:text-(--lf-ink) hover:border-(--lf-muted) transition-all duration-150 font-sans-body whitespace-nowrap w-full justify-center"
              onClick={copyLink}
              disabled={!profile?.username}
            >
              {copied ? <Check size={11} /> : <Copy size={11} />}
              {copied ? "Copied!" : "Copy link"}
            </button>
          </div>
        </aside>

        <main className="flex-1 py-6 md:py-8 px-4 sm:px-6 md:px-10 overflow-y-auto h-full max-w-full md:max-w-215">
          {isLoading || isPending ? (
            <DashboardSkeleton />
          ) : !profile?.username && tab !== "profile" ? (
             <div className="flex flex-col items-center justify-center h-full text-center max-w-sm mx-auto">
               <div className="text-[1.2rem] font-serif-display text-(--lf-ink) mb-2">Username Required</div>
               <div className="text-[0.85rem] text-(--lf-muted)">Please set your username in the profile tab before adding other information.</div>
               <button onClick={() => setTab("profile")} className="mt-5 px-4 py-2 bg-(--lf-ink) text-(--lf-bg) rounded-xl text-[0.8rem] font-semibold cursor-pointer">Go to Profile</button>
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
                  onSubmit={onSubmitBlogs}
                />
              )}
            </>
          )}
        </main>

        <div className="hidden lg:flex flex-1 border-l border-(--lf-border-alpha) overflow-hidden h-full">
          <div className="w-full h-full overflow-y-auto overflow-x-hidden">
            {isLoading || isPending ? (
              <TemplateRendererSkeleton />
            ) : (
              <TemplateRenderer
                slug={{ username: profile?.username || username }}
                user={session?.user}
                profile={profile}
              />
            )}
          </div>
        </div>
      </div>

      {templateOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-sm transition-opacity duration-200"
          onClick={() => setTemplateOpen(false)}
        >
          <div
            className="bg-(--lf-bg) border border-(--lf-border) rounded-2xl w-full max-w-[95vw] xl:max-w-6xl shadow-2xl overflow-hidden p-4 sm:p-6 animate-in fade-in zoom-in duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="font-serif-display text-[1.25rem] font-medium text-(--lf-ink) mb-1.5 leading-tight">
              Choose a template
            </h2>
            <p className="text-[0.82rem] text-(--lf-muted) mb-6 leading-relaxed">
              Pick how your public portfolio page looks. You can change this
              anytime.
            </p>

            <div className="grid grid-flow-col auto-cols-[minmax(260px,1fr)] gap-3 overflow-x-auto pb-2">
              {TEMPLATES.map((t) => (
                <button
                  type="button"
                  key={t.id}
                  disabled={isSaveDisabled}
                  className={`flex min-h-72 flex-col items-start gap-3 p-3 rounded-xl border text-left transition-all duration-150 disabled:cursor-not-allowed disabled:opacity-60 ${activeTemplate === t.id ? "border-(--lf-ink) bg-(--lf-accent-soft)" : "border-(--lf-border) bg-(--lf-surface) hover:border-(--lf-muted)"}`}
                  onClick={() => {
                    setActiveTemplate(t.id);
                    setTemplateOpen(false);
                    applyTemplate(t.id);
                  }}
                >
                  <div className="relative w-full aspect-[4/3] overflow-hidden rounded-lg border border-(--lf-border-alpha) bg-(--lf-border-alpha)">
                    <Image
                      src={t.image}
                      alt={`${t.label} template preview`}
                      fill
                      sizes="(max-width: 640px) 260px, 320px"
                      className="object-cover object-top"
                    />
                    <div
                      className={`absolute left-2 top-2 w-8 h-8 rounded-lg flex items-center justify-center shadow-sm ${activeTemplate === t.id ? "bg-(--lf-ink) text-(--lf-bg)" : "bg-(--lf-bg)/90 text-(--lf-muted) border border-(--lf-border-alpha)"}`}
                    >
                      {activeTemplate === t.id ? (
                        <Check size={15} />
                      ) : (
                        <span className="text-[0.72rem] font-mono font-semibold">
                          {t.emoji}
                        </span>
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="text-[0.88rem] font-semibold text-(--lf-ink)">
                      {t.label}
                    </div>
                    <div className="text-[0.74rem] text-(--lf-muted) mt-0.5">
                      {t.preview}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="flex items-center justify-end gap-2.5 mt-7">
              <button
                className="inline-flex items-center gap-1.5 px-4 h-9 rounded-lg bg-transparent border border-(--lf-border) text-(--lf-muted) text-[0.8rem] font-medium cursor-pointer hover:text-(--lf-ink) hover:border-(--lf-muted) transition-all duration-150 font-sans whitespace-nowrap"
                onClick={() => setTemplateOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
