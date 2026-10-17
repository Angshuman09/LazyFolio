import { useMutation, useQueryClient } from "@tanstack/react-query";
import { clearDashboardDraft } from "@/lib/cache/dashboard-drafts";


export function useCreateProjects(){
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async (data: unknown)=>{
            const response = await fetch('/api/dashboard/projects',{
                method: "POST",
                 headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });
            const payload = await response.json().catch(() => null);

            if(!response.ok) throw new Error(payload?.error || "Failed to update projects");
            return payload;
        },
        onSuccess: async (_result, variables) => {
            const profileId = (variables as { profileId?: unknown } | undefined)?.profileId;
            if (typeof profileId === "string") {
                // Clear the draft before the profile refetch so the form resets
                // from the newly saved server data instead of the old blank-id draft.
                clearDashboardDraft("projects", profileId);
            }
            await queryClient.invalidateQueries({ queryKey: ["profile"] });
        }
    });

    return mutation;
}
