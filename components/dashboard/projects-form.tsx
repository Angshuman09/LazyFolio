"use client";

import { RefObject, useState, useEffect, useMemo } from "react";
import {
  useFieldArray,
  useForm,
  useWatch,
  type Control,
  type FieldArrayWithId,
  type FieldErrors,
  type UseFieldArrayRemove,
  type UseFieldArrayInsert,
  type UseFormGetValues,
  type UseFormRegister,
  type UseFormSetValue,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2, Pencil, Check, Code2, Github, ExternalLink, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { projectsSchema, ProjectsSchema } from "@/lib/schemas/projects";
import { useCreateProject, useDeleteProject } from "@/hooks/project";
import { readDashboardDraft, writeDashboardDraft } from "@/lib/cache/dashboard-drafts";
import { hasFieldArrayErrors } from "@/lib/utils";

type ProfileProject = {
  id?: string | null;
  title?: string | null;
  description?: string | null;
  githubLink?: string | null;
  projectLink?: string | null;
  techstack?: string[] | null;
  enddate?: string | Date | null;
};

type Props = {
  profile?: {
    id?: string;
    projects?: ProfileProject[];
  };
  formRef: RefObject<HTMLFormElement | null>;
  onSubmit?: (data: ProjectsSchema) => void;
};

function projectsFromProfile(projects: ProfileProject[] = []): ProjectsSchema {
  return {
    projects: projects.map((p) => ({
      id: p.id ?? "",
      title: p.title ?? "",
      description: p.description ?? "",
      githubLink: p.githubLink ?? "",
      projectLink: p.projectLink ?? "",
      techstack: Array.isArray(p.techstack) ? p.techstack.join(", ") : "",
      enddate: p.enddate ? String(p.enddate) : "",
    })),
  };
}

function getInitialProjects(profile?: { id?: string; projects?: ProfileProject[] }): ProjectsSchema {
  return (
    readDashboardDraft<ProjectsSchema>("projects", profile?.id) ||
    projectsFromProfile(profile?.projects || [])
  );
}

function ProjectCard({
  field,
  index,
  control,
  register,
  errors,
  remove,
  insert,
  setValue,
  getValues,
  profile,
}: {
  field: FieldArrayWithId<ProjectsSchema, "projects", "projectfield">;
  index: number;
  control: Control<ProjectsSchema>;
  register: UseFormRegister<ProjectsSchema>;
  errors: FieldErrors<ProjectsSchema>;
  remove: UseFieldArrayRemove;
  insert: UseFieldArrayInsert<ProjectsSchema, "projects">;
  setValue: UseFormSetValue<ProjectsSchema>;
  getValues: UseFormGetValues<ProjectsSchema>;
  profile?: { id?: string; projects?: ProfileProject[] };
}) {
  const [isEditing, setIsEditing] = useState(
    () => !(field?.title || field?.projectLink || field?.githubLink),
  );

  const createProject = useCreateProject();
  const deleteProject = useDeleteProject();

  const [savedSnapshot, setSavedSnapshot] = useState<{
    id?: string;
    title: string;
    description: string;
    githubLink: string;
    projectLink: string;
    techstack: string;
    enddate: string;
  } | null>(() => {
    if (!field.id) {
      return null;
    }

    const profileProject = profile?.projects?.find((p) => p.id === field.id);

    return {
      id: field.id,
      title: profileProject?.title || field.title || "",
      description: profileProject?.description || field.description || "",
      githubLink: profileProject?.githubLink || field.githubLink || "",
      projectLink: profileProject?.projectLink || field.projectLink || "",
      techstack: Array.isArray(profileProject?.techstack)
        ? profileProject.techstack.join(", ")
        : (field.techstack || ""),
      enddate: profileProject?.enddate ? String(profileProject.enddate) : (field.enddate || ""),
    };
  });

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const values = useWatch({ control, name: `projects.${index}` });
  const hasErrors = hasFieldArrayErrors(errors, "projects", index);

  useEffect(() => {
    if (hasErrors) {
      setIsEditing(true);
    }
  }, [hasErrors]);

  const normalizedValues = {
    id: values?.id,
    title: values?.title || "",
    description: values?.description || "",
    githubLink: values?.githubLink || "",
    projectLink: values?.projectLink || "",
    techstack: values?.techstack || "",
    enddate: values?.enddate || "",
  };

  const hasUnsavedChanges =
    !savedSnapshot ||
    normalizedValues.id !== savedSnapshot.id ||
    normalizedValues.title !== savedSnapshot.title ||
    normalizedValues.description !== savedSnapshot.description ||
    normalizedValues.githubLink !== savedSnapshot.githubLink ||
    normalizedValues.projectLink !== savedSnapshot.projectLink ||
    normalizedValues.techstack !== savedSnapshot.techstack ||
    normalizedValues.enddate !== savedSnapshot.enddate;

  const updateProjectsDraft = (projects: ProjectsSchema["projects"]) => {
    if (profile?.id) {
      writeDashboardDraft("projects", profile.id, { projects: projects || [] });
    }
  };

  const onSaveProject = async () => {
    if (!profile?.id) {
      toast.error("Profile not loaded.");
      return;
    }

    if (!normalizedValues.title) {
      toast.error("Please add a title before saving this project.");
      return;
    }

    setSaving(true);
    try {
      const payload = await createProject.mutateAsync({
        project: {
          id: normalizedValues.id || undefined,
          title: normalizedValues.title,
          description: normalizedValues.description,
          githubLink: normalizedValues.githubLink,
          projectLink: normalizedValues.projectLink,
          techstack: normalizedValues.techstack,
          enddate: normalizedValues.enddate,
        },
        profileId: profile.id,
      });

      const savedProject = {
        id: payload?.data?.id || normalizedValues.id,
        title: payload?.data?.title || normalizedValues.title,
        description: payload?.data?.description || normalizedValues.description,
        githubLink: payload?.data?.githubLink || normalizedValues.githubLink,
        projectLink: payload?.data?.projectLink || normalizedValues.projectLink,
        techstack: Array.isArray(payload?.data?.techstack)
          ? payload.data.techstack.join(", ")
          : normalizedValues.techstack,
        enddate: payload?.data?.enddate ? String(payload.data.enddate) : normalizedValues.enddate,
      };

      setValue(`projects.${index}.id`, savedProject.id, { shouldDirty: false });
      setValue(`projects.${index}.title`, savedProject.title, { shouldDirty: false });
      setValue(`projects.${index}.description`, savedProject.description, { shouldDirty: false });
      setValue(`projects.${index}.githubLink`, savedProject.githubLink, { shouldDirty: false });
      setValue(`projects.${index}.projectLink`, savedProject.projectLink, { shouldDirty: false });
      setValue(`projects.${index}.techstack`, savedProject.techstack, { shouldDirty: false });
      setValue(`projects.${index}.enddate`, savedProject.enddate, { shouldDirty: false });

      const currentProjects = getValues("projects") || [];
      updateProjectsDraft(
        currentProjects.map((p, i) =>
          i === index ? { ...p, ...savedProject } : p,
        ),
      );
      setSavedSnapshot(savedProject);
      setIsEditing(false);
      toast.success("Project saved successfully!");
    } catch (error) {
      console.error("Error saving project:", error);
      toast.error("An error occurred while saving the project.");
    } finally {
      setSaving(false);
    }
  };

  const onDeleteProject = async () => {
    const currentProjects = getValues("projects") || [];
    const deletedProject = currentProjects[index];
    const nextProjects = currentProjects.filter((_, i) => i !== index);

    if (!normalizedValues.id) {
      remove(index);
      updateProjectsDraft(nextProjects);
      return;
    }

    remove(index);
    updateProjectsDraft(nextProjects);
    setDeleting(true);
    try {
      await deleteProject.mutateAsync(normalizedValues.id);
      toast.success("Project deleted successfully!");
    } catch (error) {
      if (deletedProject) {
        insert(index, deletedProject);
        updateProjectsDraft(currentProjects);
      }
      console.error("Error deleting project:", error);
      toast.error("An error occurred while deleting the project.");
    } finally {
      setDeleting(false);
    }
  };

  const onCancelEditing = () => {
    if (!savedSnapshot) {
      const currentProjects = getValues("projects") || [];
      updateProjectsDraft(currentProjects.filter((_, i) => i !== index));
      remove(index);
      return;
    }

    setValue(`projects.${index}.id`, savedSnapshot.id, { shouldDirty: false });
    setValue(`projects.${index}.title`, savedSnapshot.title, { shouldDirty: false });
    setValue(`projects.${index}.description`, savedSnapshot.description, { shouldDirty: false });
    setValue(`projects.${index}.githubLink`, savedSnapshot.githubLink, { shouldDirty: false });
    setValue(`projects.${index}.projectLink`, savedSnapshot.projectLink, { shouldDirty: false });
    setValue(`projects.${index}.techstack`, savedSnapshot.techstack, { shouldDirty: false });
    setValue(`projects.${index}.enddate`, savedSnapshot.enddate, { shouldDirty: false });

    const currentProjects = getValues("projects") || [];
    updateProjectsDraft(
      currentProjects.map((p, i) =>
        i === index ? { ...p, ...savedSnapshot } : p,
      ),
    );
    setIsEditing(false);
  };

  const onDoneEditing = () => {
    if (!normalizedValues.title) {
      toast.error("Please add a title before completing this project card.");
      return;
    }

    setValue(`projects.${index}.title`, normalizedValues.title, { shouldDirty: true });
    setValue(`projects.${index}.description`, normalizedValues.description, { shouldDirty: true });
    setValue(`projects.${index}.githubLink`, normalizedValues.githubLink, { shouldDirty: true });
    setValue(`projects.${index}.projectLink`, normalizedValues.projectLink, { shouldDirty: true });
    setValue(`projects.${index}.techstack`, normalizedValues.techstack, { shouldDirty: true });
    setValue(`projects.${index}.enddate`, normalizedValues.enddate, { shouldDirty: true });
    setIsEditing(false);
  };

  if (!isEditing) {
    const techList = values?.techstack
      ? String(values.techstack).split(",").map((t: string) => t.trim()).filter(Boolean)
      : [];

    return (
      <div className="group flex items-start justify-between gap-3 border border-(--lf-border) rounded-xl px-4 py-3.5 bg-(--lf-surface) mb-2.5 transition-colors duration-150 hover:border-(--lf-muted)">
        <div className="flex items-start gap-3 min-w-0 flex-1">
          <div className="w-7 h-7 rounded-lg bg-(--lf-border) flex items-center justify-center shrink-0 mt-0.5">
            <Code2 size={12} className="text-(--lf-muted)" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[0.82rem] font-medium text-(--lf-ink) font-sans">
              {values?.title || <span className="text-(--lf-muted) italic">Untitled Project</span>}
            </div>
            {values?.description && (
              <div className="text-[0.72rem] text-(--lf-muted) mt-0.5 line-clamp-2 leading-relaxed">
                {values.description}
              </div>
            )}
            <div className="flex items-center gap-2.5 mt-1.5 flex-wrap">
              {values?.githubLink && (
                <span className="inline-flex items-center gap-1 text-[0.68rem] text-(--lf-muted) font-mono">
                  <Github size={10} />
                  GitHub
                </span>
              )}
              {values?.projectLink && (
                <span className="inline-flex items-center gap-1 text-[0.68rem] text-(--lf-muted) font-mono">
                  <ExternalLink size={10} />
                  Live
                </span>
              )}
              {techList.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {techList.slice(0, 4).map((t: string, i: number) => (
                    <span
                      key={i}
                      className="px-1.5 py-px rounded-md bg-(--lf-border) text-(--lf-muted) text-[0.65rem] font-mono"
                    >
                      {t}
                    </span>
                  ))}
                  {techList.length > 4 && (
                    <span className="px-1.5 py-px rounded-md bg-(--lf-border) text-(--lf-muted) text-[0.65rem] font-mono">
                      +{techList.length - 4}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={onDeleteProject}
            disabled={deleting || saving}
            className="inline-flex items-center justify-center w-[28px] h-[28px] rounded-lg border border-transparent text-(--lf-muted) cursor-pointer hover:text-[#b91c1c] hover:bg-[#b91c1c]/5 hover:border-[#b91c1c]/15 dark:hover:text-[#f87171] dark:hover:bg-[#f87171]/8 dark:hover:border-[#f87171]/20 transition-all duration-150"
            aria-label="Remove project"
          >
            {deleting ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
          </button>
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            disabled={deleting || saving}
            className="inline-flex items-center gap-1 px-2.5 h-[28px] rounded-lg border border-(--lf-border) bg-transparent text-(--lf-muted) text-[0.72rem] cursor-pointer hover:text-(--lf-ink) hover:border-(--lf-muted) transition-all duration-150 font-sans"
          >
            <Pencil size={10} />
            Edit
          </button>
          {hasUnsavedChanges && (
            <button
              type="button"
              onClick={onSaveProject}
              disabled={deleting || saving}
              className="inline-flex items-center gap-1.5 px-3 h-[28px] rounded-lg bg-(--lf-ink) text-(--lf-bg) text-[0.72rem] font-semibold cursor-pointer hover:opacity-82 transition-opacity duration-150 font-sans border-none disabled:cursor-not-allowed disabled:opacity-55"
            >
              {saving ? (
                <Loader2 size={11} className="animate-spin" />
              ) : (
                <Check size={11} strokeWidth={2.5} />
              )}
              {saving ? "Saving..." : "Save"}
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="border border-(--lf-border) rounded-xl px-5 py-4 bg-(--lf-surface) mb-2.5 transition-colors duration-150 hover:border-(--lf-muted)">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4.5 gap-y-3.5">
        <div className="flex flex-col gap-1.25 mb-1.5">
          <label className="text-[0.7rem] text-(--lf-muted) font-mono tracking-wider">
            Title
          </label>
          <input
            {...register(`projects.${index}.title`)}
            className="bg-(--lf-bg) border border-(--lf-border) rounded-lg px-3 py-2 text-(--lf-ink) text-[0.85rem] outline-none w-full font-sans transition-colors duration-150 focus:border-(--lf-muted)"
            placeholder="My latest project"
          />
          {errors.projects?.[index]?.title?.message && (
            <div className="text-[0.72rem] text-[#b91c1c]">
              {errors.projects[index]?.title?.message as string}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-1.25 mb-1.5">
          <label className="text-[0.7rem] text-(--lf-muted) font-mono tracking-wider">
            GitHub link
          </label>
          <input
            {...register(`projects.${index}.githubLink`)}
            className="bg-(--lf-bg) border border-(--lf-border) rounded-lg px-3 py-2 text-(--lf-ink) text-[0.85rem] outline-none w-full font-sans transition-colors duration-150 focus:border-(--lf-muted)"
            placeholder="https://github.com/you/repo"
          />
          {errors.projects?.[index]?.githubLink?.message && (
            <div className="text-[0.72rem] text-[#b91c1c]">
              {errors.projects[index]?.githubLink?.message as string}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-1.25 mb-1.5">
          <label className="text-[0.7rem] text-(--lf-muted) font-mono tracking-wider">
            Project link
          </label>
          <input
            {...register(`projects.${index}.projectLink`)}
            className="bg-(--lf-bg) border border-(--lf-border) rounded-lg px-3 py-2 text-(--lf-ink) text-[0.85rem] outline-none w-full font-sans transition-colors duration-150 focus:border-(--lf-muted)"
            placeholder="https://your-demo.com"
          />
          {errors.projects?.[index]?.projectLink?.message && (
            <div className="text-[0.72rem] text-[#b91c1c]">
              {errors.projects[index]?.projectLink?.message as string}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-1.25 mb-1.5">
          <label className="text-[0.7rem] text-(--lf-muted) font-mono tracking-wider">
            End date
          </label>
          <input
            {...register(`projects.${index}.enddate`)}
            className="bg-(--lf-bg) border border-(--lf-border) rounded-lg px-3 py-2 text-(--lf-ink) text-[0.85rem] outline-none w-full font-sans transition-colors duration-150 focus:border-(--lf-muted)"
            placeholder="e.g. 2024-03-01"
          />
        </div>

        <div className="flex flex-col gap-1.25 sm:col-span-2 mb-1.5">
          <label className="text-[0.7rem] text-(--lf-muted) font-mono tracking-wider">
            Description
          </label>
          <textarea
            {...register(`projects.${index}.description`)}
            className="bg-(--lf-bg) border border-(--lf-border) rounded-lg px-3 py-2 text-(--lf-ink) text-[0.85rem] outline-none w-full font-sans transition-colors duration-150 focus:border-(--lf-muted) min-h-[90px] resize-vertical"
            placeholder="What does it do?"
          />
        </div>

        <div className="flex flex-col gap-1.25 sm:col-span-2">
          <label className="text-[0.7rem] text-(--lf-muted) font-mono tracking-wider">
            Tech stack (comma separated)
          </label>
          <input
            {...register(`projects.${index}.techstack`)}
            className="bg-(--lf-bg) border border-(--lf-border) rounded-lg px-3 py-2 text-(--lf-ink) text-[0.85rem] outline-none w-full font-sans transition-colors duration-150 focus:border-(--lf-muted)"
            placeholder="Next.js, Prisma, Tailwind"
          />
        </div>
      </div>

      <div className="flex items-center justify-between mt-4">
        <button
          type="button"
          onClick={onCancelEditing}
          disabled={saving}
          className="inline-flex items-center gap-[5px] px-2.5 h-[28px] rounded-lg bg-transparent border border-transparent text-(--lf-muted) text-[0.72rem] cursor-pointer hover:text-[#b91c1c] hover:bg-[#b91c1c]/5 hover:border-[#b91c1c]/15 dark:hover:text-[#f87171] dark:hover:bg-[#f87171]/8 dark:hover:border-[#f87171]/20 transition-all duration-150"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onDoneEditing}
          disabled={saving}
          className="inline-flex items-center gap-1.5 px-3 h-[28px] rounded-lg bg-(--lf-ink) text-(--lf-bg) text-[0.72rem] font-semibold cursor-pointer hover:opacity-82 transition-opacity duration-150 font-sans border-none"
        >
          <Check size={11} strokeWidth={2.5} />
          Done
        </button>
      </div>
    </div>
  );
}

export default function ProjectsForm({ profile, formRef, onSubmit }: Props) {
  const initialValues = useMemo(() => getInitialProjects(profile), [profile]);

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    getValues,
    formState: { errors, isDirty },
  } = useForm<ProjectsSchema>({
    resolver: zodResolver(projectsSchema),
    defaultValues: initialValues,
    mode: "onSubmit",
  });

  const { fields, append, remove, insert } = useFieldArray({
    control,
    name: "projects",
    keyName: "projectfield",
  });

  const watchedProjects = useWatch({ control, name: "projects" });

  useEffect(() => {
    if (!profile?.id) {
      return;
    }

    const cachedDraft = readDashboardDraft<ProjectsSchema>("projects", profile.id);
    reset(cachedDraft || projectsFromProfile(profile.projects || []));
  }, [profile?.id, profile?.projects, reset]);

  useEffect(() => {
    if (profile?.id && isDirty) {
      writeDashboardDraft("projects", profile.id, { projects: watchedProjects || [] });
    }
  }, [isDirty, profile?.id, watchedProjects]);

  return (
    <form
      id="dashboard-form"
      ref={formRef}
      onSubmit={handleSubmit(onSubmit ?? (() => {}), () => {
        toast.error("Please fix the highlighted fields before saving.");
      })}
    >
      <h1 className="font-serif-display text-[1.4rem] font-medium tracking-tight text-(--lf-ink) mb-1">
        Projects
      </h1>
      <p className="text-[0.78rem] text-(--lf-muted) mb-7">
        Showcase what you built
      </p>

      <div className="mb-4">
        {fields.length === 0 && (
          <div className="text-[0.78rem] text-(--lf-muted) mb-2.5">
            No projects yet. Add one below.
          </div>
        )}

        {fields.map((f, index) => (
          <ProjectCard
            key={f.projectfield}
            field={f}
            index={index}
            control={control}
            register={register}
            errors={errors}
            remove={remove}
            insert={insert}
            setValue={setValue}
            getValues={getValues}
            profile={profile}
          />
        ))}
      </div>

      <div className="border border-(--lf-border) rounded-xl px-5 py-4 bg-(--lf-surface) mb-2.5 transition-colors duration-150 hover:border-(--lf-muted) border-dashed mt-2">
        <div className="text-[0.68rem] font-semibold tracking-widest uppercase text-(--lf-muted) font-mono mb-3.5">
          New Project
        </div>

        <button
          type="button"
          onClick={() =>
            append({
              id: "",
              title: "",
              description: "",
              githubLink: "",
              projectLink: "",
              techstack: "",
              enddate: "",
            })
          }
          className="inline-flex items-center gap-1.5 px-[18px] h-[34px] rounded-[20px] bg-(--lf-ink) text-(--lf-bg) text-[0.78rem] font-semibold border-none cursor-pointer hover:opacity-82 transition-opacity duration-150 font-sans-body whitespace-nowrap"
        >
          <Plus size={12} />
          Add project
        </button>
      </div>
    </form>
  );
}
