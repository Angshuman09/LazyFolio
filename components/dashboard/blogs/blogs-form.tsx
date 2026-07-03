"use client";

import { useEffect, useMemo, useState } from "react";
import {
  useFieldArray,
  useForm,
  useWatch,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Plus
} from "lucide-react";
import toast from "react-hot-toast";
import { blogsSchema, BlogsSchema } from "@/lib/schemas/blogs";
import {
  readDashboardDraft,
  writeDashboardDraft,
} from "@/lib/cache/dashboard-drafts";
import { Props } from "@/lib/types/blogs";
import { BlogCard } from "./blog-card";
import { MarkdownEditor } from "./markdown-editor";
import { getInitialBlogs, blogsFromProfile } from "@/lib/utils/blogs";

export default function BlogsForm({ profile, formRef, onSubmit }: Props) {
  const defaultValues = useMemo<BlogsSchema>(() => getInitialBlogs(profile), [profile]);
  const [activeEditorIdx, setActiveEditorIdx] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    getValues,
    formState: { errors, isDirty },
  } = useForm<BlogsSchema>({
    resolver: zodResolver(blogsSchema),
    defaultValues,
    mode: "onSubmit",
  });

  const { fields, append, remove, insert } = useFieldArray({
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
    <>
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
              insert={insert}
              profile={profile}
              setValue={setValue}
              getValues={getValues}
              onOpenEditor={(idx) => setActiveEditorIdx(idx)}
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
                content: null,
                isPublished: false,
                isenable: true,
                slug: null,
              })
            }
            className="inline-flex items-center gap-1.5 px-[18px] h-[34px] rounded-[20px] bg-(--lf-ink) text-(--lf-bg) text-[0.78rem] font-semibold border-none cursor-pointer hover:opacity-82 transition-opacity duration-150 font-sans-body whitespace-nowrap"
          >
            <Plus size={12} />
            Add post
          </button>
        </div>
      </form>

      {activeEditorIdx !== null && (
        <MarkdownEditor
          index={activeEditorIdx}
          control={control}
          register={register}
          setValue={setValue}
          onClose={() => setActiveEditorIdx(null)}
        />
      )}
    </>
  );
}
