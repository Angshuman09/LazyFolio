import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteJson } from "@/lib/utils/request";

export function useDeleteExperience() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (experienceId: string) =>
      deleteJson(
        `/api/dashboard/experiences/${experienceId}`,
        "Failed to delete experience",
      ),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
}
