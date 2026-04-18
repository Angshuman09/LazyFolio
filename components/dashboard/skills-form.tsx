"use client";

import { RefObject, useState } from "react";
import { useEffect, useMemo } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2, Pencil, Check, Sparkles } from "lucide-react";
import { skillsSchema, SkillsSchema } from "@/schemas/skills";

type Props = {
  profile?: {
    skills?: string[] | null;
  };
  formRef: RefObject<HTMLFormElement | null>;
  onSubmit?: (data: SkillsSchema) => void;
};

function SkillCard({
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
  const values = useWatch({ control, name: `skills.${index}` });

  if (confirmed) {
    return (
      <div className="group inline-flex items-center gap-1.5 bg-(--lf-surface) border border-(--lf-border) rounded-xl px-3 py-2 transition-colors duration-150 hover:border-(--lf-muted)">
        <Sparkles size={11} className="text-(--lf-muted) shrink-0" />
        <span className="text-[0.78rem] text-(--lf-ink) font-mono">
          {values?.value || <span className="text-(--lf-muted) italic">Unnamed</span>}
        </span>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 ml-0.5">
          <button
            type="button"
            onClick={() => setConfirmed(false)}
            className="inline-flex items-center justify-center w-5 h-5 rounded-md border border-transparent text-(--lf-muted) cursor-pointer hover:text-(--lf-ink) hover:bg-(--lf-border) transition-all duration-150"
            aria-label="Edit skill"
          >
            <Pencil size={10} />
          </button>
          <button
            type="button"
            onClick={() => remove(index)}
            className="inline-flex items-center justify-center w-5 h-5 rounded-md border border-transparent text-(--lf-muted) cursor-pointer hover:text-[#b91c1c] hover:bg-[#b91c1c]/5 dark:hover:text-[#f87171] dark:hover:bg-[#f87171]/8 transition-all duration-150"
            aria-label="Remove skill"
          >
            <Trash2 size={10} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-(--lf-border) rounded-xl px-4 py-3 bg-(--lf-surface) mb-2.5 transition-colors duration-150 hover:border-(--lf-muted)">
      <div className="flex flex-col gap-1.25 mb-3">
        <label className="text-[0.7rem] text-(--lf-muted) font-mono tracking-wider">
          Skill name
        </label>
        <input
          {...register(`skills.${index}.value`)}
          className="bg-(--lf-bg) border border-(--lf-border) rounded-lg px-3 py-2 text-(--lf-ink) text-[0.85rem] outline-none w-full font-sans transition-colors duration-150 focus:border-(--lf-muted)"
          placeholder="e.g. TypeScript"
          autoFocus
        />
        {errors.skills?.[index]?.value?.message && (
          <span className="text-[0.72rem] text-[#b91c1c]">
            {errors.skills[index]?.value?.message as string}
          </span>
        )}
      </div>
      <div className="flex items-center justify-between">
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

export default function SkillsForm({ profile, formRef, onSubmit }: Props) {
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

  // Split confirmed (badge) vs editing (form) items for layout
  const confirmedIndices = new Set<number>();

  return (
    <form ref={formRef} onSubmit={handleSubmit(onSubmit ?? (() => {}))}>
      <h1 className="font-serif-display text-[1.4rem] font-medium tracking-tight text-(--lf-ink) mb-1">
        Skills
      </h1>
      <p className="text-[0.78rem] text-(--lf-muted) mb-7">
        Technologies and tools you work with
      </p>

      <div className="mb-4">
        {fields.length === 0 && (
          <div className="text-[0.78rem] text-(--lf-muted) mb-4">
            No skills yet. Add one below.
          </div>
        )}

        {/* Badge row for confirmed skills + expanding inputs for new ones */}
        <div className="flex flex-wrap gap-2 mb-3">
          {fields.map((f, index) => (
            <SkillCard
              key={f.id}
              index={index}
              control={control}
              register={register}
              errors={errors}
              remove={remove}
            />
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
