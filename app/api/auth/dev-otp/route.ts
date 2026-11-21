import { NextRequest, NextResponse } from "next/server";
import { devOtpStore } from "@/lib/email/email-service";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  // Only available in development or when explicitly enabled
  const isDev =
    process.env.NODE_ENV !== "production" ||
    process.env.NEXT_PUBLIC_ENABLE_DEV_LOGIN === "true";

  if (!isDev) {
    return NextResponse.json(
      { error: "Dev OTP lookup is disabled in production" },
      { status: 403 }
    );
  }

  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email")?.trim().toLowerCase();

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  // 1. Check in-memory store
  const stored = devOtpStore.get(email);
  if (stored && Date.now() <= stored.expiresAt) {
    return NextResponse.json({
      otp: stored.otp,
      type: stored.type,
      expiresInSeconds: Math.max(0, Math.round((stored.expiresAt - Date.now()) / 1000)),
    });
  }

  // 2. Fallback to database verification record
  try {
    const dbRecord = await prisma.verification.findFirst({
      where: {
        identifier: { contains: email },
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: "desc" },
    });

    if (dbRecord) {
      // Value is stored as "123456:attempts"
      const rawOtp = dbRecord.value.split(":")[0];
      const type = dbRecord.identifier.includes("forget-password")
        ? "forget-password"
        : "sign-in";

      return NextResponse.json({
        otp: rawOtp,
        type,
        expiresInSeconds: Math.max(
          0,
          Math.round((dbRecord.expiresAt.getTime() - Date.now()) / 1000)
        ),
      });
    }
  } catch (err) {
    console.error("[dev-otp] Database lookup error:", err);
  }

  return NextResponse.json(
    { error: "No active OTP found for this email" },
    { status: 404 }
  );
}
