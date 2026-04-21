import { useMutation, useQueryClient } from "@tanstack/react-query";


export function useCreateProjects(){
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async (data: unknown)=>{
            const response = await fetch('/api/projects',{
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
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["profile"] });
        }
    });

    return mutation;
}
