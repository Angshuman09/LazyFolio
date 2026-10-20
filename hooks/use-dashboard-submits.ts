"use client";

import toast from "react-hot-toast";
import { useCreateLinks } from "@/hooks/links";
import { useCreateExperiences } from "@/hooks/experiences";
import { useCreateProjects } from "@/hooks/projects";
import { useCreateSkills } from "@/hooks/skills";
import { useCreateBlogs } from "@/hooks/blogs";
import { useUpdateUserProfile } from "@/hooks/profile";
import { detectType } from "@/lib/utils/links";
import { clearDashboardDraft } from "@/lib/cache/dashboard-drafts";
import {
  isBlankExperience,
  isBlankExternalBlog,
  isBlankInternalBlog,
  isBlankLink,
  isBlankProject,
  validateExperience,
  validateExternalBlog,
  validateInternalBlog,
  validateLink,
  validateProject,
} from "@/lib/utils/validate-dashboard";
import type { ProfileSchema } from "@/lib/schemas/profile";
import type { LinksSchema } from "@/lib/schemas/links";
import type { ExperienceSchema } from "@/lib/schemas/experience";
import type { ProjectsSchema } from "@/lib/schemas/projects";
import type { SkillsSchema } from "@/lib/schemas/skills";
import type { BlogsSchema } from "@/lib/schemas/blogs";

type SubmitsProfile = {
  id?: string;
  username?: string | null;
  name?: string | null;
  tagline?: string | null;
  quote?: string | null;
  email?: string | null;
  bio?: string | null;
  avatar?: string | null;
  banner?: string | null;
  bookAcall?: string | null;
  themeId?: string | null;
} | null;

type SubmitsSession = {
  user?: { id?: string; name?: string | null } | null;
} | null;

function getErrorMessage(error: unknown, fallbackMessage: string) {
  return error instanceof Error ? error.message : fallbackMessage;
}

/**
 * All dashboard section submit handlers in one place so the dashboard page
 * stays focused on layout and navigation. `setIsSaving` is owned by the page
 * because the template picker shares it with these handlers.
 */
