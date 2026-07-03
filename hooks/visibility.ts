import { useMutation, useQueryClient } from "@tanstack/react-query";

export type VisibilityTarget = "link" | "experience" | "project" | "blog" | "skills";

export function useUpdateVisibility() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      target: VisibilityTarget;
      id: string;
      isenable: boolean;
    }) => {
      const response = await fetch("/api/dashboard/visibility", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.error || "Failed to update visibility");
      }

      return data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
}
