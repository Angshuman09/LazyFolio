'use client'

import { MarkdownEditorProps } from "@/lib/types/blogs";
import {
  createCloudinaryImageMarkdown,
  extractBlogImages,
  isValidImageSrc,
  removeBlogImage,
  type BlogImage,
} from "@/lib/utils/blog-images";
import { parseMarkdown } from "@/lib/utils/markdown";
import Image from "next/image";
import { BookOpen,
    Bold,
    Italic,
    Heading1,
    Heading2,
    Eye,
    Edit3,
    X,
    Code,
    Link as LinkIcon,
    Image as ImageIcon,
    Loader2,
    Trash2} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useWatch } from "react-hook-form";
import toast from "react-hot-toast";

export function MarkdownEditor({
    index,
    control,
    register,
    setValue,
    onClose,
  }: MarkdownEditorProps) {
    const [tab, setTab] = useState<"edit" | "preview">("edit");
    const [previewHtml, setPreviewHtml] = useState("");
    const [deletingPublicId, setDeletingPublicId] = useState<string | null>(null);
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const knownImagesRef = useRef<BlogImage[]>([]);
    const pendingDeleteTimersRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
    const deletedPublicIdsRef = useRef<Set<string>>(new Set());
  
    const values = useWatch({ control, name: `blogs.${index}` });
    const title = values?.title || "";
    const content = values?.content || "";
  
    const wordCount = useMemo(() => {
      return content.split(/\s+/).filter(Boolean).length;
    }, [content]);

    const uploadedImages = useMemo(() => extractBlogImages(content), [content]);

    const deleteCloudinaryImage = async (publicId: string) => {
      const res = await fetch("/api/dashboard/upload", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ publicId }),
      });
      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.error || "Failed to delete image");
      }
    };

    useEffect(() => {
      let isCurrent = true;

      parseMarkdown(content).then((html) => {
        if (isCurrent) {
          setPreviewHtml(html);
        }
      });

      return () => {
        isCurrent = false;
      };
    }, [content]);

    useEffect(() => {
      const currentPublicIds = new Set(
        uploadedImages.map((image) => image.publicId),
      );

      uploadedImages.forEach((image) => {
        const pendingTimer = pendingDeleteTimersRef.current[image.publicId];

        if (pendingTimer) {
          clearTimeout(pendingTimer);
          delete pendingDeleteTimersRef.current[image.publicId];
        }
      });

      knownImagesRef.current.forEach((image) => {
        const isStillTracked = currentPublicIds.has(image.publicId);
        const isStillReferenced = content.includes(image.url);
        const isAlreadyDeleted = deletedPublicIdsRef.current.has(image.publicId);
        const hasPendingDelete = pendingDeleteTimersRef.current[image.publicId];

        if (
          isStillTracked ||
          isStillReferenced ||
          isAlreadyDeleted ||
          hasPendingDelete
        ) {
          return;
        }

        pendingDeleteTimersRef.current[image.publicId] = setTimeout(async () => {
          delete pendingDeleteTimersRef.current[image.publicId];
          const toastId = toast.loading("Deleting removed image from Cloudinary...");

          try {
            await deleteCloudinaryImage(image.publicId);
            deletedPublicIdsRef.current.add(image.publicId);
            toast.success("Removed image deleted from Cloudinary.", {
              id: toastId,
            });
          } catch (error) {
            console.error("Error deleting removed image:", error);
            toast.error("Image was removed, but Cloudinary deletion failed.", {
              id: toastId,
            });
          }
        }, 900);
      });

      knownImagesRef.current = uploadedImages;
    }, [content, uploadedImages]);

    const insertAtCursor = (before: string, after: string = "") => {
      const textarea = textareaRef.current;
      if (!textarea) return;
  
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = textarea.value;
      const selectedText = text.substring(start, end);
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
  
        insertAtCursor(
          createCloudinaryImageMarkdown(
            file.name.split(".")[0],
            data.url,
            data.publicId,
          ),
        );
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

    const handleDeleteImage = async (image: BlogImage) => {
      if (!window.confirm("Delete this image from the article and Cloudinary?")) {
        return;
      }

      setDeletingPublicId(image.publicId);
      const toastId = toast.loading("Deleting image...");

      try {
        await deleteCloudinaryImage(image.publicId);
        deletedPublicIdsRef.current.add(image.publicId);
        setValue(`blogs.${index}.content`, removeBlogImage(content, image), {
          shouldDirty: true,
        });
        toast.success("Image deleted.", { id: toastId });
      } catch (error) {
        console.error("Error deleting image:", error);
        toast.error("Failed to delete image. Please try again.", { id: toastId });
      } finally {
        setDeletingPublicId(null);
      }
    };
  
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

            {uploadedImages.length > 0 && (
              <div className="px-4 py-2.5 border-b border-(--lf-border) bg-(--lf-bg) flex items-center gap-2 overflow-x-auto shrink-0">
                <span className="text-[0.68rem] font-mono uppercase tracking-wider text-(--lf-muted) shrink-0">
                  Uploaded images
                </span>
                {uploadedImages.map((image) => {
                  const hasValidSrc = isValidImageSrc(image.url);

                  return (
                    <div
                      key={`${image.publicId}-${image.url}`}
                      className="inline-flex items-center gap-2 h-8 px-2 rounded-lg border border-(--lf-border) bg-(--lf-surface) shrink-0"
                    >
                      {hasValidSrc ? (
                        <Image
                          src={image.url}
                          alt={image.alt || "Uploaded blog image"}
                          width={28}
                          height={20}
                          className="h-5 w-7 rounded object-cover border border-(--lf-border)"
                        />
                      ) : (
                        <span className="inline-flex h-5 w-7 items-center justify-center rounded border border-[#b91c1c]/25 bg-[#b91c1c]/5 text-[0.62rem] font-mono text-[#b91c1c]">
                          URL
                        </span>
                      )}
                      <span className="max-w-[120px] truncate text-[0.72rem] text-(--lf-muted)">
                        {image.alt || "Image"}
                      </span>
                      <button
                        type="button"
                        title="Delete image"
                        onClick={() => handleDeleteImage(image)}
                        disabled={deletingPublicId === image.publicId}
                        className="inline-flex items-center justify-center h-6 w-6 rounded-md text-(--lf-muted) hover:text-[#b91c1c] hover:bg-[#b91c1c]/5 transition-colors disabled:opacity-60 cursor-pointer"
                      >
                        {deletingPublicId === image.publicId ? (
                          <Loader2 size={12} className="animate-spin" />
                        ) : (
                          <Trash2 size={12} />
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
  
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
