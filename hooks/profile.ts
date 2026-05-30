import { ProfileSchema } from "@/schemas/profile";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetUserProfile = (userId?: string) => {
  const query = useQuery({
    queryKey: ["profile", userId],
    queryFn: async () => {
      const res = await fetch(`/api/dashboard/profile?userId=${userId}`, {
        method: "GET",
      });
      const payload = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(payload?.error || "Failed to get profile");
      }

      return payload;
    },
    enabled: !!userId,
  });

  return query;
};

export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (profileData: ProfileSchema) => {
      const res = await fetch(`/api/dashboard/profile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profileData),
      });
      const payload = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(payload?.error || "Failed to update profile");
      }

      return payload;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });

  return mutation;
};
