import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patchJson } from "@/lib/utils/request";
import type { VisibilityTarget } from "@/app/api/dashboard/visibility/route";

export type { VisibilityTarget };

export function useUpdateVisibility() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: {
      target: VisibilityTarget;
      id: string;
      isenable: boolean;
    }) =>
      patchJson(
        "/api/dashboard/visibility",
        payload,
        "Failed to update visibility",
      ),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
}
