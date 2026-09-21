"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useEditor, EditorContent, type JSONContent } from "@tiptap/react";
import { useWatch } from "react-hook-form";
import Image from "next/image";
import { BookOpen, X, Loader2, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

import { editorExtensions } from "./extensions";
import { Toolbar } from "./Toolbar";
import {
  isTiptapJson,
  extractImagesFromTiptapJson,
  type TiptapImageInfo,
} from "@/lib/utils/tiptap-content";
import { parseMarkdown } from "@/lib/utils/markdown";
import type { MarkdownEditorProps } from "@/lib/types/blogs";

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
];
const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

async function uploadToCloudinary(
  file: File,
): Promise<{ url: string; publicId: string }> {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch("/api/dashboard/upload", {
    method: "POST",
    body: formData,
  });
  const data = (await res.json()) as {
    url?: string;
    publicId?: string;
    public_id?: string;
    error?: string;
  };
  if (!res.ok) throw new Error(data.error || "Upload failed");
  return {
    url: data.url!,
    publicId: (data.publicId || data.public_id)!,
  };
}

export function TiptapEditor({
  index,
  control,
  setValue,
  onClose,
}: MarkdownEditorProps) {
  const values = useWatch({ control, name: `blogs.${index}` });
  const title = values?.title || "";

  const initialContentRef = useRef<string>(values?.content || "");

  const [editorReady, setEditorReady] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [deletingPublicId, setDeletingPublicId] = useState<string | null>(null);

  const [uploadedImages, setUploadedImages] = useState<TiptapImageInfo[]>([]);

  const knownImagesRef = useRef<TiptapImageInfo[]>([]);
  const pendingDeleteTimersRef = useRef<
    Record<string, ReturnType<typeof setTimeout>>
  >({});
  const deletedPublicIdsRef = useRef<Set<string>>(new Set());

  const fileInputRef = useRef<HTMLInputElement>(null);

  const insertImageIntoEditor = useCallback(
    (
      editorInstance: ReturnType<typeof useEditor>,
      url: string,
      publicId: string,
      altText: string,
      insertPos?: number,
    ) => {
      if (!editorInstance) return;
      const imageNode = {
        type: "image",
        attrs: { src: url, alt: altText, "data-public-id": publicId },
      };
      if (insertPos !== undefined) {
        editorInstance
          .chain()
          .insertContentAt(insertPos, imageNode)
          .focus()
          .run();
      } else {
        editorInstance.chain().focus().insertContent(imageNode).run();
      }
    },
    [],
  );

  const handleImageUpload = useCallback(
    async (
      editorInstance: ReturnType<typeof useEditor>,
      file: File,
      insertPos?: number,
    ) => {
      if (!editorInstance) return;

      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        toast.error("Only JPEG, PNG, GIF, and WebP images are supported.");
        return;
      }
      if (file.size > MAX_IMAGE_SIZE_BYTES) {
        toast.error("Image must be smaller than 10 MB.");
        return;
      }

      const altText = file.name.replace(/\.[^.]+$/, "");
      const toastId = toast.loading("Uploading image to Cloudinary...");

      try {
        const { url, publicId } = await uploadToCloudinary(file);
        insertImageIntoEditor(editorInstance, url, publicId, altText, insertPos);
        toast.success("Image uploaded and inserted!", { id: toastId });
      } catch (err) {
        console.error("Image upload error:", err);
        toast.error(
          err instanceof Error ? err.message : "Failed to upload image.",
          { id: toastId },
        );
      } finally {
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    },
    [insertImageIntoEditor],
  );

  const syncImageCleanup = useCallback((currentImages: TiptapImageInfo[]) => {
    const currentIds = new Set(currentImages.map((img) => img.publicId));

    currentImages.forEach((img) => {
      const timer = pendingDeleteTimersRef.current[img.publicId];
      if (timer) {
        clearTimeout(timer);
        delete pendingDeleteTimersRef.current[img.publicId];
      }
    });

    knownImagesRef.current.forEach((img) => {
      const stillPresent = currentIds.has(img.publicId);
      const alreadyDeleted = deletedPublicIdsRef.current.has(img.publicId);
      const hasPendingDelete = !!pendingDeleteTimersRef.current[img.publicId];

      if (stillPresent || alreadyDeleted || hasPendingDelete) return;

      pendingDeleteTimersRef.current[img.publicId] = setTimeout(async () => {
        delete pendingDeleteTimersRef.current[img.publicId];
        const toastId = toast.loading("Deleting removed image from Cloudinary...");
        try {
          await fetch("/api/dashboard/upload", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ publicId: img.publicId }),
          });
          deletedPublicIdsRef.current.add(img.publicId);
          toast.success("Removed image deleted from Cloudinary.", {
            id: toastId,
          });
        } catch {
          toast.error(
            "Image was removed, but Cloudinary deletion failed.",
            { id: toastId },
          );
        }
      }, 900);
    });

    knownImagesRef.current = currentImages;
  }, []);

  const editor = useEditor({
    extensions: editorExtensions,
    content: "",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "tiptap-editor-content w-full min-h-[500px] outline-none text-(--lf-ink) text-[1.05rem] leading-relaxed font-sans",
        spellcheck: "true",
      },
      handleDOMEvents: {
        drop: (_view, rawEvent) => {
          const event = rawEvent as DragEvent;
          const files = Array.from(event.dataTransfer?.files ?? []);
          const imageFiles = files.filter((f) =>
            ALLOWED_IMAGE_TYPES.includes(f.type),
          );
          if (imageFiles.length === 0) return false;
          event.preventDefault();
          const coords = { left: event.clientX, top: event.clientY };
          const pos =
            _view.posAtCoords(coords)?.pos ?? _view.state.doc.content.size;
          imageFiles.forEach((file) => {
            if (editor) void handleImageUpload(editor, file, pos);
          });
          return true;
        },
        paste: (_view, rawEvent) => {
          const event = rawEvent as ClipboardEvent;
          const files = Array.from(event.clipboardData?.files ?? []);
          const imageFiles = files.filter((f) =>
            ALLOWED_IMAGE_TYPES.includes(f.type),
          );
          if (imageFiles.length === 0) return false;
          event.preventDefault();
          imageFiles.forEach((file) => {
            if (editor) void handleImageUpload(editor, file);
          });
          return true;
        },
      },
    },
    onUpdate: ({ editor: e }) => {
      const json = e.getJSON();
      // Persist back to react-hook-form
      setValue(`blogs.${index}.content`, JSON.stringify(json), {
        shouldDirty: true,
      });
      // Update counters
      setWordCount(e.storage.characterCount.words() as number);
      setCharCount(e.storage.characterCount.characters() as number);
      // Image tracking
      const images = extractImagesFromTiptapJson(json);
      setUploadedImages(images);
      syncImageCleanup(images);
    },
  });

  useEffect(() => {
    if (!editor) return;
    const currentEditor = editor;
    let cancelled = false;

    async function loadContent() {
      const raw = initialContentRef.current;

      if (!raw) {
        setEditorReady(true);
        return;
      }

      if (isTiptapJson(raw)) {
        try {
          const json = JSON.parse(raw) as JSONContent;
          currentEditor.commands.setContent(json, { emitUpdate: false });
          const images = extractImagesFromTiptapJson(json);
          setUploadedImages(images);
          knownImagesRef.current = images;
          setWordCount(currentEditor.storage.characterCount.words() as number);
          setCharCount(
            currentEditor.storage.characterCount.characters() as number,
          );
        } catch {
          currentEditor.commands.clearContent(false);
        }
      } else {
        try {
          const html = await parseMarkdown(raw);
          if (!cancelled) {
            currentEditor.commands.setContent(html || "", {
              emitUpdate: false,
            });
            setWordCount(
              currentEditor.storage.characterCount.words() as number,
            );
            setCharCount(
              currentEditor.storage.characterCount.characters() as number,
            );
          }
        } catch {
          if (!cancelled) currentEditor.commands.clearContent(false);
        }
      }

      if (!cancelled) setEditorReady(true);
    }

    void loadContent();
    return () => {
      cancelled = true;
    };
  }, [editor]);

  const handleDeleteImage = useCallback(
    async (img: TiptapImageInfo) => {
      if (!editor) return;
      if (
        !window.confirm(
          "Delete this image from the article and Cloudinary?",
        )
      )
        return;

      setDeletingPublicId(img.publicId);
      const toastId = toast.loading("Deleting image...");

      try {
        await fetch("/api/dashboard/upload", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ publicId: img.publicId }),
        });

        deletedPublicIdsRef.current.add(img.publicId);

        const { state, view } = editor;
        const tr = state.tr;
        state.doc.descendants((node, pos) => {
          if (
            node.type.name === "image" &&
            node.attrs["data-public-id"] === img.publicId
          ) {
            tr.delete(pos, pos + node.nodeSize);
            return false;
          }
        });
        view.dispatch(tr);

        toast.success("Image deleted.", { id: toastId });
      } catch {
        toast.error("Failed to delete image. Please try again.", {
          id: toastId,
        });
      } finally {
        setDeletingPublicId(null);
      }
    },
    [editor],
  );

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file && editor) void handleImageUpload(editor, file);
    },
    [editor, handleImageUpload],
  );

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-(--lf-bg) text-(--lf-ink) overflow-hidden animate-in fade-in duration-200">
      <header className="h-14 flex items-center justify-between px-6 border-b border-(--lf-border) bg-(--lf-surface)/80 backdrop-blur-md shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <BookOpen size={16} className="text-(--lf-muted) shrink-0" />
          <span className="text-sm font-medium truncate">
            Editing content for:{" "}
            <span className="font-semibold">{title || "Untitled Post"}</span>
          </span>
        </div>

        <div className="flex items-center gap-4 shrink-0">
          <div className="text-xs text-(--lf-muted) font-mono hidden sm:block">
            {wordCount} words &middot; {charCount} chars
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close editor"
            className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-(--lf-muted) hover:text-(--lf-ink) hover:bg-(--lf-surface) transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>
      </header>

      <Toolbar editor={editor} onImageClick={() => fileInputRef.current?.click()} />

      <input
        ref={fileInputRef}
        type="file"
        accept={ALLOWED_IMAGE_TYPES.join(",")}
        onChange={handleFileInputChange}
        className="hidden"
        aria-label="Upload image"
      />

      {uploadedImages.length > 0 && (
        <div className="px-6 py-2 border-b border-(--lf-border) bg-(--lf-surface)/40 flex items-center gap-2 overflow-x-auto shrink-0 justify-center">
          <span className="text-[0.68rem] font-mono uppercase tracking-wider text-(--lf-muted) shrink-0">
            Images in post:
          </span>
          {uploadedImages.map((img) => (
            <div
              key={img.publicId}
              className="inline-flex items-center gap-2 h-7 px-2 rounded-md border border-(--lf-border) bg-(--lf-surface) shrink-0"
            >
              <Image
                src={img.src}
                alt={img.alt || "Image"}
                width={24}
                height={18}
                className="h-4.5 w-6 rounded object-cover"
              />
              <span className="max-w-[120px] truncate text-[0.72rem] text-(--lf-muted)">
                {img.alt || "Image"}
              </span>
              <button
                type="button"
                onClick={() => void handleDeleteImage(img)}
                disabled={deletingPublicId === img.publicId}
                aria-label={`Delete image: ${img.alt || "Image"}`}
                className="text-(--lf-muted) hover:text-red-500 transition-colors disabled:opacity-40 cursor-pointer"
              >
                {deletingPublicId === img.publicId ? (
                  <Loader2 size={11} className="animate-spin" />
                ) : (
                  <Trash2 size={11} />
                )}
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex-1 overflow-y-auto bg-(--lf-bg) flex justify-center">
        <div className="w-full max-w-3xl px-6 sm:px-12 py-10 sm:py-16 min-h-full">
          {!editorReady ? (
            <div className="flex items-center justify-center py-24 text-(--lf-muted) text-xs gap-2">
              <Loader2 size={16} className="animate-spin" />
              Loading content…
            </div>
          ) : (
            <EditorContent editor={editor} />
          )}
        </div>
      </div>
    </div>
  );
}
