"use client";

import { useEffect, useMemo } from "react";
import {
  useForm,
  useFieldArray,
  useWatch,
} from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus} from 'lucide-react';
import toast from "react-hot-toast";
import { linksFromProfile } from "@/lib/utils/links";
import {writeDashboardDraft} from "@/lib/cache/dashboard-drafts";
import { LinksSchema } from "@/lib/schemas/links";
import {getInitialLinks} from "@/lib/utils/links";
import { linksSchema } from "@/lib/schemas/links";
import {Props} from "@/lib/utils/links";
import { readDashboardDraft } from "@/lib/cache/dashboard-drafts";
import {LinkCard} from '@/components/dashboard/links/link-card';

export default function LinksForm({ profile, formRef, onSubmit }: Props) {
  const initialValues = useMemo(() => getInitialLinks(profile), [profile]);
  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    getValues,
    formState: { errors, isDirty },
  } = useForm<LinksSchema>({
    resolver: zodResolver(linksSchema),
    defaultValues: initialValues,
    mode: "onSubmit",
  });

  const { fields, append, remove, insert } = useFieldArray({
    control,
    name: "links",
    keyName: "fieldId",
  });

  const watchedLinks = useWatch({ control, name: "links" });

  useEffect(() => {
    if (!profile?.id) {
      return;
    }

    const cachedDraft = readDashboardDraft<LinksSchema>("links", profile.id);
    reset(cachedDraft || linksFromProfile(profile.links || []));
  }, [profile?.id, profile?.links, reset]);

  useEffect(() => {
    if (profile?.id && isDirty) {
      writeDashboardDraft("links", profile.id, { links: watchedLinks || [] });
    }
  }, [isDirty, profile?.id, watchedLinks]);

  return (
    <form
      id="dashboard-form"
      ref={formRef}
      onSubmit={handleSubmit(onSubmit, () => {
        toast.error("Please fix the highlighted fields before saving.");
      })}
    >
      <h1 className="font-serif-display text-[1.4rem] font-medium tracking-tight text-(--lf-ink) mb-1">
        Links
      </h1>
      <p className="text-[0.78rem] text-(--lf-muted) mb-7">
        Add any links to feature on your portfolio
      </p>

      <div className="mb-4">
        {fields.length === 0 && (
          <div className="text-[0.78rem] text-(--lf-muted) mb-2.5">
            No links yet. Add one below.
          </div>
        )}

        {fields.map((f, index) => (
          <LinkCard
            key={f.fieldId}
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

      <div className="border border-(--lf-border) rounded-xl px-5 py-4 bg-(--lf-surface) mb-2.5 transition-colors duration-150 hover:border-(--lf-muted) border-dashed">
        <div className="text-[0.68rem] font-semibold tracking-widest uppercase text-(--lf-muted) font-mono mb-3.5">
          New Link
        </div>

        <button
          type="button"
          onClick={() => append({ label: "", url: "" })}
          className="inline-flex items-center gap-1.5 px-4.5 h-8.5 rounded-[20px] bg-(--lf-ink) text-(--lf-bg) text-[0.78rem] font-semibold border-none cursor-pointer hover:opacity-82 transition-opacity duration-150 font-sans-body whitespace-nowrap"
        >
          <Plus size={12} />
          Add link
        </button>
      </div>
    </form>
  );
}
