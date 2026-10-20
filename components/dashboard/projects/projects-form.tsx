"use client";

import { useEffect, useMemo } from "react";
import {
  useFieldArray,
  useForm,
  useWatch,

} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle } from "lucide-react";
import toast from "react-hot-toast";
import { projectsSchema, ProjectsSchema } from "@/lib/schemas/projects";
import { readDashboardDraft, writeDashboardDraft, clearDashboardDraft } from "@/lib/cache/dashboard-drafts";
import { ProfileProject, Props } from "@/lib/types/projects";
import { ProjectCard } from "./project-card";
import { useSectionSave } from "@/hooks/use-section-save";
import { SectionHeading } from "@/components/dashboard/section-heading";
import { AddItemPanel } from "@/components/dashboard/add-item-panel";
import { EmptySectionState } from "@/components/dashboard/empty-section-state";

function projectsFromProfile(projects: ProfileProject[] = []): ProjectsSchema {
  return {
    projects: projects.map((p) => ({
      id: p.id ?? "",
      title: p.title ?? "",
      description: p.description ?? "",
      githubLink: p.githubLink ?? "",
      projectLink: p.projectLink ?? "",
      techstack: Array.isArray(p.techstack) ? p.techstack.join(", ") : "",
      enddate: normalizeDate(p.enddate),
      isenable: p.isenable ?? true,
    })),
  };
}

function normalizeDate(value: string | Date | null | undefined) {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? String(value) : date.toISOString().slice(0, 10);
}

function getInitialProjects(profile?: { id?: string; projects?: ProfileProject[] }): ProjectsSchema {
  const saved = projectsFromProfile(profile?.projects || []);
  const draft = readDashboardDraft<ProjectsSchema>("projects", profile?.id);
  if (!draft) return saved;

  const normalizeRows = (rows: ProjectsSchema["projects"]) =>
    (rows || [])
      .map((row) => ({
        title: row.title?.trim() || "",
        description: row.description?.trim() || "",
        githubLink: row.githubLink?.trim() || "",
        projectLink: row.projectLink?.trim() || "",
        techstack: row.techstack?.trim() || "",
        enddate: normalizeDate(row.enddate),
        isenable: row.isenable ?? true,
      }))
      .sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)));

  // Older drafts may contain blank or stale IDs. Ignore an old draft when its
  // content already matches the server.
  if (JSON.stringify(normalizeRows(draft.projects)) === JSON.stringify(normalizeRows(saved.projects))) {
    return saved;
  }
  return draft;
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
    formState: { errors },
  } = useForm<ProjectsSchema>({
    resolver: zodResolver(projectsSchema),
    defaultValues: initialValues,
    mode: "onSubmit",
  });

  const watchedProjects = useWatch({ control, name: "projects" });

  const isProjectsDirty = useMemo(() => {
    const current = watchedProjects || [];
    const saved = projectsFromProfile(profile?.projects || []).projects || [];
    const savedMap = new Map(saved.map((p) => [p.id, p]));

    for (const item of current) {
      const title = item.title?.trim() || "";
      const description = item.description?.trim() || "";
      const githubLink = item.githubLink?.trim() || "";
      const projectLink = item.projectLink?.trim() || "";
      const techstack = item.techstack?.trim() || "";
      const enddate = item.enddate || "";
      const isenable = item.isenable ?? true;

      if (!item.id) {
        if (title !== "" || description !== "" || githubLink !== "" || projectLink !== "" || techstack !== "" || enddate !== "") {
          return true;
        }
      } else {
        const original = savedMap.get(item.id);
        if (original) {
          if (
            title !== (original.title?.trim() || "") ||
            description !== (original.description?.trim() || "") ||
            githubLink !== (original.githubLink?.trim() || "") ||
            projectLink !== (original.projectLink?.trim() || "") ||
            techstack !== (original.techstack?.trim() || "") ||
            enddate !== normalizeDate(original.enddate) ||
            isenable !== (original.isenable ?? true)
          ) {
            return true;
          }
        }
      }
    }
    return false;
  }, [watchedProjects, profile?.projects]);

  const { error: sectionError } = useSectionSave("projects", {
    isDirty: isProjectsDirty,
    onSave: async () => {
      await handleSubmit(async (data) => {
        if (onSubmit) await onSubmit(data);
      })();
    },
    onDiscard: () => {
      if (profile?.id) clearDashboardDraft("projects", profile.id);
      reset(projectsFromProfile(profile?.projects || []));
    },
  });

  const { fields, append, remove, insert } = useFieldArray({
    control,
    name: "projects",
    keyName: "projectfield",
  });

  useEffect(() => {
    if (!profile?.id) {
      return;
    }

    reset(getInitialProjects({ id: profile.id, projects: profile.projects }));
  }, [profile?.id, profile?.projects, reset]);

  useEffect(() => {
    if (!profile?.id) return;
    if (isProjectsDirty) {
      writeDashboardDraft("projects", profile.id, { projects: watchedProjects || [] });
    } else {
      clearDashboardDraft("projects", profile.id);
    }
  }, [isProjectsDirty, profile?.id, watchedProjects]);

  return (
    <form
      id="dashboard-form"
      ref={formRef}
      onSubmit={handleSubmit(onSubmit ?? (() => {}), () => {
        toast.error("Please fix the highlighted fields before saving.");
      })}
    >
      <SectionHeading title="Projects" description="Highlight the products, experiments, and ideas you have built." />

      {sectionError && (
        <div className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-[0.8rem] flex items-center gap-2">
          <AlertCircle size={14} className="shrink-0" />
          <span>{sectionError}</span>
        </div>
      )}

      <div className="mb-4">
        {fields.length === 0 && (
          <EmptySectionState message="Add a project with a short description and links to its code or live version." />
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
            reset={reset}
            profile={profile}
          />
        ))}
      </div>

      <AddItemPanel
        title="Add a project"
        buttonLabel="Add project"
        onClick={() => append({
              id: "",
              title: "",
              description: "",
              githubLink: "",
              projectLink: "",
              techstack: "",
              enddate: "",
              isenable: true,
            })}
      />
    </form>
  );
}
