import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postJson } from "@/lib/utils/request";

export function useCreateLinks() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (linkData: unknown) =>
      postJson("/api/dashboard/links", linkData, "Failed to update links"),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
}
