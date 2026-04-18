"use client";

import { RefObject, useState } from "react";
import { useEffect, useMemo } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2, Pencil, Check, Code2, Github, ExternalLink } from "lucide-react";
import { projectsSchema, ProjectsSchema } from "@/schemas/projects";

type ProfileProject = {
  title?: string | null;
  description?: string | null;
  githubLink?: string | null;
  projectLink?: string | null;
  techstack?: string[] | null;
  enddate?: string | Date | null;
};

type Props = {
  profile?: {
    projects?: ProfileProject[];
  };
  formRef: RefObject<HTMLFormElement | null>;
  onSubmit?: (data: ProjectsSchema) => void;
};

function ProjectCard({
  index,
  control,
  register,
  errors,
  remove,
}: {
  index: number;
  control: any;
  register: any;
  errors: any;
  remove: (i: number) => void;
}) {
  const [confirmed, setConfirmed] = useState(false);
  const values = useWatch({ control, name: `projects.${index}` });

  if (confirmed) {
    const techList = values?.techstack
      ? String(values.techstack).split(",").map((t: string) => t.trim()).filter(Boolean)
      : [];

    return (
      <div className="group border border-(--lf-border) rounded-xl px-4 py-3.5 bg-(--lf-surface) mb-2.5 transition-colors duration-150 hover:border-(--lf-muted)">
        <div className="flex items-start justify-between gap-3">
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
          <div className="flex items-center gap-1.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
            <button
              type="button"
              onClick={() => setConfirmed(false)}
              className="inline-flex items-center gap-1 px-2.5 h-[28px] rounded-lg border border-(--lf-border) bg-transparent text-(--lf-muted) text-[0.72rem] cursor-pointer hover:text-(--lf-ink) hover:border-(--lf-muted) transition-all duration-150 font-sans"
            >
              <Pencil size={10} />
              Edit
            </button>
            <button
              type="button"
              onClick={() => remove(index)}
              className="inline-flex items-center justify-center w-[28px] h-[28px] rounded-lg border border-transparent text-(--lf-muted) cursor-pointer hover:text-[#b91c1c] hover:bg-[#b91c1c]/5 hover:border-[#b91c1c]/15 dark:hover:text-[#f87171] dark:hover:bg-[#f87171]/8 dark:hover:border-[#f87171]/20 transition-all duration-150"
              aria-label="Remove project"
            >
              <Trash2 size={12} />
            </button>
          </div>
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
          onClick={() => remove(index)}
          className="inline-flex items-center gap-[5px] px-2.5 h-[28px] rounded-lg bg-transparent border border-transparent text-(--lf-muted) text-[0.72rem] cursor-pointer hover:text-[#b91c1c] hover:bg-[#b91c1c]/5 hover:border-[#b91c1c]/15 dark:hover:text-[#f87171] dark:hover:bg-[#f87171]/8 dark:hover:border-[#f87171]/20 transition-all duration-150"
        >
          <Trash2 size={11} />
          Delete
        </button>
        <button
          type="button"
          onClick={() => setConfirmed(true)}
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
  const defaultValues = useMemo<ProjectsSchema>(() => {
    return {
      projects: (profile?.projects ?? []).map((p) => ({
        title: p.title ?? "",
        description: p.description ?? "",
        githubLink: p.githubLink ?? "",
        projectLink: p.projectLink ?? "",
        techstack: Array.isArray(p.techstack) ? p.techstack.join(", ") : "",
        enddate: p.enddate ? String(p.enddate) : "",
      })),
    };
  }, [profile]);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ProjectsSchema>({
    resolver: zodResolver(projectsSchema),
    defaultValues,
    mode: "onSubmit",
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "projects",
  });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  return (
    <form ref={formRef} onSubmit={handleSubmit(onSubmit ?? (()=>{}))}>
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
            key={f.id}
            index={index}
            control={control}
            register={register}
            errors={errors}
            remove={remove}
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
