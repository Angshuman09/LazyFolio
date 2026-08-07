import {  type Control,
    type FieldArrayWithId,
    type FieldErrors,
    type UseFieldArrayRemove,
    type UseFieldArrayInsert,
    type UseFormGetValues,
    type UseFormRegister,
    type UseFormSetValue,
    useWatch,
    Controller
} from 'react-hook-form'
import { Trash2, Pencil, Check, Code2, Github, ExternalLink, Loader2} from 'lucide-react'
import { useCreateProject, useDeleteProject } from "@/hooks/project";
import { hasFieldArrayErrors } from "@/lib/utils/utils";
import { useEffect, useState } from 'react';
import { ProjectsSchema } from '@/lib/schemas/projects';
import { ProfileProject } from '@/lib/types/projects';
import { writeDashboardDraft } from '@/lib/cache/dashboard-drafts';
import toast from 'react-hot-toast';
import { Switch } from "@/components/ui/switch";
import { useUpdateVisibility } from "@/hooks/visibility";
import { DatePicker } from "@/components/ui/date-picker";

export function ProjectCard({
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
      isenable: boolean;
    } | null>(() => {
      const profileProject = profile?.projects?.find((p) => p.id === field.id);
      const title = profileProject?.title || field.title || "";
      const description = profileProject?.description || field.description || "";
      const githubLink = profileProject?.githubLink || field.githubLink || "";
      const projectLink = profileProject?.projectLink || field.projectLink || "";
      const techstack = Array.isArray(profileProject?.techstack)
        ? profileProject.techstack.join(", ")
        : (field.techstack || "");
      const enddate = profileProject?.enddate ? String(profileProject.enddate) : (field.enddate || "");
      const isenable = profileProject?.isenable ?? field.isenable ?? true;

      if (!field.id && !title && !description && !githubLink && !projectLink && !techstack && !enddate) {
        return null;
      }

      return {
        id: field.id || undefined,
        title,
        description,
        githubLink,
        projectLink,
        techstack,
        enddate,
        isenable,
      };
    });
  
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const updateVisibility = useUpdateVisibility();
  
    const values = useWatch({ control, name: `projects.${index}` });
    const hasErrors = hasFieldArrayErrors(errors, "projects", index);

    // Helper to normalize any date value to YYYY-MM-DD string
    const toYMD = (val: string | Date | null | undefined): string => {
      if (!val) return "";
      const d = new Date(val);
      if (isNaN(d.getTime())) return String(val);
      const y = d.getUTCFullYear();
      const m = String(d.getUTCMonth() + 1).padStart(2, "0");
      const day = String(d.getUTCDate()).padStart(2, "0");
      return `${y}-${m}-${day}`;
    };

    // Sync savedSnapshot when profile updates (e.g. after global "Save Changes")
    useEffect(() => {
      const profileProject = profile?.projects?.find((p) => p.id === field.id);
      if (!profileProject || !field.id) return;
      setSavedSnapshot({
        id: profileProject.id || undefined,
        title: profileProject.title || "",
        description: profileProject.description || "",
        githubLink: profileProject.githubLink || "",
        projectLink: profileProject.projectLink || "",
        techstack: Array.isArray(profileProject.techstack)
          ? profileProject.techstack.join(", ")
          : "",
        enddate: toYMD(profileProject.enddate as string | Date | null | undefined),
        isenable: profileProject.isenable ?? true,
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [profile?.projects]);

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
      isenable: values?.isenable ?? true,
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
      const toastId = toast.loading("Saving project...");
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
            isenable: normalizedValues.isenable,
          },
          profileId: profile.id,
        });
  
        const normalizeEnddate = (val: string | null | undefined) => {
          if (!val) return "";
          // API returns full ISO datetime; normalize to YYYY-MM-DD for comparison
          const d = new Date(val);
          if (isNaN(d.getTime())) return String(val);
          const y = d.getUTCFullYear();
          const m = String(d.getUTCMonth() + 1).padStart(2, "0");
          const day = String(d.getUTCDate()).padStart(2, "0");
          return `${y}-${m}-${day}`;
        };

        const savedProject = {
          id: payload?.data?.id || normalizedValues.id,
          title: payload?.data?.title || normalizedValues.title,
          description: payload?.data?.description || normalizedValues.description,
          githubLink: payload?.data?.githubLink || normalizedValues.githubLink,
          projectLink: payload?.data?.projectLink || normalizedValues.projectLink,
          techstack: Array.isArray(payload?.data?.techstack)
            ? payload.data.techstack.join(", ")
            : normalizedValues.techstack,
          enddate: normalizeEnddate(payload?.data?.enddate) || normalizedValues.enddate,
          isenable: payload?.data?.isenable ?? normalizedValues.isenable,
        };
  
        setValue(`projects.${index}.id`, savedProject.id, { shouldDirty: false });
        setValue(`projects.${index}.title`, savedProject.title, { shouldDirty: false });
        setValue(`projects.${index}.description`, savedProject.description, { shouldDirty: false });
        setValue(`projects.${index}.githubLink`, savedProject.githubLink, { shouldDirty: false });
        setValue(`projects.${index}.projectLink`, savedProject.projectLink, { shouldDirty: false });
        setValue(`projects.${index}.techstack`, savedProject.techstack, { shouldDirty: false });
        setValue(`projects.${index}.enddate`, savedProject.enddate, { shouldDirty: false });
        setValue(`projects.${index}.isenable`, savedProject.isenable, { shouldDirty: false });
  
        const currentProjects = getValues("projects") || [];
        updateProjectsDraft(
          currentProjects.map((p, i) =>
            i === index ? { ...p, ...savedProject } : p,
          ),
        );
        setSavedSnapshot(savedProject);
        setIsEditing(false);
        toast.success("Project saved successfully!", { id: toastId });
      } catch (error) {
        console.error("Error saving project:", error);
        toast.error("An error occurred while saving the project.", { id: toastId });
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
      const toastId = toast.loading("Deleting project...");
      try {
        await deleteProject.mutateAsync(normalizedValues.id);
        toast.success("Project deleted successfully!", { id: toastId });
      } catch (error) {
        if (deletedProject) {
          insert(index, deletedProject);
          updateProjectsDraft(currentProjects);
        }
        console.error("Error deleting project:", error);
        toast.error("An error occurred while deleting the project.", { id: toastId });
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
      setValue(`projects.${index}.isenable`, savedSnapshot.isenable, { shouldDirty: false });
  
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
      setSavedSnapshot(normalizedValues);
      setIsEditing(false);
    };

    const handleVisibilityChange = async (isenable: boolean) => {
      if (!normalizedValues.id) {
        toast.error("Save this project before changing visibility.");
        return;
      }

      const previousValue = normalizedValues.isenable;
      const loadingToast = toast.loading(
        isenable ? "Showing project on profile..." : "Hiding project from profile...",
      );
      setValue(`projects.${index}.isenable`, isenable, { shouldDirty: false });

      try {
        await updateVisibility.mutateAsync({
          target: "project",
          id: normalizedValues.id,
          isenable,
        });
        const currentProjects = getValues("projects") || [];
        updateProjectsDraft(
          currentProjects.map((project, projectIndex) =>
            projectIndex === index ? { ...project, isenable } : project,
          ),
        );
        setSavedSnapshot((snapshot) =>
          snapshot ? { ...snapshot, isenable } : snapshot,
        );
        toast.success(
          isenable ? "Project shown on profile." : "Project hidden from profile.",
          { id: loadingToast },
        );
      } catch (error) {
        setValue(`projects.${index}.isenable`, previousValue, { shouldDirty: false });
        console.error("Error updating project visibility:", error);
        toast.error("Could not update project visibility.", { id: loadingToast });
      }
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
                {values?.enddate && (() => {
                  const d = new Date(values.enddate);
                  return !isNaN(d.getTime()) ? (
                    <span className="inline-flex items-center gap-1 text-[0.68rem] text-(--lf-muted) font-mono">
                      {d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric", timeZone: "UTC" })}
                    </span>
                  ) : null;
                })()}
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
              onClick={() => {
                if (!savedSnapshot) {
                  setSavedSnapshot(normalizedValues);
                }
                setIsEditing(true);
              }}
              disabled={deleting || saving}
              className="inline-flex items-center gap-1 px-2.5 h-[28px] rounded-lg border border-(--lf-border) bg-transparent text-(--lf-muted) text-[0.72rem] cursor-pointer hover:text-(--lf-ink) hover:border-(--lf-muted) transition-all duration-150 font-sans"
            >
              <Pencil size={10} />
              Edit
            </button>
            <Switch
              checked={normalizedValues.isenable}
              onCheckedChange={handleVisibilityChange}
              disabled={deleting || saving || updateVisibility.isPending || !normalizedValues.id}
              aria-label={
                normalizedValues.isenable
                  ? "Hide project from profile"
                  : "Show project on profile"
              }
            />
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
            <Controller
              control={control}
              name={`projects.${index}.enddate`}
              render={({ field }) => (
                <DatePicker
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Pick project end date"
                />
              )}
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
