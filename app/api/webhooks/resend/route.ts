import { NextRequest, NextResponse } from "next/server";
import { Webhook } from "svix";

export async function POST(req: NextRequest) {
  const webhookSecret = process.env.RESEND_WEBHOOK_SECRET?.trim();

  try {
    const rawBody = await req.text();

    // Verify webhook signature if secret is provided
    if (webhookSecret) {
      const svixId = req.headers.get("svix-id");
      const svixTimestamp = req.headers.get("svix-timestamp");
      const svixSignature = req.headers.get("svix-signature");

      if (!svixId || !svixTimestamp || !svixSignature) {
        return NextResponse.json(
          { error: "Missing svix signature headers" },
          { status: 400 }
        );
      }

      const wh = new Webhook(webhookSecret);
      try {
        wh.verify(rawBody, {
          "svix-id": svixId,
          "svix-timestamp": svixTimestamp,
          "svix-signature": svixSignature,
        });
      } catch (err) {
        console.error("[Resend Webhook] Signature verification failed:", err);
        return NextResponse.json(
          { error: "Invalid webhook signature" },
          { status: 400 }
        );
      }
    }

    const payload = JSON.parse(rawBody);
    console.log(`[Resend Webhook Event]: ${payload.type}`, {
      emailId: payload.data?.email_id,
      to: payload.data?.to,
      createdAt: payload.data?.created_at,
    });

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("[Resend Webhook] Error processing event:", err);
    return NextResponse.json(
      { error: "Webhook processing error" },
      { status: 500 }
    );
  }
}
