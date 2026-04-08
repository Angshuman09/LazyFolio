"use client";

import { useCallback, useEffect, useMemo } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";
import { useRegisterTabSubmit } from "./use-register-tab-submit";
import { experienceSchema, ExperienceSchema } from "@/schemas/experience";

type ProfileExperience = {
  companyName?: string | null;
  role?: string | null;
  startdate?: string | null;
  enddate?: string | null;
  description?: string | null;
};

type Props = {
  profile?: {
    experiences?: ProfileExperience[];
  };
  onSubmitReady: (submitFn: (() => void) | null) => void;
};

export default function ExperienceForm({ profile, onSubmitReady }: Props) {
  const defaultValues = useMemo<ExperienceSchema>(() => {
    return {
      experiences: (profile?.experiences ?? []).map((e) => ({
        companyName: e.companyName ?? "",
        role: e.role ?? "",
        startdate: e.startdate ?? "",
        enddate: e.enddate ?? "",
        description: e.description ?? "",
      })),
    };
  }, [profile]);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ExperienceSchema>({
    resolver: zodResolver(experienceSchema),
    defaultValues,
    mode: "onSubmit",
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "experiences",
  });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const onSubmit = useCallback((data: ExperienceSchema) => {
    console.log("experience", data);
  }, []);

  const submit = useCallback(() => {
    void handleSubmit(onSubmit)();
  }, [handleSubmit, onSubmit]);

  useRegisterTabSubmit(onSubmitReady, submit);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h1 className="font-serif-display text-[1.4rem] font-medium tracking-tight text-(--lf-ink) mb-1">
        Experience
      </h1>
      <p className="text-[0.78rem] text-(--lf-muted) mb-7">
        Your professional work history
      </p>

      <div className="mb-6">
        {fields.length === 0 && (
          <div className="text-[0.78rem] text-(--lf-muted) mb-2.5">
            No experiences yet. Add one below.
          </div>
        )}

        {fields.map((f, index) => (
          <div
            key={f.id}
            className="border border-(--lf-border) rounded-xl px-5 py-4 bg-(--lf-surface) mb-2.5 transition-colors duration-150 hover:border-(--lf-muted)"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4.5 gap-y-3.5">
              <div className="flex flex-col gap-1.25">
                <label className="text-[0.7rem] text-(--lf-muted) font-mono tracking-wider">
                  Role
                </label>
                <input
                  {...register(`experiences.${index}.role`)}
                  className="bg-(--lf-bg) border border-(--lf-border) rounded-lg px-3 py-2 text-(--lf-ink) text-[0.85rem] outline-none w-full font-sans transition-colors duration-150 focus:border-(--lf-muted)"
                  placeholder="e.g. Full Stack Developer"
                />
                {errors.experiences?.[index]?.role?.message && (
                  <div className="text-[0.72rem] text-[#b91c1c]">
                    {errors.experiences[index]?.role?.message as string}
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-1.25">
                <label className="text-[0.7rem] text-(--lf-muted) font-mono tracking-wider">
                  Company
                </label>
                <input
                  {...register(`experiences.${index}.companyName`)}
                  className="bg-(--lf-bg) border border-(--lf-border) rounded-lg px-3 py-2 text-(--lf-ink) text-[0.85rem] outline-none w-full font-sans transition-colors duration-150 focus:border-(--lf-muted)"
                  placeholder="e.g. Acme Corp"
                />
                {errors.experiences?.[index]?.companyName?.message && (
                  <div className="text-[0.72rem] text-[#b91c1c]">
                    {
                      errors.experiences[index]?.companyName?.message as string
                    }
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-1.25">
                <label className="text-[0.7rem] text-(--lf-muted) font-mono tracking-wider">
                  Start date
                </label>
                <input
                  {...register(`experiences.${index}.startdate`)}
                  className="bg-(--lf-bg) border border-(--lf-border) rounded-lg px-3 py-2 text-(--lf-ink) text-[0.85rem] outline-none w-full font-sans transition-colors duration-150 focus:border-(--lf-muted)"
                  placeholder="e.g. 2023-01-01"
                />
              </div>

              <div className="flex flex-col gap-1.25">
                <label className="text-[0.7rem] text-(--lf-muted) font-mono tracking-wider">
                  End date
                </label>
                <input
                  {...register(`experiences.${index}.enddate`)}
                  className="bg-(--lf-bg) border border-(--lf-border) rounded-lg px-3 py-2 text-(--lf-ink) text-[0.85rem] outline-none w-full font-sans transition-colors duration-150 focus:border-(--lf-muted)"
                  placeholder="e.g. 2024-12-31"
                />
              </div>

              <div className="flex flex-col gap-1.25 sm:col-span-2">
                <label className="text-[0.7rem] text-(--lf-muted) font-mono tracking-wider">
                  Description
                </label>
                <textarea
                  {...register(`experiences.${index}.description`)}
                  className="bg-(--lf-bg) border border-(--lf-border) rounded-lg px-3 py-2 text-(--lf-ink) text-[0.85rem] outline-none w-full font-sans transition-colors duration-150 focus:border-(--lf-muted) min-h-[90px] resize-vertical"
                  placeholder="What did you do?"
                />
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={() => remove(index)}
                className="inline-flex items-center gap-[5px] px-2.5 h-[30px] rounded-lg bg-transparent border border-transparent text-(--lf-muted) text-[0.75rem] cursor-pointer hover:text-[#b91c1c] hover:bg-[#b91c1c]/5 hover:border-[#b91c1c]/15 dark:hover:text-[#f87171] dark:hover:bg-[#f87171]/8 dark:hover:border-[#f87171]/20 transition-all duration-150"
              >
                <Trash2 size={12} />
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="border border-(--lf-border) rounded-xl px-5 py-4 bg-(--lf-surface) mb-2.5 transition-colors duration-150 hover:border-(--lf-muted) border-dashed mt-6">
        <div className="text-[0.68rem] font-semibold tracking-widest uppercase text-(--lf-muted) font-mono mb-3.5">
          New Role
        </div>

        <button
          type="button"
          onClick={() =>
            append({
              companyName: "",
              role: "",
              startdate: "",
              enddate: "",
              description: "",
            })
          }
          className="inline-flex items-center gap-1.5 px-[18px] h-[34px] rounded-[20px] bg-(--lf-ink) text-(--lf-bg) text-[0.78rem] font-semibold border-none cursor-pointer hover:opacity-82 transition-opacity duration-150 font-sans-body whitespace-nowrap"
        >
          <Plus size={12} />
          Add experience
        </button>
      </div>
    </form>
  );
}

