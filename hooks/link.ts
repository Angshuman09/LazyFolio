import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteJson, postJson } from "@/lib/utils/request";
import type { links } from "@/db/client";

type CreateLinkResult = {
  data?: links;
};

export function useDeleteLink() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (linkId: string) =>
      deleteJson(`/api/dashboard/links/${linkId}`, "Failed to delete link"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
}

export function useCreateLink() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (linkData: unknown) =>
      postJson<CreateLinkResult>(
        "/api/dashboard/link",
        linkData,
        "Failed to create link",
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
}
