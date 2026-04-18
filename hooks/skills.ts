import { useMutation } from "@tanstack/react-query";

export function useCreateSkills(){
    const mutation = useMutation({
        mutationFn: async (data: any)=>{
            const response = await fetch('/api/skills',{
                method: "POST",
                 headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            })

            if(!response.ok) throw new Error("failed to update skills")
            return response.json();
        }
    })

    return mutation;
}
