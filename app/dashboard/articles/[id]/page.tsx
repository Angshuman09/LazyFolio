"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useEditor, EditorContent, type JSONContent } from "@tiptap/react";
import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import {
  ArrowLeft,
  Check,
  Loader2,
  Trash2,
} from "lucide-react";
import toast from "react-hot-toast";

import { authClient } from "@/lib/auth/auth-client";
import { editorExtensions } from "@/components/dashboard/blogs/tiptap/extensions";
import { Toolbar } from "@/components/dashboard/blogs/tiptap/Toolbar";
import { SupportMeModal } from "@/components/dashboard/support-me-modal";
import {
  isTiptapJson,
  extractImagesFromTiptapJson,
  type TiptapImageInfo,
} from "@/lib/utils/tiptap-content";
import { parseMarkdown } from "@/lib/utils/markdown";
import {
  ALLOWED_IMAGE_TYPES,
  MAX_IMAGE_SIZE_BYTES,
} from "@/lib/constants/uploads";

interface ArticleData {
  id: string;
  title: string;
  content: string | null;
  isPublished: boolean;
  slug: string | null;
  description: string | null;
  isEnabled: boolean;
  type: string;
}

type SaveStatus = "saved" | "saving" | "error";

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

export default function ArticleEditorPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const routeId = params.id;
  const queryClient = useQueryClient();

  const { data: session, isPending: sessionLoading } = authClient.useSession();
  
  useEffect(() => {
    if (!sessionLoading && !session?.user) {
      router.replace("/dashboard");
    }
  }, [session, sessionLoading, router]);

  const articleIdRef = useRef<string>(routeId);

  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("saved");
  const [isTogglingPublish, setIsTogglingPublish] = useState(false);
  const [editorReady, setEditorReady] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [supportMeOpen, setSupportMeOpen] = useState(false);

  const [uploadedImages, setUploadedImages] = useState<TiptapImageInfo[]>([]);
  const [deletingPublicId, setDeletingPublicId] = useState<string | null>(null);
  const knownImagesRef = useRef<TiptapImageInfo[]>([]);
  const pendingDeleteTimersRef = useRef<
    Record<string, ReturnType<typeof setTimeout>>
  >({});
  const deletedPublicIdsRef = useRef<Set<string>>(new Set());

  const fileInputRef = useRef<HTMLInputElement>(null);
  const initialContentRef = useRef<string>("");

  const titleRef = useRef<string>("");
  const contentRef = useRef<string>("");
  const autoSaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    async function fetchSub() {
      try {
        const res = await fetch("/api/subscription");
        if (res.ok) {
          const data = (await res.json()) as { isActive: boolean };
          setIsSubscribed(Boolean(data.isActive));
        }
      } catch {
        // silent fail
      }
    }
    if (session?.user) void fetchSub();
  }, [session?.user]);

  const saveArticle = useCallback(
    async (patch: {
      title?: string;
      content?: string;
      isPublished?: boolean;
    }) => {
      const targetId = articleIdRef.current;
      if (!targetId || targetId === "new") return null;

      setSaveStatus("saving");
      try {
        const res = await fetch(`/api/dashboard/blogs/${targetId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(patch),
        });
        if (!res.ok) {
          const err = (await res.json()) as { error?: string };
          throw new Error(err.error || "Save failed");
        }
        const data = (await res.json()) as { blog: ArticleData };
        setSaveStatus("saved");
        void queryClient.invalidateQueries({ queryKey: ["profile"] });
        return data.blog;
      } catch (err) {
        setSaveStatus("error");
        throw err;
      }
    },
    [queryClient],
  );

  const triggerDebouncedAutoSave = useCallback(() => {
    if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    autoSaveTimerRef.current = setTimeout(async () => {
      // Validate before saving: skip if both title and content are blank
      const hasTitle = titleRef.current.trim().length > 0;
      const rawContent = contentRef.current;
      const isContentEmpty =
        !rawContent ||
        rawContent === '{"type":"doc","content":[{"type":"paragraph"}]}' ||
        rawContent === '{"type":"doc","content":[]}';
      if (!hasTitle && isContentEmpty) return;

      setSaveStatus("saving");
      try {
        await saveArticle({
          title: titleRef.current,
          content: contentRef.current,
        });
      } catch {
        // saveArticle handles error status
      }
    }, 1500);
  }, [saveArticle]);

  const sessionUserId = session?.user?.id;

  useEffect(() => {
    // /new is no longer a valid editor route — articles are created before navigation
    if (routeId === "new") {
      router.replace("/dashboard?tab=articles");
      return;
    }

    if (!sessionUserId || !routeId) return;

    async function loadArticle() {
      try {
        const res = await fetch(`/api/dashboard/blogs/${routeId}`);
        if (!res.ok) {
          toast.error("Could not load article. Redirecting…");
          router.replace("/dashboard?tab=articles");
          return;
        }
        const data = (await res.json()) as { blog: ArticleData };
        articleIdRef.current = data.blog.id;
        setTitle(data.blog.title || "");
        titleRef.current = data.blog.title || "";
        setIsPublished(data.blog.isPublished);
        initialContentRef.current = data.blog.content || "";
        contentRef.current = data.blog.content || "";
        setSaveStatus("saved");
      } catch {
        toast.error("Failed to load article.");
        router.replace("/dashboard?tab=articles");
      } finally {
        setLoading(false);
      }
    }

    void loadArticle();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routeId, sessionUserId]);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    titleRef.current = val;
    triggerDebouncedAutoSave();
  };

  const handleBack = async () => {
    // Cancel any pending auto-save
    if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);

    const currentId = articleIdRef.current;
    const hasTitle = titleRef.current.trim().length > 0;
    const rawContent = contentRef.current;
    const isContentEmpty =
      !rawContent ||
      rawContent === '{"type":"doc","content":[{"type":"paragraph"}]}' ||
      rawContent === '{"type":"doc","content":[]}';

    // Auto-delete blank articles so they don't pile up in the list
    if (currentId && !hasTitle && isContentEmpty) {
      try {
        await fetch(`/api/dashboard/blogs/${currentId}`, { method: "DELETE" });
      } catch {
        // best-effort delete, don't block navigation
      }
    }

    void queryClient.invalidateQueries({ queryKey: ["profile"] });
    router.push("/dashboard?tab=articles");
  };

  const handlePublishToggle = async () => {
    if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    const nextState = !isPublished;
    setIsTogglingPublish(true);
    setIsPublished(nextState);

    try {
      await saveArticle({
        isPublished: nextState,
        title: titleRef.current,
        content: contentRef.current,
      });
      toast.success(nextState ? "Article published!" : "Switched to draft.");
    } catch {
      setIsPublished(!nextState);
      toast.error("Failed to update status.");
    } finally {
      setIsTogglingPublish(false);
    }
  };

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

      if (!isSubscribed) {
        setSupportMeOpen(true);
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }

      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        toast.error("Only JPEG, PNG, GIF, and WebP images are supported.");
        return;
      }
      if (file.size > MAX_IMAGE_SIZE_BYTES) {
        toast.error("Image must be smaller than 10 MB.");
        return;
      }

      const altText = file.name.replace(/\.[^.]+$/, "");
      const toastId = toast.loading("Uploading image…");

      try {
        const { url, publicId } = await uploadToCloudinary(file);
        insertImageIntoEditor(editorInstance, url, publicId, altText, insertPos);
        toast.success("Image uploaded!", { id: toastId });
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : "Failed to upload image.",
          { id: toastId },
        );
      } finally {
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    },
    [insertImageIntoEditor, isSubscribed],
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
        try {
          await fetch("/api/dashboard/upload", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ publicId: img.publicId }),
          });
          deletedPublicIdsRef.current.add(img.publicId);
        } catch {
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
          "tiptap-editor-content w-full min-h-[500px] outline-none text-(--lf-ink) text-[1.125rem] leading-[1.8] font-sans",
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
      const jsonStr = JSON.stringify(json);
      contentRef.current = jsonStr;
      triggerDebouncedAutoSave();

      setWordCount(e.storage.characterCount.words() as number);
      setCharCount(e.storage.characterCount.characters() as number);

      const images = extractImagesFromTiptapJson(json);
      setUploadedImages(images);
      syncImageCleanup(images);
    },
  });

  useEffect(() => {
    if (!editor || loading) return;
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
  }, [editor, loading]);

  const handleDeleteImage = useCallback(
    async (img: TiptapImageInfo) => {
      if (!editor) return;
      if (
        !window.confirm(
          "Delete this image from the article?",
        )
      )
        return;

      setDeletingPublicId(img.publicId);
      const toastId = toast.loading("Deleting image…");

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
        toast.error("Failed to delete image.", { id: toastId });
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

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-(--lf-bg) text-(--lf-muted)">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={24} className="animate-spin text-(--lf-ink)" />
          <span className="text-sm font-sans-body">Opening story…</span>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-(--lf-bg) text-(--lf-ink) overflow-hidden font-sans-body">
      <header className="h-14 flex items-center justify-between px-4 sm:px-8 border-b border-(--lf-border-alpha) bg-(--lf-surface)/85 backdrop-blur-md shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={() => void handleBack()}
            aria-label="Back to dashboard"
            className="inline-flex items-center justify-center w-8 h-8 rounded-full text-(--lf-muted) hover:text-(--lf-ink) hover:bg-(--lf-bg) transition-colors cursor-pointer shrink-0"
          >
            <ArrowLeft size={16} />
          </button>

          <div className="flex items-center gap-2 min-w-0 text-xs text-(--lf-muted) font-mono">
            <span className="truncate max-w-[120px] sm:max-w-[200px]">
              {title.trim() ? title : "Draft story"}
            </span>
            <span className="opacity-40">•</span>
            {saveStatus === "saving" && (
              <span className="flex items-center gap-1.5 text-(--lf-muted)">
                <Loader2 size={11} className="animate-spin" />
                Saving…
              </span>
            )}
            {saveStatus === "saved" && (
              <span className="flex items-center gap-1 text-(--lf-muted)">
                <Check size={11} className="text-emerald-600 dark:text-emerald-400" />
                Saved
              </span>
            )}
            {saveStatus === "error" && (
              <span className="text-rose-500 font-medium">Failed to save</span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          <div className="text-xs text-(--lf-muted) font-mono hidden sm:block">
            {wordCount} words
          </div>

          <button
            type="button"
            onClick={() => void handlePublishToggle()}
            disabled={isTogglingPublish}
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[0.78rem] font-semibold cursor-pointer transition-all disabled:opacity-50 ${
              isPublished
                ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/25"
                : "bg-(--lf-ink) text-(--lf-bg) hover:opacity-85 shadow-xs"
            }`}
          >
            {isTogglingPublish ? (
              <Loader2 size={12} className="animate-spin" />
            ) : (
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isPublished ? "bg-emerald-500" : "bg-amber-400"
                }`}
              />
            )}
            <span>{isPublished ? "Published" : "Publish"}</span>
          </button>
        </div>
      </header>
      <Toolbar
        editor={editor}
        onImageClick={() => {
          if (!isSubscribed) {
            setSupportMeOpen(true);
            return;
          }
          fileInputRef.current?.click();
        }}
      />

      <input
        ref={fileInputRef}
        type="file"
        accept={ALLOWED_IMAGE_TYPES.join(",")}
        onChange={handleFileInputChange}
        className="hidden"
        aria-label="Upload image"
      />

      {uploadedImages.length > 0 && (
        <div className="px-6 py-2 border-b border-(--lf-border-alpha) bg-(--lf-surface)/50 flex items-center gap-2 overflow-x-auto shrink-0 justify-center">
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
          <input
            type="text"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Title"
            className="w-full bg-transparent outline-none text-3xl sm:text-5xl font-serif-display font-medium text-(--lf-ink) placeholder:text-(--lf-muted)/40 mb-6 border-none"
            aria-label="Article title"
          />

          <EditorContent editor={editor} />
        </div>
      </div>

      {supportMeOpen && (
        <SupportMeModal
          onClose={() => {
            setSupportMeOpen(false);
            fetch("/api/subscription?sync=true")
              .then((r) => r.json())
              .then((d) => {
                if (d?.isActive) setIsSubscribed(true);
              })
              .catch(() => {});
          }}
        />
      )}
    </div>
  );
}
