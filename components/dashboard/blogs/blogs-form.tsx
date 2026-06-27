"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import {
  useFieldArray,
  useForm,
  useWatch,
  type Control,
  type UseFormRegister,
  type UseFormSetValue,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Plus,
  BookOpen,
  Bold,
  Italic,
  Heading1,
  Heading2,
  Code,
  Link as LinkIcon,
  Image as ImageIcon,
  Eye,
  Edit3,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import { blogsSchema, BlogsSchema } from "@/lib/schemas/blogs";
import { parseMarkdown } from "@/lib/utils/markdown";
import {
  readDashboardDraft,
  writeDashboardDraft,
} from "@/lib/cache/dashboard-drafts";
import { BlogsProfile, ProfileBlog, Props } from "@/lib/types/blogs";
import { BlogCard } from "./blog-card";



function blogsFromProfile(blogs: ProfileBlog[] = []): BlogsSchema {
  return {
    blogs: blogs.map((blog) => ({
      id: blog.id || undefined,
      title: blog.title ?? "",
      description: blog.description ?? "",
      blogLink: blog.blogLink ?? "",
      enddate: blog.enddate ? String(blog.enddate) : "",
      content: blog.content ?? null,
      isPublished: blog.isPublished ?? false,
      slug: blog.slug ?? null,
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



type MarkdownEditorProps = {
  index: number;
  control: Control<BlogsSchema>;
  register: UseFormRegister<BlogsSchema>;
  setValue: UseFormSetValue<BlogsSchema>;
  onClose: () => void;
};

function MarkdownEditor({
  index,
  control,
  register,
  setValue,
  onClose,
}: MarkdownEditorProps) {
  const [tab, setTab] = useState<"edit" | "preview">("edit");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  // console.log(textareaRef)
  const fileInputRef = useRef<HTMLInputElement>(null);

  const values = useWatch({ control, name: `blogs.${index}` });
  const title = values?.title || "";
  const content = values?.content || "";

  const wordCount = useMemo(() => {
    return content.split(/\s+/).filter(Boolean).length;
  }, [content]);

  const insertAtCursor = (before: string, after: string = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    console.log(start, end)
    const text = textarea.value;
    const selectedText = text.substring(start, end);
    console.log(selectedText)
    const replacement = before + selectedText + after;

    const newValue = text.substring(0, start) + replacement + text.substring(end);
    setValue(`blogs.${index}.content`, newValue, { shouldDirty: true });

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + before.length,
        start + before.length + selectedText.length
      );
    }, 0);
  };

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const toastId = toast.loading("Uploading image to Cloudinary...");
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/dashboard/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to upload image");

      insertAtCursor(`\n![${file.name.split(".")[0]}](${data.url})\n`);
      toast.success("Image uploaded and embedded!", { id: toastId });
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image. Please try again.", { id: toastId });
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const previewHtml = useMemo(() => {
    return parseMarkdown(content);
  }, [content]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-(--lf-bg) text-(--lf-ink) overflow-hidden animate-in fade-in duration-200">
      <header className="h-16 flex items-center justify-between px-6 border-b border-(--lf-border) bg-(--lf-surface)/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <BookOpen size={16} className="text-(--lf-muted)" />
          <span className="text-sm font-medium truncate max-w-[200px] sm:max-w-md">
            Editing content for: <span className="font-semibold">{title || "Untitled Post"}</span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex rounded-lg border border-(--lf-border) p-0.5 lg:hidden bg-(--lf-bg)">
            <button
              type="button"
              onClick={() => setTab("edit")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium cursor-pointer transition-all ${
                tab === "edit" ? "bg-(--lf-surface) shadow-sm text-(--lf-ink)" : "text-(--lf-muted)"
              }`}
            >
              <Edit3 size={12} />
              Write
            </button>
            <button
              type="button"
              onClick={() => setTab("preview")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium cursor-pointer transition-all ${
                tab === "preview" ? "bg-(--lf-surface) shadow-sm text-(--lf-ink)" : "text-(--lf-muted)"
              }`}
            >
              <Eye size={12} />
              Preview
            </button>
          </div>

          <div className="text-xs text-(--lf-muted) font-mono hidden sm:block">
            {wordCount} words | {content.length} chars
          </div>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-(--lf-border) bg-transparent text-(--lf-muted) hover:text-(--lf-ink) hover:bg-(--lf-surface) transition-all cursor-pointer"
          >
            <X size={14} />
          </button>
        </div>
      </header>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 overflow-hidden">
        <div
          className={`flex flex-col border-r border-(--lf-border) h-full overflow-hidden ${
            tab === "edit" ? "flex" : "hidden lg:flex"
          }`}
        >
          <div className="h-11 flex items-center gap-1.5 px-4 border-b border-(--lf-border) bg-(--lf-surface)/40 overflow-x-auto shrink-0 select-none">
            <button
              type="button"
              title="Header 1"
              onClick={() => insertAtCursor("# ", "")}
              className="p-1.5 rounded hover:bg-(--lf-border) text-(--lf-muted) hover:text-(--lf-ink) cursor-pointer"
            >
              <Heading1 size={14} />
            </button>
            <button
              type="button"
              title="Header 2"
              onClick={() => insertAtCursor("## ", "")}
              className="p-1.5 rounded hover:bg-(--lf-border) text-(--lf-muted) hover:text-(--lf-ink) cursor-pointer"
            >
              <Heading2 size={14} />
            </button>
            <div className="w-[1px] h-4 bg-(--lf-border) mx-1 shrink-0" />
            <button
              type="button"
              title="Bold"
              onClick={() => insertAtCursor("**", "**")}
              className="p-1.5 rounded hover:bg-(--lf-border) text-(--lf-muted) hover:text-(--lf-ink) cursor-pointer"
            >
              <Bold size={14} />
            </button>
            <button
              type="button"
              title="Italic"
              onClick={() => insertAtCursor("*", "*")}
              className="p-1.5 rounded hover:bg-(--lf-border) text-(--lf-muted) hover:text-(--lf-ink) cursor-pointer"
            >
              <Italic size={14} />
            </button>
            <div className="w-[1px] h-4 bg-(--lf-border) mx-1 shrink-0" />
            <button
              type="button"
              title="Code Block"
              onClick={() => insertAtCursor("\n```javascript\n", "\n```\n")}
              className="p-1.5 rounded hover:bg-(--lf-border) text-(--lf-muted) hover:text-(--lf-ink) cursor-pointer"
            >
              <Code size={14} />
            </button>
            <button
              type="button"
              title="Insert Link"
              onClick={() => insertAtCursor("[", "](https://)")}
              className="p-1.5 rounded hover:bg-(--lf-border) text-(--lf-muted) hover:text-(--lf-ink) cursor-pointer"
            >
              <LinkIcon size={14} />
            </button>
            <button
              type="button"
              title="Insert Media (Image)"
              onClick={() => fileInputRef.current?.click()}
              className="p-1.5 rounded hover:bg-(--lf-border) text-(--lf-muted) hover:text-(--lf-ink) cursor-pointer"
            >
              <ImageIcon size={14} />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageFileChange}
              accept="image/*"
              className="hidden"
            />
          </div>

          {/* Text Editor Area */}
          <textarea
            {...register(`blogs.${index}.content`)}
            ref={(e) => {
              register(`blogs.${index}.content`).ref(e);
              textareaRef.current = e;
            }}
            placeholder="Type your markdown here... You can use the formatting toolbar or drag & drop text/images."
            className="flex-1 w-full p-6 bg-transparent text-(--lf-ink) font-mono text-[0.88rem] leading-relaxed resize-none outline-none overflow-y-auto"
          />
        </div>

        {/* Right pane: Preview (Visible on small screen when in 'preview' tab, always on large screen) */}
        <div
          className={`h-full overflow-y-auto p-6 md:p-10 bg-(--lf-surface) ${
            tab === "preview" ? "block" : "hidden lg:block"
          }`}
        >
          {content ? (
            <article
              className="max-w-xl mx-auto prose dark:prose-invert font-sans"
              dangerouslySetInnerHTML={{ __html: previewHtml }}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-(--lf-muted) font-sans text-xs italic">
              Nothing to preview yet. Start writing on the left pane!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

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

      {/* Fullscreen Markdown Editor Modal */}
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
