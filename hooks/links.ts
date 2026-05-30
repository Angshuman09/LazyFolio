import { useMutation, useQueryClient } from "@tanstack/react-query";


export function useCreateLinks(){
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async (linkData: unknown)=>{
            const response = await fetch('/api/dashboard/links',{
                method: "POST",
                 headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(linkData),
            });
            const payload = await response.json().catch(() => null);

            if(!response.ok) throw new Error(payload?.error || "Failed to update links");
            return payload;
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["profile"] });
        }
    });

    return mutation;
}
