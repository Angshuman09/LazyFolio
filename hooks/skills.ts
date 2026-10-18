import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postJson } from "@/lib/utils/request";

export function useCreateSkills() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: unknown) =>
      postJson("/api/dashboard/skills", data, "Failed to update skills"),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
}
