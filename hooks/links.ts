import { useMutation, useQuery } from "@tanstack/react-query";


export function useCreateLinks(){
    const mutation = useMutation({
        mutationFn: async (linkData: any)=>{
            const response = await fetch('/api/links',{
                method: "POST",
                 headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(linkData),
            })

            if(!response.ok) throw new Error("failed to update link")
            return response.json();
        }
    })

    return mutation;
}

export function useGetLinks(){
}