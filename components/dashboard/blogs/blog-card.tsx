'use client'

import { useCreateBlog, useDeleteBlog } from '@/hooks/blog';
import { writeDashboardDraft } from '@/lib/cache/dashboard-drafts';
import { BlogsSchema } from '@/lib/schemas/blogs';
import { BlogsProfile } from '@/lib/types/blogs';
import { hasFieldArrayErrors } from '@/lib/utils';
import { isValidUrl } from '@/lib/utils/links';
import { BookOpen, Check, ExternalLink, Loader2, Pencil, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import {  type FieldArrayWithId,
    type FieldErrors,
    type UseFieldArrayRemove,
    type UseFieldArrayInsert,
    type UseFormGetValues,
    Control,
    Controller,
    UseFormRegister,
    UseFormSetValue,
    useWatch} from 'react-hook-form';
import toast from 'react-hot-toast';
import { Switch } from "@/components/ui/switch";
import { useUpdateVisibility } from "@/hooks/visibility";
import { DatePicker } from "@/components/ui/date-picker";


export function BlogCard({
    field,
    index,
    control,
    register,
    errors,
    remove,
    insert,
    profile,
    setValue,
    getValues,
    onOpenEditor,
  }: {
    field: FieldArrayWithId<BlogsSchema, "blogs", "fieldId">;
    index: number;
    control: Control<BlogsSchema>;
    register: UseFormRegister<BlogsSchema>;
    errors: FieldErrors<BlogsSchema>;
    remove: UseFieldArrayRemove;
    insert: UseFieldArrayInsert<BlogsSchema, "blogs">;
    profile?: BlogsProfile;
    setValue: UseFormSetValue<BlogsSchema>;
    getValues: UseFormGetValues<BlogsSchema>;
    onOpenEditor: (idx: number) => void;
  }) {
    const [isEditing, setIsEditing] = useState(
      () => !(field?.title || field?.blogLink),
    );
  
    const [savedSnapshot, setSavedSnapshot] = useState<{
      id?: string;
      title: string;
      description: string;
      blogLink: string;
      enddate: string;
      content?: string | null;
      isPublished?: boolean;
      isenable: boolean;
      slug?: string | null;
    } | null>(() => {
      if (!field.id) {
        return null;
      }
  
      const profileBlog = profile?.blogs?.find((blog) => blog.id === field.id);
  
      return {
        id: field.id,
        title: profileBlog?.title || field.title || "",
        description: profileBlog?.description || field.description || "",
        blogLink: profileBlog?.blogLink || field.blogLink || "",
        enddate: profileBlog?.enddate ? String(profileBlog.enddate) : (field.enddate || ""),
        content: profileBlog?.content ?? field.content ?? null,
        isPublished: profileBlog?.isPublished ?? field.isPublished ?? false,
        isenable: profileBlog?.isenable ?? field.isenable ?? true,
        slug: profileBlog?.slug ?? field.slug ?? null,
      };
    });
  
    const values = useWatch({ control, name: `blogs.${index}` });
    // console.log("values: ",values);
    const hasErrors = hasFieldArrayErrors(errors, "blogs", index);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const createBlog = useCreateBlog();
    const deleteBlog = useDeleteBlog();
    const updateVisibility = useUpdateVisibility();
  
    useEffect(() => {
      if (hasErrors) {
        setIsEditing(true);
      }
    }, [hasErrors]);
  
    const normalizedValues = {
      id: values?.id,
      title: values?.title || "",
      description: values?.description || "",
      blogLink: values?.blogLink || "",
      enddate: values?.enddate || "",
      content: values?.content ?? null,
      isPublished: values?.isPublished ?? false,
      isenable: values?.isenable ?? true,
      slug: values?.slug ?? null,
    };
  
    const hasUnsavedChanges =
      !savedSnapshot ||
      normalizedValues.id !== savedSnapshot.id ||
      normalizedValues.title !== savedSnapshot.title ||
      normalizedValues.description !== savedSnapshot.description ||
      normalizedValues.blogLink !== savedSnapshot.blogLink ||
      normalizedValues.enddate !== savedSnapshot.enddate ||
      normalizedValues.content !== savedSnapshot.content ||
      normalizedValues.isPublished !== savedSnapshot.isPublished;
  
    const updateBlogsDraft = (blogs: BlogsSchema["blogs"]) => {
      if (profile?.id) {
        writeDashboardDraft("blogs", profile.id, { blogs: blogs || [] });
      }
    };
  
    const onSaveBlog = async () => {
      if (!profile?.id) {
        toast.error("Profile not loaded.");
        return;
      }
  
      if (!normalizedValues.title) {
        toast.error("Add a title before saving this post.");
        return;
      }
  
      const isInternal = normalizedValues.content !== null;
      if (!isInternal && normalizedValues.blogLink && !isValidUrl(normalizedValues.blogLink)) {
        toast.error("Please enter a valid URL before saving this post.");
        return;
      }
  
      setSaving(true);
      try {
        const payload = await createBlog.mutateAsync({
          blog: {
            id: normalizedValues.id || undefined,
            title: normalizedValues.title,
            description: normalizedValues.description,
            blogLink: isInternal ? undefined : normalizedValues.blogLink, // API will overwrite if internal
            enddate: normalizedValues.enddate,
            content: normalizedValues.content,
            isPublished: normalizedValues.isPublished,
            isenable: normalizedValues.isenable,
            slug: normalizedValues.slug,
          },
          profileId: profile.id,
        });
  
        const savedBlog = {
          id: payload?.data?.id || normalizedValues.id,
          title: payload?.data?.title || normalizedValues.title,
          description: payload?.data?.description || normalizedValues.description,
          blogLink: payload?.data?.blogLink || normalizedValues.blogLink,
          enddate: payload?.data?.enddate ? String(payload.data.enddate) : normalizedValues.enddate,
          content: payload?.data?.content ?? normalizedValues.content,
          isPublished: payload?.data?.isPublished ?? normalizedValues.isPublished,
          isenable: payload?.data?.isenable ?? normalizedValues.isenable,
          slug: payload?.data?.slug ?? normalizedValues.slug,
        };
  
        setValue(`blogs.${index}.id`, savedBlog.id, { shouldDirty: false });
        setValue(`blogs.${index}.title`, savedBlog.title, { shouldDirty: false });
        setValue(`blogs.${index}.description`, savedBlog.description, { shouldDirty: false });
        setValue(`blogs.${index}.blogLink`, savedBlog.blogLink, { shouldDirty: false });
        setValue(`blogs.${index}.enddate`, savedBlog.enddate, { shouldDirty: false });
        setValue(`blogs.${index}.content`, savedBlog.content, { shouldDirty: false });
        setValue(`blogs.${index}.isPublished`, savedBlog.isPublished, { shouldDirty: false });
        setValue(`blogs.${index}.isenable`, savedBlog.isenable, { shouldDirty: false });
        setValue(`blogs.${index}.slug`, savedBlog.slug, { shouldDirty: false });
  
        const currentBlogs = getValues("blogs") || [];
        updateBlogsDraft(
          currentBlogs.map((b, i) =>
            i === index ? { ...b, ...savedBlog } : b,
          ),
        );
        setSavedSnapshot(savedBlog);
        setIsEditing(false);
        toast.success("Blog saved successfully!");
      } catch (error) {
        console.error("Error saving blog:", error);
        toast.error("An error occurred while saving the blog.");
      } finally {
        setSaving(false);
      }
    };
  
    const onDeleteBlog = async () => {
      const currentBlogs = getValues("blogs") || [];
      const deletedBlog = currentBlogs[index];
      const nextBlogs = currentBlogs.filter((_, i) => i !== index);
  
      if (!normalizedValues.id) {
        remove(index);
        updateBlogsDraft(nextBlogs);
        return;
      }
  
      remove(index);
      updateBlogsDraft(nextBlogs);
      setDeleting(true);
      try {
        await deleteBlog.mutateAsync(normalizedValues.id);
        toast.success("Blog deleted successfully!");
      } catch (error) {
        if (deletedBlog) {
          insert(index, deletedBlog);
          updateBlogsDraft(currentBlogs);
        }
        console.error("Error deleting blog:", error);
        toast.error("An error occurred while deleting the blog.");
      } finally {
        setDeleting(false);
      }
    };
  
    const onCancelEditing = () => {
      if (!savedSnapshot) {
        const currentBlogs = getValues("blogs") || [];
        updateBlogsDraft(currentBlogs.filter((_, i) => i !== index));
        remove(index);
        return;
      }
  
      setValue(`blogs.${index}.id`, savedSnapshot.id, { shouldDirty: false });
      setValue(`blogs.${index}.title`, savedSnapshot.title, { shouldDirty: false });
      setValue(`blogs.${index}.description`, savedSnapshot.description, { shouldDirty: false });
      setValue(`blogs.${index}.blogLink`, savedSnapshot.blogLink, { shouldDirty: false });
      setValue(`blogs.${index}.enddate`, savedSnapshot.enddate, { shouldDirty: false });
      setValue(`blogs.${index}.content`, savedSnapshot.content, { shouldDirty: false });
      setValue(`blogs.${index}.isPublished`, savedSnapshot.isPublished, { shouldDirty: false });
      setValue(`blogs.${index}.isenable`, savedSnapshot.isenable, { shouldDirty: false });
      setValue(`blogs.${index}.slug`, savedSnapshot.slug, { shouldDirty: false });
  
      const currentBlogs = getValues("blogs") || [];
      updateBlogsDraft(
        currentBlogs.map((b, i) =>
          i === index ? { ...b, ...savedSnapshot } : b,
        ),
      );
      setIsEditing(false);
    };
  
    const onDoneEditing = () => {
      if (!normalizedValues.title) {
        toast.error("Please add a title before completing this blog card.");
        return;
      }
  
      setValue(`blogs.${index}.title`, normalizedValues.title, { shouldDirty: true });
      setValue(`blogs.${index}.description`, normalizedValues.description, { shouldDirty: true });
      setValue(`blogs.${index}.blogLink`, normalizedValues.blogLink, { shouldDirty: true });
      setValue(`blogs.${index}.enddate`, normalizedValues.enddate, { shouldDirty: true });
      setValue(`blogs.${index}.content`, normalizedValues.content, { shouldDirty: true });
      setValue(`blogs.${index}.isPublished`, normalizedValues.isPublished, { shouldDirty: true });
      setValue(`blogs.${index}.slug`, normalizedValues.slug, { shouldDirty: true });
      setIsEditing(false);
    };

    const handleVisibilityChange = async (isenable: boolean) => {
      if (!normalizedValues.id) {
        toast.error("Save this blog before changing visibility.");
        return;
      }

      const previousValue = normalizedValues.isenable;
      const loadingToast = toast.loading(
        isenable ? "Showing blog on profile..." : "Hiding blog from profile...",
      );
      setValue(`blogs.${index}.isenable`, isenable, { shouldDirty: false });

      try {
        await updateVisibility.mutateAsync({
          target: "blog",
          id: normalizedValues.id,
          isenable,
        });
        const currentBlogs = getValues("blogs") || [];
        updateBlogsDraft(
          currentBlogs.map((blog, blogIndex) =>
            blogIndex === index ? { ...blog, isenable } : blog,
          ),
        );
        setSavedSnapshot((snapshot) =>
          snapshot ? { ...snapshot, isenable } : snapshot,
        );
        toast.success(
          isenable ? "Blog shown on profile." : "Blog hidden from profile.",
          { id: loadingToast },
        );
      } catch (error) {
        setValue(`blogs.${index}.isenable`, previousValue, { shouldDirty: false });
        console.error("Error updating blog visibility:", error);
        toast.error("Could not update blog visibility.", { id: loadingToast });
      }
    };
  
    const isInternal = values?.content !== null && values?.content !== undefined;
  
    const setBlogType = (type: "external" | "internal") => {
      if (type === "external") {
        setValue(`blogs.${index}.content`, null, { shouldDirty: true });
      } else {
        setValue(`blogs.${index}.content`, "", { shouldDirty: true });
        setValue(`blogs.${index}.blogLink`, "", { shouldDirty: true });
      }
    };
  
    if (!isEditing) {
      return (
        <div className="group flex items-start justify-between gap-3 border border-(--lf-border) rounded-xl px-4 py-3.5 bg-(--lf-surface) mb-2.5 transition-colors duration-150 hover:border-(--lf-muted)">
          <div className="flex items-start gap-3 min-w-0 flex-1">
            <div className="w-7 h-7 rounded-lg bg-(--lf-border) flex items-center justify-center shrink-0 mt-0.5">
              {isInternal ? (
                <BookOpen size={12} className="text-(--lf-muted)" />
              ) : (
                <ExternalLink size={12} className="text-(--lf-muted)" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 text-[0.82rem] font-medium text-(--lf-ink) font-sans">
                <span>{values?.title || <span className="text-(--lf-muted) italic">Untitled Post</span>}</span>
                {isInternal && (
                  <span className={`text-[0.6rem] font-mono px-2 py-0.25 rounded-full leading-none shrink-0 ${
                    values?.isPublished
                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400"
                      : "bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400"
                  }`}>
                    {values?.isPublished ? "Published" : "Draft"}
                  </span>
                )}
              </div>
              {values?.description && (
                <div className="text-[0.72rem] text-(--lf-muted) mt-0.5 line-clamp-2 leading-relaxed">
                  {values.description}
                </div>
              )}
              {values?.blogLink && (
                <div className="text-[0.68rem] text-(--lf-muted) font-mono mt-1 truncate">
                  {values.blogLink}
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={onDeleteBlog}
              disabled={deleting || saving}
              className="inline-flex items-center justify-center w-[28px] h-[28px] rounded-lg border border-transparent text-(--lf-muted) cursor-pointer hover:text-[#b91c1c] hover:bg-[#b91c1c]/5 hover:border-[#b91c1c]/15 dark:hover:text-[#f87171] dark:hover:bg-[#f87171]/8 dark:hover:border-[#f87171]/20 transition-all duration-150"
              aria-label="Remove blog post"
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
            <Switch
              checked={normalizedValues.isenable}
              onCheckedChange={handleVisibilityChange}
              disabled={deleting || saving || updateVisibility.isPending || !normalizedValues.id}
              aria-label={
                normalizedValues.isenable
                  ? "Hide blog from profile"
                  : "Show blog on profile"
              }
            />
            {hasUnsavedChanges && (
              <button
                type="button"
                onClick={onSaveBlog}
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
      <div className="border border-(--lf-border) rounded-xl px-5 py-4 bg-(--lf-surface) mb-2.5 transition-colors duration-150 hover:border-(--lf-muted)">
        {/* Blog Type Selector */}
        <div className="flex flex-col gap-1.5 mb-4">
          <div className="flex items-center gap-1.5 p-0.5 border border-(--lf-border) rounded-lg bg-(--lf-bg) w-fit">
            <button
              type="button"
              onClick={() => !savedSnapshot && setBlogType("external")}
              disabled={!!savedSnapshot}
              className={`px-3 py-1 rounded-md text-[0.7rem] font-semibold tracking-wide uppercase transition-all ${
                !isInternal
                  ? "bg-(--lf-surface) text-(--lf-ink) shadow-sm"
                  : "text-(--lf-muted) hover:text-(--lf-ink)"
              } ${savedSnapshot ? "cursor-not-allowed" : "cursor-pointer"}`}
            >
              External Link
            </button>
            <button
              type="button"
              onClick={() => !savedSnapshot && setBlogType("internal")}
              disabled={!!savedSnapshot}
              className={`px-3 py-1 rounded-md text-[0.7rem] font-semibold tracking-wide uppercase transition-all ${
                isInternal
                  ? "bg-(--lf-surface) text-(--lf-ink) shadow-sm"
                  : "text-(--lf-muted) hover:text-(--lf-ink)"
              } ${savedSnapshot ? "cursor-not-allowed" : "cursor-pointer"}`}
            >
              Write Article
            </button>
          </div>
          {savedSnapshot && (
            <p className="text-[0.65rem] text-(--lf-muted) font-mono pl-0.5">
              Type cannot be changed after saving. Delete and re-add to switch.
            </p>
          )}
        </div>
  
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4.5 gap-y-3.5">
          <div className="flex flex-col gap-1.25 sm:col-span-2 mb-1.5">
            <label className="text-[0.7rem] text-(--lf-muted) font-mono tracking-wider">
              Title
            </label>
            <input
              {...register(`blogs.${index}.title`)}
              className="bg-(--lf-bg) border border-(--lf-border) rounded-lg px-3 py-2 text-(--lf-ink) text-[0.85rem] outline-none w-full font-sans transition-colors duration-150 focus:border-(--lf-muted)"
              placeholder={isInternal ? "A title for your blog post" : "My latest article"}
            />
            {errors.blogs?.[index]?.title?.message && (
              <div className="text-[0.72rem] text-[#b91c1c]">
                {errors.blogs[index]?.title?.message as string}
              </div>
            )}
          </div>
  
          {isInternal ? (
            <>
              {/* Rich Editor trigger */}
              <div className="flex flex-col gap-1.25 sm:col-span-2">
                <label className="text-[0.7rem] text-(--lf-muted) font-mono tracking-wider">
                  Article Content
                </label>
                <button
                  type="button"
                  onClick={() => onOpenEditor(index)}
                  className="inline-flex items-center justify-center gap-2 w-full px-4 h-10 border border-(--lf-border) rounded-lg bg-(--lf-bg) text-(--lf-ink) text-sm font-medium hover:border-(--lf-muted) transition-all cursor-pointer"
                >
                  <BookOpen size={14} className="text-(--lf-muted)" />
                  {values?.content ? "Edit Content" : "Write Content"}
                  {values?.content ? (
                    <span className="text-xs text-(--lf-muted) font-normal">
                      ({values.content.split(/\s+/).filter(Boolean).length} words)
                    </span>
                  ) : (
                    <span className="text-xs text-(--lf-muted) font-normal italic">
                      (Use Markdown & upload media)
                    </span>
                  )}
                </button>
              </div>
  
              <div className="flex flex-col gap-1.25">
                <label className="text-[0.7rem] text-(--lf-muted) font-mono tracking-wider">
                  Status
                </label>
                <div className="flex items-center gap-2 h-10 px-1">
                  <input
                    type="checkbox"
                    id={`blogs.${index}.isPublished`}
                    {...register(`blogs.${index}.isPublished`)}
                    className="h-4.5 w-4.5 rounded border-(--lf-border) bg-(--lf-bg) text-(--lf-ink) cursor-pointer accent-(--lf-ink)"
                  />
                  <label
                    htmlFor={`blogs.${index}.isPublished`}
                    className="text-xs font-medium text-(--lf-ink) cursor-pointer select-none"
                  >
                    {values?.isPublished ? "Published (Visible on site)" : "Draft"}
                  </label>
                </div>
              </div>
  
              <div className="flex flex-col gap-1.25">
                <label className="text-[0.7rem] text-(--lf-muted) font-mono tracking-wider">
                  Slug Preview
                </label>
                <div className="flex items-center h-10 px-3 bg-(--lf-bg) border border-(--lf-border) rounded-lg text-xs font-mono text-(--lf-muted) select-all truncate">
                  {values?.slug ? `blogs/${values.slug}` : "Will generate on save..."}
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="flex flex-col gap-1.25 mb-1.5">
                <label className="text-[0.7rem] text-(--lf-muted) font-mono tracking-wider">
                  URL
                </label>
                <input
                  {...register(`blogs.${index}.blogLink`)}
                  className="bg-(--lf-bg) border border-(--lf-border) rounded-lg px-3 py-2 text-(--lf-ink) text-[0.85rem] outline-none w-full font-sans transition-colors duration-150 focus:border-(--lf-muted)"
                  placeholder="https://dev.to/you/article"
                />
                {errors.blogs?.[index]?.blogLink?.message && (
                  <div className="text-[0.72rem] text-[#b91c1c]">
                    {errors.blogs[index]?.blogLink?.message as string}
                  </div>
                )}
              </div>
            </>
          )}
  
          <div className="flex flex-col gap-1.25">
            <label className="text-[0.7rem] text-(--lf-muted) font-mono tracking-wider">
              Date
            </label>
            <Controller
              control={control}
              name={`blogs.${index}.enddate`}
              render={({ field }) => (
                <DatePicker
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Pick blog date"
                />
              )}
            />
            {errors.blogs?.[index]?.enddate?.message && (
              <div className="text-[0.72rem] text-[#b91c1c]">
                {errors.blogs[index]?.enddate?.message as string}
              </div>
            )}
          </div>
  
          <div className="flex flex-col gap-1.25 sm:col-span-2">
            <label className="text-[0.7rem] text-(--lf-muted) font-mono tracking-wider">
              Description
            </label>
            <textarea
              {...register(`blogs.${index}.description`)}
              className="bg-(--lf-bg) border border-(--lf-border) rounded-lg px-3 py-2 text-(--lf-ink) text-[0.85rem] outline-none w-full font-sans transition-colors duration-150 focus:border-(--lf-muted) min-h-[90px] resize-vertical"
              placeholder="What is this post about?"
            />
            {errors.blogs?.[index]?.description?.message && (
              <div className="text-[0.72rem] text-[#b91c1c]">
                {errors.blogs[index]?.description?.message as string}
              </div>
            )}
          </div>
        </div>
  
        <div className="flex items-center justify-between mt-4">
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
