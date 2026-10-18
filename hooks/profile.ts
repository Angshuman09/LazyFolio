import { ProfileSchema } from "@/lib/schemas/profile";
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

type ProfileUpdateContext = {
  previousProfile: unknown;
  userId: string;
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
    onMutate: async (newProfileData: ProfileSchema) => {
      await queryClient.cancelQueries({ queryKey: ["profile", newProfileData.userId] });
      const previousProfile = queryClient.getQueryData(["profile", newProfileData.userId]);
      queryClient.setQueryData<ProfileSchema>(
        ["profile", newProfileData.userId],
        (old) => (old ? { ...old, ...newProfileData } : old),
      );
      return { previousProfile, userId: newProfileData.userId };
    },
    onError: (_err, _newProfile, context: ProfileUpdateContext | undefined) => {
      if (context) {
        queryClient.setQueryData(["profile", context.userId], context.previousProfile);
      }
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["profile"] }),
  });

  return mutation;
};
