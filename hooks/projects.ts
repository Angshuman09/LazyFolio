import { useMutation, useQueryClient } from "@tanstack/react-query";
import { clearDashboardDraft } from "@/lib/cache/dashboard-drafts";
import { postJson } from "@/lib/utils/request";

export function useCreateProjects() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: unknown) =>
      postJson("/api/dashboard/projects", data, "Failed to update projects"),
    onSuccess: async (_result, variables) => {
      const profileId = (variables as { profileId?: unknown } | undefined)
        ?.profileId;
      if (typeof profileId === "string") {
        // Clear the draft before the profile refetch so the form resets
        // from the newly saved server data instead of the old blank-id draft.
        clearDashboardDraft("projects", profileId);
      }
      await queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
}
