"use client";

import { RefObject, useEffect, useMemo, useState } from "react";
import {
  useFieldArray,
  useForm,
  useWatch,
  type Control,
  type FieldArrayWithId,
  type FieldErrors,
  type UseFieldArrayRemove,
  type UseFormRegister,
  type UseFormSetValue,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2, Pencil, Check, BookOpen, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { blogsSchema, BlogsSchema } from "@/schemas/blogs";
import { useCreateBlog, useDeleteBlog } from "@/hooks/blog";
import {
  readDashboardDraft,
  writeDashboardDraft,
} from "@/lib/dashboard-drafts";

type ProfileBlog = {
  id?: string | null;
  title?: string | null;
  description?: string | null;
  blogLink?: string | null;
  enddate?: string | Date | null;
};

type Props = {
  profile?: BlogsProfile;
  formRef: RefObject<HTMLFormElement | null>;
  onSubmit?: (data: BlogsSchema) => void | Promise<void>;
};

type BlogsProfile = {
  id?: string;
  blogs?: ProfileBlog[];
};

function blogsFromProfile(blogs: ProfileBlog[] = []): BlogsSchema {
  return {
    blogs: blogs.map((blog) => ({
      id: blog.id || undefined,
      title: blog.title ?? "",
      description: blog.description ?? "",
      blogLink: blog.blogLink ?? "",
      enddate: blog.enddate ? String(blog.enddate) : "",
    })),
  };
}

function getInitialBlogs(profile?: BlogsProfile): BlogsSchema {
  return (
    readDashboardDraft<BlogsSchema>("blogs", profile?.id) ||
    blogsFromProfile(profile?.blogs || [])
  );
}

function isValidUrl(value?: string) {
  if (!value?.trim()) {
    return true;
  }

  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

function BlogCard({
  field,
  index,
  control,
  register,
  errors,
  remove,
  profile,
  setValue,
}: {
  field: FieldArrayWithId<BlogsSchema, "blogs", "fieldId">;
  index: number;
  control: Control<BlogsSchema>;
  register: UseFormRegister<BlogsSchema>;
  errors: FieldErrors<BlogsSchema>;
  remove: UseFieldArrayRemove;
  profile?: BlogsProfile;
  setValue: UseFormSetValue<BlogsSchema>;
}) {
  const [confirmed, setConfirmed] = useState(() => !!(field?.title || field?.blogLink));
  const values = useWatch({ control, name: `blogs.${index}` });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const createBlog = useCreateBlog();
  const deleteBlog = useDeleteBlog();

  const onSaveBlog = async () => {
    if (!profile?.id) {
      toast.error("Profile not loaded.");
      return;
    }

    const hasContent = [
      values?.title,
      values?.description,
      values?.blogLink,
      values?.enddate,
    ].some((value) => value?.trim());

    if (!hasContent) {
      toast.error("Add blog details before saving this post.");
      return;
    }

    if (!isValidUrl(values?.blogLink)) {
      toast.error("Please enter a valid URL before saving this post.");
      return;
    }

    setSaving(true);
    try {
      const payload = await createBlog.mutateAsync({
        blog: {
          id: values?.id,
          title: values?.title?.trim() || "",
          description: values?.description?.trim() || "",
          blogLink: values?.blogLink?.trim() || "",
          enddate: values?.enddate?.trim() || "",
        },
        profileId: profile.id,
      });

      if (payload?.data?.id) {
        setValue(`blogs.${index}.id`, payload.data.id, { shouldDirty: true });
      }

      toast.success("Blog saved successfully!");
      setConfirmed(true);
    } catch (error) {
      console.error("Error saving blog:", error);
      toast.error("An error occurred while saving the blog.");
    } finally {
      setSaving(false);
    }
  };

  const onDeleteBlog = async () => {
    if (!values?.id) {
      remove(index);
      return;
    }

    setDeleting(true);
    try {
      await deleteBlog.mutateAsync(values.id as string);
      toast.success("Blog deleted successfully!");
      remove(index);
    } catch (error) {
      console.error("Error deleting blog:", error);
      toast.error("An error occurred while deleting the blog.");
    } finally {
      setDeleting(false);
    }
  };

  if (confirmed) {
    return (
      <div className="group flex items-start justify-between gap-3 border border-(--lf-border) rounded-xl px-4 py-3.5 bg-(--lf-surface) mb-2.5 transition-colors duration-150 hover:border-(--lf-muted)">
        <div className="flex items-start gap-3 min-w-0 flex-1">
          <div className="w-7 h-7 rounded-lg bg-(--lf-border) flex items-center justify-center shrink-0 mt-0.5">
            <BookOpen size={12} className="text-(--lf-muted)" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[0.82rem] font-medium text-(--lf-ink) font-sans">
              {values?.title || <span className="text-(--lf-muted) italic">Untitled Post</span>}
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
        <div className={`flex items-center gap-1.5 shrink-0 transition-opacity duration-150 ${deleting ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
          <button
            type="button"
            onClick={() => setConfirmed(false)}
            disabled={deleting}
            className="inline-flex items-center gap-1 px-2.5 h-[28px] rounded-lg border border-(--lf-border) bg-transparent text-(--lf-muted) text-[0.72rem] cursor-pointer hover:text-(--lf-ink) hover:border-(--lf-muted) transition-all duration-150 font-sans"
          >
            <Pencil size={10} />
            Edit
          </button>
          <button
            type="button"
            onClick={onDeleteBlog}
            disabled={deleting}
            className="inline-flex items-center justify-center w-[28px] h-[28px] rounded-lg border border-transparent text-(--lf-muted) cursor-pointer hover:text-[#b91c1c] hover:bg-[#b91c1c]/5 hover:border-[#b91c1c]/15 dark:hover:text-[#f87171] dark:hover:bg-[#f87171]/8 dark:hover:border-[#f87171]/20 transition-all duration-150"
            aria-label="Remove blog post"
          >
            {deleting ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
          </button>
        </div>
      </div>
    );
  }

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
            placeholder="My latest article"
          />
          {errors.blogs?.[index]?.title?.message && (
            <div className="text-[0.72rem] text-[#b91c1c]">
              {errors.blogs[index]?.title?.message as string}
            </div>
          )}
        </div>

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

        <div className="flex flex-col gap-1.25 mb-1.5">
          <label className="text-[0.7rem] text-(--lf-muted) font-mono tracking-wider">
            End date
          </label>
          <input
            {...register(`blogs.${index}.enddate`)}
            className="bg-(--lf-bg) border border-(--lf-border) rounded-lg px-3 py-2 text-(--lf-ink) text-[0.85rem] outline-none w-full font-sans transition-colors duration-150 focus:border-(--lf-muted)"
            placeholder="e.g. 2026-03-01"
          />
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
        </div>
      </div>

      <div className="flex items-center justify-between mt-4">
        <button
          type="button"
          onClick={() => (values?.id ? setConfirmed(true) : remove(index))}
          disabled={saving}
          className="inline-flex items-center gap-[5px] px-2.5 h-[28px] rounded-lg bg-transparent border border-transparent text-(--lf-muted) text-[0.72rem] cursor-pointer hover:text-[#b91c1c] hover:bg-[#b91c1c]/5 hover:border-[#b91c1c]/15 dark:hover:text-[#f87171] dark:hover:bg-[#f87171]/8 dark:hover:border-[#f87171]/20 transition-all duration-150"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onSaveBlog}
          disabled={saving}
          className="inline-flex items-center gap-1.5 px-3 h-[28px] rounded-lg bg-(--lf-ink) text-(--lf-bg) text-[0.72rem] font-semibold cursor-pointer hover:opacity-82 transition-opacity duration-150 font-sans border-none"
        >
          {saving ? (
            <Loader2 size={11} className="animate-spin" />
          ) : (
            <Check size={11} strokeWidth={2.5} />
          )}
          {saving ? "Saving..." : "Done"}
        </button>
      </div>
    </div>
  );
}

export default function BlogsForm({ profile, formRef, onSubmit }: Props) {
  const defaultValues = useMemo<BlogsSchema>(() => getInitialBlogs(profile), [profile]);

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors, isDirty },
  } = useForm<BlogsSchema>({
    resolver: zodResolver(blogsSchema),
    defaultValues,
    mode: "onSubmit",
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "blogs",
    keyName: "fieldId",
  });

  const watchedBlogs = useWatch({ control, name: "blogs" });

  useEffect(() => {
    if (!profile?.id) {
      return;
    }

    const cachedDraft = readDashboardDraft<BlogsSchema>("blogs", profile.id);
    reset(cachedDraft || blogsFromProfile(profile.blogs || []));
  }, [profile?.id, profile?.blogs, reset]);

  useEffect(() => {
    if (profile?.id && isDirty) {
      writeDashboardDraft("blogs", profile.id, { blogs: watchedBlogs || [] });
    }
  }, [isDirty, profile?.id, watchedBlogs]);

  return (
    <form
      id="dashboard-form"
      ref={formRef}
      onSubmit={handleSubmit(onSubmit ?? (() => {}), () => {
        toast.error("Please fix the highlighted fields before saving.");
      })}
    >
      <h1 className="font-serif-display text-[1.4rem] font-medium tracking-tight text-(--lf-ink) mb-1">
        Blogs
      </h1>
      <p className="text-[0.78rem] text-(--lf-muted) mb-7">
        Articles and posts you have written
      </p>

      <div className="mb-4">
        {fields.length === 0 && (
          <div className="text-[0.78rem] text-(--lf-muted) mb-2.5">
            No blog posts yet. Add one below.
          </div>
        )}

        {fields.map((f, index) => (
          <BlogCard
            key={f.fieldId}
            field={f}
            index={index}
            control={control}
            register={register}
            errors={errors}
            remove={remove}
            profile={profile}
            setValue={setValue}
          />
        ))}
      </div>

      <div className="border border-(--lf-border) rounded-xl px-5 py-4 bg-(--lf-surface) mb-2.5 transition-colors duration-150 hover:border-(--lf-muted) border-dashed">
        <div className="text-[0.68rem] font-semibold tracking-widest uppercase text-(--lf-muted) font-mono mb-3.5">
          New Post
        </div>
        <button
          type="button"
          onClick={() =>
            append({
              title: "",
              description: "",
              blogLink: "",
              enddate: "",
            })
          }
          className="inline-flex items-center gap-1.5 px-[18px] h-[34px] rounded-[20px] bg-(--lf-ink) text-(--lf-bg) text-[0.78rem] font-semibold border-none cursor-pointer hover:opacity-82 transition-opacity duration-150 font-sans-body whitespace-nowrap"
        >
          <Plus size={12} />
          Add post
        </button>
      </div>
    </form>
  );
}
