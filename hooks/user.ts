import { useMutation } from "@tanstack/react-query";

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