'use client'

import {
    type Control,
    type FieldArrayWithId,
    type FieldErrors,
    type UseFieldArrayRemove,
    type UseFieldArrayInsert,
    type UseFormGetValues,
    type UseFormRegister,
    type UseFormReset,
    type UseFormSetValue,
    useWatch
} from 'react-hook-form'

import { hasFieldArrayErrors } from "@/lib/utils/utils";
import { useCreateSkills } from "@/hooks/skills";
import { Trash2, Pencil, Check, Loader2 } from 'lucide-react'
import { SkillsSchema } from '@/lib/schemas/skills';
import { useEffect, useState } from 'react';
import { writeDashboardDraft } from '@/lib/cache/dashboard-drafts';
import toast from 'react-hot-toast';
import { Switch } from "@/components/ui/switch";

export function SkillCard({
    field,
    index,
    control,
    register,
    errors,
    remove,
    insert,
    setValue,
    getValues,
    reset,
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
    reset: UseFormReset<SkillsSchema>;
    profile?: { id?: string; skills?: string[] | null };
}) {
    const [isEditing, setIsEditing] = useState(
        () => !field?.value,
    );

    const createSkills = useCreateSkills();

    const [savedSnapshot, setSavedSnapshot] = useState<{
        value: string;
        isenable: boolean;
    } | null>(() => {
        if (!field.value) {
            return null;
        }
        return {
            value: field.value,
            isenable: field.isenable ?? true,
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
        isenable: values?.isenable ?? true,
    };

    const updateSkillsDraft = (skills: SkillsSchema["skills"]) => {
        if (profile?.id) {
            writeDashboardDraft("skills", profile.id, { skills: skills || [] });
        }
    };

    const onSaveSkill = async (newIsenable?: boolean) => {
        if (!profile?.id) {
            toast.error("Profile not loaded.");
            return;
        }

        const isenableToSave = newIsenable !== undefined ? newIsenable : normalizedValues.isenable;

        if (!normalizedValues.value) {
            toast.error("Please enter a skill name before saving.");
            return;
        }

        setSaving(true);
        const toastId = toast.loading("Saving skill...");
        try {
            const currentSkills = getValues("skills") || [];
            const updatedSkills = currentSkills.map((s, i) =>
                i === index ? { value: normalizedValues.value, isenable: isenableToSave } : s,
            ).filter((s) => s.value);

            await createSkills.mutateAsync({
                userId: profile.id,
                skills: updatedSkills,
            });

            const savedSkill = { value: normalizedValues.value, isenable: isenableToSave };
            setValue(`skills.${index}.value`, savedSkill.value, { shouldDirty: false });
            setValue(`skills.${index}.isenable`, savedSkill.isenable, { shouldDirty: false });

            updateSkillsDraft(updatedSkills);
            setSavedSnapshot(savedSkill);
            setIsEditing(false);
            toast.success("Skill saved successfully!", { id: toastId });
        } catch (error) {
            console.error("Error saving skill:", error);
            toast.error("An error occurred while saving the skill.", { id: toastId });
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
            reset({ skills: nextSkills }, { keepDirty: false });
            return;
        }

        remove(index);
        updateSkillsDraft(nextSkills);
        setDeleting(true);
        const toastId = toast.loading("Deleting skill...");

        try {
            await createSkills.mutateAsync({
                userId: profile.id,
                skills: nextSkills.filter((s) => s.value),
            });
            reset({ skills: nextSkills }, { keepDirty: false });
            toast.success("Skill deleted successfully!", { id: toastId });
        } catch (error) {
            if (deletedSkill) {
                insert(index, deletedSkill);
                updateSkillsDraft(currentSkills);
            }
            console.error("Error deleting skill:", error);
            toast.error("An error occurred while deleting the skill.", { id: toastId });
        } finally {
            setDeleting(false);
        }
    };

    const onCancelEditing = () => {
        if (!savedSnapshot) {
            const currentSkills = getValues("skills") || [];
            const nextSkills = currentSkills.filter((_, i) => i !== index);
            updateSkillsDraft(nextSkills);
            remove(index);
            reset({ skills: nextSkills }, { keepDirty: false });
            return;
        }

        setValue(`skills.${index}.value`, savedSnapshot.value, { shouldDirty: false });
        setValue(`skills.${index}.isenable`, savedSnapshot.isenable, { shouldDirty: false });
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
        setValue(`skills.${index}.isenable`, normalizedValues.isenable, { shouldDirty: true });
        setIsEditing(false);
    };

    const handleVisibilityToggle = async (checked: boolean) => {
        setValue(`skills.${index}.isenable`, checked, { shouldDirty: false });
        await onSaveSkill(checked);
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
                        className="inline-flex items-center gap-1 px-2.5 h-7 rounded-lg border border-(--lf-border) bg-transparent text-(--lf-muted) text-[0.72rem] cursor-pointer hover:text-(--lf-ink) hover:border-(--lf-muted) transition-all duration-150 font-sans"
                    >
                        <Pencil size={10} />
                        Edit
                    </button>
                    <Switch
                        checked={normalizedValues.isenable}
                        onCheckedChange={handleVisibilityToggle}
                        disabled={deleting || saving || !savedSnapshot}
                        aria-label={
                            normalizedValues.isenable
                                ? "Hide skill from profile"
                                : "Show skill on profile"
                        }
                    />
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
