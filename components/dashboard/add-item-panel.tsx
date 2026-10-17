import { Plus } from "lucide-react";

type AddItemPanelProps = {
  title: string;
  buttonLabel: string;
  onClick: () => void;
  disabled?: boolean;
};

export function AddItemPanel({ title, buttonLabel, onClick, disabled }: AddItemPanelProps) {
  return (
    <div className="mt-6 flex flex-col items-start justify-between gap-4 rounded-2xl border border-dashed border-(--lf-border) bg-(--lf-surface)/70 p-5 sm:flex-row sm:items-center sm:px-6">
      <div>
        <div className="text-sm font-semibold text-(--lf-ink)">{title}</div>
        <p className="mt-1 text-xs text-(--lf-muted)">Keep your portfolio current with another item.</p>
      </div>
      <button
        type="button"
        disabled={disabled}
        onClick={onClick}
        className="inline-flex h-10 items-center gap-2 rounded-xl bg-(--lf-ink) px-4 text-sm font-semibold text-(--lf-bg) transition hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-45"
      >
        <Plus size={15} />
        {buttonLabel}
      </button>
    </div>
  );
}
