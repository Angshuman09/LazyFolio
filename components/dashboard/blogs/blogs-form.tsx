"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useFieldArray,
  useForm,
  useWatch,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { blogsSchema, BlogsSchema } from "@/lib/schemas/blogs";
import {
  readDashboardDraft,
  writeDashboardDraft,
  clearDashboardDraft,
} from "@/lib/cache/dashboard-drafts";
import { Props } from "@/lib/types/blogs";
import { BlogCard } from "./blog-card";
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
  const router = useRouter();

  const sectionBlogs = useMemo(
    () => (profile?.blogs || []).filter((blog) => {
      const type = blog.type ?? (blog.content === null ? "EXTERNAL" : "INTERNAL");
      return type === mode;
    }),
    [mode, profile?.blogs],
  );
  const defaultValues = useMemo<BlogsSchema>(
    () => getInitialBlogs({ ...profile, blogs: sectionBlogs }, draftSection),
    [profile, sectionBlogs, draftSection],
  );

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

  const isBlogsDirtyRef = useRef(isBlogsDirty);
  useEffect(() => {
    isBlogsDirtyRef.current = isBlogsDirty;
  }, [isBlogsDirty]);

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

  const queryClient = useQueryClient();

  useEffect(() => {
    if (!profile?.id) {
      return;
    }

    if (isArticleMode) {
      clearDashboardDraft("articles", profile.id);
      reset(blogsFromProfile(sectionBlogs));
      return;
    }

    const cachedDraft = readDashboardDraft<BlogsSchema>(draftSection, profile.id);
    if (cachedDraft) {
      reset(cachedDraft);
      return;
    }

    if (!isBlogsDirtyRef.current) {
      reset(blogsFromProfile(sectionBlogs));
    }
  }, [draftSection, profile?.id, sectionBlogs, reset, isArticleMode]);

  useEffect(() => {
    if (!profile?.id || isArticleMode) return;
    if (isBlogsDirty) {
      writeDashboardDraft(draftSection, profile.id, { blogs: watchedBlogs || [] });
    } else {
      clearDashboardDraft(draftSection, profile.id);
    }
  }, [draftSection, isBlogsDirty, profile?.id, watchedBlogs, isArticleMode]);

  useEffect(() => {
    if (isArticleMode && profile?.id) {
      void queryClient.invalidateQueries({ queryKey: ["profile"] });
    }
  }, [isArticleMode, profile?.id, queryClient]);

  const [isCreatingArticle, setIsCreatingArticle] = useState(false);

  const handleOpenEditor = (idx: number) => {
    const blog = getValues(`blogs.${idx}`);
    if (blog?.id) {
      router.push(`/dashboard/articles/${blog.id}`);
    } else {
      toast.error("Save the article first to open the editor.");
    }
  };

  const handleAddArticle = async () => {
    if (isCreatingArticle) return;
    setIsCreatingArticle(true);
    try {
      const res = await fetch("/api/dashboard/blogs/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "", content: "" }),
      });
      if (!res.ok) throw new Error("Failed to create article");
      const data = (await res.json()) as { blog: { id: string } };
      router.push(`/dashboard/articles/${data.blog.id}`);
    } catch {
      toast.error("Could not create article. Please try again.");
      setIsCreatingArticle(false);
    }
  };

  void isSubscribed;
  void onSupportMe;

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
              onOpenEditor={handleOpenEditor}
            />
          ))}
        </div>

        <AddItemPanel
          title={isArticleMode ? "Add an article" : "Add a blog link"}
          buttonLabel={isArticleMode ? (isCreatingArticle ? "Creating…" : "Write Something") : "Add blog link"}
          disabled={(typeof maxItems === "number" && fields.length >= maxItems) || isCreatingArticle}
          onClick={() => {
            if (isArticleMode) {
              void handleAddArticle();
            } else {
              append({
                type: mode,
                title: "",
                description: "",
                blogLink: "",
                content: null,
                isPublished: false,
                isEnabled: true,
                slug: null,
              });
            }
          }}
        />
      </form>
    </>
  );
}
