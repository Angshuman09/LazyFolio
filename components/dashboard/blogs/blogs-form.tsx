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
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { blogsSchema, BlogsSchema } from "@/lib/schemas/blogs";
import {
  readDashboardDraft,
  writeDashboardDraft,
  clearDashboardDraft,
} from "@/lib/cache/dashboard-drafts";
import { Props } from "@/lib/types/blogs";
import { BlogCard } from "./blog-card";
import { TiptapEditor } from "./tiptap/TiptapEditor";
import { getInitialBlogs, blogsFromProfile } from "@/lib/utils/blogs";
import { useSectionSave } from "@/hooks/use-section-save";

export default function BlogsForm({
  profile,
  formRef,
  onSubmit,
  mode = "EXTERNAL",
  maxItems,
  isSubscribed,
  articleUsage,
}: Props) {
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
    formState: { errors },
  } = useForm<BlogsSchema>({
    resolver: zodResolver(blogsSchema),
    defaultValues,
  });

  const watchedBlogs = useWatch({ control, name: "blogs" });

  const isBlogsDirty = useMemo(() => {
    if (!watchedBlogs) return false;
    if (watchedBlogs.length !== sectionBlogs.length) return true;

    for (let i = 0; i < watchedBlogs.length; i++) {
      const formItem = watchedBlogs[i];
      const origItem = sectionBlogs[i];

      if (!origItem) return true;
      if ((formItem.title || "") !== (origItem.title || "")) return true;
      if ((formItem.description || "") !== (origItem.description || "")) return true;
      if ((formItem.blogLink || "") !== (origItem.blogLink || "")) return true;
      if ((formItem.content || null) !== (origItem.content || null)) return true;
      if ((formItem.isPublished ?? false) !== (origItem.isPublished ?? false)) return true;
      if ((formItem.isEnabled ?? true) !== (origItem.isEnabled ?? origItem.isenable ?? true)) return true;
      if ((formItem.type || mode) !== (origItem.type || mode)) return true;
      if ((formItem.slug || null) !== (origItem.slug || null)) return true;
    }
    return false;
  }, [watchedBlogs, sectionBlogs, mode]);

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

  const freeLimit = articleUsage?.freeLimit ?? maxItems ?? 2;
  const isLimitReached = !isSubscribed && fields.length >= freeLimit;

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
        <p className="text-[0.78rem] text-(--lf-muted) mb-6">
          {isArticleMode
            ? !isSubscribed
              ? `Write internal markdown articles for your portfolio blog (${fields.length}/${freeLimit} free used).`
              : "Write internal markdown articles for your portfolio blog."
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
          <div className="text-[0.68rem] font-semibold tracking-widest text-(--lf-muted) font-mono mb-3.5">
            {isArticleMode ? "New Article" : "New Blog Link"}
          </div>

          {isArticleMode && isLimitReached ? (
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <p className="text-[0.78rem] font-medium text-(--lf-ink)">
                  Free article limit reached ({fields.length} of {freeLimit})
                </p>
                <p className="text-[0.72rem] text-(--lf-muted) mt-0.5">
                  Upgrade for unlimited articles, or delete an existing article to free up space.
                </p>
              </div>
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center px-4 h-8 rounded-full bg-(--lf-accent-text) text-(--lf-bg) text-[0.76rem] font-semibold cursor-pointer hover:opacity-90 transition-all font-sans-body whitespace-nowrap shadow-2xs"
              >
                View pricing
              </Link>
            </div>
          ) : (
            <button
              type="button"
              disabled={typeof maxItems === "number" && fields.length >= maxItems}
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
              className="inline-flex items-center gap-1.5 px-[18px] h-[34px] rounded-[20px] bg-(--lf-ink) text-(--lf-bg) text-[0.78rem] font-semibold border-none cursor-pointer hover:opacity-82 transition-opacity duration-150 font-sans-body whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus size={12} />
              {isArticleMode ? "Add article" : "Add blog link"}
            </button>
          )}
        </div>
      </form>

      {activeEditorIdx !== null && (
        <TiptapEditor
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
