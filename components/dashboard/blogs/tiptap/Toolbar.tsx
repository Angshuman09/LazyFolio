"use client";

import { type Editor } from "@tiptap/react";
import {
  Undo,
  Redo,
  Bold,
  Italic,
  Strikethrough,
  Heading1,
  Heading2,
  Code,
  Code2,
  Quote,
  List,
  ListOrdered,
  Link as LinkIcon,
  Image as ImageIcon,
} from "lucide-react";
import { forwardRef, useCallback, useState } from "react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ToolbarButtonProps {
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
}

const ToolbarButton = forwardRef<HTMLButtonElement, ToolbarButtonProps>(
  function ToolbarButton({ onClick, isActive, disabled, title, children }, ref) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            ref={ref}
            type="button"
            aria-label={title}
            aria-pressed={isActive}
            disabled={disabled}
            onClick={onClick}
            className={cn(
              "inline-flex items-center justify-center w-7 h-7 rounded-full text-[0.8rem] transition-colors duration-100 shrink-0",
              isActive
                ? "bg-(--lf-surface) text-(--lf-ink) shadow-xs font-semibold"
                : "text-(--lf-muted) hover:text-(--lf-ink) hover:bg-(--lf-surface)",
              "disabled:opacity-30 disabled:cursor-not-allowed",
            )}
          >
            {children}
          </button>
        </TooltipTrigger>
        <TooltipContent side="bottom" sideOffset={6}>
          {title}
        </TooltipContent>
      </Tooltip>
    );
  }
);

function Divider() {
  return <div className="w-px h-4 bg-(--lf-border) mx-1 shrink-0" />;
}

// Languages offered for code blocks. Values are Shiki/TextMate grammar ids.
const CODE_BLOCK_LANGUAGES: Array<{ label: string; value: string }> = [
  { label: "Plain text", value: "" },
  { label: "JavaScript", value: "javascript" },
  { label: "TypeScript", value: "typescript" },
  { label: "JSX", value: "jsx" },
  { label: "TSX", value: "tsx" },
  { label: "JSON", value: "json" },
  { label: "HTML", value: "html" },
  { label: "CSS", value: "css" },
  { label: "SCSS", value: "scss" },
  { label: "Bash / Shell", value: "bash" },
  { label: "Python", value: "python" },
  { label: "Rust", value: "rust" },
  { label: "Go", value: "go" },
  { label: "Java", value: "java" },
  { label: "C", value: "c" },
  { label: "C++", value: "cpp" },
  { label: "C#", value: "csharp" },
  { label: "SQL", value: "sql" },
  { label: "YAML", value: "yaml" },
  { label: "Markdown", value: "markdown" },
  { label: "Ruby", value: "ruby" },
  { label: "PHP", value: "php" },
  { label: "Swift", value: "swift" },
  { label: "Kotlin", value: "kotlin" },
  { label: "GraphQL", value: "graphql" },
  { label: "Dockerfile", value: "dockerfile" },
  { label: "Diff", value: "diff" },
];

interface ToolbarProps {
  editor: Editor | null;
  onImageClick: () => void;
}

