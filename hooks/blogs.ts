import { useMutation } from "@tanstack/react-query";


export function useCreateBlogs(){
    const mutation = useMutation({
        mutationFn: async (data: any)=>{
            const response = await fetch('/api/blogs',{
                method: "POST",
                 headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            })

            if(!response.ok) throw new Error("failed to update blogs")
            return response.json();
        }
    })

    return mutation;
}
