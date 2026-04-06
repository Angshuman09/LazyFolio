import { useMutation, useQuery } from "@tanstack/react-query";

export const useUserProfile = (userId?: string) => {

    const query = useQuery({
        queryKey: ["profile", userId],
        queryFn: async () => {
            const res = await fetch(`/api/profile?userId=${userId}`, {
                method: "GET",
            });
            if (!res.ok) throw new Error("Failed to get profile");

            return res.json();
        },
        enabled: !!userId,
    })

    return query;
}

export const useUpdateUserProfile = () => {
    const mutation = useMutation({
        mutationFn: async (profileData: any) => {
            const res = await fetch(`/api/profile`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(profileData),
            });
            if (!res.ok) throw new Error("Failed to update profile");
            return res.json();
        }
    });
    return mutation;
}