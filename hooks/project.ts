import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteJson, postJson } from "@/lib/utils/request";
import type { Project } from "@/db/client";

type CreateProjectResult = {
  data?: Project;
};

export function useDeleteProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (projectId: string) =>
      deleteJson(
        `/api/dashboard/projects/${projectId}`,
        "Failed to delete project",
      ),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (projectData: unknown) =>
      postJson<CreateProjectResult>(
        "/api/dashboard/project",
        projectData,
        "Failed to save project",
      ),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
}
