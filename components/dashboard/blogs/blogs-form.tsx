"use client";

import { useEffect, useMemo, useState } from "react";
import {
  useFieldArray,
  useForm,
  useWatch,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Plus,
  AlertCircle
} from "lucide-react";
import toast from "react-hot-toast";
import { blogsSchema, BlogsSchema } from "@/lib/schemas/blogs";
import {
  readDashboardDraft,
  writeDashboardDraft,
  clearDashboardDraft,
} from "@/lib/cache/dashboard-drafts";
import { Props } from "@/lib/types/blogs";
import { BlogCard } from "./blog-card";
import { MarkdownEditor } from "./markdown-editor";
import { getInitialBlogs, blogsFromProfile } from "@/lib/utils/blogs";
import { useSectionSave } from "@/hooks/use-section-save";

export default function BlogsForm({ profile, formRef, onSubmit, mode = "EXTERNAL" }: Props) {
  const isArticleMode = mode === "INTERNAL";
  const draftSection = isArticleMode ? "articles" : "blogs";
  const sectionBlogs = useMemo(
    () => (profile?.blogs || []).filter((blog) => {
      const type = blog.type ?? (blog.content === null ? "EXTERNAL" : "INTERNAL");
      return type === mode;
    }),
    [mode, profile?.blogs],
  );
  const defaultValues = useMemo<BlogsSchema>(
    () => getInitialBlogs({ ...profile, blogs: sectionBlogs }),
    [profile, sectionBlogs],
  );
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

  const watchedBlogs = useWatch({ control, name: "blogs" });

  const isBlogsDirty = useMemo(() => {
    const current = watchedBlogs || [];
    const saved = sectionBlogs || [];
    const savedMap = new Map(saved.map((b) => [b.id, b]));

    for (const item of current) {
      const title = item.title?.trim() || "";
      const description = item.description?.trim() || "";
      const blogLink = item.blogLink?.trim() || "";
      const content = item.content ?? null;
      const isPublished = item.isPublished ?? false;
      const isEnabled = item.isEnabled ?? true;
      const slug = item.slug ?? null;

      if (!item.id) {
        if (title !== "" || description !== "" || blogLink !== "" || (content !== null && content !== "")) {
          return true;
        }
      } else {
        const original = savedMap.get(item.id);
        if (original) {
          if (
            title !== (original.title?.trim() || "") ||
            description !== (original.description?.trim() || "") ||
            blogLink !== (original.blogLink?.trim() || "") ||
            (content ?? "") !== (original.content ?? "") ||
            isPublished !== (original.isPublished ?? false) ||
            isEnabled !== (original.isEnabled ?? true) ||
            slug !== (original.slug ?? null)
          ) {
            return true;
          }
        }
      }
    }
    return false;
  }, [watchedBlogs, sectionBlogs]);

  const { error: sectionError } = useSectionSave(draftSection, {
    isDirty: isBlogsDirty,
    onSave: async () => {
      await handleSubmit(async (data) => {
        if (onSubmit) await onSubmit(data);
      })();
    },
    onDiscard: () => {
      if (profile?.id) clearDashboardDraft(draftSection, profile.id);
      reset(blogsFromProfile(sectionBlogs));
    },
  });

  const { fields, append, remove, insert } = useFieldArray({
    control,
    name: "blogs",
    keyName: "fieldId",
  });

  useEffect(() => {
    if (!profile?.id) {
      return;
    }

    const cachedDraft = readDashboardDraft<BlogsSchema>(draftSection, profile.id);
    reset(cachedDraft || blogsFromProfile(sectionBlogs));
  }, [draftSection, profile?.id, sectionBlogs, reset]);

  useEffect(() => {
    if (!profile?.id) return;
    if (isBlogsDirty) {
      writeDashboardDraft(draftSection, profile.id, { blogs: watchedBlogs || [] });
    } else {
      clearDashboardDraft(draftSection, profile.id);
    }
  }, [draftSection, isBlogsDirty, profile?.id, watchedBlogs]);

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
          {isArticleMode ? "Write Article" : "Blogs"}
        </h1>
        <p className="text-[0.78rem] text-(--lf-muted) mb-7">
          {isArticleMode
            ? "Write internal markdown articles for your portfolio blog."
            : "Add external blog posts and writing links to your portfolio."}
        </p>

        {sectionError && (
          <div className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-[0.8rem] flex items-center gap-2">
            <AlertCircle size={14} className="shrink-0" />
            <span>{sectionError}</span>
          </div>
        )}

        <div className="mb-4">
          {fields.length === 0 && (
            <div className="text-[0.78rem] text-(--lf-muted) mb-2.5">
              {isArticleMode ? "No articles yet. Add one below." : "No blog links yet. Add one below."}
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
              mode={mode}
              draftSection={draftSection}
              setValue={setValue}
              getValues={getValues}
              reset={reset}
              onOpenEditor={(idx) => setActiveEditorIdx(idx)}
            />
          ))}
        </div>

        <div className="border border-(--lf-border) rounded-xl px-5 py-4 bg-(--lf-surface) mb-2.5 transition-colors duration-150 hover:border-(--lf-muted) border-dashed">
          <div className="text-[0.68rem] font-semibold tracking-widest uppercase text-(--lf-muted) font-mono mb-3.5">
            {isArticleMode ? "New Article" : "New Blog Link"}
          </div>
          <button
            type="button"
            onClick={() =>
              append({
                type: mode,
                title: "",
                description: "",
                blogLink: "",
                content: isArticleMode ? "" : null,
                isPublished: false,
                isEnabled: true,
                slug: null,
              })
            }
            className="inline-flex items-center gap-1.5 px-[18px] h-[34px] rounded-[20px] bg-(--lf-ink) text-(--lf-bg) text-[0.78rem] font-semibold border-none cursor-pointer hover:opacity-82 transition-opacity duration-150 font-sans-body whitespace-nowrap"
          >
            <Plus size={12} />
            {isArticleMode ? "Add article" : "Add blog link"}
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
