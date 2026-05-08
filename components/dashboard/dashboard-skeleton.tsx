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
