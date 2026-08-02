import { headers } from "next/headers";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function verifySession() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    return {
      errorResponse: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
      session: null,
    };
  }
  return { errorResponse: null, session };
}

export async function verifySessionAndProfile() {
  const { errorResponse, session } = await verifySession();
  if (errorResponse || !session) {
    return { errorResponse, session: null, profile: null };
  }

  const profile = await prisma.profile.findUnique({
    where: { userId: session.user.id },
    select: { id: true, username: true },
  });

  if (!profile) {
    return {
      errorResponse: NextResponse.json({ error: "Profile not found" }, { status: 404 }),
      session,
      profile: null,
    };
  }

  return { errorResponse: null, session, profile };
}
