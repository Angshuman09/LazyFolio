import { useMutation, useQueryClient } from "@tanstack/react-query";


export function useDeleteLink(){
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: async (linkId: string)=>{
            const response = await fetch(`/api/dashboard/links/${linkId}`,{
                method: "DELETE",
            });
            const payload = await response.json().catch(() => null);

            if(!response.ok) throw new Error(payload?.error || "Failed to delete link");
            return payload;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["profile"] });
        }
    });

    return mutation;
}

export function useCreateLink(){
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: async (linkData: unknown)=>{
            const response = await fetch('/api/dashboard/link',{
                method: "POST",
                 headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(linkData),
            });
            const payload = await response.json().catch(() => null);

            if(!response.ok) throw new Error(payload?.error || "Failed to create link");
            return payload;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["profile"] });
        }
    });

    return mutation;
}
