"use client";

import { RefObject, useState, useEffect, useMemo } from "react";
import {
  useFieldArray,
  useForm,
  useWatch,
  type Control,
  type FieldArrayWithId,
  type FieldErrors,
  type UseFieldArrayRemove,
  type UseFieldArrayInsert,
  type UseFormGetValues,
  type UseFormRegister,
  type UseFormSetValue,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2, Pencil, Check, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { skillsSchema, SkillsSchema } from "@/lib/schemas/skills";
import { useCreateSkills } from "@/hooks/skills";
import { readDashboardDraft, writeDashboardDraft } from "@/lib/cache/dashboard-drafts";
import { hasFieldArrayErrors } from "@/lib/utils";

type Props = {
  profile?: {
    id?: string;
    skills?: string[] | null;
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

function SkillCard({
  field,
  index,
  control,
  register,
  errors,
  remove,
  insert,
  setValue,
  getValues,
  profile,
}: {
  field: FieldArrayWithId<SkillsSchema, "skills", "skillfield">;
  index: number;
  control: Control<SkillsSchema>;
  register: UseFormRegister<SkillsSchema>;
  errors: FieldErrors<SkillsSchema>;
  remove: UseFieldArrayRemove;
  insert: UseFieldArrayInsert<SkillsSchema, "skills">;
  setValue: UseFormSetValue<SkillsSchema>;
  getValues: UseFormGetValues<SkillsSchema>;
  profile?: { id?: string; skills?: string[] | null };
}) {
  const [isEditing, setIsEditing] = useState(
    () => !field?.value,
  );

  const createSkills = useCreateSkills();

  const [savedSnapshot, setSavedSnapshot] = useState<{
    value: string;
  } | null>(() => {
    if (!field.value) {
      return null;
    }
    return {
      value: field.value,
    };
  });

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const values = useWatch({ control, name: `skills.${index}` });
  const hasErrors = hasFieldArrayErrors(errors, "skills", index);

  useEffect(() => {
    if (hasErrors) {
      setIsEditing(true);
    }
  }, [hasErrors]);

  const normalizedValues = {
    value: values?.value || "",
  };

  const hasUnsavedChanges =
    !savedSnapshot ||
    normalizedValues.value !== savedSnapshot.value;

  const updateSkillsDraft = (skills: SkillsSchema["skills"]) => {
    if (profile?.id) {
      writeDashboardDraft("skills", profile.id, { skills: skills || [] });
    }
  };

  const onSaveSkill = async () => {
    if (!profile?.id) {
      toast.error("Profile not loaded.");
      return;
    }

    if (!normalizedValues.value) {
      toast.error("Please enter a skill name before saving.");
      return;
    }

    setSaving(true);
    try {
      const currentSkills = getValues("skills") || [];
      const updatedSkills = currentSkills.map((s, i) =>
        i === index ? { value: normalizedValues.value } : s,
      ).filter((s) => s.value);

      await createSkills.mutateAsync({
        userId: profile.id,
        skills: updatedSkills,
      });

      const savedSkill = { value: normalizedValues.value };
      setValue(`skills.${index}.value`, savedSkill.value, { shouldDirty: false });

      updateSkillsDraft(updatedSkills);
      setSavedSnapshot(savedSkill);
      setIsEditing(false);
      toast.success("Skill saved successfully!");
    } catch (error) {
      console.error("Error saving skill:", error);
      toast.error("An error occurred while saving the skill.");
    } finally {
      setSaving(false);
    }
  };

  const onDeleteSkill = async () => {
    if (!profile?.id) {
      toast.error("Profile not loaded.");
      return;
    }

    const currentSkills = getValues("skills") || [];
    const deletedSkill = currentSkills[index];
    const nextSkills = currentSkills.filter((_, i) => i !== index);

    if (!savedSnapshot) {
      remove(index);
      updateSkillsDraft(nextSkills);
      return;
    }

    remove(index);
    updateSkillsDraft(nextSkills);
    setDeleting(true);

    try {
      await createSkills.mutateAsync({
        userId: profile.id,
        skills: nextSkills.filter((s) => s.value),
      });
      toast.success("Skill deleted successfully!");
    } catch (error) {
      if (deletedSkill) {
        insert(index, deletedSkill);
        updateSkillsDraft(currentSkills);
      }
      console.error("Error deleting skill:", error);
      toast.error("An error occurred while deleting the skill.");
    } finally {
      setDeleting(false);
    }
  };

  const onCancelEditing = () => {
    if (!savedSnapshot) {
      const currentSkills = getValues("skills") || [];
      updateSkillsDraft(currentSkills.filter((_, i) => i !== index));
      remove(index);
      return;
    }

    setValue(`skills.${index}.value`, savedSnapshot.value, { shouldDirty: false });
    const currentSkills = getValues("skills") || [];
    updateSkillsDraft(
      currentSkills.map((s, i) =>
        i === index ? { ...s, ...savedSnapshot } : s,
      ),
    );
    setIsEditing(false);
  };

  const onDoneEditing = () => {
    if (!normalizedValues.value) {
      toast.error("Please enter a skill name before completing this card.");
      return;
    }

    setValue(`skills.${index}.value`, normalizedValues.value, { shouldDirty: true });
    setIsEditing(false);
  };

  if (!isEditing) {
    return (
      <div className="group flex items-center justify-between gap-3 border border-(--lf-border) rounded-xl px-4 py-3 bg-(--lf-surface) mb-2.5 transition-colors duration-150 hover:border-(--lf-muted) w-full">
        <div className="min-w-0">
          <span className="text-[0.82rem] font-mono text-(--lf-ink) font-medium">
            {values?.value || <span className="text-(--lf-muted) italic">Unnamed Skill</span>}
          </span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={onDeleteSkill}
            disabled={deleting || saving}
            className="inline-flex items-center justify-center w-[28px] h-[28px] rounded-lg border border-transparent text-(--lf-muted) cursor-pointer hover:text-[#b91c1c] hover:bg-[#b91c1c]/5 hover:border-[#b91c1c]/15 dark:hover:text-[#f87171] dark:hover:bg-[#f87171]/8 dark:hover:border-[#f87171]/20 transition-all duration-150"
            aria-label="Remove skill"
          >
            {deleting ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
          </button>
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            disabled={deleting || saving}
            className="inline-flex items-center gap-1 px-2.5 h-[28px] rounded-lg border border-(--lf-border) bg-transparent text-(--lf-muted) text-[0.72rem] cursor-pointer hover:text-(--lf-ink) hover:border-(--lf-muted) transition-all duration-150 font-sans"
          >
            <Pencil size={10} />
            Edit
          </button>
          {hasUnsavedChanges && (
            <button
              type="button"
              onClick={onSaveSkill}
              disabled={deleting || saving}
              className="inline-flex items-center gap-1.5 px-3 h-[28px] rounded-lg bg-(--lf-ink) text-(--lf-bg) text-[0.72rem] font-semibold cursor-pointer hover:opacity-82 transition-opacity duration-150 font-sans border-none disabled:cursor-not-allowed disabled:opacity-55"
            >
              {saving ? (
                <Loader2 size={11} className="animate-spin" />
              ) : (
                <Check size={11} strokeWidth={2.5} />
              )}
              {saving ? "Saving..." : "Save"}
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="border border-(--lf-border) rounded-xl px-5 py-4 bg-(--lf-surface) mb-2.5 transition-colors duration-150 hover:border-(--lf-muted) w-full">
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
          onClick={onCancelEditing}
          disabled={saving}
          className="inline-flex items-center gap-[5px] px-2.5 h-[28px] rounded-lg bg-transparent border border-transparent text-(--lf-muted) text-[0.72rem] cursor-pointer hover:text-[#b91c1c] hover:bg-[#b91c1c]/5 hover:border-[#b91c1c]/15 dark:hover:text-[#f87171] dark:hover:bg-[#f87171]/8 dark:hover:border-[#f87171]/20 transition-all duration-150"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onDoneEditing}
          disabled={saving}
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
  }, [profile?.id, profile?.skills, reset]);

  useEffect(() => {
    if (profile?.id && isDirty) {
      writeDashboardDraft("skills", profile.id, { skills: watchedSkills || [] });
    }
  }, [isDirty, profile?.id, watchedSkills]);

  return (
    <form
      id="dashboard-form"
      ref={formRef}
      onSubmit={handleSubmit(onSubmit ?? (() => {}), () => {
        toast.error("Please fix the highlighted fields before saving.");
      })}
    >
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
