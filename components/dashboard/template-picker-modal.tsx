"use client";

import Image from "next/image";
import { Check } from "lucide-react";
import { TEMPLATES } from "@/components/resources/extras";

export function TemplatePickerModal({
  activeTemplate,
  onSelect,
  onClose,
  onApply,
  isDisabled,
  isSaving,
}: {
  activeTemplate: string;
  onSelect: (templateId: string) => void;
  onClose: () => void;
  onApply: () => void;
  isDisabled: boolean;
  isSaving: boolean;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-sm transition-opacity duration-200"
      onClick={onClose}
    >
      <div
        className="bg-(--lf-bg) border border-(--lf-border) rounded-2xl w-full max-w-xl sm:max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-5 sm:px-6 pt-5 sm:pt-6 pb-4 border-b border-(--lf-border-alpha) shrink-0">
          <h2 className="font-serif-display text-[1.25rem] font-medium text-(--lf-ink) mb-1 leading-tight">
            Choose a template
          </h2>
          <p className="text-[0.82rem] text-(--lf-muted) leading-relaxed">
            Pick how your public portfolio page looks. You can change this anytime.
          </p>
        </div>

        <div className="px-5 sm:px-6 py-5 overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {TEMPLATES.map((t) => (
              <button
                type="button"
                key={t.id}
                disabled={isDisabled}
                className={`group flex flex-col overflow-hidden rounded-2xl border text-left transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60 ${activeTemplate === t.id
                  ? "border-(--lf-ink) ring-2 ring-(--lf-ink)/12 bg-(--lf-accent-soft)"
                  : "border-(--lf-border) bg-(--lf-surface) hover:border-(--lf-muted) hover:shadow-md"
                  }`}
                onClick={() => onSelect(t.id)}
              >
                <div className="relative w-full aspect-4/3 overflow-hidden bg-(--lf-border-alpha)">
                  <Image
                    src={t.image}
                    alt={`${t.label} template preview`}
                    fill
                    sizes="(max-width: 640px) 90vw, 420px"
                    className="object-cover object-top transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/10 via-transparent to-transparent" />
                  <div
                    className={`absolute left-2.5 top-2.5 w-7 h-7 rounded-full flex items-center justify-center shadow-sm ${activeTemplate === t.id
                      ? "bg-(--lf-ink) text-(--lf-bg)"
                      : "bg-(--lf-bg)/85 text-(--lf-muted) border border-(--lf-border-alpha) backdrop-blur-sm"
                      }`}
                  >
                    {activeTemplate === t.id ? (
                      <Check size={13} />
                    ) : (
                      <span className="text-[0.68rem] font-mono font-semibold">
                        {t.emoji}
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-3.5">
                  <div className="text-[0.9rem] font-semibold text-(--lf-ink)">
                    {t.label}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-end gap-2.5 px-5 sm:px-6 py-4 border-t border-(--lf-border-alpha) shrink-0">
          <button
            className="inline-flex items-center gap-1.5 px-4 h-9 rounded-full bg-transparent border border-(--lf-border) text-(--lf-muted) text-[0.8rem] font-medium cursor-pointer hover:text-(--lf-ink) hover:border-(--lf-muted) transition-all duration-150 font-sans whitespace-nowrap disabled:opacity-55 disabled:cursor-not-allowed"
            onClick={onClose}
            disabled={isDisabled}
          >
            Cancel
          </button>
          <button
            className="inline-flex items-center gap-1.5 px-4 h-9 rounded-full bg-(--lf-ink) text-(--lf-bg) text-[0.8rem] font-semibold border-none cursor-pointer hover:opacity-85 transition-opacity duration-150 font-sans whitespace-nowrap disabled:opacity-55 disabled:cursor-not-allowed"
            onClick={onApply}
            disabled={isDisabled}
          >
            {isSaving ? (
              <>
                <svg
                  className="animate-spin"
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                >
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                </svg>
                Applying…
              </>
            ) : (
              "Apply template"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
