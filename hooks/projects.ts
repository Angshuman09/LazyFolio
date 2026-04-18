import { useMutation } from "@tanstack/react-query";


export function useCreateProjects(){
    const mutation = useMutation({
        mutationFn: async (data: any)=>{
            const response = await fetch('/api/projects',{
                method: "POST",
                 headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            })

            if(!response.ok) throw new Error("failed to update projects")
            return response.json();
        }
    })

    return mutation;
}
