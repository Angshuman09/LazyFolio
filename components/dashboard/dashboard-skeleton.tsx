'use client'

export function DashboardSkeleton() {
  return (
    <div className="animate-pulse space-y-7 max-w-3xl">
      <div className="space-y-2">
        <div className="h-8 bg-(--lf-border) rounded-lg w-1/4"></div>
        <div className="h-4 bg-(--lf-border) rounded w-2/5"></div>
      </div>
      
      <div className="h-[72px] bg-(--lf-surface) border border-(--lf-border) rounded-xl"></div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div className="h-[140px] bg-(--lf-surface) border border-(--lf-border) rounded-xl"></div>
        <div className="h-[140px] bg-(--lf-surface) border border-(--lf-border) rounded-xl"></div>
      </div>
      
      <div className="h-[320px] bg-(--lf-surface) border border-(--lf-border) rounded-xl mt-7"></div>
    </div>
  );
}

export function TemplateRendererSkeleton() {
  return (
    <div className="min-h-screen bg-(--lf-bg) px-6 py-14 animate-pulse">
      <div className="mx-auto max-w-[640px] space-y-9">
        <div className="space-y-3">
          <div className="h-4 w-1/2 rounded bg-(--lf-border)" />
          <div className="h-3 w-1/3 rounded bg-(--lf-border)" />
        </div>

        <div className="space-y-5">
          <div className="h-34 rounded-xl border border-(--lf-border) bg-(--lf-surface)" />
          <div className="space-y-2">
            <div className="h-5 w-1/3 rounded bg-(--lf-border)" />
            <div className="h-3 w-2/5 rounded bg-(--lf-border)" />
            <div className="h-3 w-full rounded bg-(--lf-border)" />
            <div className="h-3 w-4/5 rounded bg-(--lf-border)" />
          </div>
        </div>

        <div className="h-px bg-(--lf-border-alpha)" />

        <div className="space-y-5">
          <div className="h-4 w-32 rounded bg-(--lf-border)" />
          {[0, 1].map((item) => (
            <div key={item} className="space-y-3">
              <div className="flex items-center justify-between gap-4">
                <div className="h-4 w-40 rounded bg-(--lf-border)" />
                <div className="h-3 w-24 rounded bg-(--lf-border)" />
              </div>
              <div className="h-3 w-full rounded bg-(--lf-border)" />
              <div className="h-3 w-5/6 rounded bg-(--lf-border)" />
            </div>
          ))}
        </div>

        <div className="h-px bg-(--lf-border-alpha)" />

        <div className="space-y-3">
          <div className="h-4 w-28 rounded bg-(--lf-border)" />
          {[0, 1, 2].map((item) => (
            <div
              key={item}
              className="h-14 rounded-lg border border-(--lf-border) bg-(--lf-surface)"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
