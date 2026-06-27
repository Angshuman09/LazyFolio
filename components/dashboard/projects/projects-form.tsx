"use client";

import { useEffect, useMemo } from "react";
import {
  useFieldArray,
  useForm,
  useWatch,

} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import toast from "react-hot-toast";
import { projectsSchema, ProjectsSchema } from "@/lib/schemas/projects";
import { readDashboardDraft, writeDashboardDraft } from "@/lib/cache/dashboard-drafts";
import { ProfileProject, Props } from "@/lib/types/projects";
import { ProjectCard } from "./project-card";

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
