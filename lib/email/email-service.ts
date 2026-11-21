import { Resend } from "resend";
import nodemailer from "nodemailer";

export interface SendOtpEmailParams {
  to: string;
  otp: string;
  type: "sign-in" | "email-verification" | "forget-password" | "change-email";
}

// In-memory store for development OTP lookup across Next.js workers/routes
const globalForDevOtp = globalThis as unknown as {
  devOtpStore?: Map<string, { otp: string; expiresAt: number; type: string }>;
};

export const devOtpStore =
  globalForDevOtp.devOtpStore ||
  new Map<string, { otp: string; expiresAt: number; type: string }>();

if (process.env.NODE_ENV !== "production") {
  globalForDevOtp.devOtpStore = devOtpStore;
}

function getResendClient() {
  const key = process.env.RESEND_API_KEY?.trim();
  if (!key) return null;
  return new Resend(key);
}

export async function sendOtpEmail({ to, otp, type }: SendOtpEmailParams) {
  const normalizedEmail = to.trim().toLowerCase();
  const resend = getResendClient();

  // Save to devOtpStore for dev helper/inspection
  devOtpStore.set(normalizedEmail, {
    otp,
    expiresAt: Date.now() + 5 * 60 * 1000,
    type,
  });

  const subjectMap: Record<SendOtpEmailParams["type"], string> = {
    "forget-password": `Reset your password - Verification Code: ${otp}`,
    "sign-in": `Your sign-in code: ${otp}`,
    "email-verification": `Verify your email: ${otp}`,
    "change-email": `Confirm your email change: ${otp}`,
  };

  const titleMap: Record<SendOtpEmailParams["type"], string> = {
    "forget-password": "Reset Your Password",
    "sign-in": "Your Sign-In Code",
    "email-verification": "Verify Your Email Address",
    "change-email": "Confirm Email Change",
  };

  const actionTextMap: Record<SendOtpEmailParams["type"], string> = {
    "forget-password":
      "We received a request to reset your Lazyfolio password. Enter this verification code to proceed:",
    "sign-in":
      "Enter this one-time code to complete your sign-in to Lazyfolio:",
    "email-verification":
      "Enter this code to verify your email address for your Lazyfolio account:",
    "change-email":
      "Enter this code to confirm your new email address for Lazyfolio:",
  };

  const subject = subjectMap[type] || `Your Lazyfolio Verification Code: ${otp}`;
  const title = titleMap[type] || "Verification Code";
  const actionText =
    actionTextMap[type] || "Use this code to complete your verification:";

  // Prominently log in console for development & debugging
  console.log(`
┌────────────────────────────────────────────────────────────┐
│  🔐 LAZYFOLIO OTP VERIFICATION CODE                        │
│  To:      ${normalizedEmail.padEnd(46)}│
│  Type:    ${type.padEnd(46)}│
│  Code:    ${otp.padEnd(46)}│
│  Expires: 5 minutes                                        │
└────────────────────────────────────────────────────────────┘
  `);

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F7F4EE; margin: 0; padding: 48px 20px; color: #1C1B19;">
  <div style="max-width: 480px; margin: 0 auto; background-color: #FFFCF6; border-radius: 20px; padding: 40px 32px; border: 1px solid #E5DACB; box-shadow: 0 4px 24px rgba(0,0,0,0.04);">
    <div style="text-align: center; margin-bottom: 28px;">
      <div style="display: inline-block; width: 44px; height: 44px; border-radius: 12px; background-color: #1C1B19; color: #ffffff; line-height: 44px; font-size: 20px; font-weight: bold; margin-bottom: 12px;">
        L<span style="color: #E08A62;">.</span>
      </div>
      <h1 style="color: #1C1B19; font-size: 24px; font-weight: 700; margin: 8px 0; letter-spacing: -0.02em;">${title}</h1>
      <p style="color: #6B645B; font-size: 14px; margin: 0; line-height: 1.6;">${actionText}</p>
    </div>
    
    <div style="background-color: #F7F4EE; border: 1px solid #E5DACB; border-radius: 14px; padding: 22px; text-align: center; margin: 28px 0;">
      <div style="font-size: 36px; font-weight: 800; letter-spacing: 0.35em; color: #B5542E; padding-left: 0.35em; font-family: ui-monospace, Menlo, Monaco, Consolas, monospace;">
        ${otp}
      </div>
    </div>

    <p style="color: #82786E; font-size: 13px; line-height: 1.6; text-align: center; margin: 20px 0 0 0;">
      This code expires in <strong>5 minutes</strong>. If you did not make this request, you can safely ignore this email.
    </p>

    <div style="margin-top: 36px; padding-top: 24px; border-top: 1px solid #E5DACB; text-align: center;">
      <p style="color: #8F8479; font-size: 12px; margin: 0;">
        Lazyfolio &bull; Make the internet know you exist.
      </p>
    </div>
  </div>
</body>
</html>
  `;

  // 1. Send via official Resend SDK
  if (resend) {
    try {
      const fromEmail =
        process.env.EMAIL_FROM?.trim() || "Lazyfolio <onboarding@resend.dev>";
      const { data, error } = await resend.emails.send({
        from: fromEmail,
        to: [normalizedEmail],
        subject,
        html: htmlContent,
      });

      if (error) {
        console.error("[Resend Error]:", error);
      } else {
        console.log(`[Resend Success] Email sent to ${normalizedEmail} (ID: ${data?.id})`);
        return;
      }
    } catch (err) {
      console.error("[Resend Exception]:", err);
    }
  }

  // 2. Fallback: SMTP if configured
  const smtpHost = process.env.SMTP_HOST;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASSWORD || process.env.SMTP_PASS;

  if (smtpHost && smtpUser && smtpPass) {
    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: Number(process.env.SMTP_PORT) || 587,
        secure:
          process.env.SMTP_SECURE === "true" ||
          Number(process.env.SMTP_PORT) === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      await transporter.sendMail({
        from: process.env.EMAIL_FROM || `"Lazyfolio" <${smtpUser}>`,
        to: normalizedEmail,
        subject,
        html: htmlContent,
      });

      console.log(`[SMTP Success] Email sent to ${normalizedEmail}`);
      return;
    } catch (err) {
      console.error("[SMTP Error]:", err);
    }
  }
}
