import { useMutation } from "@tanstack/react-query";

export const useCreateExperience = ()=>{
    const mutation = useMutation({
        mutationFn: async (data: any)=>{
            const response = await fetch('/api/experience', {
                method: "POST",
                 headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            })

            if(!response.ok) throw new Error("failed to create the user");

            return response.json();
        }
    })

    return mutation;
}