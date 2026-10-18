"use client";

import { RefObject, useEffect, useMemo } from "react";
import {
  useFieldArray,
  useForm,
  useWatch,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle } from "lucide-react";
import toast from "react-hot-toast";
import { skillsSchema, SkillsSchema } from "@/lib/schemas/skills";
import { readDashboardDraft, writeDashboardDraft, clearDashboardDraft } from "@/lib/cache/dashboard-drafts";
import { SkillCard } from "./skills-card";
import { parseSkill } from "@/lib/utils/skills";
import { useSectionSave } from "@/hooks/use-section-save";
import { SectionHeading } from "@/components/dashboard/section-heading";
import { AddItemPanel } from "@/components/dashboard/add-item-panel";
import { EmptySectionState } from "@/components/dashboard/empty-section-state";

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
    skills: skills.map((s) => {
      const parsed = parseSkill(s);
      return {
        value: parsed.value,
        isenable: parsed.isenable,
      };
    }),
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

  const watchedSkills = useWatch({ control, name: "skills" });

  const isSkillsDirty = useMemo(() => {
    const current = watchedSkills || [];
    const saved = skillsFromProfile(profile?.skills || []).skills || [];
    const currentNonEmpty = current.filter((s) => (s?.value || "").trim() !== "");
    const savedNonEmpty = saved.filter((s) => (s?.value || "").trim() !== "");

    if (currentNonEmpty.length !== savedNonEmpty.length) {
      return currentNonEmpty.length > savedNonEmpty.length;
    }

    for (let i = 0; i < currentNonEmpty.length; i++) {
      const cur = currentNonEmpty[i];
      const sav = savedNonEmpty[i];
      if (!cur || !sav) continue;
      if (
        (cur.value || "").trim() !== (sav.value || "").trim() ||
        (cur.isenable ?? true) !== (sav.isenable ?? true)
      ) {
        return true;
      }
    }
    return false;
  }, [watchedSkills, profile?.skills]);

  const { error: sectionError } = useSectionSave("skills", {
    isDirty: isSkillsDirty,
    onSave: async () => {
      await handleSubmit(async (data) => {
        if (onSubmit) await onSubmit(data);
      })();
    },
    onDiscard: () => {
      if (profile?.id) clearDashboardDraft("skills", profile.id);
      reset(skillsFromProfile(profile?.skills || []));
    },
  });

  const { fields, append, remove, insert } = useFieldArray({
    control,
    name: "skills",
    keyName: "skillfield",
  });

  useEffect(() => {
    if (!profile?.id) {
      return;
    }

    const cachedDraft = readDashboardDraft<SkillsSchema>("skills", profile.id);
    reset(cachedDraft || skillsFromProfile(profile.skills || []));
  }, [profile?.id, profile?.skills, profile?.skillsIsenable, reset]);

  useEffect(() => {
    if (!profile?.id) return;
    if (isSkillsDirty) {
      writeDashboardDraft("skills", profile.id, { skills: watchedSkills || [] });
    } else {
      clearDashboardDraft("skills", profile.id);
    }
  }, [isSkillsDirty, profile?.id, watchedSkills]);

  return (
    <form
      id="dashboard-form"
      ref={formRef}
      onSubmit={handleSubmit(onSubmit ?? (() => {}), () => {
        toast.error("Please fix the highlighted fields before saving.");
      })}
    >
      <SectionHeading title="Skills" description="Show the technologies and tools you use with confidence." />

      {sectionError && (
        <div className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-[0.8rem] flex items-center gap-2">
          <AlertCircle size={14} className="shrink-0" />
          <span>{sectionError}</span>
        </div>
      )}

      <div className="mb-4">
        {fields.length === 0 && (
          <EmptySectionState message="Add the technologies and tools you want visitors to notice." />
        )}

        <div className="flex w-full flex-col gap-2.5 mb-3">
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
              reset={reset}
              profile={profile}
            />
          ))}
        </div>
      </div>

      <AddItemPanel title="Add a skill" buttonLabel="Add skill" onClick={() => append({ value: "" })} />
    </form>
  );
}
