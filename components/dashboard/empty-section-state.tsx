type EmptySectionStateProps = {
  message: string;
};

export function EmptySectionState({ message }: EmptySectionStateProps) {
  return (
    <div className="rounded-2xl border border-dashed border-(--lf-border) bg-(--lf-surface)/60 px-5 py-8 text-center">
      <p className="text-sm font-semibold text-(--lf-ink)">Nothing here yet</p>
      <p className="mx-auto mt-1 max-w-md text-sm leading-6 text-(--lf-muted)">{message}</p>
    </div>
  );
}