export function Toolbar({ editor, onImageClick }: ToolbarProps) {
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");

  const isDisabled = !editor;

  const openLinkDialog = useCallback(() => {
    if (!editor) return;
    if (editor.isActive("link")) {
      // Toggle off — remove the link
      editor.chain().focus().unsetLink().run();
      return;
    }
    const attrs = editor.getAttributes("link") as { href?: string };
    setLinkUrl(attrs.href || "https://");
    setShowLinkInput(true);
  }, [editor]);

  const applyLink = useCallback(() => {
    if (!editor) return;
    const url = linkUrl.trim();
    if (!url || url === "https://") {
      editor.chain().focus().unsetLink().run();
    } else if (!url.startsWith("javascript:")) {
      editor.chain().focus().setLink({ href: url }).run();
    }
    setShowLinkInput(false);
    setLinkUrl("");
  }, [editor, linkUrl]);

  const cancelLink = useCallback(() => {
    setShowLinkInput(false);
    setLinkUrl("");
  }, []);

  return (
    <div className="relative shrink-0">
      {/* Main toolbar row */}
      <div className="h-11 flex items-center justify-center gap-1 px-4 border-b border-(--lf-border) bg-(--lf-surface)/60 backdrop-blur-sm overflow-x-auto select-none">
        {/* Undo / Redo */}
        <ToolbarButton
          title="Undo (Ctrl/⌘+Z)"
          disabled={isDisabled || !editor?.can().undo()}
          onClick={() => editor?.chain().focus().undo().run()}
        >
          <Undo size={14} />
        </ToolbarButton>

        <ToolbarButton
          title="Redo (Ctrl/⌘+Shift+Z)"
          disabled={isDisabled || !editor?.can().redo()}
          onClick={() => editor?.chain().focus().redo().run()}
        >
          <Redo size={14} />
        </ToolbarButton>

        <Divider />

        {/* Headings */}
        <ToolbarButton
          title="Heading 1"
          isActive={editor?.isActive("heading", { level: 1 })}
          disabled={isDisabled}
          onClick={() =>
            editor?.chain().focus().toggleHeading({ level: 1 }).run()
          }
        >
          <Heading1 size={14} />
        </ToolbarButton>

        <ToolbarButton
          title="Heading 2"
          isActive={editor?.isActive("heading", { level: 2 })}
          disabled={isDisabled}
          onClick={() =>
            editor?.chain().focus().toggleHeading({ level: 2 }).run()
          }
        >
          <Heading2 size={14} />
        </ToolbarButton>

        <Divider />

        {/* Lists & Blocks */}
        <ToolbarButton
          title="Bullet List"
          isActive={editor?.isActive("bulletList")}
          disabled={isDisabled}
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
        >
          <List size={14} />
        </ToolbarButton>

        <ToolbarButton
          title="Numbered List"
          isActive={editor?.isActive("orderedList")}
          disabled={isDisabled}
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered size={14} />
        </ToolbarButton>

        <ToolbarButton
          title="Quote"
          isActive={editor?.isActive("blockquote")}
          disabled={isDisabled}
          onClick={() => editor?.chain().focus().toggleBlockquote().run()}
        >
          <Quote size={14} />
        </ToolbarButton>

        <ToolbarButton
          title="Code Block"
          isActive={editor?.isActive("codeBlock")}
          disabled={isDisabled}
          onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
        >
          <Code2 size={14} />
        </ToolbarButton>

        {editor?.isActive("codeBlock") && (
          <select
            aria-label="Code block language"
            value={
              (editor.getAttributes("codeBlock") as { language?: string | null })
                .language ?? ""
            }
            onChange={(e) => {
              editor
                .chain()
                .focus()
                .updateAttributes("codeBlock", {
                  language: e.target.value || null,
                })
                .run();
            }}
            className="h-7 shrink-0 cursor-pointer rounded-full border border-(--lf-border) bg-(--lf-surface) px-2 text-[0.72rem] text-(--lf-ink) outline-none"
          >
            {CODE_BLOCK_LANGUAGES.map((lang) => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </select>
        )}

        <Divider />

        {/* Inline Formatting */}
        <ToolbarButton
          title="Bold"
          isActive={editor?.isActive("bold")}
          disabled={isDisabled}
          onClick={() => editor?.chain().focus().toggleBold().run()}
        >
          <Bold size={14} />
        </ToolbarButton>

        <ToolbarButton
          title="Italic"
          isActive={editor?.isActive("italic")}
          disabled={isDisabled}
          onClick={() => editor?.chain().focus().toggleItalic().run()}
        >
          <Italic size={14} />
        </ToolbarButton>

        <ToolbarButton
          title="Strikethrough"
          isActive={editor?.isActive("strike")}
          disabled={isDisabled}
          onClick={() => editor?.chain().focus().toggleStrike().run()}
        >
          <Strikethrough size={14} />
        </ToolbarButton>

        <ToolbarButton
          title="Inline Code"
          isActive={editor?.isActive("code")}
          disabled={isDisabled}
          onClick={() => editor?.chain().focus().toggleCode().run()}
        >
          <Code size={14} />
        </ToolbarButton>

        <Divider />

        {/* Link & Media */}
        <ToolbarButton
          title={editor?.isActive("link") ? "Remove Link" : "Insert Link"}
          isActive={editor?.isActive("link")}
          disabled={isDisabled}
          onClick={openLinkDialog}
        >
          <LinkIcon size={14} />
        </ToolbarButton>

        <ToolbarButton
          title="Insert Image"
          disabled={isDisabled}
          onClick={onImageClick}
        >
          <ImageIcon size={14} />
        </ToolbarButton>
      </div>

      {/* Link URL input popover */}
      {showLinkInput && (
        <>
          {/* Backdrop to close on outside click */}
          <div
            className="fixed inset-0 z-10"
            onClick={cancelLink}
            aria-hidden="true"
          />
          <div className="absolute left-4 top-full mt-1 z-20 flex items-center gap-2 bg-(--lf-surface) border border-(--lf-border) rounded-xl px-3 py-2.5 shadow-lg">
            <input
              autoFocus
              type="url"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") applyLink();
                if (e.key === "Escape") cancelLink();
              }}
              placeholder="https://example.com"
              className="bg-transparent border-none outline-none text-[0.8rem] font-mono text-(--lf-ink) w-60 placeholder:text-(--lf-dimmed)"
            />
            <button
              type="button"
              onClick={applyLink}
              className="shrink-0 text-[0.72rem] font-semibold text-(--lf-ink) bg-(--lf-border) hover:bg-(--lf-tan) px-3 py-1 rounded-full transition-colors cursor-pointer"
            >
              Apply
            </button>
            <button
              type="button"
              onClick={cancelLink}
              className="shrink-0 text-[0.72rem] text-(--lf-muted) hover:text-(--lf-ink) px-2 py-1 rounded-full transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </>
      )}
    </div>
  );
}
