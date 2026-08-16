'use client'

import { useDeleteBlog } from '@/hooks/blog';
import { writeDashboardDraft } from '@/lib/cache/dashboard-drafts';
import { BlogsSchema } from '@/lib/schemas/blogs';
import { BlogsProfile } from '@/lib/types/blogs';
import { hasFieldArrayErrors } from '@/lib/utils/utils';
import { isValidUrl } from '@/lib/utils/links';
import { BookOpen, Check, ExternalLink, Loader2, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import {  type FieldArrayWithId,
    type FieldErrors,
    type UseFieldArrayRemove,
    type UseFieldArrayInsert,
    type UseFormGetValues,
    type UseFormReset,
    Control,
    UseFormRegister,
    UseFormSetValue,
    useWatch} from 'react-hook-form';
import toast from 'react-hot-toast';
import { Switch } from "@/components/ui/switch";
import { useUpdateVisibility } from "@/hooks/visibility";


export function BlogCard({
    field,
    index,
    control,
    register,
    errors,
    remove,
    insert,
    profile,
    mode = "EXTERNAL",
    draftSection = "blogs",
    setValue,
    getValues,
    reset,
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
    mode?: "INTERNAL" | "EXTERNAL";
    draftSection?: "blogs" | "articles";
    setValue: UseFormSetValue<BlogsSchema>;
    getValues: UseFormGetValues<BlogsSchema>;
    reset: UseFormReset<BlogsSchema>;
    onOpenEditor: (idx: number) => void;
  }) {
    const [isEditingState, setIsEditing] = useState(
      () => !(field?.title || field?.blogLink),
    );
  
    const [savedSnapshot, setSavedSnapshot] = useState<{
      id?: string;
      title: string;
      description: string;
      blogLink: string;
      type: "INTERNAL" | "EXTERNAL";
      content?: string | null;
      isPublished?: boolean;
      isEnabled: boolean;
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
        type: profileBlog?.type ?? field.type ?? mode,
        content: profileBlog?.content ?? field.content ?? null,
        isPublished: profileBlog?.isPublished ?? field.isPublished ?? false,
        isEnabled: profileBlog?.isEnabled ?? field.isEnabled ?? true,
        slug: profileBlog?.slug ?? field.slug ?? null,
      };
    });
  
    const values = useWatch({ control, name: `blogs.${index}` });
    const hasErrors = hasFieldArrayErrors(errors, "blogs", index);
    const isEditing = isEditingState || hasErrors;
    const [deleting, setDeleting] = useState(false);
    const deleteBlog = useDeleteBlog();
    const updateVisibility = useUpdateVisibility();
  
    const normalizedValues = {
      id: values?.id,
      title: values?.title || "",
      description: values?.description || "",
      blogLink: values?.blogLink || "",
      type: values?.type ?? mode,
      content: values?.content ?? null,
      isPublished: values?.isPublished ?? false,
      isEnabled: values?.isEnabled ?? true,
      slug: values?.slug ?? null,
    };
  
    const updateBlogsDraft = (blogs: BlogsSchema["blogs"]) => {
      if (profile?.id) {
        writeDashboardDraft(draftSection, profile.id, { blogs: blogs || [] });
      }
    };
  
    const onDeleteBlog = async () => {
      const currentBlogs = getValues("blogs") || [];
      const deletedBlog = currentBlogs[index];
      const nextBlogs = currentBlogs.filter((_, i) => i !== index);
  
      if (!normalizedValues.id) {
        remove(index);
        updateBlogsDraft(nextBlogs);
        reset({ blogs: nextBlogs }, { keepDirty: false });
        return;
      }
  
      remove(index);
      updateBlogsDraft(nextBlogs);
      setDeleting(true);
      const toastId = toast.loading("Deleting blog...");
      try {
        await deleteBlog.mutateAsync(normalizedValues.id);
        reset({ blogs: nextBlogs }, { keepDirty: false });
        toast.success("Blog deleted successfully!", { id: toastId });
      } catch (error) {
        if (deletedBlog) {
          insert(index, deletedBlog);
          updateBlogsDraft(currentBlogs);
        }
        console.error("Error deleting blog:", error);
        toast.error("An error occurred while deleting the blog.", { id: toastId });
      } finally {
        setDeleting(false);
      }
    };
  
    const onCancelEditing = () => {
      if (!savedSnapshot) {
        const currentBlogs = getValues("blogs") || [];
        const nextBlogs = currentBlogs.filter((_, i) => i !== index);
        updateBlogsDraft(nextBlogs);
        remove(index);
        reset({ blogs: nextBlogs }, { keepDirty: false });
        return;
      }
  
      setValue(`blogs.${index}.id`, savedSnapshot.id, { shouldDirty: false });
      setValue(`blogs.${index}.type`, savedSnapshot.type, { shouldDirty: false });
      setValue(`blogs.${index}.title`, savedSnapshot.title, { shouldDirty: false });
      setValue(`blogs.${index}.description`, savedSnapshot.description, { shouldDirty: false });
      setValue(`blogs.${index}.blogLink`, savedSnapshot.blogLink, { shouldDirty: false });
      setValue(`blogs.${index}.content`, savedSnapshot.content, { shouldDirty: false });
      setValue(`blogs.${index}.isPublished`, savedSnapshot.isPublished, { shouldDirty: false });
      setValue(`blogs.${index}.isEnabled`, savedSnapshot.isEnabled, { shouldDirty: false });
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
        toast.error("Add a title before completing this post.");
        return;
      }
  
      const isInternal = normalizedValues.type === "INTERNAL";
      if (!isInternal && !normalizedValues.blogLink) {
        toast.error("Add a URL before completing this blog link.");
        return;
      }

      if (!isInternal && !isValidUrl(normalizedValues.blogLink)) {
        toast.error("Please enter a valid URL before completing this post.");
        return;
      }
  
      setValue(`blogs.${index}.type`, normalizedValues.type, { shouldDirty: true });
      setValue(`blogs.${index}.title`, normalizedValues.title, { shouldDirty: true });
      setValue(`blogs.${index}.description`, normalizedValues.description, { shouldDirty: true });
      setValue(`blogs.${index}.blogLink`, normalizedValues.blogLink, { shouldDirty: true });
      setValue(`blogs.${index}.content`, normalizedValues.content, { shouldDirty: true });
      setValue(`blogs.${index}.isPublished`, normalizedValues.isPublished, { shouldDirty: true });
      setValue(`blogs.${index}.slug`, normalizedValues.slug, { shouldDirty: true });
      setIsEditing(false);
    };

    const handleVisibilityChange = async (isEnabled: boolean) => {
      if (!normalizedValues.id) {
        toast.error("Save this blog before changing visibility.");
        return;
      }

      const previousValue = normalizedValues.isEnabled;
      const loadingToast = toast.loading(
        isEnabled ? "Showing blog on profile..." : "Hiding blog from profile...",
      );
      setValue(`blogs.${index}.isEnabled`, isEnabled, { shouldDirty: false });

      try {
        await updateVisibility.mutateAsync({
          target: "blog",
          id: normalizedValues.id,
          isenable: isEnabled,
        });
        const currentBlogs = getValues("blogs") || [];
        updateBlogsDraft(
          currentBlogs.map((blog, blogIndex) =>
            blogIndex === index ? { ...blog, isEnabled } : blog,
          ),
        );
        setSavedSnapshot((snapshot) =>
          snapshot ? { ...snapshot, isEnabled } : snapshot,
        );
        toast.success(
          isEnabled ? "Blog shown on profile." : "Blog hidden from profile.",
          { id: loadingToast },
        );
      } catch (error) {
        setValue(`blogs.${index}.isEnabled`, previousValue, { shouldDirty: false });
        console.error("Error updating blog visibility:", error);
        toast.error("Could not update blog visibility.", { id: loadingToast });
      }
    };
  
    if (!isEditing) {
      const isInternal = normalizedValues.type === "INTERNAL";
  
      return (
        <div className="group flex items-start justify-between gap-3 border border-(--lf-border) rounded-xl px-4 py-3.5 bg-(--lf-surface) mb-2.5 transition-colors duration-150 hover:border-(--lf-muted)">
          <div className="flex items-start gap-3 min-w-0 flex-1">
            <div className="w-7 h-7 rounded-lg bg-(--lf-border) flex items-center justify-center shrink-0 mt-0.5">
              <BookOpen size={12} className="text-(--lf-muted)" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[0.82rem] font-medium text-(--lf-ink) font-sans">
                  {values?.title || <span className="text-(--lf-muted) italic">Untitled Post</span>}
                </span>
                <span className={`text-[0.65rem] font-mono px-1.5 py-px rounded-md ${
                  isInternal 
                    ? "bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20" 
                    : "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20"
                }`}>
                  {isInternal ? "Article" : "External Link"}
                </span>
              </div>
              {values?.description && (
                <div className="text-[0.72rem] text-(--lf-muted) mt-0.5 line-clamp-2 leading-relaxed">
                  {values.description}
                </div>
              )}
              <div className="flex items-center gap-2.5 mt-1.5 flex-wrap">
                {!isInternal && values?.blogLink && (
                  <span className="inline-flex items-center gap-1 text-[0.68rem] text-(--lf-muted) font-mono">
                    <ExternalLink size={10} />
                    {values.blogLink}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={onDeleteBlog}
              disabled={deleting}
              className="inline-flex items-center justify-center w-[28px] h-[28px] rounded-lg border border-transparent text-(--lf-muted) cursor-pointer hover:text-[#b91c1c] hover:bg-[#b91c1c]/5 hover:border-[#b91c1c]/15 dark:hover:text-[#f87171] dark:hover:bg-[#f87171]/8 dark:hover:border-[#f87171]/20 transition-all duration-150"
              aria-label="Remove blog post"
            >
              {deleting ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
            </button>
            <button
              type="button"
              onClick={() => {
                if (!savedSnapshot) {
                  setSavedSnapshot(normalizedValues);
                }
                setIsEditing(true);
              }}
              disabled={deleting}
              className="inline-flex items-center gap-1 px-2.5 h-[28px] rounded-lg border border-(--lf-border) bg-transparent text-(--lf-muted) text-[0.72rem] cursor-pointer hover:text-(--lf-ink) hover:border-(--lf-muted) transition-all duration-150 font-sans"
            >
              <Pencil size={10} />
              Edit
            </button>
            <Switch
              checked={normalizedValues.isEnabled}
              onCheckedChange={handleVisibilityChange}
              disabled={deleting || updateVisibility.isPending || !normalizedValues.id}
              aria-label={
                normalizedValues.isEnabled
                  ? "Hide blog from profile"
                  : "Show blog on profile"
              }
            />
          </div>
        </div>
      );
    }
  
    const isInternal = normalizedValues.type === "INTERNAL";

    return (
      <div className="border border-(--lf-border) rounded-xl px-5 py-4 bg-(--lf-surface) mb-2.5 transition-colors duration-150 hover:border-(--lf-muted)">
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
            disabled={deleting}
            className="inline-flex items-center gap-[5px] px-2.5 h-[28px] rounded-lg bg-transparent border border-transparent text-(--lf-muted) text-[0.72rem] cursor-pointer hover:text-[#b91c1c] hover:bg-[#b91c1c]/5 hover:border-[#b91c1c]/15 dark:hover:text-[#f87171] dark:hover:bg-[#f87171]/8 dark:hover:border-[#f87171]/20 transition-all duration-150"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onDoneEditing}
            disabled={deleting}
            className="inline-flex items-center gap-1.5 px-3 h-[28px] rounded-lg bg-(--lf-ink) text-(--lf-bg) text-[0.72rem] font-semibold cursor-pointer hover:opacity-82 transition-opacity duration-150 font-sans border-none"
          >
            <Check size={11} strokeWidth={2.5} />
            Done
          </button>
        </div>
      </div>
    );
  }
