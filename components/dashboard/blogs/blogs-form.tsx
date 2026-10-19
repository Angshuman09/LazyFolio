"use client";

import { useEffect, useMemo, useState } from "react";
import {
  useFieldArray,
  useForm,
  useWatch,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { SectionHeading } from "@/components/dashboard/section-heading";
import { AddItemPanel } from "@/components/dashboard/add-item-panel";
import { EmptySectionState } from "@/components/dashboard/empty-section-state";

export default function BlogsForm({
  profile,
  formRef,
  onSubmit,
  mode = "EXTERNAL",
  maxItems,
  isSubscribed,
  onSupportMe,
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
        <SectionHeading
          title={isArticleMode ? "Write Article" : "Blogs"}
          description={isArticleMode
            ? "Write and publish articles directly on your portfolio."
            : "Add external blog posts and writing links to your portfolio."}
        />

        {sectionError && (
          <div className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-[0.8rem] flex items-center gap-2">
            <span>{sectionError}</span>
          </div>
        )}

        <div className="mb-4">
          {fields.length === 0 && (
            <EmptySectionState message={isArticleMode
              ? "Draft an article to share your ideas and experience with visitors."
              : "Add links to posts you have published on other platforms."} />
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

        <AddItemPanel
          title={isArticleMode ? "Add an article" : "Add a blog link"}
          buttonLabel={isArticleMode ? "Add article" : "Add blog link"}
          disabled={typeof maxItems === "number" && fields.length >= maxItems}
          onClick={() => append({
                type: mode,
                title: "",
                description: "",
                blogLink: "",
                content: isArticleMode ? "" : null,
                isPublished: false,
                isEnabled: true,
                slug: null,
              })}
        />
      </form>

      {activeEditorIdx !== null && (
        <TiptapEditor
          index={activeEditorIdx}
          control={control}
          register={register}
          setValue={setValue}
          onClose={() => setActiveEditorIdx(null)}
          isSubscribed={isSubscribed}
          onSupportMe={onSupportMe}
        />
      )}
    </>
  );
}
