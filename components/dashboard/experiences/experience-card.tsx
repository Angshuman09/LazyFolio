import { hasFieldArrayErrors } from "@/lib/utils";
import { useState, useEffect } from "react";
import {
  useWatch, type Control,
  type FieldArrayWithId,
  type FieldErrors,
  type UseFieldArrayInsert,
  type UseFieldArrayRemove,
  type UseFormGetValues,
  type UseFormRegister,
  type UseFormSetValue,
  Controller,
} from "react-hook-form";
import { Trash2, Pencil, Check, Briefcase, Loader2 } from 'lucide-react'
import { ExperienceSchema } from "@/lib/schemas/experience";
import { writeDashboardDraft } from "@/lib/cache/dashboard-drafts";
import { useCreateExperience, useDeleteExperience } from "@/hooks/experience";
import toast from "react-hot-toast";
import { ExperienceProfile } from "@/lib/utils/experience";
import { Switch } from "@/components/ui/switch";
import { useUpdateVisibility } from "@/hooks/visibility";
import { DatePicker } from "@/components/ui/date-picker";

export function ExperienceCard({
  field,
  index,
  control,
  register,
  errors,
  getValues,
  setValue,
  remove,
  profile,
  insert
}: {
  field: FieldArrayWithId<ExperienceSchema, "experiences", "experiencefield">;
  index: number;
  control: Control<ExperienceSchema>;
  register: UseFormRegister<ExperienceSchema>;
  errors: FieldErrors<ExperienceSchema>;
  profile?: ExperienceProfile;
  remove: UseFieldArrayRemove;
  insert: UseFieldArrayInsert<ExperienceSchema, "experiences">;
  setValue: UseFormSetValue<ExperienceSchema>;
  getValues: UseFormGetValues<ExperienceSchema>;
}) {
  const [isEditing, setIsEditing] = useState(
    () => !(field?.role || field?.companyName),
  );

  const createExp = useCreateExperience();
  const deleteExp = useDeleteExperience();

  const [savedSnapshot, setSavedSnapshot] = useState<{
    id?: string;
    role: string;
    companyName: string;
    description: string;
    startdate: string;
    enddate: string;
    isenable: boolean;
  } | null>(() => {
    const profileExperience = profile?.experiences?.find((experience) => experience.id === field.id);
    const role = profileExperience?.role || field.role || "";
    const companyName = profileExperience?.companyName || field.companyName || "";
    const description = profileExperience?.description || field.description || "";
    const startdate = profileExperience?.startdate ? String(profileExperience.startdate) : (field.startdate || "");
    const enddate = profileExperience?.enddate ? String(profileExperience.enddate) : (field.enddate || "");
    const isenable = profileExperience?.isenable ?? field.isenable ?? true;

    if (!field.id && !role && !companyName && !description && !startdate && !enddate) {
      return null;
    }

    return {
      id: field.id || undefined,
      role,
      companyName,
      description,
      startdate,
      enddate,
      isenable,
    };
  });

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const updateVisibility = useUpdateVisibility();

  const values = useWatch({ control, name: `experiences.${index}` });
  const hasErrors = hasFieldArrayErrors(errors, "experiences", index);

  // Helper to normalize any date value to YYYY-MM-DD string
  const toYMD = (val: string | Date | null | undefined): string => {
    if (!val) return "";
    const d = new Date(val as string);
    if (isNaN(d.getTime())) return String(val);
    const y = d.getUTCFullYear();
    const m = String(d.getUTCMonth() + 1).padStart(2, "0");
    const day = String(d.getUTCDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };

  // Sync savedSnapshot when profile updates (e.g. after global "Save Changes")
  useEffect(() => {
    const profileExperience = profile?.experiences?.find((e) => e.id === field.id);
    if (!profileExperience || !field.id) return;
    setSavedSnapshot({
      id: profileExperience.id || undefined,
      role: profileExperience.role || "",
      companyName: profileExperience.companyName || "",
      description: profileExperience.description || "",
      startdate: toYMD(profileExperience.startdate as string | Date | null | undefined),
      enddate: toYMD(profileExperience.enddate as string | Date | null | undefined),
      isenable: profileExperience.isenable ?? true,
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile?.experiences]);

  const normalizedValues = {
    id: values?.id,
    role: values?.role || "",
    companyName: values?.companyName || "",
    description: values?.description || "",
    startdate: values?.startdate || "",
    enddate: values?.enddate || "",
    isenable: values?.isenable ?? true,
  };

  const hasUnsavedChanges =
    !savedSnapshot ||
    normalizedValues.id !== savedSnapshot.id ||
    normalizedValues.role !== savedSnapshot.role ||
    normalizedValues.companyName !== savedSnapshot.companyName ||
    normalizedValues.description !== savedSnapshot.description ||
    normalizedValues.startdate !== savedSnapshot.startdate ||
    normalizedValues.enddate !== savedSnapshot.enddate;

  const updateExperienceDraft = (experiences: ExperienceSchema['experiences']) => {
    if (profile?.id) {
      writeDashboardDraft("experience", profile.id, { experiences: experiences || [] });
    }
  }

  const validateExperience = () => {
    if (!normalizedValues.role && !normalizedValues.companyName && !normalizedValues.description
      && !normalizedValues.startdate && !normalizedValues.enddate
    ) {
      toast.error("Add a role or company name or description before saving this experience.");
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!profile?.id) {
      toast.error("profile not loaded");
      return;
    }

    if (!validateExperience()) return;

    setSaving(true);
    try {
      const payload = await createExp.mutateAsync({
        experience: {
          id: normalizedValues.id || undefined,
          role: normalizedValues.role,
          companyName: normalizedValues.companyName,
          description: normalizedValues.description,
          startdate: normalizedValues.startdate,
          enddate: normalizedValues.enddate,
          isenable: normalizedValues.isenable,
        },
        profileId: profile?.id,
      });

      console.log("payload: ", payload);

      const saveExperience = {
        id: payload?.data?.id || normalizedValues.id,
        role: payload?.data?.role || normalizedValues.role,
        companyName: payload?.data?.companyName || normalizedValues.companyName,
        description: payload?.data?.description || normalizedValues.description,
        startdate: payload?.data?.startdate || normalizedValues.startdate,
        enddate: payload?.data?.enddate || normalizedValues.enddate,
        isenable: payload?.data?.isenable ?? normalizedValues.isenable,
      };

      console.log("save experience: ", saveExperience);

      setValue(`experiences.${index}.id`, saveExperience.id, { shouldDirty: false });
      setValue(`experiences.${index}.role`, saveExperience.role, { shouldDirty: false });
      setValue(`experiences.${index}.companyName`, saveExperience.companyName, { shouldDirty: false });
      setValue(`experiences.${index}.description`, saveExperience.description, { shouldDirty: false });
      setValue(`experiences.${index}.startdate`, saveExperience.startdate, { shouldDirty: false });
      setValue(`experiences.${index}.enddate`, saveExperience.enddate, { shouldDirty: false });
      setValue(`experiences.${index}.isenable`, saveExperience.isenable, { shouldDirty: false });

      const currentExperiences = getValues("experiences") || [];
      updateExperienceDraft(
        currentExperiences.map((experience, experienceIndex) =>
          experienceIndex === index ? { ...experience, ...saveExperience } : experience,
        ),
      );
      setSavedSnapshot(saveExperience);
      setIsEditing(false);
      toast.success("Experience saved successfully!");
    } catch (error) {
      console.error("Error saving experience:", error);
      toast.error("An error occurred while saving the experience.");
    } finally {
      setSaving(false);
    }
  }

  const onDeleteExperience = async () => {
    const currentExperiences = getValues("experiences") || [];
    const deleteExperience = currentExperiences[index];
    const nextExperiences = currentExperiences.filter((_, i) => i !== index);

    if (!normalizedValues.id) {
      remove(index);
      updateExperienceDraft(nextExperiences);
      return;
    }

    remove(index);
    updateExperienceDraft(nextExperiences);
    setDeleting(true);
    try {
      await deleteExp.mutateAsync(normalizedValues.id);
      toast.success("Experience deleted successfully!");
    } catch (error) {
      if (deleteExperience) {
        insert(index, deleteExperience);
        updateExperienceDraft(currentExperiences);
      }
      console.error("Error deleting experience:", error);
      toast.error("An error occurred while deleting the experience.");
    } finally {
      setDeleting(false);
    }
  }

  useEffect(() => {
    if (hasErrors) {
      setIsEditing(true);
    }
  }, [hasErrors]);

  const onCancelEditing = () => {
    if (!savedSnapshot) {
      // New unsaved card — remove it entirely
      const currentExperiences = getValues("experiences") || [];
      updateExperienceDraft(
        currentExperiences.filter((_, i) => i !== index),
      );
      remove(index);
      return;
    }

    setValue(`experiences.${index}.id`, savedSnapshot.id, { shouldDirty: false });
    setValue(`experiences.${index}.role`, savedSnapshot.role, { shouldDirty: false });
    setValue(`experiences.${index}.companyName`, savedSnapshot.companyName, { shouldDirty: false });
    setValue(`experiences.${index}.description`, savedSnapshot.description, { shouldDirty: false });
    setValue(`experiences.${index}.startdate`, savedSnapshot.startdate, { shouldDirty: false });
    setValue(`experiences.${index}.enddate`, savedSnapshot.enddate, { shouldDirty: false });
    setValue(`experiences.${index}.isenable`, savedSnapshot.isenable, { shouldDirty: false });

    const currentExperiences = getValues("experiences") || [];
    updateExperienceDraft(
      currentExperiences.map((exp, i) =>
        i === index ? { ...exp, ...savedSnapshot } : exp,
      ),
    );
    setIsEditing(false);
  };

  const onDoneEditing = () => {
    if (!validateExperience()) return;

    setValue(`experiences.${index}.role`, normalizedValues.role, { shouldDirty: true });
    setValue(`experiences.${index}.companyName`, normalizedValues.companyName, { shouldDirty: true });
    setValue(`experiences.${index}.description`, normalizedValues.description, { shouldDirty: true });
    setValue(`experiences.${index}.startdate`, normalizedValues.startdate, { shouldDirty: true });
    setValue(`experiences.${index}.enddate`, normalizedValues.enddate, { shouldDirty: true });
    setSavedSnapshot(normalizedValues);
    setIsEditing(false);
  };

  const handleVisibilityChange = async (isenable: boolean) => {
    if (!normalizedValues.id) {
      toast.error("Save this experience before changing visibility.");
      return;
    }

    const previousValue = normalizedValues.isenable;
    const loadingToast = toast.loading(
      isenable ? "Showing experience on profile..." : "Hiding experience from profile...",
    );
    setValue(`experiences.${index}.isenable`, isenable, { shouldDirty: false });

    try {
      await updateVisibility.mutateAsync({
        target: "experience",
        id: normalizedValues.id,
        isenable,
      });
      const currentExperiences = getValues("experiences") || [];
      updateExperienceDraft(
        currentExperiences.map((experience, experienceIndex) =>
          experienceIndex === index ? { ...experience, isenable } : experience,
        ),
      );
      setSavedSnapshot((snapshot) =>
        snapshot ? { ...snapshot, isenable } : snapshot,
      );
      toast.success(
        isenable ? "Experience shown on profile." : "Experience hidden from profile.",
        { id: loadingToast },
      );
    } catch (error) {
      setValue(`experiences.${index}.isenable`, previousValue, { shouldDirty: false });
      console.error("Error updating experience visibility:", error);
      toast.error("Could not update experience visibility.", { id: loadingToast });
    }
  };

  if (!isEditing) {
    return (
      <div className="group flex items-start justify-between gap-3 border border-(--lf-border) rounded-xl px-4 py-3.5 bg-(--lf-surface) mb-2.5 transition-colors duration-150 hover:border-(--lf-muted)">
        <div className="flex items-start gap-3 min-w-0 flex-1">
          <div className="w-7 h-7 rounded-lg bg-(--lf-border) flex items-center justify-center shrink-0 mt-0.5">
            <Briefcase size={12} className="text-(--lf-muted)" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[0.82rem] font-medium text-(--lf-ink) font-sans">
              {values?.role || (
                <span className="text-(--lf-muted) italic">Untitled Role</span>
              )}
            </div>
            <div className="text-[0.72rem] text-(--lf-muted) font-sans mt-0.5">
              {values?.companyName || "—"}
              {(values?.startdate || values?.enddate) && (
                <span className="ml-2 font-mono opacity-70">
                  {values.startdate}{" "}
                  {values.enddate ? `-> ${values.enddate}` : ""}
                </span>
              )}
            </div>
            {values?.description && (
              <div className="text-[0.72rem] text-(--lf-muted) mt-1 line-clamp-2 leading-relaxed">
                {values.description}
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={onDeleteExperience}
            disabled={deleting || saving}
            className="inline-flex items-center gap-1 px-2.5 h-7 rounded-lg border border-transparent text-(--lf-muted) cursor-pointer hover:text-[#b91c1c] hover:bg-[#b91c1c]/5 hover:border-[#b91c1c]/15 dark:hover:text-[#f87171] dark:hover:bg-[#f87171]/8 dark:hover:border-[#f87171]/20 transition-all duration-150 text-[0.72rem] font-sans"
            aria-label="Remove experience"
          >
            <Trash2 size={12} />
          </button>
          <button
            type="button"
            onClick={() => {
              if (!savedSnapshot) {
                setSavedSnapshot(normalizedValues);
              }
              setIsEditing(true);
            }}
            disabled={deleting || saving}
            className="inline-flex items-center gap-1 px-2.5 h-7 rounded-lg border border-(--lf-border) bg-transparent text-(--lf-muted) text-[0.72rem] cursor-pointer hover:text-(--lf-ink) hover:border-(--lf-muted) transition-all duration-150 font-sans"
          >
            <Pencil size={10} />
            Edit
          </button>
          <Switch
            checked={normalizedValues.isenable}
            onCheckedChange={handleVisibilityChange}
            disabled={deleting || saving || updateVisibility.isPending || !normalizedValues.id}
            aria-label={
              normalizedValues.isenable
                ? "Hide experience from profile"
                : "Show experience on profile"
            }
          />
          {hasUnsavedChanges && (
            <button
              type="button"
              onClick={handleSave}
              disabled={deleting || saving}
              className="inline-flex items-center gap-1.5 px-3 h-7 rounded-lg bg-(--lf-ink) text-(--lf-bg) text-[0.72rem] font-semibold cursor-pointer hover:opacity-82 transition-opacity duration-150 font-sans border-none disabled:cursor-not-allowed disabled:opacity-55"
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
    <div className="border border-(--lf-border) rounded-xl px-5 py-4 bg-(--lf-surface) mb-2.5 transition-colors duration-150 hover:border-(--lf-muted)">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4.5 gap-y-3.5">
        <div className="flex flex-col gap-1.25">
          <label className="text-[0.7rem] text-(--lf-muted) font-mono tracking-wider">Role</label>
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
          <label className="text-[0.7rem] text-(--lf-muted) font-mono tracking-wider">Company</label>
          <input
            {...register(`experiences.${index}.companyName`)}
            className="bg-(--lf-bg) border border-(--lf-border) rounded-lg px-3 py-2 text-(--lf-ink) text-[0.85rem] outline-none w-full font-sans transition-colors duration-150 focus:border-(--lf-muted)"
            placeholder="e.g. Acme Corp"
          />
          {errors.experiences?.[index]?.companyName?.message && (
            <div className="text-[0.72rem] text-[#b91c1c]">
              {errors.experiences[index]?.companyName?.message as string}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-1.25">
          <label className="text-[0.7rem] text-(--lf-muted) font-mono tracking-wider">Start date</label>
          <Controller
            control={control}
            name={`experiences.${index}.startdate`}
            render={({ field }) => (
              <DatePicker
                value={field.value}
                onChange={field.onChange}
                placeholder="Pick start date"
              />
            )}
          />
          {errors.experiences?.[index]?.startdate?.message && (
            <div className="text-[0.72rem] text-[#b91c1c]">
              {errors.experiences[index]?.startdate?.message as string}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-1.25">
          <label className="text-[0.7rem] text-(--lf-muted) font-mono tracking-wider">End date</label>
          <Controller
            control={control}
            name={`experiences.${index}.enddate`}
            render={({ field }) => (
              <DatePicker
                value={field.value}
                onChange={field.onChange}
                placeholder="Pick end date (or current)"
              />
            )}
          />
          {errors.experiences?.[index]?.enddate?.message && (
            <div className="text-[0.72rem] text-[#b91c1c]">
              {errors.experiences[index]?.enddate?.message as string}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-1.25 sm:col-span-2">
          <label className="text-[0.7rem] text-(--lf-muted) font-mono tracking-wider">Description</label>
          <textarea
            {...register(`experiences.${index}.description`)}
            className="bg-(--lf-bg) border border-(--lf-border) rounded-lg px-3 py-2 text-(--lf-ink) text-[0.85rem] outline-none w-full font-sans transition-colors duration-150 focus:border-(--lf-muted) min-h-[90px] resize-vertical"
            placeholder="What did you do?"
          />
          {errors.experiences?.[index]?.description?.message && (
            <div className="text-[0.72rem] text-[#b91c1c]">
              {errors.experiences[index]?.description?.message as string}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between mt-4">
        <button
          type="button"
          onClick={onCancelEditing}
          disabled={saving}
          className="inline-flex items-center gap-[5px] px-2.5 h-[28px] rounded-lg bg-transparent border text-(--lf-muted) text-[0.72rem] cursor-pointer hover:text-[#b91c1c] hover:bg-[#b91c1c]/5 hover:border-[#b91c1c]/15 dark:hover:text-[#f87171] dark:hover:bg-[#f87171]/8 dark:hover:border-[#f87171]/20 transition-all duration-150"
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
