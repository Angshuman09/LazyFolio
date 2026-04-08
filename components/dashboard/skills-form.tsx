"use client";

import { useCallback, useEffect, useMemo } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";
import { useRegisterTabSubmit } from "./use-register-tab-submit";
import { skillsSchema, SkillsSchema } from "@/schemas/skills";

type Props = {
  profile?: {
    skills?: string[] | null;
  };
  onSubmitReady: (submitFn: (() => void) | null) => void;
};

export default function SkillsForm({ profile, onSubmitReady }: Props) {
  const defaultValues = useMemo<SkillsSchema>(() => {
    return {
      skills: (profile?.skills ?? []).map((s) => ({
        value: s ?? "",
      })),
    };
  }, [profile]);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<SkillsSchema>({
    resolver: zodResolver(skillsSchema),
    defaultValues,
    mode: "onSubmit",
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "skills",
  });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const onSubmit = useCallback((data: SkillsSchema) => {
    console.log("skills", data);
  }, []);

  const submit = useCallback(() => {
    void handleSubmit(onSubmit)();
  }, [handleSubmit, onSubmit]);

  useRegisterTabSubmit(onSubmitReady, submit);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h1 className="font-serif-display text-[1.4rem] font-medium tracking-tight text-(--lf-ink) mb-1">
        Skills
      </h1>
      <p className="text-[0.78rem] text-(--lf-muted) mb-7">
        Technologies and tools you work with
      </p>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[0.68rem] font-semibold tracking-widest uppercase text-(--lf-muted) font-mono">
            Current Skills
          </span>
        </div>

        {fields.length === 0 && (
          <div className="text-[0.78rem] text-(--lf-muted) mb-2.5">
            No skills yet. Add one below.
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {fields.map((f, index) => (
            <div
              key={f.id}
              className="inline-flex items-center gap-[7px] bg-(--lf-surface) border border-(--lf-border) rounded-lg px-3 py-1.5 text-[0.78rem] text-(--lf-ink) font-mono transition-colors duration-150 hover:border-(--lf-muted)"
            >
              <input
                {...register(`skills.${index}.value`)}
                className="bg-transparent outline-none w-[160px]"
                placeholder="e.g. TypeScript"
              />
              <button
                type="button"
                onClick={() => remove(index)}
                className="inline-flex items-center justify-center w-6 h-6 rounded-md border border-transparent cursor-pointer text-(--lf-muted) hover:text-[#b91c1c] hover:bg-[#b91c1c]/5 hover:border-[#b91c1c]/15 dark:hover:text-[#f87171] dark:hover:bg-[#f87171]/8 dark:hover:border-[#f87171]/20 transition-all"
                aria-label="Remove skill"
              >
                <Trash2 size={12} />
              </button>
              {errors.skills?.[index]?.value?.message && (
                <span className="text-[0.72rem] text-[#b91c1c]">
                  {errors.skills[index]?.value?.message as string}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="border border-(--lf-border) rounded-xl px-5 py-4 bg-(--lf-surface) mb-2.5 transition-colors duration-150 hover:border-(--lf-muted) border-dashed">
        <div className="text-[0.68rem] font-semibold tracking-widest uppercase text-(--lf-muted) font-mono mb-3.5">
          Add a skill
        </div>

        <button
          type="button"
          onClick={() => append({ value: "" })}
          className="inline-flex items-center gap-1.5 px-[18px] h-[34px] rounded-[20px] bg-(--lf-ink) text-(--lf-bg) text-[0.78rem] font-semibold border-none cursor-pointer hover:opacity-82 transition-opacity duration-150 font-sans-body whitespace-nowrap"
        >
          <Plus size={12} />
          Add
        </button>
      </div>
    </form>
  );
}

