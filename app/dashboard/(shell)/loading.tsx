import {
  DashboardSkeleton,
  TemplateRendererSkeleton,
} from "@/components/dashboard/dashboard-skeleton";
import {
  DashboardMain,
  DashboardPreviewPanel,
} from "@/components/dashboard/dashboard-content-shell";

/**
 * Fallback for the content column only: the shell (header / sidebar / preview
 * frame) comes from the segment layout and stays on screen, so this state and
 * the client-side data state in page.tsx render the exact same layout.
 */
export default function DashboardLoading() {
  return (
    <>
      <DashboardMain>
        <DashboardSkeleton />
      </DashboardMain>

      <DashboardPreviewPanel>
        <TemplateRendererSkeleton />
      </DashboardPreviewPanel>
    </>
  );
}
