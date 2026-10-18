import { DashboardSkeleton } from "@/components/dashboard/dashboard-skeleton";

export default function DashboardLoading() {
  return (
    <div className="min-h-dvh bg-(--lf-bg) text-(--lf-ink) px-5 py-5 sm:px-8 sm:py-8">
      <DashboardSkeleton />
    </div>
  );
}
