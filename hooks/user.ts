import { useMutation, useQuery } from "@tanstack/react-query";

export const useCreateUser = () => {
  const mutation = useMutation({
    mutationFn: async (data: { clerkId: string; email: string }) => {
      const res = await fetch("/api/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clerkId: data.clerkId,
          email: data.email,
        }),
      });
      if (!res.ok) {
        throw new Error("Failed to create user");
      }
      return res.json();
    },
  });

  return mutation;
};

export const useGetUser = (clerkId?: string) => {
  const query = useQuery({
    queryKey: ["user", clerkId],
    queryFn: async () => {
      const res = await fetch(`/api/user?clerkId=${clerkId}`, {
        method: "GET",
      });
      if (!res.ok) throw new Error("Failed to get user");

      return res.json();
    },
    enabled: !!clerkId,
  });

  return query;
};