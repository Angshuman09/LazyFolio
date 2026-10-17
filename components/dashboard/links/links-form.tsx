"use client";

import { useEffect, useMemo } from "react";
import {
  useForm,
  useFieldArray,
  useWatch,
} from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle } from 'lucide-react';
import toast from "react-hot-toast";
import { linksFromProfile } from "@/lib/utils/links";
import { writeDashboardDraft, readDashboardDraft, clearDashboardDraft } from "@/lib/cache/dashboard-drafts";
import { LinksSchema } from "@/lib/schemas/links";
import { getInitialLinks } from "@/lib/utils/links";
import { linksSchema } from "@/lib/schemas/links";
import { Props } from "@/lib/utils/links";
import { LinkCard } from "@/components/dashboard/links/link-card";
import { useSectionSave } from "@/hooks/use-section-save";
import { SectionHeading } from "@/components/dashboard/section-heading";
import { AddItemPanel } from "@/components/dashboard/add-item-panel";
import { EmptySectionState } from "@/components/dashboard/empty-section-state";

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

  const watchedLinks = useWatch({ control, name: "links" });

  const isLinksDirty = useMemo(() => {
    const current = watchedLinks || [];
    const saved = profile?.links || [];
    const savedMap = new Map(saved.map((l) => [l.id, l]));

    for (const item of current) {
      const label = item.label?.trim() || "";
      const url = item.url?.trim() || "";
      const isenable = item.isenable ?? true;

      if (!item.id) {
        if (label !== "" || url !== "") return true;
      } else {
        const original = savedMap.get(item.id);
        if (original) {
          if (
            label !== (original.label?.trim() || "") ||
            url !== (original.url?.trim() || "") ||
            isenable !== (original.isenable ?? true)
          ) {
            return true;
          }
        }
      }
    }
    return false;
  }, [watchedLinks, profile?.links]);

  const { error: sectionError } = useSectionSave("links", {
    isDirty: isLinksDirty,
    onSave: async () => {
      await handleSubmit(async (data) => {
        await onSubmit(data);
      })();
    },
    onDiscard: () => {
      if (profile?.id) clearDashboardDraft("links", profile.id);
      reset(linksFromProfile(profile?.links || []));
    },
  });

  const { fields, append, remove, insert } = useFieldArray({
    control,
    name: "links",
    keyName: "fieldId",
  });

  useEffect(() => {
    if (!profile?.id) {
      return;
    }

    const cachedDraft = readDashboardDraft<LinksSchema>("links", profile.id);
    reset(cachedDraft || linksFromProfile(profile.links || []));
  }, [profile?.id, profile?.links, reset]);

  useEffect(() => {
    if (!profile?.id) return;
    if (isLinksDirty) {
      writeDashboardDraft("links", profile.id, { links: watchedLinks || [] });
    } else {
      clearDashboardDraft("links", profile.id);
    }
  }, [isLinksDirty, profile?.id, watchedLinks]);

  return (
    <form
      id="dashboard-form"
      ref={formRef}
      onSubmit={handleSubmit(onSubmit, () => {
        toast.error("Please fix the highlighted fields before saving.");
      })}
    >
      <SectionHeading title="Links" description="Add the places people can find your work and connect with you." />

      {sectionError && (
        <div className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-[0.8rem] flex items-center gap-2">
          <AlertCircle size={14} className="shrink-0" />
          <span>{sectionError}</span>
        </div>
      )}

      <div className="mb-4">
        {fields.length === 0 && (
          <EmptySectionState message="Add your social profiles, personal site, or other places where people can find your work." />
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
            reset={reset}
            profile={profile}
          />
        ))}
      </div>

      <AddItemPanel title="Add another link" buttonLabel="Add link" onClick={() => append({ label: "", url: "", isenable: true })} />
    </form>
  );
}
