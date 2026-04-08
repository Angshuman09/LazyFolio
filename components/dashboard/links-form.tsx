"use client";

import { useCallback, useEffect, useMemo } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";
import { linksSchema, LinksSchema } from "@/schemas/links";
import { useRegisterTabSubmit } from "./use-register-tab-submit";

type ProfileLink = {
  label?: string | null;
  url?: string | null;
};

type Props = {
  profile?: {
    links?: ProfileLink[];
  };
  onSubmitReady: (submitFn: (() => void) | null) => void;
};

export default function LinksForm({ profile, onSubmitReady }: Props) {
  const defaultValues = useMemo<LinksSchema>(() => {
    return {
      links: (profile?.links ?? []).map((l) => ({
        label: l.label ?? "",
        url: l.url ?? "",
      })),
    };
  }, [profile]);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<LinksSchema>({
    resolver: zodResolver(linksSchema),
    defaultValues,
    mode: "onSubmit",
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "links",
  });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const onSubmit = useCallback((data: LinksSchema) => {
    console.log("links", data);
  }, []);

  const submit = useCallback(() => {
    void handleSubmit(onSubmit)();
  }, [handleSubmit, onSubmit]);

  useRegisterTabSubmit(onSubmitReady, submit);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h1 className="font-serif-display text-[1.4rem] font-medium tracking-tight text-(--lf-ink) mb-1">
        Links
      </h1>
      <p className="text-[0.78rem] text-(--lf-muted) mb-7">
        Add any links to feature on your portfolio
      </p>

      <div className="mb-6">
        {fields.length === 0 && (
          <div className="text-[0.78rem] text-(--lf-muted) mb-2.5">
            No links yet. Add one below.
          </div>
        )}

        {fields.map((f, index) => (
          <div
            key={f.id}
            className="border border-(--lf-border) rounded-xl px-4 sm:px-5 py-4 bg-(--lf-surface) mb-2.5 transition-colors duration-150 hover:border-(--lf-muted)"
          >
            <div className="flex items-start justify-between gap-3.5">
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-[1fr_2fr] gap-3.5">
                <div className="flex flex-col gap-1.25">
                  <label className="text-[0.7rem] text-(--lf-muted) font-mono tracking-wider">
                    Label
                  </label>
                  <input
                    {...register(`links.${index}.label`)}
                    className="bg-(--lf-bg) border border-(--lf-border) rounded-lg px-3 py-2 text-(--lf-ink) text-[0.85rem] outline-none w-full font-sans transition-colors duration-150 focus:border-(--lf-muted)"
                    placeholder="Twitter"
                  />
                  {errors.links?.[index]?.label?.message && (
                    <div className="text-[0.72rem] text-[#b91c1c]">
                      {errors.links[index]?.label?.message as string}
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-1.25">
                  <label className="text-[0.7rem] text-(--lf-muted) font-mono tracking-wider">
                    URL
                  </label>
                  <input
                    {...register(`links.${index}.url`)}
                    className="bg-(--lf-bg) border border-(--lf-border) rounded-lg px-3 py-2 text-(--lf-ink) text-[0.85rem] outline-none w-full font-sans transition-colors duration-150 focus:border-(--lf-muted)"
                    placeholder="https://x.com/you"
                  />
                  {errors.links?.[index]?.url?.message && (
                    <div className="text-[0.72rem] text-[#b91c1c]">
                      {errors.links[index]?.url?.message as string}
                    </div>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={() => remove(index)}
                className="inline-flex items-center gap-[5px] px-2.5 h-[38px] rounded-lg bg-transparent border border-transparent text-(--lf-muted) text-[0.75rem] cursor-pointer hover:text-[#b91c1c] hover:bg-[#b91c1c]/5 hover:border-[#b91c1c]/15 dark:hover:text-[#f87171] dark:hover:bg-[#f87171]/8 dark:hover:border-[#f87171]/20 transition-all duration-150"
                aria-label="Remove link"
              >
                <Trash2 size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="border border-(--lf-border) rounded-xl px-5 py-4 bg-(--lf-surface) mb-2.5 transition-colors duration-150 hover:border-(--lf-muted) border-dashed">
        <div className="text-[0.68rem] font-semibold tracking-widest uppercase text-(--lf-muted) font-mono mb-3.5">
          New Link
        </div>

        <button
          type="button"
          onClick={() => append({ label: "", url: "" })}
          className="inline-flex items-center gap-1.5 px-[18px] h-[34px] rounded-[20px] bg-(--lf-ink) text-(--lf-bg) text-[0.78rem] font-semibold border-none cursor-pointer hover:opacity-82 transition-opacity duration-150 font-sans-body whitespace-nowrap"
        >
          <Plus size={12} />
          Add link
        </button>
      </div>
    </form>
  );
}

