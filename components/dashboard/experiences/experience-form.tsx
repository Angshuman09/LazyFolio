"use client";

import { useEffect, useMemo, RefObject } from "react";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle } from "lucide-react";
import toast from "react-hot-toast";
import { experienceSchema, ExperienceSchema } from "@/lib/schemas/experience";
import { writeDashboardDraft, clearDashboardDraft } from "@/lib/cache/dashboard-drafts";
import { ExperienceCard } from "./experience-card";
import {
  experiencesFromProfile,
  getInitialExperiences,
  ExperienceProfile,
} from "@/lib/utils/experience";
import { useSectionSave } from "@/hooks/use-section-save";
import { SectionHeading } from "@/components/dashboard/section-heading";
import { AddItemPanel } from "@/components/dashboard/add-item-panel";
import { EmptySectionState } from "@/components/dashboard/empty-section-state";

type Props = {
  profile?: ExperienceProfile;
  formRef: RefObject<HTMLFormElement | null>;
  onSubmit?: (data: ExperienceSchema) => void;
};

export default function ExperienceForm({ profile, formRef, onSubmit }: Props) {
  
  const initialValues = useMemo(() => getInitialExperiences(profile), [profile]);

  const {
    register,
    handleSubmit,
    control,
    reset,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<ExperienceSchema>({
    resolver: zodResolver(experienceSchema),
    defaultValues: initialValues, 
    mode: "onSubmit",
  });

  const watchedExperiences = useWatch({ control, name: "experiences" });

  const normalizeDate = (value: string | Date | null | undefined) => {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return String(value);
    return date.toISOString().slice(0, 10);
  };

  const isExperienceDirty = useMemo(() => {
    const current = watchedExperiences || [];
    const saved = profile?.experiences || [];
    const savedMap = new Map(saved.map((e) => [e.id, e]));

    for (const item of current) {
      const role = item.role?.trim() || "";
      const companyName = item.companyName?.trim() || "";
      const description = item.description?.trim() || "";
      const startdate = item.startdate || "";
      const enddate = item.enddate || "";
      const isenable = item.isenable ?? true;

      if (!item.id) {
        if (role !== "" || companyName !== "" || description !== "" || startdate !== "" || enddate !== "") {
          return true;
        }
      } else {
        const original = savedMap.get(item.id);
        if (original) {
          if (
            role !== (original.role?.trim() || "") ||
            companyName !== (original.companyName?.trim() || "") ||
            description !== (original.description?.trim() || "") ||
            startdate !== normalizeDate(original.startdate) ||
            enddate !== normalizeDate(original.enddate) ||
            isenable !== (original.isenable ?? true)
          ) {
            return true;
          }
        }
      }
    }
    return false;
  }, [watchedExperiences, profile?.experiences]);

  const { error: sectionError } = useSectionSave("experience", {
    isDirty: isExperienceDirty,
    onSave: async () => {
      await handleSubmit(async (data) => {
        if (onSubmit) await onSubmit(data);
      })();
    },
    onDiscard: () => {
      if (profile?.id) clearDashboardDraft("experience", profile.id);
      reset(experiencesFromProfile(profile?.experiences || []));
    },
  });

  const { fields, append, remove, insert } = useFieldArray({
    control,
    name: "experiences",
    keyName: "experiencefield",
  });

  useEffect(() => {
    if (!profile?.id) return;
    reset(getInitialExperiences({ id: profile.id, experiences: profile.experiences }));
  }, [profile?.id, profile?.experiences, reset]);

  useEffect(() => {
    if (!profile?.id) return;
    if (isExperienceDirty) {
      writeDashboardDraft("experience", profile.id, {
        experiences: watchedExperiences || [],
      });
    } else {
      clearDashboardDraft("experience", profile.id);
    }
  }, [isExperienceDirty, profile?.id, watchedExperiences]);

  return (
    <form
      id="dashboard-form"
      ref={formRef}
      onSubmit={handleSubmit(onSubmit ?? (() => {}), () => {
        toast.error("Please fix the highlighted fields before saving.");
      })}
    >
      <SectionHeading title="Experience" description="Share the roles and work that shaped your professional path." />

      {sectionError && (
        <div className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-[0.8rem] flex items-center gap-2">
          <AlertCircle size={14} className="shrink-0" />
          <span>{sectionError}</span>
        </div>
      )}

      <div className="mb-4">
        {fields.length === 0 && (
          <EmptySectionState message="Add roles, organizations, and a short summary of the work you did." />
        )}

        {fields.map((f, index) => (
          <ExperienceCard
            key={f.experiencefield}
            field={f}
            index={index}
            control={control}
            register={register}
            errors={errors}
            remove={remove}
            getValues={getValues}
            setValue={setValue}
            reset={reset}
            profile={profile}
            insert={insert}
          />
        ))}
      </div>

      <AddItemPanel
        title="Add a role"
        buttonLabel="Add experience"
        onClick={() => append({
              id: "",        
              companyName: "",
              role: "",
              startdate: "",
              enddate: "",
              description: "",
              isenable: true,
            })}
      />
    </form>
  );
}
