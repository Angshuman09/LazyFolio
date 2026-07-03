"use client";

import { RefObject, useEffect, useMemo, useState } from "react";
import {
  useFieldArray,
  useForm,
  useWatch,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import toast from "react-hot-toast";
import { skillsSchema, SkillsSchema } from "@/lib/schemas/skills";
import { readDashboardDraft, writeDashboardDraft } from "@/lib/cache/dashboard-drafts";
import { SkillCard } from "./skills-card";
import { Switch } from "@/components/ui/switch";
import { useUpdateVisibility } from "@/hooks/visibility";

type Props = {
  profile?: {
    id?: string;
    skills?: string[] | null;
    skillsIsenable?: boolean | null;
  };
  formRef: RefObject<HTMLFormElement | null>;
  onSubmit?: (data: SkillsSchema) => void;
};

function skillsFromProfile(skills: string[] = []): SkillsSchema {
  return {
    skills: skills.map((s) => ({
      value: s ?? "",
    })),
  };
}

function getInitialSkills(profile?: { id?: string; skills?: string[] | null }): SkillsSchema {
  return (
    readDashboardDraft<SkillsSchema>("skills", profile?.id) ||
    skillsFromProfile(profile?.skills || [])
  );
}


export default function SkillsForm({ profile, formRef, onSubmit }: Props) {
  const initialValues = useMemo(() => getInitialSkills(profile), [profile]);
  const [optimisticSkillsEnabled, setOptimisticSkillsEnabled] = useState<boolean | null>(null);
  const skillsEnabled = optimisticSkillsEnabled ?? profile?.skillsIsenable ?? true;
  const updateVisibility = useUpdateVisibility();

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    getValues,
    formState: { errors, isDirty },
  } = useForm<SkillsSchema>({
    resolver: zodResolver(skillsSchema),
    defaultValues: initialValues,
    mode: "onSubmit",
  });

  const { fields, append, remove, insert } = useFieldArray({
    control,
    name: "skills",
    keyName: "skillfield",
  });

  const watchedSkills = useWatch({ control, name: "skills" });

  useEffect(() => {
    if (!profile?.id) {
      return;
    }

    const cachedDraft = readDashboardDraft<SkillsSchema>("skills", profile.id);
    reset(cachedDraft || skillsFromProfile(profile.skills || []));
  }, [profile?.id, profile?.skills, profile?.skillsIsenable, reset]);

  useEffect(() => {
    if (profile?.id && isDirty) {
      writeDashboardDraft("skills", profile.id, { skills: watchedSkills || [] });
    }
  }, [isDirty, profile?.id, watchedSkills]);

  const handleSkillsVisibilityChange = async (isenable: boolean) => {
    if (!profile?.id) {
      toast.error("Profile not loaded.");
      return;
    }

    const previousValue = skillsEnabled;
    const loadingToast = toast.loading(
      isenable ? "Showing skills on profile..." : "Hiding skills from profile...",
    );
    setOptimisticSkillsEnabled(isenable);

    try {
      await updateVisibility.mutateAsync({
        target: "skills",
        id: profile.id,
        isenable,
      });
      toast.success(
        isenable ? "Skills shown on profile." : "Skills hidden from profile.",
        { id: loadingToast },
      );
    } catch (error) {
      setOptimisticSkillsEnabled(previousValue);
      console.error("Error updating skills visibility:", error);
      toast.error("Could not update skills visibility.", { id: loadingToast });
    }
  };

  return (
    <form
      id="dashboard-form"
      ref={formRef}
      onSubmit={handleSubmit(onSubmit ?? (() => {}), () => {
        toast.error("Please fix the highlighted fields before saving.");
      })}
    >
      <div className="flex items-start justify-between gap-4 mb-7">
        <div>
          <h1 className="font-serif-display text-[1.4rem] font-medium tracking-tight text-(--lf-ink) mb-1">
            Skills
          </h1>
          <p className="text-[0.78rem] text-(--lf-muted)">
            Technologies and tools you work with
          </p>
        </div>
        <Switch
          checked={skillsEnabled}
          onCheckedChange={handleSkillsVisibilityChange}
          disabled={updateVisibility.isPending || !profile?.id}
          aria-label={skillsEnabled ? "Hide skills from profile" : "Show skills on profile"}
        />
      </div>

      <div className="mb-4">
        {fields.length === 0 && (
          <div className="text-[0.78rem] text-(--lf-muted) mb-4">
            No skills yet. Add one below.
          </div>
        )}

        <div className="flex flex-col gap-2.5 mb-3 max-w-md">
          {fields.map((f, index) => (
            <SkillCard
              key={f.skillfield}
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
