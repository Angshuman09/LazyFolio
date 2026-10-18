import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteJson } from "@/lib/utils/request";

export function useDeleteBlog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (blogId: string) =>
      deleteJson(`/api/dashboard/blogs/${blogId}`, "Failed to delete blog"),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["profile"] });
      await queryClient.invalidateQueries({ queryKey: ["subscription"] });
    },
  });
}
