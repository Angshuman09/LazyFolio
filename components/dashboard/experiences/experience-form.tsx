"use client";

import { useEffect, useMemo, RefObject } from "react";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import toast from "react-hot-toast";
import { experienceSchema, ExperienceSchema } from "@/lib/schemas/experience";
import { readDashboardDraft, writeDashboardDraft } from "@/lib/cache/dashboard-drafts";
import { ExperienceCard } from "./experience-card";
import {
  experiencesFromProfile,
  getInitialExperiences,
  ExperienceProfile,
} from "@/lib/utils/experience";

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
    formState: { errors, isDirty },
  } = useForm<ExperienceSchema>({
    resolver: zodResolver(experienceSchema),
    defaultValues: initialValues, 
    mode: "onSubmit",
  });

  const { fields, append, remove, insert } = useFieldArray({
    control,
    name: "experiences",
    keyName: "experiencefield",
  });

  const watchedExperiences = useWatch({ control, name: "experiences" });

  useEffect(() => {
    if (!profile?.id) return;
    const cached = readDashboardDraft<ExperienceSchema>("experience", profile.id);
    reset(cached || experiencesFromProfile(profile.experiences || []));
  }, [profile?.id, profile?.experiences, reset]);

  useEffect(() => {
    if (profile?.id && isDirty) {
      writeDashboardDraft("experience", profile.id, {
        experiences: watchedExperiences || [],
      });
    }
  }, [isDirty, profile?.id, watchedExperiences]);

  return (
    <form
      id="dashboard-form"
      ref={formRef}
      onSubmit={handleSubmit(onSubmit ?? (() => {}), () => {
        toast.error("Please fix the highlighted fields before saving.");
      })}
    >
      <h1 className="font-serif-display text-[1.4rem] font-medium tracking-tight text-(--lf-ink) mb-1">
        Experience
      </h1>
      <p className="text-[0.78rem] text-(--lf-muted) mb-7">
        Your professional work history
      </p>

      <div className="mb-4">
        {fields.length === 0 && (
          <div className="text-[0.78rem] text-(--lf-muted) mb-2.5">
            No experiences yet. Add one below.
          </div>
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
            profile={profile}
            insert={insert}
          />
        ))}
      </div>

      <div className="border border-(--lf-border) rounded-xl px-5 py-4 bg-(--lf-surface) mb-2.5 transition-colors duration-150 hover:border-(--lf-muted) border-dashed mt-2">
        <div className="text-[0.68rem] font-semibold tracking-widest uppercase text-(--lf-muted) font-mono mb-3.5">
          New Role
        </div>
        <button
          type="button"
          onClick={() =>
            append({
              id: "",        
              companyName: "",
              role: "",
              startdate: "",
              enddate: "",
              description: "",
              isenable: true,
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
