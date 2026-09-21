/**
 * Tiptap extension definitions for LazyFolio blog editor.
 *
 * Two exports:
 *  - `htmlExtensions` — server-safe, used by generateHTML in the public page
 *  - `editorExtensions` — full set including CharacterCount for the client editor
 */

import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import { CharacterCount } from "@tiptap/extensions";
import Placeholder from "@tiptap/extension-placeholder";

// ---------------------------------------------------------------------------
// CloudinaryImage — Image extended with a `data-public-id` attribute so we
// can track Cloudinary public IDs without comment markers in the content.
// ---------------------------------------------------------------------------
export const CloudinaryImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      "data-public-id": {
        default: null,
        parseHTML: (element: HTMLElement) => element.getAttribute("data-public-id"),
        renderHTML: (attributes: Record<string, unknown>) => {
          if (!attributes["data-public-id"]) return {};
          return { "data-public-id": attributes["data-public-id"] as string };
        },
      },
    };
  },
});

// ---------------------------------------------------------------------------
// Extensions used both in the editor and for server-side generateHTML.
// Must NOT include CharacterCount or any other render-only extension.
// ---------------------------------------------------------------------------
export const htmlExtensions = [
  StarterKit.configure({
    heading: { levels: [1, 2] },
    link: false,
  }),
  CloudinaryImage.configure({
    allowBase64: false,
    HTMLAttributes: {
      class:
        "rounded-xl max-h-[450px] w-auto mx-auto object-cover border border-(--lf-border) shadow-sm my-6",
    },
  }),
  Link.configure({
    openOnClick: false,
    autolink: true,
    linkOnPaste: true,
    defaultProtocol: "https",
    protocols: ["http", "https", "mailto"],
    HTMLAttributes: {
      class: "underline text-indigo-600 dark:text-indigo-400 hover:opacity-80",
      target: "_blank",
      rel: "noopener noreferrer nofollow",
    },
    isAllowedUri: (url, ctx) => {
      if (url.startsWith("javascript:")) return false;
      return ctx.defaultValidate(url);
    },
  }),
];

// ---------------------------------------------------------------------------
// Full set used by the client-side editor (includes CharacterCount).
// ---------------------------------------------------------------------------
export const editorExtensions = [
  ...htmlExtensions,
  CharacterCount,
  Placeholder.configure({
    placeholder: "Write your article here...",
    emptyEditorClass: "is-editor-empty",
  }),
];
