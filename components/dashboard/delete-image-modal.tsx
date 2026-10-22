"use client";

import { useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { Trash2, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { TiptapImageInfo } from "@/lib/utils/tiptap-content";

interface DeleteImageModalProps {
  image: TiptapImageInfo | null;
  isOpen: boolean;
  isDeleting?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteImageModal({
  image,
  isOpen,
  isDeleting = false,
  onClose,
  onConfirm,
}: DeleteImageModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isDeleting) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isDeleting, onClose]);

  return (
    <AnimatePresence>
      {isOpen && image && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.16 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-xs cursor-pointer"
            onClick={() => {
              if (!isDeleting) onClose();
            }}
            aria-hidden="true"
          />

          {/* Dialog Card */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-sm rounded-2xl bg-(--lf-bg) border border-(--lf-border) shadow-2xl p-5 z-10 font-sans-body"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-image-dialog-title"
          >
            {/* Close icon button */}
            <button
              type="button"
              onClick={onClose}
              disabled={isDeleting}
              className="absolute top-4 right-4 p-1.5 rounded-full text-(--lf-muted) hover:text-(--lf-ink) hover:bg-(--lf-surface) transition-colors cursor-pointer disabled:opacity-50"
              aria-label="Close dialog"
            >
              <X size={15} />
            </button>

            {/* Header: Icon + Title */}
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center shrink-0">
                <Trash2 size={17} />
              </div>
              <div>
                <h3
                  id="delete-image-dialog-title"
                  className="font-serif-display text-lg font-medium text-(--lf-ink) leading-tight"
                >
                  Delete Image
                </h3>
                <p className="text-xs text-(--lf-muted)">
                  This action cannot be undone.
                </p>
              </div>
            </div>

            {/* Image Preview Box */}
            <div className="flex items-center gap-3 p-2.5 my-3.5 rounded-xl border border-(--lf-border) bg-(--lf-surface)/60 overflow-hidden">
              <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-black/5 dark:bg-white/5 border border-(--lf-border-alpha)">
                <Image
                  src={image.src}
                  alt={image.alt || "Image preview"}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-mono font-medium text-(--lf-ink) truncate">
                  {image.alt || "Uploaded image"}
                </p>
                <p className="text-[0.68rem] font-mono text-(--lf-muted) truncate">
                  {image.publicId}
                </p>
              </div>
            </div>

            <p className="text-xs text-(--lf-muted) leading-relaxed mb-5">
              Are you sure you want to remove this image from the article and cloud storage?
            </p>

            {/* Action buttons */}
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                disabled={isDeleting}
                className="px-4 h-8 rounded-full border border-(--lf-border) text-(--lf-muted) text-xs font-medium hover:text-(--lf-ink) hover:bg-(--lf-surface) transition-colors cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <Button
                type="button"
                variant="destructive"
                disabled={isDeleting}
                onClick={onConfirm}
                className="rounded-full cursor-pointer h-8 text-xs font-medium px-4"
              >
                {isDeleting ? (
                  <>
                    <Loader2 size={13} className="animate-spin mr-1.5" />
                    Deleting…
                  </>
                ) : (
                  "Delete image"
                )}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
