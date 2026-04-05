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
