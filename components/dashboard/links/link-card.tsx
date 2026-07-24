  import {useWatch, type Control,
  type FieldArrayWithId,
  type FieldErrors,
  type UseFieldArrayInsert,
  type UseFieldArrayRemove,
  type UseFormGetValues,
  type UseFormRegister,
  type UseFormSetValue,
} from "react-hook-form";
import {useEffect, useState} from 'react';
import {Trash2, Pencil, Check, Link2, Loader2 } from "lucide-react";
import { useCreateLink, useDeleteLink } from "@/hooks/link";
import { hasFieldArrayErrors } from "@/lib/utils";
import { LinksProfile } from "@/lib/utils/links";
import {isValidUrl} from "@/lib/utils/links";
import { detectType } from "@/lib/utils/links";
import {LinksSchema} from "@/lib/schemas/links";
import { writeDashboardDraft } from "@/lib/cache/dashboard-drafts";
import toast from "react-hot-toast";
import { Switch } from "@/components/ui/switch";
import { useUpdateVisibility } from "@/hooks/visibility";

export function LinkCard({
  field,
  index,
  control,
  register,
  errors,
  profile,
  remove,
  insert,
  setValue,
  getValues,
}: {
  field: FieldArrayWithId<LinksSchema, "links", "fieldId">;
  index: number;
  control: Control<LinksSchema>;
  register: UseFormRegister<LinksSchema>;
  errors: FieldErrors<LinksSchema>;
  profile?: LinksProfile;
  remove: UseFieldArrayRemove;
  insert: UseFieldArrayInsert<LinksSchema, "links">;
  setValue: UseFormSetValue<LinksSchema>;
  getValues: UseFormGetValues<LinksSchema>;
}) {
  const [isEditing, setIsEditing] = useState(
    () => !(field?.label || field?.url),
  );
  const [savedSnapshot, setSavedSnapshot] = useState<{
    id?: string;
    label: string;
    url: string;
    isenable: boolean;
  } | null>(() => {
    const profileLink = profile?.links?.find((link) => link.id === field.id);
    const label = profileLink?.label || field.label || "";
    const url = profileLink?.url || field.url || "";
    const isenable = profileLink?.isenable ?? field.isenable ?? true;

    if (!field.id && !label && !url) {
      return null;
    }

    return {
      id: field.id || undefined,
      label,
      url,
      isenable,
    };
  });
  const values = useWatch({ control, name: `links.${index}` });
  const hasErrors = hasFieldArrayErrors(errors, "links", index);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const createLink = useCreateLink();
  const deleteLink = useDeleteLink();
  const updateVisibility = useUpdateVisibility();


  useEffect(() => {
    const profileLink = profile?.links?.find((l) => l.id === field.id);
    if (!profileLink || !field.id) return;
    setSavedSnapshot({
      id: profileLink.id || undefined,
      label: profileLink.label || "",
      url: profileLink.url || "",
      isenable: profileLink.isenable ?? true,
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile?.links]);

  useEffect(() => {
    if (hasErrors) {
      setIsEditing(true);
    }
  }, [hasErrors]);

  const normalizedValues = {
    id: values?.id,
    label: values?.label?.trim() || "",
    url: values?.url?.trim() || "",
    isenable: values?.isenable ?? true,
  };
  const hasUnsavedChanges =
    !savedSnapshot ||
    normalizedValues.id !== savedSnapshot.id ||
    normalizedValues.label !== savedSnapshot.label ||
    normalizedValues.url !== savedSnapshot.url;

  const updateLinksDraft = (links: LinksSchema["links"]) => {
    if (profile?.id) {
      writeDashboardDraft("links", profile.id, { links: links || [] });
    }
  };

  const validateLink = () => {
    if (!normalizedValues.label && !normalizedValues.url) {
      toast.error("Add a label or URL before saving this link.");
      return false;
    }

    if (!isValidUrl(normalizedValues.url)) {
      toast.error("Please enter a valid URL before saving this link.");
      return false;
    }

    return true;
  };

  const onDoneEditing = () => {
    if (!validateLink()) {
      return;
    }

    setValue(`links.${index}.label`, normalizedValues.label, {
      shouldDirty: true,
    });
    setValue(`links.${index}.url`, normalizedValues.url, {
      shouldDirty: true,
    });
    setSavedSnapshot(normalizedValues);
    setIsEditing(false);
  };

  const onCancelEditing = () => {
    if (!savedSnapshot) {
      const currentLinks = getValues("links") || [];
      updateLinksDraft(
        currentLinks.filter((_, linkIndex) => linkIndex !== index),
      );
      remove(index);
      return;
    }

    setValue(`links.${index}.id`, savedSnapshot.id, { shouldDirty: false });
    setValue(`links.${index}.label`, savedSnapshot.label, {
      shouldDirty: false,
    });
    setValue(`links.${index}.url`, savedSnapshot.url, { shouldDirty: false });
    setValue(`links.${index}.isenable`, savedSnapshot.isenable, { shouldDirty: false });
    const currentLinks = getValues("links") || [];
    updateLinksDraft(
      currentLinks.map((link, linkIndex) =>
        linkIndex === index ? { ...link, ...savedSnapshot } : link,
      ),
    );
    setIsEditing(false);
  };

  const onSaveLink = async () => {
    if (!profile?.id) {
      toast.error("Profile not loaded.");
      return;
    }

    if (!validateLink()) {
      return;
    }

    setSaving(true);
    const linkType = detectType(normalizedValues.url);
    try {
      const payload = await createLink.mutateAsync({
        link: {
          id: normalizedValues.id,
          label: normalizedValues.label,
          url: normalizedValues.url,
          type: linkType,
          isenable: normalizedValues.isenable,
        },
        profileId: profile?.id,
      });

      const savedLink = {
        id: payload?.data?.id || normalizedValues.id,
        label: payload?.data?.label || normalizedValues.label,
        url: payload?.data?.url || normalizedValues.url,
        isenable: payload?.data?.isenable ?? normalizedValues.isenable,
      };

      setValue(`links.${index}.id`, savedLink.id, { shouldDirty: false });
      setValue(`links.${index}.label`, savedLink.label, {
        shouldDirty: false,
      });
      setValue(`links.${index}.url`, savedLink.url, { shouldDirty: false });
      setValue(`links.${index}.isenable`, savedLink.isenable, { shouldDirty: false });
      const currentLinks = getValues("links") || [];
      updateLinksDraft(
        currentLinks.map((link, linkIndex) =>
          linkIndex === index ? { ...link, ...savedLink } : link,
        ),
      );
      setSavedSnapshot(savedLink);
      setIsEditing(false);
      toast.success("Link saved successfully!");
    } catch (error) {
      console.error("Error saving link:", error);
      toast.error("An error occurred while saving the link.");
    } finally {
      setSaving(false);
    }
  };

  const onDeleteLink = async () => {
    const currentLinks = getValues("links") || [];
    const deletedLink = currentLinks[index];
    const nextLinks = currentLinks.filter((_, linkIndex) => linkIndex !== index);

    if (!normalizedValues.id) {
      remove(index);
      updateLinksDraft(nextLinks);
      return;
    }

    remove(index);
    updateLinksDraft(nextLinks);
    setDeleting(true);
    try {
      await deleteLink.mutateAsync(normalizedValues.id);
      toast.success("Link deleted successfully!");
    } catch (error) {
      if (deletedLink) {
        insert(index, deletedLink);
        updateLinksDraft(currentLinks);
      }
      console.error("Error deleting link:", error);
      toast.error("An error occurred while deleting the link.");
    } finally {
      setDeleting(false);
    }
  };

  const handleVisibilityChange = async (isenable: boolean) => {
    if (!normalizedValues.id) {
      toast.error("Save this link before changing visibility.");
      return;
    }

    const previousValue = normalizedValues.isenable;
    const loadingToast = toast.loading(
      isenable ? "Showing link on profile..." : "Hiding link from profile...",
    );
    setValue(`links.${index}.isenable`, isenable, { shouldDirty: false });

    try {
      await updateVisibility.mutateAsync({
        target: "link",
        id: normalizedValues.id,
        isenable,
      });
      const currentLinks = getValues("links") || [];
      updateLinksDraft(
        currentLinks.map((link, linkIndex) =>
          linkIndex === index ? { ...link, isenable } : link,
        ),
      );
      setSavedSnapshot((snapshot) =>
        snapshot ? { ...snapshot, isenable } : snapshot,
      );
      toast.success(isenable ? "Link shown on profile." : "Link hidden from profile.", {
        id: loadingToast,
      });
    } catch (error) {
      setValue(`links.${index}.isenable`, previousValue, { shouldDirty: false });
      console.error("Error updating link visibility:", error);
      toast.error("Could not update link visibility.", { id: loadingToast });
    }
  };

  if (!isEditing) {
    return (
      <div className="group flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border border-(--lf-border) rounded-xl px-4 py-3 bg-(--lf-surface) mb-2.5 transition-colors duration-150 hover:border-(--lf-muted)">
        <div className="flex items-center gap-3 min-w-0 w-full sm:w-auto">
          <div className="w-7 h-7 rounded-lg bg-(--lf-border) flex items-center justify-center shrink-0">
            <Link2 size={12} className="text-(--lf-muted)" />
          </div>
          <div className="min-w-0">
            <div className="text-[0.82rem] font-medium text-(--lf-ink) font-sans truncate">
              {values?.label || (
                <span className="text-(--lf-muted) italic">Untitled</span>
              )}
            </div>
            <div className="text-[0.72rem] text-(--lf-muted) font-mono truncate">
              {values?.url || "—"}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end flex-wrap gap-1.5 shrink-0 w-full sm:w-auto">
          <button
            type="button"
            onClick={onDeleteLink}
            disabled={deleting || saving}
            className="inline-flex items-center gap-1 px-2.5 h-7 rounded-lg border border-transparent text-(--lf-muted) cursor-pointer hover:text-[#b91c1c] hover:bg-[#b91c1c]/5 hover:border-[#b91c1c]/15 dark:hover:text-[#f87171] dark:hover:bg-[#f87171]/8 dark:hover:border-[#f87171]/20 transition-all duration-150 text-[0.72rem] font-sans"
          >
            {deleting ? <Loader2 size={10} className="animate-spin" /> : <Trash2 size={10} />}
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
            aria-label={normalizedValues.isenable ? "Hide link from profile" : "Show link on profile"}
          />
          {hasUnsavedChanges && (
            <button
              type="button"
              onClick={onSaveLink}
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
    <div className="border border-(--lf-border) rounded-xl px-4 sm:px-5 py-4 bg-(--lf-surface) mb-2.5 transition-colors duration-150 hover:border-(--lf-muted)">
      <div className="flex items-start justify-between gap-3.5">
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-[1fr_2fr] gap-3.5">
          <div className="flex flex-col gap-1.25">
            <label className="text-[0.7rem] text-(--lf-muted) font-mono tracking-wider">
              Label
            </label>
            <input
              {...register(`links.${index}.label`)}
              className="bg-(--lf-bg) border border-(--lf-border) rounded-lg px-3 py-2 text-(--lf-ink) text-[0.85rem] outline-none w-full font-sans transition-colors duration-150 focus:border-(--lf-muted)"
              placeholder="X"
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
      </div>

      <div className="flex items-center justify-between mt-3.5">
        <button
          type="button"
          onClick={onCancelEditing}
          disabled={saving}
          className="inline-flex items-center border-slate-400 gap-1.25 px-2.5 h-7 rounded-lg bg-transparent border  text-(--lf-muted) text-[0.72rem] cursor-pointer hover:text-[#b91c1c] hover:bg-[#b91c1c]/5 hover:border-[#b91c1c]/15 dark:hover:text-[#f87171] dark:hover:bg-[#f87171]/8 dark:hover:border-[#f87171]/20 transition-all duration-150"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onDoneEditing}
          disabled={saving}
          className="inline-flex items-center gap-1.5 px-3 h-7 rounded-lg bg-(--lf-ink) text-(--lf-bg) text-[0.72rem] font-semibold cursor-pointer hover:opacity-82 transition-opacity duration-150 font-sans border-none"
        >
          <Check size={11} strokeWidth={2.5} />
          Done
        </button>
      </div>
    </div>
  );
}
