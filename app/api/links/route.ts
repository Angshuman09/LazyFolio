import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { userId, label, url } = await request.json();

    if (!userId || !url) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    const detectedType = detectType(url);

    // If custom, label is required
    if (detectedType === "CUSTOM" && !label) {
      return NextResponse.json(
        { error: "Label is required for custom links" },
        { status: 400 }
      );
    }

    const link = await prisma.links.create({
      data: {
        label: detectedType === "CUSTOM" ? label : null,
        url,
        type: detectedType,
        profileId: userId,
      },
    });

    return NextResponse.json(link, { status: 201 });
  } catch (error) {
    console.log("Error in POST /api/links:", error);
    return NextResponse.json(
      { error: "Failed to create link" },
      { status: 500 }
    );
  }
}

// Better: restrict return type
type LinkType = "GITHUB" | "INSTAGRAM" | "X" | "LINKEDIN" | "CUSTOM";

function detectType(url: string): LinkType {
  if (url.includes("github.com")) return "GITHUB";
  if (url.includes("instagram.com")) return "INSTAGRAM";
  if (url.includes("x.com") || url.includes("twitter.com")) return "X";
  if (url.includes("linkedin.com")) return "LINKEDIN";
  return "CUSTOM";
}