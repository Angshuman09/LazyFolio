import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "../prisma";

function isValidConfig(val?: string) {
  if (!val) return false;
  const trimmed = val.trim();
  return (
    trimmed !== "" &&
    trimmed !== "mock" &&
    !trimmed.startsWith("your-") &&
    !trimmed.startsWith("p_your-")
  );
}

const socialProviders: Record<string, { clientId: string; clientSecret: string }> = {};

if (
  isValidConfig(process.env.GITHUB_CLIENT_ID) &&
  isValidConfig(process.env.GITHUB_CLIENT_SECRET)
) {
  socialProviders.github = {
    clientId: process.env.GITHUB_CLIENT_ID!.trim(),
    clientSecret: process.env.GITHUB_CLIENT_SECRET!.trim(),
  };
}

if (
  isValidConfig(process.env.GOOGLE_CLIENT_ID) &&
  isValidConfig(process.env.GOOGLE_CLIENT_SECRET)
) {
  socialProviders.google = {
    clientId: process.env.GOOGLE_CLIENT_ID!.trim(),
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!.trim(),
  };
}

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  socialProviders,
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          // If a profile doesn't already exist for this user, create a default one
          const existing = await prisma.profile.findUnique({
            where: { userId: user.id },
          });

          if (!existing) {
            await prisma.profile.create({
              data: {
                userId: user.id,
                name: user.name ?? undefined,
                email: user.email ?? undefined,
                avatar: user.image ?? undefined,
              },
            });
          }
        },
      },
    },
  },
});