export function useDashboardSubmits({
  profile,
  session,
  refetchSub,
  setIsSaving,
  onTemplateApplied,
}: {
  profile: SubmitsProfile;
  session: SubmitsSession;
  refetchSub: () => void;
  setIsSaving: (saving: boolean) => void;
  onTemplateApplied?: () => void;
}) {
  const updateProfile = useUpdateUserProfile();
  const updateLinks = useCreateLinks();
  const createExperience = useCreateExperiences();
  const createProjects = useCreateProjects();
  const createSkills = useCreateSkills();
  const createBlogs = useCreateBlogs();

  const applyTemplate = (templateId: string) => {
    if (!session?.user?.id || !profile?.username) {
      toast.error("Create your profile before choosing a template.");
      return;
    }

    setIsSaving(true);
    const toastId = toast.loading("Applying template...");
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
          toast.success("Template applied successfully!", { id: toastId });
          setIsSaving(false);
          onTemplateApplied?.();
        },
        onError: (error) => {
          toast.error(
            getErrorMessage(
              error,
              "Failed to apply template. Please try again.",
            ),
            { id: toastId },
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
    const toastId = toast.loading("Saving profile...");
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
          toast.success("Profile updated successfully!", { id: toastId });
          setIsSaving(false);
        },
        onError: (error) => {
          toast.error(
            getErrorMessage(
              error,
              "Failed to update profile. Please try again.",
            ),
            { id: toastId },
          );
          setIsSaving(false);
        },
      },
    );
  };

  const onLinksSubmit = async (data: LinksSchema) => {
    if (!profile?.id) {
      toast.error("Profile not loaded.");
      return;
    }

    setIsSaving(true);
    const toastId = toast.loading("Saving links...");
    const formattedLinks = (data.links || [])
      .map((link) => ({
        id: link.id,
        label: link.label?.trim() || "",
        url: link.url?.trim() || "",
        type: detectType(link.url || ""),
        isenable: link.isenable ?? true,
      }))
      .filter((link) => !isBlankLink(link));

    for (const link of formattedLinks) {
      const validation = validateLink(link);
      if (!validation.ok) {
        toast.error(validation.error, { id: toastId });
        setIsSaving(false);
        throw new Error(validation.error);
      }
    }

    try {
      await updateLinks.mutateAsync({
        profileId: profile.id,
        links: formattedLinks,
      });
      clearDashboardDraft("links", profile.id);
      toast.success("Links updated successfully!", { id: toastId });
    } catch (error) {
      toast.error(
        getErrorMessage(error, "Failed to update links. Please try again."),
        { id: toastId },
      );
    } finally {
      setIsSaving(false);
    }
  };

  const onExperienceSubmit = async (data: ExperienceSchema) => {
    setIsSaving(true);

    if (!profile?.id) {
      toast.error("Profile not loaded.");
      setIsSaving(false);
      return;
    }

    const toastId = toast.loading("Saving experience...");

    const formattedExperience = (data.experiences || [])
      .map((experience) => ({
        id: experience.id,
        role: experience.role?.trim() || "",
        companyName: experience.companyName?.trim() || "",
        startdate: experience.startdate?.trim() || "",
        enddate: experience.enddate?.trim() || "",
        description: experience.description?.trim() || "",
        isenable: experience.isenable ?? true,
      }))
      .filter((experience) => !isBlankExperience(experience));

    for (const experience of formattedExperience) {
      const validation = validateExperience(experience);
      if (!validation.ok) {
        toast.error(validation.error, { id: toastId });
        setIsSaving(false);
        throw new Error(validation.error);
      }
    }

    try {
      await createExperience.mutateAsync({
        profileId: profile.id,
        experiences: formattedExperience,
      });
      clearDashboardDraft("experience", profile.id);
      toast.success("Experience updated successfully!", { id: toastId });
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to update experience. Please try again."), { id: toastId });
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  const onSubmitProjects = async (data: ProjectsSchema) => {
    setIsSaving(true);

    if (!profile?.id) {
      toast.error("Profile not loaded.");
      setIsSaving(false);
      return;
    }

    const toastId = toast.loading("Saving projects...");

    const formattedProjects = (data.projects || [])
      .map((project) => ({
        id: project.id,
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
        isenable: project.isenable ?? true,
      }))
      .filter((project) => !isBlankProject(project));

    for (const project of formattedProjects) {
      const validation = validateProject(project);
      if (!validation.ok) {
        toast.error(validation.error, { id: toastId });
        setIsSaving(false);
        throw new Error(validation.error);
      }
    }

    try {
      await createProjects.mutateAsync({
        profileId: profile.id,
        projects: formattedProjects,
      });
      clearDashboardDraft("projects", profile.id);
      toast.success("Projects updated successfully!", { id: toastId });
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to update projects. Please try again."), { id: toastId });
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

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
        isenable: skill.isenable ?? true,
      }))
      .filter((skill) => skill.value);

    const toastId = toast.loading("Saving skills...");
    createSkills.mutate(
      {
        userId: profile.id,
        skills: formattedSkills,
      },
      {
        onSuccess: () => {
          toast.success("Skills updated successfully!", { id: toastId });
          setIsSaving(false);
        },
        onError: (error) => {
          toast.error(
            getErrorMessage(
              error,
              "Failed to update skills. Please try again.",
            ),
            { id: toastId },
          );
          setIsSaving(false);
        },
      },
    );
  };

  const onSubmitBlogs = async (data: BlogsSchema, type: "INTERNAL" | "EXTERNAL" = "EXTERNAL") => {
    if (!profile?.id) {
      toast.error("Profile not loaded.");
      return;
    }

    setIsSaving(true);
    const isArticleSection = type === "INTERNAL";
    const toastId = toast.loading(isArticleSection ? "Saving articles..." : "Saving blogs...");
    const formattedBlogs = (data.blogs || [])
      .map((blog) => ({
        id: blog.id,
        type,
        title: blog.title?.trim() || "",
        description: blog.description?.trim() || "",
        blogLink: blog.blogLink?.trim() || "",
        content: type === "INTERNAL" ? (blog.content ?? "") : null,
        isPublished: blog.isPublished ?? false,
        isEnabled: blog.isEnabled ?? true,
        slug: blog.slug,
      }))
      .filter((blog) =>
        isArticleSection ? !isBlankInternalBlog(blog) : !isBlankExternalBlog(blog),
      );

    for (const blog of formattedBlogs) {
      const validation = isArticleSection
        ? validateInternalBlog(blog)
        : validateExternalBlog(blog);

      if (!validation.ok) {
        toast.error(validation.error, { id: toastId });
        setIsSaving(false);
        throw new Error(validation.error);
      }
    }

    try {
      await createBlogs.mutateAsync({
        profileId: profile.id,
        type,
        blogs: formattedBlogs,
      });
      if (isArticleSection) {
        refetchSub();
      }
      clearDashboardDraft(isArticleSection ? "articles" : "blogs", profile.id);
      toast.success(isArticleSection ? "Articles updated successfully!" : "Blogs updated successfully!", { id: toastId });
    } catch (error) {
      toast.error(
        getErrorMessage(error, isArticleSection ? "Failed to update articles. Please try again." : "Failed to update blogs. Please try again."),
        { id: toastId },
      );
    } finally {
      setIsSaving(false);
    }
  };

  return {
    applyTemplate,
    onProfileSubmit,
    onLinksSubmit,
    onExperienceSubmit,
    onSubmitProjects,
    onSubmitSkills,
    onSubmitBlogs,
  };
}
