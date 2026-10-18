"use client";

export function UnsavedChangesModal({
  dirtyLabel,
  onCancel,
  onConfirm,
}: {
  dirtyLabel: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-sm transition-opacity duration-200 font-sans-body"
      onClick={onCancel}
    >
      <div
        className="bg-(--lf-bg) border border-(--lf-border) rounded-2xl w-full max-w-sm shadow-2xl p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="font-serif-display text-[1.1rem] font-medium text-(--lf-ink) mb-1.5">
          Unsaved Changes
        </h3>
        <p className="text-[0.8rem] text-(--lf-muted) mb-5 leading-relaxed">
          You have unsaved changes in <strong className="text-(--lf-ink)">{dirtyLabel}</strong>. Leaving now will discard these edits.
        </p>
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-3.5 h-8 rounded-full border border-(--lf-border) text-(--lf-muted) text-[0.78rem] font-medium hover:text-(--lf-ink) transition-colors cursor-pointer bg-transparent"
          >
            Stay on page
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-3.5 h-8 rounded-full bg-red-600 text-white text-[0.78rem] font-semibold hover:bg-red-700 transition-colors cursor-pointer border-none"
          >
            Discard changes
          </button>
        </div>
      </div>
    </div>
  );
}
